---
type: "diagnostic"
date: "2026-09-18T14:33:58.730968+00:00"
question: "Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint"
contributor: "graphify"
outcome: "useful"
source_nodes: ["seedCatalog.ts", "seedCatalog()", "CatalogBrandSourceStatus", "Migration", "upsertBatches()"]
---

# Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint

## Answer

Expanded from original query via graph vocab: [catalog, brands, source, status, seed, upsert, schema, migration, constraint, database, generator, validation]. The database migration already defines source_status as NOT NULL with a manual_seed_required default. The seeder created mixed-shape bulk upsert rows: new brands included source_status while existing brands omitted it. postgrest-js defaults missing upsert fields to null, causing the constraint failure. Fixed seedCatalog.ts to select and preserve existing source_status and source_status_reason and to provide manual_seed_required only for new brands.

## Outcome

- Signal: useful

## Source Nodes

- seedCatalog.ts
- seedCatalog()
- CatalogBrandSourceStatus
- Migration
- upsertBatches()