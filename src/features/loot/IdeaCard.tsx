import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Idea } from '@/lib/types'
import { RARITIES } from '@/lib/rarity'
import { FORMAT_LABELS } from '@/lib/creatorDNA'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { Stars } from '@/components/ui/Stars'
import { IdeaDetailSheet } from './IdeaDetailSheet'
import { COPY } from '@/lib/copy'
import { cn } from '@/lib/utils'

interface Props {
  idea: Idea
  onAccept?: (id: string) => void
  onBank?: (id: string) => void
  onTrash?: (id: string) => void
  onReroll?: (id: string) => void
  compact?: boolean
}

export function IdeaCard({ idea, onAccept, onBank, onTrash, onReroll, compact }: Props) {
  const [detailOpen, setDetailOpen] = useState(false)
  const def = RARITIES[idea.rarity]

  return (
    <motion.article
      layout
      className={cn('glass relative overflow-hidden p-4', idea.rarity === 'legendary' && 'holo')}
      style={{
        borderColor: `color-mix(in srgb, ${def.color} 35%, transparent)`,
        boxShadow: `0 0 24px ${def.glow}`,
      }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {/* tappable body opens the production sheet */}
      <button className="block w-full text-left" onClick={() => setDetailOpen(true)}>
        <div className="flex items-start justify-between gap-2">
          <RarityBadge rarity={idea.rarity} />
          <div className="flex items-center gap-2">
            <Stars value={idea.difficulty} />
            <span className="display-num text-xs text-acid">+{idea.xp_reward} XP</span>
          </div>
        </div>

        <h3 className="mt-2.5 font-display text-xl uppercase leading-tight text-body">{idea.title}</h3>

        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {FORMAT_LABELS[idea.format]}
        </p>

        <p className="mt-2 text-sm leading-snug text-body/85">
          <span className="text-acid">{COPY.loot.whyNow}:</span> {idea.why_now}
        </p>

        <p className="mt-1.5 text-sm text-muted">
          <span className="text-body/70">📍</span> {idea.location_suggestion}
        </p>

        {!compact && (
          <span className="mt-2 inline-block text-xs font-semibold text-acid underline-offset-2 hover:underline">
            {COPY.loot.showPlaybook} →
          </span>
        )}
      </button>

      {(onAccept || onBank || onTrash || onReroll) && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {onAccept && (
            <button className="btn-acid flex-1 !py-2 text-xs" onClick={() => onAccept(idea.id)}>
              {COPY.loot.accept}
            </button>
          )}
          {onBank && (
            <button className="btn-ghost !py-2 text-xs" onClick={() => onBank(idea.id)} title="Save for later">
              {COPY.loot.bank}
            </button>
          )}
          {onReroll && (
            <button className="btn-ghost !py-2 text-xs" onClick={() => onReroll(idea.id)} title={COPY.loot.reroll}>
              🎲
            </button>
          )}
          {onTrash && (
            <button
              className="btn-ghost !py-2 text-xs !text-muted"
              onClick={() => onTrash(idea.id)}
              title={COPY.loot.trash}
            >
              ✕
            </button>
          )}
        </div>
      )}

      <IdeaDetailSheet idea={detailOpen ? idea : null} onClose={() => setDetailOpen(false)} />
    </motion.article>
  )
}
