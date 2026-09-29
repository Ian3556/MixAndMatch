# Graph Report - MixAndMatch  (2026-09-28)

## Corpus Check
- 404 files · ~1,212,646 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2327 nodes · 5754 edges · 151 communities (134 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ab922f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes.ts
- TabNavigators.tsx
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- wardrobe-import/types.ts
- devDependencies
- dependencies
- navigation/types.ts
- types/discovery.ts
- EditorialPrimitives.tsx
- StylistScreen.tsx
- wardrobeService.ts
- catalogDatabase.ts
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- import-wardrobe-url/index.ts
- catalog-management/index.ts
- compilerOptions
- RootNavigator.tsx
- generator.ts
- BodyProfileScreen.tsx
- Mix & Match catalogue database audit
- authStore.ts
- src/catalog/types.ts
- _shared/catalog/types.ts
- colorEngine.ts
- pinned-fetch.ts
- fetch-page.ts
- .prettierrc.json
- graphify reference: extra exports and benchmark
- AppTheme
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
- AddItemDetailsScreen.tsx
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- scoringEngine.ts
- seedCatalog.ts
- profileService.ts
- CatalogProductDetailScreen.tsx
- recommendationEngine.ts
- useAuthStore
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- data/catalog/types.ts
- persist.ts
- generic-structured-data.ts
- developmentQuickLogin.ts
- SelectField.tsx
- editorial.ts
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- pipeline.ts
- Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation.
- validateCatalog.ts
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- validator.ts
- ExploreScreen.tsx
- useAppTheme
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue.
- stylistStore.ts
- Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?
- react-native-url-polyfill
- Q: How to seed remote Supabase Project
- Q: Why did npm run catalog:seed fail with TypeError: fetch failed at seedCatalog.ts line 72?
- Q: Why does catalog:seed still report TypeError fetch failed after Test-NetConnection to Supabase port 443 succeeds?
- Q: What should be tested after the Supabase health endpoint returns HTTP 401 No API key found?
- html-parsers.ts
- getSupabaseClient
- Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius
- Q: How should the Double M startup loader integrate with the existing app?
- normalize-product.ts
- PlaceholderArtwork.tsx
- Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found
- Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts
- InspirationDetailContent.tsx
- Development synthetic catalogue
- wardrobeNormalization.ts
- browseTypes.ts
- WardrobeHeroImage.tsx
- Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?
- preferenceModel.ts
- normalizeClothingItem.ts
- catalogBrowseService.ts
- authService.ts
- wardrobeStore.ts
- module-resolution.test.ts
- WardrobeScreen.tsx
- deno-runtime.d.ts
- react-native
- wardrobeImportService.ts
- fixtures.test.ts
- types/index.ts
- catalog/categories.ts
- Q: Can we add image to the demo catalog?
- getOutfitItems
- Q: why does it keep showing Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development?
- react-dom
- candidateGenerator.ts
- management-actions.ts
- @react-native-async-storage/async-storage
- styleCompatibilityEngine.ts
- react-native-screens
- @react-navigation/native
- Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint
- Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign.
- First outfit and saved inspiration
- authCallback.ts
- Q: Redesign Wardrobe Clothes Details, fix missing metadata, and implement Edit for the Nike item
- Q: Supabase seed fails with Unable to inspect demo image bucket: Bucket not found
- AddWardrobeItemMenu.tsx
- validate-url.ts
- Q: Can we add image to the demo catalog?
- attributes.ts
- pinned-fetch.test.ts
- wardrobeMetadata.ts
- EditWardrobeItemScreen.tsx
- BrandProductsScreen.tsx
- StateViews.tsx
- HomeEditorialSkeleton.tsx
- job-state.ts
- ActionButton.tsx
- expo-splash-screen

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 223 edges
2. `AppTheme` - 95 edges
3. `useAuthStore` - 51 edges
4. `ActionButton()` - 46 edges
5. `AppScreen()` - 41 edges
6. `getOutfitItems()` - 41 edges
7. `getSupabaseClient()` - 22 edges
8. `getGridColumnCount()` - 20 edges
9. `normalizeCatalogProduct()` - 20 edges
10. `useWardrobeStore` - 19 edges

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

## Communities (151 total, 17 thin omitted)

### Community 0 - "routes.ts"
Cohesion: 0.08
Nodes (34): HomeProps, createStyles(), FloatingTabBar(), VisibleFloatingTabBar(), roots, sourceFiles, MainAppNavigator(), Tabs (+26 more)

### Community 1 - "TabNavigators.tsx"
Cohesion: 0.09
Nodes (24): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), ExploreOutfitDetailScreen(), SavedInspirationsScreen(), InspirationDetailScreen(), AboutScreen(), AppearanceSettingsScreen(), HelpAndSupportScreen() (+16 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.17
Nodes (16): darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing, darkTheme, lightTheme (+8 more)

### Community 4 - "wardrobe-import/types.ts"
Cohesion: 0.16
Nodes (20): extractProductsFromHtml(), fixtureDirectory, collectProducts(), compact(), extractJsonLdProducts(), firstRecord(), isRecord(), JsonRecord (+12 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.08
Nodes (25): expo, expo-clipboard, expo-dev-client, expo-linking, dependencies, expo, expo-clipboard, expo-dev-client (+17 more)

### Community 7 - "navigation/types.ts"
Cohesion: 0.14
Nodes (23): AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup() (+15 more)

### Community 8 - "types/discovery.ts"
Cohesion: 0.22
Nodes (11): exploreDiscoveryContent, ExploreDiscoveryState, getExploreDiscoveryContent(), EXPLORE_CATEGORY_OPTIONS, EXPLORE_STYLE_OPTIONS, ExploreDiscoveryItem, ExploreFilterCriteria, countSharedValues() (+3 more)

### Community 9 - "EditorialPrimitives.tsx"
Cohesion: 0.13
Nodes (22): DetailImage(), resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps, EditorialImage() (+14 more)

### Community 10 - "StylistScreen.tsx"
Cohesion: 0.07
Nodes (52): EmptyState(), ErrorState(), PreferredStylesScreen(), Props, preferredStyleOptions, FirstOutfitGuide(), ChoiceGridProps, createStyles() (+44 more)

### Community 11 - "wardrobeService.ts"
Cohesion: 0.11
Nodes (17): storage, wardrobeService(), nikeRow, LegacyWardrobeRow, asMetadata(), createWardrobeService(), mapWardrobeRow(), normalizeWardrobeError() (+9 more)

### Community 12 - "catalogDatabase.ts"
Cohesion: 0.10
Nodes (20): CatalogBrandCategoryRow, CatalogBrandProgressRow, CatalogBrandRow, CatalogBrowseBrandRow, CatalogCategoryRow, CatalogDatabaseEnums, CatalogDatabaseFunctions, CatalogDatabaseTables (+12 more)

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

### Community 17 - "import-wardrobe-url/index.ts"
Cohesion: 0.16
Nodes (8): corsHeaders, errorResponse(), jsonResponse(), rateWindows, WardrobeImportError, resolvePublicDns(), WardrobeImportErrorCode, WardrobeImportErrorResponse

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (50): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+42 more)

### Community 19 - "compilerOptions"
Cohesion: 0.09
Nodes (22): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, supabase/functions/_shared/deno-runtime.d.ts, ./supabase/index.ts (+14 more)

### Community 20 - "RootNavigator.tsx"
Cohesion: 0.05
Nodes (49): AppNavigation(), AppRoot(), calculateDoubleMFillBounds(), DOUBLE_M_BOTTOM, DOUBLE_M_PATHS, DOUBLE_M_TOP, DOUBLE_M_VIEWBOX_SIZE, DoubleMLoader() (+41 more)

### Community 21 - "generator.ts"
Cohesion: 0.17
Nodes (24): CATALOG_BRANDS, CATALOG_SEED, DEFAULT_PRODUCT_COUNT, SYNTHETIC_CATALOG_TIMESTAMP, SYNTHETIC_SOURCE_DOMAIN, CATEGORIES_BY_SLUG, allocateMaterials(), buildProduct() (+16 more)

### Community 22 - "BodyProfileScreen.tsx"
Cohesion: 0.09
Nodes (37): createStyles(), PreferenceChoiceGroup(), PreferenceChoiceGroupProps, togglePreference(), ArrayPreferenceKey, createStyles(), PreferenceSelectionScreen(), PreferenceSelectionScreenProps (+29 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "authStore.ts"
Cohesion: 0.12
Nodes (20): AuthService, AccountActions, createAuthAccountActions(), createAuthFlowActions(), AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot() (+12 more)

### Community 25 - "src/catalog/types.ts"
Cohesion: 0.18
Nodes (15): CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty(), readString(), toNumberRecord() (+7 more)

### Community 26 - "_shared/catalog/types.ts"
Cohesion: 0.12
Nodes (33): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+25 more)

### Community 27 - "colorEngine.ts"
Cohesion: 0.24
Nodes (14): COLOR_ALIASES, COLOR_WHEEL, ColorFamily, NEUTRAL_COLORS, average(), colorCompatibility(), ColorRelationship, describeColorRelationship() (+6 more)

### Community 28 - "pinned-fetch.ts"
Cohesion: 0.17
Nodes (19): BufferedConnectionReader, closeConnection(), concatenate(), createAbortError(), createChunkedBody(), createDenoPinnedFetch(), createFixedLengthBody(), createPinnedFetch() (+11 more)

### Community 29 - "fetch-page.ts"
Cohesion: 0.16
Nodes (14): assertHttpStatus(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES, isAbortError() (+6 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "AppTheme"
Cohesion: 0.08
Nodes (34): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogImportControls(), createStyles(), Props, CatalogJobCard() (+26 more)

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
Cohesion: 0.22
Nodes (11): errorTitle(), ImportErrorPanel(), Props, createStyles(), ImportUrlInputStep(), Props, supportedPages, SupportIndicator() (+3 more)

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
Cohesion: 0.19
Nodes (17): calculateOverallConfidence(), enrichCatalogProduct(), EXTRACTION_CONFIDENCE, inferFit(), inferFormality(), inferLayerRole(), inferOccasions(), inferPattern() (+9 more)

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
Nodes (15): normalizeSlug(), CATALOG_TAXONOMY, CatalogCategoryDefinition, CatalogSubcategoryDefinition, isCatalogCategoryPair(), normalizeCatalogCategory(), normalizeSignal(), CatalogCategoryMatch (+7 more)

### Community 57 - "ImportPreviewStep.tsx"
Cohesion: 0.16
Nodes (24): ImportSaveSummary, createStyles(), formatPrice(), ImportedProductCard(), Props, createStyles(), ImportPreviewStep(), Metric() (+16 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "AddItemDetailsScreen.tsx"
Cohesion: 0.26
Nodes (12): buildManualWardrobeInput(), createManualDeduplicationKey(), hostname(), isPublicImageUrl(), ManualWardrobeItemErrors, optional(), draft, validateManualWardrobeItem() (+4 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "scoringEngine.ts"
Cohesion: 0.14
Nodes (23): FIT_COMPATIBILITY, roundScore(), scoreOutfit(), ScoringContext, scoreFitPair(), silhouetteCompatibility(), average(), getTargetWarmth() (+15 more)

### Community 64 - "seedCatalog.ts"
Cohesion: 0.16
Nodes (13): catalog, client, ensureDemoCatalogImageBucket(), options, report, requireLookup(), seedCatalog(), uploadDemoCatalogImages() (+5 more)

### Community 65 - "profileService.ts"
Cohesion: 0.10
Nodes (27): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+19 more)

### Community 66 - "CatalogProductDetailScreen.tsx"
Cohesion: 0.22
Nodes (13): CatalogProductDetail, CatalogProductVariant, buildCatalogWardrobeInput(), createCatalogInstanceKey(), product, CatalogBrowseSkeleton(), createStyles(), CatalogProductDetailScreen() (+5 more)

### Community 67 - "recommendationEngine.ts"
Cohesion: 0.13
Nodes (20): DEFAULT_MAX_CANDIDATES, DEFAULT_RECOMMENDATION_COUNT, STYLING_WEIGHTS, reject(), validateOutfitConstraints(), capitalize(), formatRejection(), formatStylingDiagnostics() (+12 more)

### Community 68 - "useAuthStore"
Cohesion: 0.11
Nodes (42): createStyles(), ErrorBanner(), ErrorBannerProps, createStyles(), ScreenContainer(), ScreenContainerProps, createStyles(), EmailVerificationScreen() (+34 more)

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 70 - "data/catalog/types.ts"
Cohesion: 0.15
Nodes (12): BRAND_PROFILES, BrandProfile, CatalogImageSourceType, CatalogSourceType, CatalogValidationIssue, CatalogValidationReport, SyntheticBrand, SyntheticMaterial (+4 more)

### Community 71 - "persist.ts"
Cohesion: 0.18
Nodes (10): CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient, CatalogRestError, readMessage() (+2 more)

### Community 72 - "generic-structured-data.ts"
Cohesion: 0.22
Nodes (7): EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CatalogExtractionMethod, CatalogImporterAdapter, CatalogImportSource, ExtractionMethod

### Community 73 - "developmentQuickLogin.ts"
Cohesion: 0.60
Nodes (3): DevelopmentQuickLoginCredentials, getDevelopmentQuickLoginCredentials(), resolveDevelopmentQuickLoginCredentials()

### Community 74 - "SelectField.tsx"
Cohesion: 0.36
Nodes (6): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField(), SelectFieldProps

### Community 75 - "editorial.ts"
Cohesion: 0.18
Nodes (13): editorialAssets, homeEditorialContent, HomeEditorialState, useHomeEditorialContent(), getHomeEditorialContent(), EDITORIAL_IMAGE_KEYS, EditorialImageKey, EditorialImageSource (+5 more)

### Community 76 - "Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?, Source Nodes

### Community 77 - "Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action., Source Nodes

### Community 78 - "Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake, Source Nodes

### Community 79 - "pipeline.ts"
Cohesion: 0.14
Nodes (12): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), InMemoryCatalogClient, processCatalogCandidates() (+4 more)

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

### Community 84 - "ExploreScreen.tsx"
Cohesion: 0.18
Nodes (12): createStyles(), ExploreFilterPanel(), FilterSection(), Props, useExploreDiscoveryContent(), createStyles(), ExploreScreen(), Props (+4 more)

### Community 85 - "useAppTheme"
Cohesion: 0.10
Nodes (27): Avatar(), Badge(), createStyles(), StatCard(), ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps (+19 more)

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue., Source Nodes

### Community 88 - "stylistStore.ts"
Cohesion: 0.11
Nodes (30): normalizeWardrobe(), getStylingRecommendations(), StylingRecommendationInput, FIRST_OUTFIT_REQUEST, FirstOutfitProgress, getFirstOutfitProgress(), cloneEmptyState(), EMPTY_STYLIST_USER_STATE (+22 more)

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

### Community 95 - "html-parsers.ts"
Cohesion: 0.30
Nodes (13): AnchorRecord, compact(), extractMarkupProducts(), extractOpenGraphProduct(), isDecorative(), mapAnchor(), readAnchors(), decodeHtmlEntities() (+5 more)

### Community 96 - "getSupabaseClient"
Cohesion: 0.39
Nodes (6): environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), getSupabaseClient(), startSupabaseAutoRefresh()

### Community 97 - "Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius, Source Nodes

### Community 98 - "Q: How should the Double M startup loader integrate with the existing app?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should the Double M startup loader integrate with the existing app?, Source Nodes

### Community 99 - "normalize-product.ts"
Cohesion: 0.26
Nodes (16): cleanText(), assignText(), createIdentityIndex(), IdentityIndex, identityMatches(), isDuplicateProduct(), normalizeCategory(), normalizeImageUrl() (+8 more)

### Community 100 - "PlaceholderArtwork.tsx"
Cohesion: 0.14
Nodes (15): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, createStyles() (+7 more)

### Community 101 - "Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found, Source Nodes

### Community 102 - "Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts, Source Nodes

### Community 103 - "InspirationDetailContent.tsx"
Cohesion: 0.18
Nodes (12): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFeedCard, ExploreMasonryFeed(), Props, CATEGORY_LABELS (+4 more)

### Community 104 - "Development synthetic catalogue"
Cohesion: 0.18
Nodes (10): Add or change a brand, Browse Brands and filtering, Change the seed or product count, Database structure, Development synthetic catalogue, Future real-data adapters, Generate and validate, Generator design (+2 more)

### Community 105 - "wardrobeNormalization.ts"
Cohesion: 0.33
Nodes (9): buildWardrobeInput(), importMethodFor(), isString(), normalizeClothingItem(), normalizeCurrency(), normalizePrice(), nullable(), uniqueStrings() (+1 more)

### Community 106 - "browseTypes.ts"
Cohesion: 0.13
Nodes (17): CatalogBrand, CatalogCategory, CatalogPage, CatalogProductSummary, EMPTY_CATALOG_FILTERS, CatalogBrandRow(), createStyles(), formatStatus() (+9 more)

### Community 107 - "WardrobeHeroImage.tsx"
Cohesion: 0.48
Nodes (4): createStyles(), Props, WardrobeHeroImage(), productImageResizeMode()

### Community 108 - "Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?, Source Nodes

### Community 109 - "preferenceModel.ts"
Cohesion: 0.19
Nodes (16): applyNeverRecommendFeedback(), applyOutfitFeedback(), FEEDBACK_DELTAS, StylingFeedbackAction, average(), clamp(), getItemSignals(), getOutfitPreferenceSignals() (+8 more)

### Community 110 - "normalizeClothingItem.ts"
Cohesion: 0.18
Nodes (21): CATEGORY_TERMS, normalizeCategory(), tokenize(), COLOR_FAMILIES, normalizeColor(), normalizeToken(), clean(), inferFit() (+13 more)

### Community 111 - "catalogBrowseService.ts"
Cohesion: 0.24
Nodes (14): CatalogBrowseServiceError, loadBrands(), loadCatalogProduct(), loadFeaturedBrands(), mapBrowseBrand(), mapSearchProduct(), normalizeCatalogBrowseError(), readNullableNumber() (+6 more)

### Community 112 - "authService.ts"
Cohesion: 0.15
Nodes (20): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+12 more)

### Community 113 - "wardrobeStore.ts"
Cohesion: 0.14
Nodes (14): createStyles(), Props, WardrobeLoadingSkeleton(), createStyles(), Props, ToolButtonProps, WardrobeToolbar(), createSupabaseWardrobeGateway() (+6 more)

### Community 115 - "WardrobeScreen.tsx"
Cohesion: 0.08
Nodes (37): AppHeader(), AppHeaderProps, createStyles(), createStyles(), IconButton(), IconButtonProps, createStyles(), InspirationCard() (+29 more)

### Community 118 - "wardrobeImportService.ts"
Cohesion: 0.40
Nodes (8): importWardrobeUrl(), isErrorCode(), isImportResponse(), logImportStage(), normalizeFunctionError(), readProperty(), readString(), { invoke }

### Community 119 - "fixtures.test.ts"
Cohesion: 0.27
Nodes (7): CategoryFixture, exploreStyles, styleCategories, wardrobeCategories, quickStylingPrompts, stylingTips, wardrobeItems

### Community 120 - "types/index.ts"
Cohesion: 0.13
Nodes (20): areOccasionsRelated(), OCCASION_FORMALITY, OCCASION_RELATIONSHIPS, ConstraintResult, average(), occasionCompatibility(), EMPTY_PREFERENCE_MODEL, PreferenceModel (+12 more)

### Community 121 - "catalog/categories.ts"
Cohesion: 0.33
Nodes (5): apparelSizes, CATALOG_CATEGORIES, footwearSizes, oneSize, CatalogCategoryDefinition

### Community 122 - "Q: Can we add image to the demo catalog?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Can we add image to the demo catalog?, Source Nodes

### Community 123 - "getOutfitItems"
Cohesion: 0.12
Nodes (23): createStyles(), OutfitDisplayItem, OutfitImageComposition(), Props, Styles, createStyles(), FeedbackAction, Props (+15 more)

### Community 124 - "Q: why does it keep showing Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: why does it keep showing Refusing to seed: MIXANDMATCH_CATALOG_ENV must equal development?, Source Nodes

### Community 126 - "candidateGenerator.ts"
Cohesion: 0.31
Nodes (10): buildVariations(), CandidateGeneratorOptions, candidatePriority(), createOutfit(), EMPTY_BREAKDOWN, generateOutfitCandidates(), groupItems(), groupSelected() (+2 more)

### Community 127 - "management-actions.ts"
Cohesion: 0.24
Nodes (17): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), CatalogManagementRequestError, compact(), parseCatalogManagementAction() (+9 more)

### Community 129 - "styleCompatibilityEngine.ts"
Cohesion: 0.43
Nodes (5): areStylesRelated(), STYLE_INFERENCE_RULES, STYLE_RELATIONSHIPS, average(), styleCompatibility()

### Community 132 - "Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Error: Unable to seed catalog_brands: null value in column source_status violates not-null constraint, Source Nodes

### Community 133 - "Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Map the existing Styling Page presentation components, loading states, recommendation flow, and navigation dependencies to preserve during an editorial redesign., Source Nodes

### Community 134 - "First outfit and saved inspiration"
Cohesion: 0.29
Nodes (6): Automated regression checks, Browser evidence, Delivered flows, First outfit and saved inspiration, Live Supabase verification, Verification limits

### Community 135 - "authCallback.ts"
Cohesion: 0.53
Nodes (4): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback

### Community 136 - "Q: Redesign Wardrobe Clothes Details, fix missing metadata, and implement Edit for the Nike item"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Redesign Wardrobe Clothes Details, fix missing metadata, and implement Edit for the Nike item, Source Nodes

### Community 137 - "Q: Supabase seed fails with Unable to inspect demo image bucket: Bucket not found"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Supabase seed fails with Unable to inspect demo image bucket: Bucket not found, Source Nodes

### Community 138 - "AddWardrobeItemMenu.tsx"
Cohesion: 0.40
Nodes (4): AddWardrobeItemMenu(), createStyles(), MenuOptionProps, Props

### Community 139 - "validate-url.ts"
Cohesion: 0.28
Nodes (14): assertPublicResolution(), BLOCKED_HOSTNAMES, failure(), isIpAddress(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4(), MAX_IMPORT_URL_LENGTH (+6 more)

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
Cohesion: 0.24
Nodes (13): formatWardrobePrice(), wardrobeDetailPresentation(), displayProductName(), extractMaterialComposition(), inferOccasion(), inferSeason(), inferSubcategory(), knownBrandFromDomain() (+5 more)

### Community 146 - "EditWardrobeItemScreen.tsx"
Cohesion: 0.14
Nodes (20): createStyles(), Props, WardrobeSummary(), draftFromWardrobeItem(), item, toWardrobeEditUpdate(), validateWardrobeEdit(), WardrobeEditDraft (+12 more)

### Community 147 - "BrandProductsScreen.tsx"
Cohesion: 0.14
Nodes (21): CatalogFilterOptions, CatalogProductFilters, loadBrandCategories(), loadBrandFilterOptions(), loadBrandProducts(), mapFilterOptions(), Chip(), ChipProps (+13 more)

### Community 148 - "StateViews.tsx"
Cohesion: 0.12
Nodes (21): createStyles(), DeferredNotice(), LoadingState(), MessageState(), MessageStateProps, SkeletonCard(), StateAction, AddItemImageScreen() (+13 more)

### Community 151 - "HomeEditorialSkeleton.tsx"
Cohesion: 0.40
Nodes (4): createStyles(), HomeEditorialSkeleton(), HomeEditorialSkeletonProps, SkeletonStyles

### Community 152 - "job-state.ts"
Cohesion: 0.53
Nodes (4): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CatalogJobEntryState

### Community 153 - "ActionButton.tsx"
Cohesion: 0.14
Nodes (16): ActionButton(), ActionButtonProps, createStyles(), createStyles(), DevelopmentQuickLogin(), DevelopmentQuickLoginProps, InspirationActions(), SaveInspirationButton() (+8 more)

## Knowledge Gaps
- **691 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+686 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `seedCatalog.ts` (8× useful, score=7.358446653)
- `ExploreScreen.tsx` (5× useful, score=3.198878279) _(code changed — re-verify)_
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

- **Why does `useAppTheme()` connect `useAppTheme` to `routes.ts`, `TabNavigators.tsx`, `theme/index.ts`, `navigation/types.ts`, `EditorialPrimitives.tsx`, `StylistScreen.tsx`, `AddWardrobeItemMenu.tsx`, `EditWardrobeItemScreen.tsx`, `BrandProductsScreen.tsx`, `RootNavigator.tsx`, `StateViews.tsx`, `BodyProfileScreen.tsx`, `HomeEditorialSkeleton.tsx`, `ActionButton.tsx`, `AppTheme`, `ImportUrlInputStep.tsx`, `ImportPreviewStep.tsx`, `AddItemDetailsScreen.tsx`, `CatalogProductDetailScreen.tsx`, `useAuthStore`, `SelectField.tsx`, `ExploreScreen.tsx`, `PlaceholderArtwork.tsx`, `InspirationDetailContent.tsx`, `browseTypes.ts`, `WardrobeHeroImage.tsx`, `catalogBrowseService.ts`, `wardrobeStore.ts`, `WardrobeScreen.tsx`, `getOutfitItems`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `routes.ts`, `TabNavigators.tsx`, `theme/index.ts`, `navigation/types.ts`, `EditorialPrimitives.tsx`, `StylistScreen.tsx`, `AddWardrobeItemMenu.tsx`, `EditWardrobeItemScreen.tsx`, `BrandProductsScreen.tsx`, `StateViews.tsx`, `BodyProfileScreen.tsx`, `HomeEditorialSkeleton.tsx`, `ActionButton.tsx`, `ImportUrlInputStep.tsx`, `ImportPreviewStep.tsx`, `AddItemDetailsScreen.tsx`, `CatalogProductDetailScreen.tsx`, `useAuthStore`, `SelectField.tsx`, `ExploreScreen.tsx`, `useAppTheme`, `PlaceholderArtwork.tsx`, `InspirationDetailContent.tsx`, `browseTypes.ts`, `WardrobeHeroImage.tsx`, `wardrobeStore.ts`, `WardrobeScreen.tsx`, `getOutfitItems`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `getOutfitItems()` connect `getOutfitItems` to `styleCompatibilityEngine.ts`, `recommendationEngine.ts`, `StylistScreen.tsx`, `wardrobeService.ts`, `preferenceModel.ts`, `types/index.ts`, `colorEngine.ts`, `candidateGenerator.ts`, `scoringEngine.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _691 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07676767676767676 - nodes in this community are weakly interconnected._
- **Should `TabNavigators.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._