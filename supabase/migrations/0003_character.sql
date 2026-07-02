-- Phase 3: character creation, personalization, idea scripts, onboarding

alter table public.profiles
  add column if not exists character jsonb,
  add column if not exists creator_class text,
  add column if not exists accent_pref text default 'acid',
  add column if not exists instagram_handle text default 'pablopyee',
  add column if not exists onboarding_step integer not null default 0;

alter table public.ideas
  add column if not exists script jsonb;
