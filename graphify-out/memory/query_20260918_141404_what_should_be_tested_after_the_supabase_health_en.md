---
type: "query"
date: "2026-09-18T14:14:04.156694+00:00"
question: "What should be tested after the Supabase health endpoint returns HTTP 401 No API key found?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["client", "Migration", "seedCatalog.ts"]
---

# Q: What should be tested after the Supabase health endpoint returns HTTP 401 No API key found?

## Answer

Expanded from the continuation via graph vocabulary: [supabase, client, catalog, brands, database, service, environment, select, migration]. HTTP 401 from the unauthenticated health probe confirms Node DNS, TCP, TLS, and the project URL. Before running the full 1000-row seeder, load the server secret into the script-required SUPABASE_SERVICE_ROLE_KEY environment variable, print only safe key metadata, and make one authenticated REST read against catalog_brands. HTTP 200 confirms key and table; 401 or 403 means wrong key; PGRST table errors mean migrations are missing; another fetch failure should print the inner cause.

## Outcome

- Signal: useful

## Source Nodes

- client
- Migration
- seedCatalog.ts