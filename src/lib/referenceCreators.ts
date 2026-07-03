/**
 * REFERENCE CREATORS — the niche style-reference layer.
 *
 * Six creators in Pablo's exact lane (POV / prank / street content) whose
 * profiles we analyzed for their signature FORMATS, MECHANICS, and real sample
 * titles. This is an INSPIRATION layer the generator studies to remix proven
 * niche patterns — it is NEVER a source of voice, and never copied 1:1.
 *
 * Priority is always: Pablo's own Content DNA (creatorDNA.ts) DOMINATES. These
 * references only inform FORMAT / MECHANIC choices, adapted into Pablo's
 * wholesome El Paso voice. Anything edgier, grosser, or meaner than Pablo's
 * lane (flagged per-creator in `toneNotes` / `avoid`) is dropped entirely.
 *
 * White-label note: this is niche-level, not creator-specific. A new client in
 * the same niche can reuse this file; a client in a different niche swaps it.
 */

export interface ReferenceFormat {
  /** The recurring bit as the reference creator runs it. */
  name: string
  /** The underlying mechanic — the transferable part worth borrowing. */
  mechanic: string
  /** Real sample titles from their feed. NEVER reproduce these — study them. */
  sampleTitles: string[]
}

export interface ReferenceCreator {
  handle: string
  /** One-line read on what they're known for. */
  niche: string
  formats: ReferenceFormat[]
  /** The signature mechanics that make their content work. */
  signatureMechanics: string[]
  /**
   * Honest tone read. Where a creator runs edgier/grosser/meaner than Pablo,
   * it is called out here so the model knows to filter it.
   */
  toneNotes: string
  /** Mechanics Pablo CAN adapt (safe, transferable). */
  safeToBorrow: string[]
  /** Angles to SKIP even though this creator does them (off Pablo's lane). */
  avoid: string[]
}

/**
 * Cross-creator patterns that recur across the whole niche. These are the
 * highest-value borrowings — abstract, tone-neutral, easy to localize to
 * El Paso and drop into any of Pablo's 7 formats.
 */
export interface MetaPattern {
  key: string
  name: string
  description: string
  /** How to bend it into Pablo's voice + El Paso context. */
  adaptForPablo: string
}

export const REFERENCE_CREATORS: ReferenceCreator[] = [
  {
    handle: 'jaydatroll_',
    niche: 'Repetition-counter street pranks — the same escalating ask, over and over, with an on-screen tally.',
    formats: [
      {
        name: 'The Counter Bit',
        mechanic:
          'Do the exact same small action to strangers N times with a visible on-screen counter; the comedy is the escalation and the tally climbing.',
        sampleTitles: [
          'Asking strangers to hold my hand 100 times',
          'High-fiving everyone in the mall until they say stop',
          'Saying "you dropped this" to 50 strangers',
        ],
      },
    ],
    signatureMechanics: [
      'On-screen repetition counter (1 of 100, 2 of 100…)',
      'One tiny action, many targets, cumulative payoff',
      'The final target gives the emotional button',
    ],
    toneNotes:
      "Clean and playful. Occasionally borderline pestering — Pablo's version should keep every stranger clearly in on the joy, never annoyed.",
    safeToBorrow: ['the repetition counter', 'the climbing tally as a structural spine', 'the wholesome final beat'],
    avoid: ['anything that reads as genuinely bothering people who want to be left alone'],
  },
  {
    handle: 'tommytuffknuckless',
    niche: 'Shock / gross-out prank content — loud, chaotic, deliberately uncomfortable.',
    formats: [
      {
        name: 'Discomfort Bits',
        mechanic:
          'Commit hard to an uncomfortable premise in public and film the flinch. The engine is total commitment and a deadpan face.',
        sampleTitles: [
          'Eating strangers\' leftover food off their table',
          'Fake sneezing on people in line',
          'Pretending to be way too invested in strangers\' conversations',
        ],
      },
    ],
    signatureMechanics: [
      'Total deadpan commitment to a dumb premise',
      'Shock as the hook',
      'Fast, chaotic pacing',
    ],
    toneNotes:
      'EDGIEST OF THE SET. Frequently gross-out, mean-spirited, or at people\'s expense. Borrow ONLY the "total deadpan commitment" energy — everything else is off Pablo\'s lane.',
    safeToBorrow: ['deadpan commitment to an absurd premise', 'playing it 100% straight for the reaction'],
    avoid: [
      'gross-out / bodily-function bits',
      'anything at a stranger\'s expense',
      'mocking, disability humor, or making anyone the butt of the joke',
      'genuine discomfort or invading personal space',
    ],
  },
  {
    handle: 'theharperhouse',
    niche: 'Family-franchise pranks — a recurring cast (dad, kids, abuela) running wholesome bits together.',
    formats: [
      {
        name: 'Family Franchise',
        mechanic:
          'A recurring, named cast of family members the audience knows and roots for; the family dynamic is the through-line across every video.',
        sampleTitles: [
          'My dad tries every drink at the gas station',
          'Grandma rates the drive-thru workers',
          'Teaching my little brother to order for the whole family',
        ],
      },
    ],
    signatureMechanics: [
      'Recurring named family cast the audience bonds with',
      'Inter-generational reactions',
      'Warm, everyone-wins endings',
    ],
    toneNotes: 'Fully wholesome — closest to Pablo\'s lane. Great template to borrow directly.',
    safeToBorrow: ['recurring family cast', 'family franchise structure', 'inter-generational reaction beats'],
    avoid: ['nothing major — just keep it Pablo\'s solo-filmable scale where needed'],
  },
  {
    handle: 'costume.cody',
    niche: 'Costume-in-the-mundane character POVs — a committed character dropped into an ordinary errand.',
    formats: [
      {
        name: 'Costume in the Mundane',
        mechanic:
          'Wear a full costume / play a specific character while doing the most boring everyday task, and never break. The contrast is the joke.',
        sampleTitles: [
          'Going to the DMV dressed as a medieval knight',
          'A pirate does his weekly grocery run',
          'Returning a package as a Victorian gentleman',
        ],
      },
    ],
    signatureMechanics: [
      'Full character commitment in a boring real setting',
      'The mundane-task contrast',
      'Real bystander reactions',
    ],
    toneNotes: 'Wholesome and silly. Very compatible with Pablo\'s character/skit POV format.',
    safeToBorrow: ['costume-in-mundane contrast', 'recurring signature character', 'never breaking character'],
    avoid: ['costumes that punch down or caricature a real group'],
  },
  {
    handle: 'bigtipbrandon',
    niche: 'POV-kindness + local-business spotlights — surprising workers and small shops with generosity.',
    formats: [
      {
        name: 'POV Kindness',
        mechanic:
          'Set up like a prank, land as a genuine act of kindness — over-tipping, paying a stranger\'s tab, hyping up an overlooked worker or a struggling local spot.',
        sampleTitles: [
          'Tipping $100 on a $5 coffee',
          'Buying out the slowest food truck of the day',
          'Paying for everyone\'s order behind me until I run out',
        ],
      },
    ],
    signatureMechanics: [
      'Prank-shaped setup, kindness payoff',
      'Spotlighting a specific small local business by name',
      'Worker reaction is the emotional core',
    ],
    toneNotes: 'Wholesome by design — the reference for "everyone comes out looking good."',
    safeToBorrow: ['POV kindness payoff', 'local-business spotlight', 'over-tipping / generosity buttons'],
    avoid: ['making the generosity feel transactional or performative on camera'],
  },
  {
    handle: 'sayless.sammy',
    niche: 'Catchphrase-loop content — one signature phrase repeated as a running audio hook across every video.',
    formats: [
      {
        name: 'Catchphrase Loop',
        mechanic:
          'A single signature phrase / call-and-response the audience learns and expects; it opens or closes every bit and becomes a comment-section chant.',
        sampleTitles: [
          'I say my catchphrase to strangers until one says it back',
          'Getting the whole gym to say my line',
          'The line that gets a reaction every single time',
        ],
      },
    ],
    signatureMechanics: [
      'A learnable signature catchphrase',
      'Call-and-response with strangers/crowds',
      'Comment-bait built into the audio',
    ],
    toneNotes: 'Clean. The mechanic (a repeatable audio hook) is highly transferable.',
    safeToBorrow: ['catchphrase / call-and-response loop', 'crowd chant payoff', 'audio hook as comment-bait'],
    avoid: ['catchphrases that are crude or exclusionary'],
  },
]

export const NICHE_META_PATTERNS: MetaPattern[] = [
  {
    key: 'recurring_character',
    name: 'Recurring Character',
    description: 'A named, repeatable persona or costume the audience recognizes and returns for.',
    adaptForPablo:
      'A signature El Paso character dropped into real local spots (e.g. a committed bit at a Juárez mercado or a Westside taquería), played 100% straight.',
  },
  {
    key: 'repetition_counter',
    name: 'Repetition Counter',
    description: 'One small action repeated N times with a visible on-screen tally; escalation + final emotional button.',
    adaptForPablo:
      'Run the counter on a wholesome ask across El Paso — e.g. the same kind gesture to 50 strangers downtown, tally climbing, the last one lands the heart.',
  },
  {
    key: 'pov_kindness',
    name: 'POV Kindness',
    description: 'A prank-shaped setup that resolves into genuine generosity; the worker/stranger is the hero.',
    adaptForPablo:
      'Prank framing, generous payoff — big tips, buying out a local vendor, hyping an overlooked El Paso worker. Everyone comes out looking good.',
  },
  {
    key: 'local_business_spotlight',
    name: 'Local-Business Spotlight',
    description: 'Naming and boosting a specific small local business as the setting and the point.',
    adaptForPablo:
      'Spotlight a real El Paso / Juárez small business by type — a family taquería, a paletería, a border-town food truck — and send it customers.',
  },
  {
    key: 'catchphrase_loop',
    name: 'Catchphrase Loop',
    description: 'A learnable signature phrase / call-and-response that becomes an audio hook and comment-bait.',
    adaptForPablo:
      'A bilingual EN/ES signature line Pablo gets strangers or a World Cup crowd to chant back — built to farm replies in the comments.',
  },
  {
    key: 'family_franchise',
    name: 'Family Franchise',
    description: 'A recurring family cast the audience bonds with; the family dynamic carries every episode.',
    adaptForPablo:
      'Recurring familia bits — abuela rating drive-thru workers, teaching a primo to order — warm, bilingual, everyone-wins.',
  },
]

/**
 * Render the reference layer as a system-prompt section. Framed explicitly as
 * SUBORDINATE inspiration under Pablo's dominant DNA, with the hard tone/voice
 * rules baked in. Used by /api/generate-ideas.
 */
export function referenceInspirationPrompt(): string {
  const patterns = NICHE_META_PATTERNS.map(
    (p) => `- ${p.name}: ${p.description}\n  → In Pablo's voice: ${p.adaptForPablo}`,
  ).join('\n')

  const creators = REFERENCE_CREATORS.map((c) => {
    const formats = c.formats
      .map((f) => `    • ${f.name} — mechanic: ${f.mechanic}\n      (their real videos, DO NOT copy: ${f.sampleTitles.join(' | ')})`)
      .join('\n')
    return `  @${c.handle} — ${c.niche}\n${formats}\n    Borrow: ${c.safeToBorrow.join('; ')}.\n    SKIP: ${c.avoid.join('; ')}.\n    Tone read: ${c.toneNotes}`
  }).join('\n\n')

  return `## NICHE STYLE REFERENCE (INSPIRATION ONLY — SUBORDINATE TO PABLO'S DNA ABOVE)
You have studied 6 top creators in Pablo's exact niche (POV / prank / street content). Use their FORMATS and MECHANICS as raw material to remix into NEW ideas. This layer NEVER overrides Pablo's voice, tone, or 7 formats — it only expands the pool of mechanics you can localize into his lane.

### HIGHEST-VALUE META-PATTERNS (bias toward these — they transfer cleanly)
${patterns}

### REFERENCE CREATORS
${creators}

### HARD RULES FOR USING THIS LAYER (non-negotiable)
1. VOICE = PABLO, ALWAYS. Reference creators inform FORMAT / MECHANIC only — never voice, never phrasing. Every idea still reads unmistakably like Pablo.
2. NO 1:1 COPYING. Never output a title that essentially replicates a referenced video. Remix, combine, and localize — do not reproduce.
3. LOCALIZE TO EL PASO / JUÁREZ. Real business types, mariachi, World Cup, border culture, bilingual EN/ES.
4. TONE FILTER = PABLO'S WHOLESOME LANE. Several references (especially @tommytuffknuckless) run edgier/grosser/meaner than Pablo. SKIP entirely anything mean-spirited, gross-out, disability-mocking, invasive, or at someone's expense — even when a reference creator does it. Workers, strangers, and cops always come out looking good. When in doubt, drop it.
5. PREFER THE META-PATTERNS. Recurring character, repetition counter, POV kindness, local-business spotlight, catchphrase loop, and family franchise are the highest-value borrowings — reach for these first.`
}
