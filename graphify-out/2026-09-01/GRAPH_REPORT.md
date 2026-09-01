# Graph Report - MixAndMatch  (2026-08-08)

## Corpus Check
- 210 files · ~82,475 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1266 nodes · 3162 edges · 73 communities (58 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0ce287f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuthStore
- AppTheme
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- normalize-product.ts
- devDependencies
- dependencies
- navigation/types.ts
- AddItemDetailsScreen.tsx
- ImportWardrobeWebsiteScreen.tsx
- routes.ts
- wardrobeService.ts
- InMemoryCatalogClient
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- useAppTheme
- catalog-management/index.ts
- compilerOptions
- CatalogDevelopmentScreen.tsx
- _shared/catalog/types.ts
- Mix & Match catalogue database audit
- fetch-page.ts
- normalize.ts
- management-actions.ts
- src/catalog/types.ts
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
- generic-structured-data.ts
- Mix & Match catalogue database
- TabNavigators.tsx
- wardrobe-import/types.ts
- enrich.ts
- Phase 2: UI Structuring
- Mix & Match
- scripts
- validate.ts
- authService.ts
- AppScreen.tsx
- README.md
- package.json
- Phase 1 architecture
- EditImportedProductModal.tsx
- ImportPreviewStep.tsx
- profileService.ts
- expo-clipboard
- expo-dev-client
- expo-linking
- react
- react-native
- react-native-screens
- pipeline.ts
- authStore.ts
- ImportUrlInputStep.tsx
- authCallback.ts
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- react-native-safe-area-context

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 129 edges
2. `AppTheme` - 60 edges
3. `useAuthStore` - 39 edges
4. `ActionButton()` - 37 edges
5. `AppScreen()` - 33 edges
6. `showDeferredNotice()` - 31 edges
7. `DeferredNotice()` - 20 edges
8. `normalizeCatalogProduct()` - 20 edges
9. `Mix & Match catalogue database` - 18 edges
10. `processEntry()` - 16 edges

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

## Communities (73 total, 15 thin omitted)

### Community 0 - "useAuthStore"
Cohesion: 0.06
Nodes (62): createStyles(), ErrorBanner(), ErrorBannerProps, FormTextInput, FormTextInputProps, createStyles(), ScreenContainer(), ScreenContainerProps (+54 more)

### Community 1 - "AppTheme"
Cohesion: 0.09
Nodes (42): Chip(), ChipProps, createStyles(), createStyles(), IconButton(), IconButtonProps, createStyles(), InspirationCard() (+34 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.15
Nodes (18): createStyles(), OptionSheet(), OptionSheetProps, darkColors, lightColors, ThemeColors, Radii, Shadows (+10 more)

### Community 4 - "normalize-product.ts"
Cohesion: 0.11
Nodes (38): extractProductsFromHtml(), fixtureDirectory, AnchorRecord, compact(), extractGenericHtmlProducts(), extractOpenGraphProduct(), extractPlatformProducts(), isDecorative() (+30 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): expo, dependencies, expo, react-dom, @react-native-async-storage/async-storage, react-native-url-polyfill, react-native-web, @react-navigation/bottom-tabs (+13 more)

### Community 7 - "navigation/types.ts"
Cohesion: 0.13
Nodes (28): AppScreen(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup(), DeferredNotice(), AboutScreen() (+20 more)

### Community 8 - "AddItemDetailsScreen.tsx"
Cohesion: 0.27
Nodes (8): createStyles(), ToggleRow(), ToggleRowProps, AddItemDetailsScreen(), createStyles(), initialDraft, Props, DraftWardrobeItem

### Community 9 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.26
Nodes (14): applySaveResults(), buildWardrobeInputs(), createImportDeduplicationKey(), createImportPreview(), summarizeSaveResults(), candidate, updateImportCandidate(), ImportWardrobeWebsiteScreen() (+6 more)

### Community 10 - "routes.ts"
Cohesion: 0.13
Nodes (19): roots, sourceFiles, MainAppNavigator(), Tabs, getTabConfig(), MAIN_TAB_CONFIG, TabIconKey, EXPLORE_ROUTES (+11 more)

### Community 11 - "wardrobeService.ts"
Cohesion: 0.14
Nodes (18): createSupabaseWardrobeGateway(), createWardrobeService(), mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty(), row, toWardrobeInsert() (+10 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStoreRuntime.ts"
Cohesion: 0.28
Nodes (17): createAuthService(), isEmailVerified(), createSupabaseProfileGateway(), FlowActions, asInitializationError(), asProfileError(), AuthStoreAccess, createSessionExpiredError() (+9 more)

### Community 16 - "expo"
Cohesion: 0.09
Nodes (21): package, projectId, tsconfigPaths, expo, android, experiments, extra, ios (+13 more)

### Community 17 - "useAppTheme"
Cohesion: 0.16
Nodes (22): Avatar(), Badge(), createStyles(), StatCard(), createStyles(), ErrorState(), LoadingState(), MessageState() (+14 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.06
Nodes (63): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+55 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+12 more)

### Community 20 - "CatalogDevelopmentScreen.tsx"
Cohesion: 0.11
Nodes (25): CatalogImportControls(), createStyles(), Props, CatalogJobCard(), createStyles(), Props, CatalogMetricCard(), createStyles() (+17 more)

### Community 22 - "_shared/catalog/types.ts"
Cohesion: 0.13
Nodes (14): CATALOG_ENRICHMENT_VERSION, CATALOG_NORMALIZATION_VERSION, CatalogGender, CatalogImageType, CatalogProductDecision, CatalogSourceType, CatalogStyleProfile, CatalogStyleTag (+6 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 25 - "fetch-page.ts"
Cohesion: 0.13
Nodes (24): assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage(), FetchPageDependencies, IMPORT_FETCH_TIMEOUT_MS, IMPORT_MAX_REDIRECTS, IMPORT_MAX_RESPONSE_BYTES (+16 more)

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "management-actions.ts"
Cohesion: 0.22
Nodes (18): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), CatalogManagementRequestError, CatalogProductEditPatch, compact() (+10 more)

### Community 28 - "src/catalog/types.ts"
Cohesion: 0.06
Nodes (44): AppNavigation(), AppRoot(), CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogAdminServiceError, invokeCatalogManagement() (+36 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "StylistScreen.tsx"
Cohesion: 0.12
Nodes (21): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, createStyles(), SectionHeader(), SectionHeaderProps, createStyles() (+13 more)

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

### Community 47 - "generic-structured-data.ts"
Cohesion: 0.22
Nodes (7): EXTRACTION_METHODS, GenericStructuredDataAdapter, fixtureDirectory, CatalogExtractionMethod, CatalogImporterAdapter, CatalogImportSource, ExtractionMethod

### Community 48 - "Mix & Match catalogue database"
Cohesion: 0.11
Nodes (18): Add Brand 31, Architecture, Current limitations, Development dashboard, Import adapters, Manual seeding, Mix & Match catalogue database, Normalization and enrichment (+10 more)

### Community 49 - "TabNavigators.tsx"
Cohesion: 0.12
Nodes (21): createStyles(), SelectField(), SelectFieldProps, AppearanceSettingsScreen(), createStyles(), OutfitGeneratingScreen(), Props, OutfitGoalScreen() (+13 more)

### Community 50 - "wardrobe-import/types.ts"
Cohesion: 0.21
Nodes (8): corsHeaders, errorResponse(), jsonResponse(), rateWindows, MAX_IMPORTED_PRODUCTS, RawProductCandidate, WardrobeImportErrorResponse, WardrobeImportResponse

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

### Community 56 - "authService.ts"
Cohesion: 0.15
Nodes (21): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+13 more)

### Community 57 - "AppScreen.tsx"
Cohesion: 0.09
Nodes (25): AppHeader(), AppHeaderProps, createStyles(), AppScreenProps, createStyles(), EmptyState(), AddItemEntryScreen(), createStyles() (+17 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 62 - "EditImportedProductModal.tsx"
Cohesion: 0.40
Nodes (5): createStyles(), EditFields, EditImportedProductForm(), EditImportedProductModal(), Props

### Community 64 - "ImportPreviewStep.tsx"
Cohesion: 0.17
Nodes (15): createStyles(), ImportCompleteStep(), ImportSaveSummary, Props, createStyles(), formatPrice(), ImportedProductCard(), Props (+7 more)

### Community 65 - "profileService.ts"
Cohesion: 0.15
Nodes (17): createProfileService(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readStringProperty(), fetchById, row (+9 more)

### Community 72 - "pipeline.ts"
Cohesion: 0.21
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), processCatalogCandidates(), CatalogDuplicate (+3 more)

### Community 73 - "authStore.ts"
Cohesion: 0.12
Nodes (20): AuthService, AccountActions, createAuthAccountActions(), createAuthFlowActions(), AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot() (+12 more)

### Community 74 - "ImportUrlInputStep.tsx"
Cohesion: 0.20
Nodes (14): errorTitle(), ImportErrorPanel(), Props, createStyles(), ImportUrlInputStep(), Props, importWardrobeUrl(), isErrorCode() (+6 more)

### Community 75 - "authCallback.ts"
Cohesion: 0.53
Nodes (4): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback

### Community 76 - "Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?, Source Nodes

## Knowledge Gaps
- **410 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+405 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `useAuthStore`, `AppTheme`, `StylistScreen.tsx`, `theme/index.ts`, `ImportPreviewStep.tsx`, `navigation/types.ts`, `AddItemDetailsScreen.tsx`, `ImportUrlInputStep.tsx`, `routes.ts`, `TabNavigators.tsx`, `CatalogDevelopmentScreen.tsx`, `AppScreen.tsx`, `src/catalog/types.ts`, `EditImportedProductModal.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `useAuthStore`, `StylistScreen.tsx`, `ImportPreviewStep.tsx`, `theme/index.ts`, `navigation/types.ts`, `AddItemDetailsScreen.tsx`, `ImportUrlInputStep.tsx`, `routes.ts`, `useAppTheme`, `TabNavigators.tsx`, `CatalogDevelopmentScreen.tsx`, `AppScreen.tsx`, `src/catalog/types.ts`, `EditImportedProductModal.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `getSupabaseClient()` connect `src/catalog/types.ts` to `profileService.ts`, `ImportUrlInputStep.tsx`, `wardrobeService.ts`, `authStoreRuntime.ts`, `authService.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _410 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.06406112253893623 - nodes in this community are weakly interconnected._
- **Should `AppTheme` be split into smaller, more focused modules?**
  _Cohesion score 0.08821548821548822 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._