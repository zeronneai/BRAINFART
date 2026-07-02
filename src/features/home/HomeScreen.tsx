import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { BrainfartButton } from '@/features/loot/BrainfartButton'
import { LootReveal } from '@/features/loot/LootReveal'
import { FocusedFartSheet } from '@/features/loot/FocusedFartSheet'
import { QuestCard } from '@/features/quests/QuestCard'
import { LoadingBrew } from '@/components/ui/LoadingBrew'
import type { RollFilters } from '@/lib/types'
import { cn, toDayKey } from '@/lib/utils'

export function HomeScreen() {
  const { ideas, lastRollIds, rolling, quests, roll, ensureDailyQuests, trendSeed, setTrendSeed } =
    useGame()
  const [focusOpen, setFocusOpen] = useState(false)
  const [shake, setShake] = useState(false)
  const [brewLine, setBrewLine] = useState(0)

  useEffect(() => {
    ensureDailyQuests()
  }, [ensureDailyQuests])

  // rotate the in-world loading copy while brewing
  useEffect(() => {
    if (!rolling) return
    const t = setInterval(() => setBrewLine((l) => l + 1), 1600)
    return () => clearInterval(t)
  }, [rolling])

  const lastRoll = useMemo(
    () =>
      lastRollIds
        .map((id) => ideas.find((i) => i.id === id))
        .filter((i): i is NonNullable<typeof i> => Boolean(i) && i!.status !== 'trashed'),
    [ideas, lastRollIds],
  )

  const today = toDayKey()
  const dailies = quests.filter(
    (q) => q.type === 'daily' && q.scheduled_date === today && q.state !== 'completed',
  )

  const doRoll = async (filters: Partial<RollFilters>) => {
    setShake(true)
    setTimeout(() => setShake(false), 450)
    await roll(filters)
  }

  return (
    <div className={cn('space-y-8', shake && 'shaking')}>
      {/* trend seed banner */}
      <AnimatePresence>
        {trendSeed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass flex items-center justify-between gap-3 border-rare/40 px-4 py-3"
          >
            <p className="text-sm text-body">
              <span className="text-rare">📡 Locked on:</span> {trendSeed}
            </p>
            <button className="text-xs text-muted hover:text-body" onClick={() => setTrendSeed(null)}>
              clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the button */}
      <section className="flex flex-col items-center pt-4">
        <motion.p
          className="hud-label mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {rolling ? 'incoming…' : trendSeed ? 'roll from this trend' : 'press for ideas'}
        </motion.p>
        <BrainfartButton
          disabled={rolling}
          onRoll={() => doRoll({ trendMode: true })}
          onFocusedRoll={() => setFocusOpen(true)}
        />
      </section>

      {/* fresh loot */}
      <section>
        {rolling ? (
          <LoadingBrew line={brewLine} />
        ) : lastRoll.length > 0 ? (
          <>
            <h2 className="hud-label mb-3">Fresh drops</h2>
            <LootReveal ideas={lastRoll} />
          </>
        ) : (
          <motion.p
            className="pulse-slow text-center text-sm text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Smash the button. Three ideas fall out. That's the whole game.
          </motion.p>
        )}
      </section>

      {/* today's dailies */}
      {dailies.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="hud-label">Today's daily quests</h2>
            <span className="display-num text-xs text-muted">{dailies.length} open</span>
          </div>
          <div className="space-y-3">
            {dailies.map((q) => (
              <QuestCard key={q.id} quest={q} />
            ))}
          </div>
        </section>
      )}

      <FocusedFartSheet open={focusOpen} onClose={() => setFocusOpen(false)} onRoll={doRoll} />
    </div>
  )
}
