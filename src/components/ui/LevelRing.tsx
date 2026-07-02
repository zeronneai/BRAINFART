import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  level: number
  progress: number // 0..1
  size?: number
  /** rendered clipped inside the ring (the avatar); level moves to a badge */
  children?: ReactNode
}

export function LevelRing({ level, progress, size = 52, children }: Props) {
  const stroke = 3
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--c-acid)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - progress) }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(182,255,46,0.5))' }}
        />
      </svg>

      {children ? (
        <>
          <div
            className="absolute overflow-hidden rounded-full"
            style={{ inset: stroke + 1 }}
          >
            {children}
          </div>
          <span
            className="display-num absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-chip border border-line bg-ink px-1.5 text-[10px] leading-tight text-body"
            style={{ boxShadow: '0 0 0 1px var(--bg)' }}
          >
            {level}
          </span>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="hud-label !text-[7px] !tracking-[0.2em]">LV</span>
          <span className="display-num -mt-0.5 text-base leading-none text-body">{level}</span>
        </div>
      )}
    </div>
  )
}
