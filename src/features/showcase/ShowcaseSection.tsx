import { motion } from 'framer-motion'
import { IdeaCard } from '@/features/loot/IdeaCard'
import { SHOWCASE_IDEAS } from '@/lib/demoShowcase'

/**
 * Demo/sales showcase: renders the hand-authored illustrative example cards so
 * you can walk Pablo through polished, on-brand ideas even while a live roll is
 * generating. Read-only by design — IdeaCard gets NO accept/bank/trash/reroll
 * handlers, so tapping only opens the detail sheet. Nothing here writes to the
 * store, grants XP, or touches the real generation path or economy.
 */
export function ShowcaseSection() {
  return (
    <section aria-label="Showcase examples">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="hud-label">Showcase examples</h2>
        <span className="rounded-chip border border-acid/40 bg-acid-dim px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-acid">
          Illustrative · not a live roll
        </span>
      </div>
      <p className="mb-4 max-w-xl text-xs text-muted/80">
        Hand-picked examples of what BRAINFART generates — one for each proven niche pattern, localized
        to El Paso. Tap any card to see the full script.
      </p>

      <div className="grid gap-3 sm:grid-cols-3 sm:items-start">
        {SHOWCASE_IDEAS.map((idea, i) => (
          <motion.div
            key={idea.id}
            className="relative"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, type: 'spring', stiffness: 240, damping: 24 }}
          >
            {/* subtle corner ribbon so a showcase card is never mistaken for a live roll */}
            <span className="pointer-events-none absolute -left-1 -top-1 z-10 rounded-chip border border-line bg-black/70 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted/90">
              Showcase
            </span>
            {/* no action handlers → display-only, cannot mutate the store/economy */}
            <IdeaCard idea={idea} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
