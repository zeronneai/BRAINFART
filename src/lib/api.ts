/**
 * Client for the /api serverless functions. Falls back to the mock engine
 * when the backend is unreachable or unconfigured, so the app always demos.
 */

import type { Idea, IdeaScript, IdeaStatus, RollFilters, TitleKit, TrendBriefing } from './types'
import { XP_BY_DIFFICULTY } from './xp'
import { buildMockScript, mockBriefing, mockRoll } from './mock'
import { useGame } from '@/store/gameStore'
import { classByKey } from './character'
import { uid } from './utils'
import { supabase } from './supabase'

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (supabase) {
    const { data } = await supabase.auth.getSession()
    if (data.session) headers.Authorization = `Bearer ${data.session.access_token}`
  }
  return headers
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${path} failed (${res.status}): ${text.slice(0, 300)}`)
  }
  return (await res.json()) as T
}

interface RawIdea {
  title: string
  format: Idea['format']
  rarity: Idea['rarity']
  why_now: string
  location_suggestion: string
  hooks: string[]
  opening_line: string
  difficulty: Idea['difficulty']
  script?: IdeaScript | null
}

function hydrateIdea(raw: RawIdea): Idea {
  return {
    ...raw,
    id: uid('idea'),
    xp_reward: XP_BY_DIFFICULTY[raw.difficulty] ?? XP_BY_DIFFICULTY[3],
    script: raw.script ?? null,
    status: 'rolled' as IdeaStatus,
    created_at: new Date().toISOString(),
  }
}

/** Class biases the generator (P4) — read from the current profile. */
function currentClassBias(): string | undefined {
  const cls = useGame.getState().profile.creatorClass
  return cls ? classByKey(cls).promptBias : undefined
}

export interface GenerateResult {
  ideas: Idea[]
  /** true when the ideas came from the local mock engine */
  offline: boolean
}

export async function generateIdeas(
  count: number,
  filters: Partial<RollFilters>,
  recentTitles: string[],
): Promise<GenerateResult> {
  try {
    const data = await post<{ ideas: RawIdea[] }>('/api/generate-ideas', {
      count,
      filters,
      recent_titles: recentTitles.slice(0, 20),
      class_bias: currentClassBias(),
    })
    if (!Array.isArray(data.ideas) || data.ideas.length === 0) throw new Error('empty roll')
    return { ideas: data.ideas.map(hydrateIdea), offline: false }
  } catch {
    // Demo mode / backend unavailable — the show must go on.
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 600))
    return { ideas: mockRoll(count, filters), offline: true }
  }
}

export async function fetchTrendRadar(): Promise<{ briefing: TrendBriefing; offline: boolean }> {
  try {
    const data = await post<{ briefing: TrendBriefing }>('/api/trend-radar', {})
    if (!data.briefing?.trends?.length) throw new Error('empty briefing')
    return { briefing: data.briefing, offline: false }
  } catch {
    await new Promise((r) => setTimeout(r, 900))
    return { briefing: mockBriefing(), offline: true }
  }
}

/** Generate a beat sheet for an idea that lacks one. */
export async function generateScript(idea: Idea): Promise<IdeaScript> {
  try {
    const data = await post<{ script: IdeaScript }>('/api/generate-script', {
      title: idea.title,
      format: idea.format,
      location_suggestion: idea.location_suggestion,
      opening_line: idea.opening_line,
      why_now: idea.why_now,
    })
    if (!data.script?.hook) throw new Error('empty script')
    return data.script
  } catch {
    await new Promise((r) => setTimeout(r, 900))
    return buildMockScript(idea)
  }
}

export async function generateTitles(description: string): Promise<{ kit: TitleKit; offline: boolean }> {
  try {
    const data = await post<{ kit: TitleKit }>('/api/titles', { description })
    if (!data.kit?.titles?.length) throw new Error('empty kit')
    return { kit: data.kit, offline: false }
  } catch {
    await new Promise((r) => setTimeout(r, 800))
    return {
      kit: {
        titles: [
          'Yelling my order until the manager came out',
          'This employee deserves the whole tip jar',
          'POV: the most patient worker in El Paso',
          'I did NOT expect this reaction',
          'We turned a Tuesday into a movie',
        ],
        comment_baits: [
          'What business should I hit next? 👇',
          'Rate the employee\'s patience 1-10',
          'Should I bring the mariachi next time?',
        ],
        caption:
          'El Paso keeps surprising me 😭 big love to the crew for being good sports — full tip jar today 🙏 #elpaso #pov',
      },
      offline: true,
    }
  }
}
