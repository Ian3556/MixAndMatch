# Graph Report - MixAndMatch  (2026-09-05)

## Corpus Check
- 249 files · ~135,302 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1482 nodes · 3594 edges · 89 communities (74 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `91a8d88f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ActionButton.tsx
- TabNavigators.tsx
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- wardrobe-import/types.ts
- devDependencies
- dependencies
- AppScreen.tsx
- ExploreScreen.tsx
- EditorialPrimitives.tsx
- navigation/types.ts
- ImportWardrobeWebsiteScreen.tsx
- InMemoryCatalogClient
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- StateViews.tsx
- catalog-management/index.ts
- compilerOptions
- useAppTheme
- WardrobeScreen.tsx
- _shared/catalog/types.ts
- Mix & Match catalogue database audit
- StyleProfileEditor.tsx
- fetch-page.ts
- normalize.ts
- ProfileScreen.tsx
- management-actions.ts
- processJob
- .prettierrc.json
- graphify reference: extra exports and benchmark
- StylistScreen.tsx
- Supabase Phase 1, Phase 3, and catalogue operations
- vercel.json
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- eslint.config.js
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- environment.d.ts
- AGENTS.md
- extraction-spec.md
- validate.mjs
- AddItemDetailsScreen.tsx
- Mix & Match catalogue database
- Q: Update Explore into a Pinterest-style fashion feed with functional search and filters, then reorder the bottom navigation to Home, Explore, Stylist, Wardrobe, Profile.
- Q: Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image.
- enrich.ts
- Phase 2: UI Structuring
- Mix & Match
- scripts
- taxonomy.ts
- persist.ts
- InspirationDetailScreen.tsx
- README.md
- package.json
- Phase 1 architecture
- RootNavigator.tsx
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- EditProfileScreen.tsx
- AppTheme
- profileService.ts
- OutfitPreferencesScreen.tsx
- authErrors.ts
- validate.ts
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- react-native
- validate-url.ts
- pipeline.ts
- authState.ts
- authService.ts
- react
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- ExploreOutfitDetailScreen.tsx
- job-state.ts
- expo-dev-client
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- @expo/vector-icons
- @react-native-async-storage/async-storage
- @react-navigation/native
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- developmentQuickLogin.ts
- expo-linking

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 167 edges
2. `AppTheme` - 76 edges
3. `useAuthStore` - 37 edges
4. `ActionButton()` - 36 edges
5. `AppScreen()` - 33 edges
6. `showDeferredNotice()` - 27 edges
7. `normalizeCatalogProduct()` - 20 edges
8. `DeferredNotice()` - 18 edges
9. `Mix & Match catalogue database` - 18 edges
10. `processEntry()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `createImportDeduplicationKey()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/features/wardrobe/import/importWorkflow.ts → supabase/functions/_shared/wardrobe-import/normalize-product.ts
- `ImportWardrobeWebsiteScreen()` --calls--> `validateImportUrl()`  [EXTRACTED]
  src/features/wardrobe/screens/ImportWardrobeWebsiteScreen.tsx → supabase/functions/_shared/wardrobe-import/validate-url.ts
- `createAuthService()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/services/authService.ts → supabase/client.ts
- `createSupabaseProfileGateway()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/services/supabaseProfileGateway.ts → supabase/client.ts
- `createSupabaseWardrobeGateway()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/services/supabaseWardrobeGateway.ts → supabase/client.ts

## Import Cycles
- None detected.

## Communities (89 total, 15 thin omitted)

### Community 0 - "ActionButton.tsx"
Cohesion: 0.11
Nodes (41): ActionButton(), ActionButtonProps, createStyles(), createStyles(), ErrorBanner(), ErrorBannerProps, createStyles(), ScreenContainer() (+33 more)

### Community 1 - "TabNavigators.tsx"
Cohesion: 0.08
Nodes (38): createStyles(), HomeScreen(), Props, AppearanceSettingsScreen(), AddItemEntryScreen(), createStyles(), inputOptions, Props (+30 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.18
Nodes (15): darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing, darkTheme, lightTheme (+7 more)

### Community 4 - "wardrobe-import/types.ts"
Cohesion: 0.06
Nodes (53): corsHeaders, errorResponse(), jsonResponse(), rateWindows, EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CatalogExtractionMethod (+45 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (23): expo, expo-clipboard, dependencies, expo, expo-clipboard, react-dom, react-native-safe-area-context, react-native-screens (+15 more)

### Community 7 - "AppScreen.tsx"
Cohesion: 0.12
Nodes (27): AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup() (+19 more)

### Community 8 - "ExploreScreen.tsx"
Cohesion: 0.08
Nodes (34): createStyles(), SearchBar(), SearchBarProps, createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFilterPanel() (+26 more)

### Community 9 - "EditorialPrimitives.tsx"
Cohesion: 0.08
Nodes (35): DetailImage(), editorialAssets, resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps (+27 more)

### Community 10 - "navigation/types.ts"
Cohesion: 0.17
Nodes (15): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, ErrorState(), AddItemImageScreen(), createStyles(), Props, Props (+7 more)

### Community 11 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.05
Nodes (60): createStyles(), ImportCompleteStep(), ImportSaveSummary, Props, createStyles(), formatPrice(), ImportedProductCard(), Props (+52 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStoreRuntime.ts"
Cohesion: 0.16
Nodes (28): AuthService, createAuthService(), isEmailVerified(), createProfileService(), createSupabaseProfileGateway(), AccountActions, createAuthAccountActions(), createAuthFlowActions() (+20 more)

### Community 16 - "expo"
Cohesion: 0.09
Nodes (21): package, projectId, tsconfigPaths, expo, android, experiments, extra, ios (+13 more)

### Community 17 - "StateViews.tsx"
Cohesion: 0.16
Nodes (16): createStyles(), DeferredNotice(), LoadingState(), MessageState(), MessageStateProps, SkeletonCard(), StateAction, createStyles() (+8 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (32): appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow, corsHeaders (+24 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+12 more)

### Community 20 - "useAppTheme"
Cohesion: 0.09
Nodes (25): AppHeader(), AppHeaderProps, createStyles(), createStyles(), DevelopmentQuickLogin(), DevelopmentQuickLoginProps, createStyles(), HomeEditorialSkeleton() (+17 more)

### Community 21 - "WardrobeScreen.tsx"
Cohesion: 0.11
Nodes (28): createStyles(), IconButton(), IconButtonProps, createStyles(), InspirationCard(), InspirationCardProps, EmptyState(), createStyles() (+20 more)

### Community 22 - "_shared/catalog/types.ts"
Cohesion: 0.13
Nodes (14): CATALOG_ENRICHMENT_VERSION, CATALOG_NORMALIZATION_VERSION, CatalogGender, CatalogImageType, CatalogProductDecision, CatalogSourceType, CatalogStyleProfile, CatalogStyleTag (+6 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "StyleProfileEditor.tsx"
Cohesion: 0.10
Nodes (20): createStyles(), EditorStyles, StyleProfileEditor(), StyleProfileEditorProps, ColorGroup(), createStyles(), getBodyRows(), ProfileStyles (+12 more)

### Community 25 - "fetch-page.ts"
Cohesion: 0.18
Nodes (14): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+6 more)

### Community 26 - "normalize.ts"
Cohesion: 0.21
Nodes (21): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+13 more)

### Community 27 - "ProfileScreen.tsx"
Cohesion: 0.14
Nodes (18): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps, unavailableMetrics, createStyles() (+10 more)

### Community 28 - "management-actions.ts"
Cohesion: 0.05
Nodes (56): AppNavigation(), AppRoot(), CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty() (+48 more)

### Community 29 - "processJob"
Cohesion: 0.26
Nodes (15): appendCheckpointId(), finalizeJob(), findBrand(), findJob(), getRetryDelayMs(), handleAction(), processJob(), readNumberProperty() (+7 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "StylistScreen.tsx"
Cohesion: 0.13
Nodes (17): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, createStyles(), primaryActions, Props, StylistScreen() (+9 more)

### Community 33 - "Supabase Phase 1, Phase 3, and catalogue operations"
Cohesion: 0.25
Nodes (7): Catalogue management Edge Function, Dashboard configuration, Migration, Phase 3 Edge Function, Policy inspection, Supabase Phase 1, Phase 3, and catalogue operations, Two-user RLS verification

### Community 34 - "vercel.json"
Cohesion: 0.29
Nodes (6): buildCommand, cleanUrls, devCommand, framework, outputDirectory, rewrites

### Community 35 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 36 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 37 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 38 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 39 - "eslint.config.js"
Cohesion: 0.50
Nodes (3): { defineConfig, globalIgnores }, eslintPluginPrettierRecommended, expoConfig

### Community 47 - "AddItemDetailsScreen.tsx"
Cohesion: 0.09
Nodes (26): CatalogReviewEditModal(), createStyles(), Props, FormTextInput, FormTextInputProps, createStyles(), OptionSheet(), OptionSheetProps (+18 more)

### Community 48 - "Mix & Match catalogue database"
Cohesion: 0.11
Nodes (18): Add Brand 31, Architecture, Current limitations, Development dashboard, Import adapters, Manual seeding, Mix & Match catalogue database, Normalization and enrichment (+10 more)

### Community 49 - "Q: Update Explore into a Pinterest-style fashion feed with functional search and filters, then reorder the bottom navigation to Home, Explore, Stylist, Wardrobe, Profile."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Update Explore into a Pinterest-style fashion feed with functional search and filters, then reorder the bottom navigation to Home, Explore, Stylist, Wardrobe, Profile., Source Nodes

### Community 50 - "Q: Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image., Source Nodes

### Community 51 - "enrich.ts"
Cohesion: 0.25
Nodes (14): calculateOverallConfidence(), enrichCatalogProduct(), EXTRACTION_CONFIDENCE, inferFit(), inferFormality(), inferLayerRole(), inferOccasions(), inferPattern() (+6 more)

### Community 52 - "Phase 2: UI Structuring"
Cohesion: 0.14
Nodes (14): Accessibility conventions, Deferred functionality, Empty, loading, and error conventions, Fixture data, Modal and action conventions, Navigation map, Overview, Phase 2: UI Structuring (+6 more)

### Community 53 - "Mix & Match"
Cohesion: 0.15
Nodes (13): Database and Row Level Security, Development fashion catalogue, Development Quick Login, Environment configuration, Known limitations and external configuration, Local development, Manual verification checklist, Mix & Match (+5 more)

### Community 54 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, android, format, format:check, ios, lint, start, test (+4 more)

### Community 55 - "taxonomy.ts"
Cohesion: 0.33
Nodes (7): CATALOG_TAXONOMY, CatalogCategoryDefinition, CatalogSubcategoryDefinition, isCatalogCategoryPair(), normalizeCatalogCategory(), normalizeSignal(), CatalogCategoryMatch

### Community 56 - "persist.ts"
Cohesion: 0.18
Nodes (10): CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient, CatalogRestError, readMessage() (+2 more)

### Community 57 - "InspirationDetailScreen.tsx"
Cohesion: 0.40
Nodes (5): Badge(), createStyles(), HomeProps, InspirationDetailContent(), InspirationDetailScreen()

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "RootNavigator.tsx"
Cohesion: 0.17
Nodes (13): AuthNavigator(), OnboardingNavigator(), Stack, RootNavigator(), Stack, ONBOARDING_ROUTES, ROOT_ROUTES, OnboardingStackParamList (+5 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "EditProfileScreen.tsx"
Cohesion: 0.24
Nodes (10): Avatar(), createStyles(), StatCard(), createStyles(), ProfileIdentity(), ProfileIdentityProps, createStyles(), EditProfileScreen() (+2 more)

### Community 64 - "AppTheme"
Cohesion: 0.11
Nodes (26): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogImportControls(), createStyles(), Props, CatalogJobCard() (+18 more)

### Community 65 - "profileService.ts"
Cohesion: 0.12
Nodes (25): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+17 more)

### Community 66 - "OutfitPreferencesScreen.tsx"
Cohesion: 0.27
Nodes (7): Chip(), ChipProps, createStyles(), createStyles(), OutfitPreferencesScreen(), PreferenceStyles, Props

### Community 67 - "authErrors.ts"
Cohesion: 0.42
Nodes (9): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+1 more)

### Community 68 - "validate.ts"
Cohesion: 0.36
Nodes (8): normalizeSlug(), CatalogValidationResult, EnrichedCatalogProduct, isHttpUrl(), readDomain(), REJECTING_ERRORS, unique(), validateCatalogProduct()

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 71 - "validate-url.ts"
Cohesion: 0.24
Nodes (13): ensureAllowedDomain(), validateSourceUrls(), resolvePublicDns(), BLOCKED_HOSTNAMES, failure(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4() (+5 more)

### Community 72 - "pipeline.ts"
Cohesion: 0.19
Nodes (12): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), processCatalogCandidates(), CatalogDuplicate (+4 more)

### Community 73 - "authState.ts"
Cohesion: 0.19
Nodes (11): AuthFlow, AuthSnapshot, createSignedOutSnapshot(), ProfileLoadStatus, authenticatedSnapshot(), incompleteProfile, session, user (+3 more)

### Community 74 - "authService.ts"
Cohesion: 0.17
Nodes (13): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback, AuthStateChangeHandler, callAuth(), failure(), AuthCallbackKind (+5 more)

### Community 76 - "Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?, Source Nodes

### Community 77 - "Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action., Source Nodes

### Community 78 - "Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake, Source Nodes

### Community 79 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.32
Nodes (5): CATEGORY_LABELS, createStyles(), ExploreDetailSkeleton(), ExploreOutfitDetailScreen(), Props

### Community 80 - "job-state.ts"
Cohesion: 0.53
Nodes (4): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CatalogJobEntryState

### Community 82 - "Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state., Source Nodes

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "developmentQuickLogin.ts"
Cohesion: 0.60
Nodes (3): DevelopmentQuickLoginCredentials, getDevelopmentQuickLoginCredentials(), resolveDevelopmentQuickLoginCredentials()

## Knowledge Gaps
- **475 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+470 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `ExploreScreen.tsx` (5× useful, score=4.737932596)
- `TabNavigators.tsx` (3× useful, score=2.804355208)
- `ExploreMasonryFeed.tsx` (3× useful, score=2.803925066)
- `SearchResultsScreen.tsx` (2× useful, score=1.934007531)
- `MainAppNavigator.tsx` (2× useful, score=1.891241699)
- `navigation/types.ts` (2× useful, score=1.891241699)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `ActionButton.tsx`, `TabNavigators.tsx`, `theme/index.ts`, `AppScreen.tsx`, `ExploreScreen.tsx`, `EditorialPrimitives.tsx`, `navigation/types.ts`, `ImportWardrobeWebsiteScreen.tsx`, `StateViews.tsx`, `WardrobeScreen.tsx`, `StyleProfileEditor.tsx`, `ProfileScreen.tsx`, `management-actions.ts`, `StylistScreen.tsx`, `AddItemDetailsScreen.tsx`, `InspirationDetailScreen.tsx`, `RootNavigator.tsx`, `EditProfileScreen.tsx`, `AppTheme`, `OutfitPreferencesScreen.tsx`, `ExploreOutfitDetailScreen.tsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `ActionButton.tsx`, `TabNavigators.tsx`, `theme/index.ts`, `AppScreen.tsx`, `ExploreScreen.tsx`, `EditorialPrimitives.tsx`, `navigation/types.ts`, `ImportWardrobeWebsiteScreen.tsx`, `StateViews.tsx`, `useAppTheme`, `WardrobeScreen.tsx`, `StyleProfileEditor.tsx`, `ProfileScreen.tsx`, `StylistScreen.tsx`, `AddItemDetailsScreen.tsx`, `InspirationDetailScreen.tsx`, `RootNavigator.tsx`, `EditProfileScreen.tsx`, `OutfitPreferencesScreen.tsx`, `ExploreOutfitDetailScreen.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `getSupabaseClient()` connect `management-actions.ts` to `profileService.ts`, `authService.ts`, `ImportWardrobeWebsiteScreen.tsx`, `authStoreRuntime.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _475 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ActionButton.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10707070707070707 - nodes in this community are weakly interconnected._
- **Should `TabNavigators.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08244680851063829 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._