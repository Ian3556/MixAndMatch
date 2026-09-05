---
type: "query"
date: "2026-09-03T16:41:06.618740+00:00"
question: "Mix & Match — Image Detail Back Button + Bottom Navigation Remake"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ExploreOutfitDetailScreen()", "ExploreTabNavigator()", "MainAppNavigator.tsx", "TabNavigators.tsx", "navigation/types.ts"]
---

# Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake

## Answer

Expanded from original query via graph vocab: [tab, navigation, navigator, bottom, safe, area, icon, back, detail, outfit, explore, stack]. Replaced the authoritative bottom tab renderer with a safe-area-aware sharp-edged floating bar driven by React Navigation state and a 220 ms Animated indicator; hid it outside each tab stack root; moved the existing Explore outfit Back callback into a circular image-overlay control while preserving push/pop history. Validation, 128 tests, production export, and browser end-to-end checks passed.

## Outcome

- Signal: useful

## Source Nodes

- ExploreOutfitDetailScreen()
- ExploreTabNavigator()
- MainAppNavigator.tsx
- TabNavigators.tsx
- navigation/types.ts