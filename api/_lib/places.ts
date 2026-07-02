/**
 * Quest-location provider. Phase 1 ships the El Paso mock; the interface is
 * the seam for plugging Google Places / Foursquare in Phase 2 (key already
 * reserved in .env.example).
 */

export interface Place {
  name: string
  category: string
  area: string
}

export interface PlacesProvider {
  nearby(opts: { lat?: number; lng?: number; category?: string }): Promise<Place[]>
}

const EL_PASO_PLACES: Place[] = [
  { name: 'L&J Cafe', category: 'Mexican restaurant', area: 'Central El Paso' },
  { name: 'Chico\'s Tacos', category: 'Late-night tacos', area: 'Alameda Ave' },
  { name: 'Whataburger on Mesa', category: '24h drive-thru', area: 'West Side' },
  { name: 'Starbucks at Cielo Vista', category: 'Coffee shop', area: 'East Side' },
  { name: 'San Jacinto Plaza', category: 'Public plaza', area: 'Downtown' },
  { name: 'El Paso Street mercado', category: 'Street market', area: 'Downtown / border' },
  { name: 'UTEP campus', category: 'University / library', area: 'West Central' },
  { name: 'Ascarate Park', category: 'City park', area: 'South Central' },
  { name: 'Cielo Vista Mall', category: 'Shopping mall', area: 'East Side' },
  { name: 'Elote cart at Segundo Barrio', category: 'Street food vendor', area: 'Segundo Barrio' },
  { name: 'Union Draft House', category: 'Karaoke bar', area: 'Downtown' },
  { name: 'Southwest University Park', category: 'Ballpark / events', area: 'Downtown' },
]

class MockElPasoProvider implements PlacesProvider {
  async nearby(opts: { category?: string }): Promise<Place[]> {
    const pool = opts.category
      ? EL_PASO_PLACES.filter((p) =>
          p.category.toLowerCase().includes(opts.category!.toLowerCase()),
        )
      : EL_PASO_PLACES
    return (pool.length > 0 ? pool : EL_PASO_PLACES).slice(0, 6)
  }
}

// Phase 2: swap in a GooglePlacesProvider gated on GOOGLE_PLACES_API_KEY.
export const placesProvider: PlacesProvider = new MockElPasoProvider()
