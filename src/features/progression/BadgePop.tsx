import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'

export function BadgePop() {
  const badge = useGame((s) => s.badgePop)
  const dismiss = useGame((s) => s.dismissBadgePop)

  useEffect(() => {
    if (!badge) return
    const t = setTimeout(dismiss, 3400)
    return () => clearTimeout(t)
  }, [badge, dismiss])

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed bottom-24 left-1/2 z-[55] md:bottom-10"
          initial={{ opacity: 0, x: '-50%', y: 30, scale: 0.85 }}
          animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
          exit={{ opacity: 0, x: '-50%', y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <div className="glass holo flex items-center gap-3 px-5 py-3">
            <span className="text-2xl">{badge.icon}</span>
            <div>
              <p className="hud-label !text-legendary">Badge unlocked</p>
              <p className="font-display text-base uppercase tracking-wide text-body">{badge.name}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
