/** Badge / achievement definitions tied to Pablo's real formats. */

import type { Idea, Profile, Quest } from './types'
import { SPOTS } from './spots'

export interface BadgeDef {
  id: string
  name: string
  description: string
  icon: string
  target: number
  progress: (ctx: BadgeContext) => number
}

export interface BadgeContext {
  profile: Profile
  ideas: Idea[]
  quests: Quest[]
}

const completed = (ctx: BadgeContext) => ctx.quests.filter((q) => q.state === 'completed')

const completedOfFormat = (ctx: BadgeContext, format: Idea['format']) =>
  completed(ctx).filter((q) => q.idea.format === format).length

const completedMatching = (ctx: BadgeContext, re: RegExp) =>
  completed(ctx).filter((q) => re.test(q.idea.title) || re.test(q.idea.why_now)).length

export const BADGES: BadgeDef[] = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Complete your first quest',
    icon: '🎬',
    target: 1,
    progress: (ctx) => completed(ctx).length,
  },
  {
    id: 'volume_warrior',
    name: 'Volume Warrior',
    description: 'Complete 10 yelling-order videos',
    icon: '📢',
    target: 10,
    progress: (ctx) => completedOfFormat(ctx, 'yelling_order'),
  },
  {
    id: 'job_creator',
    name: 'Job Creator',
    description: "Complete 5 'out of business' videos",
    icon: '💸',
    target: 5,
    progress: (ctx) => completedOfFormat(ctx, 'out_of_business'),
  },
  {
    id: 'officer_friendly',
    name: 'Officer Friendly',
    description: 'Complete 3 police / authority videos',
    icon: '🚔',
    target: 3,
    progress: (ctx) => completedOfFormat(ctx, 'authority_wholesome'),
  },
  {
    id: 'mundialista',
    name: 'Mundialista',
    description: 'Complete 5 World Cup videos',
    icon: '⚽',
    target: 5,
    progress: (ctx) => completedMatching(ctx, /world cup|suiii|fútbol|futbol/i),
  },
  {
    id: 'method_actor',
    name: 'Method Actor',
    description: 'Complete 5 character POV videos',
    icon: '🎭',
    target: 5,
    progress: (ctx) => completedOfFormat(ctx, 'character_pov'),
  },
  {
    id: 'people_person',
    name: 'People Person',
    description: 'Complete 5 stranger challenges',
    icon: '🤝',
    target: 5,
    progress: (ctx) => completedOfFormat(ctx, 'stranger_challenge'),
  },
  {
    id: 'week_streak',
    name: 'On Fire',
    description: 'Hit a 7-day posting streak',
    icon: '🔥',
    target: 7,
    progress: (ctx) => ctx.profile.longestStreak,
  },
  {
    id: 'legendary_hunter',
    name: 'Legendary Hunter',
    description: 'Roll 3 legendary ideas',
    icon: '👑',
    target: 3,
    progress: (ctx) => ctx.profile.legendariesRolled,
  },
  {
    id: 'the_vault',
    name: 'The Vault',
    description: 'Bank 10 ideas for later',
    icon: '🏦',
    target: 10,
    progress: (ctx) => ctx.ideas.filter((i) => i.status === 'banked').length,
  },
  {
    id: 'slot_machine',
    name: 'Slot Machine',
    description: 'Roll 50 ideas',
    icon: '🎰',
    target: 50,
    progress: (ctx) => ctx.profile.ideasRolled,
  },
  {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Complete a Boss Quest',
    icon: '⚔️',
    target: 1,
    progress: (ctx) => completed(ctx).filter((q) => q.type === 'boss').length,
  },
  {
    id: 'conquistador',
    name: 'Conquistador',
    description: 'Conquer 5 spots on the map',
    icon: '🚩',
    target: 5,
    progress: (ctx) => new Set(completed(ctx).map((q) => q.spot_id).filter(Boolean)).size,
  },
  {
    id: 'cartographer',
    name: 'Cartógrafo',
    description: 'Conquer spots in 4 different zones',
    icon: '🗺️',
    target: 4,
    progress: (ctx) => {
      const zones = new Set<string>()
      for (const q of completed(ctx)) {
        if (!q.spot_id) continue
        const spot = SPOTS.find((s) => s.id === q.spot_id)
        if (spot) zones.add(spot.zone)
      }
      return zones.size
    },
  },
]

export function unlockedBadgeIds(ctx: BadgeContext): string[] {
  return BADGES.filter((b) => b.progress(ctx) >= b.target).map((b) => b.id)
}
