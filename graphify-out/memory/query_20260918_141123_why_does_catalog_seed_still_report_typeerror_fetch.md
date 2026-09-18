---
type: "query"
date: "2026-09-18T14:11:23.623985+00:00"
question: "Why does catalog:seed still report TypeError fetch failed after Test-NetConnection to Supabase port 443 succeeds?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["node", "client", "seedCatalog.ts"]
---

# Q: Why does catalog:seed still report TypeError fetch failed after Test-NetConnection to Supabase port 443 succeeds?

## Answer

Expanded from the runtime report via graph vocabulary: [node, fetch, url, client, supabase, catalog, seeding, environment, error]. Test-NetConnection proves only that PowerShell can open TCP 443; it does not prove Node fetch can complete DNS selection, TLS trust, proxy routing, or request header construction. The repository first fails at catalog_brands.select through the Supabase client. Construct the URL directly from the public project ref and run a secret-free Node fetch to /auth/v1/health while printing error.cause. Any HTTP status proves Node transport; ENOTFOUND, timeout, or TLS causes identify the specific layer. Do not disable TLS verification.

## Outcome

- Signal: useful

## Source Nodes

- node
- client
- seedCatalog.ts