begin;

alter table public.catalog_brands
add column featured boolean not null default false,
add column last_synced_at timestamptz null;

comment on column public.catalog_brands.featured is
  'Editorially curated flag for the consumer Browse Brands surface. It is not a popularity metric.';

alter table public.wardrobe_items
add column size text null,
add column image_urls text[] not null default '{}'::text[],
add column source_type text null,
add column metadata jsonb not null default '{}'::jsonb;

update public.wardrobe_items
set
  source_type = case
    when import_method = 'website-url' then 'url_import'
    else 'manual'
  end,
  image_urls = case
    when image_url is null then '{}'::text[]
    else array[image_url]
  end
where source_type is null;

alter table public.wardrobe_items
alter column source_type set not null,
alter column source_type set default 'manual';

alter table public.wardrobe_items
drop constraint wardrobe_items_import_method,
drop constraint wardrobe_items_source_for_website;

alter table public.wardrobe_items
add constraint wardrobe_items_import_method
check (import_method in ('catalog', 'manual', 'website-url')),
add constraint wardrobe_items_source_type
check (source_type in ('catalog', 'manual', 'url_import')),
add constraint wardrobe_items_source_consistency
check (
  (source_type = 'catalog' and import_method = 'catalog' and catalog_product_id is not null)
  or (source_type = 'url_import' and import_method = 'website-url' and source_url is not null)
  or (source_type = 'manual' and import_method = 'manual')
),
add constraint wardrobe_items_extended_fields
check (
  char_length(coalesce(size, '')) <= 100
  and jsonb_typeof(metadata) = 'object'
  and cardinality(image_urls) <= 24
);

create index catalog_brands_featured_name_idx
on public.catalog_brands (featured desc, name)
where enabled;

create index catalog_brands_lower_name_idx
on public.catalog_brands (lower(name));

create index wardrobe_items_user_catalog_product_idx
on public.wardrobe_items (user_id, catalog_product_id)
where catalog_product_id is not null;

create function public.catalog_browse_brand_categories(p_brand_id uuid)
returns table (
  category_id uuid,
  category_name text,
  category_slug text,
  product_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    category.id,
    category.name,
    category.slug,
    count(product.id)
  from public.catalog_categories category
  join public.catalog_products product
    on product.category_id = category.id
    and product.brand_id = p_brand_id
    and product.status = 'validated'
  where category.enabled and category.level = 1
  group by category.id, category.name, category.slug, category.sort_order
  order by category.sort_order, category.name;
$$;

revoke all on function public.catalog_browse_brand_categories(uuid) from public, anon;
grant execute on function public.catalog_browse_brand_categories(uuid) to authenticated;

commit;
