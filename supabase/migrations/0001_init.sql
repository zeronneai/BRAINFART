-- BRAINFART — initial schema
-- Everything is scoped per user with RLS; the service-role key (serverless
-- functions) bypasses RLS and scopes manually by user_id.

-- ── creator_dna: the white-label seam ────────────────────────────────
create table if not exists public.creator_dna (
  id text primary key,
  name text not null,
  handle text,
  formats jsonb not null default '[]'::jsonb,
  tone_rules text,
  language text default 'en',
  region text,
  created_at timestamptz not null default now()
);

insert into public.creator_dna (id, name, handle, language, region)
values ('pablo-yee-v1', 'Pablo Yee', '@pablopyee', 'en/es', 'El Paso, TX / Ciudad Juárez')
on conflict (id) do nothing;

-- ── profiles ─────────────────────────────────────────────────────────
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Creator',
  xp integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  streak_freezes integer not null default 0,
  last_post_date date,
  ideas_rolled integer not null default 0,
  legendaries_rolled integer not null default 0,
  creator_dna_id text references public.creator_dna (id) default 'pablo-yee-v1',
  updated_at timestamptz not null default now()
);

-- ── ideas (loot) ─────────────────────────────────────────────────────
create table if not exists public.ideas (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  format text not null,
  rarity text not null check (rarity in ('common', 'rare', 'epic', 'legendary')),
  why_now text,
  location_suggestion text,
  hooks jsonb not null default '[]'::jsonb,
  opening_line text,
  difficulty smallint not null default 2 check (difficulty between 1 and 5),
  xp_reward integer not null default 90,
  status text not null default 'rolled' check (status in ('rolled', 'banked', 'trashed', 'quest')),
  created_at timestamptz not null default now()
);
create index if not exists ideas_user_status_idx on public.ideas (user_id, status);

-- ── quests ───────────────────────────────────────────────────────────
create table if not exists public.quests (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  idea_id text not null references public.ideas (id) on delete cascade,
  type text not null check (type in ('daily', 'weekly', 'boss')),
  state text not null default 'available'
    check (state in ('available', 'active', 'filmed', 'posted', 'completed')),
  xp_reward integer not null default 90,
  scheduled_date date,
  completed_at timestamptz,
  post_url text,
  created_at timestamptz not null default now()
);
create index if not exists quests_user_state_idx on public.quests (user_id, state);
create index if not exists quests_user_date_idx on public.quests (user_id, scheduled_date);

-- ── badges ───────────────────────────────────────────────────────────
create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text,
  icon text,
  target integer not null default 1
);

create table if not exists public.user_badges (
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id text not null references public.badges (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

insert into public.badges (id, name, description, icon, target) values
  ('first_blood', 'First Blood', 'Complete your first quest', '🎬', 1),
  ('volume_warrior', 'Volume Warrior', 'Complete 10 yelling-order videos', '📢', 10),
  ('job_creator', 'Job Creator', 'Complete 5 out-of-business videos', '💸', 5),
  ('officer_friendly', 'Officer Friendly', 'Complete 3 police videos', '🚔', 3),
  ('mundialista', 'Mundialista', 'Complete 5 World Cup videos', '⚽', 5),
  ('method_actor', 'Method Actor', 'Complete 5 character POV videos', '🎭', 5),
  ('people_person', 'People Person', 'Complete 5 stranger challenges', '🤝', 5),
  ('week_streak', 'On Fire', 'Hit a 7-day posting streak', '🔥', 7),
  ('legendary_hunter', 'Legendary Hunter', 'Roll 3 legendary ideas', '👑', 3),
  ('the_vault', 'The Vault', 'Bank 10 ideas', '🏦', 10),
  ('slot_machine', 'Slot Machine', 'Roll 50 ideas', '🎰', 50),
  ('boss_slayer', 'Boss Slayer', 'Complete a Boss Quest', '⚔️', 1)
on conflict (id) do nothing;

-- ── trend briefings (daily cache) ────────────────────────────────────
create table if not exists public.trend_briefings (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- ── idea feedback (future prompt-tuning) ─────────────────────────────
create table if not exists public.idea_feedback (
  user_id uuid not null references auth.users (id) on delete cascade,
  idea_id text not null,
  signal text not null check (signal in ('trashed', 'banked', 'completed')),
  created_at timestamptz not null default now(),
  primary key (user_id, idea_id, signal)
);

-- ── RLS: users only see their own rows ───────────────────────────────
alter table public.profiles enable row level security;
alter table public.ideas enable row level security;
alter table public.quests enable row level security;
alter table public.user_badges enable row level security;
alter table public.trend_briefings enable row level security;
alter table public.idea_feedback enable row level security;
alter table public.badges enable row level security;
alter table public.creator_dna enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own ideas" on public.ideas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own quests" on public.quests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own badges" on public.user_badges
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own briefings" on public.trend_briefings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own feedback" on public.idea_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- badge + dna catalogs are readable by any signed-in user
create policy "badges readable" on public.badges for select using (true);
create policy "dna readable" on public.creator_dna for select using (true);
