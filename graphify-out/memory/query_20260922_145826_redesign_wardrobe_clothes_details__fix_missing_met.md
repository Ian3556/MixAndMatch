---
type: "query"
date: "2026-09-22T14:58:26.259389+00:00"
question: "Redesign Wardrobe Clothes Details, fix missing metadata, and implement Edit for the Nike item"
contributor: "graphify"
outcome: "useful"
source_nodes: ["WardrobeItemDetailScreen", "wardrobeService", "importWorkflow"]
---

# Q: Redesign Wardrobe Clothes Details, fix missing metadata, and implement Edit for the Nike item

## Answer

Expanded via graph vocabulary: WardrobeItemDetailScreen wardrobeService importWorkflow. Detail rendering reads mapped wardrobe rows; wardrobeService and wardrobeNormalization separate imported product description from personal notes and enrich conservative metadata. EditWardrobeItemScreen uses the existing store and service update path. URL import material extraction accepts explicit complete composition only.

## Outcome

- Signal: useful

## Source Nodes

- WardrobeItemDetailScreen
- wardrobeService
- importWorkflow