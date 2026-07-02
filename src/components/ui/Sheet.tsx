import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
}

/**
 * Global overlay primitive: bottom sheet on mobile, centered dialog on
 * desktop. Rendered in a portal at document root so ancestor transforms
 * (framer-motion layout cards) can never break its fixed positioning.
 * Backdrop dims + blurs everything; the panel is a solid --surface-2.
 */
export function Sheet({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6"
          style={{ zIndex: 'var(--z-modal)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={onClose}
          />
          <motion.div
            className="surface-modal relative max-h-[85vh] w-full max-w-md overflow-y-auto !rounded-b-none p-6 sm:!rounded-card"
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-chip bg-white/15 sm:hidden" />
            {title && (
              <div className="mb-6 flex items-start justify-between gap-3">
                <h3 className="font-display text-lg uppercase tracking-wide text-body">{title}</h3>
                <button
                  className="hidden rounded-chip border border-line px-2 py-0.5 text-xs text-muted hover:text-body sm:block"
                  onClick={onClose}
                  aria-label="Close"
                >
                  ESC
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
