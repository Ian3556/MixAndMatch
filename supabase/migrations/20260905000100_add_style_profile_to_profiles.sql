begin;

alter table public.profiles
add column style_profile jsonb not null default '{}'::jsonb;

alter table public.profiles
add constraint profiles_style_profile_is_object
check (jsonb_typeof(style_profile) = 'object');

comment on column public.profiles.style_profile is
  'Private body, colour, occasion, fit, and fashion-style preferences used for recommendations.';

commit;
