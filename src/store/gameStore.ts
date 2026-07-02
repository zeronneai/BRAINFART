/**
 * Central game state: profile/XP/streaks, ideas (loot), quests, conquest
 * map, challenges, briefing cache, and transient UI moments (level-ups,
 * legendary drops, badge pops, zone-cleared celebrations, notices).
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
import { SPOTS, ZONE_LABELS, spotById, type SpotState, type ZoneKey } from '@/lib/spots'
import type { Challenge } from '@/lib/challenges'
import { daysBetween, seededRng, toDayKey, uid } from '@/lib/utils'

export interface FeedbackSignal {
  ideaId: string
  title: string
  format: Idea['format']
  signal: 'trashed' | 'banked' | 'completed'
  at: string
}

export interface SpotRuntime {
  state: SpotState
  conquered_at: string | null
  quest_id: string | null
}

const COMBO_WINDOW_MS = 7 * 86_400_000
const COMBO_DURATION_MS = 48 * 3_600_000
const COMBO_MULTIPLIER = 1.5

interface Overlays {
  pendingLevelUp: { level: number; title: string } | null
  legendaryDrop: Idea | null
  xpToast: { amount: number; multiplier: number } | null
  badgePop: { id: string; name: string; icon: string } | null
  zoneCleared: { zone: ZoneKey; name: string } | null
  notice: string | null
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
  trendSeed: string | null
  /** spot the current trend seed came from (rolls from a map pin) */
  trendSpotId: string | null
  /** spot the last roll was aimed at — accepted cards auto-attach to it */
  lastRollSpotId: string | null
  /** conquest overrides keyed by spot id (spots not present = suggested) */
  spotStates: Record<string, SpotRuntime>
  /** id of the spot that just flipped, for the pop animation */
  justConquered: string | null
  claimedChallenges: Record<string, string>
  comboUntil: string | null
  seeded: boolean

  // actions
  seedDemoIfFresh: () => void
  ensureDailyQuests: () => void
  roll: (filters: Partial<RollFilters>) => Promise<Idea[]>
  acceptQuest: (ideaId: string, spotId?: string) => Quest | null
  bankIdea: (ideaId: string) => void
  trashIdea: (ideaId: string) => void
  rerollVariant: (ideaId: string) => void
  setQuestState: (questId: string, state: QuestState) => void
  completeQuest: (questId: string, postUrl?: string) => void
  setPostUrl: (questId: string, url: string) => void
  attachSpot: (questId: string, spotId: string | null) => void
  scheduleQuest: (questId: string, dayKey: string | null) => void
  claimChallenge: (challenge: Challenge) => void
  isComboActive: () => boolean
  setBriefing: (b: TrendBriefing) => void
  setTrendSeed: (seed: string | null, spotId?: string | null) => void
  notify: (message: string) => void
  dismissLevelUp: () => void
  dismissLegendary: () => void
  dismissXPToast: () => void
  dismissBadgePop: () => void
  dismissZoneCleared: () => void
  dismissNotice: () => void
  clearJustConquered: () => void
  hydrateFromCloud: (
    data: Partial<Pick<GameState, 'profile' | 'ideas' | 'quests' | 'unlockedBadges' | 'feedback' | 'spotStates'>>,
  ) => void
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

      const comboActive = () => {
        const until = get().comboUntil
        return until !== null && new Date(until).getTime() > Date.now()
      }

      /** Streak bookkeeping shared by quest completion. Returns new values. */
      const advanceStreak = () => {
        const p = get().profile
        const today = toDayKey()
        let streak = p.currentStreak
        let freezes = p.streakFreezes
        if (p.lastPostDate === null) {
          streak = 1
        } else {
          const gap = daysBetween(p.lastPostDate, today)
          if (gap === 0) {
            // already posted today — unchanged
          } else if (gap === 1) {
            streak += 1
          } else if (gap === 2 && freezes > 0) {
            freezes -= 1 // mercy mechanic
            streak += 1
          } else {
            streak = 1
          }
        }
        if (streak > 0 && streak % 7 === 0 && streak !== p.currentStreak) freezes += 1
        return { streak, freezes, today }
      }

      const grantXP = (base: number) => {
        const before = levelFromXP(get().profile.xp)
        const after = levelFromXP(get().profile.xp + base)
        set((s) => ({
          profile: { ...s.profile, xp: s.profile.xp + base },
          pendingLevelUp:
            after.level > before.level ? { level: after.level, title: after.title } : s.pendingLevelUp,
        }))
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
        trendSpotId: null,
        lastRollSpotId: null,
        spotStates: {},
        justConquered: null,
        claimedChallenges: {},
        comboUntil: null,
        seeded: false,
        pendingLevelUp: null,
        legendaryDrop: null,
        xpToast: null,
        badgePop: null,
        zoneCleared: null,
        notice: null,

        seedDemoIfFresh: () => {
          const s = get()
          if (s.seeded || s.quests.length > 0 || s.ideas.length > 0 || s.profile.xp > 0) {
            if (!s.seeded) set({ seeded: true })
            return
          }
          // Lazy import avoids a cycle (demoSeed imports types only)
          import('@/lib/demoSeed').then(({ buildDemoSave }) => {
            const save = buildDemoSave()
            // reset the dailies marker so today's dailies regenerate on top
            // of the seed (ensureDailyQuests may have already run)
            set({ ...save, seeded: true, dailiesForDay: null })
            get().ensureDailyQuests()
          })
        },

        ensureDailyQuests: () => {
          const today = toDayKey()
          if (get().dailiesForDay === today) return
          const rng = seededRng(`daily-${today}`)
          const count = 1 + Math.floor(rng() * 2)
          const dailies: Quest[] = mockDailySeeds(rng, count).map((idea) => ({
            id: uid('quest'),
            idea: { ...idea, status: 'quest' },
            type: 'daily',
            state: 'available',
            xp_reward: idea.xp_reward,
            scheduled_date: today,
            completed_at: null,
            post_url: null,
            spot_id: null,
            created_at: new Date().toISOString(),
          }))
          set((s) => ({ dailiesForDay: today, quests: [...dailies, ...s.quests] }))
        },

        roll: async (filters) => {
          const { trendSeed, trendSpotId } = get()
          set({ rolling: true })
          try {
            const recent = get()
              .quests.filter((q) => q.state !== 'available')
              .map((q) => q.idea.title)
              .concat(get().ideas.filter((i) => i.status !== 'trashed').map((i) => i.title))
            const mergedFilters = trendSeed ? { ...filters, trendMode: true, trendSeed } : filters
            const { ideas, offline } = await generateIdeas(3, mergedFilters, recent)
            const legendary = ideas.find((i) => i.rarity === 'legendary') ?? null
            set((s) => ({
              ideas: [...ideas, ...s.ideas],
              lastRollIds: ideas.map((i) => i.id),
              offline,
              trendSeed: null,
              trendSpotId: null,
              lastRollSpotId: trendSpotId,
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

        acceptQuest: (ideaId, spotIdArg) => {
          const s0 = get()
          const idea = s0.ideas.find((i) => i.id === ideaId)
          if (!idea) return null
          // cards rolled from a map pin inherit that spot automatically
          const spotId =
            spotIdArg ?? (s0.lastRollIds.includes(ideaId) ? s0.lastRollSpotId ?? undefined : undefined)
          const quest: Quest = {
            id: uid('quest'),
            idea: { ...idea, status: 'quest' },
            type: questTypeFor(idea),
            state: 'active',
            xp_reward: idea.xp_reward,
            scheduled_date: null,
            completed_at: null,
            post_url: null,
            spot_id: spotId ?? null,
            created_at: new Date().toISOString(),
          }
          set((s) => ({
            quests: [quest, ...s.quests],
            ideas: s.ideas.map((i) => (i.id === ideaId ? { ...i, status: 'quest' } : i)),
            spotStates: spotId
              ? {
                  ...s.spotStates,
                  [spotId]:
                    s.spotStates[spotId]?.state === 'conquered'
                      ? s.spotStates[spotId]
                      : { state: 'active', conquered_at: null, quest_id: quest.id },
                }
              : s.spotStates,
          }))
          get().notify(`Quest accepted: ${idea.title}`)
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
          get().notify('Banked. It’ll wait in the Vault.')
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

          const { streak, freezes, today } = advanceStreak()
          const combo = comboActive()
          const base = applyStreak(quest.xp_reward, streak)
          const gained = Math.round(base * (combo ? COMBO_MULTIPLIER : 1))
          const before = levelFromXP(get().profile.xp)
          const after = levelFromXP(get().profile.xp + gained)
          const completedAt = new Date().toISOString()

          // ── conquest flip ──
          let zoneCleared: Overlays['zoneCleared'] = null
          let spotUpdates: Record<string, SpotRuntime> = {}
          let justConquered: string | null = null
          if (quest.spot_id) {
            const spot = spotById(quest.spot_id)
            if (spot) {
              spotUpdates = {
                [spot.id]: { state: 'conquered', conquered_at: completedAt, quest_id: quest.id },
              }
              justConquered = spot.id
              const states = { ...get().spotStates, ...spotUpdates }
              const zoneSpots = SPOTS.filter((sp) => sp.zone === spot.zone)
              const conquered = zoneSpots.filter((sp) => states[sp.id]?.state === 'conquered').length
              if (conquered === zoneSpots.length) {
                zoneCleared = { zone: spot.zone, name: ZONE_LABELS[spot.zone] }
              }
            }
          }

          set((st) => ({
            quests: st.quests.map((q) =>
              q.id === questId
                ? { ...q, state: 'completed', completed_at: completedAt, post_url: postUrl ?? q.post_url }
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
            spotStates: { ...st.spotStates, ...spotUpdates },
            justConquered: justConquered ?? st.justConquered,
            feedback: [
              ...st.feedback,
              {
                ideaId: quest.idea.id,
                title: quest.idea.title,
                format: quest.idea.format,
                signal: 'completed',
                at: completedAt,
              },
            ],
            xpToast: { amount: gained, multiplier: Math.round((gained / quest.xp_reward) * 100) / 100 },
            pendingLevelUp:
              after.level > before.level ? { level: after.level, title: after.title } : st.pendingLevelUp,
            zoneCleared: zoneCleared ?? st.zoneCleared,
          }))
          checkBadges()
        },

        setPostUrl: (questId, url) => {
          set((s) => ({
            quests: s.quests.map((q) => (q.id === questId ? { ...q, post_url: url } : q)),
          }))
          get().notify('Post link saved 🔗')
        },

        attachSpot: (questId, spotId) => {
          set((s) => {
            const quest = s.quests.find((q) => q.id === questId)
            if (!quest) return s
            const spotStates = { ...s.spotStates }
            // release the previous spot
            if (quest.spot_id && spotStates[quest.spot_id]?.state === 'active') {
              delete spotStates[quest.spot_id]
            }
            if (spotId && spotStates[spotId]?.state !== 'conquered') {
              spotStates[spotId] = { state: 'active', conquered_at: null, quest_id: questId }
            }
            return {
              ...s,
              spotStates,
              quests: s.quests.map((q) => (q.id === questId ? { ...q, spot_id: spotId } : q)),
            }
          })
        },

        scheduleQuest: (questId, dayKey) => {
          set((s) => ({
            quests: s.quests.map((q) => (q.id === questId ? { ...q, scheduled_date: dayKey } : q)),
          }))
        },

        claimChallenge: (challenge) => {
          const s = get()
          if (s.claimedChallenges[challenge.id]) return
          const nowISO = new Date().toISOString()
          const combo = comboActive()
          const gained = Math.round(challenge.xp * (combo ? COMBO_MULTIPLIER : 1))

          const claimed = { ...s.claimedChallenges, [challenge.id]: nowISO }
          // combo check: 3 claims inside the rolling window ignites COMBO
          const recentClaims = Object.values(claimed).filter(
            (at) => Date.now() - new Date(at).getTime() < COMBO_WINDOW_MS,
          ).length
          const ignite = recentClaims >= 3 && !combo

          set({
            claimedChallenges: claimed,
            comboUntil: ignite ? new Date(Date.now() + COMBO_DURATION_MS).toISOString() : s.comboUntil,
            xpToast: { amount: gained, multiplier: combo ? COMBO_MULTIPLIER : 1 },
          })
          grantXP(gained)
          if (ignite) get().notify('🔥 COMBO IGNITED — ×1.5 XP for 48 hours')
          checkBadges()
        },

        isComboActive: comboActive,

        setBriefing: (b) => set({ briefing: b }),
        setTrendSeed: (seed, spotId = null) => set({ trendSeed: seed, trendSpotId: seed ? spotId : null }),
        notify: (message) => set({ notice: message }),
        dismissLevelUp: () => set({ pendingLevelUp: null }),
        dismissLegendary: () => set({ legendaryDrop: null }),
        dismissXPToast: () => set({ xpToast: null }),
        dismissBadgePop: () => set({ badgePop: null }),
        dismissZoneCleared: () => set({ zoneCleared: null }),
        dismissNotice: () => set({ notice: null }),
        clearJustConquered: () => set({ justConquered: null }),

        hydrateFromCloud: (data) => set((s) => ({ ...s, ...data })),
      }
    },
    {
      name: 'brainfart-save-v2',
      partialize: (s) => ({
        profile: s.profile,
        ideas: s.ideas,
        quests: s.quests,
        briefing: s.briefing,
        feedback: s.feedback,
        unlockedBadges: s.unlockedBadges,
        lastRollIds: s.lastRollIds,
        dailiesForDay: s.dailiesForDay,
        spotStates: s.spotStates,
        claimedChallenges: s.claimedChallenges,
        comboUntil: s.comboUntil,
        seeded: s.seeded,
      }),
    },
  ),
)
