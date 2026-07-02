import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'

const RAYS = Array.from({ length: 12 })

/** Full-screen celebration when a zone hits 100% conquest. */
export function ZoneClearedOverlay() {
  const cleared = useGame((s) => s.zoneCleared)
  const dismiss = useGame((s) => s.dismissZoneCleared)

  return (
    <AnimatePresence>
      {cleared && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black/90 px-6"
          style={{ zIndex: 'var(--z-modal)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          {RAYS.map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[70vmax] w-px origin-center"
              style={{
                rotate: `${(360 / RAYS.length) * i}deg`,
                background:
                  'linear-gradient(to top, transparent 45%, rgba(255,197,59,0.3) 50%, transparent 55%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 1, 0.5] }}
              transition={{ duration: 1.1, delay: 0.1 + i * 0.03 }}
            />
          ))}
          <div className="relative flex flex-col items-center text-center">
            <motion.span
              className="text-5xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
              transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.2 }}
            >
              🏴
            </motion.span>
            <motion.p
              className="hud-label mt-4 !text-legendary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              ZONE CLEARED
            </motion.p>
            <motion.h2
              className="mt-1 font-display text-5xl uppercase tracking-wide text-body"
              style={{ textShadow: '0 0 50px rgba(255,197,59,0.5)' }}
              initial={{ scale: 1.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.45 }}
            >
              {cleared.name}
            </motion.h2>
            <motion.p
              className="mt-3 text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Every spot conquered. The territory is yours.
            </motion.p>
            <motion.button
              className="btn-acid mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              onClick={dismiss}
            >
              PAINT THE NEXT ONE
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
