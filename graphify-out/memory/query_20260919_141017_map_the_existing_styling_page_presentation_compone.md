---
type: "query"
date: "2026-09-19T14:10:17.361675+00:00"
question: "Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign."
contributor: "graphify"
outcome: "useful"
source_nodes: ["StylistScreen.tsx", "StylingRecommendationCard.tsx", "stylistStore.ts", "TabNavigators.tsx", "navigation/types.ts", "StateViews.tsx"]
---

# Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign.

## Answer

Expanded from original query via vocab: styling, stylist, recommendation, screen, skeleton, wardrobe, navigation, theme, context, occasion, outfit, weather. The Styling experience is a six-screen native stack rooted at StylistScreen.tsx, with StylingRecommendationCard.tsx shared by result and detail, stylistStore.ts owning persisted recommendation state and feedback, ScreenContainer/AppScreen and StateViews supplying layout and loading states, and TabNavigators.tsx plus navigation/types.ts preserving the bottom-tab and stack contracts.

## Outcome

- Signal: useful

## Source Nodes

- StylistScreen.tsx
- StylingRecommendationCard.tsx
- stylistStore.ts
- TabNavigators.tsx
- navigation/types.ts
- StateViews.tsx