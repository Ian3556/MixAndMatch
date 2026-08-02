# Mix & Match

Mix & Match is planned as an AI-powered wardrobe assistant for creating outfits from a user's own wardrobe. This repository currently contains **Phase 0 only**: the technical foundation for a long-lived Expo application.

No product functionality is implemented. There is no authentication, wardrobe, AI, camera, upload, recommendation, payment, database-schema, notification, search, or 3D-preview behavior in this phase.

## Technical baseline

- Expo SDK 57
- React Native 0.86
- React 19.2
- TypeScript 6 in strict mode
- React Navigation 7 with native stacks
- Supabase JavaScript client foundation
- Zustand state-management dependency, with no stores yet
- ESLint 9 and Prettier 3
- Node.js 22.13 or newer

Expo SDK 57 is the current stable baseline at the time Phase 0 was created. The package lockfile is the source of truth for exact installed versions.

## Getting started

### Prerequisites

- Node.js 22.13 or newer
- npm 10 or newer
- Expo-compatible Android, iOS, or web development environment

### Install and run

```powershell
npm install
Copy-Item .env.example .env.local
npm run start
```

Use `npm run android`, `npm run ios`, or `npm run web` to target a platform. iOS builds require macOS and Xcode.

### Quality checks

```powershell
npm run typecheck
npm run lint
npm run format:check
npm run validate
```

Run these checks before committing. Use `npm run format` to apply formatting.

## Environment configuration

Copy `.env.example` to `.env.local` and replace example values locally. All `.env` variants are ignored except `.env.example`.

| Variable                               | Runtime             | Purpose                          |
| -------------------------------------- | ------------------- | -------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`             | Mobile bundle       | Supabase project URL             |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Mobile bundle       | Supabase publishable client key  |
| `EXPO_PUBLIC_REVENUECAT_PUBLIC_KEY`    | Mobile bundle       | Future RevenueCat public SDK key |
| `EXPO_PUBLIC_STORAGE_BUCKET`           | Mobile bundle       | Future public bucket identifier  |
| `OPENAI_API_KEY`                       | Trusted server only | Future OpenAI server credential  |

Every `EXPO_PUBLIC_*` value is readable by application users because Expo embeds it in the bundle. Never place an OpenAI secret, Supabase service-role key, RevenueCat secret key, or other privileged credential in an `EXPO_PUBLIC_*` variable.

The Supabase publishable key is designed for public clients, but it is not an authorization boundary. A future database phase must enforce Row Level Security before any tables are exposed.

## Project structure

```text
MixAndMatch/
|-- app/                 # Application composition root
|-- assets/              # Future static images, fonts, and icons
|-- components/          # Shared, domain-neutral UI components
|-- constants/           # Application configuration and constants
|-- features/            # Future vertical product feature modules
|-- hooks/               # Shared React hooks
|-- lib/                 # Framework-neutral internal libraries
|-- navigation/          # Typed route contracts and navigators
|-- screens/             # Route-level screen composition
|-- scripts/             # Cross-platform project tooling
|-- services/            # External service boundaries
|-- store/               # Future Zustand stores and selectors
|-- supabase/            # Supabase client initialization boundary
|-- theme/               # Light/dark tokens and theme provider
|-- types/               # Shared ambient and cross-cutting types
|-- utils/               # Small framework-neutral helpers
|   |-- date/
|   |-- image/
|   |-- storage/
|   |-- string/
|   `-- validation/
|-- .env.example
|-- .editorconfig
|-- .gitignore
|-- .prettierrc.json
|-- app.json
|-- App.tsx
|-- eslint.config.js
|-- index.ts
|-- package.json
`-- tsconfig.json
```

Empty architecture directories are intentional. Phase 0 does not add placeholder modules simply to populate them; real files should appear only when their owning feature is implemented.

## Architecture

### Application composition

`index.ts` registers the Expo root. The root `App.tsx` delegates to `app/AppRoot.tsx`, which composes infrastructure providers and the navigation container. Global providers belong here; product logic does not.

### Navigation

`navigation/RootNavigator.tsx` owns the top-level navigation boundary. Typed routes are reserved for:

- Auth
- Main application
- Settings
- Admin
- Onboarding

All five routes currently render the same minimal `FoundationScreen`. This is only enough to prove the navigation graph is wired. Each route should be replaced by a nested flow navigator when that phase begins; do not add auth gating or product screens to Phase 0.

### Theme

`theme/` is the only source of design tokens. It provides:

- Semantic light and dark colors
- Spacing scale
- Typography families, sizes, weights, and line heights
- Border-radius scale
- Cross-platform shadow tokens
- React Navigation theme mapping

The app follows the device color scheme automatically. A future manual theme preference can be added at the provider boundary without changing component token usage.

### Environment and Supabase

`constants/environment.ts` reads public Expo configuration through static property access, as required by Expo's environment-variable inlining. `supabase/client.ts` creates one lazy, configuration-checked client.

Supabase authentication persistence, token refresh, schema types, queries, and mutations are intentionally absent. Authentication options remain disabled until the authentication phase defines storage and lifecycle behavior explicitly.

### State management

Zustand is installed as the selected lightweight global-state tool, and `store/` is the ownership boundary. No stores exist yet. Prefer local component state for local concerns; add a global store only when state genuinely crosses screens or feature boundaries.

Server data should not be copied into Zustand by default. A future server-state strategy should be selected when actual data flows exist.

### Features and shared code

Future product work should be organized as vertical modules under `features/`. A feature may own its components, hooks, types, and state. Code should move into a root shared directory only after it is reused across features and no longer carries domain ownership.

`services/` owns external-system adapters. `lib/` owns internal framework-neutral capabilities. `utils/` is limited to small, deterministic helpers; it must not become a dumping ground for business logic.

## Development guidelines

1. Keep feature logic inside its feature boundary.
2. Use the `@/*` alias for cross-directory imports; use relative imports within a tightly related module.
3. Prefer named exports, except for Expo's required root component export.
4. Define types at module boundaries and avoid `any`.
5. Keep components accessible, responsive, and token-driven.
6. Model loading, empty, success, and error states when real asynchronous flows are introduced.
7. Keep secrets and privileged calls on trusted server infrastructure.
8. Do not add dependencies until an existing platform or project capability is insufficient.
9. Do not create shared abstractions before there are at least two real consumers.
10. Keep navigation, domain state, service clients, and presentation concerns separate.

## Coding standards

- TypeScript strict mode, unchecked-index checking, and exact optional properties remain enabled.
- ESLint is responsible for correctness rules; Prettier is responsible for formatting.
- Use semantic theme values instead of hard-coded presentation values in components.
- External integrations must be wrapped by a service boundary rather than imported throughout features.
- Validate configuration at the point of use and fail with actionable errors.
- Add tests alongside real behavior in the phase that introduces it; Phase 0 contains no business logic to unit test.

## Future expansion notes

- **Authentication:** replace the Auth route placeholder with a dedicated navigator, choose secure session storage, then enable Supabase auth persistence.
- **Onboarding:** implement as an isolated flow that produces typed profile inputs.
- **Wardrobe:** add a vertical feature module only after data ownership and Supabase RLS are designed.
- **AI styling:** call OpenAI from trusted server or edge infrastructure; never from the mobile client with a secret key.
- **Media:** define upload validation, image processing, retention, and storage policies before adding camera or upload screens.
- **RevenueCat:** integrate platform SDKs only when product and entitlement identifiers are finalized.
- **Admin:** keep administrative authorization and UI separate from consumer navigation.
- **3D preview:** evaluate native/runtime constraints as an independent technical spike before committing it to the main app architecture.

## Phase 0 readiness

The foundation is ready for the next explicitly approved phase when:

- `npm run validate` passes.
- Expo dependency compatibility checks pass.
- A production bundle/export can be generated.
- Real environment values are configured outside version control.
- The next phase defines its own objective, scope, data ownership, and verification plan.

## Known dependency status

As of 2026-08-02, `npm audit` reports 10 moderate advisories through Expo's transitive build-tool chain, rooted in `xcode@3.0.1` using `uuid@7.0.3`. There are no high or critical advisories. The flagged UUID behavior affects v3/v5/v6 buffer-writing APIs, while this dependency calls `uuid.v4()` during native project generation.

The automated npm remediation proposes downgrading Expo to SDK 46, which is incompatible with this SDK 57 foundation and must not be applied. Track the upstream Expo dependency and remove this note when Expo ships a compatible patched chain.
