# Mix & Match catalogue database audit

Status: implementation baseline  
Date: 2026-08-08  
Scope: local repository only; the linked or deployed Supabase project was not inspected or changed

## Executive decision

The fashion catalogue must be a new canonical domain. It must not replace `wardrobe_items`, reuse
that table as a public product table, or turn the existing wardrobe URL preview into a crawler.

The safe extension is:

1. preserve the private, user-owned `profiles` and `wardrobe_items` tables;
2. add normalized `catalog_*` tables through one additive migration;
3. add an optional `wardrobe_items.catalog_product_id` reference so a catalogue item can later be
   copied into a user's wardrobe without coupling the two lifecycles;
4. reuse the current bounded public-page fetcher and structured-data extraction as one catalogue
   adapter;
5. keep normalization, enrichment, validation, deduplication, and job checkpoints independent of
   any one retailer or source type;
6. expose operations only through a development-gated screen and server-authorized catalogue
   developer membership.

The requested 4,500 validated products are a phased data-acquisition outcome, not a migration seed.
No product can be called validated merely because a row exists.

## Current application architecture

| Area                  | Current implementation                                                                        | Catalogue impact                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime               | Expo SDK 57, React Native 0.86, React 19, static Expo web export                              | There is no app-hosted API runtime. Network imports must remain in Supabase Edge Functions or another trusted server.                                      |
| Navigation            | React Navigation with authenticated `Main`, onboarding, and auth roots                        | There is no file-system `/dev/catalog` route. The catalogue tool belongs in the existing profile stack and must be registered only for development builds. |
| State                 | Zustand for auth and wardrobe state                                                           | Catalogue operations can use a small isolated store/hook; catalogue rows must not be copied into the wardrobe store.                                       |
| Data                  | Supabase Auth, PostgREST, Edge Functions, and RLS                                             | Catalogue reads and developer operations need explicit grants and RLS. A client-bundled service-role key is prohibited.                                    |
| Testing               | Vitest, strict TypeScript, ESLint, Prettier, `npm run validate`                               | Pure catalogue pipeline logic should use offline fixtures and remain independent of retailer availability.                                                 |
| Current source layout | Active app code is under `src/`; legacy top-level app folders are deleted in the working tree | Catalogue client code should follow `src/`. The existing user-authored source migration must not be reverted.                                              |

## Existing Supabase schema

### `profiles`

Migration: `supabase/migrations/20260803000100_create_profiles.sql`

- One private row per Supabase Auth user.
- Own-row `SELECT`, `INSERT`, and `UPDATE` policies.
- An auth trigger creates a minimal profile.
- No admin role or catalogue-operator flag exists.

Catalogue consequence: do not add a casually writable `is_admin` boolean to profiles. Use a
separate `catalog_developers` allowlist that authenticated users cannot self-enrol into.

### `wardrobe_items`

Migration: `supabase/migrations/20260805000100_create_wardrobe_items.sql`

- Private, denormalized items owned by `user_id`.
- Supports manual and website URL imports.
- Stores display-oriented category, colour, material, brand, season, occasion, image, price, and
  provenance fields.
- Enforces per-user deduplication with `(user_id, deduplication_key)`.
- Own-row CRUD policies protect every item.

Catalogue consequence: keep this model intact. It represents a user's owned or saved garment, not
a global retailer product. The only schema change should be a nullable catalogue foreign key with
`ON DELETE SET NULL`, preserving manually added and imported wardrobe rows.

## Existing URL importer

Server entry point: `supabase/functions/import-wardrobe-url/index.ts`

Reusable safeguards:

- authenticated requests;
- per-instance request throttling;
- public HTTP/HTTPS URL validation;
- DNS checks and private-network/SSRF rejection;
- redirect revalidation;
- timeout, response-size, content-type, and redirect limits;
- JSON-LD, Open Graph, common commerce markup, and conservative HTML extraction;
- canonical URL normalization and tracking-parameter removal;
- duplicate filtering;
- a hard 50-product response cap;
- safe client-facing errors.

Important limits:

- It is designed for an interactive wardrobe preview, not a resumable multi-brand catalogue job.
- Its output has one image and a small set of retail attributes.
- Its category mapping uses presentation labels such as `Tops` and `Shoes`, not canonical IDs.
- It does not persist source snapshots, variants, enrichment confidence, validation results, job
  checkpoints, or review decisions.
- Its in-memory rate limiter is a useful first barrier, but not a durable distributed quota.

Decision: wrap the extractor in a generic structured-data catalogue adapter. Do not fork its
network-security code or remove its bounds. Catalogue job tracking and persistence belong in a new
server boundary.

## Current taxonomy, style, images, and recommendations

### Categories and styles

`src/fixtures/categories.ts` contains deterministic Phase 2 presentation fixtures. Wardrobe rows
store category values as free text. There is no canonical category table, stable subcategory slug,
or retailer-to-canonical mapping registry.

Decision: introduce a versioned canonical taxonomy with stable lowercase slugs. UI fixtures can
continue using their current labels until consumer catalogue integration is explicitly scheduled.

### Styling and AI

The Stylist, Home recommendations, and Explore views are currently presentation fixtures. No AI
styling service or compatibility engine is connected. Existing screens explicitly describe these
flows as deferred.

Decision: store computable attributes now—fit, silhouette, pattern, texture, layer role, formality,
warmth, colours, materials, season, occasion, and style tags—but do not build or claim a complete
outfit recommendation engine.

### Images

Wardrobe items store remote image URLs. The URL importer does not bulk-download third-party images.

Decision: catalogue image rows store remote `image_url`, original `source_url`, ordering, and type.
The app must render missing-image states. Image licensing, mirroring, and replacement remain source
governance concerns rather than implicit import behaviour.

## Proposed additive schema

All new tables use the `catalog_` prefix so their ownership and purpose remain explicit.

| Entity                           | Purpose                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `catalog_developers`             | Server-managed allowlist for the development dashboard and non-public product/job data.                                                                      |
| `catalog_brands`                 | Thirty initial brand identities, slugs, enablement, target count, and source status.                                                                         |
| `catalog_brand_sources`          | Source type, allowlisted domains, approved entry URLs, request limits, delay, concurrency, retry policy, and status notes.                                   |
| `catalog_categories`             | Canonical hierarchy with stable slugs and parent relationships.                                                                                              |
| `catalog_products`               | One marketed colourway per canonical product, lifecycle status, prices, source identity, normalized attributes, confidence, warnings, and deduplication key. |
| `catalog_product_variants`       | Size/availability/SKU variants beneath a colourway product.                                                                                                  |
| `catalog_product_images`         | Ordered remote images and their provenance.                                                                                                                  |
| `catalog_style_tags`             | Stable style vocabulary.                                                                                                                                     |
| `catalog_product_style_tags`     | Product-to-style confidence links.                                                                                                                           |
| `catalog_product_style_profiles` | Fit, silhouette, pattern, texture, layer role, formality, warmth, season/occasion tags, colours, model/rule version, confidence, and review flag.            |
| `catalog_product_materials`      | Normalized material names, percentage when known, and confidence.                                                                                            |
| `catalog_product_sources`        | Source URL/domain, extraction method, timestamps, content hash, importer version, and raw public metadata.                                                   |
| `catalog_collections`            | Non-fabricated brand season/release groupings when supported by evidence.                                                                                    |
| `catalog_product_collections`    | Product-to-collection membership.                                                                                                                            |
| `catalog_import_jobs`            | Explicit, observable, pausable jobs with requested/discovered/imported/validated/rejected/duplicate/failed counters.                                         |
| `catalog_import_entries`         | Per-URL checkpoints, attempts, retryability, source hash, result product, and last error.                                                                    |
| `catalog_import_errors`          | Append-only operational errors tied to a job and optional checkpoint.                                                                                        |

### Colour-variant strategy

A catalogue product represents one marketed colourway. Size and stock choices are variants. A brand
style code can be shared by several product colourways, while `external_product_id` or the canonical
URL must identify the colourway. The deduplication key includes brand plus the strongest available
identity and colour signal. This avoids incorrectly collapsing black and white versions of the same
style.

### Product lifecycle

`raw -> processing -> enriched -> validated`

Alternative outcomes are `needs_review`, `rejected`, `unavailable`, and `archived`. Only
`validated` rows count toward the 150-product brand target or normal consumer reads.

### Source lifecycle

Brand-level source status supports `ready`, `supported`, `partially_supported`,
`manual_seed_required`, `blocked`, `unavailable`, and `completed`. The initial migration must not
claim automated support based only on brand recognition. Sources start disabled and require an
explicit review of terms, robots policy, access behaviour, and allowed URLs before activation.

## Security and RLS plan

- Public and anonymous roles receive no catalogue-management access.
- Authenticated users can read enabled brands/taxonomy and validated catalogue products needed by
  future consumer features.
- Only allowlisted catalogue developers can read raw/review/job/source/error data.
- Authenticated clients cannot insert themselves into `catalog_developers`.
- Import and review mutations go through an authenticated Edge Function that verifies developer
  membership before using a server-only service-role client.
- The development screen is hidden unless both `__DEV__` and
  `EXPO_PUBLIC_ENABLE_CATALOG_DEV_TOOLS=true` are present. This UI gate is not the authorization
  boundary; database/server checks remain mandatory.
- Service-role secrets remain server-only and are never added to `EXPO_PUBLIC_*` configuration.

## Exact migration plan

1. Create catalogue enum types for source, product, job, entry, gender, image, and extraction
   lifecycles.
2. Create `catalog_developers` and the non-recursive `is_catalog_developer()` authorization helper.
3. Create brands, sources, taxonomy, products, product detail tables, source/provenance tables,
   collections, and job/checkpoint/error tables in dependency order.
4. Add narrow constraints for URLs, currency, prices, confidence scores, request bounds, counters,
   and allowed status transitions where reliable.
5. Add indexes for common brand/category/subcategory/status/gender/price/created-at queries, source
   identities, style joins, job status, and pending checkpoints. Add Postgres full-text search on
   brand/name/description without introducing another search service.
6. Add the nullable `wardrobe_items.catalog_product_id` foreign key and index.
7. Enable RLS and install consumer-read, developer-read, and no-direct-management-write policies.
8. Add dashboard read RPCs that fail closed for non-developers.
9. Seed canonical categories, style tags, and the 30 requested brand identities. Do not seed product
   counts or fabricated collection/source evidence.
10. Commit the transaction. Deployment remains a separate reviewed operation after checking the
    linked project's migration history and dry-run output.

## Import architecture

The catalogue pipeline is source-agnostic:

```text
approved URL / CSV / feed / API / PIM / manual input
  -> adapter raw product
  -> canonical normalization
  -> deterministic enrichment
  -> deduplication identity
  -> validation and confidence gate
  -> canonical product persistence
  -> review queue or validated catalogue
```

Initial implementation:

- a `CatalogImporterAdapter` contract;
- a generic structured-data adapter using the current HTML extractor;
- canonical taxonomy, colour, URL, price, and text normalization;
- rule-based enrichment with explicit confidence;
- validation that returns errors and warnings instead of silently guessing;
- deterministic deduplication keys and in-batch duplicate handling;
- offline Phase A fixtures and tests;
- explicit URL jobs with durable checkpoints and conservative batching.

Deferred adapters: CSV, affiliate feeds, authorized retailer APIs, and PIM connectors. The schema
and adapter contract support them without making scraping the core model.

## Brand rollout and source governance

The migration creates all 30 requested brands with a target of 150 validated products each. It does
not enable crawling. `docs/catalog-source-status.md` is the operational source of truth.

- Phase A: one reviewed brand source and approximately 20 public products.
- Phase B: three brands and approximately 50 validated products each.
- Phase C: ten brands and at least 150 validated products each.
- Phase D: all technically and legally supported brands, with unsupported brands documented rather
  than bypassed.

Scaling stops when malformed, low-confidence, or duplicate rates exceed the documented acceptance
thresholds.

## Migration and compatibility risks

| Risk                                                   | Mitigation                                                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Remote Supabase may not have the local migrations      | Inspect linked history and run a dry run before deployment. Do not use this audit as proof of remote state.               |
| Catalogue names collide with generic future tables     | Use explicit `catalog_` prefixes and additive migration ordering.                                                         |
| A developer UI is mistaken for authorization           | Compile/runtime gate the route and independently verify allowlist membership server-side.                                 |
| Product rows leak raw source metadata                  | Normal authenticated policies expose validated product data only; provenance and jobs remain developer-only.              |
| Colourways are merged                                  | Product identity includes colourway evidence; size/stock remain variants.                                                 |
| URL imports repeat work                                | Unique checkpoints, canonical URLs, content hashes, attempts, and upsert keys make jobs resumable and idempotent.         |
| Retailer pages change or block access                  | Stop, record source status/reason, and switch to manual or authorized feeds. Do not circumvent controls.                  |
| Third-party images disappear                           | Store provenance, support multiple images and missing states, and keep future replacement possible.                       |
| Existing wardrobe code expects the full row shape      | Add the nullable catalogue link to generated/manual types and explicit select mapping without changing current behaviour. |
| Full validation is reported despite no live deployment | Separate local type/test/build evidence from remote migration, RLS, source, and device verification.                      |

## Affected files

Planned additions:

- `supabase/migrations/20260808000100_create_catalog_database.sql`
- `supabase/functions/catalog-management/index.ts`
- `supabase/functions/_shared/catalog/**`
- `src/catalog/**`
- `src/features/catalog/screens/CatalogDevelopmentScreen.tsx`
- `src/types/catalogDatabase.ts`
- `docs/catalog-database.md`
- `docs/catalog-source-status.md`

Planned narrow edits:

- `src/types/database.ts`
- `src/types/wardrobe.ts`
- `src/services/wardrobeService.ts`
- `src/services/supabaseWardrobeGateway.ts`
- `src/constants/environment.ts`
- `src/navigation/routes.ts`
- `src/navigation/types.ts`
- `src/navigation/TabNavigators.tsx`
- `src/features/profile/screens/ProfileScreen.tsx`
- `.env.example`
- `supabase/README.md`
- `tsconfig.json` for the new Deno Edge Function entry point

Explicitly unaffected:

- auth and onboarding flow;
- existing wardrobe URL-import endpoint and UI;
- current Home, Explore, and Stylist fixture behaviour;
- existing database tables beyond the nullable wardrobe reference;
- package dependencies.

## Verification gates

Local:

- catalogue normalization, taxonomy, colour, validation, deduplication, variant, malformed input,
  importer error, and resumability tests;
- existing test suite;
- strict TypeScript and ESLint;
- Expo web export if time and environment permit;
- `graphify update .` after source changes;
- final diff review against the already-dirty working tree.

Remote and explicitly deferred until separately authorized/configured:

- linked migration dry run and deployment;
- catalogue developer bootstrap;
- two-user/non-developer RLS verification;
- Edge Function deployment;
- retailer terms/robots/source approval;
- live Phase A import and data-quality review;
- 30-brand/4,500-product population.
