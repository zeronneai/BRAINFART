/** Rarity presentation config — colors come from CSS variables (tokens.css). */

import type { Rarity } from './types'

export interface RarityDef {
  key: Rarity
  label: string
  /** CSS color value (var reference) */
  color: string
  glow: string
  /** target drop distribution, used by the mock roller */
  weight: number
}

export const RARITIES: Record<Rarity, RarityDef> = {
  common: {
    key: 'common',
    label: 'Common',
    color: 'var(--c-common)',
    glow: 'var(--glow-common)',
    weight: 60,
  },
  rare: {
    key: 'rare',
    label: 'Rare',
    color: 'var(--c-rare)',
    glow: 'var(--glow-rare)',
    weight: 25,
  },
  epic: {
    key: 'epic',
    label: 'Epic',
    color: 'var(--c-epic)',
    glow: 'var(--glow-epic)',
    weight: 12,
  },
  legendary: {
    key: 'legendary',
    label: 'Legendary',
    color: 'var(--c-legendary)',
    glow: 'var(--glow-legendary)',
    weight: 3,
  },
}

export const RARITY_ORDER: Rarity[] = ['legendary', 'epic', 'rare', 'common']

export function rollRarity(rng: () => number = Math.random): Rarity {
  const total = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0)
  let n = rng() * total
  for (const r of Object.values(RARITIES)) {
    n -= r.weight
    if (n <= 0) return r.key
  }
  return 'common'
}
