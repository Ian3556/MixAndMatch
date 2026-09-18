# Graph Report - MixAndMatch  (2026-09-18)

## Corpus Check
- 361 files · ~171,282 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2109 nodes · 5161 edges · 128 communities (111 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f6b6522a`
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
- HomeScreen.tsx
- StylistScreen.tsx
- wardrobeStore.ts
- catalogDatabase.ts
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- fetch-page.ts
- catalog-management/index.ts
- compilerOptions
- startupProgress.ts
- generator.ts
- BodyProfileScreen.tsx
- Mix & Match catalogue database audit
- authStore.ts
- wardrobeImportService.ts
- normalize.ts
- useAppTheme
- management-actions.ts
- ImportPreviewStep.tsx
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
- generic-structured-data.ts
- README.md
- package.json
- Phase 1 architecture
- PlaceholderArtwork.tsx
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- wardrobeHistory.ts
- seedCatalog.ts
- profileService.ts
- catalogBrowseService.ts
- recommendationEngine.ts
- AddItemDetailsScreen.tsx
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- data/catalog/types.ts
- persist.ts
- pipeline.ts
- authService.ts
- authErrors.ts
- BrowseBrandsScreen.tsx
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- _shared/catalog/types.ts
- Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation.
- validateCatalog.ts
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- validator.ts
- types/index.ts
- wardrobeNormalization.ts
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
- client.ts
- Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius
- Q: How should the Double M startup loader integrate with the existing app?
- ProfileScreen.tsx
- OutfitCard.tsx
- Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found
- Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts
- expo-splash-screen
- Development synthetic catalogue
- developmentQuickLogin.ts
- WardrobeScreen.tsx
- WardrobeToolbar.tsx
- Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?
- preferenceModel.ts
- normalizeClothingItem.ts
- BrandProductsScreen.tsx
- supabase/index.ts
- colorEngine.ts
- module-resolution.test.ts
- Chip.tsx
- deno-runtime.d.ts
- react-native
- IconButton.tsx
- candidateGenerator.ts
- catalog/categories.ts
- getOutfitItems
- OutfitPreferencesScreen.tsx
- react-dom
- scoringEngine.ts
- @react-native-async-storage/async-storage
- react-native-screens
- @react-navigation/native

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 202 edges
2. `AppTheme` - 92 edges
3. `useAuthStore` - 45 edges
4. `ActionButton()` - 40 edges
5. `AppScreen()` - 40 edges
6. `getOutfitItems()` - 31 edges
7. `getSupabaseClient()` - 21 edges
8. `normalizeCatalogProduct()` - 20 edges
9. `normalizeClothingItem()` - 18 edges
10. `getGridColumnCount()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `loadCatalogDashboard()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogAdminService.ts → supabase/client.ts
- `invokeCatalogManagement()` --calls--> `getSupabaseClient()`  [EXTRACTED]
  src/catalog/services/catalogAdminService.ts → supabase/client.ts
- `getSupabaseClient()` --calls--> `requireSupabaseEnvironment()`  [EXTRACTED]
  supabase/client.ts → src/constants/environment.ts
- `createImportDeduplicationKey()` --calls--> `normalizeUrl()`  [EXTRACTED]
  src/features/wardrobe/import/importWorkflow.ts → supabase/functions/_shared/wardrobe-import/normalize-product.ts
- `ImportWardrobeWebsiteScreen()` --calls--> `validateImportUrl()`  [EXTRACTED]
  src/features/wardrobe/screens/ImportWardrobeWebsiteScreen.tsx → supabase/functions/_shared/wardrobe-import/validate-url.ts

## Import Cycles
- None detected.

## Communities (128 total, 17 thin omitted)

### Community 0 - "useAuthStore"
Cohesion: 0.08
Nodes (54): ActionButton(), ActionButtonProps, createStyles(), createStyles(), ErrorBanner(), ErrorBannerProps, FormTextInput, FormTextInputProps (+46 more)

### Community 1 - "routes.ts"
Cohesion: 0.08
Nodes (34): createStyles(), FloatingTabBar(), VisibleFloatingTabBar(), roots, sourceFiles, MainAppNavigator(), Tabs, getTabConfig() (+26 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.17
Nodes (16): darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing, darkTheme, lightTheme (+8 more)

### Community 4 - "normalize-product.ts"
Cohesion: 0.11
Nodes (39): extractProductsFromHtml(), fixtureDirectory, AnchorRecord, compact(), extractGenericHtmlProducts(), extractOpenGraphProduct(), extractPlatformProducts(), isDecorative() (+31 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.08
Nodes (25): expo, expo-clipboard, expo-dev-client, expo-linking, dependencies, expo, expo-clipboard, expo-dev-client (+17 more)

### Community 7 - "TabNavigators.tsx"
Cohesion: 0.08
Nodes (44): AppScreen(), AppScreenProps, createStyles(), { testTheme, useAppThemeMock }, createStyles(), SettingRow(), SettingRowProps, createStyles() (+36 more)

### Community 8 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.08
Nodes (36): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFilterPanel(), FilterSection(), Props, createStyles() (+28 more)

### Community 9 - "HomeScreen.tsx"
Cohesion: 0.07
Nodes (42): DetailImage(), editorialAssets, resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps (+34 more)

### Community 10 - "StylistScreen.tsx"
Cohesion: 0.11
Nodes (26): createStyles(), FeedbackAction, OutfitDetailScreen(), Props, createStyles(), OutfitGeneratingScreen(), Props, itemLabel() (+18 more)

### Community 11 - "wardrobeStore.ts"
Cohesion: 0.11
Nodes (21): createSupabaseWardrobeGateway(), LegacyWardrobeRow, asMetadata(), createWardrobeService(), mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty() (+13 more)

### Community 12 - "catalogDatabase.ts"
Cohesion: 0.09
Nodes (27): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogBrandProgress, CatalogImportError, CatalogOverview, CatalogRecentJob (+19 more)

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
Cohesion: 0.10
Nodes (28): corsHeaders, errorResponse(), jsonResponse(), rateWindows, assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage() (+20 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (49): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+41 more)

### Community 19 - "compilerOptions"
Cohesion: 0.09
Nodes (22): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, supabase/functions/_shared/deno-runtime.d.ts, ./supabase/index.ts (+14 more)

### Community 20 - "startupProgress.ts"
Cohesion: 0.08
Nodes (34): AppNavigation(), AppRoot(), calculateDoubleMFillBounds(), DOUBLE_M_BOTTOM, DOUBLE_M_PATHS, DOUBLE_M_TOP, DOUBLE_M_VIEWBOX_SIZE, DoubleMLoader() (+26 more)

### Community 21 - "generator.ts"
Cohesion: 0.17
Nodes (24): CATALOG_BRANDS, CATALOG_SEED, DEFAULT_PRODUCT_COUNT, SYNTHETIC_CATALOG_TIMESTAMP, SYNTHETIC_SOURCE_DOMAIN, CATEGORIES_BY_SLUG, allocateMaterials(), buildProduct() (+16 more)

### Community 22 - "BodyProfileScreen.tsx"
Cohesion: 0.08
Nodes (40): createStyles(), PreferenceChoiceGroup(), PreferenceChoiceGroupProps, togglePreference(), ArrayPreferenceKey, createStyles(), PreferenceSelectionScreen(), PreferenceSelectionScreenProps (+32 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "authStore.ts"
Cohesion: 0.12
Nodes (21): AuthService, AccountActions, createAuthAccountActions(), createAuthFlowActions(), AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot() (+13 more)

### Community 25 - "wardrobeImportService.ts"
Cohesion: 0.40
Nodes (8): importWardrobeUrl(), isErrorCode(), isImportResponse(), logImportStage(), normalizeFunctionError(), readProperty(), readString(), { invoke }

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "useAppTheme"
Cohesion: 0.07
Nodes (50): CatalogImportControls(), createStyles(), Props, CatalogJobCard(), createStyles(), Props, CatalogMetricCard(), createStyles() (+42 more)

### Community 28 - "management-actions.ts"
Cohesion: 0.12
Nodes (30): CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty(), readString(), toNumberRecord() (+22 more)

### Community 29 - "ImportPreviewStep.tsx"
Cohesion: 0.13
Nodes (29): EditImportedProductModal(), ImportSaveSummary, createStyles(), formatPrice(), ImportedProductCard(), Props, createStyles(), ImportPreviewStep() (+21 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "CatalogProductDetailScreen.tsx"
Cohesion: 0.18
Nodes (16): CatalogPage, CatalogProductDetail, CatalogProductVariant, buildCatalogWardrobeInput(), createCatalogInstanceKey(), product, CatalogProductDetailScreen(), createStyles() (+8 more)

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
Cohesion: 0.20
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
Cohesion: 0.23
Nodes (15): calculateOverallConfidence(), enrichCatalogProduct(), EXTRACTION_CONFIDENCE, inferFit(), inferFormality(), inferLayerRole(), inferOccasions(), inferPattern() (+7 more)

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
Cohesion: 0.19
Nodes (14): CATALOG_TAXONOMY, CatalogCategoryDefinition, CatalogSubcategoryDefinition, isCatalogCategoryPair(), normalizeCatalogCategory(), normalizeSignal(), CatalogCategoryMatch, CatalogValidationResult (+6 more)

### Community 57 - "generic-structured-data.ts"
Cohesion: 0.21
Nodes (8): EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CatalogExtractionMethod, CatalogImporterAdapter, CatalogImportSource, RawCatalogProductCandidate, ExtractionMethod

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "PlaceholderArtwork.tsx"
Cohesion: 0.24
Nodes (9): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, createStyles(), WardrobeItemCard(), WardrobeItemCardProps, createStyles(), Props (+1 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "wardrobeHistory.ts"
Cohesion: 0.16
Nodes (17): STYLING_WEIGHTS, average(), clamp(), daysSince(), EMPTY_WARDROBE_HISTORY, jaccard(), OutfitHistoryEntry, recordRecommendations() (+9 more)

### Community 64 - "seedCatalog.ts"
Cohesion: 0.15
Nodes (12): catalog, client, options, report, requireLookup(), seedCatalog(), upsertBatches(), BODY_TYPE_TAGS_BY_FIT (+4 more)

### Community 65 - "profileService.ts"
Cohesion: 0.11
Nodes (26): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+18 more)

### Community 66 - "catalogBrowseService.ts"
Cohesion: 0.24
Nodes (16): CatalogBrowseServiceError, loadBrandCategories(), loadBrandFilterOptions(), loadBrandProducts(), loadBrands(), loadCatalogProduct(), mapBrowseBrand(), mapFilterOptions() (+8 more)

### Community 67 - "recommendationEngine.ts"
Cohesion: 0.16
Nodes (19): DEFAULT_MAX_CANDIDATES, DEFAULT_RECOMMENDATION_COUNT, reject(), validateOutfitConstraints(), capitalize(), formatRejection(), formatStylingDiagnostics(), jaccard() (+11 more)

### Community 68 - "AddItemDetailsScreen.tsx"
Cohesion: 0.20
Nodes (15): buildManualWardrobeInput(), createManualDeduplicationKey(), hostname(), isPublicImageUrl(), ManualWardrobeItemErrors, optional(), draft, validateManualWardrobeItem() (+7 more)

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 70 - "data/catalog/types.ts"
Cohesion: 0.15
Nodes (12): BRAND_PROFILES, BrandProfile, CatalogImageSourceType, CatalogSourceType, CatalogValidationIssue, CatalogValidationReport, SyntheticBrand, SyntheticMaterial (+4 more)

### Community 71 - "persist.ts"
Cohesion: 0.17
Nodes (11): CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient, CatalogRestError, readMessage() (+3 more)

### Community 72 - "pipeline.ts"
Cohesion: 0.15
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), InMemoryCatalogClient, processCatalogCandidates() (+3 more)

### Community 73 - "authService.ts"
Cohesion: 0.15
Nodes (14): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback, AuthStateChangeHandler, callAuth(), failure(), AuthCallbackKind (+6 more)

### Community 74 - "authErrors.ts"
Cohesion: 0.32
Nodes (10): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+2 more)

### Community 75 - "BrowseBrandsScreen.tsx"
Cohesion: 0.19
Nodes (14): CatalogBrand, CatalogProductSummary, loadFeaturedBrands(), CatalogBrandRow(), createStyles(), formatStatus(), Props, CatalogProductCard() (+6 more)

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
Cohesion: 0.13
Nodes (17): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CATALOG_NORMALIZATION_VERSION, CatalogGender, CatalogImageType, CatalogJobEntryState, CatalogProductDecision (+9 more)

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
Nodes (10): catalog, hash, options, output, report, checkUnique(), countBy(), formatCatalogValidation() (+2 more)

### Community 84 - "types/index.ts"
Cohesion: 0.26
Nodes (11): ClothingCategory, ClothingItem, Outfit, OutfitScoreBreakdown, RejectedCandidate, RejectionReasonCode, StylingDiagnostics, StylingEngineResult (+3 more)

### Community 85 - "wardrobeNormalization.ts"
Cohesion: 0.33
Nodes (9): buildWardrobeInput(), importMethodFor(), isString(), normalizeClothingItem(), normalizeCurrency(), normalizePrice(), nullable(), uniqueStrings() (+1 more)

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Inspect the existing catalog Supabase schema, Browse Brands flow, and Wardrobe persistence before implementing the synthetic catalogue., Source Nodes

### Community 88 - "stylistStore.ts"
Cohesion: 0.14
Nodes (24): cloneEmptyState(), EMPTY_STYLIST_USER_STATE, isCount(), isFeedbackState(), isRecord(), isSavedLook(), loadStylistUserState(), OutfitFeedbackState (+16 more)

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
Cohesion: 0.15
Nodes (20): createStyles(), InspirationCard(), InspirationCardProps, createStyles(), Props, SearchResultsScreen(), createStyles(), Props (+12 more)

### Community 96 - "client.ts"
Cohesion: 0.38
Nodes (5): environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), Database

### Community 97 - "Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius, Source Nodes

### Community 98 - "Q: How should the Double M startup loader integrate with the existing app?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should the Double M startup loader integrate with the existing app?, Source Nodes

### Community 99 - "ProfileScreen.tsx"
Cohesion: 0.08
Nodes (28): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps, unavailableMetrics, createStyles() (+20 more)

### Community 100 - "OutfitCard.tsx"
Cohesion: 0.14
Nodes (14): createStyles(), OutfitCard(), OutfitCardProps, CategoryFixture, exploreStyles, styleCategories, wardrobeCategories, outfitConcepts (+6 more)

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

### Community 106 - "WardrobeScreen.tsx"
Cohesion: 0.13
Nodes (16): createStyles(), SearchBar(), SearchBarProps, AddWardrobeItemMenu(), createStyles(), MenuOptionProps, Props, createStyles() (+8 more)

### Community 107 - "WardrobeToolbar.tsx"
Cohesion: 0.22
Nodes (8): createStyles(), Props, WardrobeLoadingSkeleton(), createStyles(), Props, ToolButtonProps, WardrobeToolbar(), WardrobeViewMode

### Community 108 - "Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Why does catalog:seed still report TypeError fetch failed on the first catalog_brands read after setting an sb_secret key?, Source Nodes

### Community 109 - "preferenceModel.ts"
Cohesion: 0.18
Nodes (17): applyNeverRecommendFeedback(), applyOutfitFeedback(), FEEDBACK_DELTAS, StylingFeedbackAction, average(), clamp(), getItemSignals(), getOutfitPreferenceSignals() (+9 more)

### Community 110 - "normalizeClothingItem.ts"
Cohesion: 0.18
Nodes (21): CATEGORY_TERMS, normalizeCategory(), tokenize(), normalizeColor(), normalizeToken(), clean(), inferFit(), inferFormality() (+13 more)

### Community 111 - "BrandProductsScreen.tsx"
Cohesion: 0.15
Nodes (18): CatalogCategory, CatalogFilterOptions, CatalogProductFilters, EMPTY_CATALOG_FILTERS, CatalogBrowseSkeleton(), createStyles(), CatalogFilterPanel(), createStyles() (+10 more)

### Community 112 - "supabase/index.ts"
Cohesion: 0.70
Nodes (3): AuthBootstrap(), beginStartupProgress(), startSupabaseAutoRefresh()

### Community 113 - "colorEngine.ts"
Cohesion: 0.22
Nodes (15): COLOR_ALIASES, COLOR_FAMILIES, COLOR_WHEEL, ColorFamily, NEUTRAL_COLORS, average(), colorCompatibility(), ColorRelationship (+7 more)

### Community 115 - "Chip.tsx"
Cohesion: 0.67
Nodes (3): Chip(), ChipProps, createStyles()

### Community 118 - "IconButton.tsx"
Cohesion: 0.36
Nodes (6): AppHeader(), AppHeaderProps, createStyles(), createStyles(), IconButton(), IconButtonProps

### Community 120 - "candidateGenerator.ts"
Cohesion: 0.21
Nodes (12): buildVariations(), CandidateGeneratorOptions, candidatePriority(), createOutfit(), EMPTY_BREAKDOWN, generateOutfitCandidates(), groupItems(), groupSelected() (+4 more)

### Community 121 - "catalog/categories.ts"
Cohesion: 0.33
Nodes (5): apparelSizes, CATALOG_CATEGORIES, footwearSizes, oneSize, CatalogCategoryDefinition

### Community 123 - "getOutfitItems"
Cohesion: 0.17
Nodes (13): createStyles(), FeedbackAction, lookTitle(), Props, Styles, StylingRecommendationCard(), areOccasionsRelated(), OCCASION_FORMALITY (+5 more)

### Community 124 - "OutfitPreferencesScreen.tsx"
Cohesion: 0.13
Nodes (17): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField(), SelectFieldProps, createStyles(), formalityOptions (+9 more)

### Community 126 - "scoringEngine.ts"
Cohesion: 0.15
Nodes (16): FIT_COMPATIBILITY, areStylesRelated(), STYLE_INFERENCE_RULES, STYLE_RELATIONSHIPS, roundScore(), scoreOutfit(), ScoringContext, scoreFitPair() (+8 more)

## Knowledge Gaps
- **642 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+637 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `ExploreScreen.tsx` (5× useful, score=3.508309661)
- `seedCatalog.ts` (4× useful, score=3.998904924) _(code changed — re-verify)_
- `client` (4× useful, score=3.998904924) _(code changed — re-verify)_
- `TabNavigators.tsx` (3× useful, score=2.076548425)
- `ExploreMasonryFeed.tsx` (3× useful, score=2.076229916)
- `environment` (2× useful, score=1.999429914)
- `Migration` (2× useful, score=1.999128605)
- `supabase/functions/import-wardrobe-url/index.ts` (2× useful, score=1.687978156)
- `SearchResultsScreen.tsx` (2× useful, score=1.432079745)
- `MainAppNavigator.tsx` (2× useful, score=1.400412815)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `useAuthStore`, `routes.ts`, `theme/index.ts`, `TabNavigators.tsx`, `ExploreOutfitDetailScreen.tsx`, `HomeScreen.tsx`, `StylistScreen.tsx`, `catalogDatabase.ts`, `startupProgress.ts`, `BodyProfileScreen.tsx`, `ImportPreviewStep.tsx`, `CatalogProductDetailScreen.tsx`, `ImportUrlInputStep.tsx`, `PlaceholderArtwork.tsx`, `AddItemDetailsScreen.tsx`, `BrowseBrandsScreen.tsx`, `SearchResultsScreen.tsx`, `ProfileScreen.tsx`, `OutfitCard.tsx`, `WardrobeScreen.tsx`, `WardrobeToolbar.tsx`, `BrandProductsScreen.tsx`, `Chip.tsx`, `IconButton.tsx`, `getOutfitItems`, `OutfitPreferencesScreen.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `useAppTheme` to `useAuthStore`, `routes.ts`, `theme/index.ts`, `TabNavigators.tsx`, `ExploreOutfitDetailScreen.tsx`, `HomeScreen.tsx`, `StylistScreen.tsx`, `catalogDatabase.ts`, `BodyProfileScreen.tsx`, `ImportPreviewStep.tsx`, `CatalogProductDetailScreen.tsx`, `ImportUrlInputStep.tsx`, `PlaceholderArtwork.tsx`, `AddItemDetailsScreen.tsx`, `BrowseBrandsScreen.tsx`, `SearchResultsScreen.tsx`, `ProfileScreen.tsx`, `OutfitCard.tsx`, `WardrobeScreen.tsx`, `WardrobeToolbar.tsx`, `BrandProductsScreen.tsx`, `Chip.tsx`, `IconButton.tsx`, `getOutfitItems`, `OutfitPreferencesScreen.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `validateImportUrl()` connect `fetch-page.ts` to `wardrobeImportService.ts`, `catalog-management/index.ts`, `ImportPreviewStep.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _642 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.08485540334855403 - nodes in this community are weakly interconnected._
- **Should `routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07822410147991543 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._