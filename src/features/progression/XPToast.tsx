import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { COPY } from '@/lib/copy'

export function XPToast() {
  const toast = useGame((s) => s.xpToast)
  const dismiss = useGame((s) => s.dismissXPToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(dismiss, toast.label ? 3000 : 2600)
    return () => clearTimeout(t)
  }, [toast, dismiss])

  return (
    <AnimatePresence>
      {toast && (
        <>
          <motion.div
            className="fixed left-1/2 top-24 flex flex-col items-center gap-1.5"
            style={{ zIndex: 'var(--z-toast)' }}
            initial={{ opacity: 0, x: '-50%', y: -12, scale: 0.9 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {toast.label && <span className="hud-label !text-acid">{toast.label}</span>}
            <div className="glass flex items-center gap-2 px-4 py-2">
              <span className="display-num text-lg text-acid">+{toast.amount} XP</span>
              {toast.multiplier > 1 && (
                <span className="rounded-chip bg-acid-dim px-2 py-0.5 text-[10px] font-bold text-acid">
                  ×{toast.multiplier} {COPY.xp.streak}
                </span>
              )}
            </div>
          </motion.div>

          {/* XP spark flying into the top-left HUD ring */}
          <motion.span
            key={`${toast.amount}-${toast.label ?? ''}`}
            className="pointer-events-none fixed h-3 w-3 rounded-full bg-acid"
            style={{ zIndex: 'var(--z-toast)', boxShadow: '0 0 12px rgba(182,255,46,0.9)' }}
            initial={{ left: '50%', top: 120, opacity: 0 }}
            animate={{ left: 42, top: 40, opacity: [0, 1, 1, 0], scale: [1, 1.2, 0.6] }}
            transition={{ duration: 1, ease: 'easeIn', delay: 0.3 }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
