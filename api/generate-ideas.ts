/**
 * POST /api/generate-ideas
 * Body: { count?: number, filters?: RollFilters, recent_titles?: string[], geo?: {lat,lng} }
 * → { ideas: RawIdea[] }
 *
 * Calls Claude (with web search when Trend Mode is on) to roll loot-card
 * ideas in the creator's voice, validates the strict-JSON response, persists
 * to Supabase when configured, and returns the cards.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  MODEL,
  HttpError,
  anthropic,
  dnaSystemPrompt,
  extractJson,
  textFromContent,
  supabaseAdmin,
  userIdFromRequest,
  cachedTrendBlock,
} from './_lib/shared.js'
import { placesProvider } from './_lib/places.js'
import { referenceInspirationPrompt } from '../src/lib/referenceCreators.js'

/**
 * Rolls must fit the Vercel Hobby function budget. web_search is deliberately
 * NOT used here (it added 2-3 min/roll) — trend grounding comes from the
 * daily-cached Trend Radar briefing instead. 30s is ample headroom for a
 * single search-free generation and stays under Hobby's 60s ceiling.
 */
export const config = { maxDuration: 30 }

const FORMAT_KEYS = [
  'yelling_order',
  'out_of_business',
  'absurd_companion',
  'authority_wholesome',
  'stranger_challenge',
  'character_pov',
  'employee_flip',
] as const

const RARITIES = ['common', 'rare', 'epic', 'legendary'] as const
const XP: Record<number, number> = { 1: 50, 2: 90, 3: 150, 4: 240, 5: 400 }

interface RawScript {
  hook: string
  setup: string
  beats: string[]
  payoff: string
  pinned_comment: string
}

interface RawIdea {
  title: string
  format: (typeof FORMAT_KEYS)[number]
  rarity: (typeof RARITIES)[number]
  why_now: string
  location_suggestion: string
  hooks: string[]
  opening_line: string
  difficulty: number
  xp_reward?: number
  script?: RawScript | null
  /** Which niche reference pattern this idea remixed, e.g. "jaydatroll_ (repetition counter)". Null when none. */
  inspired_by?: string | null
}

function validateScript(x: unknown): RawScript | null {
  if (!x || typeof x !== 'object') return null
  const o = x as Record<string, unknown>
  if (typeof o.hook !== 'string') return null
  return {
    hook: String(o.hook).slice(0, 300),
    setup: String(o.setup ?? '').slice(0, 400),
    beats: Array.isArray(o.beats) ? o.beats.slice(0, 4).map((b) => String(b).slice(0, 200)) : [],
    payoff: String(o.payoff ?? '').slice(0, 300),
    pinned_comment: String(o.pinned_comment ?? '').slice(0, 200),
  }
}

function validateIdea(x: unknown): RawIdea {
  const o = x as Record<string, unknown>
  if (typeof o?.title !== 'string' || o.title.length === 0) throw new HttpError(502, 'idea missing title')
  const format = FORMAT_KEYS.includes(o.format as never) ? (o.format as RawIdea['format']) : 'stranger_challenge'
  const rarity = RARITIES.includes(o.rarity as never) ? (o.rarity as RawIdea['rarity']) : 'common'
  const difficulty = Math.min(5, Math.max(1, Math.round(Number(o.difficulty) || 2)))
  return {
    title: o.title.slice(0, 120),
    format,
    rarity,
    why_now: String(o.why_now ?? '').slice(0, 400),
    location_suggestion: String(o.location_suggestion ?? '').slice(0, 200),
    hooks: Array.isArray(o.hooks) ? o.hooks.slice(0, 3).map(String) : [o.title],
    opening_line: String(o.opening_line ?? '').slice(0, 300),
    difficulty,
    xp_reward: XP[difficulty],
    script: validateScript(o.script),
    inspired_by: o.inspired_by ? String(o.inspired_by).slice(0, 80) : null,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const startedAt = Date.now()
  try {
    const body = (req.body ?? {}) as {
      count?: number
      filters?: {
        format?: string
        locationType?: string
        effort?: string
        trendMode?: boolean
        trendSeed?: string
      }
      recent_titles?: string[]
      geo?: { lat: number; lng: number }
      class_bias?: string
      /** 2 DNA formats to emphasize this roll (variety rotation) */
      emphasis_formats?: string[]
    }

    const count = Math.min(5, Math.max(1, body.count ?? 3))
    const filters = body.filters ?? { trendMode: true }
    const trendMode = filters.trendMode !== false
    const recent = (body.recent_titles ?? []).slice(0, 30)
    const today = new Date().toISOString().slice(0, 10)

    // Resolve auth + admin ONCE, up front: reused for the trend cache read and
    // the persist write below.
    const admin = supabaseAdmin()
    const userId = await userIdFromRequest(req)

    // Trend grounding without a live web_search: reuse the daily-cached briefing.
    const trendBlock = trendMode ? await cachedTrendBlock(admin, userId) : null

    const places = await placesProvider.nearby({
      lat: body.geo?.lat,
      lng: body.geo?.lng,
      category: filters.locationType,
    })

    const constraints: string[] = []
    if (filters.format) constraints.push(`Every idea MUST use the format key "${filters.format}".`)
    if (filters.locationType) constraints.push(`Every idea MUST take place at this location type: ${filters.locationType}.`)
    if (filters.effort === 'quick') constraints.push('Effort level: quick hits — difficulty 1–2, filmable today with zero props.')
    if (filters.effort === 'medium') constraints.push('Effort level: standard shoots — difficulty 2–3.')
    if (filters.effort === 'production') constraints.push('Effort level: big productions — difficulty 3–5, props/crowds/coordination welcome.')
    if (filters.trendSeed) constraints.push(`PRIORITY: build the ideas around this trend/moment the creator just locked onto: "${filters.trendSeed}".`)
    if (body.class_bias) constraints.push(`CREATOR CLASS STYLE WEIGHT: ${body.class_bias}`)
    // variety rotation: emphasize 2 rotating formats so consecutive rolls
    // explore different territory (skip when a hard format filter is set)
    const emphasis = (body.emphasis_formats ?? []).filter((f) => FORMAT_KEYS.includes(f as never))
    if (!filters.format && emphasis.length > 0) {
      constraints.push(
        `VARIETY EMPHASIS: weight roughly two-thirds of this roll toward these formats — ${emphasis.join(', ')} — and deliberately avoid rehashing the formats/angles in the "recently done" list. Explore fresh territory.`,
      )
    }

    const trendGuidance = !trendMode
      ? 'Trend mode is off — lean on evergreen strengths and seasonal common sense.'
      : trendBlock
        ? `TREND MODE IS ON. Use ONLY the cached trend context below (already researched today — do not claim anything not listed here). Ground every "why_now" in one of these real items:\n\n${trendBlock}`
        : `TREND MODE IS ON, but no fresh trend cache is available right now. Do NOT invent specific trends or fake headlines. Ground "why_now" in today's date (${today}), the current season, and well-known upcoming fixtures/holidays you are confident about (e.g. World Cup 2026). Keep it honest.`

    const userPrompt = `Roll ${count} new video ideas for the creator right now (today is ${today}).

${trendGuidance}

${constraints.length > 0 ? `CONSTRAINTS:\n${constraints.map((c) => `- ${c}`).join('\n')}\n` : ''}
NEARBY QUEST LOCATIONS (use these when they fit):
${places.map((p) => `- ${p.name} (${p.category}, ${p.area})`).join('\n')}

EXCLUSION LIST — the last ${recent.length} ideas already rolled/accepted. Do NOT generate anything that repeats or closely resembles these (different bit, different angle, different location):
${recent.length > 0 ? recent.map((t) => `- ${t}`).join('\n') : '- (nothing yet)'}

Respond with STRICT JSON ONLY: an array of exactly ${count} idea objects with this shape:
[{"title": string (≤9 words, first-person present tense), "format": one of ${JSON.stringify(FORMAT_KEYS)}, "rarity": one of ${JSON.stringify(RARITIES)} (assigned by viral potential with the distribution rules), "why_now": string (1 line citing the actual trend/date/season), "location_suggestion": string (concrete business or location type, prefer the nearby list), "hooks": [3 alternative titles], "opening_line": string (the first spoken line or question), "difficulty": integer 1-5, "script": {"hook": string (exact opening line/action on camera, 0-3s), "setup": string (where to stand, what to ask, first interaction, 3-10s), "beats": [2-3 short strings for how the bit escalates], "payoff": string (the wholesome ending — tip, reveal, reaction), "pinned_comment": string (the engagement-bait question to pin)}, "inspired_by": string or null (if you remixed a niche reference pattern, name it as "handle (pattern)" e.g. "jaydatroll_ (repetition counter)" or "meta: local-business spotlight"; null if the idea is pure Pablo). This is a behind-the-scenes tag, NOT part of the voice.}]`

    // Right-sized cap: ~3 cards with scripts land near 2.5k tokens; scale with
    // count and never pay latency for a headroom we discard. (No web_search:
    // rolls are a single generation call, so this is the whole budget.)
    const maxTokens = Math.min(4096, 800 + count * 700)

    const client = anthropic()
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      // Pablo's DNA leads; the niche style-reference layer is appended as
      // subordinate inspiration (format/mechanic only, never voice).
      system: dnaSystemPrompt(undefined, [referenceInspirationPrompt()]),
      messages: [{ role: 'user', content: userPrompt }],
    })

    const ideas = extractJson<unknown[]>(textFromContent(response.content))
      .slice(0, count)
      .map(validateIdea)

    // persist when Supabase + auth are configured (RLS-equivalent scoping via user_id)
    if (admin && userId) {
      await admin.from('ideas').insert(
        ideas.map((i) => ({
          user_id: userId,
          title: i.title,
          format: i.format,
          rarity: i.rarity,
          why_now: i.why_now,
          location_suggestion: i.location_suggestion,
          hooks: i.hooks,
          opening_line: i.opening_line,
          difficulty: i.difficulty,
          xp_reward: i.xp_reward,
          script: i.script,
          status: 'rolled',
        })),
      )
    }

    console.log(
      `[generate-ideas] ok ${Date.now() - startedAt}ms count=${count} trendMode=${trendMode} cachedTrends=${trendBlock ? 'yes' : 'no'}`,
    )
    return res.status(200).json({ ideas })
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500
    const message = err instanceof Error ? err.message : 'unknown error'
    console.error(`[generate-ideas] fail ${Date.now() - startedAt}ms`, message)
    return res.status(status).json({ error: message })
  }
}
