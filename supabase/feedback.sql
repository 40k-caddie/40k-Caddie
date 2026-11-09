-- Feedback sent from the app's vessel. Not readable from the app; only the feedback function (server side) writes here.
-- Read them in Supabase: Table Editor > feedback. Set status to 'done' once dealt with.
create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null default 'other',   -- bug, idea or other
  body text not null,
  screen text,
  army text,
  faction text,
  app_version text,
  user_id uuid,
  user_email text,
  ua text,
  status text not null default 'new'
);
alter table public.feedback enable row level security;
create index if not exists feedback_created on public.feedback (created_at desc);
