import { useEffect, useMemo, useRef, useState } from 'react'
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
import { COPY } from '@/lib/copy'
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
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const stateOf = (id: string): SpotState => spotStates[id]?.state ?? 'suggested'

  // geolocation: center on the creator, fall back to El Paso center.
  // The async callback can resolve after the map unmounts on navigation —
  // guard against setView on a torn-down Leaflet instance (_leaflet_pos).
  useEffect(() => {
    if (!map || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!mounted.current) return
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        if (distanceKm(p, EL_PASO_CENTER) < 80) {
          setUserPos(p)
          try {
            if (map.getContainer().isConnected) map.setView(p, 12, { animate: false })
          } catch {
            /* map already unmounted */
          }
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
    try {
      map.setView([lat, lng], 13, { animate: false })
    } catch {
      /* map animating/unmounting */
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase tracking-wide text-body">{COPY.map.title}</h1>
        <span className="hud-label">{COPY.map.subtitle}</span>
      </div>

      {/* conquest stats strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: COPY.map.statSpots, value: `${totals.conquered}/${SPOTS.length}` },
          { label: COPY.map.statZones, value: totals.zonesCleared },
          { label: COPY.map.statFarthest, value: `${totals.farthest.toFixed(1)} km` },
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
                      ? 'border-[#22C55E]/50 text-[#22C55E]'
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
          // disable animations that schedule requestAnimationFrame callbacks —
          // those fire after React tears down the container on fast navigation
          // and throw `_leaflet_pos` (uncatchable by React error boundaries)
          fadeAnimation={false}
          zoomAnimation={false}
          markerZoomAnimation={false}
        >
          <TileLayer url={MAP_PROVIDER.tileUrl} attribution={MAP_PROVIDER.attribution} maxZoom={MAP_PROVIDER.maxZoom} />
          {ZONES.map((z) => {
            const stat = zoneStats.find((s) => s.key === z.key)!
            const clr = stat.total > 0 && stat.conquered === stat.total
            return (
              <Polygon
                key={z.key}
                positions={z.polygon}
                pathOptions={{
                  // tint shifts toward green as conquest % rises; gold only at 100%
                  color: clr ? 'rgba(255,197,59,0.5)' : 'rgba(34,197,94,0.28)',
                  weight: 1,
                  fillColor: clr ? '#FFC53B' : '#22C55E',
                  fillOpacity: clr ? 0.24 : 0.04 + stat.pct * 0.2,
                }}
              />
            )
          })}
          {SPOTS.map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
              icon={pinIcon(stateOf(spot.id), justConquered === spot.id)}
              eventHandlers={{ click: () => setSelected(spot) }}
            />
          ))}
        </MapContainer>
      </div>

      <p className="text-center text-xs text-muted">{COPY.map.legend}</p>

      <SpotSheet spot={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
