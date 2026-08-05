begin;

create table public.wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category text not null,
  subcategory text null,
  primary_color text null,
  secondary_color text null,
  pattern text null,
  material text null,
  brand text null,
  season text null,
  occasion text null,
  notes text null,
  is_favorite boolean not null default false,
  image_url text null,
  source_url text null,
  source_domain text null,
  external_product_id text null,
  price numeric(12, 2) null,
  currency text null,
  import_method text not null,
  deduplication_key text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint wardrobe_items_name_length check (char_length(btrim(name)) between 1 and 180),
  constraint wardrobe_items_category_length check (char_length(btrim(category)) between 1 and 100),
  constraint wardrobe_items_optional_text_lengths check (
    char_length(coalesce(subcategory, '')) <= 100
    and char_length(coalesce(primary_color, '')) <= 100
    and char_length(coalesce(secondary_color, '')) <= 100
    and char_length(coalesce(pattern, '')) <= 100
    and char_length(coalesce(material, '')) <= 100
    and char_length(coalesce(brand, '')) <= 120
    and char_length(coalesce(season, '')) <= 100
    and char_length(coalesce(occasion, '')) <= 100
    and char_length(coalesce(notes, '')) <= 2000
    and char_length(coalesce(source_url, '')) <= 2048
    and char_length(coalesce(image_url, '')) <= 2048
    and char_length(coalesce(external_product_id, '')) <= 160
    and char_length(deduplication_key) between 1 and 2300
  ),
  constraint wardrobe_items_price_nonnegative check (price is null or price >= 0),
  constraint wardrobe_items_currency_format check (currency is null or currency ~ '^[A-Z]{3}$'),
  constraint wardrobe_items_import_method check (import_method in ('manual', 'website-url')),
  constraint wardrobe_items_source_for_website check (
    import_method <> 'website-url'
    or (source_url is not null and source_domain is not null)
  ),
  constraint wardrobe_items_user_deduplication unique (user_id, deduplication_key)
);

create index wardrobe_items_user_created_at_idx
on public.wardrobe_items (user_id, created_at desc);

comment on table public.wardrobe_items is
  'Private wardrobe items owned by the authenticated user, including website-import provenance.';

revoke all on table public.wardrobe_items from public, anon;
grant select, insert, update, delete on table public.wardrobe_items to authenticated;

alter table public.wardrobe_items enable row level security;

create policy "Users can read their own wardrobe items"
on public.wardrobe_items
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own wardrobe items"
on public.wardrobe_items
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own wardrobe items"
on public.wardrobe_items
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own wardrobe items"
on public.wardrobe_items
for delete
to authenticated
using ((select auth.uid()) = user_id);

create function public.set_wardrobe_items_updated_at()
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

create trigger set_wardrobe_items_updated_at
before update on public.wardrobe_items
for each row
execute function public.set_wardrobe_items_updated_at();

commit;
