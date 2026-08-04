# Mix & Match

Mix & Match is an Expo and React Native application planned as an AI-powered wardrobe assistant. The repository currently implements **Phase 1: Authentication and User Foundation**.

Phase 1 establishes identity, persistent sessions, protected navigation, email verification, password recovery, and private profile onboarding. It does not implement wardrobe items, uploads, AI, recommendations, subscriptions, or any other Phase 2 product feature.

## Technical baseline

- Expo SDK 57 and React Native 0.86
- React 19.2 and TypeScript 6 in strict mode
- React Navigation 7 with native stacks
- Supabase JavaScript client 2
- Zustand 5 for centralized authentication state
- AsyncStorage for native Supabase session persistence
- Expo Linking for authentication callback URLs
- Vitest for focused unit tests
- npm with `package-lock.json` as the exact dependency source of truth

No major dependency was upgraded for Phase 1. Run `npm ls --depth=0` for exact installed versions.

## Phase 1 architecture

### Application composition

`app/AppRoot.tsx` composes the safe-area provider, existing theme provider, authentication bootstrap, React Navigation container, and root navigator. `AuthBootstrap` owns the one-time Supabase auth subscription, native foreground token-refresh lifecycle, initial URL handling, and live URL subscription cleanup.

### Authentication boundary

`services/authService.ts` is the only UI-facing boundary for Supabase Auth operations. Screens do not query Supabase directly. The service:

- signs up and signs in with email/password;
- signs out the local device session;
- requests neutral password-recovery emails;
- updates passwords only inside a valid recovery session;
- resends signup verification emails;
- restores and refreshes sessions;
- converts recovery and verification callbacks into Supabase sessions; and
- maps backend failures to safe application errors.

Passwords and tokens are never logged or copied into navigation parameters.

### Authentication-state lifecycle

`store/authStore.ts` is the single client-side source of truth for session, user, profile, initialization, verification, recovery, and errors.

1. The app renders a branded initialization screen.
2. The store subscribes to auth changes and restores the persisted Supabase session once.
3. No session renders the signed-out Auth navigator.
4. A pending or unverified email renders only the verification screen.
5. A recovery callback renders only the password-reset flow.
6. A verified session loads the profile matching `session.user.id`.
7. A missing or incomplete profile renders Profile Setup.
8. A completed profile renders the existing Main application foundation.
9. Configuration, session, or profile-loading failures render a recoverable error state.

Profile requests are versioned and checked against the current user before results enter state. Sign-out immediately clears session, user, profile, onboarding, verification, and recovery state so a later user cannot see stale data.

### Navigation protection

`navigation/RootNavigator.tsx` derives the mounted navigation tree from authentication state. It does not call `navigate` after sign-in/sign-out to force a flow change. When state changes, the old navigator is unmounted and a new keyed tree is mounted, preventing protected-screen flashes, duplicate auth history, and back navigation into sign-in after authentication.

The Phase 0 `Settings` and `Admin` placeholders remain registered inside the protected Main navigator; no settings or admin functionality was added.

### Profile strategy

The migration creates `public.profiles` with the auth user ID as its primary and foreign key. An `auth.users` trigger creates a minimal row with a nullable `display_name` and `onboarding_completed = false`.

This avoids fake names while keeping profile creation reliable. Profile Setup atomically upserts the real display name and marks onboarding complete only when the database write succeeds. The trade-off is that incomplete rows intentionally allow `display_name = null`; a database constraint requires a valid 2–50 character trimmed name whenever onboarding is complete.

## Environment configuration

Copy the placeholder file and add local project values:

```powershell
Copy-Item .env.example .env.local
```

Required for Phase 1:

| Variable                               | Purpose                  |
| -------------------------------------- | ------------------------ |
| `EXPO_PUBLIC_SUPABASE_URL`             | Supabase project URL     |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public mobile client key |

Expo embeds every `EXPO_PUBLIC_*` value in the application bundle. Only use the Supabase publishable/anon client key. Never add the service-role key, passwords, refresh tokens, OpenAI secrets, or other privileged credentials to mobile code or `.env.example`.

Phase 0 reserved additional placeholders for later product phases. Phase 1 does not read or use them.

## Supabase setup

1. Create or select a Supabase project.
2. Put its URL and publishable key in `.env.local`.
3. Link the local `supabase/` directory to the intended project using the Supabase CLI.
4. Review and apply `supabase/migrations/20260803000100_create_profiles.sql`.
5. In Authentication settings, decide whether email confirmation is required.
6. Add `mixandmatch://**` to the allowed redirect URLs. The application specifically uses:
   - `mixandmatch://auth/verify-email`
   - `mixandmatch://auth/reset-password`
7. Configure email templates and SMTP delivery as required for the target environment.

Example migration workflow after installing/authenticating the Supabase CLI:

```powershell
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The Expo scheme already exists in `app.json`. A new development build is required when a native scheme changes. Stable email callbacks should be tested with a development or standalone build; Expo Go callback URLs are development-host-specific.

Official references:

- [Supabase React Native Auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [Supabase native mobile deep linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)
- [React Navigation authentication flows](https://reactnavigation.org/docs/auth-flow/)
- [Expo Linking](https://docs.expo.dev/versions/latest/sdk/linking/)

## Database and Row Level Security

The migration creates:

- `public.profiles` with cascading ownership from `auth.users`;
- display-name, avatar-URL, and completed-onboarding constraints;
- `public.set_profiles_updated_at()` and its update trigger;
- `public.handle_new_auth_user()` and its auth-user trigger;
- RLS policies for own-row `SELECT`, `INSERT`, and `UPDATE` only.

The unauthenticated role receives no profile privileges. Every authenticated policy compares `(select auth.uid())` with `profiles.id`. There is no unrestricted policy and no client delete policy.

Detailed migration and two-user RLS verification notes are in `supabase/README.md`.

## Local development

Prerequisites:

- Node.js 22.13 or newer
- npm 10 or newer
- an Expo-compatible Android, iOS, or web environment
- a Supabase project with the migration applied for end-to-end auth testing

Install and start:

```powershell
npm install
Copy-Item .env.example .env.local
npm run start
```

Use `npm run android`, `npm run ios`, or `npm run web` for a target platform. iOS native builds require macOS and Xcode.

## Testing and quality checks

```powershell
npm run typecheck
npm run lint
npm run format:check
npm test
npm run validate
npx expo install --check
npx expo-doctor
npx expo export --platform web
```

Automated tests cover:

- valid, invalid, normalized, and empty email input;
- password policy and matching confirmation;
- trimmed, empty, short, and valid display names;
- initialization, signed-out, incomplete-profile, completed-profile, expired-session, missing-profile, and sign-out cleanup states; and
- profile fetch, update, missing-row behavior, onboarding upsert, model mapping, and error normalization.

## Manual verification checklist

Run these against a configured Supabase project and a development/standalone build where deep links are involved:

- [ ] A new user can register.
- [ ] Invalid sign-up data is rejected locally.
- [ ] Duplicate submissions are prevented.
- [ ] Email verification follows the project configuration.
- [ ] A registered user can sign in.
- [ ] Incorrect credentials display a safe error.
- [ ] An authenticated user cannot reach auth screens through back navigation.
- [ ] A signed-out user cannot reach the Main navigator.
- [ ] A new verified user reaches Profile Setup.
- [ ] Profile Setup persists the normalized display name.
- [ ] Onboarding completion persists after app restart.
- [ ] The authenticated session survives app restart.
- [ ] Sign-out clears the session and profile state.
- [ ] A second user never sees the first user’s profile.
- [ ] Password-reset requests show the same success response for all valid emails.
- [ ] A valid recovery link reaches Reset Password.
- [ ] An expired or malformed recovery link shows a recoverable error.
- [ ] RLS blocks cross-user profile reads.
- [ ] RLS blocks cross-user profile updates.
- [ ] Missing Supabase environment values show a clear configuration error.
- [ ] No protected screen flashes during initialization.
- [ ] Existing theme behavior and protected Phase 0 Main placeholders still render.

## Security notes

- Supabase persists only its session data through the official React Native-compatible storage adapter; the application never stores raw credentials.
- Native token refresh runs only while the application is active.
- The client is created with the public key and typed database schema.
- UI route protection is paired with database RLS; navigation is not treated as an authorization boundary.
- Password reset responses do not reveal whether an account exists.
- Original backend errors are retained only as in-memory error causes for development inspection and are never rendered or logged.
- Sensitive callback parameters are processed directly and never stored in navigation state.

## Known limitations and external configuration

- Live sign-up, email delivery, profile persistence, RLS, and password recovery require a real Supabase project and cannot be proven by local unit tests alone.
- Custom-scheme links do not provide the install fallback and domain ownership of universal links. Universal links are deferred until production domains are defined.
- Email deliverability, redirect allow-list configuration, password policy, and rate limits are controlled partly by the Supabase project.
- Profile image upload is intentionally absent. The schema and service can retain an avatar URL for future compatible work, but Phase 1 exposes no avatar UI.
- The Phase 0 Expo transitive dependency audit note remains applicable: current advisories are moderate and an automated forced fix would require an incompatible Expo downgrade.

## Phase 2 readiness

The codebase is structurally ready for the Digital Wardrobe phase after the migration is applied and the manual Supabase/device checklist passes. Phase 2 must add its own schema, storage policies, media validation, feature boundaries, and verification plan; none are prebuilt here.
