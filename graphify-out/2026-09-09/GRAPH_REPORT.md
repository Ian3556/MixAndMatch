# Graph Report - MixAndMatch  (2026-09-09)

## Corpus Check
- 270 files · ~138,192 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1550 nodes · 3793 edges · 90 communities (75 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5af43487`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuthStore
- routes.ts
- Build Phase 3 — Wardrobe Website URL Import
- theme.ts
- normalize-product.ts
- devDependencies
- dependencies
- TabNavigators.tsx
- ExploreOutfitDetailScreen.tsx
- HomeScreen.tsx
- WardrobeItemDetailScreen.tsx
- wardrobeService.ts
- InMemoryCatalogClient
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStore.ts
- expo
- fetch-page.ts
- catalog-management/index.ts
- compilerOptions
- persist.ts
- processEntry
- _shared/catalog/types.ts
- Mix & Match catalogue database audit
- BodyProfileScreen.tsx
- wardrobeImportService.ts
- normalize.ts
- ProfileScreen.tsx
- src/catalog/types.ts
- ImportPreviewStep.tsx
- .prettierrc.json
- graphify reference: extra exports and benchmark
- AddItemDetailsScreen.tsx
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
- ActionButton.tsx
- Mix & Match catalogue database
- Q: Update Explore into a Pinterest-style fashion feed with functional search and filters, then reorder the bottom navigation to Home, Explore, Stylist, Wardrobe, Profile.
- Q: Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image.
- enrich.ts
- Phase 2: UI Structuring
- Mix & Match
- scripts
- validate.ts
- management-actions.ts
- SearchResultsScreen.tsx
- README.md
- package.json
- Phase 1 architecture
- validate-url.ts
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- useAppTheme
- theme/index.ts
- profileService.ts
- AddItemReviewScreen.tsx
- authErrors.ts
- manualWardrobeItem.ts
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- react-native
- WardrobeToolbar.tsx
- pipeline.ts
- profile.ts
- authService.ts
- react
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- generic-structured-data.ts
- Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation.
- expo-dev-client
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- @expo/vector-icons
- @react-native-async-storage/async-storage
- @react-navigation/native
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- job-state.ts
- WardrobeSummary.tsx
- expo-linking

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 188 edges
2. `AppTheme` - 86 edges
3. `useAuthStore` - 39 edges
4. `ActionButton()` - 38 edges
5. `AppScreen()` - 37 edges
6. `normalizeCatalogProduct()` - 20 edges
7. `showDeferredNotice()` - 19 edges
8. `Mix & Match catalogue database` - 18 edges
9. `ProfileStackParamList` - 17 edges
10. `getGridColumnCount()` - 16 edges

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

## Communities (90 total, 15 thin omitted)

### Community 0 - "useAuthStore"
Cohesion: 0.07
Nodes (58): createStyles(), ErrorBanner(), ErrorBannerProps, FormTextInput, createStyles(), ScreenContainer(), ScreenContainerProps, DevelopmentQuickLoginCredentials (+50 more)

### Community 1 - "routes.ts"
Cohesion: 0.13
Nodes (20): createStyles(), FloatingTabBar(), VisibleFloatingTabBar(), roots, sourceFiles, getTabConfig(), isMainTabRootRoute(), MAIN_TAB_CONFIG (+12 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme.ts"
Cohesion: 0.13
Nodes (14): darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing, darkTheme, lightTheme (+6 more)

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
Cohesion: 0.08
Nodes (43): AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup() (+35 more)

### Community 8 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.08
Nodes (37): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFilterPanel(), FilterSection(), Props, createStyles() (+29 more)

### Community 9 - "HomeScreen.tsx"
Cohesion: 0.07
Nodes (42): DetailImage(), editorialAssets, resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps (+34 more)

### Community 10 - "WardrobeItemDetailScreen.tsx"
Cohesion: 0.09
Nodes (38): createStyles(), OutfitCard(), OutfitCardProps, createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, createStyles(), DeferredNotice() (+30 more)

### Community 11 - "wardrobeService.ts"
Cohesion: 0.14
Nodes (18): createSupabaseWardrobeGateway(), createWardrobeService(), mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty(), row, toWardrobeInsert() (+10 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStore.ts"
Cohesion: 0.16
Nodes (28): AuthService, createAuthService(), isEmailVerified(), createProfileService(), createSupabaseProfileGateway(), AccountActions, createAuthAccountActions(), createAuthFlowActions() (+20 more)

### Community 16 - "expo"
Cohesion: 0.09
Nodes (21): package, projectId, tsconfigPaths, expo, android, experiments, extra, ios (+13 more)

### Community 17 - "fetch-page.ts"
Cohesion: 0.11
Nodes (19): corsHeaders, errorResponse(), jsonResponse(), rateWindows, assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage() (+11 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.09
Nodes (35): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, CatalogManagementError, CategoryRow, corsHeaders (+27 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+12 more)

### Community 20 - "persist.ts"
Cohesion: 0.17
Nodes (11): CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient, CatalogRestError, readMessage() (+3 more)

### Community 21 - "processEntry"
Cohesion: 0.17
Nodes (15): canPersistRejectedProduct(), editProduct(), ensureAllowedDomain(), findReviewProduct(), findSourceById(), hashText(), loadCategories(), loadPersistenceLookup() (+7 more)

### Community 22 - "_shared/catalog/types.ts"
Cohesion: 0.13
Nodes (14): CATALOG_ENRICHMENT_VERSION, CATALOG_NORMALIZATION_VERSION, CatalogGender, CatalogImageType, CatalogProductDecision, CatalogSourceType, CatalogStyleProfile, CatalogStyleTag (+6 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "BodyProfileScreen.tsx"
Cohesion: 0.08
Nodes (41): createStyles(), PreferenceChoiceGroup(), PreferenceChoiceGroupProps, togglePreference(), ArrayPreferenceKey, createStyles(), PreferenceSelectionScreen(), PreferenceSelectionScreenProps (+33 more)

### Community 25 - "wardrobeImportService.ts"
Cohesion: 0.25
Nodes (11): errorTitle(), ImportErrorPanel(), Props, importWardrobeUrl(), isErrorCode(), isImportResponse(), normalizeFunctionError(), readProperty() (+3 more)

### Community 26 - "normalize.ts"
Cohesion: 0.21
Nodes (21): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+13 more)

### Community 27 - "ProfileScreen.tsx"
Cohesion: 0.07
Nodes (31): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps, unavailableMetrics, createStyles() (+23 more)

### Community 28 - "src/catalog/types.ts"
Cohesion: 0.06
Nodes (43): AppNavigation(), AppRoot(), CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogAdminServiceError, invokeCatalogManagement() (+35 more)

### Community 29 - "ImportPreviewStep.tsx"
Cohesion: 0.17
Nodes (24): EditImportedProductModal(), ImportSaveSummary, createStyles(), ImportPreviewStep(), Metric(), Props, applySaveResults(), buildWardrobeInputs() (+16 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "AddItemDetailsScreen.tsx"
Cohesion: 0.13
Nodes (17): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField(), SelectFieldProps, createStyles(), EditFields (+9 more)

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

### Community 47 - "ActionButton.tsx"
Cohesion: 0.11
Nodes (19): ActionButton(), ActionButtonProps, createStyles(), { testTheme, useAppThemeMock }, createStyles(), DevelopmentQuickLogin(), DevelopmentQuickLoginProps, Props (+11 more)

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
Nodes (15): normalizeSlug(), CATALOG_TAXONOMY, CatalogCategoryDefinition, CatalogSubcategoryDefinition, isCatalogCategoryPair(), normalizeCatalogCategory(), normalizeSignal(), CatalogCategoryMatch (+7 more)

### Community 56 - "management-actions.ts"
Cohesion: 0.24
Nodes (17): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), CatalogManagementRequestError, compact(), parseCatalogManagementAction() (+9 more)

### Community 57 - "SearchResultsScreen.tsx"
Cohesion: 0.12
Nodes (24): AppHeader(), AppHeaderProps, createStyles(), createStyles(), IconButton(), IconButtonProps, createStyles(), InspirationCard() (+16 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "validate-url.ts"
Cohesion: 0.29
Nodes (11): resolvePublicDns(), BLOCKED_HOSTNAMES, failure(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4(), MAX_IMPORT_URL_LENGTH, parseIpv4() (+3 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "useAppTheme"
Cohesion: 0.09
Nodes (31): Chip(), ChipProps, createStyles(), Avatar(), Badge(), createStyles(), StatCard(), createStyles() (+23 more)

### Community 64 - "theme/index.ts"
Cohesion: 0.10
Nodes (30): CatalogImportControls(), createStyles(), Props, CatalogJobCard(), createStyles(), Props, CatalogMetricCard(), createStyles() (+22 more)

### Community 65 - "profileService.ts"
Cohesion: 0.11
Nodes (22): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+14 more)

### Community 66 - "AddItemReviewScreen.tsx"
Cohesion: 0.27
Nodes (7): AddItemImageScreen(), createStyles(), Props, Props, neutralGarmentArtworkColors, WardrobeItemFixture, wardrobeItems

### Community 67 - "authErrors.ts"
Cohesion: 0.42
Nodes (9): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+1 more)

### Community 68 - "manualWardrobeItem.ts"
Cohesion: 0.26
Nodes (10): buildManualWardrobeInput(), createManualDeduplicationKey(), isPublicImageUrl(), ManualWardrobeItemErrors, optional(), draft, validateManualWardrobeItem(), AddItemDetailsScreen() (+2 more)

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 71 - "WardrobeToolbar.tsx"
Cohesion: 0.22
Nodes (8): createStyles(), Props, WardrobeLoadingSkeleton(), createStyles(), Props, ToolButtonProps, WardrobeToolbar(), WardrobeViewMode

### Community 72 - "pipeline.ts"
Cohesion: 0.21
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), processCatalogCandidates(), CatalogDuplicate (+3 more)

### Community 73 - "profile.ts"
Cohesion: 0.15
Nodes (16): AuthFlow, AuthSnapshot, createSignedOutSnapshot(), ProfileLoadStatus, authenticatedSnapshot(), incompleteProfile, session, user (+8 more)

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

### Community 80 - "Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation., Source Nodes

### Community 82 - "Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state., Source Nodes

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "job-state.ts"
Cohesion: 0.53
Nodes (4): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CatalogJobEntryState

### Community 88 - "WardrobeSummary.tsx"
Cohesion: 0.67
Nodes (3): createStyles(), Props, WardrobeSummary()

## Knowledge Gaps
- **493 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+488 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `ExploreScreen.tsx` (5× useful, score=4.416135312)
- `TabNavigators.tsx` (3× useful, score=2.613885236)
- `ExploreMasonryFeed.tsx` (3× useful, score=2.613484308)
- `SearchResultsScreen.tsx` (2× useful, score=1.802651004)
- `MainAppNavigator.tsx` (2× useful, score=1.762789799)
- `navigation/types.ts` (2× useful, score=1.762789799) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `useAuthStore`, `routes.ts`, `theme.ts`, `TabNavigators.tsx`, `ExploreOutfitDetailScreen.tsx`, `HomeScreen.tsx`, `WardrobeItemDetailScreen.tsx`, `BodyProfileScreen.tsx`, `ProfileScreen.tsx`, `src/catalog/types.ts`, `ImportPreviewStep.tsx`, `AddItemDetailsScreen.tsx`, `ActionButton.tsx`, `SearchResultsScreen.tsx`, `theme/index.ts`, `AddItemReviewScreen.tsx`, `manualWardrobeItem.ts`, `WardrobeToolbar.tsx`, `WardrobeSummary.tsx`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `theme/index.ts` to `useAuthStore`, `AddItemDetailsScreen.tsx`, `AddItemReviewScreen.tsx`, `routes.ts`, `theme.ts`, `TabNavigators.tsx`, `ExploreOutfitDetailScreen.tsx`, `HomeScreen.tsx`, `WardrobeItemDetailScreen.tsx`, `WardrobeToolbar.tsx`, `WardrobeSummary.tsx`, `ActionButton.tsx`, `BodyProfileScreen.tsx`, `SearchResultsScreen.tsx`, `ProfileScreen.tsx`, `src/catalog/types.ts`, `ImportPreviewStep.tsx`, `useAppTheme`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `CatalogManagementAction` connect `theme/index.ts` to `management-actions.ts`, `catalog-management/index.ts`, `src/catalog/types.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _493 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.07157894736842105 - nodes in this community are weakly interconnected._
- **Should `routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._