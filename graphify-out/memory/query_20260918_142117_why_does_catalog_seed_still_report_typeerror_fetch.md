---
type: "diagnostic"
date: "2026-09-18T14:21:17.083292+00:00"
question: "Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["seedCatalog()", "seedCatalog.ts", "client", "environment"]
---

# Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?

## Answer

Validation is local and passed, but no remote write occurred. The seeder loses the nested transport cause by throwing only error.message. The installed supabase-js 2.111.0 recognizes sb_secret keys, so the next diagnostic is to re-copy the full key and compare an apikey-only raw REST request with the identical supabase-js table read while printing safe metadata and the complete error object.

## Outcome

- Signal: useful

## Source Nodes

- seedCatalog()
- seedCatalog.ts
- client
- environment