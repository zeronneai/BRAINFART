import { motion } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'

interface Props {
  intoLevel: number
  needed: number
  compact?: boolean
}

export function XPBar({ intoLevel, needed, compact }: Props) {
  const shown = useCountUp(intoLevel)
  const pct = Math.min(100, (intoLevel / needed) * 100)
  return (
    <div className="w-full">
      <div className="relative h-2 overflow-hidden rounded-chip border border-line bg-white/5">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-chip"
          style={{
            background: 'linear-gradient(90deg, color-mix(in srgb, var(--c-acid) 55%, transparent), var(--c-acid))',
            boxShadow: '0 0 12px rgba(182,255,46,0.45)',
          }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 16 }}
        />
      </div>
      {!compact && (
        <div className="mt-1 flex justify-between">
          <span className="hud-label">XP</span>
          <span className="display-num text-[11px] text-muted">
            <span className="text-acid">{shown.toLocaleString()}</span> / {needed.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}
