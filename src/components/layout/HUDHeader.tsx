import { Link } from 'react-router-dom'
import { useGame } from '@/store/gameStore'
import { levelFromXP } from '@/lib/xp'
import { LevelRing } from '@/components/ui/LevelRing'
import { XPBar } from '@/components/ui/XPBar'
import { StreakFlame } from '@/components/ui/StreakFlame'
import { isDemoMode } from '@/lib/supabase'

export function HUDHeader() {
  const profile = useGame((s) => s.profile)
  const comboUntil = useGame((s) => s.comboUntil)
  const info = levelFromXP(profile.xp)
  const combo = comboUntil !== null && new Date(comboUntil).getTime() > Date.now()

  return (
    <header
      className={`sticky top-0 border-b border-line bg-ink/80 backdrop-blur-lg ${combo ? 'combo-hud' : ''}`}
      style={{ zIndex: 'var(--z-sticky)' }}
      title={combo ? 'COMBO active — ×1.5 XP' : undefined}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <Link to="/profile" className="shrink-0 transition-transform active:scale-95">
          <LevelRing level={info.level} progress={info.progress} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate font-display text-sm uppercase tracking-wide text-body">
              {profile.displayName}
            </span>
            <span className="hud-label !text-acid">{info.title}</span>
            {isDemoMode && (
              <span className="hud-label rounded-chip border border-line px-1.5 py-0.5 !text-[8px]">
                demo
              </span>
            )}
          </div>
          <XPBar intoLevel={info.intoLevel} needed={info.needed} compact />
        </div>
        <StreakFlame days={profile.currentStreak} freezes={profile.streakFreezes} />
      </div>
    </header>
  )
}
