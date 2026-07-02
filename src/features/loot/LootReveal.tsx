import { motion } from 'framer-motion'
import type { Idea } from '@/lib/types'
import { IdeaCard } from './IdeaCard'
import { useGame } from '@/store/gameStore'

/** Slot-machine style staggered reveal of freshly rolled cards. */
export function LootReveal({ ideas }: { ideas: Idea[] }) {
  const acceptQuest = useGame((s) => s.acceptQuest)
  const bankIdea = useGame((s) => s.bankIdea)
  const trashIdea = useGame((s) => s.trashIdea)
  const rerollVariant = useGame((s) => s.rerollVariant)

  return (
    <div className="grid gap-3 sm:grid-cols-3 sm:items-start">
      {ideas.map((idea, i) => (
        <motion.div
          key={idea.id}
          initial={{ opacity: 0, y: 60, rotateX: 45, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 20,
            delay: 0.35 + i * 0.28, // slot-machine cadence
          }}
          style={{ perspective: 800 }}
        >
          <IdeaCard
            idea={idea}
            onAccept={acceptQuest}
            onBank={bankIdea}
            onTrash={trashIdea}
            onReroll={rerollVariant}
          />
        </motion.div>
      ))}
    </div>
  )
}
