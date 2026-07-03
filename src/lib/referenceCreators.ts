// ============================================================================
// referenceCreators.ts
// Style references for the BRAINFART idea engine.
// These are NICHE creators in Pablo Yee's space. The AI studies their FORMATS
// and MECHANICS as inspiration, then adapts everything into Pablo's own voice
// and El Paso context. NEVER copy a specific video 1:1 — patterns only.
// This file is a white-label seam: swap it per client.
// ============================================================================

export interface ReferenceCreator {
  handle: string;
  name: string;
  followers: string;
  niche: string;
  signatureFormats: string[];   // recurring franchises / repeatable bits
  mechanic: string;             // WHY the content works
  sampleTitles: string[];       // real titles observed (inspiration, not to copy)
  toneNotes: string;            // how it relates to Pablo's wholesome tone
}

export const REFERENCE_CREATORS: ReferenceCreator[] = [
  {
    handle: "porterjug",
    name: "Porter",
    followers: "182K",
    niche: "Prop-comedy 'hacking' bits in convenience stores & gas stations",
    signatureFormats: [
      "Fake 'hacking' a store/ATM/chip-reader with an absurd briefcase rig",
      "Recurring 'AI robot / droid' character helping commit absurd 'crimes'",
      "Scaring / testing night-shift and retail workers",
      "Explaining the absurd bit to real police officers with a straight face",
    ],
    mechanic:
      "A ridiculous fake-tech prop (briefcase 'mainframe', droid) played 100% deadpan against real employees and cops. The gap between the serious delivery and the stupid prop is the joke. Recurring props/characters build a universe fans recognize.",
    sampleTitles: [
      "fake hacking prank cops called",
      "Hacking a store using Chat-GPT",
      "playing malicious sounds while using ATM",
      "Scaring night shift workers taking out trash",
      "Explaining my droid to the police",
      "Best drive thru hacking moments",
    ],
    toneNotes:
      "Deadpan-absurd, harmless. Fits Pablo if kept wholesome (workers in on the laugh, cops end up amused). Borrow the recurring-prop/character idea.",
  },
  {
    handle: "jaydatroll_",
    name: "Jeremy Shields",
    followers: "722K",
    niche: "Recurring-character + repetition-counter public stunts",
    signatureFormats: [
      "Recurring 'Teddy Tim' / stuffed-animal character taken on dates & to public places",
      "'Seeing how many times I can [check out / get a refill / order] in a row' repetition bits",
      "Bringing an animal (chicken, lobster) into a business that clearly doesn't allow it",
      "Blasting a specific song ('Obsession') in drive-thrus / public",
    ],
    mechanic:
      "Two engines: (1) a repetition counter that visibly escalates (attempt 2 → 5 → 8) creating suspense about when staff crack, and (2) a recurring character (Teddy Tim, Lobster Larry) that fans follow across videos. The number on screen IS the hook.",
    sampleTitles: [
      "Seeing how many times I can check out in a row",
      "Seeing how many times I can get a refill",
      "Taking a chicken to the vet",
      "Sneaking Lobster Larry into Red Lobster",
      "Blasting Obsession in the drive thru",
      "Taking Teddy Tim on a double date",
    ],
    toneNotes:
      "Wholesome, staff-friendly. The repetition-counter format is highly transferable to Pablo (e.g. 'Seeing how many times I can yell my order in a row'). Strong recurring-character lesson.",
  },
  {
    handle: "edwardstaxed",
    name: "Eddie Pan",
    followers: "213K",
    niche: "POV good-deed / wholesome social-experiment stunts",
    signatureFormats: [
      "'POV: you dropped something' returning items / kindness bait",
      "Setting up two strangers on a blind date in public",
      "'POV: shooting my shot' approach bits",
      "Paying strangers to do wholesome things ('make me banana bread for $100')",
      "Spreading positivity / random acts at store grand openings",
    ],
    mechanic:
      "First-person POV framing ('POV: you dropped something') that puts the viewer in the interaction, resolved with a wholesome payoff. Kindness + slight social risk = shareable feel-good.",
    sampleTitles: [
      "POV: you dropped something",
      "POV: I set two strangers up on a blind date",
      "POV: shooting my shot",
      "Will you make me banana bread for $100?",
      "Spreading positivity",
    ],
    toneNotes:
      "Very close to Pablo's wholesome core. The clean 'POV:' framing + feel-good payoff is directly transferable and on-brand.",
  },
  {
    handle: "juicy.jacobb",
    name: "Jacob Vargas",
    followers: "906K",
    niche: "Costume / character cosplay dropped into mundane public places",
    signatureFormats: [
      "Superhero/pop-culture characters (Homelander, The Deep, Sea Lion) doing boring errands",
      "Mario/Luigi/Yoshi group cosplay invading lecture halls & streets",
      "'Everybody hit the Sea Lion' recurring catchphrase bit",
      "In-costume mundane tasks (grocery store, Petsmart, Home Depot)",
    ],
    mechanic:
      "Take an over-the-top costumed character and drop them into the most mundane real-world errand. The contrast (epic character + boring task) + a recurring catchphrase fans repeat = viral loop. Group costume bits amplify chaos.",
    sampleTitles: [
      "Homelander goes to the grocery store",
      "The Deep goes to Petsmart",
      "Everybody hit the Sea Lion",
      "You know Princess Peach likes getting kidnapped...",
    ],
    toneNotes:
      "Character-in-public overlaps Pablo's 'George Washington at Subway'. Keep costumes/IP generic-safe (avoid tightly-licensed characters in Pablo's version). Great catchphrase lesson.",
  },
  {
    handle: "tommytuffknuckless",
    name: "TommyTuffKnuckles",
    followers: "181K",
    niche: "Shock-prank + gross-out public bits",
    signatureFormats: [
      "'Ordering food with Tourette's' escalating-outburst bit",
      "Gross-out props (giant turd prank, dirty-feet pedicure)",
      "'My friends stuck in the dryer' setups in appliance stores",
      "Boxing/fight-promo style crossover content",
    ],
    mechanic:
      "Shock value + escalation played for reactions. NOTE: several bits here lean edgier/grosser than Pablo's lane.",
    sampleTitles: [
      "Ordering food with Tourette's",
      "My friends stuck in the dryer prank",
      "Getting a pedicure with dirty feet",
    ],
    toneNotes:
      "USE WITH CAUTION. Keep only the escalation-in-public and appliance-store-setup mechanics. DO NOT replicate the mocking/gross-out or disability-mimic bits — off-brand and potentially offensive for Pablo. Filtered heavily.",
  },
  {
    handle: "lilsafiy",
    name: "Safiy",
    followers: "276K",
    niche: "Awkward-humor + recurring 'dad glasses' family bits",
    signatureFormats: [
      "'Awkwardly laughing in public' recurring bit at ice cream / food counters",
      "'Picking up my [ethnic] dad's glasses/prescription' recurring family franchise",
      "Companion-character public dates (Buzz Lightyear, Pikachu on a hibachi date)",
      "'Paying strangers to laugh for a minute straight' social bits",
    ],
    mechanic:
      "A recurring relatable 'bit persona' (the awkward laugher) plus a family-franchise format ('picking up my dad's glasses') that gets re-skinned with different ethnic dads. Relatability + repeatable template.",
    sampleTitles: [
      "Awkwardly laughing in public",
      "Picking up my Italian dad's glasses",
      "Taking Pikachu on a hibachi date",
      "Paying strangers to laugh for a minute straight",
    ],
    toneNotes:
      "Wholesome, relatable. The 'companion character on a date' and family-franchise templates map cleanly onto Pablo (he already does stuffed-animal dinners). Avoid the one-off edgy titles seen in the grid.",
  },
  {
    handle: "elizabetheatsnyc",
    name: "Elizabeth",
    followers: "480K",
    niche: "Food-focused NYC eats with character/costume flair",
    signatureFormats: [
      "'Ungatekeeping' local eats — showcasing hole-in-the-wall spots",
      "Eating in absurd costumes / historical dress (Elizabethan ruff, colonial)",
      "Big seafood boils / messy-eating spectacle",
      "Location-hopping food tours tied to landmarks",
    ],
    mechanic:
      "Local-food discovery ('ungatekeeping') is the value hook; costume/character adds personality so it's not just another food account. Strong local-business spotlight angle.",
    sampleTitles: [
      "ungatekeeping NYC's eats",
      "[eating in Elizabethan costume]",
    ],
    toneNotes:
      "The 'ungatekeeping local eats' + local-business-spotlight angle is GOLD for Pablo's El Paso/Juárez market (Chico's Tacos, L&J, local taquerias). Wholesome, pro-small-business — perfectly on brand.",
  },
];

// Cross-creator patterns the idea engine should exploit:
export const NICHE_META_PATTERNS = [
  "RECURRING CHARACTER: a named prop/mascot fans follow across videos (Teddy Tim, Lobster Larry, the droid). Build Pablo his own.",
  "REPETITION COUNTER: 'seeing how many times I can X in a row' — the on-screen number is the hook and the suspense.",
  "COSTUME-IN-MUNDANE: epic/historical character doing a boring errand (Pablo already does George Washington).",
  "CATCHPHRASE LOOP: a repeatable line fans quote ('Everybody hit the Sea Lion').",
  "POV KINDNESS: 'POV:' framing + wholesome payoff (returning items, setting up strangers).",
  "FAMILY FRANCHISE: a re-skinnable template ('picking up my [X] dad's glasses').",
  "LOCAL-BUSINESS SPOTLIGHT: 'ungatekeeping' local hole-in-the-wall spots — huge for the El Paso/Juárez market.",
  "ESCALATION IN PUBLIC: a bit that visibly builds beat by beat until staff/strangers react.",
];
