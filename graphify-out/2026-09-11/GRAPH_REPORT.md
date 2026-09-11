# Graph Report - MixAndMatch  (2026-09-11)

## Corpus Check
- 299 files · ~149,482 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1716 nodes · 4233 edges · 115 communities (98 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88264fe5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ActionButton.tsx
- MainAppNavigator.tsx
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- html-parsers.ts
- devDependencies
- dependencies
- TabNavigators.tsx
- types/discovery.ts
- EditorialPrimitives.tsx
- WardrobeItemDetailScreen.tsx
- wardrobeService.ts
- catalogDatabase.ts
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- fetch-page.ts
- catalog-management/index.ts
- compilerOptions
- startupProgress.ts
- AddItemDetailsScreen.tsx
- ColorPreferencesScreen.tsx
- Mix & Match catalogue database audit
- BodyProfileScreen.tsx
- wardrobeImportService.ts
- normalize.ts
- CatalogDevelopmentScreen.tsx
- management-actions.ts
- ImportWardrobeWebsiteScreen.tsx
- .prettierrc.json
- graphify reference: extra exports and benchmark
- HomeScreen.tsx
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
- ExploreScreen.tsx
- README.md
- package.json
- Phase 1 architecture
- CatalogProductDetailScreen.tsx
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- routes.ts
- useAppTheme
- profileService.ts
- catalogBrowseService.ts
- authErrors.ts
- types/wardrobe.ts
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- react-native
- persist.ts
- pipeline.ts
- authState.ts
- authService.ts
- react
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- _shared/catalog/types.ts
- Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation.
- ProfileScreen.tsx
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- AppTheme
- WardrobeScreen.tsx
- catalogAdminService.ts
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- ImportPreviewStep.tsx
- CatalogJobCard.tsx
- Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?
- react-native-url-polyfill
- CatalogBrandProgressCard.tsx
- EditImportedProductModal.tsx
- wardrobe-import/types.ts
- validate-url.ts
- ExploreOutfitDetailScreen.tsx
- job-state.ts
- Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius
- Q: How should the Double M startup loader integrate with the existing app?
- ProfileSettingsDirectory.tsx
- fixtures.test.ts
- normalize-product.ts
- react-native-screens
- expo-splash-screen
- react-native-safe-area-context
- ExploreMasonryFeed.tsx
- json-ld.ts
- @react-navigation/native-stack
- zustand
- FashionSeasonSection.tsx
- ActivitySummary.tsx
- HomeEditorialSkeleton.tsx
- AddWardrobeItemMenu.tsx
- PreferredStylesScreen.tsx
- module-resolution.test.ts

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 197 edges
2. `AppTheme` - 90 edges
3. `useAuthStore` - 43 edges
4. `ActionButton()` - 41 edges
5. `AppScreen()` - 40 edges
6. `getSupabaseClient()` - 22 edges
7. `normalizeCatalogProduct()` - 20 edges
8. `showDeferredNotice()` - 19 edges
9. `getGridColumnCount()` - 18 edges
10. `Mix & Match catalogue database` - 18 edges

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

## Communities (115 total, 17 thin omitted)

### Community 0 - "ActionButton.tsx"
Cohesion: 0.06
Nodes (73): CatalogImportControls(), createStyles(), Props, CatalogReviewEditModal(), createStyles(), Props, ActionButton(), ActionButtonProps (+65 more)

### Community 1 - "MainAppNavigator.tsx"
Cohesion: 0.12
Nodes (21): createStyles(), FloatingTabBar(), VisibleFloatingTabBar(), MainAppNavigator(), Tabs, getTabConfig(), isMainTabRootRoute(), MAIN_TAB_CONFIG (+13 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.17
Nodes (16): darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing, darkTheme, lightTheme (+8 more)

### Community 4 - "html-parsers.ts"
Cohesion: 0.21
Nodes (18): extractProductsFromHtml(), fixtureDirectory, AnchorRecord, compact(), extractGenericHtmlProducts(), extractOpenGraphProduct(), extractPlatformProducts(), isDecorative() (+10 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.09
Nodes (23): expo, expo-clipboard, expo-dev-client, expo-linking, dependencies, expo, expo-clipboard, expo-dev-client (+15 more)

### Community 7 - "TabNavigators.tsx"
Cohesion: 0.10
Nodes (34): AppHeader(), AppHeaderProps, createStyles(), AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow() (+26 more)

### Community 8 - "types/discovery.ts"
Cohesion: 0.21
Nodes (12): exploreDiscoveryContent, ExploreDiscoveryState, useExploreDiscoveryContent(), getExploreDiscoveryContent(), EXPLORE_CATEGORY_OPTIONS, EXPLORE_STYLE_OPTIONS, ExploreDiscoveryItem, ExploreFilterCriteria (+4 more)

### Community 9 - "EditorialPrimitives.tsx"
Cohesion: 0.14
Nodes (19): DetailImage(), editorialAssets, resolveEditorialImageSource(), createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps (+11 more)

### Community 10 - "WardrobeItemDetailScreen.tsx"
Cohesion: 0.11
Nodes (25): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, createStyles(), DeferredNotice(), EmptyState(), LoadingState() (+17 more)

### Community 11 - "wardrobeService.ts"
Cohesion: 0.11
Nodes (18): createSupabaseWardrobeGateway(), LegacyWardrobeRow, asMetadata(), createWardrobeService(), mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty() (+10 more)

### Community 12 - "catalogDatabase.ts"
Cohesion: 0.14
Nodes (16): CatalogImportError, CatalogOverview, CatalogBrandCategoryRow, CatalogBrandProgressRow, CatalogBrandRow, CatalogCategoryRow, CatalogImportErrorRow, CatalogImportJobStatus (+8 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStoreRuntime.ts"
Cohesion: 0.16
Nodes (28): markStartupComplete(), markStartupStep(), AuthService, createAuthService(), isEmailVerified(), createProfileService(), ProfileService, createSupabaseProfileGateway() (+20 more)

### Community 16 - "expo"
Cohesion: 0.06
Nodes (30): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, icon, package, projectId, tsconfigPaths (+22 more)

### Community 17 - "fetch-page.ts"
Cohesion: 0.22
Nodes (12): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+4 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (49): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+41 more)

### Community 19 - "compilerOptions"
Cohesion: 0.09
Nodes (21): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+13 more)

### Community 20 - "startupProgress.ts"
Cohesion: 0.09
Nodes (32): calculateDoubleMFillBounds(), DOUBLE_M_BOTTOM, DOUBLE_M_PATHS, DOUBLE_M_TOP, DOUBLE_M_VIEWBOX_SIZE, DoubleMLoader(), DoubleMLoaderProps, DoubleMLogo() (+24 more)

### Community 21 - "AddItemDetailsScreen.tsx"
Cohesion: 0.19
Nodes (15): createStyles(), ToggleRow(), ToggleRowProps, buildManualWardrobeInput(), createManualDeduplicationKey(), hostname(), isPublicImageUrl(), ManualWardrobeItemErrors (+7 more)

### Community 22 - "ColorPreferencesScreen.tsx"
Cohesion: 0.16
Nodes (16): togglePreference(), ArrayPreferenceKey, createStyles(), PreferenceSelectionScreen(), PreferenceSelectionScreenProps, createStyles(), ProfileSaveFeedback(), ColorPreferencesScreen() (+8 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "BodyProfileScreen.tsx"
Cohesion: 0.16
Nodes (17): createStyles(), PreferenceChoiceGroup(), PreferenceChoiceGroupProps, BodyChoiceKey, BodyProfileScreen(), createStyles(), parseMeasurement(), Props (+9 more)

### Community 25 - "wardrobeImportService.ts"
Cohesion: 0.40
Nodes (8): importWardrobeUrl(), isErrorCode(), isImportResponse(), logImportStage(), normalizeFunctionError(), readProperty(), readString(), { invoke }

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "CatalogDevelopmentScreen.tsx"
Cohesion: 0.19
Nodes (12): CatalogMetricCard(), createStyles(), useCatalogAdminStore, createStyles(), SectionHeader(), SectionHeaderProps, isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled() (+4 more)

### Community 28 - "management-actions.ts"
Cohesion: 0.22
Nodes (18): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), CatalogManagementRequestError, CatalogProductEditPatch, compact() (+10 more)

### Community 29 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.25
Nodes (16): ImportPreviewStep(), applySaveResults(), buildWardrobeInputs(), createImportDeduplicationKey(), createImportPreview(), setAllSelected(), summarizeSaveResults(), candidate (+8 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "HomeScreen.tsx"
Cohesion: 0.20
Nodes (13): homeEditorialContent, HomeEditorialState, useHomeEditorialContent(), createStyles(), HomeScreen(), Props, getHomeEditorialContent(), EDITORIAL_IMAGE_KEYS (+5 more)

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
Cohesion: 0.15
Nodes (13): errorTitle(), ImportErrorPanel(), Props, createStyles(), ImportUrlInputStep(), Props, supportedPages, SupportIndicator() (+5 more)

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
Cohesion: 0.17
Nodes (12): scripts, android, format, format:check, ios, lint, start, test (+4 more)

### Community 55 - "validate.ts"
Cohesion: 0.19
Nodes (14): CATALOG_TAXONOMY, CatalogCategoryDefinition, CatalogSubcategoryDefinition, isCatalogCategoryPair(), normalizeCatalogCategory(), normalizeSignal(), CatalogCategoryMatch, CatalogValidationResult (+6 more)

### Community 57 - "ExploreScreen.tsx"
Cohesion: 0.19
Nodes (11): createStyles(), ExploreFilterPanel(), FilterSection(), Props, createStyles(), ExploreScreen(), Props, toggleSelection() (+3 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "CatalogProductDetailScreen.tsx"
Cohesion: 0.17
Nodes (14): Chip(), ChipProps, createStyles(), createStyles(), OutfitPreferencesScreen(), PreferenceStyles, Props, createCatalogInstanceKey() (+6 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "routes.ts"
Cohesion: 0.13
Nodes (17): AddItemEntryScreen(), createStyles(), inputOptions, Props, AddItemImageScreen(), createStyles(), Props, neutralGarmentArtworkColors (+9 more)

### Community 64 - "useAppTheme"
Cohesion: 0.13
Nodes (26): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, Avatar(), Badge(), createStyles(), StatCard(), createStyles() (+18 more)

### Community 65 - "profileService.ts"
Cohesion: 0.10
Nodes (29): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, readNullablePositiveNumber(), readNullableString() (+21 more)

### Community 66 - "catalogBrowseService.ts"
Cohesion: 0.07
Nodes (39): AppNavigation(), AppRoot(), CatalogBrand, CatalogCategory, CatalogPage, CatalogProductDetail, CatalogProductVariant, CatalogBrowseServiceError (+31 more)

### Community 67 - "authErrors.ts"
Cohesion: 0.32
Nodes (10): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+2 more)

### Community 68 - "types/wardrobe.ts"
Cohesion: 0.22
Nodes (13): buildWardrobeInput(), importMethodFor(), isString(), normalizeClothingItem(), normalizeCurrency(), normalizePrice(), nullable(), uniqueStrings() (+5 more)

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 71 - "persist.ts"
Cohesion: 0.17
Nodes (11): CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient, CatalogRestError, readMessage() (+3 more)

### Community 72 - "pipeline.ts"
Cohesion: 0.15
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), InMemoryCatalogClient, processCatalogCandidates() (+3 more)

### Community 73 - "authState.ts"
Cohesion: 0.17
Nodes (13): AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot(), ProfileLoadStatus, authenticatedSnapshot(), incompleteProfile, session (+5 more)

### Community 74 - "authService.ts"
Cohesion: 0.15
Nodes (14): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback, AuthStateChangeHandler, callAuth(), failure(), AuthCallbackKind (+6 more)

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
Cohesion: 0.10
Nodes (20): EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CATALOG_ENRICHMENT_VERSION, CATALOG_NORMALIZATION_VERSION, CatalogExtractionMethod, CatalogGender, CatalogImageType (+12 more)

### Community 80 - "Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation., Source Nodes

### Community 81 - "ProfileScreen.tsx"
Cohesion: 0.21
Nodes (12): createStyles(), ProfileIdentity(), ProfileIdentityProps, createStyles(), ProfileFormSkeleton(), ProfileIdentitySkeleton(), StyleProfileRowSkeleton(), createStyles() (+4 more)

### Community 82 - "Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state., Source Nodes

### Community 83 - "AppTheme"
Cohesion: 0.20
Nodes (15): CatalogProductSummary, createStyles(), SearchBar(), SearchBarProps, CatalogBrowseSkeleton(), createStyles(), CatalogProductCard(), createStyles() (+7 more)

### Community 84 - "WardrobeScreen.tsx"
Cohesion: 0.10
Nodes (24): ErrorState(), createStyles(), Props, WardrobeEmptyState(), createStyles(), Props, WardrobeLoadingSkeleton(), createStyles() (+16 more)

### Community 85 - "catalogAdminService.ts"
Cohesion: 0.25
Nodes (11): CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty(), readString(), toNumberRecord() (+3 more)

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "ImportPreviewStep.tsx"
Cohesion: 0.19
Nodes (12): createStyles(), ImportCompleteStep(), ImportSaveSummary, Props, createStyles(), formatPrice(), ImportedProductCard(), Props (+4 more)

### Community 88 - "CatalogJobCard.tsx"
Cohesion: 0.22
Nodes (9): CatalogJobCard(), createStyles(), Props, CatalogReviewCard(), createStyles(), Props, CatalogRecentJob, CatalogReviewItem (+1 more)

### Community 89 - "Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?

### Community 91 - "CatalogBrandProgressCard.tsx"
Cohesion: 0.47
Nodes (5): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogBrandProgress

### Community 92 - "EditImportedProductModal.tsx"
Cohesion: 0.20
Nodes (11): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField(), SelectFieldProps, createStyles(), EditFields (+3 more)

### Community 93 - "wardrobe-import/types.ts"
Cohesion: 0.18
Nodes (9): corsHeaders, errorResponse(), jsonResponse(), rateWindows, ExtractionMethod, MAX_IMPORTED_PRODUCTS, RawProductCandidate, WardrobeImportErrorResponse (+1 more)

### Community 94 - "validate-url.ts"
Cohesion: 0.32
Nodes (10): resolvePublicDns(), BLOCKED_HOSTNAMES, failure(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4(), MAX_IMPORT_URL_LENGTH, parseIpv4() (+2 more)

### Community 95 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.10
Nodes (27): createStyles(), IconButton(), IconButtonProps, createStyles(), InspirationCard(), InspirationCardProps, CATEGORY_LABELS, createStyles() (+19 more)

### Community 96 - "job-state.ts"
Cohesion: 0.53
Nodes (4): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CatalogJobEntryState

### Community 97 - "Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius, Source Nodes

### Community 98 - "Q: How should the Double M startup loader integrate with the existing app?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should the Double M startup loader integrate with the existing app?, Source Nodes

### Community 99 - "ProfileSettingsDirectory.tsx"
Cohesion: 0.23
Nodes (9): createStyles(), DirectoryRow(), DirectoryStyles, IconName, ProfileDirectoryRow(), ProfileSettingsDirectory(), ProfileSettingsDirectoryProps, createStyles() (+1 more)

### Community 100 - "fixtures.test.ts"
Cohesion: 0.23
Nodes (8): CategoryFixture, exploreStyles, styleCategories, wardrobeCategories, quickStylingPrompts, stylingTips, WardrobeItemFixture, wardrobeItems

### Community 101 - "normalize-product.ts"
Cohesion: 0.33
Nodes (11): assignText(), deduplicateProducts(), normalizeCategory(), normalizeImageUrl(), normalizeProduct(), normalizeProducts(), normalizeUrl(), parsePrice() (+3 more)

### Community 105 - "ExploreMasonryFeed.tsx"
Cohesion: 0.29
Nodes (8): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFeedCard, ExploreMasonryFeed(), Props, buildMasonryColumns()

### Community 106 - "json-ld.ts"
Cohesion: 0.44
Nodes (9): collectProducts(), compact(), firstRecord(), isRecord(), JsonRecord, mapProduct(), normalizeTypes(), readImage() (+1 more)

### Community 109 - "FashionSeasonSection.tsx"
Cohesion: 0.43
Nodes (6): createStyles(), dateFormatter, FashionSeasonSection(), FashionSeasonSectionProps, formatReleaseDate(), statusLabel()

### Community 110 - "ActivitySummary.tsx"
Cohesion: 0.33
Nodes (5): ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps, unavailableMetrics

### Community 111 - "HomeEditorialSkeleton.tsx"
Cohesion: 0.40
Nodes (4): createStyles(), HomeEditorialSkeleton(), HomeEditorialSkeletonProps, SkeletonStyles

### Community 112 - "AddWardrobeItemMenu.tsx"
Cohesion: 0.40
Nodes (4): AddWardrobeItemMenu(), createStyles(), MenuOptionProps, Props

### Community 113 - "PreferredStylesScreen.tsx"
Cohesion: 0.50
Nodes (3): PreferredStylesScreen(), Props, preferredStyleOptions

## Knowledge Gaps
- **534 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+529 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `ExploreScreen.tsx` (5× useful, score=4.157931603)
- `TabNavigators.tsx` (3× useful, score=2.461055937)
- `ExploreMasonryFeed.tsx` (3× useful, score=2.460678451)
- `SearchResultsScreen.tsx` (2× useful, score=1.697253152)
- `MainAppNavigator.tsx` (2× useful, score=1.659722562)
- `navigation/types.ts` (2× useful, score=1.659722562)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `ActionButton.tsx`, `MainAppNavigator.tsx`, `theme/index.ts`, `TabNavigators.tsx`, `EditorialPrimitives.tsx`, `WardrobeItemDetailScreen.tsx`, `AddItemDetailsScreen.tsx`, `ColorPreferencesScreen.tsx`, `BodyProfileScreen.tsx`, `CatalogDevelopmentScreen.tsx`, `ImportWardrobeWebsiteScreen.tsx`, `HomeScreen.tsx`, `ImportUrlInputStep.tsx`, `ExploreScreen.tsx`, `CatalogProductDetailScreen.tsx`, `routes.ts`, `catalogBrowseService.ts`, `ProfileScreen.tsx`, `AppTheme`, `WardrobeScreen.tsx`, `ImportPreviewStep.tsx`, `CatalogJobCard.tsx`, `CatalogBrandProgressCard.tsx`, `EditImportedProductModal.tsx`, `ExploreOutfitDetailScreen.tsx`, `ProfileSettingsDirectory.tsx`, `ExploreMasonryFeed.tsx`, `FashionSeasonSection.tsx`, `ActivitySummary.tsx`, `HomeEditorialSkeleton.tsx`, `AddWardrobeItemMenu.tsx`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `ActionButton.tsx`, `MainAppNavigator.tsx`, `theme/index.ts`, `TabNavigators.tsx`, `EditorialPrimitives.tsx`, `WardrobeItemDetailScreen.tsx`, `AddItemDetailsScreen.tsx`, `ColorPreferencesScreen.tsx`, `BodyProfileScreen.tsx`, `CatalogDevelopmentScreen.tsx`, `HomeScreen.tsx`, `ImportUrlInputStep.tsx`, `ExploreScreen.tsx`, `CatalogProductDetailScreen.tsx`, `routes.ts`, `useAppTheme`, `catalogBrowseService.ts`, `ProfileScreen.tsx`, `WardrobeScreen.tsx`, `ImportPreviewStep.tsx`, `CatalogJobCard.tsx`, `CatalogBrandProgressCard.tsx`, `EditImportedProductModal.tsx`, `ExploreOutfitDetailScreen.tsx`, `ProfileSettingsDirectory.tsx`, `ExploreMasonryFeed.tsx`, `FashionSeasonSection.tsx`, `ActivitySummary.tsx`, `HomeEditorialSkeleton.tsx`, `AddWardrobeItemMenu.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `validateImportUrl()` connect `validate-url.ts` to `fetch-page.ts`, `catalog-management/index.ts`, `ImportWardrobeWebsiteScreen.tsx`, `wardrobeImportService.ts`, `wardrobe-import/types.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _534 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ActionButton.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057777777777777775 - nodes in this community are weakly interconnected._
- **Should `MainAppNavigator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._