import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Polygon, TileLayer } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGame } from '@/store/gameStore'
import { MAP_PROVIDER } from '@/lib/map'
import {
  EL_PASO_CENTER,
  SPOTS,
  ZONES,
  distanceKm,
  type SpotDef,
  type SpotState,
  type ZoneKey,
} from '@/lib/spots'
import { SpotSheet } from './SpotSheet'
import { cn } from '@/lib/utils'

function pinIcon(state: SpotState, justConquered: boolean) {
  return divIcon({
    className: '',
    html: `<div class="pin pin--${state}${justConquered ? ' pin--just-conquered' : ''}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

export function MapScreen() {
  const spotStates = useGame((s) => s.spotStates)
  const justConquered = useGame((s) => s.justConquered)
  const clearJustConquered = useGame((s) => s.clearJustConquered)
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [selected, setSelected] = useState<SpotDef | null>(null)
  const [userPos, setUserPos] = useState<[number, number] | null>(null)

  const stateOf = (id: string): SpotState => spotStates[id]?.state ?? 'suggested'

  // geolocation: center on the creator, fall back to El Paso center
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        // only recenter if they're actually in the borderland (~80km)
        if (distanceKm(p, EL_PASO_CENTER) < 80) {
          setUserPos(p)
          map?.setView(p, 12)
        }
      },
      () => {},
      { timeout: 4000 },
    )
  }, [map])

  // let the conquest pop animation play once, then settle
  useEffect(() => {
    if (!justConquered) return
    const t = setTimeout(clearJustConquered, 2500)
    return () => clearTimeout(t)
  }, [justConquered, clearJustConquered])

  const zoneStats = useMemo(
    () =>
      ZONES.map((z) => {
        const spots = SPOTS.filter((s) => s.zone === z.key)
        const conquered = spots.filter((s) => stateOf(s.id) === 'conquered').length
        return { ...z, total: spots.length, conquered, pct: spots.length ? conquered / spots.length : 0 }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spotStates],
  )

  const totals = useMemo(() => {
    const conquered = SPOTS.filter((s) => stateOf(s.id) === 'conquered')
    const zonesCleared = zoneStats.filter((z) => z.total > 0 && z.conquered === z.total).length
    const farthest = conquered.reduce(
      (max, s) => Math.max(max, distanceKm([s.lat, s.lng], userPos ?? EL_PASO_CENTER)),
      0,
    )
    return { conquered: conquered.length, zonesCleared, farthest }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotStates, zoneStats, userPos])

  const flyToZone = (key: ZoneKey) => {
    const spots = SPOTS.filter((s) => s.zone === key)
    if (!map || spots.length === 0) return
    const lat = spots.reduce((s, p) => s + p.lat, 0) / spots.length
    const lng = spots.reduce((s, p) => s + p.lng, 0) / spots.length
    map.flyTo([lat, lng], 13, { duration: 0.8 })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase tracking-wide text-body">El Territorio</h1>
        <span className="hud-label">paint the map</span>
      </div>

      {/* conquest stats strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Spots conquered', value: `${totals.conquered}/${SPOTS.length}` },
          { label: 'Zones cleared', value: totals.zonesCleared },
          { label: 'Farthest conquest', value: `${totals.farthest.toFixed(1)} km` },
        ].map((s) => (
          <div key={s.label} className="glass p-4 text-center">
            <p className="display-num text-xl text-body">{s.value}</p>
            <p className="hud-label mt-1 !text-[8px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* zone chips */}
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-2 pb-1">
          {zoneStats.map((z) => {
            const cleared = z.total > 0 && z.conquered === z.total
            return (
              <button
                key={z.key}
                onClick={() => flyToZone(z.key)}
                className={cn(
                  'flex items-center gap-2 rounded-chip border px-3 py-1.5 text-xs font-semibold transition-colors',
                  cleared
                    ? 'holo border-legendary/50 text-legendary'
                    : z.conquered > 0
                      ? 'border-acid/40 text-acid'
                      : 'border-line text-muted hover:text-body',
                )}
              >
                {cleared && '🏴 '}
                {z.name}
                <span className="display-num opacity-70">
                  {z.conquered}/{z.total}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* the map */}
      <div className="glass overflow-hidden !p-0" style={{ height: 'min(56vh, 480px)' }}>
        <MapContainer
          center={EL_PASO_CENTER}
          zoom={11}
          ref={setMap}
          className="h-full w-full"
          zoomControl={false}
          attributionControl
        >
          <TileLayer url={MAP_PROVIDER.tileUrl} attribution={MAP_PROVIDER.attribution} maxZoom={MAP_PROVIDER.maxZoom} />
          {ZONES.map((z) => {
            const stat = zoneStats.find((s) => s.key === z.key)!
            return (
              <Polygon
                key={z.key}
                positions={z.polygon}
                pathOptions={{
                  color: 'rgba(182,255,46,0.25)',
                  weight: 1,
                  fillColor: '#b6ff2e',
                  fillOpacity: 0.04 + stat.pct * 0.18, // tint intensifies with conquest
                }}
              />
            )
          })}
          {SPOTS.map((spot) => (
            <Marker
              key={`${spot.id}-${stateOf(spot.id)}`}
              position={[spot.lat, spot.lng]}
              icon={pinIcon(stateOf(spot.id), justConquered === spot.id)}
              eventHandlers={{ click: () => setSelected(spot) }}
            />
          ))}
        </MapContainer>
      </div>

      <p className="text-center text-xs text-muted">
        Tap a pin: dim = suggested spot, green = active quest, gold = conquered.
      </p>

      <SpotSheet spot={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
