/**
 * Character system: layered 2D avatar parts (drawn as inline SVG in
 * Avatar.tsx), creator classes that flavor the UI and bias the AI
 * generator, and the curated accent palette.
 */

import type { Character, CreatorClass } from './types'

export type { Character, CreatorClass }

export const DEFAULT_CHARACTER: Character = {
  base: 2,
  hair: 1,
  headwear: 0,
  top: 0,
  accessory: 0,
  aura: '#B6FF2E',
}

export const SKIN_TONES = ['#FFD9B3', '#F2B98C', '#D99A66', '#B87A4B', '#8C5A33', '#6B4226']

export interface HairDef {
  label: string
  color: string
}
export const HAIRS: HairDef[] = [
  { label: 'None', color: 'transparent' },
  { label: 'Buzz', color: '#2A2119' },
  { label: 'Waves', color: '#171310' },
  { label: 'Curls', color: '#241A12' },
  { label: 'Spikes', color: '#101014' },
  { label: 'Flow', color: '#3B2A1A' },
  { label: 'Afro', color: '#1C140E' },
  { label: 'Acid dye', color: '#7BD41C' },
]

export const HEADWEAR = ['None', 'Cap', 'Backwards cap', 'Beanie'] as const

export interface TopDef {
  label: string
  color: string
  style: 'hoodie' | 'jersey' | 'tee'
}
export const TOPS: TopDef[] = [
  { label: 'Black hoodie', color: '#1B1B22', style: 'hoodie' },
  { label: 'Acid hoodie', color: '#3D5410', style: 'hoodie' },
  { label: 'Crimson hoodie', color: '#5E1A24', style: 'hoodie' },
  { label: 'Home jersey', color: '#1E4D2B', style: 'jersey' },
  { label: 'Away jersey', color: '#26262E', style: 'jersey' },
  { label: 'White tee', color: '#E7E7EC', style: 'tee' },
  { label: 'Vintage tee', color: '#8C5A33', style: 'tee' },
  { label: 'Sky tee', color: '#2E5E8C', style: 'tee' },
]

export const ACCESSORIES = ['None', 'Mic', 'Camera', 'Phone', 'Shades'] as const

export interface ClassDef {
  key: CreatorClass
  label: string
  icon: string
  flavor: string
  /** injected into /api/generate-ideas as a style weight */
  promptBias: string
}

export const CLASSES: ClassDef[] = [
  {
    key: 'prankster',
    label: 'Prankster',
    icon: '🃏',
    flavor: 'Public chaos, straight face, wholesome exit.',
    promptBias: 'Bias toward public prank energy: absurd companion bits, yelling-order episodes, straight-faced commitment in normal places.',
  },
  {
    key: 'foodie_menace',
    label: 'Foodie Menace',
    icon: '🌮',
    flavor: 'Restaurants fear him. Workers love him.',
    promptBias: 'Bias toward food-world ideas: restaurants, street vendors, over-ordering, out-of-business buyouts, kitchen and drive-thru interactions.',
  },
  {
    key: 'street_interviewer',
    label: 'Street Interviewer',
    icon: '🎤',
    flavor: 'Strangers tell him everything.',
    promptBias: 'Bias toward stranger interactions: challenges, questions, crowd moments, mic-in-hand street conversations with big payoffs.',
  },
  {
    key: 'chaos_agent',
    label: 'Chaos Agent',
    icon: '🌀',
    flavor: 'The bit escalates until everyone is in on it.',
    promptBias: 'Bias toward maximum-escalation concepts: multi-beat bits that grow, crowd participation, boss-quest-scale productions.',
  },
]

export interface AccentDef {
  key: string
  label: string
  color: string
  dim: string
}

/** Curated accent options — sets --c-acid live and persists. */
export const ACCENTS: AccentDef[] = [
  { key: 'acid', label: 'Acid', color: '#B6FF2E', dim: 'rgba(182,255,46,0.14)' },
  { key: 'ember', label: 'Ember', color: '#FF5C1A', dim: 'rgba(255,92,26,0.14)' },
  { key: 'volt', label: 'Volt', color: '#38B6FF', dim: 'rgba(56,182,255,0.14)' },
  { key: 'fuchsia', label: 'Fuchsia', color: '#FF3B94', dim: 'rgba(255,59,148,0.14)' },
]

export function applyAccent(key: string): void {
  const accent = ACCENTS.find((a) => a.key === key) ?? ACCENTS[0]
  const root = document.documentElement
  root.style.setProperty('--c-acid', accent.color)
  root.style.setProperty('--c-acid-dim', accent.dim)
}

export function classByKey(key: CreatorClass | null | undefined): ClassDef {
  return CLASSES.find((c) => c.key === key) ?? CLASSES[0]
}
