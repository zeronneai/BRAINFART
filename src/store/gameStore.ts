/**
 * Central game state: profile/XP/streaks, ideas (loot), quests, briefing
 * cache, and transient UI moments (level-ups, legendary drops, badge pops).
 *
 * Persists locally via zustand/persist; cloud sync (Supabase) layers on top
 * in lib/cloudSync.ts when configured.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Idea,
  Profile,
  Quest,
  QuestState,
  QuestType,
  RollFilters,
  TrendBriefing,
} from '@/lib/types'
import { applyStreak, levelFromXP } from '@/lib/xp'
import { generateIdeas } from '@/lib/api'
import { mockDailySeeds, mockVariant } from '@/lib/mock'
import { BADGES, unlockedBadgeIds } from '@/lib/badges'
import { daysBetween, seededRng, toDayKey, uid } from '@/lib/utils'

export interface FeedbackSignal {
  ideaId: string
  title: string
  format: Idea['format']
  signal: 'trashed' | 'banked' | 'completed'
  at: string
}

interface Overlays {
  pendingLevelUp: { level: number; title: string } | null
  legendaryDrop: Idea | null
  xpToast: { amount: number; multiplier: number } | null
  badgePop: { id: string; name: string; icon: string } | null
}

interface GameState extends Overlays {
  profile: Profile
  ideas: Idea[]
  quests: Quest[]
  briefing: TrendBriefing | null
  feedback: FeedbackSignal[]
  unlockedBadges: string[]
  lastRollIds: string[]
  rolling: boolean
  offline: boolean
  dailiesForDay: string | null
  /** trend title injected into the next roll via "Roll ideas from this" */
  trendSeed: string | null

  // actions
  ensureDailyQuests: () => void
  roll: (filters: Partial<RollFilters>) => Promise<Idea[]>
  acceptQuest: (ideaId: string) => Quest | null
  bankIdea: (ideaId: string) => void
  trashIdea: (ideaId: string) => void
  rerollVariant: (ideaId: string) => void
  setQuestState: (questId: string, state: QuestState) => void
  completeQuest: (questId: string, postUrl?: string) => void
  scheduleQuest: (questId: string, dayKey: string | null) => void
  setBriefing: (b: TrendBriefing) => void
  setTrendSeed: (seed: string | null) => void
  dismissLevelUp: () => void
  dismissLegendary: () => void
  dismissXPToast: () => void
  dismissBadgePop: () => void
  hydrateFromCloud: (data: Partial<Pick<GameState, 'profile' | 'ideas' | 'quests' | 'unlockedBadges' | 'feedback'>>) => void
}

const initialProfile: Profile = {
  displayName: 'Pablo',
  xp: 0,
  currentStreak: 0,
  longestStreak: 0,
  streakFreezes: 0,
  lastPostDate: null,
  ideasRolled: 0,
  legendariesRolled: 0,
}

function questTypeFor(idea: Idea): QuestType {
  if (idea.rarity === 'legendary' || idea.difficulty === 5) return 'boss'
  if (idea.difficulty >= 3) return 'weekly'
  return 'daily'
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => {
      /** Re-evaluate badges after any progress mutation; queue one pop. */
      const checkBadges = () => {
        const { profile, ideas, quests, unlockedBadges } = get()
        const now = unlockedBadgeIds({ profile, ideas, quests })
        const fresh = now.filter((id) => !unlockedBadges.includes(id))
        if (fresh.length > 0) {
          const def = BADGES.find((b) => b.id === fresh[0])
          set({
            unlockedBadges: now,
            badgePop: def ? { id: def.id, name: def.name, icon: def.icon } : null,
          })
        }
      }

      return {
        profile: initialProfile,
        ideas: [],
        quests: [],
        briefing: null,
        feedback: [],
        unlockedBadges: [],
        lastRollIds: [],
        rolling: false,
        offline: false,
        dailiesForDay: null,
        trendSeed: null,
        pendingLevelUp: null,
        legendaryDrop: null,
        xpToast: null,
        badgePop: null,

        ensureDailyQuests: () => {
          const today = toDayKey()
          if (get().dailiesForDay === today) return
          const rng = seededRng(`daily-${today}`)
          const count = 1 + Math.floor(rng() * 2) // 1–2 light quests
          const dailies: Quest[] = mockDailySeeds(rng, count).map((idea) => ({
            id: uid('quest'),
            idea: { ...idea, status: 'quest' },
            type: 'daily',
            state: 'available',
            xp_reward: idea.xp_reward,
            scheduled_date: today,
            completed_at: null,
            post_url: null,
            created_at: new Date().toISOString(),
          }))
          set((s) => ({
            dailiesForDay: today,
            quests: [...dailies, ...s.quests],
          }))
        },

        roll: async (filters) => {
          const { trendSeed } = get()
          set({ rolling: true })
          try {
            const recent = get()
              .quests.filter((q) => q.state !== 'available')
              .map((q) => q.idea.title)
              .concat(get().ideas.filter((i) => i.status !== 'trashed').map((i) => i.title))
            const mergedFilters = trendSeed
              ? { ...filters, locationType: filters.locationType, trendMode: true, trendSeed }
              : filters
            const { ideas, offline } = await generateIdeas(3, mergedFilters, recent)
            const legendary = ideas.find((i) => i.rarity === 'legendary') ?? null
            set((s) => ({
              ideas: [...ideas, ...s.ideas],
              lastRollIds: ideas.map((i) => i.id),
              offline,
              trendSeed: null,
              legendaryDrop: legendary,
              profile: {
                ...s.profile,
                ideasRolled: s.profile.ideasRolled + ideas.length,
                legendariesRolled:
                  s.profile.legendariesRolled + ideas.filter((i) => i.rarity === 'legendary').length,
              },
            }))
            checkBadges()
            return ideas
          } finally {
            set({ rolling: false })
          }
        },

        acceptQuest: (ideaId) => {
          const idea = get().ideas.find((i) => i.id === ideaId)
          if (!idea) return null
          const quest: Quest = {
            id: uid('quest'),
            idea: { ...idea, status: 'quest' },
            type: questTypeFor(idea),
            state: 'active',
            xp_reward: idea.xp_reward,
            scheduled_date: null,
            completed_at: null,
            post_url: null,
            created_at: new Date().toISOString(),
          }
          set((s) => ({
            quests: [quest, ...s.quests],
            ideas: s.ideas.map((i) => (i.id === ideaId ? { ...i, status: 'quest' } : i)),
          }))
          return quest
        },

        bankIdea: (ideaId) => {
          const idea = get().ideas.find((i) => i.id === ideaId)
          if (!idea) return
          set((s) => ({
            ideas: s.ideas.map((i) => (i.id === ideaId ? { ...i, status: 'banked' } : i)),
            feedback: [
              ...s.feedback,
              { ideaId, title: idea.title, format: idea.format, signal: 'banked', at: new Date().toISOString() },
            ],
          }))
          checkBadges()
        },

        trashIdea: (ideaId) => {
          const idea = get().ideas.find((i) => i.id === ideaId)
          if (!idea) return
          set((s) => ({
            ideas: s.ideas.map((i) => (i.id === ideaId ? { ...i, status: 'trashed' } : i)),
            lastRollIds: s.lastRollIds.filter((id) => id !== ideaId),
            feedback: [
              ...s.feedback,
              { ideaId, title: idea.title, format: idea.format, signal: 'trashed', at: new Date().toISOString() },
            ],
          }))
        },

        rerollVariant: (ideaId) => {
          const old = get().ideas.find((i) => i.id === ideaId)
          if (!old) return
          const variant = mockVariant(old.format, old.title)
          set((s) => ({
            ideas: [variant, ...s.ideas.map((i) => (i.id === ideaId ? { ...i, status: 'trashed' as const } : i))],
            lastRollIds: s.lastRollIds.map((id) => (id === ideaId ? variant.id : id)),
            profile: { ...s.profile, ideasRolled: s.profile.ideasRolled + 1 },
          }))
        },

        setQuestState: (questId, state) => {
          if (state === 'completed') {
            get().completeQuest(questId)
            return
          }
          set((s) => ({
            quests: s.quests.map((q) => (q.id === questId ? { ...q, state } : q)),
          }))
        },

        completeQuest: (questId, postUrl) => {
          const quest = get().quests.find((q) => q.id === questId)
          if (!quest || quest.state === 'completed') return
          const s = get()
          const today = toDayKey()
          const p = s.profile

          // ── streak logic (completion counts as a post) ──
          let streak = p.currentStreak
          let freezes = p.streakFreezes
          if (p.lastPostDate === null) {
            streak = 1
          } else {
            const gap = daysBetween(p.lastPostDate, today)
            if (gap === 0) {
              // already posted today — streak unchanged
            } else if (gap === 1) {
              streak += 1
            } else if (gap === 2 && freezes > 0) {
              freezes -= 1 // mercy mechanic: streak freeze covers the missed day
              streak += 1
            } else {
              streak = 1
            }
          }
          // earn a streak freeze at every 7-day milestone
          if (streak > 0 && streak % 7 === 0 && streak !== p.currentStreak) {
            freezes += 1
          }

          const gained = applyStreak(quest.xp_reward, streak)
          const before = levelFromXP(p.xp)
          const after = levelFromXP(p.xp + gained)

          set((st) => ({
            quests: st.quests.map((q) =>
              q.id === questId
                ? {
                    ...q,
                    state: 'completed',
                    completed_at: new Date().toISOString(),
                    post_url: postUrl ?? q.post_url,
                  }
                : q,
            ),
            profile: {
              ...st.profile,
              xp: st.profile.xp + gained,
              currentStreak: streak,
              longestStreak: Math.max(st.profile.longestStreak, streak),
              streakFreezes: freezes,
              lastPostDate: today,
            },
            feedback: [
              ...st.feedback,
              {
                ideaId: quest.idea.id,
                title: quest.idea.title,
                format: quest.idea.format,
                signal: 'completed',
                at: new Date().toISOString(),
              },
            ],
            xpToast: { amount: gained, multiplier: Math.round((gained / quest.xp_reward) * 100) / 100 },
            pendingLevelUp: after.level > before.level ? { level: after.level, title: after.title } : st.pendingLevelUp,
          }))
          checkBadges()
        },

        scheduleQuest: (questId, dayKey) => {
          set((s) => ({
            quests: s.quests.map((q) => (q.id === questId ? { ...q, scheduled_date: dayKey } : q)),
          }))
        },

        setBriefing: (b) => set({ briefing: b }),
        setTrendSeed: (seed) => set({ trendSeed: seed }),
        dismissLevelUp: () => set({ pendingLevelUp: null }),
        dismissLegendary: () => set({ legendaryDrop: null }),
        dismissXPToast: () => set({ xpToast: null }),
        dismissBadgePop: () => set({ badgePop: null }),

        hydrateFromCloud: (data) => set((s) => ({ ...s, ...data })),
      }
    },
    {
      name: 'brainfart-save-v1',
      partialize: (s) => ({
        profile: s.profile,
        ideas: s.ideas,
        quests: s.quests,
        briefing: s.briefing,
        feedback: s.feedback,
        unlockedBadges: s.unlockedBadges,
        lastRollIds: s.lastRollIds,
        dailiesForDay: s.dailiesForDay,
      }),
    },
  ),
)
