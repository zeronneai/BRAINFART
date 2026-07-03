/** Core domain types shared across the app. */

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export type FormatKey =
  | 'yelling_order'
  | 'out_of_business'
  | 'absurd_companion'
  | 'authority_wholesome'
  | 'stranger_challenge'
  | 'character_pov'
  | 'employee_flip'

export type IdeaStatus = 'rolled' | 'banked' | 'trashed' | 'quest'

export type Difficulty = 1 | 2 | 3 | 4 | 5

export interface Idea {
  id: string
  title: string
  format: FormatKey
  rarity: Rarity
  why_now: string
  location_suggestion: string
  hooks: string[]
  opening_line: string
  difficulty: Difficulty
  xp_reward: number
  status: IdeaStatus
  /** AI beat sheet — may be absent on older ideas ("Generate script" fills it) */
  script?: IdeaScript | null
  /** Niche reference pattern this idea remixed, e.g. "jaydatroll_ (repetition counter)". */
  inspired_by?: string | null
  created_at: string
}

export type QuestType = 'daily' | 'weekly' | 'boss'
export type QuestState = 'available' | 'active' | 'filmed' | 'posted' | 'completed'

export interface Quest {
  id: string
  idea: Idea
  type: QuestType
  state: QuestState
  xp_reward: number
  scheduled_date: string | null // yyyy-MM-dd
  completed_at: string | null
  post_url: string | null
  /** Conquest Map: the spot this quest is filmed at */
  spot_id: string | null
  created_at: string
}

/** Layered 2D avatar config (pure data; renderer lives in components/Avatar). */
export interface Character {
  base: number
  hair: number
  headwear: number
  top: number
  accessory: number
  aura: string
}

export type CreatorClass = 'prankster' | 'foodie_menace' | 'street_interviewer' | 'chaos_agent'

export interface Profile {
  displayName: string
  xp: number
  currentStreak: number
  longestStreak: number
  streakFreezes: number
  lastPostDate: string | null // yyyy-MM-dd
  ideasRolled: number
  legendariesRolled: number
  /** layered avatar config — null until character creation */
  character: Character | null
  creatorClass: CreatorClass | null
  accentPref: string
  instagramHandle: string
}

export interface IdeaScript {
  hook: string
  setup: string
  beats: string[]
  payoff: string
  pinned_comment: string
}

export interface TrendItem {
  title: string
  summary: string
  why_relevant: string
  source?: string
}

export interface UpcomingDate {
  date: string
  label: string
  content_angle: string
}

export interface TrendBriefing {
  date: string // yyyy-MM-dd, cache key
  trends: TrendItem[]
  upcoming_dates: UpcomingDate[]
  seasonal_alert: string
}

export interface RollFilters {
  format?: FormatKey
  locationType?: string
  effort?: 'quick' | 'medium' | 'production'
  trendMode: boolean
  /** a Trend Radar item injected via "Roll ideas from this" */
  trendSeed?: string
}

export interface TitleKit {
  titles: string[]
  comment_baits: string[]
  caption: string
}

export interface NearbyPlace {
  name: string
  category: string
  area: string
}
