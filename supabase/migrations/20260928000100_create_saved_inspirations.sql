begin;

create table public.saved_inspirations (
  user_id uuid not null references auth.users(id) on delete cascade,
  inspiration_id text not null check (char_length(inspiration_id) between 1 and 120),
  created_at timestamptz not null default now(),
  primary key (user_id, inspiration_id)
);

alter table public.saved_inspirations enable row level security;
revoke all on public.saved_inspirations from anon, authenticated;
grant select, insert, delete on public.saved_inspirations to authenticated;

create policy "Read own saved inspirations" on public.saved_inspirations
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Save own inspirations" on public.saved_inspirations
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Remove own saved inspirations" on public.saved_inspirations
  for delete to authenticated using ((select auth.uid()) = user_id);

commit;
