/**
 * All UI copy lives here — nothing user-facing is hardcoded in components.
 * This is also the white-label i18n seam: a future locale = another COPY
 * object. Proper nouns (El Paso zones, business names) stay as-is.
 */

export const COPY = {
  brand: { name: 'BRAINFART', tagline: 'Roll ideas. Claim XP. Level up.' },

  nav: {
    roll: 'Roll',
    quests: 'Quests',
    map: 'Map',
    radar: 'Radar',
    vault: 'Vault',
    profile: 'Profile',
  },

  home: {
    pressForIdeas: 'press for ideas',
    incoming: 'incoming…',
    rollFromTrend: 'roll from this trend',
    tapHint: 'tap · hold to aim',
    brewing: 'brewing…',
    smashIt: 'Smash it. Three ideas fall out.',
    freshDrops: 'Fresh drops',
    dailyQuests: "Today's daily quests",
    open: 'open',
    buttonAria: 'Roll new ideas',
  },

  loot: {
    accept: '⚔ ACCEPT QUEST',
    bank: '🏦 Bank',
    trash: 'Not my style — teaches the generator',
    reroll: 'Roll a variant',
    whyNow: 'Why now',
    showPlaybook: 'Open the production sheet',
    legendary: '★ LEGENDARY DROP ★',
    legendaryXP: 'XP potential',
    claimMoment: 'CLAIM THE MOMENT',
    banked: 'Banked. It’ll wait in the Vault.',
    accepted: 'Quest accepted',
  },

  focused: {
    title: 'Focused Fart 🎯',
    format: 'Format',
    locationType: 'Location type',
    effort: 'Effort level',
    efforts: {
      quick: { label: 'Quick hit', hint: 'film it today' },
      medium: { label: 'Standard', hint: 'a solid shoot' },
      production: { label: 'Big production', hint: 'boss-quest energy' },
    },
    trendMode: 'Trend Mode',
    trendModeHint: 'Ground ideas in live trends & real dates',
    go: 'RELEASE THE FART',
  },

  quests: {
    title: 'Quest Log',
    cleared: 'cleared',
    tabs: { active: 'Active', available: 'Open', completed: 'Done', schedule: '🗓' },
    start: 'START QUEST',
    markFilmed: '🎥 MARK FILMED',
    markPosted: '📤 MARK POSTED',
    claim: '⚡ CLAIM',
    confirmClaim: 'CONFIRM — CLAIM XP',
    postLinkPlaceholder: 'Paste the post link (optional)',
    titles: '🪄 Titles',
    pinSpot: '📍 Pin a spot on the map',
    changeSpot: 'Change spot',
    viewPost: 'View post ↗',
    types: { daily: 'DAILY', weekly: 'WEEKLY', boss: '☠ BOSS' },
    emptyActive: {
      title: 'No active quests',
      subtitle: 'Roll some ideas and accept a quest to start earning XP.',
      cta: 'GO ROLL',
    },
    emptyOpen: {
      title: 'Nothing waiting',
      subtitle: 'Daily quests drop here every morning. Come back tomorrow — or roll your own.',
    },
    emptyDone: {
      title: 'No victories yet',
      subtitle: 'Your completed quests will pile up here. Get filming, main character.',
    },
    spotPickerTitle: 'Pin this quest to a spot 📍',
    removeSpot: 'Remove current spot',
  },

  schedule: {
    unscheduled: 'Unscheduled',
    nowTapDate: '— now tap a date',
    allScheduled: "Everything's on the board. No quests scheduled, main character? Roll more.",
    dragHint: 'Drag onto a date, or tap then tap a date',
    tapToMove: 'tap to move',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
  },

  forge: {
    title: 'Title Forge 🪄',
    placeholder: 'What actually happened on camera?',
    action: 'FORGE TITLES',
    working: 'FORGING…',
    hooks: 'Hooks — tap to copy',
    baits: 'Pinned-comment bait',
    caption: 'Caption',
    copied: '✓ copied',
  },

  map: {
    title: 'The Territory',
    subtitle: 'paint the map',
    statSpots: 'Spots conquered',
    statZones: 'Zones cleared',
    statFarthest: 'Farthest conquest',
    legend: 'Tap a pin: gray = suggested spot, accent = active quest, green = conquered.',
    conquered: '★ CONQUERED',
    activeQuest: '⚔ ACTIVE QUEST',
    conqueredOn: 'Conquered',
    linkedQuest: 'Linked quest',
    openQuestLog: 'OPEN QUEST LOG',
    viewPost: 'View the post ↗',
    rollHere: '🎲 ROLL IDEAS FOR THIS SPOT',
    zoneCleared: 'ZONE CLEARED',
    zoneClearedSub: 'Every spot conquered. The territory is yours.',
    zoneClearedCta: 'PAINT THE NEXT ONE',
    intro: 'Your territory awaits. Paint it green.',
    introCta: "LET'S PAINT",
  },

  challenges: {
    title: 'Challenges',
    kinds: { daily: 'DAILY', weekly: 'WEEKLY', zone: 'ZONE QUEST', event: 'EVENT' },
    claim: '⚡ CLAIM',
    claimed: '✓ CLAIMED',
    inProgress: 'in progress',
    combo: '🔥 COMBO ×1.5',
    comboIgnited: '🔥 COMBO IGNITED — ×1.5 XP for 48 hours',
  },

  vault: {
    title: 'The Vault 🏦',
    banked: 'banked',
    search: 'Search banked ideas…',
    allFormats: 'All formats',
    allRarities: 'All rarities',
    empty: {
      title: "Vault's empty",
      subtitle: "Bank ideas you're not ready to film yet — they'll wait here, gathering interest.",
      cta: 'ROLL SOMETHING',
    },
  },

  radar: {
    title: 'Trend Radar 📡',
    refreshed: 'refreshed daily',
    scanning: 'scanning the timeline…',
    alert: '⚠ Seasonal alert',
    topTrends: 'Top 5 in your lane',
    yourAngle: 'Your angle',
    nextDays: 'Next 14 days — plan ahead',
    rollFromThis: '🎲 ROLL IDEAS FROM THIS',
    lockedOn: 'Locked on',
  },

  profile: {
    stats: 'Career stats',
    badges: 'Badges',
    unlocked: 'UNLOCKED',
    ideasRolled: 'Ideas rolled',
    questsCompleted: 'Quests completed',
    longestStreak: 'Longest streak',
    legendaries: 'Legendaries',
    bankedIdeas: 'Banked ideas',
    totalXP: 'Total XP',
    signOut: 'Sign out',
    settings: 'Settings',
    editCharacter: '✏️ Edit character',
    accentColor: 'Accent color',
    displayName: 'Display name',
    igHandle: 'Instagram handle',
    newGame: 'NEW GAME',
    resetTitle: 'Reset save file',
    resetWarning: 'Wipes all progress — XP, quests, conquests, everything. There is no undo.',
    resetConfirm: '💀 YES, WIPE MY SAVE',
    resetCancel: 'Keep playing',
    footer: 'built by Primo AI Studio',
  },

  character: {
    title: 'Create your character',
    subtitle: 'This is who conquers El Paso.',
    editTitle: 'Edit character',
    namePlaceholder: 'Your creator name',
    slots: { base: 'Look', hair: 'Hair', headwear: 'Headwear', top: 'Fit', accessory: 'Gear' },
    aura: 'Aura',
    class: 'Pick your class',
    confirm: 'LOCK IT IN',
    xpToast: 'CHARACTER CREATED',
  },

  onboarding: {
    quest1Title: 'TUTORIAL QUEST 1 — Your first Brainfart',
    quest1Body: 'Press the big button. Ideas will fall out. Trust the process.',
    quest2Title: 'TUTORIAL QUEST 2 — Accept your destiny',
    quest2Body: 'Pick the idea you’d actually film and hit ACCEPT QUEST.',
    skip: 'Skip tutorial',
  },

  share: {
    postToIG: '📸 POST TO IG',
    prepping: 'PREPPING…',
    captionCopied: 'Caption copied — paste it in Instagram 📋',
    captionBlocked: 'Caption ready — copy blocked by browser',
    didItPost: 'Did it post? Drop the link — it feeds the map.',
    linkPlaceholder: 'instagram.com/p/…',
    save: 'SAVE',
    posted: '✓ Posted — view on IG ↗',
    linkSaved: 'Post link saved 🔗',
    nativeShare: 'Native share sheet',
  },

  detail: {
    theIdea: 'THE IDEA',
    script: 'THE SCRIPT',
    copyBlock: 'THE CAPTION',
    hook: 'Hook (0–3s)',
    setup: 'Setup (3–10s)',
    escalation: 'Escalation',
    payoff: 'Payoff',
    pinnedComment: 'Pinned comment',
    generateScript: '📝 Generate script',
    generating: 'writing the beats…',
    copyScript: 'Copy script',
    copyCaption: 'Copy caption',
    openIG: 'Open Instagram',
    scriptCopied: 'Script copied 📋',
    captionCopied: 'Caption copied — go post it',
  },

  levelUp: { label: 'LEVEL UP', cta: "LET'S GO" },

  badgesUI: { unlocked: 'Badge unlocked' },

  error: {
    title: 'You got jumped',
    subtitle: 'This screen crashed, but your save is safe. Respawn and keep playing.',
    retry: '↻ RESPAWN',
  },

  auth: {
    enter: 'ENTER THE GAME',
    createSave: 'CREATE MY SAVE',
    haveSave: 'Have a save? Sign in',
    newPlayer: 'New player? Create an account',
    loading: 'loading save…',
  },

  xp: { streak: 'streak' },

  demo: 'demo',
} as const
