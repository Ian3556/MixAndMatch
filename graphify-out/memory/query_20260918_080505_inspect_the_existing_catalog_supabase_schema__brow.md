---
type: "query"
date: "2026-09-18T08:05:05.424554+00:00"
question: "Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue."
contributor: "graphify"
outcome: "useful"
source_nodes: ["Mix & Match catalogue database", "catalogBrowseService.ts", "BrowseBrandsScreen.tsx", "WardrobeScreen.tsx"]
---

# Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue.

## Answer

Expanded from graph vocabulary via catalog, brands, products, variants, categories, wardrobe, supabase, schema, migration, filters, search, and seeding. The existing normalized catalog_* schema, catalogBrowseService, BrowseBrandsScreen, BrandProductsScreen, CatalogProductDetailScreen, and wardrobe persistence were reused. The implementation adds a deterministic demo generator and guarded seeder, additive schema markers and browse RPCs, filters, styling metadata, and preserves private wardrobe ownership.

## Outcome

- Signal: useful

## Source Nodes

- Mix & Match catalogue database
- catalogBrowseService.ts
- BrowseBrandsScreen.tsx
- WardrobeScreen.tsx