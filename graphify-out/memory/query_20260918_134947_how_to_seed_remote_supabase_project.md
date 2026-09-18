---
type: "query"
date: "2026-09-18T13:49:47.661155+00:00"
question: "How to seed remote Supabase Project"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Seed Supabase", "Development synthetic catalogue", "Migration", "validate"]
---

# Q: How to seed remote Supabase Project

## Answer

Expanded from original query via graph vocab: [supabase, catalog, catalogue, seeding, migration, development, service, database, products, validate]. The repository flow is: confirm a development target, link the Supabase CLI, inspect migration history, dry-run then apply pending migrations, run catalog validation, set process-local SUPABASE_URL plus a server-only secret in the script-required SUPABASE_SERVICE_ROLE_KEY variable, enable both development safety switches, run npm run catalog:seed, verify remote demo counts, and clear environment variables. Routine seeding is a non-destructive deterministic upsert; reset only when changing seed or configuration.

## Outcome

- Signal: useful

## Source Nodes

- Seed Supabase
- Development synthetic catalogue
- Migration
- validate