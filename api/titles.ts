/**
 * POST /api/titles
 * Body: { description: string }
 * → { kit: { titles: string[], comment_baits: string[], caption: string } }
 *
 * Paste what actually happened on camera → hooks, pinned-comment bait, and a
 * caption in the creator's engagement style.
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

interface Kit {
  titles: string[]
  comment_baits: string[]
  caption: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  try {
    const description = String((req.body as { description?: string })?.description ?? '').trim()
    if (!description) throw new HttpError(400, 'description is required')

    const userPrompt = `The creator just filmed this video:

"${description.slice(0, 2000)}"

His engagement style leans hard on pinned-comment bait (questions that make people reply, vote, or tag). Write the packaging.

Respond with STRICT JSON ONLY:
{
  "titles": [5 hook/title options, each ≤9 words, first-person present tense, in his voice],
  "comment_baits": [3 pinned-comment questions engineered to farm replies],
  "caption": string (1-2 sentence caption in his voice, warm and chaotic, with 2-4 fitting hashtags)
}`

    const client = anthropic()
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: dnaSystemPrompt(),
      messages: [{ role: 'user', content: userPrompt }],
    })

    const raw = extractJson<Record<string, unknown>>(textFromContent(response.content))
    const kit: Kit = {
      titles: Array.isArray(raw.titles) ? raw.titles.slice(0, 5).map(String) : [],
      comment_baits: Array.isArray(raw.comment_baits) ? raw.comment_baits.slice(0, 3).map(String) : [],
      caption: String(raw.caption ?? ''),
    }
    if (kit.titles.length === 0) throw new HttpError(502, 'model returned no titles')

    return res.status(200).json({ kit })
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500
    const message = err instanceof Error ? err.message : 'unknown error'
    console.error('[titles]', message)
    return res.status(status).json({ error: message })
  }
}
