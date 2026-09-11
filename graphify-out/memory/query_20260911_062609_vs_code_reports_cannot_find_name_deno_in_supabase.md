---
type: "query"
date: "2026-09-11T06:26:09.257529+00:00"
question: "VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts"
contributor: "graphify"
outcome: "useful"
source_nodes: ["supabase/functions/import-wardrobe-url/index.ts", "types", "exclude"]
---

# Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts

## Answer

Expanded from original query via graph vocab: [supabase, edge, function, import, wardrobe, url, runtime, environment, types, index, extract, products]. The Expo tsconfig deliberately excludes both Edge Function entrypoints, so the TypeScript editor project had no Deno global declaration. Added one compile-time-only shared Deno declaration, referenced it from both entrypoints, and excluded that declaration from the Expo project. The importer-focused compiler check and full repository validation passed.

## Outcome

- Signal: useful

## Source Nodes

- supabase/functions/import-wardrobe-url/index.ts
- types
- exclude