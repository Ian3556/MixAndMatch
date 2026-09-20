# Graph Report - MixAndMatch  (2026-09-19)

## Corpus Check
- 371 files · ~1,201,647 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2167 nodes · 5315 edges · 143 communities (126 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `392cd6ec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuthStore
- routes.ts
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- html-parsers.ts
- devDependencies
- dependencies
- TabNavigators.tsx
- types/discovery.ts
- EditorialPrimitives.tsx
- StylistScreen.tsx
- wardrobeService.ts
- catalogDatabase.ts
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStore.ts
- expo
- fetch-page.ts
- catalog-management/index.ts
- compilerOptions
- startupProgress.ts
- generator.ts
- BodyProfileScreen.tsx
- Mix & Match catalogue database audit
- authState.test.ts
- wardrobeImportService.ts
- normalize.ts
- AppTheme
- management-actions.ts
- wardrobe-import/types.ts
- .prettierrc.json
- graphify reference: extra exports and benchmark
- CatalogProductDetailScreen.tsx
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
- ImportPreviewStep.tsx
- Mix & Match catalogue database
- Q: Update Explore into a Pinterest-style fashion feed with functional search and filters, then reorder the bottom navigation to Home, Explore, Stylist, Wardrobe, Profile.
- Q: Understand this Maximum update depth exceeded error from Expo setupHMR and React Native Web Image.
- enrich.ts
- Phase 2: UI Structuring
- Mix & Match
- scripts
- validate.ts
- @expo/vector-icons
- ImportWardrobeWebsiteScreen.tsx
- README.md
- package.json
- Phase 1 architecture
- WardrobeItemDetailScreen.tsx
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- scoringEngine.ts
- seedCatalog.ts
- profileService.ts
- catalogBrowseService.ts
- engine/index.ts
- getSupabaseClient
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- data/catalog/types.ts
- persist.ts
- pipeline.ts
- authErrors.ts
- validate-url.ts
- BrandProductsScreen.tsx
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- _shared/catalog/types.ts
- Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation.
- validateCatalog.ts
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- validator.ts
- types/index.ts
- RootNavigator.tsx
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue.
- stylistStore.ts
- Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?
- react-native-url-polyfill
- Q: How to seed remote Supabase Project
- Q: Why did npm run catalog:seed fail with TypeError: fetch failed at seedCatalog.ts line 72?
- Q: Why does catalog:seed still report TypeError fetch failed after Test-NetConnection to Supabase port 443 succeeds?
- Q: What should be tested after the Supabase health endpoint returns HTTP 401 No API key found?
- WardrobeScreen.tsx
- supabase/index.ts
- Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius
- Q: How should the Double M startup loader integrate with the existing app?
- useAppTheme
- OutfitCard.tsx
- Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found
- Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts
- expo-splash-screen
- Development synthetic catalogue
- developmentQuickLogin.ts
- AddWardrobeItemMenu.tsx
- wardrobeStore.ts
- Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?
- preferenceModel.ts
- normalizeClothingItem.ts
- CatalogFilterPanel.tsx
- authService.ts
- colorEngine.ts
- module-resolution.test.ts
- ExploreScreen.tsx
- deno-runtime.d.ts
- react-native
- normalize-product.ts
- editorial.ts
- recommendationEngine.ts
- catalog/categories.ts
- json-ld.ts
- getOutfitItems
- OutfitPreferencesScreen.tsx
- react-dom
- manualWardrobeItem.ts
- CatalogDevelopmentScreen.tsx
- @react-native-async-storage/async-storage
- authCallback.ts
- react-native-screens
- @react-navigation/native
- Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint
- Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign.
- types/wardrobe.ts
- generic-structured-data.ts
- wardrobeNormalization.ts
- ExploreOutfitDetailScreen.tsx
- utils/discovery.ts
- CatalogBrandRow.tsx
- HomeEditorialSkeleton.tsx
- Q: Can we add image to the demo catalog?
- attributes.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 213 edges
2. `AppTheme` - 94 edges
3. `useAuthStore` - 45 edges
4. `ActionButton()` - 41 edges
5. `AppScreen()` - 40 edges
6. `getOutfitItems()` - 38 edges
7. `getSupabaseClient()` - 21 edges
8. `normalizeCatalogProduct()` - 20 edges
9. `normalizeClothingItem()` - 18 edges
10. `getGridColumnCount()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `loadBrands()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogBrowseService.ts → supabase/client.ts
- `searchCatalogProducts()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogBrowseService.ts → supabase/client.ts
- `loadBrandCategories()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogBrowseService.ts → supabase/client.ts
- `loadBrandFilterOptions()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogBrowseService.ts → supabase/client.ts
- `loadCatalogProduct()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogBrowseService.ts → supabase/client.ts

## Import Cycles
- None detected.

## Communities (143 total, 17 thin omitted)

### Community 0 - "useAuthStore"
Cohesion: 0.10
Nodes (47): ActionButton(), ActionButtonProps, createStyles(), createStyles(), ErrorBanner(), ErrorBannerProps, FormTextInput, FormTextInputProps (+39 more)

### Community 1 - "routes.ts"
Cohesion: 0.10
Nodes (29): createStyles(), FloatingTabBar(), VisibleFloatingTabBar(), roots, sourceFiles, MainAppNavigator(), Tabs, getTabConfig() (+21 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.17
Nodes (16): darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing, darkTheme, lightTheme (+8 more)

### Community 4 - "html-parsers.ts"
Cohesion: 0.21
Nodes (17): extractProductsFromHtml(), fixtureDirectory, AnchorRecord, compact(), extractGenericHtmlProducts(), extractOpenGraphProduct(), extractPlatformProducts(), isDecorative() (+9 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.08
Nodes (25): expo, expo-clipboard, expo-dev-client, expo-linking, dependencies, expo, expo-clipboard, expo-dev-client (+17 more)

### Community 7 - "TabNavigators.tsx"
Cohesion: 0.09
Nodes (38): AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup() (+30 more)

### Community 8 - "types/discovery.ts"
Cohesion: 0.20
Nodes (12): createStyles(), ExploreFilterPanel(), FilterSection(), Props, exploreDiscoveryContent, ExploreDiscoveryState, getExploreDiscoveryContent(), EXPLORE_CATEGORY_OPTIONS (+4 more)

### Community 9 - "EditorialPrimitives.tsx"
Cohesion: 0.12
Nodes (24): DetailImage(), resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps, EditorialImage() (+16 more)

### Community 10 - "StylistScreen.tsx"
Cohesion: 0.09
Nodes (41): EmptyState(), ErrorState(), ChoiceGridProps, createStyles(), EditorialChoiceGrid(), HeaderProps, SectionHeadingProps, StylistEditorialHeader() (+33 more)

### Community 11 - "wardrobeService.ts"
Cohesion: 0.13
Nodes (14): LegacyWardrobeRow, asMetadata(), mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty(), row, toWardrobeInsert() (+6 more)

### Community 12 - "catalogDatabase.ts"
Cohesion: 0.11
Nodes (22): CatalogCategory, CatalogPage, EMPTY_CATALOG_FILTERS, CatalogBrandProgress, CatalogImportError, CatalogOverview, CatalogRecentJob, CatalogBrandCategoryRow (+14 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStore.ts"
Cohesion: 0.16
Nodes (29): markStartupComplete(), markStartupStep(), AuthService, createAuthService(), isEmailVerified(), createProfileService(), createSupabaseProfileGateway(), AccountActions (+21 more)

### Community 16 - "expo"
Cohesion: 0.06
Nodes (30): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, icon, package, projectId, tsconfigPaths (+22 more)

### Community 17 - "fetch-page.ts"
Cohesion: 0.22
Nodes (12): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+4 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (47): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+39 more)

### Community 19 - "compilerOptions"
Cohesion: 0.09
Nodes (22): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, supabase/functions/_shared/deno-runtime.d.ts, ./supabase/index.ts (+14 more)

### Community 20 - "startupProgress.ts"
Cohesion: 0.09
Nodes (32): calculateDoubleMFillBounds(), DOUBLE_M_BOTTOM, DOUBLE_M_PATHS, DOUBLE_M_TOP, DOUBLE_M_VIEWBOX_SIZE, DoubleMLoader(), DoubleMLoaderProps, DoubleMLogo() (+24 more)

### Community 21 - "generator.ts"
Cohesion: 0.17
Nodes (24): CATALOG_BRANDS, CATALOG_SEED, DEFAULT_PRODUCT_COUNT, SYNTHETIC_CATALOG_TIMESTAMP, SYNTHETIC_SOURCE_DOMAIN, CATEGORIES_BY_SLUG, allocateMaterials(), buildProduct() (+16 more)

### Community 22 - "BodyProfileScreen.tsx"
Cohesion: 0.09
Nodes (37): createStyles(), PreferenceChoiceGroup(), PreferenceChoiceGroupProps, togglePreference(), ArrayPreferenceKey, createStyles(), PreferenceSelectionScreen(), PreferenceSelectionScreenProps (+29 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "authState.test.ts"
Cohesion: 0.29
Nodes (7): AuthSnapshot, createSignedOutSnapshot(), authenticatedSnapshot(), incompleteProfile, session, user, Profile

### Community 25 - "wardrobeImportService.ts"
Cohesion: 0.24
Nodes (10): importWardrobeUrl(), isErrorCode(), isImportResponse(), logImportStage(), normalizeFunctionError(), readProperty(), readString(), { invoke } (+2 more)

### Community 26 - "normalize.ts"
Cohesion: 0.15
Nodes (26): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+18 more)

### Community 27 - "AppTheme"
Cohesion: 0.11
Nodes (22): CatalogReviewEditModal(), createStyles(), Props, createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField() (+14 more)

### Community 28 - "management-actions.ts"
Cohesion: 0.22
Nodes (18): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), CatalogManagementRequestError, CatalogProductEditPatch, compact() (+10 more)

### Community 29 - "wardrobe-import/types.ts"
Cohesion: 0.19
Nodes (8): corsHeaders, errorResponse(), jsonResponse(), rateWindows, MAX_IMPORTED_PRODUCTS, RawProductCandidate, WardrobeImportErrorResponse, WardrobeImportResponse

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "CatalogProductDetailScreen.tsx"
Cohesion: 0.27
Nodes (11): CatalogProductDetail, CatalogProductVariant, buildCatalogWardrobeInput(), createCatalogInstanceKey(), product, CatalogProductDetailScreen(), createStyles(), formatPrice() (+3 more)

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

### Community 47 - "ImportPreviewStep.tsx"
Cohesion: 0.12
Nodes (21): createStyles(), ImportCompleteStep(), ImportSaveSummary, Props, createStyles(), formatPrice(), ImportedProductCard(), Props (+13 more)

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
Cohesion: 0.17
Nodes (16): normalizeSlug(), CATALOG_TAXONOMY, CatalogCategoryDefinition, CatalogSubcategoryDefinition, isCatalogCategoryPair(), normalizeCatalogCategory(), normalizeSignal(), CatalogCategoryMatch (+8 more)

### Community 57 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.24
Nodes (16): createStyles(), ImportPreviewStep(), applySaveResults(), buildWardrobeInputs(), createImportDeduplicationKey(), createImportPreview(), setAllSelected(), summarizeSaveResults() (+8 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "WardrobeItemDetailScreen.tsx"
Cohesion: 0.11
Nodes (26): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, createStyles(), DeferredNotice(), LoadingState(), MessageState(), MessageStateProps (+18 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "scoringEngine.ts"
Cohesion: 0.11
Nodes (27): FIT_COMPATIBILITY, STYLING_WEIGHTS, roundScore(), scoreOutfit(), ScoringContext, scoreFitPair(), silhouetteCompatibility(), average() (+19 more)

### Community 64 - "seedCatalog.ts"
Cohesion: 0.16
Nodes (13): catalog, client, ensureDemoCatalogImageBucket(), options, report, requireLookup(), seedCatalog(), uploadDemoCatalogImages() (+5 more)

### Community 65 - "profileService.ts"
Cohesion: 0.10
Nodes (29): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+21 more)

### Community 66 - "catalogBrowseService.ts"
Cohesion: 0.14
Nodes (23): CatalogBrowseServiceError, loadBrandCategories(), loadBrandFilterOptions(), loadBrandProducts(), loadBrands(), loadCatalogProduct(), loadFeaturedBrands(), mapBrowseBrand() (+15 more)

### Community 67 - "engine/index.ts"
Cohesion: 0.21
Nodes (16): COLOR_FAMILIES, normalizeColor(), normalizeToken(), capitalize(), formatRejection(), formatStylingDiagnostics(), isText(), normalizeStyleProfile() (+8 more)

### Community 68 - "getSupabaseClient"
Cohesion: 0.23
Nodes (13): CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty(), readString(), toNumberRecord() (+5 more)

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 70 - "data/catalog/types.ts"
Cohesion: 0.15
Nodes (12): BRAND_PROFILES, BrandProfile, CatalogImageSourceType, CatalogSourceType, CatalogValidationIssue, CatalogValidationReport, SyntheticBrand, SyntheticMaterial (+4 more)

### Community 71 - "persist.ts"
Cohesion: 0.16
Nodes (12): loadCategories(), loadPersistenceLookup(), CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient (+4 more)

### Community 72 - "pipeline.ts"
Cohesion: 0.15
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), InMemoryCatalogClient, processCatalogCandidates() (+3 more)

### Community 73 - "authErrors.ts"
Cohesion: 0.27
Nodes (11): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+3 more)

### Community 74 - "validate-url.ts"
Cohesion: 0.29
Nodes (11): resolvePublicDns(), BLOCKED_HOSTNAMES, failure(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4(), MAX_IMPORT_URL_LENGTH, parseIpv4() (+3 more)

### Community 75 - "BrandProductsScreen.tsx"
Cohesion: 0.13
Nodes (19): CatalogProductSummary, createStyles(), SearchBar(), SearchBarProps, CatalogProductCard(), createStyles(), formatPrice(), Props (+11 more)

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
Cohesion: 0.15
Nodes (14): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CATALOG_ENRICHMENT_VERSION, CatalogGender, CatalogImageType, CatalogJobEntryState, CatalogPipelineBatch (+6 more)

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
Cohesion: 0.16
Nodes (17): areOccasionsRelated(), OCCASION_FORMALITY, OCCASION_RELATIONSHIPS, ConstraintResult, average(), occasionCompatibility(), ClothingCategory, ClothingItem (+9 more)

### Community 85 - "RootNavigator.tsx"
Cohesion: 0.15
Nodes (12): AppNavigation(), AppRoot(), AuthNavigator(), OnboardingNavigator(), Stack, RootNavigator(), Stack, ONBOARDING_ROUTES (+4 more)

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue., Source Nodes

### Community 88 - "stylistStore.ts"
Cohesion: 0.14
Nodes (23): cloneEmptyState(), EMPTY_STYLIST_USER_STATE, isCount(), isFeedbackState(), isRecord(), isSavedLook(), loadStylistUserState(), parseHistory() (+15 more)

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

### Community 95 - "WardrobeScreen.tsx"
Cohesion: 0.12
Nodes (26): createStyles(), IconButton(), IconButtonProps, createStyles(), InspirationCard(), InspirationCardProps, createStyles(), Props (+18 more)

### Community 96 - "supabase/index.ts"
Cohesion: 0.29
Nodes (7): environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), AuthBootstrap(), beginStartupProgress(), startSupabaseAutoRefresh()

### Community 97 - "Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius, Source Nodes

### Community 98 - "Q: How should the Double M startup loader integrate with the existing app?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should the Double M startup loader integrate with the existing app?, Source Nodes

### Community 99 - "useAppTheme"
Cohesion: 0.07
Nodes (42): AppHeader(), AppHeaderProps, createStyles(), Avatar(), Badge(), createStyles(), StatCard(), ActivitySummary() (+34 more)

### Community 100 - "OutfitCard.tsx"
Cohesion: 0.15
Nodes (13): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, CategoryFixture, exploreStyles, styleCategories, wardrobeCategories (+5 more)

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

### Community 106 - "AddWardrobeItemMenu.tsx"
Cohesion: 0.40
Nodes (4): AddWardrobeItemMenu(), createStyles(), MenuOptionProps, Props

### Community 107 - "wardrobeStore.ts"
Cohesion: 0.17
Nodes (12): createStyles(), Props, ToolButtonProps, WardrobeToolbar(), createSupabaseWardrobeGateway(), createWardrobeService(), WardrobeService, getService() (+4 more)

### Community 108 - "Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?, Source Nodes

### Community 109 - "preferenceModel.ts"
Cohesion: 0.18
Nodes (17): applyNeverRecommendFeedback(), applyOutfitFeedback(), FEEDBACK_DELTAS, StylingFeedbackAction, average(), clamp(), getItemSignals(), getOutfitPreferenceSignals() (+9 more)

### Community 110 - "normalizeClothingItem.ts"
Cohesion: 0.15
Nodes (21): CATEGORY_TERMS, normalizeCategory(), tokenize(), areStylesRelated(), STYLE_INFERENCE_RULES, STYLE_RELATIONSHIPS, clean(), inferFit() (+13 more)

### Community 111 - "CatalogFilterPanel.tsx"
Cohesion: 0.29
Nodes (9): CatalogFilterOptions, CatalogProductFilters, CatalogFilterPanel(), createStyles(), FilterSection(), formatLabel(), parsePrice(), Props (+1 more)

### Community 112 - "authService.ts"
Cohesion: 0.15
Nodes (15): AuthStateChangeHandler, callAuth(), failure(), AuthFlow, AuthStateError, ProfileLoadStatus, AuthCallbackKind, AuthCallbackResult (+7 more)

### Community 113 - "colorEngine.ts"
Cohesion: 0.24
Nodes (14): COLOR_ALIASES, COLOR_WHEEL, ColorFamily, NEUTRAL_COLORS, average(), colorCompatibility(), ColorRelationship, describeColorRelationship() (+6 more)

### Community 115 - "ExploreScreen.tsx"
Cohesion: 0.18
Nodes (13): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFeedCard, ExploreMasonryFeed(), Props, createStyles() (+5 more)

### Community 118 - "normalize-product.ts"
Cohesion: 0.33
Nodes (12): cleanText(), assignText(), deduplicateProducts(), normalizeCategory(), normalizeImageUrl(), normalizeProduct(), normalizeProducts(), normalizeUrl() (+4 more)

### Community 119 - "editorial.ts"
Cohesion: 0.21
Nodes (11): editorialAssets, homeEditorialContent, HomeEditorialState, useHomeEditorialContent(), getHomeEditorialContent(), EDITORIAL_IMAGE_KEYS, EditorialImageKey, EditorialImageSource (+3 more)

### Community 120 - "recommendationEngine.ts"
Cohesion: 0.13
Nodes (21): DEFAULT_MAX_CANDIDATES, DEFAULT_RECOMMENDATION_COUNT, buildVariations(), CandidateGeneratorOptions, candidatePriority(), createOutfit(), EMPTY_BREAKDOWN, generateOutfitCandidates() (+13 more)

### Community 121 - "catalog/categories.ts"
Cohesion: 0.33
Nodes (5): apparelSizes, CATALOG_CATEGORIES, footwearSizes, oneSize, CatalogCategoryDefinition

### Community 122 - "json-ld.ts"
Cohesion: 0.44
Nodes (9): collectProducts(), compact(), firstRecord(), isRecord(), JsonRecord, mapProduct(), normalizeTypes(), readImage() (+1 more)

### Community 123 - "getOutfitItems"
Cohesion: 0.12
Nodes (23): createStyles(), OutfitDisplayItem, OutfitImageComposition(), Props, Styles, createStyles(), FeedbackAction, Props (+15 more)

### Community 124 - "OutfitPreferencesScreen.tsx"
Cohesion: 0.21
Nodes (10): Chip(), ChipProps, createStyles(), createStyles(), formalityOptions, formalityScores, initialFormality(), OutfitPreferencesScreen() (+2 more)

### Community 126 - "manualWardrobeItem.ts"
Cohesion: 0.21
Nodes (13): buildManualWardrobeInput(), createManualDeduplicationKey(), hostname(), isPublicImageUrl(), ManualWardrobeItemErrors, optional(), draft, validateManualWardrobeItem() (+5 more)

### Community 127 - "CatalogDevelopmentScreen.tsx"
Cohesion: 0.09
Nodes (27): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogImportControls(), createStyles(), Props, CatalogJobCard() (+19 more)

### Community 129 - "authCallback.ts"
Cohesion: 0.53
Nodes (4): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback

### Community 132 - "Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint, Source Nodes

### Community 133 - "Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign., Source Nodes

### Community 134 - "types/wardrobe.ts"
Cohesion: 0.21
Nodes (10): createStyles(), WardrobeItemCard(), WardrobeItemCardProps, createStyles(), Props, WardrobeListItem(), ClothingSource, ManualWardrobeItemPrefill (+2 more)

### Community 135 - "generic-structured-data.ts"
Cohesion: 0.22
Nodes (7): EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CatalogExtractionMethod, CatalogImporterAdapter, CatalogImportSource, ExtractionMethod

### Community 136 - "wardrobeNormalization.ts"
Cohesion: 0.38
Nodes (7): isString(), normalizeClothingItem(), normalizeCurrency(), normalizePrice(), nullable(), uniqueStrings(), WardrobeNormalizationError

### Community 137 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.31
Nodes (6): useExploreDiscoveryContent(), CATEGORY_LABELS, createStyles(), ExploreDetailSkeleton(), ExploreOutfitDetailScreen(), Props

### Community 138 - "utils/discovery.ts"
Cohesion: 0.36
Nodes (5): ExploreFilterCriteria, countSharedValues(), getRelatedExploreItems(), scoreExploreSimilarity(), selected

### Community 139 - "CatalogBrandRow.tsx"
Cohesion: 0.47
Nodes (5): CatalogBrand, CatalogBrandRow(), createStyles(), formatStatus(), Props

### Community 140 - "HomeEditorialSkeleton.tsx"
Cohesion: 0.40
Nodes (4): createStyles(), HomeEditorialSkeleton(), HomeEditorialSkeletonProps, SkeletonStyles

### Community 141 - "Q: Can we add image to the demo catalog?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can we add image to the demo catalog?, Source Nodes

### Community 142 - "attributes.ts"
Cohesion: 0.40
Nodes (4): BODY_TYPE_TAGS_BY_FIT, COLORS, STOCK_STATUSES, STYLE_TAG_NAMES

## Knowledge Gaps
- **659 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+654 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `seedCatalog.ts` (6× useful, score=5.884154643) _(code changed — re-verify)_
- `ExploreScreen.tsx` (5× useful, score=3.427791733)
- `client` (4× useful, score=3.907127525) _(code changed — re-verify)_
- `TabNavigators.tsx` (4× useful, score=3.028475503)
- `Migration` (3× useful, score=2.930373295)
- `navigation/types.ts` (3× useful, score=2.367857633)
- `ExploreMasonryFeed.tsx` (3× useful, score=2.028579125)
- `catalogBrowseService.ts` (2× useful, score=1.970949084)
- `seedCatalog()` (2× useful, score=1.954052914) _(code changed — re-verify)_
- `environment` (2× useful, score=1.953541732)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `useAuthStore`, `routes.ts`, `theme/index.ts`, `types/wardrobe.ts`, `TabNavigators.tsx`, `types/discovery.ts`, `ExploreOutfitDetailScreen.tsx`, `EditorialPrimitives.tsx`, `StylistScreen.tsx`, `HomeEditorialSkeleton.tsx`, `CatalogBrandRow.tsx`, `BodyProfileScreen.tsx`, `AppTheme`, `CatalogProductDetailScreen.tsx`, `ImportPreviewStep.tsx`, `ImportWardrobeWebsiteScreen.tsx`, `WardrobeItemDetailScreen.tsx`, `catalogBrowseService.ts`, `BrandProductsScreen.tsx`, `RootNavigator.tsx`, `WardrobeScreen.tsx`, `OutfitCard.tsx`, `AddWardrobeItemMenu.tsx`, `wardrobeStore.ts`, `CatalogFilterPanel.tsx`, `ExploreScreen.tsx`, `getOutfitItems`, `OutfitPreferencesScreen.tsx`, `manualWardrobeItem.ts`, `CatalogDevelopmentScreen.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `useAuthStore`, `routes.ts`, `theme/index.ts`, `types/wardrobe.ts`, `TabNavigators.tsx`, `types/discovery.ts`, `ExploreOutfitDetailScreen.tsx`, `EditorialPrimitives.tsx`, `StylistScreen.tsx`, `HomeEditorialSkeleton.tsx`, `CatalogBrandRow.tsx`, `BodyProfileScreen.tsx`, `CatalogProductDetailScreen.tsx`, `ImportPreviewStep.tsx`, `WardrobeItemDetailScreen.tsx`, `BrandProductsScreen.tsx`, `WardrobeScreen.tsx`, `useAppTheme`, `OutfitCard.tsx`, `AddWardrobeItemMenu.tsx`, `wardrobeStore.ts`, `CatalogFilterPanel.tsx`, `ExploreScreen.tsx`, `getOutfitItems`, `OutfitPreferencesScreen.tsx`, `CatalogDevelopmentScreen.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `getOutfitItems()` connect `getOutfitItems` to `StylistScreen.tsx`, `preferenceModel.ts`, `normalizeClothingItem.ts`, `colorEngine.ts`, `types/index.ts`, `recommendationEngine.ts`, `scoringEngine.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _659 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.09970238095238096 - nodes in this community are weakly interconnected._
- **Should `routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0953058321479374 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._