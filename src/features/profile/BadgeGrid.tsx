import { motion } from 'framer-motion'
import { BADGES } from '@/lib/badges'
import { useGame } from '@/store/gameStore'
import { cn } from '@/lib/utils'

export function BadgeGrid() {
  const { profile, ideas, quests } = useGame()
  const ctx = { profile, ideas, quests }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {BADGES.map((badge, i) => {
        const progress = Math.min(badge.target, badge.progress(ctx))
        const unlocked = progress >= badge.target
        return (
          <motion.div
            key={badge.id}
            className={cn(
              'glass relative flex flex-col items-center gap-1 p-3 text-center',
              unlocked ? 'holo border-legendary/40' : 'opacity-70',
            )}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: unlocked ? 1 : 0.7, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            title={badge.description}
          >
            <span className={cn('text-2xl', !unlocked && 'grayscale opacity-50')}>{badge.icon}</span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-body">{badge.name}</p>
            {unlocked ? (
              <p className="hud-label !text-[8px] !text-legendary">UNLOCKED</p>
            ) : (
              <>
                <div className="h-1 w-full overflow-hidden rounded-chip bg-white/10">
                  <div
                    className="h-full rounded-chip bg-acid/70"
                    style={{ width: `${(progress / badge.target) * 100}%` }}
                  />
                </div>
                <p className="display-num text-[9px] text-muted">
                  {progress}/{badge.target}
                </p>
              </>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
