# BRAINFART 💨

**A gamified, RPG-style content ideation app** — built as a premium white-label product by **Primo AI Studio** for Pablo Yee ([@pablopyee](https://instagram.com/pablopyee)).

Not a content calendar. A living game: **Roll ideas (loot) → Accept quests → Film → Claim XP → Level up.**

## The loop

- **BRAINFART button** — tap to roll 3 AI-generated idea cards (slot-machine reveal, rarity glow). Hold-to-charge opens the **Focused Fart** targeting filters (format / location / effort / Trend Mode).
- **Ideas as loot** — every card has a rarity (Common → Legendary, assigned by *viral potential*, not RNG), a `why_now` grounded in real current trends via web search, a concrete location, 3 alt hooks, an opening line, and an XP reward mapped from difficulty.
- **Quests** — daily (auto-generated), weekly, and boss quests move through `available → active → filmed → posted → completed`. Completing grants XP; posting streaks multiply it (×1.1/day, capped ×2, with streak-freeze mercy items every 7 days).
- **Progression** — Lv1 NPC → Lv5 Side Quest → Lv10 Supporting Cast → Lv20 Main Character → Lv35 Fan Favorite → Lv50 Final Boss. Full-screen level-up and legendary-drop moments.
- **Screens** — Home/The Roll (+ Retos rail), Quest Log (with the Schedule board), **El Territorio** conquest map, Trend Radar (daily AI briefing), Vault, Profile (badges + stats).
- **Conquest Map** — ~28 real El Paso/Juárez filming spots on a dark Leaflet map (CartoDB tiles, `MAP_PROVIDER` seam for Mapbox later). Completing a quest at a spot flips its pin to gold; zones (Westside → Juárez) track conquest %, 100% = ZONE CLEARED celebration. Geolocation centers the map when granted.
- **Retos** — daily / weekly / zone / event challenges with countdown chips and claim animations. Claiming 3 in a week ignites **COMBO** (×1.5 XP for 48h, flame border on the HUD).
- **Post to IG** — on completed quests and in Title Forge: caption (hook + comment bait + hashtags) copied to clipboard, Instagram deep link (web fallback, native share where available), then a "drop the link" prompt that saves `post_url` and feeds the map.

## Stack

React 18 + Vite + TypeScript · Tailwind (design tokens as CSS variables) · Framer Motion · Supabase (auth, Postgres, RLS) · Anthropic API (`claude-sonnet-4-6` + web search) via Vercel serverless functions.

## Running it

```bash
npm install
npm run dev        # → http://localhost:5173
```

With **no env vars**, the app runs in full **demo mode**: local persistence, a curated Pablo-voice mock idea engine, and every animation/game system live. Perfect for the sales demo.

### Real AI generation (the BRAINFART button)

The button calls `POST /api/generate-ideas`, which calls Claude (`claude-sonnet-4-6`)
with `web_search` so `why_now` is grounded in real current events. **Generation is
never silently faked** — if the API call fails (missing `ANTHROPIC_API_KEY`, network,
etc.) the app shows an in-world error ("The brain misfired — try again"), it does **not**
fall back to seed content. Seed ideas are used **only** for the flagged tutorial roll.

Variety mechanics baked into every request:
- the last **30** rolled/accepted titles are sent as an exclusion list,
- **2 of the 7 DNA formats are randomly emphasized per roll** (rotates so consecutive
  rolls explore different territory),
- today's date + live `web_search` results ground `why_now`.

**Local dev runs the real handler.** `vite-plugin-dev-api.ts` mounts the `/api/*.ts`
functions inside the Vite dev server, so `npm run dev` exercises the exact same
generation path as production — set `ANTHROPIC_API_KEY` in `.env` and rolling produces
real, varied, current ideas locally. Without a key, `/api/generate-ideas` returns `503`
and the UI shows the error state (correct, visible failure).

### Full mode

1. Create a Supabase project, run the migrations in `supabase/migrations/`.
2. Copy `.env.example` → `.env` and fill in the values (**`ANTHROPIC_API_KEY` is required
   for real generation**).
3. `npm run dev` for local dev (the plugin runs `/api`), or deploy to Vercel. Set the
   same env vars in the Vercel project.

| Var | Where | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | client | auth + RLS reads |
| `ANTHROPIC_API_KEY` | serverless only | idea/trend/title generation |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | serverless only | persistence + daily briefing cache |
| `GOOGLE_PLACES_API_KEY` | serverless (Phase 2) | real nearby quest locations |

Keys never ship to the client — all AI calls go through `/api/*`.

## White-labeling

One file: [`src/lib/creatorDNA.ts`](src/lib/creatorDNA.ts). A new client = a new `CreatorDNA` object (formats, tone rules, title rules, cultural anchors). The `/api` prompts, the Focused Fart filters, and the badge system all derive from it. Colors/typography/radii live in [`src/index.css`](src/index.css) as CSS variables.

## API endpoints

| Endpoint | What it does |
| --- | --- |
| `POST /api/generate-ideas` | Rolls loot cards in the creator's voice; web search grounds `why_now` when Trend Mode is on; strict-JSON validated; persists to Supabase |
| `POST /api/trend-radar` | Daily briefing (top 5 trends, next-14-days dates, seasonal alert) — cached 1×/day/user in `trend_briefings` |
| `POST /api/titles` | Filmed-video description → 5 hooks + 3 pinned-comment baits + caption |
| `POST /api/places` | Nearby quest locations (mock El Paso data behind a provider interface; Google Places pluggable) |

## Project structure

```
api/                    serverless functions (+ _lib prompts/validation)
supabase/migrations/    schema + RLS
src/
  lib/                  creatorDNA (white-label seam), xp, rarity, badges, api client, mock engine
  store/                zustand game state (XP, streaks, quests, overlays)
  components/           ui kit + layout shell
  features/             loot / quests / trends / vault / calendar / profile / auth / progression
```
