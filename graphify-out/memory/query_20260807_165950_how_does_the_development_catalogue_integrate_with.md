---
type: "explain"
date: "2026-08-07T16:59:50.405924+00:00"
question: "How does the development catalogue integrate with the existing Mix and Match wardrobe flow?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["catalog_products", "wardrobe_items", "catalog-management", "CatalogDevelopmentScreen"]
---

# Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?

## Answer

The canonical catalogue is additive: catalog_* tables own normalized products, taxonomy, sources, enrichment, review state, and resumable import jobs. Existing wardrobe_items remains the user-owned domain and gains only nullable catalog_product_id provenance. Catalog writes run through the authenticated developer-only catalog-management Edge Function; normal authenticated reads are limited by RLS to validated products.

## Outcome

- Signal: useful

## Source Nodes

- catalog_products
- wardrobe_items
- catalog-management
- CatalogDevelopmentScreen