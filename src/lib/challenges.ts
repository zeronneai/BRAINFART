/**
 * Challenges ("Retos") — daily / weekly / zone / event challenges with
 * measurable progress computed from game activity. IDs embed the period key
 * so challenges naturally reset (a new day/week mints new IDs).
 */

import type { FormatKey, Idea, Quest, TrendBriefing } from './types'
import type { FeedbackSignal } from '@/store/gameStore'
import { FORMAT_LABELS } from './creatorDNA'
import { ZONE_LABELS, type ZoneKey } from './spots'
import { seededRng, toDayKey } from './utils'

export interface Challenge {
  id: string
  kind: 'daily' | 'weekly' | 'zone' | 'event'
  title: string
  detail: string
  xp: number
  target: number
  /** ISO timestamp for countdown chips; null = no timer */
  expiresAt: string | null
  progress: number
}

export interface ChallengeContext {
  quests: Quest[]
  ideas: Idea[]
  feedback: FeedbackSignal[]
  spotStates: Record<string, { state: string; conquered_at: string | null; zone: ZoneKey }>
  briefing: TrendBriefing | null
}

function isoWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

function startOfWeek(d = new Date()): Date {
  const out = new Date(d)
  const day = (out.getDay() + 6) % 7 // Monday = 0
  out.setDate(out.getDate() - day)
  out.setHours(0, 0, 0, 0)
  return out
}

function endOfDayISO(d = new Date()): string {
  const out = new Date(d)
  out.setHours(23, 59, 59, 0)
  return out.toISOString()
}

const completedSince = (ctx: ChallengeContext, since: Date) =>
  ctx.quests.filter((q) => q.state === 'completed' && q.completed_at && new Date(q.completed_at) >= since)

const DAILY_FLAVORS: Array<{ slug: string; title: string; detail: string }> = [
  {
    slug: 'accent',
    title: 'Order in a different accent',
    detail: 'Film today’s quest ordering in a full-commitment accent. Counts when you complete any quest today.',
  },
  {
    slug: 'whisper',
    title: 'The whisper episode',
    detail: 'Do the whole bit at a whisper. Counts when you complete any quest today.',
  },
  {
    slug: 'bilingual',
    title: 'Spanglish speedrun',
    detail: 'Switch languages mid-sentence the entire video. Counts when you complete any quest today.',
  },
  {
    slug: 'wholesome',
    title: 'Make one worker’s day',
    detail: 'End today’s video with a tip, a gift, or a compliment ambush. Counts when you complete any quest today.',
  },
]

const WEEKLY_FORMATS: FormatKey[] = [
  'yelling_order',
  'out_of_business',
  'stranger_challenge',
  'character_pov',
  'authority_wholesome',
]

const WEEKLY_ZONES: ZoneKey[] = ['downtown', 'eastside', 'westside', 'lower_valley', 'central', 'juarez', 'northeast']

export function buildChallenges(ctx: ChallengeContext): Challenge[] {
  const out: Challenge[] = []
  const today = toDayKey()
  const week = isoWeekKey()
  const weekStart = startOfWeek()
  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)

  // ── daily reto (1) — 2× flavor, refreshes daily ──
  const flavor = DAILY_FLAVORS[Math.floor(seededRng(`reto-${today}`)() * DAILY_FLAVORS.length)]
  out.push({
    id: `daily-${today}-${flavor.slug}`,
    kind: 'daily',
    title: flavor.title,
    detail: flavor.detail,
    xp: 80,
    target: 1,
    expiresAt: endOfDayISO(),
    progress: completedSince(ctx, dayStart).length,
  })

  // ── weekly retos (format + volume) ──
  const format = WEEKLY_FORMATS[Math.floor(seededRng(`wf-${week}`)() * WEEKLY_FORMATS.length)]
  out.push({
    id: `weekly-${week}-format-${format}`,
    kind: 'weekly',
    title: `Franchise week: ${FORMAT_LABELS[format]}`,
    detail: `Complete 2 "${FORMAT_LABELS[format]}" quests this week at spots you haven't hit before.`,
    xp: 250,
    target: 2,
    expiresAt: null,
    progress: completedSince(ctx, weekStart).filter((q) => q.idea.format === format).length,
  })
  out.push({
    id: `weekly-${week}-volume`,
    kind: 'weekly',
    title: 'Post 3 days this week',
    detail: 'Complete quests on 3 different days this week. Streak fuel.',
    xp: 250,
    target: 3,
    expiresAt: null,
    progress: new Set(completedSince(ctx, weekStart).map((q) => q.completed_at!.slice(0, 10))).size,
  })

  // ── zone quest (map-based weekly) ──
  const zone = WEEKLY_ZONES[Math.floor(seededRng(`wz-${week}`)() * WEEKLY_ZONES.length)]
  const zoneConquests = Object.values(ctx.spotStates).filter(
    (s) => s.zone === zone && s.conquered_at && new Date(s.conquered_at) >= weekStart,
  ).length
  out.push({
    id: `zone-${week}-${zone}`,
    kind: 'zone',
    title: `Conquer ${ZONE_LABELS[zone]}`,
    detail: `Complete quests at 2 different ${ZONE_LABELS[zone]} spots this week. Paint the map.`,
    xp: 300,
    target: 2,
    expiresAt: null,
    progress: zoneConquests,
  })

  // ── event retos from the Trend Radar (next 7 days, countdown = urgency) ──
  const now = new Date()
  const horizon = new Date(now.getTime() + 7 * 86_400_000)
  for (const d of ctx.briefing?.upcoming_dates ?? []) {
    const when = new Date(`${d.date}T23:59:59`)
    if (isNaN(when.getTime()) || when < now || when > horizon) continue
    const words = d.label
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3)
    const re = new RegExp(words.join('|') || d.label, 'i')
    out.push({
      id: `event-${d.date}-${words[0] ?? 'evt'}`,
      kind: 'event',
      title: `${d.label} special`,
      detail: d.content_angle,
      xp: 200,
      target: 1,
      expiresAt: when.toISOString(),
      progress: completedSince(ctx, now.getTime() - 3 * 86_400_000 > 0 ? new Date(now.getTime() - 3 * 86_400_000) : now).filter(
        (q) => re.test(q.idea.title) || re.test(q.idea.why_now),
      ).length,
    })
    if (out.filter((c) => c.kind === 'event').length >= 2) break
  }

  return out
}

/** ms remaining, or null */
export function countdown(expiresAt: string | null): number | null {
  if (!expiresAt) return null
  return Math.max(0, new Date(expiresAt).getTime() - Date.now())
}

export function formatCountdown(ms: number): string {
  const h = Math.floor(ms / 3_600_000)
  if (h >= 48) return `${Math.floor(h / 24)}d left`
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`
}
