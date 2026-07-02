import { cn } from '@/lib/utils'

export function StreakFlame({ days, freezes }: { days: number; freezes: number }) {
  const lit = days > 0
  return (
    <div
      className="flex items-center gap-1.5 rounded-chip border border-line bg-white/[0.03] px-3 py-1.5"
      title={`${days}-day posting streak${freezes > 0 ? ` · ${freezes} streak freeze${freezes > 1 ? 's' : ''} banked` : ''}`}
    >
      <svg width="14" height="16" viewBox="0 0 24 28" className={cn(lit && 'flame')} aria-hidden>
        <path
          d="M12 1c1 5-6 8-6 15a7 7 0 0 0 14 0c0-4-2-6-3-8-.5 2-1.5 3-3 3.5C15 8 15 4 12 1z"
          fill={lit ? '#FF8A3D' : 'rgba(255,255,255,0.15)'}
        />
        <path
          d="M12 12c.5 2.6-3 4-3 7a3.2 3.2 0 0 0 6.4 0c0-2.6-2-3.6-3.4-7z"
          fill={lit ? '#FFC53B' : 'rgba(255,255,255,0.08)'}
        />
      </svg>
      <span className="display-num text-sm" style={{ color: lit ? '#FFC53B' : 'var(--c-muted)' }}>
        {days}
      </span>
      {freezes > 0 && (
        <span className="display-num text-[10px] text-rare" title="Streak freezes">
          ❄{freezes}
        </span>
      )}
    </div>
  )
}
