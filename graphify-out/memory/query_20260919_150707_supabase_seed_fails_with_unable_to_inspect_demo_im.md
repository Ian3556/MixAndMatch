---
type: "query"
date: "2026-09-19T15:07:07.482940+00:00"
question: "Supabase seed fails with Unable to inspect demo image bucket: Bucket not found"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ensureDemoCatalogImageBucket()", "seedCatalog.ts"]
---

# Q: Supabase seed fails with Unable to inspect demo image bucket: Bucket not found

## Answer

Expanded from original query via graph vocab: [storage, create, update, image, catalog, seed, supabase, error, list, ensure]. The Storage SDK returned a bucket-not-found error without the numeric status shape assumed by ensureDemoCatalogImageBucket. Replaced getBucket plus status inspection with listBuckets plus an exact bucket ID check, so absent buckets are created and existing buckets are updated idempotently. Catalog validation and the full 183-test suite passed; remote rerun remains user-side.

## Outcome

- Signal: useful

## Source Nodes

- ensureDemoCatalogImageBucket()
- seedCatalog.ts