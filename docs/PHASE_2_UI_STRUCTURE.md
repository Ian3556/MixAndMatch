# Phase 2: UI Structuring

## Overview

Phase 2 turns the authenticated Phase 1 placeholder into a coherent mobile product shell. It establishes the primary information architecture, nested route hierarchy, reusable UI patterns, deterministic fixture data, responsive card layouts, and light/dark presentation. It does not add a wardrobe backend, media permissions, uploads, AI, recommendations, subscriptions, notifications, or 3D behavior.

`RootNavigator` remains the authentication boundary. Signed-out, verification, recovery, onboarding, initialization, and auth-error flows are unchanged. Only an authenticated user with completed onboarding mounts `MainAppNavigator`.

For local testing, the Sign In screen can render a development-only Quick Login control when disposable test-account credentials are configured. It reuses the real Supabase sign-in action and therefore preserves the same verification, onboarding, profile, RLS, and protected-navigation behavior. It is not a production authentication mode.

## Navigation map

```text
Authenticated App (Main)
├── HomeTab / HomeStack
│   ├── Home
│   └── InspirationDetail { inspirationId }
├── ExploreTab / ExploreStack
│   ├── Explore
│   ├── SearchResults { query }
│   └── StyleCategory { categoryId, title }
├── WardrobeTab / WardrobeStack
│   ├── Wardrobe
│   ├── AddItemEntry
│   ├── AddItemImage { source }
│   ├── AddItemDetails { imageKey }
│   ├── AddItemReview { draft }
│   └── WardrobeItemDetail { itemId }
├── StylistTab / StylistStack
│   ├── Stylist
│   ├── OutfitGoal
│   ├── OutfitPreferences { occasion, style }
│   ├── OutfitGenerating { occasion, style }
│   ├── OutfitResult { outfitId }
│   └── OutfitDetail { outfitId }
└── ProfileTab / ProfileStack
    ├── Profile
    ├── EditProfile
    ├── AccountSettings
    ├── AppearanceSettings
    ├── NotificationSettings
    ├── PrivacySettings
    ├── HelpAndSupport
    └── About
```

Tab labels and icons are defined once in `src/navigation/navigationConfig.ts`. Route constants live in `src/navigation/routes.ts`; all parameter lists live in `src/navigation/types.ts`. Each tab owns a native stack, so switching tabs preserves nested history. The tab bar hides when the keyboard opens, uses React Navigation safe-area behavior, and gives Wardrobe modest emphasis without turning it into a floating action button.

## Screen inventory

| Area     | Screen             | Current level                                                                 |
| -------- | ------------------ | ----------------------------------------------------------------------------- |
| Home     | Home               | Fixture-driven; all required content sections                                 |
| Home     | Inspiration Detail | Fixture-driven; saving deferred                                               |
| Explore  | Explore            | Fixture-driven; category/style navigation connected                           |
| Explore  | Search Results     | Local filtering connected; sort/filter deferred                               |
| Explore  | Style Category     | Fixture-driven category shell                                                 |
| Wardrobe | Wardrobe           | Fixture-driven populated and empty-state previews                             |
| Wardrobe | Add Item Entry     | UI-only; route choices connected                                              |
| Wardrobe | Add Item Image     | UI-only; local artwork only                                                   |
| Wardrobe | Add Item Details   | UI-only; temporary screen state                                               |
| Wardrobe | Add Item Review    | UI-only; receives serializable draft, no save                                 |
| Wardrobe | Item Detail        | Fixture-driven; mutations deferred                                            |
| Stylist  | Stylist            | Fixture-driven action and education shell                                     |
| Stylist  | Outfit Goal        | UI-only; temporary selections                                                 |
| Stylist  | Outfit Preferences | UI-only; temporary selections                                                 |
| Stylist  | Outfit Generating  | UI-only processing pattern; no timer/request                                  |
| Stylist  | Outfit Result      | Fixture-driven and explicitly non-AI                                          |
| Stylist  | Outfit Detail      | Fixture-driven; save/edit/share/3D deferred                                   |
| Profile  | Profile            | Fully connected identity data and sign-out; fixture placeholders elsewhere    |
| Profile  | Edit Profile       | Fully connected display-name update; avatar upload deferred                   |
| Profile  | Account            | Fully connected email display and sign-out; deletion/password change deferred |
| Profile  | Appearance         | Session-connected system/light/dark selection                                 |
| Profile  | Notifications      | UI-only toggles; no permissions or persistence                                |
| Profile  | Privacy            | UI-only entries                                                               |
| Profile  | Help & Support     | UI-only entries                                                               |
| Profile  | About              | Actual Expo config version; legal links deferred                              |

## Reusable component inventory

| Component                                                  | Responsibility and use                                                                  |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `ActionButton`                                             | Existing primary, secondary, text, disabled, and loading actions across forms and flows |
| `FormTextInput`                                            | Existing accessible text entry reused by Add Item and Edit Profile                      |
| `AppScreen` / `AppHeader`                                  | Safe-area, keyboard-aware, bounded screen layout and consistent titles/back actions     |
| `IconButton`                                               | Accessible 44×44 icon-only actions and selected states                                  |
| `SectionHeader`                                            | Section hierarchy and optional text action                                              |
| `Chip`                                                     | Accessible selected/unselected filters and prompt controls                              |
| `SearchBar`                                                | Local search entry and explicit submit action                                           |
| `PlaceholderArtwork`                                       | Copyright-safe, fixed-ratio local presentation surfaces                                 |
| `InspirationCard`                                          | Discovery content, explicit open/save/more actions                                      |
| `WardrobeItemCard`                                         | Garment fixture presentation and future favourite/action entry points                   |
| `OutfitCard`                                               | Outfit concept preview and detail entry                                                 |
| `EmptyState`, `ErrorState`, `LoadingState`, `SkeletonCard` | Consistent state patterns with meaningful copy/actions                                  |
| `DeferredNotice`                                           | Visible Phase 2 boundary for UI-only behavior                                           |
| `SettingRow`, `SettingsGroup`, `ToggleRow`                 | Settings list, grouping, values, actions, and local toggle patterns                     |
| `OptionSheet`, `SelectField`                               | One React Native modal strategy for compact selections and accessible dismissal         |
| `Avatar`, `Badge`, `StatCard`                              | Profile, metadata, and placeholder-summary primitives                                   |

No universal conditional card or second UI framework was introduced.

## Theme tokens

All UI consumes the existing `useAppTheme` contract. Phase 2 adds only two semantic colours to both palettes:

- `surfaceMuted`: low-emphasis cards, pressed states, and skeleton shapes.
- `primarySoft`: selected controls and accent-backed information surfaces.

`AppThemeProvider` now supports `system`, `light`, and `dark` selection within the current app session. This extends the existing provider; it does not create a second theme system. Persistence across restarts is deferred and stated on the Appearance screen.

## Fixture data

All fixture modules are deterministic and explicitly marked development-only:

| File                          | Future replacement                           |
| ----------------------------- | -------------------------------------------- |
| `src/fixtures/categories.ts`  | Product taxonomy/configuration repository    |
| `src/fixtures/inspiration.ts` | Inspiration feed/content repository          |
| `src/fixtures/wardrobe.ts`    | User-owned wardrobe repository backed by RLS |
| `src/fixtures/outfits.ts`     | Outfit/recommendation service output         |
| `src/fixtures/stylingTips.ts` | Reviewed editorial content source            |

Fixtures never enter `src/services/`, never query Supabase, and are never presented as persisted user content or generated AI output.

## Responsive layout rules

- Product screens use safe-area edges and a centered content maximum width of 900 px.
- Screen padding and gaps come from theme spacing tokens.
- Card grids use a one-column layout below 360 px, two columns on normal phones, and three columns at 720 px and above.
- Flow forms use wrapping two-column groups with a 220 px minimum field width, falling back to one column.
- Horizontal discovery rails use bounded card widths and scrolling rather than viewport assumptions.
- Forms use keyboard avoidance and `keyboardShouldPersistTaps="handled"`.
- Bottom navigation uses React Navigation safe-area insets and hides while the keyboard is visible.
- No product layout uses absolute positioning except decorative shapes inside bounded placeholder artwork.

## Modal and action conventions

`OptionSheet` is the single Phase 2 selection-modal pattern. It uses React Native `Modal`, a bottom-aligned surface, backdrop and explicit Close dismissal, Android back handling, safe-area bottom spacing, radio semantics, and selected-state checkmarks. No second modal library is installed.

Deferred actions call `showDeferredNotice`, which explains that the underlying service belongs to a later phase. Delete and account-deletion controls cannot mutate state. Complex flows use full stack screens rather than nested modals.

## Empty, loading, and error conventions

- Empty states name the missing content, explain its future value without promising availability, and include one relevant action where useful.
- Loading patterns match expected structure: `LoadingState` for full workflow states and `SkeletonCard` for future card-grid sections.
- Error states show safe user-facing copy and only offer retry/return actions that have real meaning.
- The outfit-processing screen has no artificial delay or simulated request; it explicitly links to a static fixture result.

## Accessibility conventions

- Buttons expose roles, disabled/busy/selected state, and minimum 44 px touch targets.
- Icon-only controls have specific accessibility labels.
- Form inputs and select controls expose labels and current values.
- Chips, theme choices, and modal options provide non-colour selected indicators.
- Custom back and modal-dismiss controls are labelled.
- Text uses scalable React Native text and wrapping layouts; key content is not fixed to one line unless it is secondary metadata.
- Contrast-sensitive UI colours come from light/dark semantic tokens. Placeholder artwork labels use a constant dark ink on intentionally light fixture palettes.

## Deferred functionality

Phase 2 does not implement wardrobe tables or persistence, storage, camera/gallery access, uploads, background removal, image analysis, external search/catalogues, commerce, AI calls/chat/generation, saved outfits/history, weather, calendar, notifications/permissions, analytics, subscriptions/paywalls, 3D/virtual try-on, social/sharing, or admin tools.

Local-only interactions are limited to filtering deterministic fixtures, choosing temporary flow fields, previewing empty states, switching session appearance, and navigating the shell. Profile display-name changes and sign-out are the only mutations connected to existing Phase 1 services.

## Verification and manual visual checklist

Automated repository commands are reported in the implementation handoff. The Node-only Vitest setup covers route configuration, fixture integrity, responsive math, component contracts, and the existing auth/profile/service suites. It does not provide a React Native device renderer or screenshot testing.

Manual device/simulator verification must cover:

- [ ] Authentication, verification, onboarding, and sign-out transitions.
- [ ] Five tabs, nested routes, back behavior, and preserved tab history.
- [ ] iOS/Android safe areas, home indicators, and system navigation.
- [ ] Keyboard behavior on Add Item and Edit Profile forms.
- [ ] Small-phone wrapping and one-column grid behavior.
- [ ] Light, dark, and live system-theme changes.
- [ ] Increased text size and long-label wrapping.
- [ ] Empty, loading, error, and modal dismissal states.
- [ ] Screen-reader labels on tab, icon, form, select, and deferred actions.
- [ ] Profile load/update and sign-out against a configured Supabase project.

## Phase 3 readiness

The information architecture and presentation boundaries are ready for a separately approved Phase 3 vertical slice. The next phase should replace one fixture boundary at a time with typed repository/service data, RLS-backed persistence, explicit loading/error states, and end-to-end tests. Phase 2 fixture modules must not be expanded into a fake production API.
