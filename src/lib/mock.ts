/**
 * Mock idea engine — powers demo mode (no API keys) and daily quests.
 * Every entry is written in Pablo's actual voice so the demo never shows
 * placeholder content.
 */

import type { Difficulty, FormatKey, Idea, Rarity, RollFilters, TrendBriefing } from './types'
import { XP_BY_DIFFICULTY } from './xp'
import { rollRarity } from './rarity'
import { toDayKey, uid } from './utils'

interface SeedIdea {
  title: string
  format: FormatKey
  why_now: string
  location_suggestion: string
  hooks: string[]
  opening_line: string
  difficulty: Difficulty
  rarity?: Rarity // pin rarity for perfect-storm seeds
}

const SEEDS: SeedIdea[] = [
  {
    title: 'Yelling my order at a mariachi restaurant',
    format: 'yelling_order',
    why_now: 'The yelling series is his highest-repeat franchise — mariachi backing turns the yell into a duet.',
    location_suggestion: 'Family-run Mexican restaurant with live mariachi (Lincoln Park area)',
    hooks: [
      'Yelling my order at a mariachi restaurant',
      'Ordering tacos at the top of my lungs (mariachi joined)',
      'The mariachi band matched my order energy',
    ],
    opening_line: '"CAN I GET... TRES TACOS DE ASADA... POR FAVORRRR"',
    difficulty: 2,
  },
  {
    title: 'Yelling my order at a drive-thru at 2am',
    format: 'yelling_order',
    why_now: 'Late-night drive-thru clips consistently outperform — empty lot, tired employee, maximum contrast.',
    location_suggestion: '24h drive-thru (Whataburger on Mesa St)',
    hooks: [
      'Yelling my order at a drive-thru at 2am',
      'The 2am drive-thru worker deserves a raise',
      'Yelling into the drive-thru speaker until it clips',
    ],
    opening_line: '"GOOD MORNING!!! I KNOW IT\'S 2AM!!!"',
    difficulty: 1,
  },
  {
    title: 'Putting an elote man out of business',
    format: 'out_of_business',
    why_now: 'Street-vendor spotlights are peaking on Reels — buying out a cart ends maximum wholesome.',
    location_suggestion: 'Elote/raspas street cart (Segundo Barrio)',
    hooks: [
      'Putting an elote man out of business',
      'I bought EVERY elote in El Paso',
      'Buying out the elote cart then feeding the whole block',
    ],
    opening_line: '"¿Cuántos elotes tienes? ...I\'ll take all of them."',
    difficulty: 3,
    rarity: 'epic',
  },
  {
    title: 'Putting a raspa shop out of business in July',
    format: 'out_of_business',
    why_now: 'El Paso heatwave season — 100°F days make a raspa buyout the perfect summer flex.',
    location_suggestion: 'Raspa / shaved-ice shop (Ascarate area)',
    hooks: [
      'Putting a raspa shop out of business in July',
      'Buying 200 raspas during a heatwave',
      'Free raspas for everyone at the park',
    ],
    opening_line: '"It\'s 104 degrees. I need two hundred raspas."',
    difficulty: 3,
  },
  {
    title: 'Taking 100 rubber ducks to a car wash',
    format: 'absurd_companion',
    why_now: 'Duck-ification of cars is a running meme — a car wash full of ducks is a perfect visual gag.',
    location_suggestion: 'Full-service car wash (any Octopus Car Wash)',
    hooks: [
      'Taking 100 rubber ducks to a car wash',
      'They washed my car AND my 100 ducks',
      'POV: the car wash guy finds 100 ducks inside',
    ],
    opening_line: '"Yeah, full detail please. Careful — they\'re sleeping."',
    difficulty: 2,
  },
  {
    title: 'Taking a cardboard cutout of me on a date',
    format: 'absurd_companion',
    why_now: 'Self-referential companion bits are spiking; the cutout doubles as a recurring character.',
    location_suggestion: 'Sit-down Italian restaurant (Cattleman\'s or Olive Garden)',
    hooks: [
      'Taking a cardboard cutout of me on a date',
      'Dinner for two: me and me',
      'The waiter gave my cutout a menu',
    ],
    opening_line: '"Table for two. He\'s... quiet."',
    difficulty: 2,
  },
  {
    title: 'Asking police officers to judge my push-ups',
    format: 'authority_wholesome',
    why_now: 'Officer-interaction videos are his most-shared format — fitness angle adds a fresh twist.',
    location_suggestion: 'Downtown El Paso plaza where officers patrol on foot',
    hooks: [
      'Asking police officers to judge my push-ups',
      'EPPD rated my push-ups 4/10',
      'Doing push-ups until the cops join in',
    ],
    opening_line: '"Officer! Quick question. Are these regulation push-ups?"',
    difficulty: 2,
  },
  {
    title: 'Begging border patrol horses for a ride',
    format: 'authority_wholesome',
    why_now: 'Mounted-unit content is rare and hyper-local to the borderland — instant regional lock-in.',
    location_suggestion: 'Public event where the mounted unit appears (downtown parades)',
    hooks: [
      'Begging border patrol horses for a ride',
      'The horse said no but the officer laughed',
      'Interviewing the hardest-working horse in El Paso',
    ],
    opening_line: '"Sir, is the horse accepting passengers today?"',
    difficulty: 3,
  },
  {
    title: 'Convincing a stranger to sing karaoke with me',
    format: 'stranger_challenge',
    why_now: 'Duet-style stranger content is engagement bait — the comment section picks the next song.',
    location_suggestion: 'Karaoke bar on a slow weeknight (Union Draft House)',
    hooks: [
      'Convincing a stranger to sing karaoke with me',
      'This stranger CARRIED our duet',
      'We met 5 minutes ago and destroyed Selena',
    ],
    opening_line: '"Do you know the words to Como La Flor? Perfect. You\'re up."',
    difficulty: 2,
  },
  {
    title: 'Starting a SUIII chain at a World Cup watch party',
    format: 'stranger_challenge',
    why_now: 'World Cup 2026 fever — watch parties are packed and primed to yell on command.',
    location_suggestion: 'Sports bar during a big match (any packed watch party)',
    hooks: [
      'Starting a SUIII chain at a World Cup watch party',
      'The whole bar did the SUIII',
      'One stranger started it. 200 finished it.',
    ],
    opening_line: '"On three, everybody... UNO, DOS, TRES—"',
    difficulty: 3,
    rarity: 'legendary',
  },
  {
    title: 'Proposing to a stranger with a banda (again)',
    format: 'stranger_challenge',
    why_now: 'The original mariachi proposal is his proven banger — the banda remix is the sequel fans keep requesting.',
    location_suggestion: 'Busy outdoor plaza or mercado on a Saturday',
    hooks: [
      'Proposing to a stranger with a banda (again)',
      'She said... maybe??',
      'The banda would not stop playing',
    ],
    opening_line: '"Excuse me — this is going to sound crazy, but the band is already paid for."',
    difficulty: 4,
  },
  {
    title: "POV: Abuela's first time at a smoothie bar",
    format: 'character_pov',
    why_now: 'Abuela characters are evergreen bilingual gold; health-food menus write the jokes themselves.',
    location_suggestion: 'Trendy smoothie/açaí bar (west side)',
    hooks: [
      "POV: Abuela's first time at a smoothie bar",
      'Abuela vs the $14 smoothie',
      '"¿Catorce dólares?!" — abuela, devastated',
    ],
    opening_line: '"¿Qué es... açaí? ¿Eso se come?"',
    difficulty: 2,
  },
  {
    title: "George Washington tries takis for the first time",
    format: 'character_pov',
    why_now: 'His George Washington bit has proven pull — takis heat reaction adds a borderland twist.',
    location_suggestion: 'Gas station / convenience store snack aisle',
    hooks: [
      'George Washington tries takis for the first time',
      'The founding fathers were NOT ready for takis',
      'George Washington discovers chamoy',
    ],
    opening_line: '"What manner of crimson scroll is this?"',
    difficulty: 2,
  },
  {
    title: 'POV: the waiter when I order for 45 minutes',
    format: 'employee_flip',
    why_now: 'Employee-perspective flips of his own bits give fans the other camera angle they ask for in comments.',
    location_suggestion: 'Diner with a patient server (ask a partner restaurant)',
    hooks: [
      'POV: the waiter when I order for 45 minutes',
      'What the waiter sees when I walk in',
      'The waiter POV nobody asked for (everybody asked)',
    ],
    opening_line: '*deep breath* "Welcome back, Pablo."',
    difficulty: 2,
  },
  {
    title: 'POV: the barista who has to spell my order',
    format: 'employee_flip',
    why_now: 'Flip of the yelling series — the barista side writes itself and cross-promotes the franchise.',
    location_suggestion: 'Coffee shop counter (partner Starbucks)',
    hooks: [
      'POV: the barista who has to spell my order',
      'The cup was not big enough for this order',
      'Barista speedrun: my 27-word order',
    ],
    opening_line: '*marker squeaking intensifies*',
    difficulty: 1,
  },
  {
    title: 'Hiding a mariachi band in a study library',
    format: 'absurd_companion',
    why_now: 'Finals season on local campuses — silent space + full mariachi is his loudest-contrast setup yet.',
    location_suggestion: 'UTEP library area (public, film-friendly zones)',
    hooks: [
      'Hiding a mariachi band in a study library',
      'Silent floor. Full mariachi.',
      'The librarian let them finish the song',
    ],
    opening_line: '*whispers* "Ahorita no... okay AHORITA."',
    difficulty: 4,
    rarity: 'epic',
  },
  {
    title: 'Buying every rose from a street vendor for strangers',
    format: 'out_of_business',
    why_now: 'Wholesome buyout + strangers receiving flowers = his exact tone, endlessly clippable.',
    location_suggestion: 'Intersection rose vendor (Zaragoza & Montwood)',
    hooks: [
      'Buying every rose from a street vendor for strangers',
      'Putting the rose guy out of business (wholesomely)',
      '100 roses. 100 strangers. 1 crying vendor.',
    ],
    opening_line: '"How much for the bucket? No — all the buckets."',
    difficulty: 3,
  },
]

const rarityBoost: Record<NonNullable<RollFilters['effort']>, Difficulty[]> = {
  quick: [1, 2],
  medium: [2, 3],
  production: [3, 4, 5],
}

function toIdea(seed: SeedIdea, rng: () => number): Idea {
  const rarity = seed.rarity ?? rollRarity(rng)
  return {
    id: uid('idea'),
    title: seed.title,
    format: seed.format,
    rarity,
    why_now: seed.why_now,
    location_suggestion: seed.location_suggestion,
    hooks: seed.hooks,
    opening_line: seed.opening_line,
    difficulty: seed.difficulty,
    xp_reward: XP_BY_DIFFICULTY[seed.difficulty],
    status: 'rolled',
    created_at: new Date().toISOString(),
  }
}

function shuffled<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function mockRoll(
  count: number,
  filters?: Partial<RollFilters>,
  rng: () => number = Math.random,
): Idea[] {
  let pool = SEEDS
  if (filters?.format) pool = pool.filter((s) => s.format === filters.format)
  if (filters?.effort) {
    const allowed = rarityBoost[filters.effort]
    const filtered = pool.filter((s) => allowed.includes(s.difficulty))
    if (filtered.length >= count) pool = filtered
  }
  if (pool.length === 0) pool = SEEDS
  return shuffled(pool, rng).slice(0, count).map((s) => toIdea(s, rng))
}

/** Light ideas for auto-generated daily quests (difficulty <= 2). */
export function mockDailySeeds(rng: () => number, count: number): Idea[] {
  const light = SEEDS.filter((s) => s.difficulty <= 2)
  return shuffled(light, rng)
    .slice(0, count)
    .map((s) => toIdea({ ...s, rarity: undefined }, rng))
}

/** A believable variant re-roll: same format, different seed. */
export function mockVariant(format: FormatKey, excludeTitle: string): Idea {
  const pool = SEEDS.filter((s) => s.format === format && s.title !== excludeTitle)
  const seed = pool[Math.floor(Math.random() * pool.length)] ?? SEEDS[0]
  return toIdea(seed, Math.random)
}

export function mockBriefing(): TrendBriefing {
  return {
    date: toDayKey(),
    trends: [
      {
        title: 'World Cup 2026 fever hits the border',
        summary:
          'With the tournament hosted across North America this summer, watch-party content, fan-cam bits, and SUIII chains are pulling massive regional engagement.',
        why_relevant: 'His crowd-challenge format + fútbol-crazy EP/Juárez audience is a perfect storm.',
      },
      {
        title: '"Order for the whole line" acts of kindness',
        summary:
          'Paying-it-forward drive-thru videos are resurging, with creators covering entire lines and filming reactions.',
        why_relevant: 'Maps 1:1 onto his out-of-business format with a wholesome twist he already owns.',
      },
      {
        title: 'Employee-reaction POV flips',
        summary:
          'Worker-side POVs of viral customer bits are outperforming the original bits themselves this month.',
        why_relevant: 'He can flip his own yelling-order franchise and double-dip the same shoot.',
      },
      {
        title: 'Street vendor spotlights',
        summary:
          'Elote men, raspa carts, and rose vendors are trending as creators buy out carts and split the haul with strangers.',
        why_relevant: 'Borderland street-vendor culture is his home turf — instant authenticity.',
      },
      {
        title: 'Heatwave survival content',
        summary:
          'Extreme-heat bits (cooking eggs on sidewalks, raspa taste-tests, misting strangers) spike every July in the Southwest.',
        why_relevant: 'El Paso summers are content fuel — absurd companion bits + heat = easy wins.',
      },
    ],
    upcoming_dates: [
      { date: '2026-07-04', label: 'Fourth of July', content_angle: 'George Washington at the fireworks stand — character POV layup.' },
      { date: '2026-07-10', label: 'World Cup semifinals week', content_angle: 'Pre-film watch-party crowd challenges before the final sells out attention.' },
      { date: '2026-07-19', label: 'World Cup Final', content_angle: 'Boss quest territory: the biggest crowd moment of the year.' },
      { date: '2026-07-24', label: 'National Tequila Day', content_angle: 'Yelling a mocktail order at a tequila bar — franchise episode with a date hook.' },
    ],
    seasonal_alert:
      'World Cup Final is July 19 — lock watch-party locations and pre-film reaction setups NOW. This window will not come back for four years.',
  }
}
