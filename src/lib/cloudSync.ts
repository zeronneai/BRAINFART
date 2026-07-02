/**
 * Write-through cloud persistence. Local zustand state is the source of
 * truth for snappy gameplay; this module hydrates it from Supabase on login
 * and pushes debounced snapshots after every mutation. RLS scopes all rows
 * to the signed-in user.
 */

import { supabase } from './supabase'
import { useGame } from '@/store/gameStore'
import type { Character, CreatorClass } from './character'
import type { Idea, Quest } from './types'
import type { SpotRuntime } from '@/store/gameStore'

let started = false
let currentUserId: string | null = null
let timer: ReturnType<typeof setTimeout> | null = null

export function startCloudSync(userId: string) {
  currentUserId = userId
  if (!supabase || started) return
  started = true

  void hydrate(userId)

  useGame.subscribe(() => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => void push(userId), 2000)
  })
}

/** Wipe every cloud row for the signed-in user (the "New Game" reset). */
export async function wipeCloud(): Promise<void> {
  if (!supabase || !currentUserId) return
  const uid = currentUserId
  await Promise.all([
    supabase.from('quests').delete().eq('user_id', uid),
    supabase.from('ideas').delete().eq('user_id', uid),
    supabase.from('spot_conquests').delete().eq('user_id', uid),
    supabase.from('idea_feedback').delete().eq('user_id', uid),
    supabase.from('trend_briefings').delete().eq('user_id', uid),
    supabase.from('user_badges').delete().eq('user_id', uid),
  ])
  await supabase
    .from('profiles')
    .update({
      xp: 0,
      current_streak: 0,
      longest_streak: 0,
      streak_freezes: 0,
      last_post_date: null,
      ideas_rolled: 0,
      legendaries_rolled: 0,
      character: null,
      creator_class: null,
      onboarding_step: 0,
    })
    .eq('user_id', uid)
}

async function hydrate(userId: string) {
  if (!supabase) return
  const [{ data: profile }, { data: ideas }, { data: quests }, { data: conquests }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('ideas').select('*').eq('user_id', userId),
      supabase.from('quests').select('*, ideas(*)').eq('user_id', userId),
      supabase.from('spot_conquests').select('*').eq('user_id', userId),
    ])

  const state = useGame.getState()
  if (!profile && (!ideas || ideas.length === 0)) {
    void push(userId)
    return
  }

  const hydratedIdeas: Idea[] = (ideas ?? []).map(rowToIdea)
  const ideaById = new Map(hydratedIdeas.map((i) => [i.id, i]))
  const hydratedQuests: Quest[] = (quests ?? [])
    .map((q) => rowToQuest(q, ideaById))
    .filter((q): q is Quest => q !== null)

  const spotStates: Record<string, SpotRuntime> = {}
  for (const c of conquests ?? []) {
    spotStates[c.spot_id] = {
      state: c.state,
      conquered_at: c.conquered_at ?? null,
      quest_id: c.quest_id ?? null,
    }
  }

  state.hydrateFromCloud({
    profile: profile
      ? {
          displayName: profile.display_name ?? state.profile.displayName,
          xp: profile.xp ?? 0,
          currentStreak: profile.current_streak ?? 0,
          longestStreak: profile.longest_streak ?? 0,
          streakFreezes: profile.streak_freezes ?? 0,
          lastPostDate: profile.last_post_date ?? null,
          ideasRolled: profile.ideas_rolled ?? 0,
          legendariesRolled: profile.legendaries_rolled ?? 0,
          character: (profile.character as Character | null) ?? state.profile.character,
          creatorClass: (profile.creator_class as CreatorClass | null) ?? state.profile.creatorClass,
          accentPref: profile.accent_pref ?? state.profile.accentPref,
          instagramHandle: profile.instagram_handle ?? state.profile.instagramHandle,
        }
      : state.profile,
    ideas: hydratedIdeas.length > 0 ? hydratedIdeas : state.ideas,
    quests: hydratedQuests.length > 0 ? hydratedQuests : state.quests,
    spotStates: Object.keys(spotStates).length > 0 ? spotStates : state.spotStates,
    onboardingStep: profile?.onboarding_step ?? state.onboardingStep,
  })
}

async function push(userId: string) {
  if (!supabase) return
  const s = useGame.getState()
  try {
    await supabase.from('profiles').upsert(
      {
        user_id: userId,
        display_name: s.profile.displayName,
        xp: s.profile.xp,
        current_streak: s.profile.currentStreak,
        longest_streak: s.profile.longestStreak,
        streak_freezes: s.profile.streakFreezes,
        last_post_date: s.profile.lastPostDate,
        ideas_rolled: s.profile.ideasRolled,
        legendaries_rolled: s.profile.legendariesRolled,
        character: s.profile.character,
        creator_class: s.profile.creatorClass,
        accent_pref: s.profile.accentPref,
        instagram_handle: s.profile.instagramHandle,
        onboarding_step: s.onboardingStep,
      },
      { onConflict: 'user_id' },
    )

    const allIdeas = [...s.ideas, ...s.quests.map((q) => q.idea)]
    const seen = new Set<string>()
    const ideaRows = allIdeas
      .filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)))
      .map((i) => ({
        id: i.id,
        user_id: userId,
        title: i.title,
        format: i.format,
        rarity: i.rarity,
        why_now: i.why_now,
        location_suggestion: i.location_suggestion,
        hooks: i.hooks,
        opening_line: i.opening_line,
        difficulty: i.difficulty,
        xp_reward: i.xp_reward,
        status: i.status,
        script: i.script ?? null,
        created_at: i.created_at,
      }))
    if (ideaRows.length > 0) await supabase.from('ideas').upsert(ideaRows)

    const questRows = s.quests.map((q) => ({
      id: q.id,
      user_id: userId,
      idea_id: q.idea.id,
      type: q.type,
      state: q.state,
      xp_reward: q.xp_reward,
      scheduled_date: q.scheduled_date,
      completed_at: q.completed_at,
      post_url: q.post_url,
      spot_id: q.spot_id,
      created_at: q.created_at,
    }))
    if (questRows.length > 0) await supabase.from('quests').upsert(questRows)

    const conquestRows = Object.entries(s.spotStates).map(([spot_id, r]) => ({
      user_id: userId,
      spot_id,
      state: r.state,
      conquered_at: r.conquered_at,
      quest_id: r.quest_id,
    }))
    if (conquestRows.length > 0)
      await supabase.from('spot_conquests').upsert(conquestRows, { onConflict: 'user_id,spot_id' })

    if (s.feedback.length > 0) {
      await supabase.from('idea_feedback').upsert(
        s.feedback.map((f) => ({
          user_id: userId,
          idea_id: f.ideaId,
          signal: f.signal,
          created_at: f.at,
        })),
        { onConflict: 'user_id,idea_id,signal', ignoreDuplicates: true },
      )
    }
  } catch (err) {
    console.warn('[cloudSync] push failed — will retry on next change', err)
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToIdea(row: any): Idea {
  return {
    id: row.id,
    title: row.title,
    format: row.format,
    rarity: row.rarity,
    why_now: row.why_now,
    location_suggestion: row.location_suggestion,
    hooks: row.hooks ?? [],
    opening_line: row.opening_line ?? '',
    difficulty: row.difficulty,
    xp_reward: row.xp_reward,
    status: row.status,
    script: row.script ?? null,
    created_at: row.created_at,
  }
}

function rowToQuest(row: any, ideaById: Map<string, Idea>): Quest | null {
  const idea = row.ideas ? rowToIdea(row.ideas) : ideaById.get(row.idea_id)
  if (!idea) return null
  return {
    id: row.id,
    idea,
    type: row.type,
    state: row.state,
    xp_reward: row.xp_reward,
    scheduled_date: row.scheduled_date,
    completed_at: row.completed_at,
    post_url: row.post_url,
    spot_id: row.spot_id ?? null,
    created_at: row.created_at,
  }
}
