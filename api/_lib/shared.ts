/**
 * Shared plumbing for the /api serverless functions: Anthropic client,
 * robust JSON extraction, Supabase admin client, and prompt building from
 * the creator DNA (the white-label seam).
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { VercelRequest } from '@vercel/node'
import { ACTIVE_DNA, type CreatorDNA } from '../../src/lib/creatorDNA.js'

export const MODEL = 'claude-sonnet-4-6'

export function anthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new HttpError(503, 'ANTHROPIC_API_KEY is not configured')
  return new Anthropic({ apiKey })
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

/** Service-role client for server-side persistence (bypasses RLS, scoped manually). */
export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
}

/** Resolve the authenticated user id from the Supabase JWT, if any. */
export async function userIdFromRequest(req: VercelRequest): Promise<string | null> {
  const admin = supabaseAdmin()
  const auth = req.headers.authorization
  if (!admin || !auth?.startsWith('Bearer ')) return null
  const { data } = await admin.auth.getUser(auth.slice(7))
  return data.user?.id ?? null
}

/**
 * Pull the first JSON value out of a model response that may be wrapped in
 * prose or code fences. Strict-JSON prompting plus this extractor keeps the
 * pipeline resilient.
 */
export function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : text
  const start = Math.min(
    ...['[', '{'].map((c) => {
      const i = candidate.indexOf(c)
      return i === -1 ? Number.POSITIVE_INFINITY : i
    }),
  )
  if (!Number.isFinite(start)) throw new HttpError(502, 'model returned no JSON')
  const open = candidate[start]
  const close = open === '[' ? ']' : '}'
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (ch === '\\') {
      escaped = true
      continue
    }
    if (ch === '"') inString = !inString
    if (inString) continue
    if (ch === open) depth++
    if (ch === close) {
      depth--
      if (depth === 0) {
        return JSON.parse(candidate.slice(start, i + 1)) as T
      }
    }
  }
  throw new HttpError(502, 'model returned truncated JSON')
}

export function textFromContent(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
}

/** The creator-voice system prompt shared by all generation endpoints. */
export function dnaSystemPrompt(dna: CreatorDNA = ACTIVE_DNA): string {
  const formats = dna.formats
    .map(
      (f) =>
        `- key: "${f.key}" — ${f.label}\n  What it is: ${f.description}\n  Proven examples: ${f.examples.join(' | ')}`,
    )
    .join('\n')

  return `You are the content-ideation engine inside BRAINFART, a gamified idea app built for one specific creator. You generate ideas EXCLUSIVELY in this creator's voice and proven formats.

## THE CREATOR
${dna.name} (${dna.handle}) — ${dna.audience}. Based in ${dna.region}. Language: ${dna.language}.

## HIS 7 PROVEN FORMATS (every idea must be tagged with exactly one format key)
${formats}

## HARD RULES (non-negotiable)
${dna.toneRules.map((r) => `- ${r}`).join('\n')}

## TITLE RULES
${dna.titleRules.map((r) => `- ${r}`).join('\n')}

## CULTURAL ANCHORS (weave these in where natural)
${dna.culturalAnchors.map((a) => `- ${a}`).join('\n')}

## IDEA QUALITY BAR
- Every idea must name a concrete location TYPE (and use provided nearby businesses when given).
- The remix engine: [proven format] × [new location/business] × [current trend/season/date] × [escalation twist].
- Never suggest ideas matching or closely resembling any title in the "recently done" list you are given.
- Ideas must be REAL and current — when you have web search available, search first and ground "why_now" in what you actually find (actual trends, actual dates, actual events). Never invent trends.

## RARITY ASSIGNMENT (by viral potential, not random)
- "common" (~60%): solid franchise episodes, low novelty.
- "rare" (~25%): fresh twist on a proven format, or good timing.
- "epic" (~12%): high-novelty concept OR strong trend/date alignment.
- "legendary" (~3%): perfect storm — live trend + seasonal moment + his exact format. Reserve it.

You always respond with STRICT JSON ONLY — no prose before or after, no markdown fences.`
}
