import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

/** Bottom sheet on mobile, centered dialog on desktop. */
export function Sheet({ open, onClose, title, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="glass relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto !rounded-b-none p-5 sm:!rounded-card"
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-chip bg-white/15 sm:hidden" />
            {title && (
              <h3 className="mb-4 font-display text-lg uppercase tracking-wide text-body">{title}</h3>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
