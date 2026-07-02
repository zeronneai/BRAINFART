/**
 * POST /api/places
 * Body: { lat?: number, lng?: number, category?: string }
 * → { places: Place[] }
 *
 * Nearby quest-location suggestions. Phase 1 serves curated El Paso data via
 * the PlacesProvider interface; Phase 2 swaps in Google Places / Foursquare
 * behind the same interface without touching the client.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { placesProvider } from './_lib/places'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const body = (req.body ?? {}) as { lat?: number; lng?: number; category?: string }
  const places = await placesProvider.nearby(body)
  return res.status(200).json({ places })
}
