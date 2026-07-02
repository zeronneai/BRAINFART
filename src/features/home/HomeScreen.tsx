import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { BrainfartButton } from '@/features/loot/BrainfartButton'
import { LootReveal } from '@/features/loot/LootReveal'
import { FocusedFartSheet } from '@/features/loot/FocusedFartSheet'
import { ChallengesRail } from '@/features/challenges/ChallengesRail'
import { QuestCard } from '@/features/quests/QuestCard'
import { OnboardingCoach } from '@/features/onboarding/OnboardingCoach'
import { LoadingBrew } from '@/components/ui/LoadingBrew'
import { warmDailyTrends } from '@/lib/api'
import { COPY } from '@/lib/copy'
import type { RollFilters } from '@/lib/types'
import { cn, toDayKey } from '@/lib/utils'

export function HomeScreen() {
  const { ideas, lastRollIds, rolling, quests, roll, trendSeed, setTrendSeed } = useGame()
  const onboardingStep = useGame((s) => s.onboardingStep)
  const rollError = useGame((s) => s.rollError)
  const tutorialRoll = useGame((s) => s.tutorialRoll)
  const [focusOpen, setFocusOpen] = useState(false)
  const [shake, setShake] = useState(false)
  const [brewLine, setBrewLine] = useState(0)
  const [lastFilters, setLastFilters] = useState<Partial<RollFilters>>({ trendMode: true })

  useEffect(() => {
    if (!rolling) return
    const t = setInterval(() => setBrewLine((l) => l + 1), 1600)
    return () => clearInterval(t)
  }, [rolling])

  // Warm today's trend cache once (background) past onboarding, so search-free
  // rolls have fresh trend context to ground "why_now" in.
  useEffect(() => {
    if (onboardingStep >= 4) warmDailyTrends()
  }, [onboardingStep])

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
  const onboarding = onboardingStep < 4

  const doRoll = async (filters: Partial<RollFilters>) => {
    setLastFilters(filters)
    setShake(true)
    setTimeout(() => setShake(false), 450)
    await roll(filters)
  }

  return (
    <div className={cn('space-y-12', shake && 'shaking')}>
      {/* tutorial coach (steps 1–2) */}
      <OnboardingCoach />

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
            {COPY.home.smashIt}
          </motion.p>
        )}
      </section>

      {/* in-world error — failures are visible, never silently seeded */}
      {rollError && !rolling && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-epic/40 p-6 text-center"
          style={{ boxShadow: '0 0 30px rgba(201,59,255,0.12)' }}
        >
          <div className="text-4xl">🧠💥</div>
          <p className="mt-2 font-display text-xl uppercase tracking-wide text-body">
            {COPY.home.rollErrorTitle}
          </p>
          <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted">{COPY.home.rollErrorBody}</p>
          <button className="btn-acid mt-4" onClick={() => doRoll(lastFilters)}>
            {COPY.home.rollErrorRetry}
          </button>
        </motion.section>
      )}

      {/* fresh loot — the direct product of pressing the button */}
      {(rolling || lastRoll.length > 0) && !rollError && (
        <section>
          {rolling ? (
            <LoadingBrew line={brewLine} />
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="hud-label">{COPY.home.freshDrops}</h2>
                {tutorialRoll && (
                  <span className="rounded-chip border border-line px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted">
                    {COPY.home.tutorialFlag}
                  </span>
                )}
              </div>
              <LootReveal ideas={lastRoll} />
            </>
          )}
        </section>
      )}

      {/* challenges + dailies hidden until onboarding completes (fresh-start) */}
      {!onboarding && (
        <>
          <ChallengesRail />

          {dailies.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="hud-label">{COPY.home.dailyQuests}</h2>
                <span className="display-num text-xs text-muted/70">
                  {dailies.length} {COPY.home.open}
                </span>
              </div>
              <div className="space-y-3">
                {dailies.map((q) => (
                  <QuestCard key={q.id} quest={q} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <FocusedFartSheet open={focusOpen} onClose={() => setFocusOpen(false)} onRoll={doRoll} />
    </div>
  )
}
