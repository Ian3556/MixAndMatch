begin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text null,
  avatar_url text null,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null
    or char_length(btrim(display_name)) between 2 and 50
  ),
  constraint profiles_avatar_url_length check (
    avatar_url is null
    or char_length(avatar_url) <= 2048
  ),
  constraint profiles_completed_requires_name check (
    not onboarding_completed
    or (
      display_name is not null
      and char_length(btrim(display_name)) between 2 and 50
    )
  )
);

comment on table public.profiles is
  'Private application profile owned by the matching Supabase Auth user.';

revoke all on table public.profiles from public, anon;
grant select, insert, update on table public.profiles to authenticated;

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create function public.set_profiles_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

commit;
