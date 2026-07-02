import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { HUDHeader } from './HUDHeader'
import { NavIcon } from './NavIcon'
import { cn } from '@/lib/utils'
import { LevelUpOverlay } from '@/features/progression/LevelUpOverlay'
import { LegendaryMoment } from '@/features/loot/LegendaryMoment'
import { XPToast } from '@/features/progression/XPToast'
import { BadgePop } from '@/features/progression/BadgePop'
import { NoticeToast } from '@/components/ui/NoticeToast'
import { ZoneClearedOverlay } from '@/features/map/ZoneClearedOverlay'

const NAV = [
  { to: '/', key: 'home', label: 'Roll' },
  { to: '/quests', key: 'quests', label: 'Quests' },
  { to: '/map', key: 'map', label: 'Map' },
  { to: '/radar', key: 'radar', label: 'Radar' },
  { to: '/vault', key: 'vault', label: 'Vault' },
  { to: '/profile', key: 'profile', label: 'Profile' },
] as const

export function AppShell() {
  const location = useLocation()
  const seedDemoIfFresh = useGame((s) => s.seedDemoIfFresh)
  const ensureDailyQuests = useGame((s) => s.ensureDailyQuests)

  useEffect(() => {
    seedDemoIfFresh()
    ensureDailyQuests()
  }, [seedDemoIfFresh, ensureDailyQuests])

  return (
    <div className="bg-arena flex min-h-dvh">
      {/* desktop side rail */}
      <nav className="sticky top-0 hidden h-dvh w-52 shrink-0 flex-col border-r border-line px-3 py-6 md:flex">
        <p className="mb-8 px-3 font-display text-xl uppercase tracking-wide text-body">
          BRAIN<span className="text-acid">FART</span>
        </p>
        <div className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive ? 'bg-acid-dim text-acid' : 'text-muted hover:bg-white/5 hover:text-body',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <NavIcon name={item.key} active={isActive} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
        <p className="mt-auto px-3 text-[10px] text-muted/60">Primo AI Studio · white-label</p>
      </nav>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <HUDHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-[calc(var(--nav-h)+24px)] pt-4 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* mobile bottom tab bar */}
        <nav
          className="fixed inset-x-0 bottom-0 border-t border-line bg-ink/85 backdrop-blur-lg md:hidden"
          style={{
            height: 'calc(var(--nav-h) + env(safe-area-inset-bottom))',
            zIndex: 'var(--z-nav)',
          }}
        >
          <div className="mx-auto grid h-[var(--nav-h)] max-w-md grid-cols-6">
            {NAV.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.to === '/'}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'flex h-7 w-12 items-center justify-center rounded-chip transition-colors',
                        isActive && 'bg-acid-dim shadow-[0_0_12px_rgba(182,255,46,0.25)]',
                      )}
                    >
                      <NavIcon name={item.key} active={isActive} />
                    </span>
                    <span
                      className={cn(
                        'text-[9px] font-semibold uppercase tracking-wider',
                        isActive ? 'text-acid' : 'text-muted',
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* global game moments */}
      <NoticeToast />
      <XPToast />
      <BadgePop />
      <LegendaryMoment />
      <ZoneClearedOverlay />
      <LevelUpOverlay />
    </div>
  )
}
