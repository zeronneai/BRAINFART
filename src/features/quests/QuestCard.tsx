import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Quest, QuestState } from '@/lib/types'
import { useGame } from '@/store/gameStore'
import { RarityBadge } from '@/components/ui/RarityBadge'
import { Stars } from '@/components/ui/Stars'
import { Sheet } from '@/components/ui/Sheet'
import { streakMultiplier } from '@/lib/xp'
import { SPOTS, ZONE_LABELS, spotById } from '@/lib/spots'
import { cn, formatDayKey } from '@/lib/utils'
import { TitleForgeSheet } from './TitleForgeSheet'
import { ShareToIG } from '@/features/share/ShareToIG'

const TYPE_LABEL: Record<Quest['type'], string> = {
  daily: 'DAILY',
  weekly: 'WEEKLY',
  boss: '☠ BOSS',
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
  const attachSpot = useGame((s) => s.attachSpot)
  const spotStates = useGame((s) => s.spotStates)
  const streak = useGame((s) => s.profile.currentStreak)
  const [claiming, setClaiming] = useState(false)
  const [postUrl, setPostUrl] = useState('')
  const [forgeOpen, setForgeOpen] = useState(false)
  const [spotPickerOpen, setSpotPickerOpen] = useState(false)

  const stepIndex = STEPS.indexOf(quest.state)
  const action = NEXT_ACTION[quest.state]
  const done = quest.state === 'completed'
  const projected = Math.round(quest.xp_reward * streakMultiplier(Math.max(1, streak + 1)))
  const spot = quest.spot_id ? spotById(quest.spot_id) : undefined

  return (
    <motion.article layout className={cn('glass p-4', done && 'opacity-70')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-chip border border-line px-2 py-0.5 text-[9px] font-bold tracking-[0.14em] text-muted">
            {TYPE_LABEL[quest.type]}
          </span>
          <RarityBadge rarity={quest.idea.rarity} />
        </div>
        <div className="flex items-center gap-2">
          <Stars value={quest.idea.difficulty} />
          <span className="display-num text-xs text-acid">+{quest.xp_reward}</span>
        </div>
      </div>

      <h3
        className={cn(
          'mt-3 font-display text-lg uppercase leading-tight text-body',
          done && 'line-through decoration-acid/60',
        )}
      >
        {quest.idea.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        {spot ? (
          <button
            className="inline-flex items-center gap-1 underline-offset-2 hover:text-body hover:underline"
            onClick={() => !done && setSpotPickerOpen(true)}
            title={done ? undefined : 'Change spot'}
          >
            📍 {spot.name} · {ZONE_LABELS[spot.zone]}
          </button>
        ) : done ? (
          <span>📍 {quest.idea.location_suggestion}</span>
        ) : (
          <button
            className="inline-flex items-center gap-1 text-acid underline-offset-2 hover:underline"
            onClick={() => setSpotPickerOpen(true)}
          >
            📍 Pin a spot on the map
          </button>
        )}
        {quest.scheduled_date && <span>🗓 {formatDayKey(quest.scheduled_date)}</span>}
      </div>

      {/* state stepper */}
      <div className="mt-4 flex items-center gap-1">
        {STEPS.slice(1).map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div
              className={cn('h-1 flex-1 rounded-chip transition-colors', i < stepIndex ? 'bg-acid' : 'bg-white/10')}
              style={i < stepIndex ? { boxShadow: '0 0 6px rgba(182,255,46,0.4)' } : undefined}
            />
          </div>
        ))}
        <span className="hud-label ml-1 !text-[8px]">{quest.state}</span>
      </div>

      {!done && (
        <div className="mt-4 flex flex-wrap gap-2">
          {action && (
            <button
              className="btn-ghost flex-1 !border-acid/40 !py-2 text-xs !text-acid"
              onClick={() => setQuestState(quest.id, action.next)}
            >
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

      {done && (
        <div className="mt-4">
          <ShareToIG quest={quest} />
        </div>
      )}

      <TitleForgeSheet open={forgeOpen} onClose={() => setForgeOpen(false)} quest={quest} />

      {/* spot picker */}
      <Sheet open={spotPickerOpen} onClose={() => setSpotPickerOpen(false)} title="Pin this quest to a spot 📍">
        <div className="space-y-1.5">
          {quest.spot_id && (
            <button
              className="btn-ghost w-full !py-2 text-xs !text-muted"
              onClick={() => {
                attachSpot(quest.id, null)
                setSpotPickerOpen(false)
              }}
            >
              Remove current spot
            </button>
          )}
          {SPOTS.filter((s) => spotStates[s.id]?.state !== 'conquered').map((s) => (
            <button
              key={s.id}
              className="flex w-full items-center justify-between rounded-xl border border-line bg-black/25 px-3 py-2.5 text-left transition-colors hover:border-acid/40"
              onClick={() => {
                attachSpot(quest.id, s.id)
                setSpotPickerOpen(false)
              }}
            >
              <span className="text-sm text-body">{s.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted">{ZONE_LABELS[s.zone]}</span>
            </button>
          ))}
        </div>
      </Sheet>
    </motion.article>
  )
}
