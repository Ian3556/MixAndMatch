---
type: "query"
date: "2026-09-02T16:24:32.745922+00:00"
question: "There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action."
contributor: "graphify"
outcome: "useful"
source_nodes: ["ExploreMasonryFeed.tsx", "ExploreScreen.tsx", "InspirationDetailScreen.tsx", "TabNavigators.tsx"]
---

# Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.

## Answer

Expanded from original query via graph vocab: [explore, image, load, callback, state, navigation, home, screen]. Stabilized Explore image source and load callbacks with memo, useMemo, and useCallback so normal state renders no longer restart React Native Web image loading. Added InspirationDetail to the Explore stack and changed Explore, SearchResults, and StyleCategory item navigation to stay in that stack; the shared detail view now calls stack-local goBack with a root fallback, so Back returns to the actual previous Explore screen instead of Home. TypeScript, 121 tests, lint, and diff checks pass.

## Outcome

- Signal: useful

## Source Nodes

- ExploreMasonryFeed.tsx
- ExploreScreen.tsx
- InspirationDetailScreen.tsx
- TabNavigators.tsx