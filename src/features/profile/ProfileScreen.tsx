import { motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { levelFromXP } from '@/lib/xp'
import { LevelRing } from '@/components/ui/LevelRing'
import { XPBar } from '@/components/ui/XPBar'
import { BadgeGrid } from './BadgeGrid'
import { ACTIVE_DNA } from '@/lib/creatorDNA'
import { supabase, isDemoMode } from '@/lib/supabase'

export function ProfileScreen() {
  const { profile, ideas, quests } = useGame()
  const info = levelFromXP(profile.xp)
  const completed = quests.filter((q) => q.state === 'completed').length

  const stats: Array<{ label: string; value: string | number }> = [
    { label: 'Ideas rolled', value: profile.ideasRolled },
    { label: 'Quests completed', value: completed },
    { label: 'Longest streak', value: `${profile.longestStreak}d` },
    { label: 'Legendaries', value: profile.legendariesRolled },
    { label: 'Banked ideas', value: ideas.filter((i) => i.status === 'banked').length },
    { label: 'Total XP', value: profile.xp.toLocaleString() },
  ]

  return (
    <div className="space-y-6">
      {/* identity card */}
      <motion.div
        className="glass relative overflow-hidden p-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(182,255,46,0.12), transparent 70%)' }}
        />
        <div className="flex items-center gap-4">
          <LevelRing level={info.level} progress={info.progress} size={72} />
          <div className="min-w-0">
            <h1 className="font-display text-2xl uppercase leading-none tracking-wide text-body">
              {profile.displayName}
            </h1>
            <p className="mt-1 text-sm text-muted">{ACTIVE_DNA.handle} · {ACTIVE_DNA.region.split('/')[0].trim()}</p>
            <p className="hud-label mt-1.5 !text-acid">{info.title}</p>
          </div>
        </div>
        <div className="mt-4">
          <XPBar intoLevel={info.intoLevel} needed={info.needed} />
        </div>
      </motion.div>

      {/* stats */}
      <section>
        <h2 className="hud-label mb-3">Career stats</h2>
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="glass p-3 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <p className="display-num text-xl text-body">{s.value}</p>
              <p className="hud-label mt-1 !text-[8px]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* badges */}
      <section>
        <h2 className="hud-label mb-3">Badges</h2>
        <BadgeGrid />
      </section>

      {!isDemoMode && (
        <button
          className="btn-ghost w-full !text-muted"
          onClick={() => supabase?.auth.signOut().then(() => window.location.reload())}
        >
          Sign out
        </button>
      )}

      <p className="pt-2 text-center text-[10px] text-muted/50">
        BRAINFART · built for {ACTIVE_DNA.name} by Primo AI Studio
      </p>
    </div>
  )
}
