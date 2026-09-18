---
type: "query"
date: "2026-09-18T14:01:21.920302+00:00"
question: "Why did npm run catalog:seed fail with TypeError: fetch failed at seedCatalog.ts line 72?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["client", "seedCatalog.ts", "environment"]
---

# Q: Why did npm run catalog:seed fail with TypeError: fetch failed at seedCatalog.ts line 72?

## Answer

Expanded from the user report via graph vocabulary: [supabase, catalog, seeding, client, url, environment, development, error, fetch, service]. The first remote operation is catalog_brands.select at seedCatalog.ts lines 70-72. The client is constructed from SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY at lines 26-33. A TypeError fetch failed before an HTTP response points first to an invalid or unreachable project URL. The displayed URL is still the YOUR_PROJECT_REF placeholder and includes Markdown link syntax if pasted literally. Replace it with the exact Project URL from the Supabase Connect dialog, verify DNS and port 443, then re-enter the cleared server secret and retry. Authentication or missing-schema errors occur only after transport succeeds.

## Outcome

- Signal: useful

## Source Nodes

- client
- seedCatalog.ts
- environment