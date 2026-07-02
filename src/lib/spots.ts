/**
 * Conquest Map data: real El Paso / Juárez filming spots and zone polygons.
 * Static catalog lives here; per-spot conquest state lives in the game store.
 */

export type ZoneKey =
  | 'westside'
  | 'downtown'
  | 'central'
  | 'eastside'
  | 'northeast'
  | 'lower_valley'
  | 'juarez'

export interface ZoneDef {
  key: ZoneKey
  name: string
  /** rough polygon [lat, lng] for the soft tint overlay */
  polygon: Array<[number, number]>
}

export interface SpotDef {
  id: string
  name: string
  category: string
  zone: ZoneKey
  lat: number
  lng: number
}

export type SpotState = 'suggested' | 'active' | 'conquered'

export const EL_PASO_CENTER: [number, number] = [31.7719, -106.46]

export const ZONES: ZoneDef[] = [
  {
    key: 'westside',
    name: 'Westside',
    polygon: [
      [31.784, -106.6], [31.87, -106.6], [31.87, -106.5], [31.81, -106.49], [31.784, -106.52],
    ],
  },
  {
    key: 'downtown',
    name: 'Downtown',
    polygon: [
      [31.748, -106.502], [31.771, -106.502], [31.771, -106.475], [31.748, -106.475],
    ],
  },
  {
    key: 'central',
    name: 'Central',
    polygon: [
      [31.755, -106.52], [31.8, -106.52], [31.8, -106.43], [31.755, -106.43],
    ],
  },
  {
    key: 'eastside',
    name: 'Eastside',
    polygon: [
      [31.72, -106.43], [31.8, -106.43], [31.8, -106.3], [31.72, -106.3],
    ],
  },
  {
    key: 'northeast',
    name: 'Northeast',
    polygon: [
      [31.84, -106.48], [31.96, -106.48], [31.96, -106.39], [31.84, -106.39],
    ],
  },
  {
    key: 'lower_valley',
    name: 'Lower Valley',
    polygon: [
      [31.66, -106.44], [31.755, -106.44], [31.755, -106.3], [31.66, -106.3],
    ],
  },
  {
    key: 'juarez',
    name: 'Juárez',
    polygon: [
      [31.68, -106.51], [31.748, -106.51], [31.748, -106.4], [31.68, -106.4],
    ],
  },
]

export const SPOTS: SpotDef[] = [
  // downtown
  { id: 'san-jacinto', name: 'San Jacinto Plaza', category: 'Public plaza', zone: 'downtown', lat: 31.759, lng: -106.4869 },
  { id: 'sw-university-park', name: 'Southwest University Park', category: 'Ballpark', zone: 'downtown', lat: 31.7565, lng: -106.49 },
  { id: 'plaza-theatre', name: 'The Plaza Theatre', category: 'Historic theater', zone: 'downtown', lat: 31.7583, lng: -106.488 },
  { id: 'ep-street-mercado', name: 'El Paso Street mercado', category: 'Street market', zone: 'downtown', lat: 31.755, lng: -106.4855 },
  { id: 'segundo-elote', name: 'Segundo Barrio elote cart', category: 'Street food vendor', zone: 'downtown', lat: 31.7525, lng: -106.4805 },
  // central
  { id: 'utep', name: 'UTEP campus', category: 'University', zone: 'central', lat: 31.7686, lng: -106.5052 },
  { id: 'lj-cafe', name: 'L&J Cafe', category: 'Mexican restaurant', zone: 'central', lat: 31.7758, lng: -106.44 },
  { id: 'memorial-park', name: 'Memorial Park', category: 'City park', zone: 'central', lat: 31.7772, lng: -106.465 },
  { id: 'union-draft', name: 'Union Draft House', category: 'Karaoke bar', zone: 'central', lat: 31.768, lng: -106.493 },
  // westside
  { id: 'whataburger-mesa', name: 'Whataburger on Mesa', category: '24h drive-thru', zone: 'westside', lat: 31.8, lng: -106.53 },
  { id: 'topgolf', name: 'Topgolf El Paso', category: 'Entertainment venue', zone: 'westside', lat: 31.801, lng: -106.558 },
  { id: 'sunland-mall', name: 'Sunland Park Mall', category: 'Shopping mall', zone: 'westside', lat: 31.803, lng: -106.556 },
  { id: 'starbucks-mesa', name: 'Starbucks on Mesa', category: 'Coffee shop', zone: 'westside', lat: 31.79, lng: -106.525 },
  // eastside
  { id: 'cielo-vista', name: 'Cielo Vista Mall', category: 'Shopping mall', zone: 'eastside', lat: 31.777, lng: -106.383 },
  { id: 'fountains-farah', name: 'The Fountains at Farah', category: 'Outdoor mall', zone: 'eastside', lat: 31.776, lng: -106.377 },
  { id: 'album-park', name: 'Album Park', category: 'City park', zone: 'eastside', lat: 31.768, lng: -106.356 },
  { id: 'epcc-valle-verde', name: 'EPCC Valle Verde', category: 'College campus', zone: 'eastside', lat: 31.728, lng: -106.355 },
  { id: 'zaragoza-roses', name: 'Zaragoza rose vendor corner', category: 'Street vendor', zone: 'eastside', lat: 31.742, lng: -106.33 },
  // northeast
  { id: 'painted-dunes', name: 'Painted Dunes Golf Course', category: 'Golf course', zone: 'northeast', lat: 31.935, lng: -106.421 },
  { id: 'cohen', name: 'Cohen Entertainment District', category: 'Entertainment district', zone: 'northeast', lat: 31.908, lng: -106.437 },
  { id: 'dyer-strip', name: 'Dyer Street strip', category: 'Food strip', zone: 'northeast', lat: 31.87, lng: -106.423 },
  // lower valley
  { id: 'chicos-tacos', name: "Chico's Tacos on Alameda", category: 'Late-night tacos', zone: 'lower_valley', lat: 31.753, lng: -106.421 },
  { id: 'ascarate', name: 'Ascarate Park', category: 'City park', zone: 'lower_valley', lat: 31.742, lng: -106.403 },
  { id: 'ysleta-mission', name: 'Ysleta Mission', category: 'Historic mission', zone: 'lower_valley', lat: 31.691, lng: -106.326 },
  // juárez
  { id: 'av-juarez', name: 'Avenida Juárez', category: 'Border strip', zone: 'juarez', lat: 31.744, lng: -106.487 },
  { id: 'mercado-juarez', name: 'Mercado Juárez', category: 'Traditional market', zone: 'juarez', lat: 31.739, lng: -106.489 },
  { id: 'parque-central-jz', name: 'Parque Central (Juárez)', category: 'City park', zone: 'juarez', lat: 31.718, lng: -106.429 },
  { id: 'estadio-benito', name: 'Estadio Olímpico Benito Juárez', category: 'Fútbol stadium', zone: 'juarez', lat: 31.729, lng: -106.455 },
]

export const ZONE_LABELS: Record<ZoneKey, string> = Object.fromEntries(
  ZONES.map((z) => [z.key, z.name]),
) as Record<ZoneKey, string>

export function spotById(id: string): SpotDef | undefined {
  return SPOTS.find((s) => s.id === id)
}

export function distanceKm(a: [number, number], b: [number, number]): number {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}
