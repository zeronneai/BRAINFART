/**
 * POST /api/generate-script
 * Body: { title, format, location_suggestion, opening_line, why_now }
 * → { script: { hook, setup, beats[], payoff, pinned_comment } }
 *
 * Generates a beat sheet for an existing idea that lacks one.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  MODEL,
  HttpError,
  anthropic,
  dnaSystemPrompt,
  extractJson,
  textFromContent,
} from './_lib/shared.js'

interface Script {
  hook: string
  setup: string
  beats: string[]
  payoff: string
  pinned_comment: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  try {
    const body = (req.body ?? {}) as {
      title?: string
      format?: string
      location_suggestion?: string
      opening_line?: string
      why_now?: string
    }
    if (!body.title) throw new HttpError(400, 'title is required')

    const userPrompt = `Write the "possible script" beat sheet for this video idea, in the creator's voice.

IDEA: "${body.title}"
Format: ${body.format ?? 'n/a'}
Location: ${body.location_suggestion ?? 'n/a'}
Suggested opening line: ${body.opening_line ?? 'n/a'}
Why it works now: ${body.why_now ?? 'n/a'}

Respond with STRICT JSON ONLY:
{
  "hook": string (the exact opening line or action on camera, first 0-3 seconds),
  "setup": string (where to stand, what to ask, the first interaction, 3-10 seconds),
  "beats": [2-3 short strings describing how the bit escalates],
  "payoff": string (the wholesome ending — a tip, a reveal, a genuine reaction; everyone looks good),
  "pinned_comment": string (the engagement-bait question to pin under the video)
}`

    const client = anthropic()
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      system: dnaSystemPrompt(),
      messages: [{ role: 'user', content: userPrompt }],
    })

    const raw = extractJson<Record<string, unknown>>(textFromContent(response.content))
    if (typeof raw.hook !== 'string') throw new HttpError(502, 'model returned no script')
    const script: Script = {
      hook: String(raw.hook).slice(0, 300),
      setup: String(raw.setup ?? '').slice(0, 400),
      beats: Array.isArray(raw.beats) ? raw.beats.slice(0, 4).map((b) => String(b).slice(0, 200)) : [],
      payoff: String(raw.payoff ?? '').slice(0, 300),
      pinned_comment: String(raw.pinned_comment ?? '').slice(0, 200),
    }

    return res.status(200).json({ script })
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500
    const message = err instanceof Error ? err.message : 'unknown error'
    console.error('[generate-script]', message)
    return res.status(status).json({ error: message })
  }
}
