/** Progression math: levels, creator titles, XP rewards, streak multipliers. */

import type { Difficulty } from './types'

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  1: 50,
  2: 90,
  3: 150,
  4: 240,
  5: 400,
}

const LEVEL_TITLES: Array<[number, string]> = [
  [50, 'Final Boss'],
  [35, 'Fan Favorite'],
  [20, 'Main Character'],
  [10, 'Supporting Cast'],
  [5, 'Side Quest'],
  [1, 'NPC'],
]

export function titleForLevel(level: number): string {
  for (const [min, title] of LEVEL_TITLES) {
    if (level >= min) return title
  }
  return 'NPC'
}

/** XP needed to go from `level` to `level + 1`. */
export function xpToNext(level: number): number {
  return Math.round((100 * Math.pow(level, 1.3)) / 10) * 10
}

export interface LevelInfo {
  level: number
  title: string
  /** XP earned inside the current level */
  intoLevel: number
  /** XP required to clear the current level */
  needed: number
  /** 0..1 progress through the current level */
  progress: number
}

export function levelFromXP(totalXP: number): LevelInfo {
  let level = 1
  let remaining = totalXP
  while (remaining >= xpToNext(level) && level < 99) {
    remaining -= xpToNext(level)
    level += 1
  }
  const needed = xpToNext(level)
  return {
    level,
    title: titleForLevel(level),
    intoLevel: remaining,
    needed,
    progress: Math.min(1, remaining / needed),
  }
}

/** Posting-streak XP multiplier: ×1.1 per consecutive posting day, capped at ×2. */
export function streakMultiplier(streakDays: number): number {
  if (streakDays <= 0) return 1
  return Math.min(2, Math.pow(1.1, streakDays))
}

export function applyStreak(baseXP: number, streakDays: number): number {
  return Math.round(baseXP * streakMultiplier(streakDays))
}
