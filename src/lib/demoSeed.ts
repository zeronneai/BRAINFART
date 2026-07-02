/**
 * First-run demo save. The app must never open onto empty screens — this
 * builds a believable mid-game state (level 5, a streak, conquered spots,
 * banked loot, quests in every stage) in Pablo's actual voice.
 */

import type { Idea, Profile, Quest } from './types'
import type { SpotRuntime, FeedbackSignal } from '@/store/gameStore'
import { addDays, toDayKey, uid } from './utils'

function iso(daysAgo: number, hour = 18): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 12, 0, 0)
  return d.toISOString()
}

function idea(partial: Omit<Idea, 'id' | 'status' | 'created_at'> & { created_daysAgo?: number }): Idea {
  const { created_daysAgo = 1, ...rest } = partial
  return { ...rest, id: uid('idea'), status: 'rolled', created_at: iso(created_daysAgo) }
}

export function buildDemoSave(): {
  profile: Profile
  ideas: Idea[]
  quests: Quest[]
  spotStates: Record<string, SpotRuntime>
  feedback: FeedbackSignal[]
} {
  const today = toDayKey()

  // ── banked loot for the Vault ──
  const banked: Idea[] = [
    idea({
      title: 'Hiding a mariachi band in a study library',
      format: 'absurd_companion',
      rarity: 'epic',
      why_now: 'Finals season on local campuses — silent space + full mariachi is maximum contrast.',
      location_suggestion: 'UTEP library area (public zones)',
      hooks: ['Hiding a mariachi band in a study library', 'Silent floor. Full mariachi.', 'The librarian let them finish the song'],
      opening_line: '*whispers* "Ahorita no... okay AHORITA."',
      difficulty: 4,
      xp_reward: 240,
      created_daysAgo: 4,
    }),
    idea({
      title: 'Buying every rose from a street vendor for strangers',
      format: 'out_of_business',
      rarity: 'rare',
      why_now: 'Wholesome buyouts are pulling huge saves — flowers to strangers is endlessly clippable.',
      location_suggestion: 'Zaragoza rose vendor corner (Eastside)',
      hooks: ['Buying every rose from a street vendor for strangers', '100 roses. 100 strangers.', 'Putting the rose guy out of business (wholesomely)'],
      opening_line: '"How much for the bucket? No — all the buckets."',
      difficulty: 3,
      xp_reward: 150,
      created_daysAgo: 3,
    }),
    idea({
      title: 'Asking police officers to judge my push-ups',
      format: 'authority_wholesome',
      rarity: 'rare',
      why_now: 'Officer-interaction videos are his most-shared format; fitness angle is fresh.',
      location_suggestion: 'San Jacinto Plaza foot patrol (Downtown)',
      hooks: ['Asking police officers to judge my push-ups', 'EPPD rated my push-ups 4/10', 'Doing push-ups until the cops join in'],
      opening_line: '"Officer! Quick question. Are these regulation push-ups?"',
      difficulty: 2,
      xp_reward: 90,
      created_daysAgo: 2,
    }),
    idea({
      title: 'Taking a cardboard cutout of me on a date',
      format: 'absurd_companion',
      rarity: 'common',
      why_now: 'Self-referential companion bits are spiking; the cutout becomes a recurring character.',
      location_suggestion: 'Sit-down restaurant at The Fountains at Farah',
      hooks: ['Taking a cardboard cutout of me on a date', 'Dinner for two: me and me', 'The waiter gave my cutout a menu'],
      opening_line: '"Table for two. He\'s... quiet."',
      difficulty: 2,
      xp_reward: 90,
      created_daysAgo: 2,
    }),
  ].map((i) => ({ ...i, status: 'banked' as const }))

  // ── quests across every stage ──
  const qElote: Quest = {
    id: uid('quest'),
    idea: idea({
      title: 'Putting an elote man out of business',
      format: 'out_of_business',
      rarity: 'epic',
      why_now: 'Street-vendor spotlights are peaking — buying out a cart ends maximum wholesome.',
      location_suggestion: 'Segundo Barrio elote cart (Downtown)',
      hooks: ['Putting an elote man out of business', 'I bought EVERY elote in El Paso', 'Feeding the whole block'],
      opening_line: '"¿Cuántos elotes tienes? ...I\'ll take all of them."',
      difficulty: 3,
      xp_reward: 150,
      created_daysAgo: 6,
    }),
    type: 'weekly',
    state: 'completed',
    xp_reward: 150,
    scheduled_date: null,
    completed_at: iso(3),
    post_url: 'https://www.instagram.com/p/brainfart-demo-elote/',
    spot_id: 'segundo-elote',
    created_at: iso(6),
  }
  qElote.idea.status = 'quest'

  const qDriveThru: Quest = {
    id: uid('quest'),
    idea: idea({
      title: 'Yelling my order at a drive-thru at 2am',
      format: 'yelling_order',
      rarity: 'common',
      why_now: 'Late-night drive-thru clips consistently outperform — empty lot, maximum contrast.',
      location_suggestion: 'Whataburger on Mesa (24h)',
      hooks: ['Yelling my order at a drive-thru at 2am', 'The 2am worker deserves a raise', 'Yelling until the speaker clips'],
      opening_line: '"GOOD MORNING!!! I KNOW IT\'S 2AM!!!"',
      difficulty: 1,
      xp_reward: 50,
      created_daysAgo: 2,
    }),
    type: 'daily',
    state: 'completed',
    xp_reward: 50,
    scheduled_date: null,
    completed_at: iso(1),
    post_url: 'https://www.instagram.com/p/brainfart-demo-2am/',
    spot_id: 'whataburger-mesa',
    created_at: iso(2),
  }
  qDriveThru.idea.status = 'quest'

  const qChicos: Quest = {
    id: uid('quest'),
    idea: idea({
      title: "Yelling my order at Chico's Tacos",
      format: 'yelling_order',
      rarity: 'rare',
      why_now: 'The most El Paso location possible — hometown crowd guaranteed to duet this.',
      location_suggestion: "Chico's Tacos on Alameda (Lower Valley)",
      hooks: ["Yelling my order at Chico's Tacos", 'TRES ROLLED TACOS CON QUESO!!!', 'El Paso heard me from the parking lot'],
      opening_line: '"CAN I GET... UN NÚMERO UNO... EXTRA QUESOOOO"',
      difficulty: 2,
      xp_reward: 90,
      created_daysAgo: 6,
    }),
    type: 'daily',
    state: 'completed',
    xp_reward: 90,
    scheduled_date: null,
    completed_at: iso(5),
    post_url: 'https://www.instagram.com/p/brainfart-demo-chicos/',
    spot_id: 'chicos-tacos',
    created_at: iso(6),
  }
  qChicos.idea.status = 'quest'

  const qSuiii: Quest = {
    id: uid('quest'),
    idea: idea({
      title: 'Starting a SUIII chain at a World Cup watch party',
      format: 'stranger_challenge',
      rarity: 'legendary',
      why_now: 'World Cup 2026 fever — watch parties are packed and primed to yell on command.',
      location_suggestion: 'Union Draft House during a big match',
      hooks: ['Starting a SUIII chain at a World Cup watch party', 'The whole bar did the SUIII', 'One stranger started it. 200 finished it.'],
      opening_line: '"On three, everybody... UNO, DOS, TRES—"',
      difficulty: 3,
      xp_reward: 150,
      created_daysAgo: 1,
    }),
    type: 'boss',
    state: 'active',
    xp_reward: 150,
    scheduled_date: addDays(today, 2),
    completed_at: null,
    post_url: null,
    spot_id: 'union-draft',
    created_at: iso(1),
  }
  qSuiii.idea.status = 'quest'

  const qAbuela: Quest = {
    id: uid('quest'),
    idea: idea({
      title: "POV: Abuela's first time at a smoothie bar",
      format: 'character_pov',
      rarity: 'rare',
      why_now: 'Abuela characters are evergreen bilingual gold; health-food menus write the jokes.',
      location_suggestion: 'Smoothie bar at The Fountains at Farah',
      hooks: ["POV: Abuela's first time at a smoothie bar", 'Abuela vs the $14 smoothie', '"¿Catorce dólares?!"'],
      opening_line: '"¿Qué es... açaí? ¿Eso se come?"',
      difficulty: 2,
      xp_reward: 90,
      created_daysAgo: 1,
    }),
    type: 'daily',
    state: 'filmed',
    xp_reward: 90,
    scheduled_date: today,
    completed_at: null,
    post_url: null,
    spot_id: 'fountains-farah',
    created_at: iso(1),
  }
  qAbuela.idea.status = 'quest'

  const quests = [qSuiii, qAbuela, qDriveThru, qElote, qChicos]

  const spotStates: Record<string, SpotRuntime> = {
    'segundo-elote': { state: 'conquered', conquered_at: qElote.completed_at, quest_id: qElote.id },
    'whataburger-mesa': { state: 'conquered', conquered_at: qDriveThru.completed_at, quest_id: qDriveThru.id },
    'chicos-tacos': { state: 'conquered', conquered_at: qChicos.completed_at, quest_id: qChicos.id },
    'union-draft': { state: 'active', conquered_at: null, quest_id: qSuiii.id },
    'fountains-farah': { state: 'active', conquered_at: null, quest_id: qAbuela.id },
  }

  const feedback: FeedbackSignal[] = quests
    .filter((q) => q.state === 'completed')
    .map((q) => ({
      ideaId: q.idea.id,
      title: q.idea.title,
      format: q.idea.format,
      signal: 'completed' as const,
      at: q.completed_at!,
    }))

  const yesterday = addDays(today, -1)

  const profile: Profile = {
    displayName: 'Pablo',
    xp: 1450, // level 5 — "Side Quest"
    currentStreak: 2,
    longestStreak: 5,
    streakFreezes: 1,
    lastPostDate: yesterday,
    ideasRolled: 23,
    legendariesRolled: 1,
  }

  return { profile, ideas: banked, quests, spotStates, feedback }
}
