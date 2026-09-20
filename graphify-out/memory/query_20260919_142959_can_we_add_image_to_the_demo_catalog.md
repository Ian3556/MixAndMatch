---
type: "query"
date: "2026-09-19T14:29:59.267555+00:00"
question: "Can we add image to the demo catalog?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["synthetic-catalogue.md", "generator.ts", "seedCatalog.ts", "catalogBrowseService.ts", "CatalogProductCard.tsx", "CatalogProductDetailScreen.tsx"]
---

# Q: Can we add image to the demo catalog?

## Answer

Expanded from original query via graph vocab: [catalog, catalogue, demo, image, images, placeholder, product, products, seed, source, storage, synthetic]. Yes. The current generator deliberately emits imageUrl null and placeholder source, while catalogBrowseService and the product card/detail UI already read catalog_product_images and display the first image URL. The schema already supports source_type generated and is_demo. The smallest safe implementation is app-owned generated demo assets in a public Supabase Storage bucket, deterministic product-to-asset mapping, and image rows seeded with generated provenance; avoid retailer hotlinks and do not remove the fallback.

## Outcome

- Signal: useful

## Source Nodes

- synthetic-catalogue.md
- generator.ts
- seedCatalog.ts
- catalogBrowseService.ts
- CatalogProductCard.tsx
- CatalogProductDetailScreen.tsx