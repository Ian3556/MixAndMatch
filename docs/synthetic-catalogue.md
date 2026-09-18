# Development synthetic catalogue

The MixAndMatch synthetic catalogue is a deterministic development dataset for catalogue browsing,
wardrobe saves, styling-engine work, recommendations, filters, and product-detail testing. It is
not retailer data. Product names, descriptions, prices, styling metadata, SKUs, and availability
are fictional. Real brand names are used only as development metadata.

The implementation does not scrape sites, call private retailer APIs, download retailer product
photography, or represent generated prices as current prices.

## Database structure

The feature extends the existing normalized catalogue rather than creating parallel tables:

| Concern          | Existing table                                     | Synthetic additions                                                        |
| ---------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| Brands           | `catalog_brands`                                   | `has_demo_catalog` distinguishes demo availability from live source status |
| Products         | `catalog_products`                                 | `source_type`, `is_demo`, and `image_source_type`                          |
| Sizes and stock  | `catalog_product_variants`                         | deterministic demo SKUs and `is_demo`                                      |
| Styling          | `catalog_product_style_profiles`                   | length, layer position, body/skin-tone tags, and `is_demo`                 |
| Style vocabulary | `catalog_style_tags`, `catalog_product_style_tags` | weighted deterministic assignments                                         |
| Materials        | `catalog_product_materials`                        | percentages and `is_demo`                                                  |
| Provenance       | `catalog_product_sources`                          | synthetic extraction method, seed snapshot, and `is_demo`                  |
| Images           | `catalog_product_images`                           | normalized image source type; no row means local placeholder artwork       |

Migration: `supabase/migrations/20260918000100_add_synthetic_catalogue.sql`.

The migration is additive. It preserves the existing catalogue ingestion pipeline, validated-product
RLS policies, private `wardrobe_items`, and the nullable catalogue provenance link. Demo products
are readable through the same normalized product model as future manual, affiliate, brand API, and
URL-import products.

## Generator design

Configuration lives in `src/data/catalog/`:

- `brands.ts`: the 30-brand development set, default seed, and default product count;
- `brandProfiles.ts`: brand positioning, category weights, style weights, gender mix, and price multiplier;
- `categories.ts`: the category/subcategory hierarchy and valid attribute combinations;
- `attributes.ts`: colours, colour families, style vocabulary, stock states, and compatibility tags;
- `generator.ts`: seeded selection, stable IDs, product naming, prices, variants, and provenance;
- `validator.ts`: structural, taxonomy, duplicate, styling, variant, image-fallback, and contradiction checks.

The default seed is `2026`. Product and variant UUIDs are derived from the seed, brand slug, product
position, colour, and size. The generated timestamp is fixed. Running the same configuration twice
therefore returns byte-equivalent JSON and the same SHA-256 hash.

Brand profiles use weighted choices. A sports brand strongly favours footwear and sportswear; a
minimalist brand favours shirts, trousers, knitwear, and outerwear; a denim/workwear brand favours
jeans and jackets. Category definitions own valid materials, warmth, seasons, fits, layers, and sizes,
which prevents combinations such as a heavy winter coat tagged for summer.

## Generate and validate

Requirements: the project-supported Node version and installed dependencies.

```powershell
npm run catalog:validate
npm run catalog:generate
```

`catalog:validate` generates twice in memory, compares deterministic hashes, and prints brand,
product, variant, category, placeholder, and validation totals. `catalog:generate` also writes
`.catalog/synthetic-catalog.json`; `.catalog/` is ignored by Git.

Generated products deliberately have no remote product photo. `image_source_type = placeholder`
causes the existing application-owned `PlaceholderArtwork` component to render. The validation
summary reports these as missing remote images and separately confirms that every one has a fallback.

## Change the seed or product count

Use CLI flags without editing source:

```powershell
npm run catalog:validate -- --seed 2030 --count 1200
npm run catalog:generate -- --seed 2030 --count 1200 --out .catalog/catalog-2030.json
```

To change project defaults, edit `CATALOG_SEED` or `DEFAULT_PRODUCT_COUNT` in
`src/data/catalog/brands.ts`. Counts are distributed evenly across all configured brands; any
remainder is assigned deterministically in configuration order.

Changing a seed produces different deterministic IDs. Reset existing demo products before seeding
a different seed so obsolete demo rows do not remain.

## Add or change a brand

1. Add the real brand name, stable slug, segment, and featured flag in `brands.ts`.
2. Add a matching entry to `BRAND_PROFILES` in `brandProfiles.ts`.
3. Use only subcategory slugs defined in `categories.ts` and style slugs in `attributes.ts`.
4. Run `npm run catalog:validate` and inspect the per-brand/category distribution.
5. Seed only after applying the migration to the intended development project.

Brand identity is not a claim of retailer integration. Existing `source_status` governance remains
unchanged. `has_demo_catalog` only tells consumer UI that synthetic products exist.

## Seed Supabase

The seed script is intentionally dry-run unless `--apply` is present. It also refuses to write unless
both development safety switches are explicit. The service-role key must remain server-side and must
never use an `EXPO_PUBLIC_*` name.

Review and apply the migration first:

```powershell
npx supabase migration list --linked
npx supabase db push --linked --dry-run
npx supabase db push --linked
```

Then set process-local development variables using your normal secret-management workflow:

```text
SUPABASE_URL=https://YOUR-DEVELOPMENT-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SERVER_ONLY_DEVELOPMENT_KEY
MIXANDMATCH_CATALOG_ENV=development
CATALOG_ALLOW_SYNTHETIC_SEED=true
```

Seed or update the deterministic rows:

```powershell
npm run catalog:seed
```

Normal seeding upserts stable IDs and does not delete first, so wardrobe provenance links remain
intact when the seed/configuration is unchanged. The script writes in bounded batches and uses the
existing category and style-tag IDs from the target database.

## Reset only synthetic catalogue data

```powershell
npm run catalog:reset-demo
```

This deletes only `catalog_products` where `is_demo = true`. Product children cascade; non-demo
catalogue rows, brands, user profiles, and wardrobe rows remain. Because
`wardrobe_items.catalog_product_id` uses `ON DELETE SET NULL`, wardrobe items previously copied from a
demo product remain usable but lose their catalogue provenance link. Re-seeding does not automatically
reattach those historical rows.

To reset and reseed in one guarded command:

```powershell
npm run catalog:seed -- --reset-existing
```

Use reset only when changing seeds/configuration or intentionally clearing demo data. Routine runs
should use the non-destructive upsert.

## Browse Brands and filtering

The migration provides security-invoker RPCs that still respect existing RLS:

- `catalog_browse_brands`: enabled brands with validated products and real product counts;
- `catalog_search_products`: text, brand, category, gender, colour, size, MYR price, style, sort, and pagination;
- `catalog_browse_filter_options`: available filter values for one brand;
- existing `catalog_browse_brand_categories`: level-one category counts.

The current flow is:

```text
Wardrobe → Add → Search Brand → Browse Products → Product Details → Add to Wardrobe
```

Grid/list display, local image fallback, loading/error/empty states, duplicate confirmation, and real
Wardrobe persistence are preserved.

## Future real-data adapters

Frontend code reads one normalized catalogue model and never branches on a retailer provider. New
adapters should normalize into `catalog_products` and children, set the product `source_type`, and
record provider-specific evidence in `catalog_product_sources`. Supported normalized source types are:

- `synthetic`
- `manual`
- `affiliate`
- `brand_api`
- `url_import`

Image records independently identify `placeholder`, `manual_upload`, `generated`, `affiliate`,
`brand_api`, or `url_import`. Replacing placeholders with licensed images therefore requires data
changes, not a frontend rewrite.

Do not reinterpret the synthetic generator as a real-data importer. The existing governed catalogue
pipeline and source-review process remain the path for real products.
