import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'

/** Small utility toast for confirmations ("Caption copied", "Banked"). */
export function NoticeToast() {
  const notice = useGame((s) => s.notice)
  const dismiss = useGame((s) => s.dismissNotice)

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(dismiss, 2400)
    return () => clearTimeout(t)
  }, [notice, dismiss])

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          className="fixed bottom-[calc(var(--nav-h)+20px)] left-1/2 md:bottom-8"
          style={{ zIndex: 'var(--z-toast)' }}
          initial={{ opacity: 0, x: '-50%', y: 16 }}
          animate={{ opacity: 1, x: '-50%', y: 0 }}
          exit={{ opacity: 0, x: '-50%', y: 10 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          <div className="surface-modal !rounded-chip px-4 py-2 text-sm text-body">{notice}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
