/**
 * Renders the niche style-reference layer (REFERENCE_CREATORS +
 * NICHE_META_PATTERNS) as a system-prompt section for /api/generate-ideas.
 *
 * Kept OUT of src/lib/referenceCreators.ts on purpose: that file is the
 * white-label data seam (swap per client), so the prompt-building logic lives
 * here in the API layer and simply consumes whatever data the seam exports.
 *
 * The layer is framed as SUBORDINATE inspiration under Pablo's dominant DNA:
 * it informs FORMAT / MECHANIC only, never voice, and its tone is filtered to
 * Pablo's wholesome lane.
 */

import { REFERENCE_CREATORS, NICHE_META_PATTERNS } from '../../src/lib/referenceCreators.js'

export function referenceInspirationPrompt(): string {
  const patterns = NICHE_META_PATTERNS.map((p) => `- ${p}`).join('\n')

  const creators = REFERENCE_CREATORS.map((c) => {
    const formats = c.signatureFormats.map((f) => `      • ${f}`).join('\n')
    return `  @${c.handle} (${c.name}, ${c.followers}) — ${c.niche}
    Signature formats:
${formats}
    Why it works: ${c.mechanic}
    Their REAL videos (study the pattern, never reproduce): ${c.sampleTitles.join(' | ')}
    Tone fit for Pablo: ${c.toneNotes}`
  }).join('\n\n')

  return `## NICHE STYLE REFERENCE (INSPIRATION ONLY — SUBORDINATE TO PABLO'S DNA ABOVE)
You have studied top creators in Pablo's exact niche (POV / prank / street content). Use their FORMATS and MECHANICS as raw material to remix into NEW ideas. This layer NEVER overrides Pablo's voice, tone, or 7 formats — it only widens the pool of mechanics you can localize into his lane.

### HIGHEST-VALUE META-PATTERNS (bias toward these — they transfer cleanly)
${patterns}

### REFERENCE CREATORS
${creators}

### HARD RULES FOR USING THIS LAYER (non-negotiable)
1. VOICE = PABLO, ALWAYS. Reference creators inform FORMAT / MECHANIC only — never voice, never phrasing. Every idea still reads unmistakably like Pablo.
2. NO 1:1 COPYING. Never output a title that essentially replicates a listed "REAL video". Remix, combine, and localize — do not reproduce.
3. LOCALIZE TO EL PASO / JUÁREZ. Real business types (taquerías, paleterías, Chico's Tacos-style local spots), mariachi, World Cup, border culture, bilingual EN/ES.
4. TONE FILTER = PABLO'S WHOLESOME LANE. Some references (especially @tommytuffknuckless) run edgier/grosser/meaner than Pablo. SKIP entirely anything mean-spirited, gross-out, disability-mocking, invasive, or at someone's expense — even when a reference creator does it. Respect each creator's "Tone fit" note. Workers, strangers, and cops always come out looking good. When in doubt, drop it.
5. PREFER THE META-PATTERNS. Recurring character, repetition counter, POV kindness, local-business spotlight, catchphrase loop, costume-in-mundane, family franchise, and escalation-in-public are the highest-value borrowings — reach for these first.`
}
