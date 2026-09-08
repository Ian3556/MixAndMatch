---
type: "query"
date: "2026-09-08T16:25:15.933639+00:00"
question: "Wardrobe Page Update - Remove the \"Wardrobe\" heading - \"Categories\" section - \"All\" \"Tops\" ... remove the border radius"
contributor: "graphify"
outcome: "useful"
source_nodes: ["WardrobeScreen()", "Chip()"]
---

# Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius

## Answer

Expanded from the original request via graph vocab: [wardrobe, categories, category, chip, filter, header, screen]. WardrobeScreen uses AppScreen hideHeader to remove its page heading, and Wardrobe category Chip instances opt into a square prop that applies the zero-radius theme token without changing chips elsewhere.

## Outcome

- Signal: useful

## Source Nodes

- WardrobeScreen()
- Chip()