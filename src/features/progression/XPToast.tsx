import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'

export function XPToast() {
  const toast = useGame((s) => s.xpToast)
  const dismiss = useGame((s) => s.dismissXPToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(dismiss, 2600)
    return () => clearTimeout(t)
  }, [toast, dismiss])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed left-1/2 top-20"
          style={{ zIndex: 'var(--z-toast)' }}
          initial={{ opacity: 0, x: '-50%', y: -12, scale: 0.9 }}
          animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
          exit={{ opacity: 0, x: '-50%', y: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="glass flex items-center gap-2 px-4 py-2">
            <span className="display-num text-lg text-acid">+{toast.amount} XP</span>
            {toast.multiplier > 1 && (
              <span className="rounded-chip bg-acid-dim px-2 py-0.5 text-[10px] font-bold text-acid">
                ×{toast.multiplier} streak
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
