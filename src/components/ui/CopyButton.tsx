import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { copyText } from '@/lib/share'
import { useGame } from '@/store/gameStore'
import { cn } from '@/lib/utils'

interface Props {
  text: string
  label: string
  toast: string
  variant?: 'acid' | 'ghost'
  className?: string
}

/** Clipboard button with a check-morph + scale-pop micro-animation. */
export function CopyButton({ text, label, toast, variant = 'ghost', className }: Props) {
  const notify = useGame((s) => s.notify)
  const [done, setDone] = useState(false)

  const copy = async () => {
    const ok = await copyText(text)
    notify(ok ? toast : 'Copy blocked by browser — long-press to select')
    if (navigator.vibrate) navigator.vibrate(8)
    setDone(true)
    setTimeout(() => setDone(false), 1400)
  }

  return (
    <motion.button
      onClick={copy}
      className={cn(variant === 'acid' ? 'btn-acid' : 'btn-ghost', '!py-2.5 text-xs', className)}
      whileTap={{ scale: 0.92 }}
      animate={done ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.35 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            ✓ Copied
          </motion.span>
        ) : (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
