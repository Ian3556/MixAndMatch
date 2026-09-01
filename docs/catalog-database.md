# Mix & Match catalogue database

This document describes the development catalogue architecture introduced on 2026-08-08. It is a
local implementation contract, not evidence that a remote Supabase project was migrated or that
retailer sources were approved.

## What this system is

The catalogue is a normalized, global product domain for brand discovery, search, wardrobe import,
styling attributes, and future compatibility reasoning. It is separate from `wardrobe_items`, which
remains private user-owned data.

The system supports:

- 30 configured brand identities and a 150-validated-product target per brand;
- more than 5,000 product rows without changing the schema;
- canonical category and style vocabularies;
- products, colourways, size/availability variants, remote images, materials, and provenance;
- deterministic enrichment and explicit confidence;
- validated, review, rejected, unavailable, and archived product states;
- explicit import jobs, per-URL checkpoints, retry limits, errors, and counters;
- future URL, CSV, retailer feed, affiliate feed, brand API, PIM, and manual adapters;
- a development-only operations screen.

It does not include 4,500 fabricated or silently scraped products. Product population is a separate
phased operation governed by `docs/catalog-source-status.md`.

## Architecture

```text
Approved URL / manual seed / future CSV, feed, API, or PIM
  -> CatalogImporterAdapter
  -> RawCatalogProductCandidate
  -> canonical normalization
  -> deterministic enrichment
  -> validation and confidence gate
  -> deduplication
  -> canonical catalog_* tables
  -> validated consumer reads or developer review queue
```

Important boundaries:

- the Expo app has no trusted API runtime;
- all public-page fetching and catalogue writes run in Supabase Edge Functions;
- the app bundle contains only the publishable Supabase key;
- `SUPABASE_SERVICE_ROLE_KEY` is read only by `catalog-management`;
- the developer screen is a convenience gate, not authorization;
- `catalog_developers` membership and server checks authorize every operation.

## Schema

Migration: `supabase/migrations/20260808000100_create_catalog_database.sql`

Core identity and taxonomy:

- `catalog_developers`
- `catalog_brands`
- `catalog_brand_sources`
- `catalog_categories`
- `catalog_style_tags`

Product data:

- `catalog_products`
- `catalog_product_variants`
- `catalog_product_images`
- `catalog_product_style_tags`
- `catalog_product_style_profiles`
- `catalog_product_materials`
- `catalog_product_sources`
- `catalog_collections`
- `catalog_product_collections`

Operations:

- `catalog_import_jobs`
- `catalog_import_entries`
- `catalog_import_errors`

`wardrobe_items.catalog_product_id` is nullable and uses `ON DELETE SET NULL`. A user's wardrobe row
therefore remains usable when a catalogue product is archived or removed.

## Taxonomy

Canonical level-one categories are:

- `tops`
- `knitwear`
- `bottoms`
- `outerwear`
- `dresses_one_pieces`
- `footwear`
- `accessories`
- `other`

Level-two slugs include the requested garment types, such as `t_shirt`, `hoodie`, `cargo_pants`,
`puffer`, `sneakers`, `formal_shoes`, `bag`, and `jewellery`.

Retailer labels are evidence, not internal categories. For example, “Men's Lifestyle Relaxed Tee”
normalizes to `tops / t_shirt`. An unknown label becomes `other / other_clothing` with low
confidence and enters review; the normalizer does not invent a confident category.

Source: `supabase/functions/_shared/catalog/taxonomy.ts`.

## Product and colourway identity

One `catalog_products` row represents one marketed colourway. Size and stock options belong in
`catalog_product_variants`.

Deduplication uses the strongest available evidence in order:

1. brand + colourway SKU;
2. brand + external product ID + colour family;
3. brand + canonical URL + colour family;
4. brand + normalized product name + colour family.

This prevents two discovery paths from creating duplicate rows without merging black and white
colourways into one product. Database uniqueness on `(brand_id, deduplication_key)` is the final
idempotency barrier.

## Normalization and enrichment

The pure pipeline lives under `supabase/functions/_shared/catalog/` and is tested without live
retailer requests.

Normalization covers:

- text and stable slugs;
- canonical and tracking-free URLs;
- retailer categories;
- gender;
- prices and currencies;
- primary colour and colour family;
- common materials and percentages;
- image ordering and duplicate removal;
- variant keys;
- catalogue deduplication keys.

Rule-based enrichment covers:

- fit;
- silhouette;
- pattern;
- texture;
- layer role;
- style tags;
- season and occasion tags;
- formality and warmth scores.

The current enrichment version is deterministic. The schema retains an `ai_confidence` field so a
future model-assisted enricher can coexist with rules, but this implementation does not call an AI
model or claim AI-derived facts.

## Validation

A product is never counted toward a brand's target until its status is `validated`.

Required evidence includes:

- configured brand;
- product name;
- public source URL and matching source domain;
- usable remote image;
- valid canonical category;
- colour family;
- price or an explicit unavailable-price state;
- styling classification;
- normalization and deduplication identity.

Structural failures such as an invalid source URL, missing image, brand mismatch, or invalid
category are rejected. Correctable uncertainty—missing colour, currency, style evidence, or low
confidence—enters `needs_review`.

Manual approval rechecks required stored fields. It cannot override a still-missing image, colour,
price state, source, or styling profile.

## Import adapters

`CatalogImporterAdapter` defines:

- adapter ID and source type;
- `canHandle(source)`;
- `extract(source)` returning raw catalogue candidates.

The initial `GenericStructuredDataAdapter` reuses the existing bounded wardrobe extractor for
JSON-LD, Open Graph, common commerce markup, and conservative HTML metadata. This is one adapter,
not the catalogue model.

Create a domain adapter only when the public structured page data is insufficient. Never use a
private API, reverse-engineer protected endpoints, or bypass access controls.

## Source configuration and crawling limits

All 30 brands start as `manual_seed_required`. No `catalog_brand_sources` row is seeded because a
domain, terms review, robots review, and approved entry URLs must be assessed at operation time.

After a source has actually been reviewed, create a narrow configuration in the Supabase SQL Editor:

```sql
insert into public.catalog_brand_sources (
  brand_id,
  source_type,
  label,
  status,
  allowed_domains,
  entry_urls,
  max_requests,
  delay_ms,
  concurrency,
  timeout_ms,
  retry_count,
  max_crawl_depth,
  enabled,
  robots_reviewed_at,
  terms_reviewed_at,
  notes
)
select
  id,
  'url',
  'Reviewed public product pages',
  'supported',
  array['REVIEWED_DOMAIN.example'],
  array['https://REVIEWED_DOMAIN.example/APPROVED_ENTRY'],
  20,
  1500,
  1,
  10000,
  2,
  0,
  true,
  now(),
  now(),
  'Replace placeholders only after recording the real source review.'
from public.catalog_brands
where slug = 'BRAND_SLUG';
```

Do not run this template with placeholders. An enabled source without real reviews is a governance
failure, not a shortcut.

The Edge Function additionally enforces:

- exact/subdomain allowlist matching;
- safe HTTP/HTTPS URL validation;
- DNS and private-network rejection;
- redirect revalidation;
- HTML-only responses;
- response-size, timeout, redirect, and per-request bounds;
- one durable checkpoint per invocation;
- per-user management throttling.

## Resumability

An import job creates one unique checkpoint for each source URL. Each invocation processes at most
one checkpoint. Completed and duplicate checkpoints are never selected again. Retryable failures
are selected only while `attempt_count < max_attempts`.

Job counters are recomputed from checkpoint summaries, so retrying an entry does not increment the
same result twice. Database product upserts use the canonical deduplication key.

`Pause` prevents the next continuation. It cannot cancel a network request already executing.
`Stop` is terminal. Starting the same source later creates a new job but reuses product identities.

## Development dashboard

The profile-stack screen `CatalogDevelopment` appears only when both conditions are true:

```env
EXPO_PUBLIC_ENABLE_CATALOG_DEV_TOOLS=true
```

and the app is a development build (`__DEV__`).

The signed-in user must also be allowlisted server-side:

```sql
insert into public.catalog_developers (user_id, note)
values ('DISPOSABLE_DEVELOPER_AUTH_USER_UUID', 'Local catalogue operations');
```

Use a disposable development account. Authenticated users cannot insert their own membership.

The dashboard shows:

- overall brand/product/review/rejection/failure/duplicate totals;
- validated progress against 150 per brand;
- category distribution and diversity gaps;
- import controls;
- job continuation, retry, pause, stop, and errors;
- review evidence, approve, edit, reject, re-enrich, and source links.

## Manual seeding

Manual seeds still use the canonical pipeline and validation. They do not bypass required source and
image evidence.

From trusted development code with a signed-in allowlisted user:

```ts
await supabase.functions.invoke('catalog-management', {
  body: {
    action: 'start_manual_import',
    brandSlug: 'cos',
    candidates: [
      {
        name: 'Public source product name',
        brand: 'COS',
        category: 'Tops',
        subcategory: 'T-Shirt',
        color: 'Black',
        materials: '100% cotton',
        currentPrice: 50,
        currency: 'USD',
        sourceUrl: 'https://PUBLIC_SOURCE.example/products/product-id',
        images: [{ imageUrl: 'https://PUBLIC_SOURCE.example/images/product-id.jpg' }],
        styleHints: ['casual', 'minimal', 'solid'],
      },
    ],
  },
});
```

Replace placeholders with real public evidence. A manual candidate is a sourcing method, not
permission to fabricate a product.

## Run, continue, stop, and retry jobs

Deploy after reviewing the target project:

```powershell
npx supabase migration list --linked
npx supabase db push --linked --dry-run
npx supabase db push --linked
npx supabase functions deploy catalog-management
```

The dry run must show only the expected ordered migration. Do not push if the remote migration
history differs from the local assumptions.

Dashboard actions call the following authenticated function actions:

- `start_import`
- `continue_import`
- `retry_failed`
- `pause`
- `stop`
- `start_maintenance`
- `start_product_maintenance`
- `review_product`
- `edit_product`
- `start_manual_import`

No job runs automatically when Expo starts.

## Add Brand 31

1. Insert the brand identity, slug, group, target, and evidence-based category targets into
   `catalog_brands`.
2. Leave `source_status = manual_seed_required` until a source assessment is complete.
3. Test the generic adapter with saved offline fixtures.
4. Add a domain adapter only if structured public metadata cannot produce valid candidates.
5. Record the source method and limitations in `docs/catalog-source-status.md`.
6. Create a disabled `catalog_brand_sources` configuration.
7. Record terms and robots reviews, allowlist only the required domains/entry URLs, then enable it.
8. Run Phase A and inspect malformed, rejected, duplicate, and category-distribution rates before
   increasing the request count.

No schema redesign is required.

## Phase rollout

- Phase A: one approved brand source, about 20 products, full review.
- Phase B: three brands, about 50 validated products each.
- Phase C: ten brands, at least 150 validated products each.
- Phase D: all supported brands, at least 150 validated products each where legal and technically
  possible.

Stop scaling when malformed or duplicate output is material, source policy changes, or review
capacity is insufficient.

## Tests and fixtures

`src/fixtures/catalog/phaseAProducts.ts` contains 20 reserved-domain offline fixtures. These test
normalization, diversity, enrichment, variants, validation, and deduplication. They are not retailer
products and must never be loaded into the production catalogue.

Run:

```powershell
npx vitest run supabase/functions/_shared/catalog
npm run typecheck
npm run lint
npm run test
```

Live source, migration, RLS, and device checks are separate deployment verification.

## Current limitations

- no remote Supabase migration or function deployment has been performed by this implementation;
- no brand source is approved or enabled;
- no live retailer access has been tested;
- CSV, affiliate, API, and PIM adapters are contracts, not implemented connectors;
- the generic extractor returns the public attributes available in current structured pages and
  may not expose every size/material/image;
- remote image availability and licensing remain source responsibilities;
- Home, Explore, and Stylist still use their existing presentation fixtures until a separate
  consumer integration task is approved;
- the 4,500-product target remains unpopulated.
