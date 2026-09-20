---
type: "query"
date: "2026-09-19T14:59:09.527420+00:00"
question: "why does it keep showing Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["assertDevelopmentSeedAllowed()", "seedCatalog.ts", "environment"]
---

# Q: why does it keep showing Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development?

## Answer

Expanded from original query via graph vocab: [catalog, seed, environment, development, process, assert, allowed, supabase]. assertDevelopmentSeedAllowed reads process.env and requires MIXANDMATCH_CATALOG_ENV=development before seeding. A plain npm run catalog:seed does not load .env.local, and the prior PowerShell finally block removes the process-local variable, so each standalone rerun must set it again or invoke Node with --env-file=.env.local.

## Outcome

- Signal: useful

## Source Nodes

- assertDevelopmentSeedAllowed()
- seedCatalog.ts
- environment