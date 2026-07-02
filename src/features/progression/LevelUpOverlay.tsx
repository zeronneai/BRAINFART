import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'

const RAYS = Array.from({ length: 14 })

export function LevelUpOverlay() {
  const pending = useGame((s) => s.pendingLevelUp)
  const dismiss = useGame((s) => s.dismissLevelUp)

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          {/* radial burst */}
          <div className="absolute inset-0 flex items-center justify-center">
            {RAYS.map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[70vmax] w-px origin-center"
                style={{
                  rotate: `${(360 / RAYS.length) * i}deg`,
                  background:
                    'linear-gradient(to top, transparent 45%, rgba(182,255,46,0.25) 50%, transparent 55%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: [0, 1, 0.5] }}
                transition={{ duration: 1.2, delay: 0.15 + i * 0.02 }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center px-6 text-center">
            <motion.p
              className="hud-label !text-acid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              LEVEL UP
            </motion.p>
            <motion.p
              className="font-display text-[26vw] leading-none text-body sm:text-[10rem]"
              style={{ textShadow: '0 0 60px rgba(182,255,46,0.5)' }}
              initial={{ scale: 2.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.2 }}
            >
              {pending.level}
            </motion.p>
            <motion.p
              className="mt-2 font-display text-2xl uppercase tracking-[0.2em] text-acid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              {pending.title}
            </motion.p>
            <motion.button
              className="btn-acid mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={dismiss}
            >
              LET'S GO
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
