# Graph Report - MixAndMatch  (2026-09-05)

## Corpus Check
- 259 files · ~134,926 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1503 nodes · 3688 edges · 97 communities (81 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `91a8d88f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ResetPasswordScreen.tsx
- routes.ts
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- normalize-product.ts
- devDependencies
- dependencies
- TabNavigators.tsx
- ExploreOutfitDetailScreen.tsx
- HomeScreen.tsx
- AddItemReviewScreen.tsx
- wardrobeService.ts
- InMemoryCatalogClient
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStore.ts
- expo
- StateViews.tsx
- catalog-management/index.ts
- compilerOptions
- ProfileSettingsDirectory.tsx
- AppTheme
- _shared/catalog/types.ts
- Mix & Match catalogue database audit
- BodyProfileScreen.tsx
- fetch-page.ts
- normalize.ts
- WardrobeScreen.tsx
- src/catalog/types.ts
- ImportWardrobeWebsiteScreen.tsx
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
- validate.ts
- management-actions.ts
- InspirationDetailScreen.tsx
- README.md
- package.json
- Phase 1 architecture
- RootNavigator.tsx
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- useAppTheme
- ActionButton.tsx
- profileService.ts
- catalogAdminService.ts
- authErrors.ts
- ImportPreviewStep.tsx
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
- generic-structured-data.ts
- getSupabaseClient
- expo-dev-client
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- @expo/vector-icons
- @react-native-async-storage/async-storage
- @react-navigation/native
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- ImportUrlInputStep.tsx
- expo-linking
- MainAppNavigator.tsx
- SelectField.tsx
- import-wardrobe-url/index.ts
- wardrobeImportService.ts
- ImportedProductCard.tsx
- isCatalogDevToolsEnabled
- FloatingTabBar.tsx
- interactionAudit.test.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 174 edges
2. `AppTheme` - 79 edges
3. `ActionButton()` - 39 edges
4. `useAuthStore` - 39 edges
5. `AppScreen()` - 37 edges
6. `normalizeCatalogProduct()` - 20 edges
7. `showDeferredNotice()` - 19 edges
8. `Mix & Match catalogue database` - 18 edges
9. `ProfileStackParamList` - 17 edges
10. `processEntry()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `loadCatalogDashboard()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogAdminService.ts → supabase/client.ts
- `invokeCatalogManagement()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogAdminService.ts → supabase/client.ts
- `createImportDeduplicationKey()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/features/wardrobe/import/importWorkflow.ts → supabase/functions/_shared/wardrobe-import/normalize-product.ts
- `ImportWardrobeWebsiteScreen()` --calls--> `validateImportUrl()`  [EXTRACTED]
  src/features/wardrobe/screens/ImportWardrobeWebsiteScreen.tsx → supabase/functions/_shared/wardrobe-import/validate-url.ts
- `createAuthService()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/services/authService.ts → supabase/client.ts

## Import Cycles
- None detected.

## Communities (97 total, 16 thin omitted)

### Community 0 - "ResetPasswordScreen.tsx"
Cohesion: 0.08
Nodes (49): CatalogImportControls(), createStyles(), Props, createStyles(), ErrorBanner(), ErrorBannerProps, FormTextInput, FormTextInputProps (+41 more)

### Community 1 - "routes.ts"
Cohesion: 0.30
Nodes (10): getTabConfig(), MAIN_TAB_CONFIG, MAIN_TAB_ROOT_ROUTES, MainTabRouteName, EXPLORE_ROUTES, HOME_ROUTES, MAIN_ROUTES, PROFILE_ROUTES (+2 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.10
Nodes (23): AppNavigation(), AppRoot(), ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps, unavailableMetrics, darkColors (+15 more)

### Community 4 - "normalize-product.ts"
Cohesion: 0.10
Nodes (40): extractProductsFromHtml(), fixtureDirectory, AnchorRecord, compact(), extractGenericHtmlProducts(), extractOpenGraphProduct(), extractPlatformProducts(), isDecorative() (+32 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (23): expo, expo-clipboard, dependencies, expo, expo-clipboard, react-dom, react-native-safe-area-context, react-native-screens (+15 more)

### Community 7 - "TabNavigators.tsx"
Cohesion: 0.10
Nodes (31): AppScreen(), createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup(), AboutScreen() (+23 more)

### Community 8 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.06
Nodes (56): createStyles(), InspirationCard(), InspirationCardProps, createStyles(), SearchBar(), SearchBarProps, createStyles(), ExploreFeedSkeleton() (+48 more)

### Community 9 - "HomeScreen.tsx"
Cohesion: 0.07
Nodes (42): DetailImage(), editorialAssets, resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps (+34 more)

### Community 10 - "AddItemReviewScreen.tsx"
Cohesion: 0.13
Nodes (17): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, AddItemEntryScreen(), createStyles(), inputOptions, Props, AddItemImageScreen() (+9 more)

### Community 11 - "wardrobeService.ts"
Cohesion: 0.15
Nodes (16): createSupabaseWardrobeGateway(), createWardrobeService(), mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty(), row, toWardrobeInsert() (+8 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStore.ts"
Cohesion: 0.17
Nodes (27): AuthService, createAuthService(), isEmailVerified(), createProfileService(), createSupabaseProfileGateway(), AccountActions, createAuthAccountActions(), createAuthFlowActions() (+19 more)

### Community 16 - "expo"
Cohesion: 0.09
Nodes (21): package, projectId, tsconfigPaths, expo, android, experiments, extra, ios (+13 more)

### Community 17 - "StateViews.tsx"
Cohesion: 0.12
Nodes (21): Chip(), ChipProps, createStyles(), createStyles(), DeferredNotice(), LoadingState(), MessageState(), MessageStateProps (+13 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.05
Nodes (65): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+57 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+12 more)

### Community 20 - "ProfileSettingsDirectory.tsx"
Cohesion: 0.23
Nodes (9): createStyles(), DirectoryRow(), DirectoryStyles, IconName, ProfileDirectoryRow(), ProfileSettingsDirectory(), ProfileSettingsDirectoryProps, createStyles() (+1 more)

### Community 21 - "AppTheme"
Cohesion: 0.17
Nodes (14): AppHeader(), AppHeaderProps, createStyles(), AppScreenProps, createStyles(), IconButton(), IconButtonProps, createStyles() (+6 more)

### Community 22 - "_shared/catalog/types.ts"
Cohesion: 0.13
Nodes (14): CATALOG_ENRICHMENT_VERSION, CATALOG_NORMALIZATION_VERSION, CatalogGender, CatalogImageType, CatalogProductDecision, CatalogSourceType, CatalogStyleProfile, CatalogStyleTag (+6 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "BodyProfileScreen.tsx"
Cohesion: 0.08
Nodes (39): createStyles(), PreferenceChoiceGroup(), PreferenceChoiceGroupProps, togglePreference(), ArrayPreferenceKey, createStyles(), PreferenceSelectionScreen(), PreferenceSelectionScreenProps (+31 more)

### Community 25 - "fetch-page.ts"
Cohesion: 0.18
Nodes (14): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+6 more)

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "WardrobeScreen.tsx"
Cohesion: 0.16
Nodes (20): EmptyState(), AccountSettingsScreen(), Props, createStyles(), ProfileScreen(), Props, useSignOutAction(), createStyles() (+12 more)

### Community 28 - "src/catalog/types.ts"
Cohesion: 0.12
Nodes (20): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogBrandProgress, CatalogImportError, CatalogOverview, CatalogBrandProgressRow (+12 more)

### Community 29 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.24
Nodes (16): ImportPreviewStep(), applySaveResults(), buildWardrobeInputs(), createImportDeduplicationKey(), createImportPreview(), setAllSelected(), summarizeSaveResults(), candidate (+8 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "StylistScreen.tsx"
Cohesion: 0.12
Nodes (19): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, createStyles(), SectionHeader(), SectionHeaderProps, createStyles() (+11 more)

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
Cohesion: 0.27
Nodes (8): createStyles(), ToggleRow(), ToggleRowProps, AddItemDetailsScreen(), createStyles(), initialDraft, Props, DraftWardrobeItem

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

### Community 55 - "validate.ts"
Cohesion: 0.18
Nodes (15): CATALOG_TAXONOMY, CatalogCategoryDefinition, CatalogSubcategoryDefinition, isCatalogCategoryPair(), normalizeCatalogCategory(), normalizeSignal(), CatalogCategoryMatch, CatalogPipelineContext (+7 more)

### Community 56 - "management-actions.ts"
Cohesion: 0.29
Nodes (16): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), compact(), parseCatalogManagementAction(), parsePatch() (+8 more)

### Community 57 - "InspirationDetailScreen.tsx"
Cohesion: 0.40
Nodes (5): createStyles(), HomeProps, InspirationDetailContent(), InspirationDetailScreen(), HomeStackParamList

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "RootNavigator.tsx"
Cohesion: 0.15
Nodes (14): AuthNavigator(), MainAppNavigator(), OnboardingNavigator(), Stack, RootNavigator(), Stack, ONBOARDING_ROUTES, ROOT_ROUTES (+6 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "useAppTheme"
Cohesion: 0.18
Nodes (17): Avatar(), Badge(), createStyles(), StatCard(), ErrorState(), createStyles(), ProfileIdentity(), ProfileIdentityProps (+9 more)

### Community 64 - "ActionButton.tsx"
Cohesion: 0.14
Nodes (21): CatalogJobCard(), createStyles(), Props, CatalogMetricCard(), createStyles(), CatalogReviewCard(), createStyles(), Props (+13 more)

### Community 65 - "profileService.ts"
Cohesion: 0.11
Nodes (26): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+18 more)

### Community 66 - "catalogAdminService.ts"
Cohesion: 0.23
Nodes (12): CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty(), readString(), toNumberRecord() (+4 more)

### Community 67 - "authErrors.ts"
Cohesion: 0.32
Nodes (10): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+2 more)

### Community 68 - "ImportPreviewStep.tsx"
Cohesion: 0.21
Nodes (11): createStyles(), EditFields, EditImportedProductForm(), EditImportedProductModal(), Props, ImportSaveSummary, createStyles(), Metric() (+3 more)

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 71 - "validate-url.ts"
Cohesion: 0.32
Nodes (10): resolvePublicDns(), BLOCKED_HOSTNAMES, failure(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4(), MAX_IMPORT_URL_LENGTH, parseIpv4() (+2 more)

### Community 72 - "pipeline.ts"
Cohesion: 0.21
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), processCatalogCandidates(), CatalogDuplicate (+3 more)

### Community 73 - "authState.ts"
Cohesion: 0.19
Nodes (12): AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot(), ProfileLoadStatus, authenticatedSnapshot(), incompleteProfile, session (+4 more)

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

### Community 79 - "generic-structured-data.ts"
Cohesion: 0.22
Nodes (7): EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CatalogExtractionMethod, CatalogImporterAdapter, CatalogImportSource, ExtractionMethod

### Community 80 - "getSupabaseClient"
Cohesion: 0.33
Nodes (7): environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), AuthBootstrap(), getSupabaseClient(), startSupabaseAutoRefresh()

### Community 82 - "Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state., Source Nodes

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "ImportUrlInputStep.tsx"
Cohesion: 0.25
Nodes (8): errorTitle(), ImportErrorPanel(), Props, createStyles(), ImportUrlInputStep(), Props, WardrobeImportClientError, UrlValidationResult

### Community 89 - "MainAppNavigator.tsx"
Cohesion: 0.22
Nodes (9): Tabs, TabIconKey, createStyles(), glyphs, TabBarIcon(), ExploreTabNavigator(), HomeTabNavigator(), StylistTabNavigator() (+1 more)

### Community 90 - "SelectField.tsx"
Cohesion: 0.36
Nodes (6): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField(), SelectFieldProps

### Community 91 - "import-wardrobe-url/index.ts"
Cohesion: 0.29
Nodes (5): corsHeaders, errorResponse(), jsonResponse(), rateWindows, WardrobeImportErrorResponse

### Community 92 - "wardrobeImportService.ts"
Cohesion: 0.62
Nodes (6): importWardrobeUrl(), isErrorCode(), isImportResponse(), normalizeFunctionError(), readProperty(), readString()

### Community 93 - "ImportedProductCard.tsx"
Cohesion: 0.47
Nodes (5): createStyles(), formatPrice(), ImportedProductCard(), Props, ImportPreviewItem

### Community 94 - "isCatalogDevToolsEnabled"
Cohesion: 0.60
Nodes (3): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), ProfileTabNavigator()

### Community 95 - "FloatingTabBar.tsx"
Cohesion: 0.60
Nodes (4): createStyles(), FloatingTabBar(), VisibleFloatingTabBar(), isMainTabRootRoute()

## Knowledge Gaps
- **479 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+474 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `ExploreScreen.tsx` (5× useful, score=4.735413661)
- `TabNavigators.tsx` (3× useful, score=2.802864264) _(code changed — re-verify)_
- `ExploreMasonryFeed.tsx` (3× useful, score=2.802434351)
- `SearchResultsScreen.tsx` (2× useful, score=1.93297931)
- `MainAppNavigator.tsx` (2× useful, score=1.890236215)
- `navigation/types.ts` (2× useful, score=1.890236215) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `ResetPasswordScreen.tsx`, `theme/index.ts`, `TabNavigators.tsx`, `ExploreOutfitDetailScreen.tsx`, `HomeScreen.tsx`, `AddItemReviewScreen.tsx`, `StateViews.tsx`, `ProfileSettingsDirectory.tsx`, `AppTheme`, `BodyProfileScreen.tsx`, `WardrobeScreen.tsx`, `src/catalog/types.ts`, `ImportWardrobeWebsiteScreen.tsx`, `StylistScreen.tsx`, `AddItemDetailsScreen.tsx`, `InspirationDetailScreen.tsx`, `RootNavigator.tsx`, `ActionButton.tsx`, `ImportPreviewStep.tsx`, `ImportUrlInputStep.tsx`, `MainAppNavigator.tsx`, `SelectField.tsx`, `ImportedProductCard.tsx`, `FloatingTabBar.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `ResetPasswordScreen.tsx`, `theme/index.ts`, `TabNavigators.tsx`, `ExploreOutfitDetailScreen.tsx`, `HomeScreen.tsx`, `AddItemReviewScreen.tsx`, `StateViews.tsx`, `ProfileSettingsDirectory.tsx`, `BodyProfileScreen.tsx`, `WardrobeScreen.tsx`, `src/catalog/types.ts`, `StylistScreen.tsx`, `AddItemDetailsScreen.tsx`, `InspirationDetailScreen.tsx`, `RootNavigator.tsx`, `useAppTheme`, `ActionButton.tsx`, `ImportPreviewStep.tsx`, `ImportUrlInputStep.tsx`, `MainAppNavigator.tsx`, `SelectField.tsx`, `ImportedProductCard.tsx`, `FloatingTabBar.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `CatalogManagementAction` connect `ActionButton.tsx` to `ResetPasswordScreen.tsx`, `management-actions.ts`, `catalogAdminService.ts`, `catalog-management/index.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _479 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ResetPasswordScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07594381035996488 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `theme/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0990990990990991 - nodes in this community are weakly interconnected._