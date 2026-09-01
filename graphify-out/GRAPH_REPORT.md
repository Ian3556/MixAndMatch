# Graph Report - MixAndMatch  (2026-09-01)

## Corpus Check
- 220 files · ~125,377 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1316 nodes · 3259 edges · 79 communities (64 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0ce287f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- navigation/types.ts
- AppTheme
- Build Phase 3 — Wardrobe Website URL Import
- theme/index.ts
- normalize-product.ts
- devDependencies
- dependencies
- AppScreen.tsx
- CatalogReviewEditModal.tsx
- useAppTheme
- TabNavigators.tsx
- ImportWardrobeWebsiteScreen.tsx
- InMemoryCatalogClient
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- OutfitDetailScreen.tsx
- catalog-management/index.ts
- compilerOptions
- CatalogDevelopmentScreen.tsx
- SearchResultsScreen.tsx
- _shared/catalog/types.ts
- Mix & Match catalogue database audit
- processJob
- fetch-page.ts
- normalize.ts
- management-actions.ts
- src/catalog/types.ts
- persist.ts
- .prettierrc.json
- graphify reference: extra exports and benchmark
- WardrobeItemDetailScreen.tsx
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
- StateViews.tsx
- catalogAdminService.ts
- enrich.ts
- Phase 2: UI Structuring
- Mix & Match
- scripts
- validate.ts
- authService.ts
- AddItemReviewScreen.tsx
- README.md
- package.json
- Phase 1 architecture
- validate-url.ts
- getSupabaseClient
- authErrors.ts
- OutfitPreferencesScreen.tsx
- profileService.ts
- expo-clipboard
- expo-dev-client
- expo-linking
- CatalogBrandProgressCard.tsx
- react-native
- react-native-screens
- pipeline.ts
- authStore.ts
- supabaseWardrobeGateway.ts
- job-state.ts
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- react-native-url-polyfill
- react-native-safe-area-context

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 140 edges
2. `AppTheme` - 64 edges
3. `ActionButton()` - 37 edges
4. `useAuthStore` - 37 edges
5. `AppScreen()` - 32 edges
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

## Communities (79 total, 15 thin omitted)

### Community 0 - "navigation/types.ts"
Cohesion: 0.06
Nodes (78): ActionButton(), ActionButtonProps, createStyles(), createStyles(), ErrorBanner(), ErrorBannerProps, FormTextInput, FormTextInputProps (+70 more)

### Community 1 - "AppTheme"
Cohesion: 0.11
Nodes (26): createStyles(), IconButton(), IconButtonProps, createStyles(), SearchBar(), SearchBarProps, createStyles(), SectionHeader() (+18 more)

### Community 2 - "Build Phase 3 — Wardrobe Website URL Import"
Cohesion: 0.14
Nodes (14): Build Phase 3 — Wardrobe Website URL Import, Deployment and manual verification, Duplicate strategy, Extraction pipeline, Final architecture, Functional interaction audit, Import UI states and behavior, Known limitations and intentionally deferred work (+6 more)

### Community 3 - "theme/index.ts"
Cohesion: 0.13
Nodes (18): AppNavigation(), AppRoot(), darkColors, lightColors, ThemeColors, Radii, Shadows, Spacing (+10 more)

### Community 4 - "normalize-product.ts"
Cohesion: 0.10
Nodes (40): extractProductsFromHtml(), fixtureDirectory, AnchorRecord, compact(), extractGenericHtmlProducts(), extractOpenGraphProduct(), extractPlatformProducts(), isDecorative() (+32 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-expo, eslint-config-prettier, eslint-plugin-prettier, devDependencies, eslint, eslint-config-expo, eslint-config-prettier (+11 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): expo, dependencies, expo, react, react-dom, @react-native-async-storage/async-storage, react-native-web, @react-navigation/bottom-tabs (+13 more)

### Community 7 - "AppScreen.tsx"
Cohesion: 0.10
Nodes (26): AppHeader(), AppHeaderProps, createStyles(), AppScreen(), AppScreenProps, createStyles(), { testTheme, useAppThemeMock }, createStyles() (+18 more)

### Community 8 - "CatalogReviewEditModal.tsx"
Cohesion: 0.27
Nodes (8): CatalogReviewEditModal(), createStyles(), Props, CatalogReviewItem, createStyles(), ToggleRow(), ToggleRowProps, CatalogProductEditPatch

### Community 9 - "useAppTheme"
Cohesion: 0.07
Nodes (48): createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField(), SelectFieldProps, editorialAssets, resolveEditorialImageSource() (+40 more)

### Community 10 - "TabNavigators.tsx"
Cohesion: 0.08
Nodes (35): isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), AddItemEntryScreen(), createStyles(), inputOptions, Props, roots, sourceFiles (+27 more)

### Community 11 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.05
Nodes (68): ErrorState(), createStyles(), EditFields, EditImportedProductForm(), EditImportedProductModal(), Props, createStyles(), ImportCompleteStep() (+60 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStoreRuntime.ts"
Cohesion: 0.26
Nodes (18): createAuthService(), isEmailVerified(), createProfileService(), createSupabaseProfileGateway(), FlowActions, asInitializationError(), asProfileError(), AuthStoreAccess (+10 more)

### Community 16 - "expo"
Cohesion: 0.09
Nodes (21): package, projectId, tsconfigPaths, expo, android, experiments, extra, ios (+13 more)

### Community 17 - "OutfitDetailScreen.tsx"
Cohesion: 0.22
Nodes (11): Avatar(), Badge(), createStyles(), StatCard(), createStyles(), InspirationDetailScreen(), Props, createStyles() (+3 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.08
Nodes (34): appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow, corsHeaders (+26 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+12 more)

### Community 20 - "CatalogDevelopmentScreen.tsx"
Cohesion: 0.15
Nodes (17): CatalogImportControls(), createStyles(), Props, CatalogJobCard(), createStyles(), Props, CatalogMetricCard(), createStyles() (+9 more)

### Community 21 - "SearchResultsScreen.tsx"
Cohesion: 0.18
Nodes (16): createStyles(), InspirationCard(), InspirationCardProps, EmptyState(), createStyles(), Props, SearchResultsScreen(), createStyles() (+8 more)

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
Cohesion: 0.11
Nodes (19): corsHeaders, errorResponse(), jsonResponse(), rateWindows, assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage() (+11 more)

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "management-actions.ts"
Cohesion: 0.24
Nodes (17): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), CatalogManagementRequestError, compact(), parseCatalogManagementAction() (+9 more)

### Community 28 - "src/catalog/types.ts"
Cohesion: 0.14
Nodes (17): CatalogImportError, CatalogOverview, CatalogBrandProgressRow, CatalogBrandSourceStatus, CatalogDatabaseEnums, CatalogDatabaseFunctions, CatalogDatabaseTables, CatalogImportErrorRow (+9 more)

### Community 29 - "persist.ts"
Cohesion: 0.18
Nodes (10): CatalogPersistenceContext, CatalogPersistenceLookup, IdRow, persistCatalogProduct(), replaceProductDetails(), CatalogRestClient, CatalogRestError, readMessage() (+2 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "WardrobeItemDetailScreen.tsx"
Cohesion: 0.16
Nodes (15): createStyles(), OutfitCard(), OutfitCardProps, createStyles(), primaryActions, Props, StylistScreen(), createStyles() (+7 more)

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

### Community 49 - "StateViews.tsx"
Cohesion: 0.16
Nodes (16): createStyles(), DeferredNotice(), LoadingState(), MessageState(), MessageStateProps, SkeletonCard(), StateAction, createStyles() (+8 more)

### Community 50 - "catalogAdminService.ts"
Cohesion: 0.25
Nodes (11): CatalogAdminServiceError, invokeCatalogManagement(), loadCatalogDashboard(), normalizeCatalogAdminError(), normalizeFunctionError(), readProperty(), readString(), toNumberRecord() (+3 more)

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
Cohesion: 0.16
Nodes (14): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback, AuthService, AuthStateChangeHandler, callAuth(), failure() (+6 more)

### Community 57 - "AddItemReviewScreen.tsx"
Cohesion: 0.19
Nodes (12): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, AddItemImageScreen(), createStyles(), Props, AddItemReviewScreen(), createStyles() (+4 more)

### Community 59 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, main, name, private, version

### Community 60 - "Phase 1 architecture"
Cohesion: 0.33
Nodes (6): Application composition, Authentication boundary, Authentication-state lifecycle, Navigation protection, Phase 1 architecture, Profile strategy

### Community 61 - "validate-url.ts"
Cohesion: 0.32
Nodes (10): resolvePublicDns(), BLOCKED_HOSTNAMES, failure(), isUnsafeHostname(), isUnsafeIpAddress(), isUnsafeIpv4(), MAX_IMPORT_URL_LENGTH, parseIpv4() (+2 more)

### Community 62 - "getSupabaseClient"
Cohesion: 0.33
Nodes (7): environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), AuthBootstrap(), getSupabaseClient(), startSupabaseAutoRefresh()

### Community 63 - "authErrors.ts"
Cohesion: 0.42
Nodes (9): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+1 more)

### Community 64 - "OutfitPreferencesScreen.tsx"
Cohesion: 0.27
Nodes (7): Chip(), ChipProps, createStyles(), createStyles(), OutfitPreferencesScreen(), PreferenceStyles, Props

### Community 65 - "profileService.ts"
Cohesion: 0.15
Nodes (16): normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readStringProperty(), fetchById, row, service (+8 more)

### Community 69 - "CatalogBrandProgressCard.tsx"
Cohesion: 0.47
Nodes (5): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogBrandProgress

### Community 72 - "pipeline.ts"
Cohesion: 0.21
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), processCatalogCandidates(), CatalogDuplicate (+3 more)

### Community 73 - "authStore.ts"
Cohesion: 0.12
Nodes (20): AccountActions, createAuthAccountActions(), createAuthFlowActions(), AuthFlow, AuthSnapshot, AuthStateError, createSignedOutSnapshot(), ProfileLoadStatus (+12 more)

### Community 74 - "supabaseWardrobeGateway.ts"
Cohesion: 0.40
Nodes (3): WardrobeUpdate, OperationTimedOutError, withTimeout()

### Community 75 - "job-state.ts"
Cohesion: 0.53
Nodes (4): selectNextCatalogJobEntries(), summarizeCatalogJobEntries(), entries, CatalogJobEntryState

### Community 76 - "Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?, Source Nodes

## Knowledge Gaps
- **429 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+424 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `navigation/types.ts`, `OutfitPreferencesScreen.tsx`, `AppTheme`, `theme/index.ts`, `WardrobeItemDetailScreen.tsx`, `CatalogBrandProgressCard.tsx`, `AppScreen.tsx`, `CatalogReviewEditModal.tsx`, `TabNavigators.tsx`, `ImportWardrobeWebsiteScreen.tsx`, `OutfitDetailScreen.tsx`, `StateViews.tsx`, `CatalogDevelopmentScreen.tsx`, `SearchResultsScreen.tsx`, `AddItemReviewScreen.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `navigation/types.ts`, `OutfitPreferencesScreen.tsx`, `WardrobeItemDetailScreen.tsx`, `theme/index.ts`, `CatalogBrandProgressCard.tsx`, `AppScreen.tsx`, `CatalogReviewEditModal.tsx`, `useAppTheme`, `TabNavigators.tsx`, `ImportWardrobeWebsiteScreen.tsx`, `OutfitDetailScreen.tsx`, `StateViews.tsx`, `CatalogDevelopmentScreen.tsx`, `SearchResultsScreen.tsx`, `AddItemReviewScreen.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `validateImportUrl()` connect `validate-url.ts` to `fetch-page.ts`, `catalog-management/index.ts`, `ImportWardrobeWebsiteScreen.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _429 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `navigation/types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055705300988319856 - nodes in this community are weakly interconnected._
- **Should `AppTheme` be split into smaller, more focused modules?**
  _Cohesion score 0.11229946524064172 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._