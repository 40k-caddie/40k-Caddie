-- 40k Caddie: run this once in Supabase (SQL Editor, New query, paste, Run).

-- Each person's own saved data: setup, image list, battle history. Only they can read or change it.
create table if not exists public.docs (
  owner uuid not null references auth.users (id) on delete cascade default auth.uid(),
  path text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (owner, path)
);
alter table public.docs enable row level security;
drop policy if exists "own docs" on public.docs;
create policy "own docs" on public.docs for all to authenticated
  using (owner = (select auth.uid())) with check (owner = (select auth.uid()));

-- Things everyone can read, like the news headlines. Only the server writes them.
create table if not exists public.public_docs (
  path text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.public_docs enable row level security;
drop policy if exists "anyone reads" on public.public_docs;
create policy "anyone reads" on public.public_docs for select to anon, authenticated using (true);

-- Live updates, so a change on one device shows on the others
do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when duplicate_object then null; end $$;

-- Images people add: a public bucket, each person writes only in their own folder
insert into storage.buckets (id, name, public) values ('images', 'images', true)
  on conflict (id) do update set public = true;
drop policy if exists "own images in" on storage.objects;
create policy "own images in" on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "own images out" on storage.objects;
create policy "own images out" on storage.objects for delete to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);
