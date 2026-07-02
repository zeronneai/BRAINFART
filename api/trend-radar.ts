/**
 * POST /api/trend-radar
 * → { briefing: TrendBriefing }
 *
 * Daily-refreshed trend briefing grounded in web search. Cached per user per
 * day in Supabase (trend_briefings) to control cost — max 1 real generation
 * per user per day.
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
} from './_lib/shared.js'

interface Briefing {
  date: string
  trends: Array<{ title: string; summary: string; why_relevant: string; source?: string }>
  upcoming_dates: Array<{ date: string; label: string; content_angle: string }>
  seasonal_alert: string
}

function validateBriefing(x: unknown, date: string): Briefing {
  const o = x as Record<string, unknown>
  const trends = Array.isArray(o?.trends) ? o.trends : []
  const dates = Array.isArray(o?.upcoming_dates) ? o.upcoming_dates : []
  if (trends.length === 0) throw new HttpError(502, 'briefing missing trends')
  return {
    date,
    trends: trends.slice(0, 5).map((t: Record<string, unknown>) => ({
      title: String(t.title ?? ''),
      summary: String(t.summary ?? ''),
      why_relevant: String(t.why_relevant ?? ''),
      source: t.source ? String(t.source) : undefined,
    })),
    upcoming_dates: dates.slice(0, 6).map((d: Record<string, unknown>) => ({
      date: String(d.date ?? date),
      label: String(d.label ?? ''),
      content_angle: String(d.content_angle ?? ''),
    })),
    seasonal_alert: String(o.seasonal_alert ?? ''),
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  try {
    const today = new Date().toISOString().slice(0, 10)
    const admin = supabaseAdmin()
    const userId = await userIdFromRequest(req)

    // 1x/day cache
    if (admin && userId) {
      const { data } = await admin
        .from('trend_briefings')
        .select('payload')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle()
      if (data?.payload) return res.status(200).json({ briefing: data.payload })
    }

    const userPrompt = `Produce today's Trend Radar briefing (today is ${today}).

Use web search to research what is ACTUALLY happening right now:
1. Current viral trends and formats in short-form video (Reels/TikTok) relevant to POV prank / street-content creators.
2. Upcoming dates, holidays, sports fixtures (especially World Cup 2026 schedule) and regional events in El Paso / Ciudad Juárez in the next 14 days.
Search before you write. Cite what you found in each item.

Respond with STRICT JSON ONLY:
{
  "trends": [5 items: {"title": string, "summary": string (what the trend is, grounded in search results), "why_relevant": string (his specific angle on it), "source": string (domain or event you found it from)}],
  "upcoming_dates": [3-6 items in the next 14 days: {"date": "YYYY-MM-DD", "label": string, "content_angle": string (a filmable angle in his voice)}],
  "seasonal_alert": string (the single most urgent seasonal opportunity, with a clear call to action, e.g. pre-filming before a big fixture)
}`

    const client = anthropic()
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 3000,
      system: dnaSystemPrompt(),
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 6 }],
      messages: [{ role: 'user', content: userPrompt }],
    })

    const briefing = validateBriefing(extractJson(textFromContent(response.content)), today)

    if (admin && userId) {
      await admin
        .from('trend_briefings')
        .upsert({ user_id: userId, date: today, payload: briefing }, { onConflict: 'user_id,date' })
    }

    return res.status(200).json({ briefing })
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500
    const message = err instanceof Error ? err.message : 'unknown error'
    console.error('[trend-radar]', message)
    return res.status(status).json({ error: message })
  }
}
