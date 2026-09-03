---
type: "query"
date: "2026-09-02T16:06:41.110275+00:00"
question: "Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
contributor: "graphify"
outcome: "useful"
source_nodes: ["ExploreMasonryFeed.tsx", "ExploreScreen.tsx", "server"]
---

# Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.

## Answer

The attached refusal occurred before Metro restarted. Metro now listens on IPv4 and IPv6; its status endpoint and the exact editorial asset URL return HTTP 200, so the asset path is valid. ExploreMasonryFeed remains connected to ExploreScreen and still defines inline image load callbacks; that separate callback-identity issue can drive the maximum-update-depth loop and repeated asset requests.

## Outcome

- Signal: useful

## Source Nodes

- ExploreMasonryFeed.tsx
- ExploreScreen.tsx
- server