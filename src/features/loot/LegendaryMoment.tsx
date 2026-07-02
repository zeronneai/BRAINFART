import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { RarityBadge } from '@/components/ui/RarityBadge'

const PARTICLES = Array.from({ length: 24 })

/** Full-screen holographic shimmer when a legendary idea drops. */
export function LegendaryMoment() {
  const idea = useGame((s) => s.legendaryDrop)
  const dismiss = useGame((s) => s.dismissLegendary)

  return (
    <AnimatePresence>
      {idea && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black/90 px-6"
          style={{ zIndex: 'var(--z-overlay)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          {/* golden particle burst */}
          {PARTICLES.map((_, i) => {
            const angle = (i / PARTICLES.length) * Math.PI * 2
            return (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{ background: i % 3 === 0 ? '#C93BFF' : '#FFC53B' }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * (120 + (i % 5) * 40),
                  y: Math.sin(angle) * (120 + (i % 5) * 40),
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
              />
            )
          })}

          <motion.div
            className="holo glass relative w-full max-w-sm p-6 text-center"
            style={{ borderColor: 'rgba(255,197,59,0.5)', boxShadow: '0 0 80px rgba(255,197,59,0.3)' }}
            initial={{ rotateY: 90, scale: 0.7 }}
            animate={{ rotateY: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.15 }}
          >
            <motion.p
              className="hud-label !text-legendary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ★ LEGENDARY DROP ★
            </motion.p>
            <motion.h2
              className="mt-3 font-display text-2xl uppercase leading-tight text-body"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              {idea.title}
            </motion.h2>
            <motion.p
              className="mt-3 text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {idea.why_now}
            </motion.p>
            <motion.div
              className="mt-4 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <RarityBadge rarity="legendary" />
              <span className="display-num text-sm text-acid">+{idea.xp_reward} XP potential</span>
            </motion.div>
            <motion.button
              className="btn-acid mt-6 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
              onClick={dismiss}
            >
              CLAIM THE MOMENT
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
