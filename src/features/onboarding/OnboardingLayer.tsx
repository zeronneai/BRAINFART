import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGame } from '@/store/gameStore'
import { CharacterBuilder } from '@/features/character/CharacterBuilder'
import { COPY } from '@/lib/copy'

/**
 * Global onboarding overlays. Step 0 = character creation (blocks the app);
 * step 3 = the "your territory awaits" map intro, shown only after any
 * level-up celebration has been dismissed so the moments don't collide.
 */
export function OnboardingLayer() {
  const step = useGame((s) => s.onboardingStep)
  const pendingLevelUp = useGame((s) => s.pendingLevelUp)
  const completeCharacter = useGame((s) => s.completeCharacter)
  const advanceOnboarding = useGame((s) => s.advanceOnboarding)
  const navigate = useNavigate()

  return (
    <>
      {/* ── Step 0: character creation ── */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div
            className="fixed inset-0 overflow-y-auto bg-ink px-4 py-8"
            style={{ zIndex: 'var(--z-modal)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
          >
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 text-center">
                <p className="font-display text-3xl uppercase tracking-wide text-body">
                  BRAIN<span className="text-acid">FART</span>
                </p>
                <p className="hud-label mt-3 !text-acid">{COPY.character.title}</p>
                <p className="mt-1 text-sm text-muted">{COPY.character.subtitle}</p>
              </div>
              <CharacterBuilder
                confirmLabel={COPY.character.confirm}
                onConfirm={(r) =>
                  completeCharacter(r.character, r.creatorClass, r.displayName, r.accentPref)
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 3: map intro (after the Level 2 celebration clears) ── */}
      <AnimatePresence>
        {step === 3 && !pendingLevelUp && (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center"
            style={{ zIndex: 'var(--z-overlay)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* faux territory sweep */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 40% at 50% 45%, rgba(34,197,94,0.12), transparent 70%), repeating-linear-gradient(115deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 26px)',
              }}
              initial={{ scale: 1.4, x: -40 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
            />
            {/* scattered dim pins */}
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-full bg-muted"
                style={{
                  left: `${12 + ((i * 37) % 76)}%`,
                  top: `${22 + ((i * 53) % 56)}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              />
            ))}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-4xl">🗺️</span>
              <h2 className="mt-4 font-display text-3xl uppercase leading-tight text-body">
                {COPY.map.intro}
              </h2>
              <button
                className="btn-acid mt-8"
                onClick={() => {
                  advanceOnboarding(4)
                  navigate('/map')
                }}
              >
                {COPY.map.introCta}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
