import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/store/gameStore'
import { levelFromXP } from '@/lib/xp'
import { LevelRing } from '@/components/ui/LevelRing'
import { XPBar } from '@/components/ui/XPBar'
import { Avatar } from '@/components/Avatar'
import { Sheet } from '@/components/ui/Sheet'
import { BadgeGrid } from './BadgeGrid'
import { CharacterBuilder } from '@/features/character/CharacterBuilder'
import { ACTIVE_DNA } from '@/lib/creatorDNA'
import { ACCENTS, classByKey } from '@/lib/character'
import { COPY } from '@/lib/copy'
import { supabase, isDemoMode } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function ProfileScreen() {
  const { profile, ideas, quests } = useGame()
  const comboUntil = useGame((s) => s.comboUntil)
  const updateCharacter = useGame((s) => s.updateCharacter)
  const resetSave = useGame((s) => s.resetSave)
  const info = levelFromXP(profile.xp)
  const completed = quests.filter((q) => q.state === 'completed').length
  const combo = comboUntil !== null && new Date(comboUntil).getTime() > Date.now()

  const [editOpen, setEditOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [handle, setHandle] = useState(profile.instagramHandle)
  const cls = classByKey(profile.creatorClass)

  const stats: Array<{ label: string; value: string | number }> = [
    { label: COPY.profile.ideasRolled, value: profile.ideasRolled },
    { label: COPY.profile.questsCompleted, value: completed },
    { label: COPY.profile.longestStreak, value: `${profile.longestStreak}d` },
    { label: COPY.profile.legendaries, value: profile.legendariesRolled },
    { label: COPY.profile.bankedIdeas, value: ideas.filter((i) => i.status === 'banked').length },
    { label: COPY.profile.totalXP, value: profile.xp.toLocaleString() },
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
          style={{ background: 'radial-gradient(circle, var(--c-acid-dim), transparent 70%)' }}
        />
        <div className="flex items-center gap-4">
          {profile.character ? (
            <div
              className="shrink-0 rounded-full"
              style={{ boxShadow: `0 0 30px ${profile.character.aura}44` }}
            >
              <Avatar character={profile.character} size={84} pose="idle" comboAura={combo} />
            </div>
          ) : (
            <LevelRing level={info.level} progress={info.progress} size={72} />
          )}
          <div className="min-w-0">
            <h1 className="font-display text-2xl uppercase leading-none tracking-wide text-body">
              {profile.displayName}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {cls.icon} {cls.label} · {ACTIVE_DNA.region.split('/')[0].trim()}
            </p>
            <p className="hud-label mt-1.5 !text-acid">
              LV {info.level} · {info.title}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <XPBar intoLevel={info.intoLevel} needed={info.needed} />
        </div>
      </motion.div>

      {/* stats */}
      <section>
        <h2 className="hud-label mb-3">{COPY.profile.stats}</h2>
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
        <h2 className="hud-label mb-3">{COPY.profile.badges}</h2>
        <BadgeGrid />
      </section>

      {/* settings */}
      <section className="space-y-4">
        <h2 className="hud-label">{COPY.profile.settings}</h2>

        <button className="btn-ghost w-full" onClick={() => setEditOpen(true)}>
          {COPY.profile.editCharacter}
        </button>

        {/* accent picker — live */}
        <div className="glass p-4">
          <p className="hud-label mb-2">{COPY.profile.accentColor}</p>
          <div className="flex gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.key}
                onClick={() => updateCharacter({ accentPref: a.key })}
                className={cn(
                  'h-9 flex-1 rounded-xl border-2 transition-transform active:scale-95',
                  profile.accentPref === a.key ? 'border-white/80' : 'border-transparent',
                )}
                style={{ background: a.color }}
                aria-label={a.label}
              />
            ))}
          </div>
        </div>

        {/* IG handle */}
        <div className="glass p-4">
          <p className="hud-label mb-2">{COPY.profile.igHandle}</p>
          <div className="flex items-center gap-2">
            <span className="text-muted">@</span>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
              onBlur={() => updateCharacter({ instagramHandle: handle.trim() || profile.instagramHandle })}
              className="min-w-0 flex-1 rounded-xl border border-line bg-black/30 px-3 py-2 text-sm text-body outline-none focus:border-acid/50"
            />
          </div>
        </div>

        {!isDemoMode && (
          <button
            className="btn-ghost w-full !text-muted"
            onClick={() => supabase?.auth.signOut().then(() => window.location.reload())}
          >
            {COPY.profile.signOut}
          </button>
        )}

        {/* NEW GAME / reset */}
        <button
          className="w-full rounded-chip border border-epic/50 bg-epic/10 py-3 text-sm font-bold uppercase tracking-wider text-epic transition-colors hover:bg-epic/20"
          onClick={() => setResetOpen(true)}
        >
          {COPY.profile.newGame}
        </button>
      </section>

      <p className="pt-2 text-center text-[10px] text-muted/50">
        BRAINFART · {COPY.profile.footer}
      </p>

      {/* edit character sheet */}
      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title={COPY.character.editTitle}>
        <CharacterBuilder
          confirmLabel={COPY.character.confirm}
          initial={{
            character: profile.character ?? undefined,
            creatorClass: profile.creatorClass ?? undefined,
            displayName: profile.displayName,
            accentPref: profile.accentPref,
          }}
          onConfirm={(r) => {
            updateCharacter({
              character: r.character,
              creatorClass: r.creatorClass,
              displayName: r.displayName.trim() || profile.displayName,
              accentPref: r.accentPref,
            })
            setEditOpen(false)
          }}
        />
      </Sheet>

      {/* reset confirm */}
      <Sheet open={resetOpen} onClose={() => setResetOpen(false)} title={COPY.profile.resetTitle}>
        <div className="space-y-4">
          <p className="text-sm text-muted">{COPY.profile.resetWarning}</p>
          <button
            className="w-full rounded-chip border border-epic/50 bg-epic/15 py-3 text-sm font-bold uppercase tracking-wider text-epic"
            onClick={() => {
              resetSave()
              setResetOpen(false)
            }}
          >
            {COPY.profile.resetConfirm}
          </button>
          <button className="btn-ghost w-full" onClick={() => setResetOpen(false)}>
            {COPY.profile.resetCancel}
          </button>
        </div>
      </Sheet>
    </div>
  )
}
