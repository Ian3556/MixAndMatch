# Graph Report - MixAndMatch  (2026-09-22)

## Corpus Check
- 388 files · ~1,208,791 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2281 nodes · 5583 edges · 153 communities (136 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ab922f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes.ts
- MainAppNavigator.tsx
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- wardrobe-import/types.ts
- devDependencies
- dependencies
- AppScreen.tsx
- ExploreScreen.tsx
- EditorialPrimitives.tsx
- OutfitResultScreen.tsx
- wardrobeService.ts
- catalogDatabase.ts
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- import-wardrobe-url/index.ts
- catalog-management/index.ts
- compilerOptions
- startupProgress.ts
- generator.ts
- BodyProfileScreen.tsx
- Mix & Match catalogue database audit
- authState.ts
- PlaceholderArtwork.tsx
- normalize.ts
- editorial.ts
- pinned-fetch.ts
- fetch-page.ts
- .prettierrc.json
- graphify reference: extra exports and benchmark
- useAppTheme
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
- @expo/vector-icons
- ImportPreviewStep.tsx
- README.md
- package.json
- Phase 1 architecture
- types/wardrobe.ts
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- wardrobeHistory.ts
- seedCatalog.ts
- profileService.ts
- CatalogProductDetailScreen.tsx
- engine/index.ts
- navigation/types.ts
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- data/catalog/types.ts
- persist.ts
- pipeline.ts
- TabNavigators.tsx
- EditWardrobeItemScreen.tsx
- ActionButton.tsx
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- _shared/catalog/types.ts
- Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation.
- validateCatalog.ts
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- validator.ts
- types/index.ts
- ProfileScreen.tsx
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue.
- stylistStore.ts
- Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?
- react-native-url-polyfill
- Q: How to seed remote Supabase Project
- Q: Why did npm run catalog:seed fail with TypeError: fetch failed at seedCatalog.ts line 72?
- Q: Why does catalog:seed still report TypeError fetch failed after Test-NetConnection to Supabase port 443 succeeds?
- Q: What should be tested after the Supabase health endpoint returns HTTP 401 No API key found?
- SearchResultsScreen.tsx
- getSupabaseClient
- Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius
- Q: How should the Double M startup loader integrate with the existing app?
- StylistEditorial.tsx
- WardrobeScreen.tsx
- Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found
- Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts
- expo-splash-screen
- Development synthetic catalogue
- developmentQuickLogin.ts
- BrowseBrandsScreen.tsx
- WardrobeItemDetailScreen.tsx
- Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?
- preferenceModel.ts
- normalizeClothingItem.ts
- catalogBrowseService.ts
- authService.ts
- StateViews.tsx
- module-resolution.test.ts
- ExploreOutfitDetailScreen.tsx
- deno-runtime.d.ts
- react-native
- wardrobeImportService.ts
- CatalogBrandProgressCard.tsx
- recommendationEngine.ts
- catalog/categories.ts
- Q: Can we add image to the demo catalog?
- StylistScreen.tsx
- Q: why does it keep showing Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development?
- react-dom
- authErrors.ts
- management-actions.ts
- @react-native-async-storage/async-storage
- getOutfitItems
- react-native-screens
- @react-navigation/native
- Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint
- Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign.
- WardrobeToolbar.tsx
- AddWardrobeItemMenu.tsx
- HomeScreen.tsx
- Q: Supabase seed fails with Unable to inspect demo image bucket: Bucket not found
- utils/discovery.ts
- validate-url.ts
- BrandProductsScreen.tsx
- Q: Can we add image to the demo catalog?
- attributes.ts
- pinned-fetch.test.ts
- wardrobeMetadata.ts
- fixtures.test.ts
- WardrobeItem
- CatalogFilterPanel.tsx
- OutfitCard.tsx
- OutfitPreferencesScreen.tsx
- AddItemEntryScreen.tsx
- Chip.tsx
- SearchBar.tsx

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 217 edges
2. `AppTheme` - 96 edges
3. `useAuthStore` - 47 edges
4. `ActionButton()` - 42 edges
5. `AppScreen()` - 41 edges
6. `getOutfitItems()` - 38 edges
7. `getSupabaseClient()` - 21 edges
8. `normalizeCatalogProduct()` - 20 edges
9. `useWardrobeStore` - 19 edges
10. `normalizeClothingItem()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `loadCatalogDashboard()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogAdminService.ts → supabase/client.ts
- `invokeCatalogManagement()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogAdminService.ts → supabase/client.ts
- `loadBrands()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogBrowseService.ts → supabase/client.ts
- `searchCatalogProducts()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogBrowseService.ts → supabase/client.ts
- `loadBrandCategories()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogBrowseService.ts → supabase/client.ts

## Import Cycles
- None detected.

## Communities (153 total, 17 thin omitted)

### Community 0 - "routes.ts"
Cohesion: 0.20
Nodes (13): roots, sourceFiles, MAIN_TAB_CONFIG, MAIN_TAB_ROOT_ROUTES, MainTabRouteName, EXPLORE_ROUTES, HOME_ROUTES, MAIN_ROUTES (+5 more)

### Community 1 - "MainAppNavigator.tsx"
Cohesion: 0.13
Nodes (17): createStyles(), FloatingTabBar(), VisibleFloatingTabBar(), MainAppNavigator(), Tabs, getTabConfig(), isMainTabRootRoute(), TabIconKey (+9 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.17
Nodes (16): darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing, darkTheme, lightTheme (+8 more)

### Community 4 - "wardrobe-import/types.ts"
Cohesion: 0.06
Nodes (57): EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CatalogExtractionMethod, CatalogImporterAdapter, CatalogImportSource, extractProductsFromHtml(), fixtureDirectory (+49 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.08
Nodes (25): expo, expo-clipboard, expo-dev-client, expo-linking, dependencies, expo, expo-clipboard, expo-dev-client (+17 more)

### Community 7 - "AppScreen.tsx"
Cohesion: 0.17
Nodes (18): AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup() (+10 more)

### Community 8 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (18): createStyles(), ExploreFilterPanel(), FilterSection(), Props, exploreDiscoveryContent, ExploreDiscoveryState, useExploreDiscoveryContent(), createStyles() (+10 more)

### Community 9 - "EditorialPrimitives.tsx"
Cohesion: 0.13
Nodes (23): DetailImage(), resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps, EditorialImage() (+15 more)

### Community 10 - "OutfitResultScreen.tsx"
Cohesion: 0.20
Nodes (17): ErrorState(), createStyles(), FeedbackAction, OutfitDetailScreen(), Props, OutfitGeneratingScreen(), Props, createStyles() (+9 more)

### Community 11 - "wardrobeService.ts"
Cohesion: 0.11
Nodes (20): createSupabaseWardrobeGateway(), LegacyWardrobeRow, asMetadata(), createWardrobeService(), mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty() (+12 more)

### Community 12 - "catalogDatabase.ts"
Cohesion: 0.10
Nodes (23): CatalogImportError, CatalogOverview, CatalogRecentJob, CatalogBrandCategoryRow, CatalogBrandProgressRow, CatalogBrandRow, CatalogBrowseBrandRow, CatalogCategoryRow (+15 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStoreRuntime.ts"
Cohesion: 0.17
Nodes (27): markStartupComplete(), markStartupStep(), AuthService, createAuthService(), isEmailVerified(), createProfileService(), createSupabaseProfileGateway(), AccountActions (+19 more)

### Community 16 - "expo"
Cohesion: 0.06
Nodes (30): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, icon, package, projectId, tsconfigPaths (+22 more)

### Community 17 - "import-wardrobe-url/index.ts"
Cohesion: 0.20
Nodes (6): corsHeaders, errorResponse(), jsonResponse(), rateWindows, WardrobeImportError, WardrobeImportErrorResponse

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (50): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+42 more)

### Community 19 - "compilerOptions"
Cohesion: 0.09
Nodes (22): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, supabase/functions/_shared/deno-runtime.d.ts, ./supabase/index.ts (+14 more)

### Community 20 - "startupProgress.ts"
Cohesion: 0.08
Nodes (36): AppNavigation(), AppRoot(), calculateDoubleMFillBounds(), DOUBLE_M_BOTTOM, DOUBLE_M_PATHS, DOUBLE_M_TOP, DOUBLE_M_VIEWBOX_SIZE, DoubleMLoader() (+28 more)

### Community 21 - "generator.ts"
Cohesion: 0.17
Nodes (24): CATALOG_BRANDS, CATALOG_SEED, DEFAULT_PRODUCT_COUNT, SYNTHETIC_CATALOG_TIMESTAMP, SYNTHETIC_SOURCE_DOMAIN, CATEGORIES_BY_SLUG, allocateMaterials(), buildProduct() (+16 more)

### Community 22 - "BodyProfileScreen.tsx"
Cohesion: 0.08
Nodes (42): createStyles(), PreferenceChoiceGroup(), PreferenceChoiceGroupProps, togglePreference(), ArrayPreferenceKey, createStyles(), PreferenceSelectionScreen(), PreferenceSelectionScreenProps (+34 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "authState.ts"
Cohesion: 0.19
Nodes (12): AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot(), ProfileLoadStatus, authenticatedSnapshot(), incompleteProfile, session (+4 more)

### Community 25 - "PlaceholderArtwork.tsx"
Cohesion: 0.24
Nodes (9): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, createStyles(), WardrobeItemCard(), WardrobeItemCardProps, createStyles(), Props (+1 more)

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "editorial.ts"
Cohesion: 0.20
Nodes (12): editorialAssets, homeEditorialContent, HomeEditorialState, useHomeEditorialContent(), getHomeEditorialContent(), EDITORIAL_IMAGE_KEYS, EditorialImageKey, EditorialImageSource (+4 more)

### Community 28 - "pinned-fetch.ts"
Cohesion: 0.18
Nodes (18): BufferedConnectionReader, closeConnection(), concatenate(), createAbortError(), createChunkedBody(), createFixedLengthBody(), createPinnedFetch(), createUntilEofBody() (+10 more)

### Community 29 - "fetch-page.ts"
Cohesion: 0.15
Nodes (15): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+7 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "useAppTheme"
Cohesion: 0.09
Nodes (38): CatalogImportControls(), createStyles(), Props, CatalogJobCard(), createStyles(), Props, CatalogMetricCard(), createStyles() (+30 more)

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
Cohesion: 0.18
Nodes (12): errorTitle(), ImportErrorPanel(), Props, createStyles(), ImportUrlInputStep(), Props, supportedPages, SupportIndicator() (+4 more)

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
Cohesion: 0.12
Nodes (16): scripts, android, catalog:generate, catalog:reset-demo, catalog:seed, catalog:validate, format, format:check (+8 more)

### Community 55 - "validate.ts"
Cohesion: 0.18
Nodes (15): CATALOG_TAXONOMY, CatalogCategoryDefinition, CatalogSubcategoryDefinition, isCatalogCategoryPair(), normalizeCatalogCategory(), normalizeSignal(), CatalogCategoryMatch, CatalogPipelineContext (+7 more)

### Community 57 - "ImportPreviewStep.tsx"
Cohesion: 0.16
Nodes (23): ImportSaveSummary, createStyles(), formatPrice(), ImportedProductCard(), Props, createStyles(), ImportPreviewStep(), Metric() (+15 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "types/wardrobe.ts"
Cohesion: 0.15
Nodes (21): buildManualWardrobeInput(), hostname(), isPublicImageUrl(), ManualWardrobeItemErrors, optional(), draft, validateManualWardrobeItem(), buildWardrobeInput() (+13 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "wardrobeHistory.ts"
Cohesion: 0.16
Nodes (17): STYLING_WEIGHTS, average(), clamp(), daysSince(), EMPTY_WARDROBE_HISTORY, jaccard(), OutfitHistoryEntry, recordRecommendations() (+9 more)

### Community 64 - "seedCatalog.ts"
Cohesion: 0.16
Nodes (13): catalog, client, ensureDemoCatalogImageBucket(), options, report, requireLookup(), seedCatalog(), uploadDemoCatalogImages() (+5 more)

### Community 65 - "profileService.ts"
Cohesion: 0.12
Nodes (24): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+16 more)

### Community 66 - "CatalogProductDetailScreen.tsx"
Cohesion: 0.18
Nodes (16): CatalogPage, CatalogProductDetail, CatalogProductVariant, buildCatalogWardrobeInput(), createCatalogInstanceKey(), product, CatalogProductDetailScreen(), createStyles() (+8 more)

### Community 67 - "engine/index.ts"
Cohesion: 0.18
Nodes (18): COLOR_ALIASES, COLOR_FAMILIES, ColorFamily, normalizeColor(), normalizeToken(), capitalize(), formatRejection(), formatStylingDiagnostics() (+10 more)

### Community 68 - "navigation/types.ts"
Cohesion: 0.08
Nodes (54): createStyles(), ErrorBanner(), ErrorBannerProps, FormTextInput, FormTextInputProps, createStyles(), ScreenContainer(), ScreenContainerProps (+46 more)

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 70 - "data/catalog/types.ts"
Cohesion: 0.15
Nodes (12): BRAND_PROFILES, BrandProfile, CatalogImageSourceType, CatalogSourceType, CatalogValidationIssue, CatalogValidationReport, SyntheticBrand, SyntheticMaterial (+4 more)

### Community 71 - "persist.ts"
Cohesion: 0.18
Nodes (10): CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient, CatalogRestError, readMessage() (+2 more)

### Community 72 - "pipeline.ts"
Cohesion: 0.14
Nodes (12): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), InMemoryCatalogClient, processCatalogCandidates() (+4 more)

### Community 73 - "TabNavigators.tsx"
Cohesion: 0.11
Nodes (19): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), createStyles(), HomeProps, InspirationDetailContent(), InspirationDetailScreen(), AboutScreen(), HelpAndSupportScreen() (+11 more)

### Community 74 - "EditWardrobeItemScreen.tsx"
Cohesion: 0.11
Nodes (21): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField(), SelectFieldProps, createStyles(), EditFields (+13 more)

### Community 75 - "ActionButton.tsx"
Cohesion: 0.14
Nodes (16): ActionButton(), ActionButtonProps, createStyles(), createStyles(), DevelopmentQuickLogin(), DevelopmentQuickLoginProps, createStyles(), ImportCompleteStep() (+8 more)

### Community 76 - "Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?, Source Nodes

### Community 77 - "Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action., Source Nodes

### Community 78 - "Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake, Source Nodes

### Community 79 - "_shared/catalog/types.ts"
Cohesion: 0.12
Nodes (18): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CATALOG_ENRICHMENT_VERSION, CATALOG_NORMALIZATION_VERSION, CatalogGender, CatalogImageType, CatalogJobEntryState (+10 more)

### Community 80 - "Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation., Source Nodes

### Community 81 - "validateCatalog.ts"
Cohesion: 0.21
Nodes (11): CatalogCliOptions, parseCatalogCli(), readInteger(), readValue(), first, firstJson, generationOptions, options (+3 more)

### Community 82 - "Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state., Source Nodes

### Community 83 - "validator.ts"
Cohesion: 0.23
Nodes (11): catalog, hash, options, output, report, isDemoCatalogImageKey(), checkUnique(), countBy() (+3 more)

### Community 84 - "types/index.ts"
Cohesion: 0.26
Nodes (9): ClothingCategory, ClothingItem, OutfitScoreBreakdown, RejectedCandidate, RejectionReasonCode, StylingDiagnostics, StylingEngineResult, EMPTY_STYLE_PROFILE (+1 more)

### Community 85 - "ProfileScreen.tsx"
Cohesion: 0.11
Nodes (22): ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps, unavailableMetrics, createStyles(), DirectoryRow(), DirectoryStyles (+14 more)

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue., Source Nodes

### Community 88 - "stylistStore.ts"
Cohesion: 0.14
Nodes (24): cloneEmptyState(), EMPTY_STYLIST_USER_STATE, isCount(), isFeedbackState(), isRecord(), isSavedLook(), loadStylistUserState(), parseHistory() (+16 more)

### Community 89 - "Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?

### Community 91 - "Q: How to seed remote Supabase Project"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How to seed remote Supabase Project, Source Nodes

### Community 92 - "Q: Why did npm run catalog:seed fail with TypeError: fetch failed at seedCatalog.ts line 72?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why did npm run catalog:seed fail with TypeError: fetch failed at seedCatalog.ts line 72?, Source Nodes

### Community 93 - "Q: Why does catalog:seed still report TypeError fetch failed after Test-NetConnection to Supabase port 443 succeeds?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does catalog:seed still report TypeError fetch failed after Test-NetConnection to Supabase port 443 succeeds?, Source Nodes

### Community 94 - "Q: What should be tested after the Supabase health endpoint returns HTTP 401 No API key found?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: What should be tested after the Supabase health endpoint returns HTTP 401 No API key found?, Source Nodes

### Community 95 - "SearchResultsScreen.tsx"
Cohesion: 0.16
Nodes (17): createStyles(), IconButton(), IconButtonProps, createStyles(), InspirationCard(), InspirationCardProps, createStyles(), Props (+9 more)

### Community 96 - "getSupabaseClient"
Cohesion: 0.39
Nodes (6): environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), getSupabaseClient(), startSupabaseAutoRefresh()

### Community 97 - "Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius, Source Nodes

### Community 98 - "Q: How should the Double M startup loader integrate with the existing app?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should the Double M startup loader integrate with the existing app?, Source Nodes

### Community 99 - "StylistEditorial.tsx"
Cohesion: 0.15
Nodes (17): ChoiceGridProps, createStyles(), EditorialChoiceGrid(), HeaderProps, SectionHeadingProps, StylistEditorialHeader(), StylistEditorialSkeleton(), StylistNotice() (+9 more)

### Community 100 - "WardrobeScreen.tsx"
Cohesion: 0.17
Nodes (14): createStyles(), ImportPreviewSkeleton(), Props, createStyles(), Props, WardrobeEmptyState(), createStyles(), Props (+6 more)

### Community 101 - "Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found, Source Nodes

### Community 102 - "Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts, Source Nodes

### Community 104 - "Development synthetic catalogue"
Cohesion: 0.18
Nodes (10): Add or change a brand, Browse Brands and filtering, Change the seed or product count, Database structure, Development synthetic catalogue, Future real-data adapters, Generate and validate, Generator design (+2 more)

### Community 105 - "developmentQuickLogin.ts"
Cohesion: 0.60
Nodes (3): DevelopmentQuickLoginCredentials, getDevelopmentQuickLoginCredentials(), resolveDevelopmentQuickLoginCredentials()

### Community 106 - "BrowseBrandsScreen.tsx"
Cohesion: 0.21
Nodes (13): CatalogBrand, loadBrands(), loadFeaturedBrands(), mapBrowseBrand(), CatalogBrandRow(), createStyles(), formatStatus(), Props (+5 more)

### Community 107 - "WardrobeItemDetailScreen.tsx"
Cohesion: 0.21
Nodes (10): createStyles(), Props, WardrobeHeroImage(), productImageResizeMode(), formatWardrobePrice(), nikeRow, wardrobeDetailPresentation(), createStyles() (+2 more)

### Community 108 - "Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?, Source Nodes

### Community 109 - "preferenceModel.ts"
Cohesion: 0.18
Nodes (17): applyNeverRecommendFeedback(), applyOutfitFeedback(), FEEDBACK_DELTAS, StylingFeedbackAction, average(), clamp(), getItemSignals(), getOutfitPreferenceSignals() (+9 more)

### Community 110 - "normalizeClothingItem.ts"
Cohesion: 0.19
Nodes (18): CATEGORY_TERMS, normalizeCategory(), tokenize(), STYLE_INFERENCE_RULES, STYLE_RELATIONSHIPS, clean(), inferFit(), inferFormality() (+10 more)

### Community 111 - "catalogBrowseService.ts"
Cohesion: 0.26
Nodes (13): CatalogBrowseServiceError, loadBrandCategories(), loadBrandFilterOptions(), loadBrandProducts(), loadCatalogProduct(), mapFilterOptions(), mapSearchProduct(), normalizeCatalogBrowseError() (+5 more)

### Community 112 - "authService.ts"
Cohesion: 0.15
Nodes (14): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback, AuthStateChangeHandler, callAuth(), failure(), AuthCallbackKind (+6 more)

### Community 113 - "StateViews.tsx"
Cohesion: 0.20
Nodes (13): createStyles(), DeferredNotice(), EmptyState(), LoadingState(), MessageState(), MessageStateProps, SkeletonCard(), StateAction (+5 more)

### Community 115 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.16
Nodes (14): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFeedCard, ExploreMasonryFeed(), Props, CATEGORY_LABELS (+6 more)

### Community 118 - "wardrobeImportService.ts"
Cohesion: 0.32
Nodes (10): importWardrobeUrl(), isErrorCode(), isImportResponse(), logImportStage(), normalizeFunctionError(), readProperty(), readString(), { invoke } (+2 more)

### Community 119 - "CatalogBrandProgressCard.tsx"
Cohesion: 0.47
Nodes (5): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogBrandProgress

### Community 120 - "recommendationEngine.ts"
Cohesion: 0.11
Nodes (25): OCCASION_FORMALITY, OCCASION_RELATIONSHIPS, DEFAULT_MAX_CANDIDATES, DEFAULT_RECOMMENDATION_COUNT, buildVariations(), CandidateGeneratorOptions, candidatePriority(), createOutfit() (+17 more)

### Community 121 - "catalog/categories.ts"
Cohesion: 0.33
Nodes (5): apparelSizes, CATALOG_CATEGORIES, footwearSizes, oneSize, CatalogCategoryDefinition

### Community 122 - "Q: Can we add image to the demo catalog?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can we add image to the demo catalog?, Source Nodes

### Community 123 - "StylistScreen.tsx"
Cohesion: 0.12
Nodes (23): createStyles(), OutfitDisplayItem, OutfitImageComposition(), Props, Styles, createStyles(), FeedbackAction, Props (+15 more)

### Community 124 - "Q: why does it keep showing Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: why does it keep showing Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development?, Source Nodes

### Community 126 - "authErrors.ts"
Cohesion: 0.32
Nodes (10): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+2 more)

### Community 127 - "management-actions.ts"
Cohesion: 0.12
Nodes (30): CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty(), readString(), toNumberRecord() (+22 more)

### Community 129 - "getOutfitItems"
Cohesion: 0.13
Nodes (30): COLOR_WHEEL, NEUTRAL_COLORS, areOccasionsRelated(), FIT_COMPATIBILITY, areStylesRelated(), average(), colorCompatibility(), ColorRelationship (+22 more)

### Community 132 - "Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint, Source Nodes

### Community 133 - "Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign., Source Nodes

### Community 134 - "WardrobeToolbar.tsx"
Cohesion: 0.22
Nodes (8): createStyles(), Props, WardrobeLoadingSkeleton(), createStyles(), Props, ToolButtonProps, WardrobeToolbar(), WardrobeViewMode

### Community 135 - "AddWardrobeItemMenu.tsx"
Cohesion: 0.40
Nodes (4): AddWardrobeItemMenu(), createStyles(), MenuOptionProps, Props

### Community 136 - "HomeScreen.tsx"
Cohesion: 0.24
Nodes (8): createStyles(), HomeEditorialSkeleton(), HomeEditorialSkeletonProps, SkeletonStyles, createStyles(), HomeScreen(), Props, MainTabParamList

### Community 137 - "Q: Supabase seed fails with Unable to inspect demo image bucket: Bucket not found"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Supabase seed fails with Unable to inspect demo image bucket: Bucket not found, Source Nodes

### Community 138 - "utils/discovery.ts"
Cohesion: 0.36
Nodes (5): ExploreFilterCriteria, countSharedValues(), getRelatedExploreItems(), scoreExploreSimilarity(), selected

### Community 139 - "validate-url.ts"
Cohesion: 0.31
Nodes (12): resolvePublicDns(), BLOCKED_HOSTNAMES, isIpAddress(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4(), MAX_IMPORT_URL_LENGTH, parseIpv4() (+4 more)

### Community 140 - "BrandProductsScreen.tsx"
Cohesion: 0.21
Nodes (12): CatalogCategory, CatalogProductSummary, EMPTY_CATALOG_FILTERS, CatalogProductCard(), createStyles(), formatPrice(), Props, BrandProductsScreen() (+4 more)

### Community 141 - "Q: Can we add image to the demo catalog?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can we add image to the demo catalog?, Source Nodes

### Community 142 - "attributes.ts"
Cohesion: 0.40
Nodes (4): BODY_TYPE_TAGS_BY_FIT, COLORS, STOCK_STATUSES, STYLE_TAG_NAMES

### Community 143 - "pinned-fetch.test.ts"
Cohesion: 0.15
Nodes (5): concatenate(), decoder, encoder, FakeConnection, StallingConnection

### Community 144 - "wardrobeMetadata.ts"
Cohesion: 0.29
Nodes (11): displayProductName(), extractMaterialComposition(), inferOccasion(), inferSeason(), inferSubcategory(), knownBrandFromDomain(), MetadataInput, MetadataSource (+3 more)

### Community 145 - "fixtures.test.ts"
Cohesion: 0.21
Nodes (8): CategoryFixture, exploreStyles, styleCategories, quickStylingPrompts, stylingTips, neutralGarmentArtworkColors, WardrobeItemFixture, wardrobeItems

### Community 146 - "WardrobeItem"
Cohesion: 0.29
Nodes (9): draftFromWardrobeItem(), item, toWardrobeEditUpdate(), validateWardrobeEdit(), WardrobeEditDraft, createStyles(), EditForm(), MetadataValue (+1 more)

### Community 147 - "CatalogFilterPanel.tsx"
Cohesion: 0.29
Nodes (9): CatalogFilterOptions, CatalogProductFilters, CatalogFilterPanel(), createStyles(), FilterSection(), formatLabel(), parsePrice(), Props (+1 more)

### Community 148 - "OutfitCard.tsx"
Cohesion: 0.31
Nodes (6): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, outfitConcepts, OutfitFixture

### Community 149 - "OutfitPreferencesScreen.tsx"
Cohesion: 0.28
Nodes (7): createStyles(), formalityOptions, formalityScores, initialFormality(), OutfitPreferencesScreen(), PreferenceStyles, Props

### Community 150 - "AddItemEntryScreen.tsx"
Cohesion: 0.50
Nodes (4): AddItemEntryScreen(), createStyles(), inputOptions, Props

### Community 151 - "Chip.tsx"
Cohesion: 0.67
Nodes (3): Chip(), ChipProps, createStyles()

### Community 152 - "SearchBar.tsx"
Cohesion: 0.67
Nodes (3): createStyles(), SearchBar(), SearchBarProps

## Knowledge Gaps
- **681 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+676 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `seedCatalog.ts` (8× useful, score=7.358446653)
- `ExploreScreen.tsx` (5× useful, score=3.198878279)
- `client` (4× useful, score=3.646203255)
- `TabNavigators.tsx` (4× useful, score=2.82622903) _(code changed — re-verify)_
- `environment` (3× useful, score=2.756644071)
- `Migration` (3× useful, score=2.734678246)
- `navigation/types.ts` (3× useful, score=2.209728286) _(code changed — re-verify)_
- `ExploreMasonryFeed.tsx` (3× useful, score=1.893107343)
- `catalogBrowseService.ts` (2× useful, score=1.83932593)
- `seedCatalog()` (2× useful, score=1.823558113)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `MainAppNavigator.tsx`, `theme/index.ts`, `WardrobeToolbar.tsx`, `AppScreen.tsx`, `ExploreScreen.tsx`, `EditorialPrimitives.tsx`, `HomeScreen.tsx`, `OutfitResultScreen.tsx`, `AddWardrobeItemMenu.tsx`, `BrandProductsScreen.tsx`, `WardrobeItem`, `CatalogFilterPanel.tsx`, `startupProgress.ts`, `OutfitCard.tsx`, `BodyProfileScreen.tsx`, `Chip.tsx`, `SearchBar.tsx`, `PlaceholderArtwork.tsx`, `OutfitPreferencesScreen.tsx`, `AddItemEntryScreen.tsx`, `ImportUrlInputStep.tsx`, `ImportPreviewStep.tsx`, `CatalogProductDetailScreen.tsx`, `navigation/types.ts`, `TabNavigators.tsx`, `EditWardrobeItemScreen.tsx`, `ActionButton.tsx`, `ProfileScreen.tsx`, `SearchResultsScreen.tsx`, `StylistEditorial.tsx`, `WardrobeScreen.tsx`, `BrowseBrandsScreen.tsx`, `WardrobeItemDetailScreen.tsx`, `StateViews.tsx`, `ExploreOutfitDetailScreen.tsx`, `CatalogBrandProgressCard.tsx`, `StylistScreen.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `useAppTheme` to `MainAppNavigator.tsx`, `theme/index.ts`, `WardrobeToolbar.tsx`, `AppScreen.tsx`, `ExploreScreen.tsx`, `EditorialPrimitives.tsx`, `HomeScreen.tsx`, `OutfitResultScreen.tsx`, `AddWardrobeItemMenu.tsx`, `BrandProductsScreen.tsx`, `CatalogFilterPanel.tsx`, `OutfitCard.tsx`, `OutfitPreferencesScreen.tsx`, `BodyProfileScreen.tsx`, `Chip.tsx`, `SearchBar.tsx`, `PlaceholderArtwork.tsx`, `AddItemEntryScreen.tsx`, `ImportUrlInputStep.tsx`, `ImportPreviewStep.tsx`, `CatalogProductDetailScreen.tsx`, `navigation/types.ts`, `TabNavigators.tsx`, `EditWardrobeItemScreen.tsx`, `ActionButton.tsx`, `ProfileScreen.tsx`, `SearchResultsScreen.tsx`, `StylistEditorial.tsx`, `WardrobeScreen.tsx`, `BrowseBrandsScreen.tsx`, `WardrobeItemDetailScreen.tsx`, `StateViews.tsx`, `ExploreOutfitDetailScreen.tsx`, `CatalogBrandProgressCard.tsx`, `StylistScreen.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `getOutfitItems()` connect `getOutfitItems` to `OutfitResultScreen.tsx`, `preferenceModel.ts`, `types/index.ts`, `recommendationEngine.ts`, `StylistScreen.tsx`, `wardrobeHistory.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _681 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MainAppNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `wardrobe-import/types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06479081821547575 - nodes in this community are weakly interconnected._