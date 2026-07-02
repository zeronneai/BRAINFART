/**
 * CREATOR DNA — the white-label seam.
 *
 * Everything the AI needs to generate ideas in ONE creator's voice lives in
 * this file. Onboarding a new client = writing a new DNA object; nothing else
 * in the app (or the /api prompts that import this) has to change.
 */

import type { FormatKey } from './types'

export interface FormatDef {
  key: FormatKey
  label: string
  description: string
  examples: string[]
}

export interface CreatorDNA {
  id: string
  name: string
  handle: string
  audience: string
  region: string
  language: string
  formats: FormatDef[]
  toneRules: string[]
  titleRules: string[]
  culturalAnchors: string[]
}

export const PABLO_DNA: CreatorDNA = {
  id: 'pablo-yee-v1',
  name: 'Pablo Yee',
  handle: '@pablopyee',
  audience: '351K Instagram followers, POV prank / street-content fans',
  region: 'El Paso, TX / Ciudad Juárez borderland',
  language: 'English default, bilingual EN/ES market',
  formats: [
    {
      key: 'yelling_order',
      label: 'Yelling My Order',
      description:
        'Recurring franchise series: yelling the order at the top of his lungs at a different business every episode. Same bit, new location, new employee reaction.',
      examples: [
        'Yelling my order at the top of my lungs at Starbucks',
        'Yelling my order at the top of my lungs at Chick-fil-A drive-thru',
      ],
    },
    {
      key: 'out_of_business',
      label: 'Putting X Out of Business',
      description:
        'Over-ordering absurd amounts at restaurants and chains, always ending wholesome — huge tips, giving the food away to strangers or shelters.',
      examples: [
        'Putting Chipotle out of business',
        "Putting McDonald's out of business (ordering 100 McChickens)",
      ],
    },
    {
      key: 'absurd_companion',
      label: 'Absurd Companion Bits',
      description:
        'Bringing a ridiculous object or an army of objects into a normal public setting and playing it completely straight.',
      examples: [
        'Taking 100 stuffed animals out to hibachi',
        'Putting a watermelon on my roof',
        "Hiding the world's loudest speaker in a library",
      ],
    },
    {
      key: 'authority_wholesome',
      label: 'Authority-Figure Wholesome Chaos',
      description:
        'Disarmingly wholesome interactions with police officers and authority figures. The officers always come out looking great.',
      examples: [
        'Begging police officers to cuddle me',
        'Begging police officers to put me in handcuffs',
        'Rizzing up 3 girl cops',
      ],
    },
    {
      key: 'stranger_challenge',
      label: 'Stranger Challenges',
      description:
        'Convincing strangers or crowds to join something absurd and joyful. Big public payoff moments.',
      examples: [
        'Proposing to a stranger with a Mariachi band',
        'Convincing a stranger to go to a BTS concert with me',
        'Convincing a crowd of World Cup fans to yell SUIII with me',
      ],
    },
    {
      key: 'character_pov',
      label: 'Character / Skit POVs',
      description:
        'Committed character work dropped into real public places, filmed POV-style with real reactions.',
      examples: [
        "George Washington's first time at Subway",
        "Ordering food but I'm bipolar af",
        "POV: I'm the world's best roommate",
      ],
    },
    {
      key: 'employee_flip',
      label: 'Employee-Perspective Flips',
      description:
        "The bit seen from the worker's side of the counter — reactions, deadpan service, behind-the-register POV.",
      examples: [
        'POV: the Starbucks barista when I walk in',
        'What the drive-thru worker sees at 2am',
      ],
    },
  ],
  toneRules: [
    'Chaotic but wholesome — never mean-spirited.',
    'Businesses, workers, and strangers must always come out looking good.',
    'Nothing illegal, nothing that genuinely harasses people.',
    'Real reactions from real people are the product — no staged extras.',
    'Filmable by one person + a camera person, in public, low budget.',
    'Endings lean generous: big tips, free food for strangers, hugs.',
  ],
  titleRules: [
    'Titles are 9 words or fewer.',
    'First-person present tense ("Yelling...", "Putting...", "Convincing...", "POV: ...").',
    'The title IS the hook — it must be filmable exactly as written.',
  ],
  culturalAnchors: [
    'Mexican restaurants and food culture (both sides of the border)',
    'Mariachi bands',
    'World Cup fever / fútbol culture',
    'Bilingual EN/ES wordplay',
    'Desert-southwest borderland life (El Paso ⇄ Juárez)',
  ],
}

/** Active DNA for this deployment. Swap per client. */
export const ACTIVE_DNA = PABLO_DNA

export const FORMAT_LABELS: Record<FormatKey, string> = Object.fromEntries(
  PABLO_DNA.formats.map((f) => [f.key, f.label]),
) as Record<FormatKey, string>
