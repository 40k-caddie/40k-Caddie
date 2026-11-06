-- The Cogitator: who may use it, and a log of questions for the daily limit.
-- Neither table is readable from the app; only the Cogitator function (server side) touches them.
create table if not exists public.cogitator_users (
  email text primary key,
  daily_limit int default 30,      -- empty (null) = no limit
  note text,
  added_at timestamptz not null default now()
);
alter table public.cogitator_users enable row level security;

create table if not exists public.cogitator_log (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  email text,
  question text,
  tokens_in int,
  tokens_out int,
  at timestamptz not null default now()
);
alter table public.cogitator_log enable row level security;
create index if not exists cogitator_log_user_at on public.cogitator_log (user_id, at);

-- you, with no daily limit
insert into public.cogitator_users (email, daily_limit, note) values ('f.weir88@gmail.com', null, 'owner')
  on conflict (email) do update set daily_limit = null, note = 'owner';
