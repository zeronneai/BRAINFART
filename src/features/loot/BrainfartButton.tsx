import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'

const HOLD_MS = 550
const PARTICLES = Array.from({ length: 16 })

interface Props {
  disabled?: boolean
  onRoll: () => void
  onFocusedRoll: () => void
}

/**
 * The BRAINFART button. Tap = roll 3 ideas. Hold-to-charge = "Focused Fart"
 * (opens the targeting filters). Physical feedback everywhere: charge ring,
 * scale springs, particle burst, screen shake handled by the parent.
 */
export function BrainfartButton({ disabled, onRoll, onFocusedRoll }: Props) {
  const [charging, setCharging] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firedHold = useRef(false)
  const controls = useAnimationControls()

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
  }

  useEffect(() => clearHold, [])

  const handleDown = () => {
    if (disabled) return
    firedHold.current = false
    setCharging(true)
    controls.start({ scale: 0.93, transition: { duration: HOLD_MS / 1000, ease: 'linear' } })
    holdTimer.current = setTimeout(() => {
      firedHold.current = true
      setCharging(false)
      controls.start({ scale: 1, transition: { type: 'spring', stiffness: 400, damping: 15 } })
      if (navigator.vibrate) navigator.vibrate(20)
      onFocusedRoll()
    }, HOLD_MS)
  }

  const handleUp = () => {
    clearHold()
    setCharging(false)
    if (disabled || firedHold.current) return
    controls.start({
      scale: [0.9, 1.06, 1],
      transition: { type: 'spring', stiffness: 500, damping: 12 },
    })
    setBurstKey((k) => k + 1)
    if (navigator.vibrate) navigator.vibrate(10)
    onRoll()
  }

  const handleCancel = () => {
    clearHold()
    setCharging(false)
    controls.start({ scale: 1 })
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* particle burst on tap */}
      <AnimatePresence>
        {burstKey > 0 && (
          <motion.div key={burstKey} className="pointer-events-none absolute top-1/2 z-10" exit={{ opacity: 0 }}>
            {PARTICLES.map((_, i) => {
              const angle = (i / PARTICLES.length) * Math.PI * 2
              const dist = 70 + (i % 4) * 22
              return (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-acid"
                  style={{ boxShadow: '0 0 8px rgba(182,255,46,0.8)' }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* idle ambient pulse */}
      <motion.div
        className="pointer-events-none absolute top-1/2 h-44 w-44 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(182,255,46,0.18), transparent 65%)' }}
        animate={disabled ? { scale: 1, opacity: 0.4 } : { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      <motion.button
        type="button"
        animate={controls}
        disabled={disabled}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerLeave={handleCancel}
        onContextMenu={(e) => e.preventDefault()}
        className="relative z-10 flex h-40 w-40 select-none flex-col items-center justify-center rounded-full disabled:opacity-60"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #1d2410, #0d0f08 70%), var(--c-ink)',
          border: '1px solid rgba(182,255,46,0.45)',
          boxShadow:
            'inset 0 2px 12px rgba(182,255,46,0.15), 0 0 40px rgba(182,255,46,0.25), 0 14px 30px rgba(0,0,0,0.6)',
          touchAction: 'none',
        }}
        aria-label="Roll new ideas"
      >
        {/* charge ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
          <motion.circle
            cx="80"
            cy="80"
            r="74"
            fill="none"
            stroke="var(--c-acid)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 74}
            initial={{ strokeDashoffset: 2 * Math.PI * 74 }}
            animate={{
              strokeDashoffset: charging ? 0 : 2 * Math.PI * 74,
            }}
            transition={{ duration: charging ? HOLD_MS / 1000 : 0.15, ease: 'linear' }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(182,255,46,0.8))' }}
          />
        </svg>
        <span className="font-display text-2xl uppercase leading-none tracking-wide text-acid">
          BRAIN
        </span>
        <span className="font-display text-2xl uppercase leading-none tracking-wide text-body">
          FART
        </span>
        <span className="hud-label mt-2 !text-[8px]">{disabled ? 'brewing…' : 'tap · hold to aim'}</span>
      </motion.button>
    </div>
  )
}
