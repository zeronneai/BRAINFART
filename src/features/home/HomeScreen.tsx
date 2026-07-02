import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { BrainfartButton } from '@/features/loot/BrainfartButton'
import { LootReveal } from '@/features/loot/LootReveal'
import { FocusedFartSheet } from '@/features/loot/FocusedFartSheet'
import { ChallengesRail } from '@/features/challenges/ChallengesRail'
import { QuestCard } from '@/features/quests/QuestCard'
import { LoadingBrew } from '@/components/ui/LoadingBrew'
import type { RollFilters } from '@/lib/types'
import { cn, toDayKey } from '@/lib/utils'

export function HomeScreen() {
  const {
    ideas,
    lastRollIds,
    rolling,
    quests,
    roll,
    ensureDailyQuests,
    seedDemoIfFresh,
    trendSeed,
    setTrendSeed,
  } = useGame()
  const [focusOpen, setFocusOpen] = useState(false)
  const [shake, setShake] = useState(false)
  const [brewLine, setBrewLine] = useState(0)

  useEffect(() => {
    seedDemoIfFresh()
    ensureDailyQuests()
  }, [seedDemoIfFresh, ensureDailyQuests])

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
    (q) => q.type === 'daily' && q.scheduled_date === today && q.state === 'available',
  )

  const doRoll = async (filters: Partial<RollFilters>) => {
    setShake(true)
    setTimeout(() => setShake(false), 450)
    await roll(filters)
  }

  return (
    <div className={cn('space-y-12', shake && 'shaking')}>
      {/* ── THE HERO: the button, nothing competes ── */}
      <section className="flex flex-col items-center pt-6">
        <AnimatePresence>
          {trendSeed && (
            <motion.button
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex max-w-full items-center gap-2 rounded-chip border border-acid/40 bg-acid-dim px-4 py-1.5"
              onClick={() => setTrendSeed(null)}
              title="Tap to clear"
            >
              <span className="truncate text-xs font-semibold text-acid">🎯 {trendSeed}</span>
              <span className="text-xs text-acid/60">✕</span>
            </motion.button>
          )}
        </AnimatePresence>
        <BrainfartButton
          disabled={rolling}
          onRoll={() => doRoll({ trendMode: true })}
          onFocusedRoll={() => setFocusOpen(true)}
        />
        {!rolling && lastRoll.length === 0 && (
          <motion.p
            className="mt-8 text-center text-sm text-muted/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Smash it. Three ideas fall out.
          </motion.p>
        )}
      </section>

      {/* fresh loot — the direct product of pressing the button */}
      {(rolling || lastRoll.length > 0) && (
        <section>
          {rolling ? (
            <LoadingBrew line={brewLine} />
          ) : (
            <>
              <h2 className="hud-label mb-4">Fresh drops</h2>
              <LootReveal ideas={lastRoll} />
            </>
          )}
        </section>
      )}

      {/* retos rail */}
      <ChallengesRail />

      {/* today's dailies — subordinate to everything above */}
      {dailies.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="hud-label">Today's daily quests</h2>
            <span className="display-num text-xs text-muted/70">{dailies.length} open</span>
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
