import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Idea } from '@/lib/types'
import { RARITIES } from '@/lib/rarity'
import { FORMAT_LABELS } from '@/lib/creatorDNA'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { Stars } from '@/components/ui/Stars'
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
  const [expanded, setExpanded] = useState(false)
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
      <div className="flex items-start justify-between gap-2">
        <RarityBadge rarity={idea.rarity} />
        <div className="flex items-center gap-2">
          <Stars value={idea.difficulty} />
          <span className="display-num text-xs text-acid">+{idea.xp_reward} XP</span>
        </div>
      </div>

      <h3 className="mt-2.5 font-display text-xl uppercase leading-tight text-body">
        {idea.title}
      </h3>

      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
        {FORMAT_LABELS[idea.format]}
      </p>

      <p className="mt-2 text-sm leading-snug text-body/85">
        <span className="text-acid">Why now:</span> {idea.why_now}
      </p>

      <p className="mt-1.5 text-sm text-muted">
        <span className="text-body/70">📍</span> {idea.location_suggestion}
      </p>

      {!compact && (
        <button
          className="mt-2 text-xs font-semibold text-muted underline-offset-2 hover:text-body hover:underline"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Hide the playbook' : 'Show the playbook'}
        </button>
      )}

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <div className="mt-3 rounded-xl border border-line bg-black/25 p-3">
            <p className="hud-label mb-1.5">Opening line</p>
            <p className="text-sm italic text-body/90">{idea.opening_line}</p>
            <p className="hud-label mb-1.5 mt-3">Alt hooks</p>
            <ul className="space-y-1">
              {idea.hooks.map((h) => (
                <li key={h} className="text-sm text-muted">
                  · {h}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {(onAccept || onBank || onTrash || onReroll) && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {onAccept && (
            <button className="btn-acid flex-1 !py-2 text-xs" onClick={() => onAccept(idea.id)}>
              ⚔ ACCEPT QUEST
            </button>
          )}
          {onBank && (
            <button className="btn-ghost !py-2 text-xs" onClick={() => onBank(idea.id)} title="Save for later">
              🏦 Bank
            </button>
          )}
          {onReroll && (
            <button className="btn-ghost !py-2 text-xs" onClick={() => onReroll(idea.id)} title="Roll a variant">
              🎲
            </button>
          )}
          {onTrash && (
            <button
              className="btn-ghost !py-2 text-xs !text-muted"
              onClick={() => onTrash(idea.id)}
              title="Not my style — teaches the generator"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </motion.article>
  )
}
