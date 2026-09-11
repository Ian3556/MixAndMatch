---
type: "query"
date: "2026-09-11T06:09:37.575702+00:00"
question: "unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found"
contributor: "graphify"
outcome: "useful"
source_nodes: ["supabase/functions/import-wardrobe-url/index.ts", "extract-products.ts", "html-parsers.ts"]
---

# Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found

## Answer

Expanded from original query via vocab: [import, shared, extract, html, function, supabase, wardrobe, index, typescript]. The deployable shared Deno modules used extensionless relative imports. Added explicit .ts extensions throughout the transitive importer graph, enabled allowImportingTsExtensions for the no-emit Expo TypeScript project, added a module-resolution regression test, deployed version 1, and verified an authenticated live invocation reached extraction.

## Outcome

- Signal: useful

## Source Nodes

- supabase/functions/import-wardrobe-url/index.ts
- extract-products.ts
- html-parsers.ts