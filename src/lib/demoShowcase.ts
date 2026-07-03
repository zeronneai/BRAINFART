/**
 * ⚠️ DEMO / SALES SHOWCASE — HAND-AUTHORED ILLUSTRATIVE EXAMPLES.
 *
 * These are NOT live model output. They are polished, on-brand example idea
 * cards written by hand to show what the generator TARGETS: each of the 7
 * NICHE_META_PATTERNS localized to Pablo's El Paso / Juárez market, in his
 * wholesome voice. Use them to walk Pablo through the concept even when the
 * live API is mid-generation or slow.
 *
 * They match the real `Idea` schema exactly so they render identically to a
 * live roll — but they are surfaced only behind an OFF-by-default showcase
 * flag (see `showcaseEnabled`) and are clearly badged in the UI. They never
 * enter the store, never grant XP, and never touch the real generation path
 * or the fresh-start economy.
 */

import type { Idea } from './types'

/** Fixed timestamp so these examples are deterministic (never "now"). */
const SHOWCASE_TS = '2026-07-03T12:00:00.000Z'

export const SHOWCASE_IDEAS: Idea[] = [
  // ── 1. RECURRING CHARACTER ────────────────────────────────────────────
  {
    id: 'showcase-recurring-character',
    title: 'Taking my piñata Paco on a dinner date',
    format: 'absurd_companion',
    rarity: 'rare',
    why_now: 'Summer date-night season — a recurring mascot fans start asking for by name.',
    location_suggestion: 'L&J Cafe (the "Old Place by the Graveyard"), Central El Paso',
    hooks: [
      'Taking my piñata Paco on a dinner date',
      'My piñata Paco tries L&J Cafe for the first time',
      'Date night with the most patient piñata in El Paso',
    ],
    opening_line: '"Table for two — he\'s a little fragile, be gentle."',
    difficulty: 2,
    xp_reward: 90,
    script: {
      hook: 'Walk into L&J holding a full-size piñata in the passenger seat like a real date.',
      setup:
        'Ask the host for "a booth for me and Paco," pull out his chair, tuck a napkin into his little paper collar.',
      beats: [
        'Order for both of us — "he\'ll have the enchiladas, he\'s watching his figure."',
        'Narrate Paco\'s "reactions" totally deadpan while real diners smile.',
        'Waiter plays along and brings Paco his own chips and salsa.',
      ],
      payoff:
        'Leave a big tip and a note: "Paco says gracias, best service in El Paso." The staff are laughing, everyone looks good.',
      pinned_comment: 'Where should Paco and I go next? Drop your favorite El Paso spot 👇🪅',
    },
    inspired_by: 'jaydatroll_ (recurring character)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },

  // ── 2. REPETITION COUNTER ─────────────────────────────────────────────
  {
    id: 'showcase-repetition-counter',
    title: 'Seeing how many times I can yell my order',
    format: 'yelling_order',
    rarity: 'epic',
    why_now: 'His signature "yelling my order" franchise fused with the on-screen counter mechanic blowing up right now.',
    location_suggestion: 'Whataburger drive-thru, Zaragoza Rd, East El Paso',
    hooks: [
      'Seeing how many times I can yell my order',
      'Yelling my order until the whole drive-thru cheers',
      'How many times can I re-order before they crack?',
    ],
    opening_line: '"WELCOME TO WHATABURGER CAN I PLEASE GET A NUMBER ONE!!"',
    difficulty: 3,
    xp_reward: 150,
    script: {
      hook: 'Pull up and yell the full order at the top of my lungs — counter pops on screen: "Attempt 1."',
      setup: 'Circle the drive-thru and do it again, louder. Counter ticks: 2… 3… 4.',
      beats: [
        'Each loop the worker leans further out the window grinning.',
        'By attempt 5 the whole kitchen is watching for the next lap.',
        'Attempt 6: the worker yells it back with me in perfect sync.',
      ],
      payoff:
        'Buy the entire crew\'s lunch for being good sports — they get the last laugh and the free meal.',
      pinned_comment: 'What number should I stop at next time? 🗣️🍔 #Whataburger',
    },
    inspired_by: 'jaydatroll_ (repetition counter)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },

  // ── 3. COSTUME-IN-MUNDANE ─────────────────────────────────────────────
  {
    id: 'showcase-costume-mundane',
    title: 'Grocery shopping dressed as a luchador at H-E-B',
    format: 'character_pov',
    rarity: 'common',
    why_now: 'Summer heat = everyone\'s at H-E-B; lucha libre is peak border-culture crossover.',
    location_suggestion: 'H-E-B on N Zaragoza, East El Paso',
    hooks: [
      'Grocery shopping dressed as a luchador at H-E-B',
      'Doing my weekly grocery run in a full lucha mask',
      'A luchador buys ingredients for Sunday menudo',
    ],
    opening_line: '"Just here for the menudo ingredients, jefe." *never breaks character*',
    difficulty: 2,
    xp_reward: 90,
    script: {
      hook: 'Push a cart through H-E-B in a full luchador mask and cape, 100% serious.',
      setup: 'Carefully inspect avocados, do a slow dramatic pose while comparing tortilla brands.',
      beats: [
        'Kids point and gasp — give them a heroic nod.',
        'Ask the butcher for "the cut of a champion" for Sunday menudo.',
        'Bag boy asks for a photo — strike the pose with him.',
      ],
      payoff: 'Buy the star-struck kid\'s family their groceries. El héroe del H-E-B saves the day.',
      pinned_comment: 'What should my luchador name be? 🎭 #ElPaso',
    },
    inspired_by: 'juicy.jacobb (costume-in-mundane)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },

  // ── 4. CATCHPHRASE LOOP ───────────────────────────────────────────────
  {
    id: 'showcase-catchphrase-loop',
    title: "Getting all of Chico's Tacos to yell órale",
    format: 'stranger_challenge',
    rarity: 'rare',
    why_now: 'A repeatable bilingual chant fans can quote — built to farm comments.',
    location_suggestion: "Chico's Tacos, Alameda Ave, El Paso",
    hooks: [
      "Getting all of Chico's Tacos to yell órale",
      'Starting an órale chant in the most El Paso place ever',
      'Can I get a whole taco shop to say my catchphrase?',
    ],
    opening_line: '"When I say ÓRA, you say LE. ÓRA—"',
    difficulty: 3,
    xp_reward: 150,
    script: {
      hook: 'Stand up mid-lunch rush at Chico\'s: "El Paso, when I say ÓRA, you say LE!"',
      setup: 'Start small — two tables answer back. Hype them up, go again louder.',
      beats: [
        'The line at the register joins in.',
        'The cooks bang the counter to the rhythm.',
        'The whole place is chanting "ÓRA-LE" in sync.',
      ],
      payoff: 'Buy a round of the double-order rolled tacos for the loudest table. Everybody wins.',
      pinned_comment: 'Comment ÓRALE if you\'d have joined in 🌮🔊',
    },
    inspired_by: 'juicy.jacobb (catchphrase loop)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },

  // ── 5. POV KINDNESS ───────────────────────────────────────────────────
  {
    id: 'showcase-pov-kindness-raspa',
    title: 'POV: I pay for every raspa at the park',
    format: 'out_of_business',
    rarity: 'common',
    why_now: '100°+ El Paso summer — free raspas are the ultimate feel-good in a heat wave.',
    location_suggestion: 'Raspa stand at Ascarate Park, El Paso',
    hooks: [
      'POV: I pay for every raspa at the park',
      'Buying out the raspa cart so every kid gets one free',
      'Beating the El Paso heat one free raspa at a time',
    ],
    opening_line: '"Everybody\'s raspa is on me today — what flavor?"',
    difficulty: 2,
    xp_reward: 90,
    script: {
      hook: 'Walk up to the raspa cart: "How much for ALL of them today?"',
      setup: 'Tell the next family in line their raspas are already paid for. Film their double-take.',
      beats: [
        'Kids sprint over when word spreads across the park.',
        'The raspa vendor can barely keep up — I jump in to help scoop.',
        'Everyone toasts their raspas in the shade.',
      ],
      payoff: 'Vendor sells out early and goes home with a full day\'s pay plus a fat tip. Pure wholesome.',
      pinned_comment: 'Best raspa flavor, go — I\'ll settle this debate 🍧',
    },
    inspired_by: 'edwardstaxed (POV kindness)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },
  {
    id: 'showcase-pov-kindness-tickets',
    title: 'POV: you dropped your World Cup tickets',
    format: 'character_pov',
    rarity: 'epic',
    why_now: 'World Cup 2026 is happening RIGHT NOW — dropped tickets are everyone\'s worst nightmare.',
    location_suggestion: 'Outside San Jacinto Plaza watch party, Downtown El Paso',
    hooks: [
      'POV: you dropped your World Cup tickets',
      'Returning World Cup tickets to a stranger downtown',
      'Chasing a guy down to give back his tickets',
    ],
    opening_line: '"¡Oye! Hermano — you dropped these, are these yours?"',
    difficulty: 3,
    xp_reward: 150,
    script: {
      hook: 'Spot a "dropped" envelope of World Cup tickets near the downtown watch party and chase the owner down.',
      setup: 'Catch up to a stranger: "These fell out of your pocket, right?" Watch the panic-to-relief flip.',
      beats: [
        'He frantically checks his pockets — realizes they\'re really his.',
        'Genuine relief, big hug, the crowd around us cheers.',
        'He tries to give me a reward — I wave it off.',
      ],
      payoff: '"Just enjoy the game, hermano." He walks off buzzing. Honesty is the whole flex.',
      pinned_comment: 'Would you have kept them or returned them? Be honest 👀⚽',
    },
    inspired_by: 'edwardstaxed (POV kindness)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },

  // ── 6. FAMILY FRANCHISE ───────────────────────────────────────────────
  {
    id: 'showcase-family-franchise-abuela',
    title: 'Taking my abuela to rate every taquería',
    format: 'stranger_challenge',
    rarity: 'rare',
    why_now: 'Recurring "abuela rates it" franchise — a cast fans come back for every week.',
    location_suggestion: 'Taquería tour: Tacos Don Cuco → Elemi → a Juárez street stand',
    hooks: [
      'Taking my abuela to rate every taquería',
      'My abuela is the toughest taco critic in El Paso',
      'Grandma rates El Paso taquerías 1 to 10',
    ],
    opening_line: '"Abuela, honest score — no mercy. How\'s the salsa?"',
    difficulty: 3,
    xp_reward: 150,
    script: {
      hook: 'Buckle abuela in: "Today we find the best taco on the border, and you\'re the judge."',
      setup: 'At each spot she inspects the tortilla, tastes the salsa, gives a deadpan number.',
      beats: [
        'She roasts a limp tortilla — the taquero laughs and promises to do better.',
        'One salsa makes her nod slowly: an instant 9.',
        'She and the cook end up trading recipes.',
      ],
      payoff: 'The winning taquería gets abuela\'s official seal — and a rush of customers from the video.',
      pinned_comment: 'Which El Paso taquería should abuela judge next? 👵🌮',
    },
    inspired_by: 'lilsafiy (family franchise)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },
  {
    id: 'showcase-family-franchise-primo',
    title: 'Teaching my little primo to order in Spanish',
    format: 'character_pov',
    rarity: 'common',
    why_now: 'Back-to-school season — a wholesome, relatable family bit any border kid knows.',
    location_suggestion: 'Kiki\'s Restaurant, Central El Paso',
    hooks: [
      'Teaching my little primo to order in Spanish',
      'My primo orders for the whole family for the first time',
      'Coaching my little cousin through his first Spanish order',
    ],
    opening_line: '"Okay primo, you got this — dile a la señora what you want."',
    difficulty: 1,
    xp_reward: 50,
    script: {
      hook: 'Hype up my nervous little primo before the waitress comes: "You\'re ordering for everyone today."',
      setup: 'Whisper him the words; he takes a big breath and goes for it.',
      beats: [
        'He nails "quesadilla de queso, por favor" — table erupts.',
        'The waitress plays along and treats him like the man of the house.',
        'He gets bolder and orders the dessert too.',
      ],
      payoff: 'Waitress brings him a free flan "for the best Spanish today." He\'s glowing. Familia wins.',
      pinned_comment: 'What was YOUR first Spanish order? 🥺 #familia',
    },
    inspired_by: 'lilsafiy (family franchise)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },

  // ── 7. LOCAL-BUSINESS SPOTLIGHT ───────────────────────────────────────
  {
    id: 'showcase-local-spotlight',
    title: "Ungatekeeping El Paso's best hidden taquería",
    format: 'out_of_business',
    rarity: 'rare',
    why_now: 'Summer road-trip / foodie season — "ungatekeeping" local spots is the format that sends real customers.',
    location_suggestion: 'A family-run taquería off Alameda Ave, Lower Valley El Paso',
    hooks: [
      "Ungatekeeping El Paso's best hidden taquería",
      'The taquería El Paso keeps trying to gatekeep',
      'Putting the best hole-in-the-wall taco spot on blast',
    ],
    opening_line: '"El Paso\'s gonna be mad I\'m showing you this one."',
    difficulty: 2,
    xp_reward: 90,
    script: {
      hook: 'Pull up to an unmarked family taquería: "Nobody wants me to post this place — so obviously I\'m posting it."',
      setup: 'Order one of everything, hype up the owner\'s abuela recipe on camera.',
      beats: [
        'Show the tortillas being pressed by hand.',
        'React to the first bite — genuinely floored.',
        'Owner shyly admits business has been slow this summer.',
      ],
      payoff: 'Tip huge and tell the city to pull up. By the weekend there\'s a line out the door.',
      pinned_comment: 'Tag the El Paso spot YOU\'RE done gatekeeping 🤫🌮',
    },
    inspired_by: 'elizabetheatsnyc (local-business spotlight)',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },

  // ── LEGENDARY: the perfect storm (local spotlight × mariachi × World Cup) ──
  {
    id: 'showcase-legendary-mariachi',
    title: 'Bringing mariachi to surprise my favorite taquero',
    format: 'stranger_challenge',
    rarity: 'legendary',
    why_now: 'World Cup 2026 fever + celebrating a struggling local hero = perfect-storm feel-good moment.',
    location_suggestion: "The taquero's stand near San Jacinto Plaza, Downtown El Paso",
    hooks: [
      'Bringing mariachi to surprise my favorite taquero',
      'Surprising the hardest-working taquero in El Paso',
      'A full mariachi shuts down the block for one taquero',
    ],
    opening_line: '"You\'ve fed this city for 20 years — today the city sings for you."',
    difficulty: 5,
    xp_reward: 400,
    script: {
      hook: 'Roll up to the taco stand with a full mariachi band mid-World-Cup-watch-party downtown.',
      setup: 'The taquero looks up confused as the mariachi surrounds his stand and starts playing.',
      beats: [
        'The whole plaza turns; the watch-party crowd gathers around.',
        'I read out how many years he\'s fed the neighborhood — he tears up.',
        'The crowd chants his name between mariachi songs.',
      ],
      payoff:
        'Buy out his entire stock so he closes early, hand him the tips jar overflowing, and the crowd walks him off like a champion. Everybody — taquero, crowd, city — comes out looking good.',
      pinned_comment: 'Tag an El Paso small-business owner who deserves this next 🎺❤️⚽',
    },
    inspired_by: 'elizabetheatsnyc (local-business spotlight) × mariachi',
    status: 'rolled',
    created_at: SHOWCASE_TS,
  },
]

/**
 * Whether the showcase is AVAILABLE (the toggle chip is shown). OFF for normal
 * users. Turns on when the URL carries `?showcase` (persisted to localStorage)
 * so it can be demoed in production without exposing it to real users. The
 * toggle itself still defaults to OFF — nothing renders until it's flipped.
 */
export function showcaseEnabled(): boolean {
  try {
    if (typeof window === 'undefined') return false
    if (new URLSearchParams(window.location.search).has('showcase')) {
      localStorage.setItem('brainfart-showcase', 'on')
      return true
    }
    return localStorage.getItem('brainfart-showcase') === 'on'
  } catch {
    return false
  }
}
