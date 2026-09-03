---
type: "query"
date: "2026-09-02T15:58:55.671068+00:00"
question: "Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image."
contributor: "graphify"
outcome: "useful"
source_nodes: ["ExploreMasonryFeed.tsx", "ExploreScreen.tsx", "react"]
---

# Q: Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image.

## Answer

Expanded from the error via graph vocabulary: [explore, image, loading, callback, state, source, react]. The Expo setupHMR frame only wraps console.error. The loop originates in ExploreMasonryFeed.tsx: ExploreFeedCard passes new inline onLoadStart and onLoadEnd functions every render. React Native Web Image includes these callbacks in its loading effect dependency list; onLoadStart updates imageLoading, re-renders the card, changes callback identity, and restarts the effect indefinitely. Stabilize the callbacks with useCallback or remove the redundant onLoadStart state update.

## Outcome

- Signal: useful

## Source Nodes

- ExploreMasonryFeed.tsx
- ExploreScreen.tsx
- react