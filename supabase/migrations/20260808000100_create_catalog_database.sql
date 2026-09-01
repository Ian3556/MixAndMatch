begin;

create type public.catalog_brand_source_status as enum (
  'ready',
  'supported',
  'partially_supported',
  'manual_seed_required',
  'blocked',
  'unavailable',
  'completed'
);

create type public.catalog_source_type as enum (
  'url',
  'csv',
  'retailer_feed',
  'affiliate_feed',
  'brand_api',
  'pim',
  'manual'
);

create type public.catalog_product_status as enum (
  'raw',
  'processing',
  'enriched',
  'needs_review',
  'validated',
  'rejected',
  'unavailable',
  'archived'
);

create type public.catalog_gender as enum ('men', 'women', 'unisex', 'kids', 'unknown');
create type public.catalog_image_type as enum ('primary', 'alternate', 'detail', 'lifestyle');
create type public.catalog_extraction_method as enum (
  'json_ld',
  'open_graph',
  'html_meta',
  'public_embedded_state',
  'domain_adapter',
  'csv',
  'feed',
  'api',
  'pim',
  'manual'
);
create type public.catalog_import_job_status as enum (
  'queued',
  'running',
  'paused',
  'completed',
  'completed_with_errors',
  'failed',
  'stopped'
);
create type public.catalog_import_entry_status as enum (
  'pending',
  'processing',
  'completed',
  'duplicate',
  'failed',
  'skipped'
);

create table public.catalog_developers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text null,
  created_at timestamptz not null default now(),
  constraint catalog_developers_note_length check (char_length(coalesce(note, '')) <= 500)
);

comment on table public.catalog_developers is
  'Server-managed allowlist for development catalogue operations. Authenticated users cannot self-enrol.';

create function public.is_catalog_developer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.catalog_developers
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_catalog_developer() from public, anon;
grant execute on function public.is_catalog_developer() to authenticated;

create table public.catalog_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand_group text not null,
  website_url text null,
  logo_url text null,
  source_status public.catalog_brand_source_status not null default 'manual_seed_required',
  enabled boolean not null default true,
  target_validated_count integer not null default 150,
  category_targets jsonb not null default '{}'::jsonb,
  source_status_reason text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_brands_name_length check (char_length(btrim(name)) between 1 and 120),
  constraint catalog_brands_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint catalog_brands_group_length check (char_length(btrim(brand_group)) between 1 and 80),
  constraint catalog_brands_website_url_length check (char_length(coalesce(website_url, '')) <= 2048),
  constraint catalog_brands_logo_url_length check (char_length(coalesce(logo_url, '')) <= 2048),
  constraint catalog_brands_target_positive check (target_validated_count between 1 and 10000),
  constraint catalog_brands_targets_object check (jsonb_typeof(category_targets) = 'object'),
  constraint catalog_brands_reason_length check (
    char_length(coalesce(source_status_reason, '')) <= 1000
  )
);

create table public.catalog_brand_sources (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.catalog_brands (id) on delete cascade,
  source_type public.catalog_source_type not null,
  label text not null,
  status public.catalog_brand_source_status not null default 'manual_seed_required',
  allowed_domains text[] not null default '{}'::text[],
  entry_urls text[] not null default '{}'::text[],
  max_requests integer not null default 25,
  delay_ms integer not null default 1500,
  concurrency integer not null default 1,
  timeout_ms integer not null default 10000,
  retry_count integer not null default 2,
  max_crawl_depth integer not null default 0,
  enabled boolean not null default false,
  robots_reviewed_at timestamptz null,
  terms_reviewed_at timestamptz null,
  blocked_reason text null,
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_brand_sources_label_length check (char_length(btrim(label)) between 1 and 160),
  constraint catalog_brand_sources_request_bounds check (max_requests between 1 and 500),
  constraint catalog_brand_sources_delay_bounds check (delay_ms between 250 and 60000),
  constraint catalog_brand_sources_concurrency_bounds check (concurrency between 1 and 5),
  constraint catalog_brand_sources_timeout_bounds check (timeout_ms between 1000 and 30000),
  constraint catalog_brand_sources_retry_bounds check (retry_count between 0 and 5),
  constraint catalog_brand_sources_depth_bounds check (max_crawl_depth between 0 and 2),
  constraint catalog_brand_sources_reason_length check (
    char_length(coalesce(blocked_reason, '')) <= 1000
  ),
  constraint catalog_brand_sources_notes_length check (char_length(coalesce(notes, '')) <= 2000),
  constraint catalog_brand_sources_unique_label unique (brand_id, label)
);

create table public.catalog_categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid null references public.catalog_categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  level smallint not null,
  sort_order smallint not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_categories_name_length check (char_length(btrim(name)) between 1 and 100),
  constraint catalog_categories_slug_format check (slug ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$'),
  constraint catalog_categories_level check (
    (level = 1 and parent_id is null)
    or (level = 2 and parent_id is not null)
  ),
  constraint catalog_categories_sort_order check (sort_order between 0 and 1000)
);

create table public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.catalog_brands (id) on delete restrict,
  external_product_id text null,
  external_style_id text null,
  external_sku text null,
  name text not null,
  slug text not null,
  description text null,
  category_id uuid not null references public.catalog_categories (id) on delete restrict,
  subcategory_id uuid null references public.catalog_categories (id) on delete restrict,
  raw_category text null,
  raw_subcategory text null,
  gender public.catalog_gender not null default 'unknown',
  primary_color text null,
  color_family text null,
  material_summary text null,
  current_price numeric(12, 2) null,
  original_price numeric(12, 2) null,
  currency text null,
  price_unavailable boolean not null default false,
  availability text null,
  source_url text not null,
  canonical_url text not null,
  source_domain text not null,
  deduplication_key text not null,
  status public.catalog_product_status not null default 'raw',
  validation_errors text[] not null default '{}'::text[],
  validation_warnings text[] not null default '{}'::text[],
  overall_confidence numeric(4, 3) not null default 0,
  normalization_version text not null,
  imported_at timestamptz not null default now(),
  last_checked_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_document tsvector generated always as (
    to_tsvector(
      'simple',
      coalesce(name, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(primary_color, '') || ' ' ||
      coalesce(color_family, '') || ' ' ||
      coalesce(material_summary, '')
    )
  ) stored,
  constraint catalog_products_name_length check (char_length(btrim(name)) between 1 and 220),
  constraint catalog_products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint catalog_products_description_length check (char_length(coalesce(description, '')) <= 10000),
  constraint catalog_products_identity_lengths check (
    char_length(coalesce(external_product_id, '')) <= 200
    and char_length(coalesce(external_style_id, '')) <= 200
    and char_length(coalesce(external_sku, '')) <= 200
  ),
  constraint catalog_products_attribute_lengths check (
    char_length(coalesce(raw_category, '')) <= 240
    and char_length(coalesce(raw_subcategory, '')) <= 240
    and char_length(coalesce(primary_color, '')) <= 100
    and char_length(coalesce(color_family, '')) <= 100
    and char_length(coalesce(material_summary, '')) <= 1000
    and char_length(coalesce(availability, '')) <= 200
    and char_length(source_domain) between 1 and 253
    and char_length(deduplication_key) between 1 and 2048
    and char_length(normalization_version) between 1 and 80
  ),
  constraint catalog_products_url_lengths check (
    char_length(source_url) between 1 and 2048
    and char_length(canonical_url) between 1 and 2048
  ),
  constraint catalog_products_prices_nonnegative check (
    (current_price is null or current_price >= 0)
    and (original_price is null or original_price >= 0)
  ),
  constraint catalog_products_price_order check (
    original_price is null or current_price is null or original_price >= current_price
  ),
  constraint catalog_products_currency_format check (currency is null or currency ~ '^[A-Z]{3}$'),
  constraint catalog_products_price_state check (
    current_price is not null or price_unavailable or status <> 'validated'
  ),
  constraint catalog_products_confidence check (overall_confidence between 0 and 1),
  constraint catalog_products_brand_deduplication unique (brand_id, deduplication_key)
);

create table public.catalog_product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  external_variant_id text null,
  sku text null,
  variant_key text not null,
  size text null,
  color text null,
  price numeric(12, 2) null,
  currency text null,
  availability text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_product_variants_lengths check (
    char_length(coalesce(external_variant_id, '')) <= 200
    and char_length(coalesce(sku, '')) <= 200
    and char_length(variant_key) between 1 and 600
    and char_length(coalesce(size, '')) <= 100
    and char_length(coalesce(color, '')) <= 100
    and char_length(coalesce(availability, '')) <= 200
  ),
  constraint catalog_product_variants_price check (price is null or price >= 0),
  constraint catalog_product_variants_currency check (currency is null or currency ~ '^[A-Z]{3}$'),
  constraint catalog_product_variants_unique_key unique (product_id, variant_key)
);

create table public.catalog_product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  image_url text not null,
  source_url text not null,
  position integer not null default 0,
  image_type public.catalog_image_type not null default 'alternate',
  created_at timestamptz not null default now(),
  constraint catalog_product_images_url_lengths check (
    char_length(image_url) between 1 and 2048
    and char_length(source_url) between 1 and 2048
  ),
  constraint catalog_product_images_position check (position between 0 and 100),
  constraint catalog_product_images_unique_position unique (product_id, position),
  constraint catalog_product_images_unique_url unique (product_id, image_url)
);

create table public.catalog_style_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text null,
  created_at timestamptz not null default now(),
  constraint catalog_style_tags_name_length check (char_length(btrim(name)) between 1 and 100),
  constraint catalog_style_tags_slug_format check (slug ~ '^[a-z0-9]+(?:_[a-z0-9]+)*$'),
  constraint catalog_style_tags_description_length check (char_length(coalesce(description, '')) <= 500)
);

create table public.catalog_product_style_tags (
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  style_tag_id uuid not null references public.catalog_style_tags (id) on delete restrict,
  confidence numeric(4, 3) not null,
  created_at timestamptz not null default now(),
  primary key (product_id, style_tag_id),
  constraint catalog_product_style_tags_confidence check (confidence between 0 and 1)
);

create table public.catalog_product_style_profiles (
  product_id uuid primary key references public.catalog_products (id) on delete cascade,
  fit text null,
  silhouette text null,
  pattern text null,
  texture text null,
  layer_role text null,
  formality_score smallint null,
  warmth_score smallint null,
  season_tags text[] not null default '{}'::text[],
  occasion_tags text[] not null default '{}'::text[],
  dominant_color text null,
  secondary_colors text[] not null default '{}'::text[],
  ai_confidence numeric(4, 3) not null default 0,
  enrichment_version text not null,
  reviewed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_product_style_profiles_lengths check (
    char_length(coalesce(fit, '')) <= 100
    and char_length(coalesce(silhouette, '')) <= 100
    and char_length(coalesce(pattern, '')) <= 100
    and char_length(coalesce(texture, '')) <= 100
    and char_length(coalesce(layer_role, '')) <= 100
    and char_length(coalesce(dominant_color, '')) <= 100
    and char_length(enrichment_version) between 1 and 80
  ),
  constraint catalog_product_style_profiles_formality check (
    formality_score is null or formality_score between 0 and 5
  ),
  constraint catalog_product_style_profiles_warmth check (
    warmth_score is null or warmth_score between 0 and 5
  ),
  constraint catalog_product_style_profiles_confidence check (ai_confidence between 0 and 1)
);

create table public.catalog_product_materials (
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  material text not null,
  percentage numeric(5, 2) null,
  confidence numeric(4, 3) not null default 1,
  created_at timestamptz not null default now(),
  primary key (product_id, material),
  constraint catalog_product_materials_name_length check (char_length(btrim(material)) between 1 and 100),
  constraint catalog_product_materials_percentage check (percentage is null or percentage between 0 and 100),
  constraint catalog_product_materials_confidence check (confidence between 0 and 1)
);

create table public.catalog_product_sources (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  source_domain text not null,
  source_url text not null,
  extraction_method public.catalog_extraction_method not null,
  fetched_at timestamptz not null,
  content_hash text null,
  importer_version text not null,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint catalog_product_sources_domain_length check (char_length(source_domain) between 1 and 253),
  constraint catalog_product_sources_url_length check (char_length(source_url) between 1 and 2048),
  constraint catalog_product_sources_hash_length check (char_length(coalesce(content_hash, '')) <= 160),
  constraint catalog_product_sources_version_length check (char_length(importer_version) between 1 and 80),
  constraint catalog_product_sources_payload_object check (jsonb_typeof(raw_payload) = 'object'),
  constraint catalog_product_sources_unique_url unique (product_id, source_url)
);

create table public.catalog_collections (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.catalog_brands (id) on delete cascade,
  name text not null,
  slug text not null,
  season text null,
  year smallint null,
  release_date date null,
  source_url text null,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_collections_name_length check (char_length(btrim(name)) between 1 and 180),
  constraint catalog_collections_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint catalog_collections_season_length check (char_length(coalesce(season, '')) <= 100),
  constraint catalog_collections_year check (year is null or year between 1900 and 2200),
  constraint catalog_collections_source_url_length check (char_length(coalesce(source_url, '')) <= 2048),
  constraint catalog_collections_unique_slug unique (brand_id, slug)
);

create table public.catalog_product_collections (
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  collection_id uuid not null references public.catalog_collections (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, collection_id)
);

create table public.catalog_import_jobs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.catalog_brands (id) on delete restrict,
  brand_source_id uuid null references public.catalog_brand_sources (id) on delete set null,
  initiated_by uuid null references auth.users (id) on delete set null,
  source_type public.catalog_source_type not null,
  status public.catalog_import_job_status not null default 'queued',
  operation text not null default 'import',
  requested_count integer not null default 0,
  discovered_count integer not null default 0,
  imported_count integer not null default 0,
  validated_count integer not null default 0,
  rejected_count integer not null default 0,
  duplicate_count integer not null default 0,
  failed_count integer not null default 0,
  config_snapshot jsonb not null default '{}'::jsonb,
  cursor_state jsonb not null default '{}'::jsonb,
  started_at timestamptz null,
  completed_at timestamptz null,
  error_summary text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_import_jobs_operation check (operation in ('import', 'revalidate', 'reenrich')),
  constraint catalog_import_jobs_counts_nonnegative check (
    requested_count >= 0
    and discovered_count >= 0
    and imported_count >= 0
    and validated_count >= 0
    and rejected_count >= 0
    and duplicate_count >= 0
    and failed_count >= 0
  ),
  constraint catalog_import_jobs_snapshot_object check (jsonb_typeof(config_snapshot) = 'object'),
  constraint catalog_import_jobs_cursor_object check (jsonb_typeof(cursor_state) = 'object'),
  constraint catalog_import_jobs_error_length check (char_length(coalesce(error_summary, '')) <= 5000)
);

create table public.catalog_import_entries (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.catalog_import_jobs (id) on delete cascade,
  sequence_number integer not null,
  source_url text not null,
  normalized_source_url text not null,
  status public.catalog_import_entry_status not null default 'pending',
  attempt_count integer not null default 0,
  max_attempts integer not null default 3,
  retryable boolean not null default true,
  content_hash text null,
  product_id uuid null references public.catalog_products (id) on delete set null,
  raw_payload jsonb null,
  warnings text[] not null default '{}'::text[],
  last_error_code text null,
  last_error_message text null,
  last_attempted_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_import_entries_sequence check (sequence_number >= 0),
  constraint catalog_import_entries_url_lengths check (
    char_length(source_url) between 1 and 2048
    and char_length(normalized_source_url) between 1 and 2048
  ),
  constraint catalog_import_entries_attempts check (
    attempt_count between 0 and 20 and max_attempts between 1 and 20
  ),
  constraint catalog_import_entries_hash_length check (char_length(coalesce(content_hash, '')) <= 160),
  constraint catalog_import_entries_error_lengths check (
    char_length(coalesce(last_error_code, '')) <= 120
    and char_length(coalesce(last_error_message, '')) <= 5000
  ),
  constraint catalog_import_entries_unique_sequence unique (import_job_id, sequence_number),
  constraint catalog_import_entries_unique_url unique (import_job_id, normalized_source_url)
);

create table public.catalog_import_errors (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.catalog_import_jobs (id) on delete cascade,
  import_entry_id uuid null references public.catalog_import_entries (id) on delete cascade,
  product_url text null,
  error_type text not null,
  message text not null,
  retryable boolean not null default false,
  created_at timestamptz not null default now(),
  constraint catalog_import_errors_url_length check (char_length(coalesce(product_url, '')) <= 2048),
  constraint catalog_import_errors_type_length check (char_length(btrim(error_type)) between 1 and 120),
  constraint catalog_import_errors_message_length check (char_length(message) between 1 and 5000)
);

alter table public.wardrobe_items
add column catalog_product_id uuid null references public.catalog_products (id) on delete set null;

comment on column public.wardrobe_items.catalog_product_id is
  'Optional provenance link to the canonical catalogue product; wardrobe ownership remains independent.';

create function public.set_catalog_updated_at()
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

create trigger set_catalog_brands_updated_at
before update on public.catalog_brands
for each row execute function public.set_catalog_updated_at();

create trigger set_catalog_brand_sources_updated_at
before update on public.catalog_brand_sources
for each row execute function public.set_catalog_updated_at();

create trigger set_catalog_categories_updated_at
before update on public.catalog_categories
for each row execute function public.set_catalog_updated_at();

create trigger set_catalog_products_updated_at
before update on public.catalog_products
for each row execute function public.set_catalog_updated_at();

create trigger set_catalog_product_variants_updated_at
before update on public.catalog_product_variants
for each row execute function public.set_catalog_updated_at();

create trigger set_catalog_product_style_profiles_updated_at
before update on public.catalog_product_style_profiles
for each row execute function public.set_catalog_updated_at();

create trigger set_catalog_collections_updated_at
before update on public.catalog_collections
for each row execute function public.set_catalog_updated_at();

create trigger set_catalog_import_jobs_updated_at
before update on public.catalog_import_jobs
for each row execute function public.set_catalog_updated_at();

create trigger set_catalog_import_entries_updated_at
before update on public.catalog_import_entries
for each row execute function public.set_catalog_updated_at();

create function public.validate_catalog_product_taxonomy()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  category_level smallint;
  subcategory_level smallint;
  subcategory_parent uuid;
begin
  select level into category_level
  from public.catalog_categories
  where id = new.category_id;

  if category_level is distinct from 1 then
    raise exception 'catalog product category must be a level-1 category';
  end if;

  if new.subcategory_id is not null then
    select level, parent_id into subcategory_level, subcategory_parent
    from public.catalog_categories
    where id = new.subcategory_id;

    if subcategory_level is distinct from 2 or subcategory_parent is distinct from new.category_id then
      raise exception 'catalog product subcategory must belong to its category';
    end if;
  end if;

  return new;
end;
$$;

create trigger validate_catalog_product_taxonomy
before insert or update of category_id, subcategory_id on public.catalog_products
for each row execute function public.validate_catalog_product_taxonomy();

create index catalog_brands_status_idx on public.catalog_brands (source_status, enabled);
create index catalog_brand_sources_brand_status_idx
on public.catalog_brand_sources (brand_id, status, enabled);
create index catalog_categories_parent_sort_idx
on public.catalog_categories (parent_id, sort_order);
create index catalog_products_brand_status_idx
on public.catalog_products (brand_id, status);
create index catalog_products_category_status_idx
on public.catalog_products (category_id, subcategory_id, status);
create index catalog_products_gender_status_idx
on public.catalog_products (gender, status);
create index catalog_products_price_idx
on public.catalog_products (current_price)
where current_price is not null;
create index catalog_products_created_at_idx
on public.catalog_products (created_at desc);
create index catalog_products_external_identity_idx
on public.catalog_products (brand_id, external_product_id, external_sku);
create index catalog_products_source_url_idx
on public.catalog_products (canonical_url);
create index catalog_products_search_idx
on public.catalog_products using gin (search_document);
create index catalog_product_variants_product_idx
on public.catalog_product_variants (product_id, availability);
create index catalog_product_images_product_idx
on public.catalog_product_images (product_id, position);
create index catalog_product_style_tags_style_idx
on public.catalog_product_style_tags (style_tag_id, product_id);
create index catalog_product_materials_material_idx
on public.catalog_product_materials (material, product_id);
create index catalog_product_sources_domain_idx
on public.catalog_product_sources (source_domain, fetched_at desc);
create index catalog_product_collections_collection_idx
on public.catalog_product_collections (collection_id, product_id);
create index catalog_import_jobs_brand_status_idx
on public.catalog_import_jobs (brand_id, status, created_at desc);
create index catalog_import_entries_pending_idx
on public.catalog_import_entries (import_job_id, sequence_number)
where status in ('pending', 'failed');
create index catalog_import_errors_job_idx
on public.catalog_import_errors (import_job_id, created_at desc);
create index wardrobe_items_catalog_product_idx
on public.wardrobe_items (catalog_product_id)
where catalog_product_id is not null;

insert into public.catalog_categories (name, slug, level, sort_order)
values
  ('Tops', 'tops', 1, 10),
  ('Knitwear', 'knitwear', 1, 20),
  ('Bottoms', 'bottoms', 1, 30),
  ('Outerwear', 'outerwear', 1, 40),
  ('Dresses & One-Pieces', 'dresses_one_pieces', 1, 50),
  ('Footwear', 'footwear', 1, 60),
  ('Accessories', 'accessories', 1, 70),
  ('Other', 'other', 1, 80);

insert into public.catalog_categories (parent_id, name, slug, level, sort_order)
select parent.id, child.name, child.slug, 2, child.sort_order
from (
  values
    ('tops', 'T-Shirt', 't_shirt', 10),
    ('tops', 'Polo', 'polo', 20),
    ('tops', 'Shirt', 'shirt', 30),
    ('tops', 'Tank Top', 'tank_top', 40),
    ('tops', 'Blouse', 'blouse', 50),
    ('tops', 'Long Sleeve', 'long_sleeve', 60),
    ('tops', 'Sweatshirt', 'sweatshirt', 70),
    ('tops', 'Hoodie', 'hoodie', 80),
    ('knitwear', 'Sweater', 'sweater', 10),
    ('knitwear', 'Cardigan', 'cardigan', 20),
    ('knitwear', 'Knit Vest', 'knit_vest', 30),
    ('bottoms', 'Jeans', 'jeans', 10),
    ('bottoms', 'Trousers', 'trousers', 20),
    ('bottoms', 'Chinos', 'chinos', 30),
    ('bottoms', 'Cargo Pants', 'cargo_pants', 40),
    ('bottoms', 'Joggers', 'joggers', 50),
    ('bottoms', 'Shorts', 'shorts', 60),
    ('bottoms', 'Skirt', 'skirt', 70),
    ('outerwear', 'Jacket', 'jacket', 10),
    ('outerwear', 'Coat', 'coat', 20),
    ('outerwear', 'Blazer', 'blazer', 30),
    ('outerwear', 'Overshirt', 'overshirt', 40),
    ('outerwear', 'Parka', 'parka', 50),
    ('outerwear', 'Puffer', 'puffer', 60),
    ('outerwear', 'Vest', 'vest', 70),
    ('dresses_one_pieces', 'Dress', 'dress', 10),
    ('dresses_one_pieces', 'Jumpsuit', 'jumpsuit', 20),
    ('dresses_one_pieces', 'Gown', 'gown', 30),
    ('footwear', 'Sneakers', 'sneakers', 10),
    ('footwear', 'Boots', 'boots', 20),
    ('footwear', 'Loafers', 'loafers', 30),
    ('footwear', 'Formal Shoes', 'formal_shoes', 40),
    ('footwear', 'Sandals', 'sandals', 50),
    ('footwear', 'Slides', 'slides', 60),
    ('accessories', 'Bag', 'bag', 10),
    ('accessories', 'Belt', 'belt', 20),
    ('accessories', 'Hat', 'hat', 30),
    ('accessories', 'Cap', 'cap', 40),
    ('accessories', 'Scarf', 'scarf', 50),
    ('accessories', 'Sunglasses', 'sunglasses', 60),
    ('accessories', 'Jewellery', 'jewellery', 70),
    ('accessories', 'Wallet', 'wallet', 80),
    ('other', 'Other Clothing', 'other_clothing', 10),
    ('other', 'Other Accessory', 'other_accessory', 20)
) as child(parent_slug, name, slug, sort_order)
join public.catalog_categories parent on parent.slug = child.parent_slug;

insert into public.catalog_style_tags (name, slug)
values
  ('Minimal', 'minimal'),
  ('Streetwear', 'streetwear'),
  ('Casual', 'casual'),
  ('Smart Casual', 'smart_casual'),
  ('Formal', 'formal'),
  ('Preppy', 'preppy'),
  ('Workwear', 'workwear'),
  ('Sporty', 'sporty'),
  ('Technical', 'technical'),
  ('Outdoor', 'outdoor'),
  ('Vintage', 'vintage'),
  ('Luxury', 'luxury'),
  ('Contemporary', 'contemporary'),
  ('Classic', 'classic');

insert into public.catalog_brands (
  name,
  slug,
  brand_group,
  category_targets,
  source_status_reason
)
values
  ('Burberry', 'burberry', 'luxury_designer', '{"tops":20,"knitwear":15,"bottoms":20,"outerwear":25,"footwear":20,"accessories":20}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Prada', 'prada', 'luxury_designer', '{"tops":20,"knitwear":15,"bottoms":20,"outerwear":20,"footwear":25,"accessories":25}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Gucci', 'gucci', 'luxury_designer', '{"tops":20,"knitwear":15,"bottoms":20,"outerwear":20,"footwear":25,"accessories":25}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Saint Laurent', 'saint-laurent', 'luxury_designer', '{"tops":20,"knitwear":15,"bottoms":20,"outerwear":25,"footwear":25,"accessories":20}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Bottega Veneta', 'bottega-veneta', 'luxury_designer', '{"tops":15,"knitwear":15,"bottoms":20,"outerwear":20,"footwear":30,"accessories":30}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Ralph Lauren', 'ralph-lauren', 'contemporary_premium', '{"tops":30,"knitwear":20,"bottoms":25,"outerwear":20,"footwear":15,"accessories":15}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('A.P.C.', 'apc', 'contemporary_premium', '{"tops":25,"knitwear":20,"bottoms":30,"outerwear":25,"footwear":15,"accessories":15}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('COS', 'cos', 'contemporary_premium', '{"tops":30,"knitwear":20,"bottoms":30,"outerwear":25,"footwear":15,"accessories":15}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('AMI Paris', 'ami-paris', 'contemporary_premium', '{"tops":25,"knitwear":20,"bottoms":25,"outerwear":25,"footwear":20,"accessories":15}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Acne Studios', 'acne-studios', 'contemporary_premium', '{"tops":25,"knitwear":20,"bottoms":25,"outerwear":25,"footwear":20,"accessories":15}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Zara', 'zara', 'mainstream', '{"tops":30,"knitwear":15,"bottoms":30,"outerwear":25,"dresses_one_pieces":20,"footwear":15,"accessories":15}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Uniqlo', 'uniqlo', 'mainstream', '{"tops":40,"knitwear":25,"bottoms":35,"outerwear":25,"footwear":5,"accessories":10}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('H&M', 'hm', 'mainstream', '{"tops":30,"knitwear":15,"bottoms":30,"outerwear":20,"dresses_one_pieces":20,"footwear":15,"accessories":20}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Mango', 'mango', 'mainstream', '{"tops":25,"knitwear":15,"bottoms":25,"outerwear":25,"dresses_one_pieces":25,"footwear":15,"accessories":20}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Massimo Dutti', 'massimo-dutti', 'mainstream', '{"tops":25,"knitwear":20,"bottoms":30,"outerwear":25,"footwear":20,"accessories":15}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Supreme', 'supreme', 'streetwear', '{"tops":40,"knitwear":10,"bottoms":20,"outerwear":25,"footwear":5,"accessories":30}'::jsonb, 'Limited releases require a controlled manual or authorized source strategy.'),
  ('Stüssy', 'stussy', 'streetwear', '{"tops":40,"knitwear":15,"bottoms":25,"outerwear":25,"footwear":5,"accessories":25}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Carhartt WIP', 'carhartt-wip', 'streetwear', '{"tops":30,"knitwear":15,"bottoms":30,"outerwear":35,"footwear":5,"accessories":20}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Palace', 'palace', 'streetwear', '{"tops":40,"knitwear":15,"bottoms":25,"outerwear":25,"footwear":5,"accessories":20}'::jsonb, 'Limited releases require a controlled manual or authorized source strategy.'),
  ('Fear of God / Essentials', 'fear-of-god-essentials', 'streetwear', '{"tops":40,"knitwear":15,"bottoms":30,"outerwear":25,"footwear":10,"accessories":10}'::jsonb, 'Source identity and collection boundaries require manual review.'),
  ('Nike', 'nike', 'sportswear', '{"tops":25,"bottoms":20,"outerwear":15,"footwear":65,"accessories":20}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Adidas', 'adidas', 'sportswear', '{"tops":25,"bottoms":20,"outerwear":15,"footwear":60,"accessories":25}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('New Balance', 'new-balance', 'sportswear', '{"tops":15,"bottoms":10,"outerwear":10,"footwear":90,"accessories":15}'::jsonb, 'Footwear-led targets reflect the brand range; source approval is still required.'),
  ('Puma', 'puma', 'sportswear', '{"tops":25,"bottoms":20,"outerwear":15,"footwear":65,"accessories":20}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('ASICS', 'asics', 'sportswear', '{"tops":20,"bottoms":15,"outerwear":10,"footwear":85,"accessories":15}'::jsonb, 'Footwear-led targets reflect the brand range; source approval is still required.'),
  ('Arc''teryx', 'arcteryx', 'outdoor_technical', '{"tops":20,"bottoms":25,"outerwear":70,"footwear":15,"accessories":20}'::jsonb, 'Technical outerwear-led targets reflect the brand range; source approval is still required.'),
  ('The North Face', 'the-north-face', 'outdoor_technical', '{"tops":25,"bottoms":20,"outerwear":60,"footwear":15,"accessories":25}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Patagonia', 'patagonia', 'outdoor_technical', '{"tops":30,"bottoms":20,"outerwear":60,"footwear":5,"accessories":25}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.'),
  ('Salomon', 'salomon', 'outdoor_technical', '{"tops":15,"bottoms":15,"outerwear":20,"footwear":80,"accessories":20}'::jsonb, 'Footwear-led targets reflect the brand range; source approval is still required.'),
  ('Columbia', 'columbia', 'outdoor_technical', '{"tops":25,"bottoms":25,"outerwear":60,"footwear":15,"accessories":20}'::jsonb, 'Source terms, robots policy, and approved entry URLs require manual review.');

create function public.catalog_admin_overview()
returns table (
  total_brands bigint,
  enabled_brands bigint,
  total_products bigint,
  raw_products bigint,
  validated_products bigint,
  needs_review_products bigint,
  rejected_products bigint,
  failed_imports bigint,
  duplicate_imports bigint
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not public.is_catalog_developer() then
    raise exception 'catalog developer access required' using errcode = '42501';
  end if;

  return query
  select
    (select count(*) from public.catalog_brands),
    (select count(*) from public.catalog_brands where enabled),
    (select count(*) from public.catalog_products),
    (select count(*) from public.catalog_products where status = 'raw'),
    (select count(*) from public.catalog_products where status = 'validated'),
    (select count(*) from public.catalog_products where status = 'needs_review'),
    (select count(*) from public.catalog_products where status = 'rejected'),
    (select coalesce(sum(failed_count), 0) from public.catalog_import_jobs),
    (select coalesce(sum(duplicate_count), 0) from public.catalog_import_jobs);
end;
$$;

create function public.catalog_admin_brand_progress()
returns table (
  brand_id uuid,
  brand_name text,
  brand_slug text,
  source_status public.catalog_brand_source_status,
  enabled boolean,
  target_validated_count integer,
  total_count bigint,
  validated_count bigint,
  needs_review_count bigint,
  rejected_count bigint,
  category_targets jsonb,
  category_distribution jsonb,
  enabled_source_count bigint
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not public.is_catalog_developer() then
    raise exception 'catalog developer access required' using errcode = '42501';
  end if;

  return query
  select
    b.id,
    b.name,
    b.slug,
    b.source_status,
    b.enabled,
    b.target_validated_count,
    count(p.id) as total_count,
    count(p.id) filter (where p.status = 'validated') as validated_count,
    count(p.id) filter (where p.status = 'needs_review') as needs_review_count,
    count(p.id) filter (where p.status = 'rejected') as rejected_count,
    b.category_targets,
    coalesce(distribution.counts, '{}'::jsonb),
    (select count(*) from public.catalog_brand_sources s where s.brand_id = b.id and s.enabled)
  from public.catalog_brands b
  left join public.catalog_products p on p.brand_id = b.id
  left join lateral (
    select jsonb_object_agg(category_counts.slug, category_counts.product_count) as counts
    from (
      select c.slug, count(cp.id) as product_count
      from public.catalog_categories c
      left join public.catalog_products cp
        on cp.category_id = c.id
        and cp.brand_id = b.id
        and cp.status = 'validated'
      where c.level = 1
      group by c.slug
    ) category_counts
  ) distribution on true
  group by b.id, distribution.counts
  order by b.brand_group, b.name;
end;
$$;

create function public.catalog_admin_review_queue(p_limit integer default 50)
returns table (
  product_id uuid,
  brand_name text,
  product_name text,
  status public.catalog_product_status,
  current_price numeric,
  currency text,
  source_url text,
  raw_category text,
  primary_color text,
  color_family text,
  material_summary text,
  price_unavailable boolean,
  category_slug text,
  subcategory_slug text,
  image_url text,
  confidence numeric,
  warnings text[],
  errors text[],
  style_tags text[]
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not public.is_catalog_developer() then
    raise exception 'catalog developer access required' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    b.name,
    p.name,
    p.status,
    p.current_price,
    p.currency,
    p.source_url,
    p.raw_category,
    p.primary_color,
    p.color_family,
    p.material_summary,
    p.price_unavailable,
    category.slug,
    subcategory.slug,
    (
      select image.image_url
      from public.catalog_product_images image
      where image.product_id = p.id
      order by image.position
      limit 1
    ),
    p.overall_confidence,
    p.validation_warnings,
    p.validation_errors,
    coalesce(
      (
        select array_agg(tag.slug order by tag.slug)
        from public.catalog_product_style_tags product_tag
        join public.catalog_style_tags tag on tag.id = product_tag.style_tag_id
        where product_tag.product_id = p.id
      ),
      '{}'::text[]
    )
  from public.catalog_products p
  join public.catalog_brands b on b.id = p.brand_id
  join public.catalog_categories category on category.id = p.category_id
  left join public.catalog_categories subcategory on subcategory.id = p.subcategory_id
  where p.status = 'needs_review'
  order by p.updated_at asc
  limit least(greatest(p_limit, 1), 200);
end;
$$;

create function public.catalog_admin_recent_jobs(p_limit integer default 25)
returns table (
  job_id uuid,
  brand_name text,
  status public.catalog_import_job_status,
  operation text,
  requested_count integer,
  discovered_count integer,
  imported_count integer,
  validated_count integer,
  rejected_count integer,
  duplicate_count integer,
  failed_count integer,
  started_at timestamptz,
  completed_at timestamptz,
  error_summary text
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not public.is_catalog_developer() then
    raise exception 'catalog developer access required' using errcode = '42501';
  end if;

  return query
  select
    job.id,
    brand.name,
    job.status,
    job.operation,
    job.requested_count,
    job.discovered_count,
    job.imported_count,
    job.validated_count,
    job.rejected_count,
    job.duplicate_count,
    job.failed_count,
    job.started_at,
    job.completed_at,
    job.error_summary
  from public.catalog_import_jobs job
  join public.catalog_brands brand on brand.id = job.brand_id
  order by job.created_at desc
  limit least(greatest(p_limit, 1), 100);
end;
$$;

create function public.catalog_admin_import_errors(
  p_job_id uuid default null,
  p_limit integer default 50
)
returns table (
  error_id uuid,
  job_id uuid,
  product_url text,
  error_type text,
  message text,
  retryable boolean,
  created_at timestamptz
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not public.is_catalog_developer() then
    raise exception 'catalog developer access required' using errcode = '42501';
  end if;

  return query
  select
    import_error.id,
    import_error.import_job_id,
    import_error.product_url,
    import_error.error_type,
    import_error.message,
    import_error.retryable,
    import_error.created_at
  from public.catalog_import_errors import_error
  where p_job_id is null or import_error.import_job_id = p_job_id
  order by import_error.created_at desc
  limit least(greatest(p_limit, 1), 200);
end;
$$;

revoke all on function public.catalog_admin_overview() from public, anon;
revoke all on function public.catalog_admin_brand_progress() from public, anon;
revoke all on function public.catalog_admin_review_queue(integer) from public, anon;
revoke all on function public.catalog_admin_recent_jobs(integer) from public, anon;
revoke all on function public.catalog_admin_import_errors(uuid, integer) from public, anon;
grant execute on function public.catalog_admin_overview() to authenticated;
grant execute on function public.catalog_admin_brand_progress() to authenticated;
grant execute on function public.catalog_admin_review_queue(integer) to authenticated;
grant execute on function public.catalog_admin_recent_jobs(integer) to authenticated;
grant execute on function public.catalog_admin_import_errors(uuid, integer) to authenticated;

revoke all on table public.catalog_developers from public, anon, authenticated;
revoke all on table public.catalog_brands from public, anon, authenticated;
revoke all on table public.catalog_brand_sources from public, anon, authenticated;
revoke all on table public.catalog_categories from public, anon, authenticated;
revoke all on table public.catalog_products from public, anon, authenticated;
revoke all on table public.catalog_product_variants from public, anon, authenticated;
revoke all on table public.catalog_product_images from public, anon, authenticated;
revoke all on table public.catalog_style_tags from public, anon, authenticated;
revoke all on table public.catalog_product_style_tags from public, anon, authenticated;
revoke all on table public.catalog_product_style_profiles from public, anon, authenticated;
revoke all on table public.catalog_product_materials from public, anon, authenticated;
revoke all on table public.catalog_product_sources from public, anon, authenticated;
revoke all on table public.catalog_collections from public, anon, authenticated;
revoke all on table public.catalog_product_collections from public, anon, authenticated;
revoke all on table public.catalog_import_jobs from public, anon, authenticated;
revoke all on table public.catalog_import_entries from public, anon, authenticated;
revoke all on table public.catalog_import_errors from public, anon, authenticated;

grant select on table public.catalog_developers to authenticated;
grant select on table public.catalog_brands to authenticated;
grant select on table public.catalog_brand_sources to authenticated;
grant select on table public.catalog_categories to authenticated;
grant select on table public.catalog_products to authenticated;
grant select on table public.catalog_product_variants to authenticated;
grant select on table public.catalog_product_images to authenticated;
grant select on table public.catalog_style_tags to authenticated;
grant select on table public.catalog_product_style_tags to authenticated;
grant select on table public.catalog_product_style_profiles to authenticated;
grant select on table public.catalog_product_materials to authenticated;
grant select on table public.catalog_product_sources to authenticated;
grant select on table public.catalog_collections to authenticated;
grant select on table public.catalog_product_collections to authenticated;
grant select on table public.catalog_import_jobs to authenticated;
grant select on table public.catalog_import_entries to authenticated;
grant select on table public.catalog_import_errors to authenticated;

alter table public.catalog_developers enable row level security;
alter table public.catalog_brands enable row level security;
alter table public.catalog_brand_sources enable row level security;
alter table public.catalog_categories enable row level security;
alter table public.catalog_products enable row level security;
alter table public.catalog_product_variants enable row level security;
alter table public.catalog_product_images enable row level security;
alter table public.catalog_style_tags enable row level security;
alter table public.catalog_product_style_tags enable row level security;
alter table public.catalog_product_style_profiles enable row level security;
alter table public.catalog_product_materials enable row level security;
alter table public.catalog_product_sources enable row level security;
alter table public.catalog_collections enable row level security;
alter table public.catalog_product_collections enable row level security;
alter table public.catalog_import_jobs enable row level security;
alter table public.catalog_import_entries enable row level security;
alter table public.catalog_import_errors enable row level security;

create policy "Users can read their own catalogue developer membership"
on public.catalog_developers for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Authenticated users can read enabled catalogue brands"
on public.catalog_brands for select to authenticated
using (enabled or public.is_catalog_developer());

create policy "Catalogue developers can read brand sources"
on public.catalog_brand_sources for select to authenticated
using (public.is_catalog_developer());

create policy "Authenticated users can read enabled catalogue categories"
on public.catalog_categories for select to authenticated
using (enabled or public.is_catalog_developer());

create policy "Authenticated users can read validated catalogue products"
on public.catalog_products for select to authenticated
using (status = 'validated' or public.is_catalog_developer());

create policy "Authenticated users can read visible catalogue variants"
on public.catalog_product_variants for select to authenticated
using (
  exists (
    select 1 from public.catalog_products product
    where product.id = catalog_product_variants.product_id
    and (product.status = 'validated' or public.is_catalog_developer())
  )
);

create policy "Authenticated users can read visible catalogue images"
on public.catalog_product_images for select to authenticated
using (
  exists (
    select 1 from public.catalog_products product
    where product.id = catalog_product_images.product_id
    and (product.status = 'validated' or public.is_catalog_developer())
  )
);

create policy "Authenticated users can read catalogue style tags"
on public.catalog_style_tags for select to authenticated
using (true);

create policy "Authenticated users can read visible product style tags"
on public.catalog_product_style_tags for select to authenticated
using (
  exists (
    select 1 from public.catalog_products product
    where product.id = catalog_product_style_tags.product_id
    and (product.status = 'validated' or public.is_catalog_developer())
  )
);

create policy "Authenticated users can read visible product style profiles"
on public.catalog_product_style_profiles for select to authenticated
using (
  exists (
    select 1 from public.catalog_products product
    where product.id = catalog_product_style_profiles.product_id
    and (product.status = 'validated' or public.is_catalog_developer())
  )
);

create policy "Authenticated users can read visible product materials"
on public.catalog_product_materials for select to authenticated
using (
  exists (
    select 1 from public.catalog_products product
    where product.id = catalog_product_materials.product_id
    and (product.status = 'validated' or public.is_catalog_developer())
  )
);

create policy "Catalogue developers can read product source records"
on public.catalog_product_sources for select to authenticated
using (public.is_catalog_developer());

create policy "Authenticated users can read catalogue collections"
on public.catalog_collections for select to authenticated
using (
  public.is_catalog_developer()
  or exists (
    select 1
    from public.catalog_product_collections product_collection
    join public.catalog_products product on product.id = product_collection.product_id
    where product_collection.collection_id = catalog_collections.id
    and product.status = 'validated'
  )
);

create policy "Authenticated users can read visible product collections"
on public.catalog_product_collections for select to authenticated
using (
  exists (
    select 1 from public.catalog_products product
    where product.id = catalog_product_collections.product_id
    and (product.status = 'validated' or public.is_catalog_developer())
  )
);

create policy "Catalogue developers can read import jobs"
on public.catalog_import_jobs for select to authenticated
using (public.is_catalog_developer());

create policy "Catalogue developers can read import checkpoints"
on public.catalog_import_entries for select to authenticated
using (public.is_catalog_developer());

create policy "Catalogue developers can read import errors"
on public.catalog_import_errors for select to authenticated
using (public.is_catalog_developer());

comment on table public.catalog_products is
  'Canonical catalogue products. One row represents one marketed colourway; size and stock options are variants.';
comment on table public.catalog_import_entries is
  'Durable per-URL checkpoints used to resume explicit catalogue import jobs without repeating successful work.';

commit;
