---
type: "query"
date: "2026-09-01T15:17:58.176268+00:00"
question: "How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["HomeScreen.tsx", "TabNavigators.tsx", "theme/index.ts", "StateViews.tsx"]
---

# Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?

## Answer

Expanded from the repository graph vocabulary via home, route, navigation, loading, skeleton, image, theme, style, data, store, layout, and fashion. HomeScreen.tsx is mounted by TabNavigators.tsx and already depends on shared navigation, theme, UI primitives, fixtures, and layout helpers. This supported a scoped Home-only redesign that preserved the Home stack and bottom navigation while replacing fixture cards with typed editorial modules and structure-matched skeletons.

## Outcome

- Signal: useful

## Source Nodes

- HomeScreen.tsx
- TabNavigators.tsx
- theme/index.ts
- StateViews.tsx