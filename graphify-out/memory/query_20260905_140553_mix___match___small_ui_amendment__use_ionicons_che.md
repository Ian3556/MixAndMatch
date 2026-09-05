---
type: "query"
date: "2026-09-05T14:05:53.331119+00:00"
question: "Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
contributor: "graphify"
outcome: "useful"
source_nodes: ["SearchBar.tsx", "ExploreScreen.tsx", "SearchResultsScreen.tsx", "ExploreOutfitDetailScreen.tsx", "OutfitImageBackButton()", "DetailImage()"]
---

# Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.

## Answer

Expanded from original query via vocab: [search, bar, input, submit, icon, back, detail, explore, query, screen]. SearchBar.tsx owns keyboard submission and now dismisses the keyboard while allowing Explore consumers to hide the shared visible submit control. ExploreScreen.tsx and SearchResultsScreen.tsx reuse their existing trimmed search state updates and hide the submit control. ExploreOutfitDetailScreen.tsx uses Ionicons chevron-back-outline inside the existing circular overlay and retains navigation.goBack. Validation passed with 128 tests, a production web export, and a live browser flow that preserved the query and 240px scroll position through detail Back.

## Outcome

- Signal: useful

## Source Nodes

- SearchBar.tsx
- ExploreScreen.tsx
- SearchResultsScreen.tsx
- ExploreOutfitDetailScreen.tsx
- OutfitImageBackButton()
- DetailImage()