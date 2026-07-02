import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Quest, QuestState } from '@/lib/types'
import { useGame } from '@/store/gameStore'
import { RARITIES } from '@/lib/rarity'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { Stars } from '@/components/ui/Stars'
import { streakMultiplier } from '@/lib/xp'
import { cn, formatDayKey } from '@/lib/utils'
import { TitleForgeSheet } from './TitleForgeSheet'

const TYPE_STYLE: Record<Quest['type'], { label: string; cls: string }> = {
  daily: { label: 'DAILY', cls: 'text-common border-common/40 bg-common/10' },
  weekly: { label: 'WEEKLY', cls: 'text-rare border-rare/40 bg-rare/10' },
  boss: { label: '☠ BOSS', cls: 'text-epic border-epic/40 bg-epic/10' },
}

const STEPS: QuestState[] = ['available', 'active', 'filmed', 'posted', 'completed']

const NEXT_ACTION: Partial<Record<QuestState, { label: string; next: QuestState }>> = {
  available: { label: 'START QUEST', next: 'active' },
  active: { label: '🎥 MARK FILMED', next: 'filmed' },
  filmed: { label: '📤 MARK POSTED', next: 'posted' },
}

export function QuestCard({ quest }: { quest: Quest }) {
  const setQuestState = useGame((s) => s.setQuestState)
  const completeQuest = useGame((s) => s.completeQuest)
  const streak = useGame((s) => s.profile.currentStreak)
  const [claiming, setClaiming] = useState(false)
  const [postUrl, setPostUrl] = useState('')
  const [forgeOpen, setForgeOpen] = useState(false)

  const def = RARITIES[quest.idea.rarity]
  const type = TYPE_STYLE[quest.type]
  const stepIndex = STEPS.indexOf(quest.state)
  const action = NEXT_ACTION[quest.state]
  const done = quest.state === 'completed'
  const projected = Math.round(quest.xp_reward * streakMultiplier(Math.max(1, streak + 1)))

  return (
    <motion.article
      layout
      className={cn('glass p-4', done && 'opacity-70')}
      style={{ borderColor: `color-mix(in srgb, ${def.color} 30%, transparent)` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn('rounded-chip border px-2 py-0.5 text-[9px] font-bold tracking-[0.14em]', type.cls)}>
            {type.label}
          </span>
          <RarityBadge rarity={quest.idea.rarity} />
        </div>
        <div className="flex items-center gap-2">
          <Stars value={quest.idea.difficulty} />
          <span className="display-num text-xs text-acid">+{quest.xp_reward}</span>
        </div>
      </div>

      <h3 className={cn('mt-2 font-display text-lg uppercase leading-tight text-body', done && 'line-through decoration-acid/60')}>
        {quest.idea.title}
      </h3>
      <p className="mt-1 text-xs text-muted">
        📍 {quest.idea.location_suggestion}
        {quest.scheduled_date && (
          <span className="ml-2 text-rare">🗓 {formatDayKey(quest.scheduled_date)}</span>
        )}
      </p>

      {/* state stepper */}
      <div className="mt-3 flex items-center gap-1">
        {STEPS.slice(1).map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div
              className={cn(
                'h-1 flex-1 rounded-chip transition-colors',
                i < stepIndex ? 'bg-acid' : 'bg-white/10',
              )}
              style={i < stepIndex ? { boxShadow: '0 0 6px rgba(182,255,46,0.4)' } : undefined}
            />
          </div>
        ))}
        <span className="hud-label ml-1 !text-[8px]">{quest.state}</span>
      </div>

      {!done && (
        <div className="mt-3 flex flex-wrap gap-2">
          {action && (
            <button className="btn-ghost flex-1 !border-acid/40 !py-2 text-xs !text-acid" onClick={() => setQuestState(quest.id, action.next)}>
              {action.label}
            </button>
          )}
          {quest.state === 'posted' && !claiming && (
            <button className="btn-acid flex-1 !py-2 text-xs" onClick={() => setClaiming(true)}>
              ⚡ CLAIM {projected} XP
            </button>
          )}
          {(quest.state === 'filmed' || quest.state === 'posted') && (
            <button className="btn-ghost !py-2 text-xs" onClick={() => setForgeOpen(true)} title="Generate titles & caption">
              🪄 Titles
            </button>
          )}
        </div>
      )}

      {claiming && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
          <input
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            placeholder="Paste the post link (optional)"
            className="w-full rounded-xl border border-line bg-black/30 px-3 py-2 text-sm text-body outline-none placeholder:text-muted/60 focus:border-acid/50"
          />
          <button
            className="btn-acid mt-2 w-full !py-2 text-xs"
            onClick={() => completeQuest(quest.id, postUrl.trim() || undefined)}
          >
            CONFIRM — CLAIM XP
          </button>
        </motion.div>
      )}

      {done && quest.post_url && (
        <a
          href={quest.post_url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs text-rare underline underline-offset-2"
        >
          View post ↗
        </a>
      )}

      <TitleForgeSheet open={forgeOpen} onClose={() => setForgeOpen(false)} quest={quest} />
    </motion.article>
  )
}
