---
type: "query"
date: "2026-09-10T08:55:39.679976+00:00"
question: "How should the Double M startup loader integrate with the existing app?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["AuthBootstrap.tsx", "RootNavigator.tsx", "InitializationScreen.tsx", "authStoreRuntime.ts"]
---

# Q: How should the Double M startup loader integrate with the existing app?

## Answer

AppRoot owns a StartupProvider overlay; AuthBootstrap and authStoreRuntime report real linking, session, user, profile, and completion milestones; RootNavigator continues to select signed-out, onboarding, recovery, error, or main destinations.

## Outcome

- Signal: useful

## Source Nodes

- AuthBootstrap.tsx
- RootNavigator.tsx
- InitializationScreen.tsx
- authStoreRuntime.ts