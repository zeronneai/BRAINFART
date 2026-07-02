import { motion } from 'framer-motion'

const LINES = [
  'brewing brainfarts...',
  'scanning the streets of El Paso...',
  'checking what’s viral right now...',
  'warming up the mariachi...',
  'asking strangers for permission...',
]

export function LoadingBrew({ line = 0 }: { line?: number }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-acid"
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            style={{ boxShadow: '0 0 10px rgba(182,255,46,0.6)' }}
          />
        ))}
      </div>
      <motion.p
        key={line}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-sm uppercase tracking-[0.2em] text-muted"
      >
        {LINES[line % LINES.length]}
      </motion.p>
    </div>
  )
}
