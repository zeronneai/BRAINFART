import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { buildChallenges, countdown, formatCountdown, type Challenge } from '@/lib/challenges'
import { spotById } from '@/lib/spots'
import { COPY } from '@/lib/copy'
import { cn } from '@/lib/utils'

const KIND_STYLE: Record<Challenge['kind'], { label: string; icon: string }> = {
  daily: { label: COPY.challenges.kinds.daily, icon: '⚡' },
  weekly: { label: COPY.challenges.kinds.weekly, icon: '📆' },
  zone: { label: COPY.challenges.kinds.zone, icon: '🗺' },
  event: { label: COPY.challenges.kinds.event, icon: '⏰' },
}

/** Horizontal challenge rail on Home — the "more game" layer. */
export function ChallengesRail() {
  const { quests, ideas, feedback, briefing, spotStates, claimedChallenges, claimChallenge, isComboActive, comboUntil } =
    useGame()
  const [, tick] = useState(0)

  // countdown chips tick once a minute
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60_000)
    return () => clearInterval(t)
  }, [])

  const challenges = useMemo(() => {
    const ctxSpotStates = Object.fromEntries(
      Object.entries(spotStates).map(([id, s]) => [
        id,
        { state: s.state, conquered_at: s.conquered_at, zone: spotById(id)?.zone ?? ('central' as const) },
      ]),
    )
    return buildChallenges({ quests, ideas, feedback, briefing, spotStates: ctxSpotStates })
  }, [quests, ideas, feedback, briefing, spotStates])

  const combo = isComboActive()

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="hud-label">{COPY.challenges.title}</h2>
        {combo && comboUntil && (
          <span className="rounded-chip border border-legendary/50 bg-legendary/10 px-2.5 py-1 text-[10px] font-bold text-legendary">
            {COPY.challenges.combo} — {formatCountdown(countdown(comboUntil) ?? 0)}
          </span>
        )}
      </div>
      <div className="-mx-4 overflow-x-auto px-4">
        <div className="flex w-max gap-3 pb-2">
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              claimed={Boolean(claimedChallenges[c.id])}
              onClaim={() => claimChallenge(c)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ChallengeCard({
  challenge,
  claimed,
  onClaim,
}: {
  challenge: Challenge
  claimed: boolean
  onClaim: () => void
}) {
  const kind = KIND_STYLE[challenge.kind]
  const done = challenge.progress >= challenge.target
  const ms = countdown(challenge.expiresAt)
  const pct = Math.min(100, (challenge.progress / challenge.target) * 100)
  const [claiming, setClaiming] = useState(false)

  const claim = () => {
    setClaiming(true)
    // let the flip play before the XP lands
    setTimeout(onClaim, 450)
  }

  return (
    <motion.article
      className={cn('glass w-64 shrink-0 p-4', claimed && 'opacity-55')}
      animate={claiming && !claimed ? { rotateY: [0, 90, 0], scale: [1, 0.96, 1] } : {}}
      transition={{ duration: 0.9 }}
      style={{ perspective: 600 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="hud-label !text-[8px]">
          {kind.icon} {kind.label}
        </span>
        {ms !== null && !claimed && (
          <span className="rounded-chip bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-body">
            {formatCountdown(ms)}
          </span>
        )}
      </div>

      <h3 className="mt-2 font-display text-base uppercase leading-tight text-body">{challenge.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs text-muted">{challenge.detail}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="display-num text-sm text-acid">+{challenge.xp} XP</span>
        <span className="display-num text-xs text-muted">
          {Math.min(challenge.progress, challenge.target)}/{challenge.target}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-chip bg-white/10">
        <motion.div
          className="h-full rounded-chip bg-acid"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          style={{ boxShadow: '0 0 8px rgba(182,255,46,0.5)' }}
        />
      </div>

      {claimed ? (
        <p className="hud-label mt-3 text-center !text-acid">{COPY.challenges.claimed}</p>
      ) : done ? (
        <button className="btn-acid mt-3 w-full !py-2 text-xs" onClick={claim}>
          {COPY.challenges.claim} {challenge.xp} XP
        </button>
      ) : (
        <p className="mt-3 text-center text-[10px] uppercase tracking-wider text-muted/70">
          {COPY.challenges.inProgress}
        </p>
      )}
    </motion.article>
  )
}
