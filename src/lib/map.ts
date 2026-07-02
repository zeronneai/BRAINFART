/**
 * MAP_PROVIDER seam. Phase 1 ships CartoDB Dark Matter (free, no API key).
 * Swapping to Mapbox GL later = add a provider entry + env key; the screen
 * only reads this config.
 */

export interface MapProviderConfig {
  name: string
  tileUrl: string
  attribution: string
  maxZoom: number
}

const PROVIDERS: Record<string, MapProviderConfig> = {
  carto_dark: {
    name: 'CartoDB Dark Matter',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
}

export const MAP_PROVIDER: MapProviderConfig = PROVIDERS.carto_dark
