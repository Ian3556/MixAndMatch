begin;

alter type public.catalog_source_type add value if not exists 'synthetic';
alter type public.catalog_extraction_method add value if not exists 'synthetic';

create type public.catalog_product_source_type as enum (
  'synthetic',
  'manual',
  'affiliate',
  'brand_api',
  'url_import'
);

create type public.catalog_image_source_type as enum (
  'placeholder',
  'manual_upload',
  'generated',
  'affiliate',
  'brand_api',
  'url_import'
);

alter table public.catalog_brands
add column has_demo_catalog boolean not null default false;

alter table public.catalog_products
add column source_type public.catalog_product_source_type not null default 'url_import',
add column is_demo boolean not null default false,
add column image_source_type public.catalog_image_source_type not null default 'url_import';

alter table public.catalog_product_variants
add column is_demo boolean not null default false;

alter table public.catalog_product_images
add column source_type public.catalog_image_source_type not null default 'url_import',
add column is_demo boolean not null default false;

alter table public.catalog_product_style_tags
add column is_demo boolean not null default false;

alter table public.catalog_product_style_profiles
add column length text null,
add column layer_position text null,
add column body_type_tags text[] not null default '{}'::text[],
add column skin_tone_tags text[] not null default '{}'::text[],
add column is_demo boolean not null default false;

alter table public.catalog_product_materials
add column is_demo boolean not null default false;

alter table public.catalog_product_sources
add column is_demo boolean not null default false;

alter table public.catalog_product_style_profiles
add constraint catalog_product_style_profiles_synthetic_lengths
check (
  char_length(coalesce(length, '')) <= 100
  and char_length(coalesce(layer_position, '')) <= 100
  and cardinality(body_type_tags) <= 24
  and cardinality(skin_tone_tags) <= 24
);

create index catalog_products_demo_status_idx
on public.catalog_products (is_demo, status);

create index catalog_products_browse_filters_idx
on public.catalog_products (brand_id, status, gender, color_family, current_price);

create index catalog_product_variants_size_product_idx
on public.catalog_product_variants (size, product_id);

comment on column public.catalog_products.is_demo is
  'True only for development/test catalogue records. Never present demo products as live retailer listings.';

comment on column public.catalog_products.source_type is
  'Normalized product source abstraction consumed by the app independently of any provider adapter.';

comment on column public.catalog_products.image_source_type is
  'Expected primary image source. Placeholder means the app renders local fallback artwork with no remote photo.';

create function public.catalog_browse_brands(
  p_query text default null,
  p_offset integer default 0,
  p_limit integer default 20
)
returns table (
  brand_id uuid,
  brand_name text,
  brand_slug text,
  logo_url text,
  website_url text,
  source_status public.catalog_brand_source_status,
  featured boolean,
  last_synced_at timestamptz,
  has_demo_catalog boolean,
  product_count bigint,
  total_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with matching as (
    select
      brand.id,
      brand.name,
      brand.slug,
      brand.logo_url,
      brand.website_url,
      brand.source_status,
      brand.featured,
      brand.last_synced_at,
      brand.has_demo_catalog,
      count(product.id) as product_count
    from public.catalog_brands brand
    join public.catalog_products product
      on product.brand_id = brand.id
      and product.status = 'validated'
    where
      brand.enabled
      and (
        nullif(btrim(p_query), '') is null
        or brand.name ilike '%' || btrim(p_query) || '%'
      )
    group by brand.id
  )
  select
    matching.id,
    matching.name,
    matching.slug,
    matching.logo_url,
    matching.website_url,
    matching.source_status,
    matching.featured,
    matching.last_synced_at,
    matching.has_demo_catalog,
    matching.product_count,
    count(*) over () as total_count
  from matching
  order by matching.name
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0);
$$;

create function public.catalog_search_products(
  p_query text default null,
  p_brand_id uuid default null,
  p_category_id uuid default null,
  p_gender text default null,
  p_color_family text default null,
  p_size text default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_style_tags text[] default '{}'::text[],
  p_sort text default 'newest',
  p_offset integer default 0,
  p_limit integer default 20
)
returns table (
  product_id uuid,
  brand_id uuid,
  brand_name text,
  product_name text,
  category_id uuid,
  category_name text,
  primary_color text,
  color_family text,
  gender text,
  image_url text,
  image_source_type public.catalog_image_source_type,
  current_price numeric,
  currency text,
  availability text,
  source_type public.catalog_product_source_type,
  is_demo boolean,
  total_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    product.id,
    product.brand_id,
    brand.name,
    product.name,
    product.category_id,
    category.name,
    product.primary_color,
    product.color_family,
    product.gender::text,
    image.image_url,
    coalesce(image.source_type, product.image_source_type),
    product.current_price,
    product.currency,
    product.availability,
    product.source_type,
    product.is_demo,
    count(*) over ()
  from public.catalog_products product
  join public.catalog_brands brand on brand.id = product.brand_id and brand.enabled
  join public.catalog_categories category on category.id = product.category_id
  left join lateral (
    select product_image.image_url, product_image.source_type
    from public.catalog_product_images product_image
    where product_image.product_id = product.id
    order by product_image.position
    limit 1
  ) image on true
  where
    product.status = 'validated'
    and (p_brand_id is null or product.brand_id = p_brand_id)
    and (p_category_id is null or product.category_id = p_category_id)
    and (nullif(btrim(p_gender), '') is null or product.gender::text = p_gender)
    and (nullif(btrim(p_color_family), '') is null or product.color_family = p_color_family)
    and (p_min_price is null or product.current_price >= p_min_price)
    and (p_max_price is null or product.current_price <= p_max_price)
    and (
      nullif(btrim(p_query), '') is null
      or product.search_document @@ websearch_to_tsquery('simple', btrim(p_query))
      or brand.name ilike '%' || btrim(p_query) || '%'
    )
    and (
      nullif(btrim(p_size), '') is null
      or exists (
        select 1
        from public.catalog_product_variants variant
        where variant.product_id = product.id and variant.size = p_size
      )
    )
    and (
      coalesce(cardinality(p_style_tags), 0) = 0
      or not exists (
        select 1
        from unnest(p_style_tags) as requested_style(slug)
        where not exists (
          select 1
          from public.catalog_product_style_tags product_style
          join public.catalog_style_tags style_tag on style_tag.id = product_style.style_tag_id
          where product_style.product_id = product.id and style_tag.slug = requested_style.slug
        )
      )
    )
  order by
    case when p_sort = 'price_asc' then product.current_price end asc nulls last,
    case when p_sort = 'price_desc' then product.current_price end desc nulls last,
    case when p_sort = 'name' then product.name end asc,
    case when p_sort = 'newest' then product.created_at end desc,
    product.id
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0);
$$;

create function public.catalog_browse_filter_options(p_brand_id uuid)
returns table (
  genders text[],
  color_families text[],
  sizes text[],
  style_tags text[],
  minimum_price numeric,
  maximum_price numeric
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    coalesce(array_agg(distinct product.gender::text order by product.gender::text), '{}'::text[]),
    coalesce(array_agg(distinct product.color_family order by product.color_family) filter (where product.color_family is not null), '{}'::text[]),
    coalesce((
      select array_agg(distinct variant.size order by variant.size)
      from public.catalog_product_variants variant
      join public.catalog_products variant_product on variant_product.id = variant.product_id
      where variant_product.brand_id = p_brand_id and variant_product.status = 'validated' and variant.size is not null
    ), '{}'::text[]),
    coalesce((
      select array_agg(distinct style_tag.slug order by style_tag.slug)
      from public.catalog_product_style_tags product_style
      join public.catalog_style_tags style_tag on style_tag.id = product_style.style_tag_id
      join public.catalog_products style_product on style_product.id = product_style.product_id
      where style_product.brand_id = p_brand_id and style_product.status = 'validated'
    ), '{}'::text[]),
    min(product.current_price),
    max(product.current_price)
  from public.catalog_products product
  where product.brand_id = p_brand_id and product.status = 'validated';
$$;

revoke all on function public.catalog_browse_brands(text, integer, integer) from public, anon;
revoke all on function public.catalog_search_products(text, uuid, uuid, text, text, text, numeric, numeric, text[], text, integer, integer) from public, anon;
revoke all on function public.catalog_browse_filter_options(uuid) from public, anon;

grant execute on function public.catalog_browse_brands(text, integer, integer) to authenticated;
grant execute on function public.catalog_search_products(text, uuid, uuid, text, text, text, numeric, numeric, text[], text, integer, integer) to authenticated;
grant execute on function public.catalog_browse_filter_options(uuid) to authenticated;

commit;
