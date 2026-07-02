import { motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { COPY } from '@/lib/copy'

/** In-world tutorial banner on Home for the roll/accept steps (1 & 2). */
export function OnboardingCoach() {
  const step = useGame((s) => s.onboardingStep)
  const advanceOnboarding = useGame((s) => s.advanceOnboarding)
  if (step !== 1 && step !== 2) return null

  const title = step === 1 ? COPY.onboarding.quest1Title : COPY.onboarding.quest2Title
  const body = step === 1 ? COPY.onboarding.quest1Body : COPY.onboarding.quest2Body

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border-acid/40 p-4"
      style={{ boxShadow: '0 0 26px rgba(182,255,46,0.12)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="hud-label !text-acid">{title}</p>
          <p className="mt-1 text-sm text-body">{body}</p>
        </div>
        <button
          className="shrink-0 text-[10px] uppercase tracking-wider text-muted hover:text-body"
          onClick={() => advanceOnboarding(4)}
        >
          {COPY.onboarding.skip}
        </button>
      </div>
    </motion.div>
  )
}
