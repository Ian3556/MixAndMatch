# Graph Report - MixAndMatch  (2026-09-10)

## Corpus Check
- 284 files · ~142,948 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1618 nodes · 3926 edges · 109 communities (91 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53b46a25`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuthStore
- routes.ts
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- normalize-product.ts
- devDependencies
- dependencies
- TabNavigators.tsx
- ExploreOutfitDetailScreen.tsx
- EditorialPrimitives.tsx
- WardrobeItemDetailScreen.tsx
- wardrobeService.ts
- InMemoryCatalogClient
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- fetch-page.ts
- catalog-management/index.ts
- compilerOptions
- startupProgress.ts
- StateViews.tsx
- _shared/catalog/types.ts
- Mix & Match catalogue database audit
- BodyProfileScreen.tsx
- wardrobeImportService.ts
- normalize.ts
- ProfileScreen.tsx
- management-actions.ts
- ImportWardrobeWebsiteScreen.tsx
- .prettierrc.json
- graphify reference: extra exports and benchmark
- fixtures.test.ts
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
- ImportUrlInputStep.tsx
- Mix & Match catalogue database
- Q: Update Explore into a Pinterest-style fashion feed with functional search and filters, then reorder the bottom navigation to Home, Explore, Stylist, Wardrobe, Profile.
- Q: Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image.
- enrich.ts
- Phase 2: UI Structuring
- Mix & Match
- scripts
- validate.ts
- editorial.ts
- WardrobeScreen.tsx
- README.md
- package.json
- Phase 1 architecture
- validate-url.ts
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- useAppTheme
- AppTheme
- profileService.ts
- navigation/types.ts
- authErrors.ts
- AddItemDetailsScreen.tsx
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- react-native
- WardrobeToolbar.tsx
- pipeline.ts
- authStore.ts
- authService.ts
- react
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- generic-structured-data.ts
- Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation.
- types/discovery.ts
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- expo-clipboard
- wardrobe-import/types.ts
- ExploreScreen.tsx
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- ProfileSettingsDirectory.tsx
- WardrobeSummary.tsx
- ImportPreviewStep.tsx
- wardrobeStore.ts
- IconButton.tsx
- utils/discovery.ts
- ActivitySummary.tsx
- HomeEditorialSkeleton.tsx
- AddWardrobeItemMenu.tsx
- authAccountActions.ts
- Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius
- Q: How should the Double M startup loader integrate with the existing app?
- ToggleRow.tsx
- ProfileIdentity.tsx
- interactionAudit.test.ts
- typography.ts
- expo-splash-screen
- react-native-safe-area-context
- react-native-screens
- react-native-url-polyfill
- @react-navigation/native-stack
- zustand

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 186 edges
2. `AppTheme` - 85 edges
3. `useAuthStore` - 41 edges
4. `ActionButton()` - 38 edges
5. `AppScreen()` - 37 edges
6. `normalizeCatalogProduct()` - 20 edges
7. `showDeferredNotice()` - 19 edges
8. `Mix & Match catalogue database` - 18 edges
9. `ProfileStackParamList` - 17 edges
10. `getGridColumnCount()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `AuthBootstrap()` --calls--> `startSupabaseAutoRefresh()`  [EXTRACTED]
  src/features/auth/AuthBootstrap.tsx → supabase/client.ts
- `createImportDeduplicationKey()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/features/wardrobe/import/importWorkflow.ts → supabase/functions/_shared/wardrobe-import/normalize-product.ts
- `ImportWardrobeWebsiteScreen()` --calls--> `validateImportUrl()`  [EXTRACTED]
  src/features/wardrobe/screens/ImportWardrobeWebsiteScreen.tsx → supabase/functions/_shared/wardrobe-import/validate-url.ts
- `createAuthService()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/services/authService.ts → supabase/client.ts
- `createSupabaseProfileGateway()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/services/supabaseProfileGateway.ts → supabase/client.ts

## Import Cycles
- None detected.

## Communities (109 total, 18 thin omitted)

### Community 0 - "useAuthStore"
Cohesion: 0.07
Nodes (58): createStyles(), ErrorBanner(), ErrorBannerProps, FormTextInput, FormTextInputProps, createStyles(), ScreenContainer(), ScreenContainerProps (+50 more)

### Community 1 - "routes.ts"
Cohesion: 0.12
Nodes (25): createStyles(), FloatingTabBar(), VisibleFloatingTabBar(), MainAppNavigator(), Tabs, getTabConfig(), isMainTabRootRoute(), MAIN_TAB_CONFIG (+17 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.21
Nodes (13): darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing, darkTheme, lightTheme (+5 more)

### Community 4 - "normalize-product.ts"
Cohesion: 0.10
Nodes (40): extractProductsFromHtml(), fixtureDirectory, AnchorRecord, compact(), extractGenericHtmlProducts(), extractOpenGraphProduct(), extractPlatformProducts(), isDecorative() (+32 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (23): expo, expo-dev-client, expo-linking, @expo/vector-icons, dependencies, expo, expo-dev-client, expo-linking (+15 more)

### Community 7 - "TabNavigators.tsx"
Cohesion: 0.11
Nodes (30): AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup() (+22 more)

### Community 8 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.18
Nodes (12): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFeedCard, ExploreMasonryFeed(), Props, CATEGORY_LABELS (+4 more)

### Community 9 - "EditorialPrimitives.tsx"
Cohesion: 0.14
Nodes (21): DetailImage(), resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps, EditorialImage() (+13 more)

### Community 10 - "WardrobeItemDetailScreen.tsx"
Cohesion: 0.14
Nodes (19): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, EmptyState(), ExploreOutfitDetailScreen(), createStyles(), OutfitDetailScreen() (+11 more)

### Community 11 - "wardrobeService.ts"
Cohesion: 0.17
Nodes (13): mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty(), row, toWardrobeInsert(), WardrobeGateway, WardrobeGatewayResult (+5 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStoreRuntime.ts"
Cohesion: 0.26
Nodes (20): markStartupComplete(), markStartupStep(), createAuthService(), isEmailVerified(), createProfileService(), createSupabaseProfileGateway(), FlowActions, asInitializationError() (+12 more)

### Community 16 - "expo"
Cohesion: 0.06
Nodes (30): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, icon, package, projectId, tsconfigPaths (+22 more)

### Community 17 - "fetch-page.ts"
Cohesion: 0.22
Nodes (12): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+4 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.06
Nodes (62): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+54 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+12 more)

### Community 20 - "startupProgress.ts"
Cohesion: 0.08
Nodes (36): AppNavigation(), AppRoot(), calculateDoubleMFillBounds(), DOUBLE_M_BOTTOM, DOUBLE_M_PATHS, DOUBLE_M_TOP, DOUBLE_M_VIEWBOX_SIZE, DoubleMLoader() (+28 more)

### Community 21 - "StateViews.tsx"
Cohesion: 0.09
Nodes (26): Chip(), ChipProps, createStyles(), createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField() (+18 more)

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
Cohesion: 0.44
Nodes (7): importWardrobeUrl(), isErrorCode(), isImportResponse(), normalizeFunctionError(), readProperty(), readString(), { invoke }

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "ProfileScreen.tsx"
Cohesion: 0.24
Nodes (10): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), createStyles(), SignOutRow(), createStyles(), ProfileScreen(), Props, useSignOutAction() (+2 more)

### Community 28 - "management-actions.ts"
Cohesion: 0.05
Nodes (60): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogJobCard(), createStyles(), Props, CatalogAdminServiceError (+52 more)

### Community 29 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.25
Nodes (16): ImportPreviewStep(), applySaveResults(), buildWardrobeInputs(), createImportDeduplicationKey(), createImportPreview(), ImportPreviewItem, setAllSelected(), summarizeSaveResults() (+8 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "fixtures.test.ts"
Cohesion: 0.23
Nodes (8): CategoryFixture, exploreStyles, styleCategories, wardrobeCategories, quickStylingPrompts, stylingTips, WardrobeItemFixture, wardrobeItems

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

### Community 47 - "ImportUrlInputStep.tsx"
Cohesion: 0.23
Nodes (9): errorTitle(), ImportErrorPanel(), Props, createStyles(), ImportUrlInputStep(), Props, supportedPages, WardrobeImportClientError (+1 more)

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

### Community 56 - "editorial.ts"
Cohesion: 0.18
Nodes (13): editorialAssets, homeEditorialContent, HomeEditorialState, useHomeEditorialContent(), getHomeEditorialContent(), EDITORIAL_IMAGE_KEYS, EditorialImageKey, EditorialImageSource (+5 more)

### Community 57 - "WardrobeScreen.tsx"
Cohesion: 0.10
Nodes (28): createStyles(), InspirationCard(), InspirationCardProps, createStyles(), SearchBar(), SearchBarProps, createStyles(), Props (+20 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "validate-url.ts"
Cohesion: 0.27
Nodes (12): ensureAllowedDomain(), validateSourceUrls(), resolvePublicDns(), BLOCKED_HOSTNAMES, failure(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4() (+4 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "useAppTheme"
Cohesion: 0.13
Nodes (25): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, Avatar(), Badge(), createStyles(), StatCard(), createStyles() (+17 more)

### Community 64 - "AppTheme"
Cohesion: 0.11
Nodes (28): CatalogImportControls(), createStyles(), Props, CatalogMetricCard(), createStyles(), CatalogReviewCard(), createStyles(), Props (+20 more)

### Community 65 - "profileService.ts"
Cohesion: 0.11
Nodes (22): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+14 more)

### Community 66 - "navigation/types.ts"
Cohesion: 0.13
Nodes (17): ErrorState(), EditorialRule(), createStyles(), HomeScreen(), Props, AddItemEntryScreen(), createStyles(), inputOptions (+9 more)

### Community 67 - "authErrors.ts"
Cohesion: 0.42
Nodes (9): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+1 more)

### Community 68 - "AddItemDetailsScreen.tsx"
Cohesion: 0.22
Nodes (14): buildManualWardrobeInput(), createManualDeduplicationKey(), isPublicImageUrl(), ManualWardrobeItemErrors, optional(), draft, validateManualWardrobeItem(), AddItemDetailsScreen() (+6 more)

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 71 - "WardrobeToolbar.tsx"
Cohesion: 0.40
Nodes (4): createStyles(), Props, ToolButtonProps, WardrobeToolbar()

### Community 72 - "pipeline.ts"
Cohesion: 0.21
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), processCatalogCandidates(), CatalogDuplicate (+3 more)

### Community 73 - "authStore.ts"
Cohesion: 0.12
Nodes (21): createAuthFlowActions(), AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot(), ProfileLoadStatus, authenticatedSnapshot(), incompleteProfile (+13 more)

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

### Community 81 - "types/discovery.ts"
Cohesion: 0.24
Nodes (10): createStyles(), ExploreFilterPanel(), FilterSection(), Props, exploreDiscoveryContent, EXPLORE_CATEGORY_OPTIONS, EXPLORE_STYLE_OPTIONS, ExploreCategoryId (+2 more)

### Community 82 - "Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state., Source Nodes

### Community 84 - "wardrobe-import/types.ts"
Cohesion: 0.21
Nodes (8): corsHeaders, errorResponse(), jsonResponse(), rateWindows, WardrobeImportError, WardrobeImportErrorCode, WardrobeImportErrorResponse, WardrobeImportResponse

### Community 85 - "ExploreScreen.tsx"
Cohesion: 0.26
Nodes (8): ExploreDiscoveryState, useExploreDiscoveryContent(), createStyles(), ExploreScreen(), Props, toggleSelection(), getExploreDiscoveryContent(), filterExploreItems()

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "ProfileSettingsDirectory.tsx"
Cohesion: 0.23
Nodes (9): createStyles(), DirectoryRow(), DirectoryStyles, IconName, ProfileDirectoryRow(), ProfileSettingsDirectory(), ProfileSettingsDirectoryProps, createStyles() (+1 more)

### Community 88 - "WardrobeSummary.tsx"
Cohesion: 0.67
Nodes (3): createStyles(), Props, WardrobeSummary()

### Community 89 - "ImportPreviewStep.tsx"
Cohesion: 0.21
Nodes (10): createStyles(), EditFields, EditImportedProductForm(), EditImportedProductModal(), Props, ImportSaveSummary, createStyles(), Metric() (+2 more)

### Community 90 - "wardrobeStore.ts"
Cohesion: 0.25
Nodes (9): createStyles(), Props, WardrobeLoadingSkeleton(), createSupabaseWardrobeGateway(), createWardrobeService(), getService(), WardrobeStatus, WardrobeStore (+1 more)

### Community 91 - "IconButton.tsx"
Cohesion: 0.36
Nodes (6): AppHeader(), AppHeaderProps, createStyles(), createStyles(), IconButton(), IconButtonProps

### Community 92 - "utils/discovery.ts"
Cohesion: 0.36
Nodes (5): ExploreFilterCriteria, countSharedValues(), getRelatedExploreItems(), scoreExploreSimilarity(), selected

### Community 93 - "ActivitySummary.tsx"
Cohesion: 0.33
Nodes (5): ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps, unavailableMetrics

### Community 94 - "HomeEditorialSkeleton.tsx"
Cohesion: 0.40
Nodes (4): createStyles(), HomeEditorialSkeleton(), HomeEditorialSkeletonProps, SkeletonStyles

### Community 95 - "AddWardrobeItemMenu.tsx"
Cohesion: 0.40
Nodes (4): AddWardrobeItemMenu(), createStyles(), MenuOptionProps, Props

### Community 96 - "authAccountActions.ts"
Cohesion: 0.33
Nodes (5): AuthService, AccountActions, createAuthAccountActions(), AuthActions, setIntentionalSignOut()

### Community 97 - "Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius, Source Nodes

### Community 98 - "Q: How should the Double M startup loader integrate with the existing app?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should the Double M startup loader integrate with the existing app?, Source Nodes

### Community 99 - "ToggleRow.tsx"
Cohesion: 0.67
Nodes (3): createStyles(), ToggleRow(), ToggleRowProps

### Community 100 - "ProfileIdentity.tsx"
Cohesion: 0.67
Nodes (3): createStyles(), ProfileIdentity(), ProfileIdentityProps

### Community 102 - "typography.ts"
Cohesion: 0.50
Nodes (3): editorialFont, systemFont, systemFontMedium

## Knowledge Gaps
- **518 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+513 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `ExploreScreen.tsx` (5× useful, score=4.248338291)
- `TabNavigators.tsx` (3× useful, score=2.514567139)
- `ExploreMasonryFeed.tsx` (3× useful, score=2.514181445)
- `SearchResultsScreen.tsx` (2× useful, score=1.734156846)
- `MainAppNavigator.tsx` (2× useful, score=1.695810222)
- `navigation/types.ts` (2× useful, score=1.695810222)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `useAuthStore`, `routes.ts`, `theme/index.ts`, `TabNavigators.tsx`, `ExploreOutfitDetailScreen.tsx`, `EditorialPrimitives.tsx`, `WardrobeItemDetailScreen.tsx`, `startupProgress.ts`, `StateViews.tsx`, `BodyProfileScreen.tsx`, `ProfileScreen.tsx`, `management-actions.ts`, `ImportWardrobeWebsiteScreen.tsx`, `ImportUrlInputStep.tsx`, `WardrobeScreen.tsx`, `AppTheme`, `navigation/types.ts`, `AddItemDetailsScreen.tsx`, `WardrobeToolbar.tsx`, `types/discovery.ts`, `ExploreScreen.tsx`, `ProfileSettingsDirectory.tsx`, `WardrobeSummary.tsx`, `ImportPreviewStep.tsx`, `wardrobeStore.ts`, `IconButton.tsx`, `ActivitySummary.tsx`, `HomeEditorialSkeleton.tsx`, `AddWardrobeItemMenu.tsx`, `ToggleRow.tsx`, `ProfileIdentity.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `useAuthStore`, `routes.ts`, `theme/index.ts`, `TabNavigators.tsx`, `ExploreOutfitDetailScreen.tsx`, `EditorialPrimitives.tsx`, `WardrobeItemDetailScreen.tsx`, `StateViews.tsx`, `BodyProfileScreen.tsx`, `ProfileScreen.tsx`, `management-actions.ts`, `ImportUrlInputStep.tsx`, `WardrobeScreen.tsx`, `useAppTheme`, `navigation/types.ts`, `AddItemDetailsScreen.tsx`, `WardrobeToolbar.tsx`, `types/discovery.ts`, `ExploreScreen.tsx`, `ProfileSettingsDirectory.tsx`, `WardrobeSummary.tsx`, `ImportPreviewStep.tsx`, `wardrobeStore.ts`, `IconButton.tsx`, `ActivitySummary.tsx`, `HomeEditorialSkeleton.tsx`, `AddWardrobeItemMenu.tsx`, `ToggleRow.tsx`, `ProfileIdentity.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `CatalogManagementAction` connect `management-actions.ts` to `AppTheme`, `catalog-management/index.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _518 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.06893106893106893 - nodes in this community are weakly interconnected._
- **Should `routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12298387096774194 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._