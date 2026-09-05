# Graph Report - MixAndMatch  (2026-09-04)

## Corpus Check
- 236 files · ~130,280 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1392 nodes · 3425 edges · 80 communities (64 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `15ddbd91`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ActionButton.tsx
- MainAppNavigator.tsx
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- wardrobe-import/types.ts
- devDependencies
- dependencies
- navigation/types.ts
- ExploreScreen.tsx
- HomeScreen.tsx
- TabNavigators.tsx
- ImportWardrobeWebsiteScreen.tsx
- InMemoryCatalogClient
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- StateViews.tsx
- catalog-management/index.ts
- compilerOptions
- persist.ts
- AppTheme
- _shared/catalog/types.ts
- Mix & Match catalogue database audit
- processJob
- fetch-page.ts
- normalize.ts
- ExploreOutfitDetailScreen.tsx
- management-actions.ts
- validate.ts
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
- Mix & Match catalogue database
- Q: Update Explore into a Pinterest-style fashion feed with functional search and filters, then reorder the bottom navigation to Home, Explore, Stylist, Wardrobe, Profile.
- Q: Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image.
- enrich.ts
- Phase 2: UI Structuring
- Mix & Match
- scripts
- taxonomy.ts
- authCallback.ts
- useAppTheme
- README.md
- package.json
- Phase 1 architecture
- validate-url.ts
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- authService.ts
- CatalogDevelopmentScreen.tsx
- profileService.ts
- interactionAudit.test.ts
- job-state.ts
- expo-linking
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- react-native
- react-native-screens
- pipeline.ts
- authState.ts
- getSupabaseClient
- react
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- expo-clipboard
- react-native-safe-area-context
- expo-dev-client

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 150 edges
2. `AppTheme` - 68 edges
3. `ActionButton()` - 37 edges
4. `useAuthStore` - 37 edges
5. `AppScreen()` - 33 edges
6. `showDeferredNotice()` - 31 edges
7. `DeferredNotice()` - 20 edges
8. `normalizeCatalogProduct()` - 20 edges
9. `Mix & Match catalogue database` - 18 edges
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

## Communities (80 total, 16 thin omitted)

### Community 0 - "ActionButton.tsx"
Cohesion: 0.06
Nodes (67): CatalogImportControls(), createStyles(), Props, CatalogReviewEditModal(), createStyles(), Props, ActionButton(), ActionButtonProps (+59 more)

### Community 1 - "MainAppNavigator.tsx"
Cohesion: 0.18
Nodes (14): MainAppNavigator(), Tabs, getTabConfig(), MAIN_TAB_CONFIG, TabIconKey, MAIN_ROUTES, createStyles(), glyphs (+6 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.13
Nodes (18): AppNavigation(), AppRoot(), darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing (+10 more)

### Community 4 - "wardrobe-import/types.ts"
Cohesion: 0.06
Nodes (53): corsHeaders, errorResponse(), jsonResponse(), rateWindows, EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CatalogExtractionMethod (+45 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): expo, dependencies, expo, react-dom, @react-native-async-storage/async-storage, react-native-url-polyfill, react-native-web, @react-navigation/bottom-tabs (+13 more)

### Community 7 - "navigation/types.ts"
Cohesion: 0.12
Nodes (33): AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup() (+25 more)

### Community 8 - "ExploreScreen.tsx"
Cohesion: 0.10
Nodes (27): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFilterPanel(), FilterSection(), Props, exploreDiscoveryContent (+19 more)

### Community 9 - "HomeScreen.tsx"
Cohesion: 0.07
Nodes (42): DetailImage(), editorialAssets, resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps (+34 more)

### Community 10 - "TabNavigators.tsx"
Cohesion: 0.07
Nodes (40): createStyles(), SelectField(), SelectFieldProps, createStyles(), ToggleRow(), ToggleRowProps, AppearanceSettingsScreen(), NotificationKey (+32 more)

### Community 11 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.06
Nodes (61): EditImportedProductModal(), createStyles(), ImportCompleteStep(), ImportSaveSummary, Props, createStyles(), formatPrice(), ImportedProductCard() (+53 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStoreRuntime.ts"
Cohesion: 0.17
Nodes (26): AuthService, createAuthService(), isEmailVerified(), createSupabaseProfileGateway(), AccountActions, createAuthAccountActions(), createAuthFlowActions(), FlowActions (+18 more)

### Community 16 - "expo"
Cohesion: 0.09
Nodes (21): package, projectId, tsconfigPaths, expo, android, experiments, extra, ios (+13 more)

### Community 17 - "StateViews.tsx"
Cohesion: 0.19
Nodes (13): createStyles(), EmptyState(), LoadingState(), MessageState(), MessageStateProps, SkeletonCard(), StateAction, createStyles() (+5 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (34): appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow, corsHeaders (+26 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+12 more)

### Community 20 - "persist.ts"
Cohesion: 0.18
Nodes (10): CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient, CatalogRestError, readMessage() (+2 more)

### Community 21 - "AppTheme"
Cohesion: 0.08
Nodes (39): AppHeader(), AppHeaderProps, createStyles(), Chip(), ChipProps, createStyles(), createStyles(), IconButton() (+31 more)

### Community 22 - "_shared/catalog/types.ts"
Cohesion: 0.13
Nodes (14): CATALOG_ENRICHMENT_VERSION, CATALOG_NORMALIZATION_VERSION, CatalogGender, CatalogImageType, CatalogProductDecision, CatalogSourceType, CatalogStyleProfile, CatalogStyleTag (+6 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "processJob"
Cohesion: 0.26
Nodes (15): appendCheckpointId(), finalizeJob(), findBrand(), findJob(), getRetryDelayMs(), handleAction(), processJob(), readNumberProperty() (+7 more)

### Community 25 - "fetch-page.ts"
Cohesion: 0.18
Nodes (14): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+6 more)

### Community 26 - "normalize.ts"
Cohesion: 0.21
Nodes (21): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+13 more)

### Community 27 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.23
Nodes (9): createStyles(), ExploreFeedCard, ExploreMasonryFeed(), Props, CATEGORY_LABELS, createStyles(), ExploreDetailSkeleton(), ExploreOutfitDetailScreen() (+1 more)

### Community 28 - "management-actions.ts"
Cohesion: 0.05
Nodes (60): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogJobCard(), createStyles(), Props, CatalogReviewCard() (+52 more)

### Community 29 - "validate.ts"
Cohesion: 0.36
Nodes (8): normalizeSlug(), CatalogValidationResult, EnrichedCatalogProduct, isHttpUrl(), readDomain(), REJECTING_ERRORS, unique(), validateCatalogProduct()

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "StylistScreen.tsx"
Cohesion: 0.11
Nodes (20): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, createStyles(), primaryActions, Props, StylistScreen() (+12 more)

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

### Community 56 - "authCallback.ts"
Cohesion: 0.53
Nodes (4): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback

### Community 57 - "useAppTheme"
Cohesion: 0.11
Nodes (28): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, Avatar(), Badge() (+20 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "validate-url.ts"
Cohesion: 0.32
Nodes (10): resolvePublicDns(), BLOCKED_HOSTNAMES, failure(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4(), MAX_IMPORT_URL_LENGTH, parseIpv4() (+2 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "authService.ts"
Cohesion: 0.18
Nodes (18): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+10 more)

### Community 64 - "CatalogDevelopmentScreen.tsx"
Cohesion: 0.19
Nodes (12): CatalogMetricCard(), createStyles(), useCatalogAdminStore, createStyles(), SectionHeader(), SectionHeaderProps, isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled() (+4 more)

### Community 65 - "profileService.ts"
Cohesion: 0.14
Nodes (18): createProfileService(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readStringProperty(), fetchById, row (+10 more)

### Community 67 - "job-state.ts"
Cohesion: 0.53
Nodes (4): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CatalogJobEntryState

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 72 - "pipeline.ts"
Cohesion: 0.19
Nodes (12): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), processCatalogCandidates(), CatalogDuplicate (+4 more)

### Community 73 - "authState.ts"
Cohesion: 0.19
Nodes (11): AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot(), ProfileLoadStatus, authenticatedSnapshot(), incompleteProfile, session (+3 more)

### Community 74 - "getSupabaseClient"
Cohesion: 0.19
Nodes (10): environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), AuthBootstrap(), WardrobeUpdate, OperationTimedOutError, withTimeout() (+2 more)

### Community 76 - "Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?, Source Nodes

### Community 77 - "Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action., Source Nodes

## Knowledge Gaps
- **452 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+447 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `ExploreScreen.tsx` (4× useful, score=3.909684382) _(code changed — re-verify)_
- `ExploreMasonryFeed.tsx` (3× useful, score=2.932549305)
- `TabNavigators.tsx` (2× useful, score=1.932135771) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `ActionButton.tsx`, `CatalogDevelopmentScreen.tsx`, `StylistScreen.tsx`, `theme/index.ts`, `MainAppNavigator.tsx`, `navigation/types.ts`, `ExploreScreen.tsx`, `HomeScreen.tsx`, `TabNavigators.tsx`, `ImportWardrobeWebsiteScreen.tsx`, `StateViews.tsx`, `AppTheme`, `ExploreOutfitDetailScreen.tsx`, `management-actions.ts`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `ActionButton.tsx`, `CatalogDevelopmentScreen.tsx`, `StylistScreen.tsx`, `MainAppNavigator.tsx`, `theme/index.ts`, `navigation/types.ts`, `ExploreScreen.tsx`, `HomeScreen.tsx`, `TabNavigators.tsx`, `ImportWardrobeWebsiteScreen.tsx`, `StateViews.tsx`, `useAppTheme`, `ExploreOutfitDetailScreen.tsx`, `management-actions.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `CatalogManagementAction` connect `management-actions.ts` to `ActionButton.tsx`, `catalog-management/index.ts`, `CatalogDevelopmentScreen.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _452 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ActionButton.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06117353308364544 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `theme/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._