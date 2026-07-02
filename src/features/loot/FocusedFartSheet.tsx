import { useState } from 'react'
import { Sheet } from '@/components/ui/Sheet'
import type { FormatKey, RollFilters } from '@/lib/types'
import { ACTIVE_DNA } from '@/lib/creatorDNA'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  onRoll: (filters: Partial<RollFilters>) => void
}

const LOCATION_TYPES = [
  'Restaurant',
  'Drive-thru',
  'Coffee shop',
  'Street / plaza',
  'Store',
  'Campus / library',
]

const EFFORTS: Array<{ key: NonNullable<RollFilters['effort']>; label: string; hint: string }> = [
  { key: 'quick', label: 'Quick hit', hint: 'film it today' },
  { key: 'medium', label: 'Standard', hint: 'a solid shoot' },
  { key: 'production', label: 'Big production', hint: 'boss-quest energy' },
]

/** "Focused Fart" — hold-to-charge targeting filters. */
export function FocusedFartSheet({ open, onClose, onRoll }: Props) {
  const [format, setFormat] = useState<FormatKey | undefined>()
  const [locationType, setLocationType] = useState<string | undefined>()
  const [effort, setEffort] = useState<RollFilters['effort']>()
  const [trendMode, setTrendMode] = useState(true)

  const chip = (active: boolean) =>
    cn(
      'rounded-chip border px-3 py-1.5 text-xs font-semibold transition-colors',
      active
        ? 'border-acid bg-acid-dim text-acid'
        : 'border-line text-muted hover:border-line-2 hover:text-body',
    )

  return (
    <Sheet open={open} onClose={onClose} title="Focused Fart 🎯">
      <div className="space-y-5">
        <div>
          <p className="hud-label mb-2">Format</p>
          <div className="flex flex-wrap gap-1.5">
            {ACTIVE_DNA.formats.map((f) => (
              <button
                key={f.key}
                className={chip(format === f.key)}
                onClick={() => setFormat(format === f.key ? undefined : f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="hud-label mb-2">Location type</p>
          <div className="flex flex-wrap gap-1.5">
            {LOCATION_TYPES.map((l) => (
              <button
                key={l}
                className={chip(locationType === l)}
                onClick={() => setLocationType(locationType === l ? undefined : l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="hud-label mb-2">Effort level</p>
          <div className="grid grid-cols-3 gap-1.5">
            {EFFORTS.map((e) => (
              <button
                key={e.key}
                className={cn(chip(effort === e.key), 'flex flex-col items-center !rounded-xl py-2.5')}
                onClick={() => setEffort(effort === e.key ? undefined : e.key)}
              >
                <span>{e.label}</span>
                <span className="text-[9px] font-normal opacity-70">{e.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3"
          onClick={() => setTrendMode((t) => !t)}
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-body">Trend Mode</p>
            <p className="text-xs text-muted">Ground ideas in live trends & real dates</p>
          </div>
          <span
            className={cn(
              'relative h-6 w-11 rounded-chip transition-colors',
              trendMode ? 'bg-acid' : 'bg-white/10',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-all',
                trendMode ? 'left-[22px]' : 'left-0.5',
              )}
            />
          </span>
        </button>

        <button
          className="btn-acid w-full !py-3 font-display text-base uppercase tracking-wide"
          onClick={() => {
            onRoll({ format, locationType, effort, trendMode })
            onClose()
          }}
        >
          RELEASE THE FART
        </button>
      </div>
    </Sheet>
  )
}
