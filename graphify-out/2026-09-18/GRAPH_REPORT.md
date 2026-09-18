# Graph Report - MixAndMatch  (2026-09-18)

## Corpus Check
- 355 files · ~170,398 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2079 nodes · 5137 edges · 133 communities (116 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f6b6522a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SignInScreen.tsx
- routes.ts
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- html-parsers.ts
- devDependencies
- dependencies
- TabNavigators.tsx
- ExploreScreen.tsx
- EditorialPrimitives.tsx
- StylistScreen.tsx
- wardrobeStore.ts
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
- editorial.ts
- wardrobeImportService.ts
- normalize.ts
- ActionButton.tsx
- management-actions.ts
- ImportPreviewStep.tsx
- .prettierrc.json
- graphify reference: extra exports and benchmark
- browseTypes.ts
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
- AppTheme
- Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader.
- getOutfitItems
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
- ResetPasswordScreen.tsx
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- Q: There are a few errors that need to be fix: Explore Page Image keeps on rendering, make the image to ONLY render when user either refresh or reopen the app; The Back button instead of going back to the home page, make it go back to its previous action.
- Q: Mix & Match — Image Detail Back Button + Bottom Navigation Remake
- _shared/catalog/types.ts
- Q: Remake the Mix & Match Profile experience with nested Style Profile screens, simple headings, real data, persistence, loading states, and working navigation.
- validateCatalog.ts
- Q: Refine the Explore page with a compact search-first layout, bottom-sheet filters, image-first outfit details, related-item stack navigation, and preserved Explore state.
- validator.ts
- types/index.ts
- catalogAdminService.ts
- Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back.
- ExploreOutfitDetailScreen.tsx
- stylistStore.ts
- Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?
- react-native-url-polyfill
- CatalogBrandProgressCard.tsx
- wardrobe-import/types.ts
- useAuthStore
- normalize-product.ts
- BrandProductsScreen.tsx
- database.ts
- Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius
- Q: How should the Double M startup loader integrate with the existing app?
- ProfileScreen.tsx
- OutfitCard.tsx
- Q: unexpected deploy status 400: Failed to bundle import-wardrobe-url because html-parsers module was not found
- Q: VS Code reports Cannot find name Deno in supabase/functions/import-wardrobe-url/index.ts
- expo-splash-screen
- Development synthetic catalogue
- developmentQuickLogin.ts
- useAppTheme
- WardrobeToolbar.tsx
- json-ld.ts
- preferenceModel.ts
- normalizeClothingItem.ts
- CatalogFilterPanel.tsx
- AddWardrobeItemMenu.tsx
- colorEngine.ts
- module-resolution.test.ts
- EditProfileScreen.tsx
- deno-runtime.d.ts
- utils/discovery.ts
- WardrobeItemDetailScreen.tsx
- ErrorBanner.tsx
- candidateGenerator.ts
- catalog/categories.ts
- DevelopmentQuickLogin.tsx
- StylingRecommendationCard.tsx
- OutfitPreferencesScreen.tsx
- react-dom
- styleCompatibilityEngine.ts
- authCallback.ts
- @react-native-async-storage/async-storage
- silhouetteEngine.ts
- react-native-screens
- @react-navigation/native
- @supabase/supabase-js

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

## Communities (133 total, 17 thin omitted)

### Community 0 - "SignInScreen.tsx"
Cohesion: 0.18
Nodes (18): createStyles(), ScreenContainer(), ScreenContainerProps, createStyles(), ForgotPasswordScreen(), Props, omitField(), Props (+10 more)

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
Nodes (18): extractProductsFromHtml(), fixtureDirectory, AnchorRecord, compact(), extractGenericHtmlProducts(), extractOpenGraphProduct(), extractPlatformProducts(), isDecorative() (+10 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.08
Nodes (25): expo, expo-clipboard, expo-dev-client, expo-linking, dependencies, expo, expo-clipboard, expo-dev-client (+17 more)

### Community 7 - "TabNavigators.tsx"
Cohesion: 0.10
Nodes (34): AppScreen(), AppScreenProps, createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup() (+26 more)

### Community 8 - "ExploreScreen.tsx"
Cohesion: 0.15
Nodes (18): createStyles(), ExploreFilterPanel(), FilterSection(), Props, exploreDiscoveryContent, ExploreDiscoveryState, useExploreDiscoveryContent(), createStyles() (+10 more)

### Community 9 - "EditorialPrimitives.tsx"
Cohesion: 0.16
Nodes (19): createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps, EditorialImage(), EditorialImageProps, EditorialSectionHeader() (+11 more)

### Community 10 - "StylistScreen.tsx"
Cohesion: 0.10
Nodes (31): createStyles(), DeferredNotice(), ErrorState(), LoadingState(), MessageState(), MessageStateProps, SkeletonCard(), StateAction (+23 more)

### Community 11 - "wardrobeStore.ts"
Cohesion: 0.07
Nodes (41): buildManualWardrobeInput(), hostname(), isPublicImageUrl(), ManualWardrobeItemErrors, optional(), draft, validateManualWardrobeItem(), createSupabaseWardrobeGateway() (+33 more)

### Community 12 - "catalogDatabase.ts"
Cohesion: 0.13
Nodes (18): CatalogImportError, CatalogOverview, CatalogBrandCategoryRow, CatalogBrandProgressRow, CatalogBrandRow, CatalogBrowseBrandRow, CatalogCategoryRow, CatalogFilterOptionsRow (+10 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStore.ts"
Cohesion: 0.15
Nodes (32): markStartupComplete(), markStartupStep(), AuthService, createAuthService(), isEmailVerified(), createProfileService(), createSupabaseProfileGateway(), AccountActions (+24 more)

### Community 16 - "expo"
Cohesion: 0.06
Nodes (30): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, icon, package, projectId, tsconfigPaths (+22 more)

### Community 17 - "fetch-page.ts"
Cohesion: 0.12
Nodes (25): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+17 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (49): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+41 more)

### Community 19 - "compilerOptions"
Cohesion: 0.09
Nodes (22): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, supabase/functions/_shared/deno-runtime.d.ts, ./supabase/index.ts (+14 more)

### Community 20 - "startupProgress.ts"
Cohesion: 0.07
Nodes (37): AppNavigation(), AppRoot(), calculateDoubleMFillBounds(), DOUBLE_M_BOTTOM, DOUBLE_M_PATHS, DOUBLE_M_TOP, DOUBLE_M_VIEWBOX_SIZE, DoubleMLoader() (+29 more)

### Community 21 - "generator.ts"
Cohesion: 0.17
Nodes (24): CATALOG_BRANDS, CATALOG_SEED, DEFAULT_PRODUCT_COUNT, SYNTHETIC_CATALOG_TIMESTAMP, SYNTHETIC_SOURCE_DOMAIN, CATEGORIES_BY_SLUG, allocateMaterials(), buildProduct() (+16 more)

### Community 22 - "BodyProfileScreen.tsx"
Cohesion: 0.08
Nodes (39): createStyles(), PreferenceChoiceGroup(), PreferenceChoiceGroupProps, togglePreference(), ArrayPreferenceKey, createStyles(), PreferenceSelectionScreen(), PreferenceSelectionScreenProps (+31 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "editorial.ts"
Cohesion: 0.18
Nodes (13): editorialAssets, homeEditorialContent, HomeEditorialState, useHomeEditorialContent(), getHomeEditorialContent(), EDITORIAL_IMAGE_KEYS, EditorialImageKey, EditorialImageSource (+5 more)

### Community 25 - "wardrobeImportService.ts"
Cohesion: 0.22
Nodes (12): errorTitle(), ImportErrorPanel(), Props, importWardrobeUrl(), isErrorCode(), isImportResponse(), logImportStage(), normalizeFunctionError() (+4 more)

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "ActionButton.tsx"
Cohesion: 0.12
Nodes (24): CatalogImportControls(), createStyles(), Props, CatalogJobCard(), createStyles(), Props, CatalogMetricCard(), createStyles() (+16 more)

### Community 28 - "management-actions.ts"
Cohesion: 0.22
Nodes (18): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), CatalogManagementRequestError, CatalogProductEditPatch, compact() (+10 more)

### Community 29 - "ImportPreviewStep.tsx"
Cohesion: 0.13
Nodes (29): EditImportedProductModal(), createStyles(), ImportCompleteStep(), ImportSaveSummary, Props, createStyles(), formatPrice(), ImportedProductCard() (+21 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "browseTypes.ts"
Cohesion: 0.14
Nodes (16): CatalogBrand, CatalogCategory, CatalogPage, CatalogProductDetail, CatalogProductVariant, EMPTY_CATALOG_FILTERS, buildCatalogWardrobeInput(), product (+8 more)

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
Cohesion: 0.17
Nodes (12): FormTextInput, FormTextInputProps, createStyles(), EditFields, EditImportedProductForm(), Props, createStyles(), ImportUrlInputStep() (+4 more)

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

### Community 61 - "AppTheme"
Cohesion: 0.10
Nodes (29): CatalogProductSummary, createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, createStyles(), WardrobeItemCard(), WardrobeItemCardProps, createCatalogInstanceKey() (+21 more)

### Community 62 - "Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Understand the ERR_CONNECTION_REFUSED asset-loading error from React Native Web ImageLoader., Source Nodes

### Community 63 - "getOutfitItems"
Cohesion: 0.13
Nodes (25): STYLING_WEIGHTS, roundScore(), scoreOutfit(), ScoringContext, average(), getTargetWarmth(), weatherCompatibility(), average() (+17 more)

### Community 64 - "seedCatalog.ts"
Cohesion: 0.15
Nodes (12): catalog, client, options, report, requireLookup(), seedCatalog(), upsertBatches(), BODY_TYPE_TAGS_BY_FIT (+4 more)

### Community 65 - "profileService.ts"
Cohesion: 0.10
Nodes (30): isRecord(), mapProfileRow(), mapStyleProfile(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readNullablePositiveNumber() (+22 more)

### Community 66 - "catalogBrowseService.ts"
Cohesion: 0.17
Nodes (22): CatalogBrowseServiceError, loadBrandCategories(), loadBrandFilterOptions(), loadBrandProducts(), loadBrands(), loadCatalogProduct(), loadFeaturedBrands(), mapBrowseBrand() (+14 more)

### Community 67 - "recommendationEngine.ts"
Cohesion: 0.14
Nodes (23): DEFAULT_MAX_CANDIDATES, DEFAULT_RECOMMENDATION_COUNT, reject(), validateOutfitConstraints(), capitalize(), formatRejection(), formatStylingDiagnostics(), jaccard() (+15 more)

### Community 68 - "AddItemDetailsScreen.tsx"
Cohesion: 0.29
Nodes (8): createStyles(), ToggleRow(), ToggleRowProps, createManualDeduplicationKey(), AddItemDetailsScreen(), createStyles(), Props, wardrobeCategories

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
Cohesion: 0.17
Nodes (13): AuthStateChangeHandler, callAuth(), failure(), AuthFlow, ProfileLoadStatus, AuthCallbackKind, AuthCallbackResult, AuthenticationError (+5 more)

### Community 74 - "authErrors.ts"
Cohesion: 0.27
Nodes (11): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+3 more)

### Community 75 - "ResetPasswordScreen.tsx"
Cohesion: 0.24
Nodes (12): createStyles(), omitField(), Props, ResetField, ResetPasswordScreen(), omitField(), Props, SignUpField (+4 more)

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
Cohesion: 0.16
Nodes (18): areOccasionsRelated(), OCCASION_FORMALITY, OCCASION_RELATIONSHIPS, ConstraintResult, average(), occasionCompatibility(), ClothingCategory, ClothingItem (+10 more)

### Community 85 - "catalogAdminService.ts"
Cohesion: 0.23
Nodes (12): CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty(), readString(), toNumberRecord() (+4 more)

### Community 86 - "Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Mix & Match — Small UI Amendment: use Ionicons chevron-back-outline for the Outfit Detail overlay Back button; remove Explore visible search submit controls; submit with keyboard Search/Enter; trim and reset empty queries; preserve Explore search/filter/scroll state on Back., Source Nodes

### Community 87 - "ExploreOutfitDetailScreen.tsx"
Cohesion: 0.16
Nodes (15): createStyles(), ExploreFeedSkeleton(), SKELETON_ITEMS, createStyles(), ExploreFeedCard, ExploreMasonryFeed(), Props, CATEGORY_LABELS (+7 more)

### Community 88 - "stylistStore.ts"
Cohesion: 0.14
Nodes (23): cloneEmptyState(), EMPTY_STYLIST_USER_STATE, isCount(), isFeedbackState(), isRecord(), isSavedLook(), loadStylistUserState(), parseHistory() (+15 more)

### Community 89 - "Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?"
Cohesion: 0.50
Nodes (3): Answer, Outcome, Q: How should the existing Wardrobe, catalog, URL import, navigation, Supabase, and Stylist architecture support a unified Add Clothes flow?

### Community 91 - "CatalogBrandProgressCard.tsx"
Cohesion: 0.47
Nodes (5): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogBrandProgress

### Community 92 - "wardrobe-import/types.ts"
Cohesion: 0.21
Nodes (7): corsHeaders, errorResponse(), jsonResponse(), rateWindows, MAX_IMPORTED_PRODUCTS, WardrobeImportErrorResponse, WardrobeImportResponse

### Community 93 - "useAuthStore"
Cohesion: 0.21
Nodes (12): AuthNavigator(), OnboardingNavigator(), Stack, RootNavigator(), Stack, ONBOARDING_ROUTES, ROOT_ROUTES, OnboardingStackParamList (+4 more)

### Community 94 - "normalize-product.ts"
Cohesion: 0.33
Nodes (11): assignText(), deduplicateProducts(), normalizeCategory(), normalizeImageUrl(), normalizeProduct(), normalizeProducts(), normalizeUrl(), parsePrice() (+3 more)

### Community 95 - "BrandProductsScreen.tsx"
Cohesion: 0.10
Nodes (32): Chip(), ChipProps, createStyles(), createStyles(), InspirationCard(), InspirationCardProps, createStyles(), SearchBar() (+24 more)

### Community 96 - "database.ts"
Cohesion: 0.24
Nodes (8): environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), CatalogDatabaseEnums, CatalogDatabaseFunctions, CatalogDatabaseTables, Database

### Community 97 - "Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Wardrobe Page Update - Remove the "Wardrobe" heading - "Categories" section - "All" "Tops" ... remove the border radius, Source Nodes

### Community 98 - "Q: How should the Double M startup loader integrate with the existing app?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should the Double M startup loader integrate with the existing app?, Source Nodes

### Community 99 - "ProfileScreen.tsx"
Cohesion: 0.09
Nodes (25): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), ActivitySummary(), ActivitySummaryProps, createStyles(), MetricProps, unavailableMetrics, createStyles() (+17 more)

### Community 100 - "OutfitCard.tsx"
Cohesion: 0.14
Nodes (13): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, CategoryFixture, exploreStyles, styleCategories, outfitConcepts (+5 more)

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

### Community 106 - "useAppTheme"
Cohesion: 0.09
Nodes (30): Avatar(), Badge(), createStyles(), StatCard(), createStyles(), SectionHeader(), SectionHeaderProps, EditorialRule() (+22 more)

### Community 107 - "WardrobeToolbar.tsx"
Cohesion: 0.22
Nodes (8): createStyles(), Props, WardrobeLoadingSkeleton(), createStyles(), Props, ToolButtonProps, WardrobeToolbar(), WardrobeViewMode

### Community 108 - "json-ld.ts"
Cohesion: 0.38
Nodes (10): collectProducts(), compact(), firstRecord(), isRecord(), JsonRecord, mapProduct(), normalizeTypes(), readImage() (+2 more)

### Community 109 - "preferenceModel.ts"
Cohesion: 0.18
Nodes (17): applyNeverRecommendFeedback(), applyOutfitFeedback(), FEEDBACK_DELTAS, StylingFeedbackAction, average(), clamp(), getItemSignals(), getOutfitPreferenceSignals() (+9 more)

### Community 110 - "normalizeClothingItem.ts"
Cohesion: 0.21
Nodes (18): CATEGORY_TERMS, normalizeCategory(), tokenize(), normalizeColor(), normalizeToken(), clean(), inferFit(), inferFormality() (+10 more)

### Community 111 - "CatalogFilterPanel.tsx"
Cohesion: 0.29
Nodes (9): CatalogFilterOptions, CatalogProductFilters, CatalogFilterPanel(), createStyles(), FilterSection(), formatLabel(), parsePrice(), Props (+1 more)

### Community 112 - "AddWardrobeItemMenu.tsx"
Cohesion: 0.40
Nodes (4): AddWardrobeItemMenu(), createStyles(), MenuOptionProps, Props

### Community 113 - "colorEngine.ts"
Cohesion: 0.22
Nodes (15): COLOR_ALIASES, COLOR_FAMILIES, COLOR_WHEEL, ColorFamily, NEUTRAL_COLORS, average(), colorCompatibility(), ColorRelationship (+7 more)

### Community 115 - "EditProfileScreen.tsx"
Cohesion: 0.53
Nodes (5): EditProfileScreen(), Props, ProfileSetupScreen(), normalizeDisplayName(), validateDisplayName()

### Community 117 - "utils/discovery.ts"
Cohesion: 0.36
Nodes (5): ExploreFilterCriteria, countSharedValues(), getRelatedExploreItems(), scoreExploreSimilarity(), selected

### Community 118 - "WardrobeItemDetailScreen.tsx"
Cohesion: 0.24
Nodes (9): AppHeader(), AppHeaderProps, createStyles(), createStyles(), IconButton(), IconButtonProps, createStyles(), Props (+1 more)

### Community 119 - "ErrorBanner.tsx"
Cohesion: 0.43
Nodes (5): createStyles(), ErrorBanner(), ErrorBannerProps, createStyles(), EmailVerificationScreen()

### Community 120 - "candidateGenerator.ts"
Cohesion: 0.21
Nodes (12): buildVariations(), CandidateGeneratorOptions, candidatePriority(), createOutfit(), EMPTY_BREAKDOWN, generateOutfitCandidates(), groupItems(), groupSelected() (+4 more)

### Community 121 - "catalog/categories.ts"
Cohesion: 0.33
Nodes (5): apparelSizes, CATALOG_CATEGORIES, footwearSizes, oneSize, CatalogCategoryDefinition

### Community 122 - "DevelopmentQuickLogin.tsx"
Cohesion: 0.67
Nodes (3): createStyles(), DevelopmentQuickLogin(), DevelopmentQuickLoginProps

### Community 123 - "StylingRecommendationCard.tsx"
Cohesion: 0.24
Nodes (7): createStyles(), FeedbackAction, lookTitle(), Props, Styles, StylingRecommendationCard(), OutfitFeedbackState

### Community 124 - "OutfitPreferencesScreen.tsx"
Cohesion: 0.11
Nodes (20): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField(), SelectFieldProps, preferredStyleOptions, itemLabel() (+12 more)

### Community 126 - "styleCompatibilityEngine.ts"
Cohesion: 0.43
Nodes (5): areStylesRelated(), STYLE_INFERENCE_RULES, STYLE_RELATIONSHIPS, average(), styleCompatibility()

### Community 127 - "authCallback.ts"
Cohesion: 0.53
Nodes (4): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback

### Community 129 - "silhouetteEngine.ts"
Cohesion: 0.60
Nodes (3): FIT_COMPATIBILITY, scoreFitPair(), silhouetteCompatibility()

## Knowledge Gaps
- **624 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+619 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `ExploreScreen.tsx` (5× useful, score=3.531681659)
- `TabNavigators.tsx` (3× useful, score=2.090382176)
- `ExploreMasonryFeed.tsx` (3× useful, score=2.090061546)
- `supabase/functions/import-wardrobe-url/index.ts` (2× useful, score=1.699223293)
- `SearchResultsScreen.tsx` (2× useful, score=1.441620113)
- `MainAppNavigator.tsx` (2× useful, score=1.409742221)
- `navigation/types.ts` (2× useful, score=1.409742221)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `SignInScreen.tsx`, `routes.ts`, `theme/index.ts`, `TabNavigators.tsx`, `ExploreScreen.tsx`, `EditorialPrimitives.tsx`, `StylistScreen.tsx`, `startupProgress.ts`, `BodyProfileScreen.tsx`, `ActionButton.tsx`, `ImportPreviewStep.tsx`, `browseTypes.ts`, `ImportUrlInputStep.tsx`, `AppTheme`, `catalogBrowseService.ts`, `AddItemDetailsScreen.tsx`, `ResetPasswordScreen.tsx`, `ExploreOutfitDetailScreen.tsx`, `CatalogBrandProgressCard.tsx`, `useAuthStore`, `BrandProductsScreen.tsx`, `ProfileScreen.tsx`, `OutfitCard.tsx`, `WardrobeToolbar.tsx`, `CatalogFilterPanel.tsx`, `AddWardrobeItemMenu.tsx`, `WardrobeItemDetailScreen.tsx`, `ErrorBanner.tsx`, `DevelopmentQuickLogin.tsx`, `StylingRecommendationCard.tsx`, `OutfitPreferencesScreen.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `SignInScreen.tsx`, `routes.ts`, `theme/index.ts`, `TabNavigators.tsx`, `ExploreScreen.tsx`, `EditorialPrimitives.tsx`, `StylistScreen.tsx`, `BodyProfileScreen.tsx`, `ActionButton.tsx`, `ImportPreviewStep.tsx`, `browseTypes.ts`, `ImportUrlInputStep.tsx`, `AddItemDetailsScreen.tsx`, `ResetPasswordScreen.tsx`, `ExploreOutfitDetailScreen.tsx`, `CatalogBrandProgressCard.tsx`, `BrandProductsScreen.tsx`, `ProfileScreen.tsx`, `OutfitCard.tsx`, `useAppTheme`, `WardrobeToolbar.tsx`, `CatalogFilterPanel.tsx`, `AddWardrobeItemMenu.tsx`, `WardrobeItemDetailScreen.tsx`, `ErrorBanner.tsx`, `DevelopmentQuickLogin.tsx`, `StylingRecommendationCard.tsx`, `OutfitPreferencesScreen.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `validateImportUrl()` connect `fetch-page.ts` to `wardrobeImportService.ts`, `catalog-management/index.ts`, `wardrobe-import/types.ts`, `ImportPreviewStep.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _624 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0953058321479374 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._