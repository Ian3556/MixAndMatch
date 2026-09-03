# Graph Report - MixAndMatch  (2026-09-02)

## Corpus Check
- 230 files · ~128,073 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1357 nodes · 3354 edges · 79 communities (64 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af44a638`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ActionButton.tsx
- AppTheme
- Build Phase 3 — Wardrobe Website URL Import
- theme.ts
- normalize-product.ts
- devDependencies
- dependencies
- ProfileScreen.tsx
- CatalogReviewEditModal.tsx
- HomeScreen.tsx
- TabNavigators.tsx
- ImportWardrobeWebsiteScreen.tsx
- InMemoryCatalogClient
- What You Must Do When Invoked
- Phase 2 Implementation Report
- authStoreRuntime.ts
- expo
- useAppTheme
- catalog-management/index.ts
- compilerOptions
- CatalogJobCard.tsx
- ExploreScreen.tsx
- _shared/catalog/types.ts
- Mix & Match catalogue database audit
- ImportPreviewStep.tsx
- fetch-page.ts
- normalize.ts
- management-actions.ts
- src/catalog/types.ts
- ImportUrlInputStep.tsx
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
- CatalogDevelopmentScreen.tsx
- catalogAdminService.ts
- enrich.ts
- Phase 2: UI Structuring
- Mix & Match
- scripts
- validate.ts
- authService.ts
- fixtures.test.ts
- README.md
- package.json
- Phase 1 architecture
- validate-url.ts
- getSupabaseClient
- authErrors.ts
- theme/index.ts
- profileService.ts
- expo-clipboard
- authCallback.ts
- expo-linking
- Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?
- react-native
- react-native-screens
- pipeline.ts
- authState.ts
- wardrobeService.ts
- react
- Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?
- react-native-url-polyfill
- react-native-safe-area-context

## God Nodes (most connected - your core abstractions)
1. `useAppTheme()` - 148 edges
2. `AppTheme` - 67 edges
3. `ActionButton()` - 37 edges
4. `useAuthStore` - 37 edges
5. `AppScreen()` - 32 edges
6. `showDeferredNotice()` - 29 edges
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

### Community 0 - "ActionButton.tsx"
Cohesion: 0.05
Nodes (76): CatalogImportControls(), createStyles(), Props, ActionButton(), ActionButtonProps, createStyles(), createStyles(), ErrorBanner() (+68 more)

### Community 1 - "AppTheme"
Cohesion: 0.14
Nodes (20): AppHeader(), AppHeaderProps, createStyles(), AppScreenProps, createStyles(), IconButton(), IconButtonProps, createStyles() (+12 more)

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
Cohesion: 0.10
Nodes (21): expo, expo-dev-client, dependencies, expo, expo-dev-client, react-dom, @react-native-async-storage/async-storage, react-native-web (+13 more)

### Community 7 - "ProfileScreen.tsx"
Cohesion: 0.14
Nodes (25): AppScreen(), createStyles(), createStyles(), SettingRow(), SettingRowProps, createStyles(), SettingsGroup(), AboutScreen() (+17 more)

### Community 8 - "CatalogReviewEditModal.tsx"
Cohesion: 0.31
Nodes (7): CatalogReviewEditModal(), createStyles(), Props, createStyles(), ToggleRow(), ToggleRowProps, CatalogProductEditPatch

### Community 9 - "HomeScreen.tsx"
Cohesion: 0.08
Nodes (40): editorialAssets, createStyles(), EditorialAction(), EditorialActionProps, EditorialEmptyState(), EditorialEmptyStateProps, EditorialImage(), EditorialImageProps (+32 more)

### Community 10 - "TabNavigators.tsx"
Cohesion: 0.07
Nodes (41): createStyles(), OutfitGeneratingScreen(), Props, OutfitGoalScreen(), Props, AddItemEntryScreen(), createStyles(), inputOptions (+33 more)

### Community 11 - "ImportWardrobeWebsiteScreen.tsx"
Cohesion: 0.21
Nodes (17): applySaveResults(), buildWardrobeInputs(), createImportDeduplicationKey(), createImportPreview(), summarizeSaveResults(), candidate, updateImportCandidate(), ImportWardrobeWebsiteScreen() (+9 more)

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "Phase 2 Implementation Report"
Cohesion: 0.08
Nodes (23): Added, Component inventory, Created: development authentication testing, Created: fixtures, navigation, types, utilities, and documentation, Created: Home and Explore, Created: Profile and Settings, Created: shared UI, Created: Stylist (+15 more)

### Community 15 - "authStoreRuntime.ts"
Cohesion: 0.17
Nodes (27): AuthService, createAuthService(), isEmailVerified(), createSupabaseProfileGateway(), AccountActions, createAuthAccountActions(), createAuthFlowActions(), FlowActions (+19 more)

### Community 16 - "expo"
Cohesion: 0.09
Nodes (21): package, projectId, tsconfigPaths, expo, android, experiments, extra, ios (+13 more)

### Community 17 - "useAppTheme"
Cohesion: 0.14
Nodes (27): createStyles(), PlaceholderArtwork(), PlaceholderArtworkProps, Avatar(), Badge(), createStyles(), StatCard(), createStyles() (+19 more)

### Community 18 - "catalog-management/index.ts"
Cohesion: 0.06
Nodes (63): appendCheckpointId(), appendManualCheckpoint(), authenticateCatalogDeveloper(), BrandRow, BrandSourceRow, canPersistRejectedProduct(), CatalogManagementError, CategoryRow (+55 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): ./*, expo/tsconfig.base, node, ./supabase/*, supabase/functions/catalog-management/index.ts, supabase/functions/import-wardrobe-url/index.ts, ./supabase/index.ts, **/*.ts (+12 more)

### Community 20 - "CatalogJobCard.tsx"
Cohesion: 0.22
Nodes (9): CatalogJobCard(), createStyles(), Props, CatalogReviewCard(), createStyles(), Props, CatalogRecentJob, CatalogReviewItem (+1 more)

### Community 21 - "ExploreScreen.tsx"
Cohesion: 0.06
Nodes (50): createStyles(), InspirationCard(), InspirationCardProps, createStyles(), SearchBar(), SearchBarProps, createStyles(), ExploreFeedSkeleton() (+42 more)

### Community 22 - "_shared/catalog/types.ts"
Cohesion: 0.13
Nodes (14): CATALOG_ENRICHMENT_VERSION, CATALOG_NORMALIZATION_VERSION, CatalogGender, CatalogImageType, CatalogProductDecision, CatalogSourceType, CatalogStyleProfile, CatalogStyleTag (+6 more)

### Community 23 - "Mix & Match catalogue database audit"
Cohesion: 0.09
Nodes (22): Affected files, Brand rollout and source governance, Categories and styles, Colour-variant strategy, Current application architecture, Current taxonomy, style, images, and recommendations, Exact migration plan, Executive decision (+14 more)

### Community 24 - "ImportPreviewStep.tsx"
Cohesion: 0.16
Nodes (16): EditImportedProductModal(), createStyles(), ImportCompleteStep(), ImportSaveSummary, Props, createStyles(), formatPrice(), ImportedProductCard() (+8 more)

### Community 25 - "fetch-page.ts"
Cohesion: 0.12
Nodes (20): corsHeaders, errorResponse(), jsonResponse(), rateWindows, assertHttpStatus(), assertPublicResolution(), FetchedHtmlPage, fetchHtmlPage() (+12 more)

### Community 26 - "normalize.ts"
Cohesion: 0.20
Nodes (22): COLOR_RULES, createCatalogDeduplicationKey(), matchColor(), MATERIAL_RULES, normalizeCatalogProduct(), normalizeColor(), normalizeCurrency(), normalizeDomain() (+14 more)

### Community 27 - "management-actions.ts"
Cohesion: 0.24
Nodes (17): assignCandidatePrice(), assignCandidateString(), assignOptionalNullableNumber(), assignOptionalNullableString(), assignOptionalString(), CatalogManagementRequestError, compact(), parseCatalogManagementAction() (+9 more)

### Community 28 - "src/catalog/types.ts"
Cohesion: 0.11
Nodes (22): CatalogBrandProgressCard(), createStyles(), formatSlug(), Props, CatalogBrandProgress, CatalogImportError, CatalogOverview, CatalogBrandProgressRow (+14 more)

### Community 29 - "ImportUrlInputStep.tsx"
Cohesion: 0.20
Nodes (14): errorTitle(), ImportErrorPanel(), Props, createStyles(), ImportUrlInputStep(), Props, importWardrobeUrl(), isErrorCode() (+6 more)

### Community 30 - ".prettierrc.json"
Cohesion: 0.20
Nodes (9): arrowParens, bracketSpacing, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma (+1 more)

### Community 31 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 32 - "WardrobeItemDetailScreen.tsx"
Cohesion: 0.15
Nodes (16): { testTheme, useAppThemeMock }, createStyles(), OutfitCard(), OutfitCardProps, createStyles(), SectionHeader(), SectionHeaderProps, createStyles() (+8 more)

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

### Community 49 - "CatalogDevelopmentScreen.tsx"
Cohesion: 0.26
Nodes (9): CatalogMetricCard(), createStyles(), useCatalogAdminStore, EmptyState(), isCatalogDevToolsEnabled(), resolveCatalogDevToolsEnabled(), CatalogDevelopmentScreen(), createStyles() (+1 more)

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
Cohesion: 0.22
Nodes (10): AuthStateChangeHandler, callAuth(), failure(), AuthCallbackKind, AuthCallbackResult, AuthenticationError, AuthenticationErrorCode, AuthenticationResult (+2 more)

### Community 57 - "fixtures.test.ts"
Cohesion: 0.23
Nodes (8): CategoryFixture, exploreStyles, styleCategories, wardrobeCategories, quickStylingPrompts, stylingTips, WardrobeItemFixture, wardrobeItems

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
Cohesion: 0.19
Nodes (10): AppNavigation(), AppRoot(), environment, isSupabaseConfigured(), PublicEnvironment, requireSupabaseEnvironment(), AuthBootstrap(), AppThemeProvider() (+2 more)

### Community 63 - "authErrors.ts"
Cohesion: 0.32
Nodes (10): createAuthenticationError(), createInvalidSessionError(), createRecoveryExpiredError(), createSessionExpiredError(), createVerificationLinkError(), isAccountNotFoundError(), normalizeAuthenticationError(), readNumberProperty() (+2 more)

### Community 64 - "theme/index.ts"
Cohesion: 0.12
Nodes (17): Chip(), ChipProps, createStyles(), createStyles(), OptionSheet(), OptionSheetProps, createStyles(), SelectField() (+9 more)

### Community 65 - "profileService.ts"
Cohesion: 0.13
Nodes (18): createProfileService(), normalizeProfileError(), ProfileGateway, ProfileGatewayResult, ProfileService, readStringProperty(), fetchById, row (+10 more)

### Community 67 - "authCallback.ts"
Cohesion: 0.53
Nodes (4): collectUrlParameters(), copyParameters(), parseAuthCallback(), ParsedAuthCallback

### Community 69 - "Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How is the current Home Page implemented, including routing, navigation, loading, images, theme, data, and layout?, Source Nodes

### Community 72 - "pipeline.ts"
Cohesion: 0.21
Nodes (11): DEFINITIONS, phaseACatalogProducts, PhaseAFixtureDefinition, deduplicateCatalogProducts(), normalizeIdentity(), productsMatch(), processCatalogCandidates(), CatalogDuplicate (+3 more)

### Community 73 - "authState.ts"
Cohesion: 0.23
Nodes (10): AuthFlow, AuthSnapshot, createSignedOutSnapshot(), ProfileLoadStatus, authenticatedSnapshot(), incompleteProfile, session, user (+2 more)

### Community 74 - "wardrobeService.ts"
Cohesion: 0.15
Nodes (16): createSupabaseWardrobeGateway(), createWardrobeService(), mapWardrobeRow(), normalizeWardrobeError(), nullable(), readStringProperty(), row, toWardrobeInsert() (+8 more)

### Community 76 - "Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How does the development catalogue integrate with the existing Mix and Match wardrobe flow?, Source Nodes

## Knowledge Gaps
- **436 isolated node(s):** `arrowParens`, `bracketSpacing`, `endOfLine`, `printWidth`, `semi` (+431 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAppTheme()` connect `useAppTheme` to `ActionButton.tsx`, `AppTheme`, `theme/index.ts`, `WardrobeItemDetailScreen.tsx`, `theme.ts`, `ProfileScreen.tsx`, `CatalogReviewEditModal.tsx`, `HomeScreen.tsx`, `TabNavigators.tsx`, `CatalogDevelopmentScreen.tsx`, `CatalogJobCard.tsx`, `ExploreScreen.tsx`, `ImportPreviewStep.tsx`, `src/catalog/types.ts`, `ImportUrlInputStep.tsx`, `getSupabaseClient`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Why does `AppTheme` connect `AppTheme` to `ActionButton.tsx`, `theme/index.ts`, `WardrobeItemDetailScreen.tsx`, `theme.ts`, `ProfileScreen.tsx`, `CatalogReviewEditModal.tsx`, `HomeScreen.tsx`, `TabNavigators.tsx`, `CatalogDevelopmentScreen.tsx`, `useAppTheme`, `CatalogJobCard.tsx`, `ExploreScreen.tsx`, `ImportPreviewStep.tsx`, `src/catalog/types.ts`, `ImportUrlInputStep.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `CatalogManagementAction` connect `CatalogJobCard.tsx` to `ActionButton.tsx`, `CatalogDevelopmentScreen.tsx`, `catalogAdminService.ts`, `catalog-management/index.ts`, `management-actions.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `arrowParens`, `bracketSpacing`, `endOfLine` to the rest of the system?**
  _436 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ActionButton.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05267326732673267 - nodes in this community are weakly interconnected._
- **Should `AppTheme` be split into smaller, more focused modules?**
  _Cohesion score 0.14461538461538462 - nodes in this community are weakly interconnected._
- **Should `Build Phase 3 — Wardrobe Website URL Import` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._