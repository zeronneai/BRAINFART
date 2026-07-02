import { motion } from 'framer-motion'

interface Props {
  level: number
  progress: number // 0..1
  size?: number
}

export function LevelRing({ level, progress, size = 52 }: Props) {
  const stroke = 3
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="hud-label !text-[7px] !tracking-[0.2em]">LV</span>
        <span className="display-num -mt-0.5 text-base leading-none text-body">{level}</span>
      </div>
    </div>
  )
}
