import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/Avatar'
import {
  ACCENTS,
  ACCESSORIES,
  CLASSES,
  DEFAULT_CHARACTER,
  HAIRS,
  HEADWEAR,
  SKIN_TONES,
  TOPS,
  type Character,
  type CreatorClass,
} from '@/lib/character'
import { COPY } from '@/lib/copy'
import { cn } from '@/lib/utils'

export interface CharacterResult {
  character: Character
  creatorClass: CreatorClass
  displayName: string
  accentPref: string
}

interface Props {
  initial?: Partial<CharacterResult>
  confirmLabel: string
  onConfirm: (r: CharacterResult) => void
  showName?: boolean
}

type SlotKey = 'base' | 'hair' | 'headwear' | 'top' | 'accessory'

const SLOTS: Array<{ key: SlotKey; label: string; count: number }> = [
  { key: 'base', label: COPY.character.slots.base, count: SKIN_TONES.length },
  { key: 'hair', label: COPY.character.slots.hair, count: HAIRS.length },
  { key: 'headwear', label: COPY.character.slots.headwear, count: HEADWEAR.length },
  { key: 'top', label: COPY.character.slots.top, count: TOPS.length },
  { key: 'accessory', label: COPY.character.slots.accessory, count: ACCESSORIES.length },
]

/** Game-character-select builder: live avatar + part cyclers + class + accent. */
export function CharacterBuilder({ initial, confirmLabel, onConfirm, showName = true }: Props) {
  const [character, setCharacter] = useState<Character>({
    ...DEFAULT_CHARACTER,
    ...initial?.character,
    aura: initial?.accentPref
      ? ACCENTS.find((a) => a.key === initial.accentPref)?.color ?? DEFAULT_CHARACTER.aura
      : initial?.character?.aura ?? DEFAULT_CHARACTER.aura,
  })
  const [name, setName] = useState(initial?.displayName ?? '')
  const [creatorClass, setCreatorClass] = useState<CreatorClass>(initial?.creatorClass ?? 'prankster')
  const [accent, setAccent] = useState(initial?.accentPref ?? 'acid')

  const cycle = (key: SlotKey, dir: 1 | -1) => {
    const slot = SLOTS.find((s) => s.key === key)!
    setCharacter((c) => ({ ...c, [key]: (c[key] + dir + slot.count) % slot.count }))
  }

  const pickAccent = (key: string) => {
    setAccent(key)
    const color = ACCENTS.find((a) => a.key === key)?.color ?? DEFAULT_CHARACTER.aura
    setCharacter((c) => ({ ...c, aura: color }))
  }

  const partLabel = (key: SlotKey): string => {
    switch (key) {
      case 'base':
        return `Tone ${character.base + 1}`
      case 'hair':
        return HAIRS[character.hair].label
      case 'headwear':
        return HEADWEAR[character.headwear]
      case 'top':
        return TOPS[character.top].label
      case 'accessory':
        return ACCESSORIES[character.accessory]
    }
  }

  return (
    <div className="space-y-6">
      {/* live preview */}
      <div className="flex justify-center">
        <motion.div
          key={JSON.stringify(character)}
          initial={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          className="rounded-full"
          style={{ boxShadow: `0 0 44px ${character.aura}55` }}
        >
          <Avatar character={character} size={150} pose="idle" />
        </motion.div>
      </div>

      {showName && (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={COPY.character.namePlaceholder}
          maxLength={24}
          className="w-full rounded-xl border border-line bg-black/30 px-4 py-2.5 text-center text-base font-semibold text-body outline-none placeholder:text-muted/60 focus:border-acid/50"
        />
      )}

      {/* part cyclers */}
      <div className="space-y-2">
        {SLOTS.map((slot) => (
          <div
            key={slot.key}
            className="flex items-center justify-between rounded-xl border border-line bg-black/20 px-2 py-2"
          >
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-body transition-colors hover:border-acid/50 hover:text-acid active:scale-90"
              onClick={() => cycle(slot.key, -1)}
              aria-label={`Previous ${slot.label}`}
            >
              ‹
            </button>
            <div className="text-center">
              <p className="hud-label !text-[8px]">{slot.label}</p>
              <p className="text-sm font-semibold text-body">{partLabel(slot.key)}</p>
            </div>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-body transition-colors hover:border-acid/50 hover:text-acid active:scale-90"
              onClick={() => cycle(slot.key, 1)}
              aria-label={`Next ${slot.label}`}
            >
              ›
            </button>
          </div>
        ))}
      </div>

      {/* accent / aura */}
      <div>
        <p className="hud-label mb-2">{COPY.character.aura}</p>
        <div className="flex gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.key}
              onClick={() => pickAccent(a.key)}
              className={cn(
                'h-9 flex-1 rounded-xl border-2 transition-transform active:scale-95',
                accent === a.key ? 'border-white/80' : 'border-transparent',
              )}
              style={{ background: a.color }}
              aria-label={a.label}
            />
          ))}
        </div>
      </div>

      {/* class */}
      <div>
        <p className="hud-label mb-2">{COPY.character.class}</p>
        <div className="grid grid-cols-2 gap-2">
          {CLASSES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCreatorClass(c.key)}
              className={cn(
                'rounded-xl border p-3 text-left transition-colors',
                creatorClass === c.key
                  ? 'border-acid bg-acid-dim'
                  : 'border-line hover:border-line-2',
              )}
            >
              <span className="text-lg">{c.icon}</span>
              <p className={cn('mt-1 text-sm font-bold', creatorClass === c.key ? 'text-acid' : 'text-body')}>
                {c.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-muted">{c.flavor}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn-acid w-full !py-3 font-display text-base uppercase tracking-wide"
        onClick={() =>
          onConfirm({ character, creatorClass, displayName: name, accentPref: accent })
        }
      >
        {confirmLabel}
      </button>
    </div>
  )
}
