-- Phase 2: Conquest Map (spots, zones) + quest→spot linkage

create table if not exists public.zones (
  key text primary key,
  name text not null,
  polygon jsonb not null default '[]'::jsonb,
  total_spots integer not null default 0
);

insert into public.zones (key, name, total_spots) values
  ('westside', 'Westside', 4),
  ('downtown', 'Downtown', 5),
  ('central', 'Central', 4),
  ('eastside', 'Eastside', 5),
  ('northeast', 'Northeast', 3),
  ('lower_valley', 'Lower Valley', 3),
  ('juarez', 'Juárez', 4)
on conflict (key) do nothing;

-- catalog of filming spots (shared); per-user conquest state
create table if not exists public.spots (
  id text primary key,
  name text not null,
  category text,
  zone text references public.zones (key),
  lat double precision not null,
  lng double precision not null
);

create table if not exists public.spot_conquests (
  user_id uuid not null references auth.users (id) on delete cascade,
  spot_id text not null references public.spots (id) on delete cascade,
  state text not null default 'suggested' check (state in ('suggested', 'active', 'conquered')),
  conquered_at timestamptz,
  quest_id text references public.quests (id) on delete set null,
  primary key (user_id, spot_id)
);

alter table public.quests add column if not exists spot_id text references public.spots (id);

alter table public.zones enable row level security;
alter table public.spots enable row level security;
alter table public.spot_conquests enable row level security;

create policy "zones readable" on public.zones for select using (true);
create policy "spots readable" on public.spots for select using (true);
create policy "own conquests" on public.spot_conquests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
