# Build Phase 3 — Wardrobe Website URL Import

## Outcome

Phase 3 replaces the Wardrobe fixture boundary with an authenticated, user-owned wardrobe and a
server-side website import workflow. A user can submit a public product or collection URL, review
normalized candidates, select and edit them, open their sources, persist selected items, and see
the saved wardrobe immediately.

The implementation is production-aware but requires the Phase 3 Supabase migration and Edge
Function to be deployed before a live retailer URL can work. Local automated verification uses
controlled HTML fixtures and never calls retailer websites.

## Repository architecture discovered

- Expo SDK 57 / React Native 0.86 / React 19, built from `App.tsx` and `src/app/AppRoot.tsx`.
- React Navigation 7 native stacks and bottom tabs; the project does **not** use Expo Router.
- Expo web uses Metro and `npx expo export -p web`; Vercel serves the static `dist` directory with
  an SPA rewrite. There is no server output or supported Expo API-route runtime.
- Supabase Auth is required before the five-tab application mounts.
- Supabase services and typed gateways are the existing remote-data convention.
- Zustand is the existing client-state convention.
- Native Supabase sessions use AsyncStorage. Wardrobe records are persisted in Supabase rather
  than a second local database, so the same authenticated wardrobe is shared by iOS, Android, and
  web.
- Before Phase 3, Wardrobe content was deterministic fixture data and no wardrobe persistence
  existed.

## Final architecture

The external fetch runs in `supabase/functions/import-wardrobe-url/index.ts`. A static Expo client
cannot safely fetch arbitrary retailer HTML, and the current Vercel configuration has no API
runtime, so a Supabase Edge Function is the smallest compatible trusted boundary.

```text
Authenticated Expo client
  -> local URL syntax/scheme/private-host validation
  -> Supabase functions.invoke("import-wardrobe-url") with user JWT
  -> Edge Function verifies the user and rate limit
  -> validate URL and public DNS resolution
  -> bounded manual-redirect HTML fetch
  -> JSON-LD / Open Graph / platform / HTML extraction pipeline
  -> normalize, deduplicate, cap at 50
  -> typed preview response
  -> user selects and edits products
  -> wardrobe service inserts items with authenticated user ID
  -> Postgres unique constraint and RLS enforce ownership and duplicates
  -> Zustand store updates immediately; focus refresh reloads persisted rows
```

The client never receives or uses a service-role key. The wardrobe service derives `user_id` from
the authenticated application state and database RLS independently verifies `auth.uid()`.

## URL safety rules

The shared validator and Edge Function implement:

- whitespace trimming and `https://` normalization for valid hostnames without a protocol;
- HTTP/HTTPS allow-listing and rejection of credentials, malformed/excessive URLs, unsupported
  schemes, single-label/internal names, `.local`, `.internal`, localhost, metadata names,
  loopback, private, carrier-grade NAT, link-local, documentation-sensitive local families,
  multicast, and reserved local IPv4/IPv6 ranges;
- DNS-over-HTTPS A/AAAA resolution with fail-closed rejection when no public address resolves;
- validation of every redirect with a maximum of three redirects;
- a 12-second fetch timeout, 3 MiB decoded response limit, HTML content-type allow list, and manual
  response streaming;
- fixed `Accept` and importer `User-Agent` headers only—no user cookies, auth headers, or arbitrary
  client headers are forwarded to retailers;
- authenticated invocation and a best-effort per-user limit of 10 requests per minute per warm
  Edge Function isolate;
- safe structured error codes and messages without parser stacks.

The Edge Function calls the Supabase Auth user endpoint with the bearer token to obtain the trusted
user identity. Hosted Supabase JWT verification should remain enabled as an additional boundary.

## Extraction pipeline

Extraction layers run in priority order and are deduplicated after normalization:

1. **JSON-LD** — `Product`, arrays, `@graph`, `ItemList`, `ListItem`, `Offer`, `AggregateOffer`,
   strings/arrays/`ImageObject`, and string/object brands. Malformed blocks are isolated.
2. **Open Graph/product metadata** — product-marked individual pages with title, image, URL,
   description, price, currency, brand, availability, and canonical metadata.
3. **Recognized platform markup** — isolated Shopify-like `/products/` and WooCommerce product-link
   detection.
4. **Conservative HTML heuristics** — repeated product-like anchors that contain a product link,
   image, and usable name. Logo, banner, icon, navigation, advertisement, and payment imagery is
   rejected.

Relative links resolve against the final fetched URL. The importer does not follow product links
from a collection page and does not paginate or crawl a domain.

## Supported and unsupported page types

Supported when the source is publicly server-readable:

- an individual product page;
- a category, collection, listing, or search-results page;
- JSON-LD, Open Graph product metadata, recognizable Shopify/WooCommerce markup, or conservative
  repeated product-card HTML;
- up to 50 normalized candidates from one submitted page.

Intentionally unsupported:

- private carts/accounts or login-required pages;
- CAPTCHAs, Cloudflare challenges, paywalls, bot defenses, or other access controls;
- client-only catalogues whose products are absent from returned HTML;
- browser automation, Playwright, full-domain crawling, unlimited pagination, product-page
  follow-up crawling, background scraping, or entire-site downloads;
- non-HTML documents and responses larger than the configured safety limit.

Unsupported or empty pages return an honest result and expose **Try another URL** and **Add item
manually** paths.

## Normalized product and persistence model

Imported candidates retain name, description, brand, image/product/canonical URLs, category,
subcategory, colour, price/currency, availability, source domain, extraction method, confidence,
and source product ID when available.

`public.wardrobe_items` persists:

- user ownership and UUID;
- manual/imported metadata used by the existing wardrobe form;
- image/source URL, source domain, external product ID, price, and currency;
- `manual` or `website-url` import method;
- a deterministic deduplication key;
- favourite state and created/updated timestamps.

The migration grants authenticated CRUD only, enables RLS, and creates own-row `SELECT`, `INSERT`,
`UPDATE`, and `DELETE` policies. A trigger owns `updated_at`. `user_id` cascades from `auth.users`.

## Duplicate strategy

Extraction candidates are deduplicated by canonical URL, normalized/tracking-cleaned product URL,
source-domain plus external ID, then normalized name plus image. Separate external IDs are retained
when the source explicitly identifies variants.

Persistence uses a deterministic key based on the cleaned canonical/product URL plus source variant
ID when available, then external ID, then name/image. `(user_id, deduplication_key)` is unique in
Postgres, so concurrent/repeated client submissions cannot bypass the duplicate boundary. Preview
duplicates start unselected, database duplicate conflicts are reported per item, and failed items
remain selected.

## Import UI states and behavior

The single `ImportWardrobeWebsite` stack route owns input, preview, partial-save, and completion
states. It includes Paste, Clear, Analyse URL, retry, manual fallback, Select all, Deselect all,
per-item checkbox, Edit, Open source, Add selected, Back, Cancel, and completion actions.

- Input and save refs prevent repeated submissions before React state can rerender.
- Busy controls expose disabled/busy accessibility state.
- Loading uses meaningful activity copy without fake percentages.
- Selection uses a checkbox role and checked state, not colour alone.
- The edit modal focuses its name input when shown and supports native/web modal dismissal.
- Per-item save results drive added, duplicate, and failed counts; success is never displayed before
  the Supabase insert returns.
- Zustand updates successful inserts immediately; Wardrobe also refreshes on focus and app restart.

## Functional interaction audit

The audit treats the existing native `showDeferredNotice` alert as a real unavailability dialog,
not success behavior. Its Phase 3 copy states that nothing changed. Future controls are either
removed, visibly disabled, explicitly labelled unavailable, or connected to that dialog.

| Route / screen        | Interactive controls                                                 | Phase 3 behavior                                                                                       | Status                  | Test/result                                |
| --------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------- | ------------------------------------------ |
| Welcome               | Create Account, Sign In                                              | Real auth routes                                                                                       | Connected               | Existing navigation/auth tests pass        |
| Sign Up               | fields, password visibility, submit, Sign In                         | Validated Supabase sign-up and route                                                                   | Connected               | Existing auth validation/store tests pass  |
| Sign In               | fields, visibility, forgot password, submit, dev Quick Login         | Real Supabase auth and routes; repeat guarded                                                          | Connected               | Existing auth/Quick Login tests pass       |
| Forgot/Reset Password | submit, return, request new link, cancel/continue                    | Real Supabase recovery flow                                                                            | Connected               | Existing auth callback/store tests pass    |
| Email Verification    | resend, cooldown, check, sign out/return                             | Real auth actions with disabled/loading states                                                         | Connected               | Existing auth store tests pass             |
| Profile Setup/Edit    | fields, save, sign out                                               | Real profile RLS service; avatar opens explicit unavailable dialog                                     | Connected / unavailable | Existing profile service tests pass        |
| Main tabs             | Home, Explore, Wardrobe, Stylist, Profile                            | Registered nested stacks with history back behavior                                                    | Connected               | Navigation configuration tests pass        |
| Home                  | discovery search, category/style cards, inspiration cards            | Real local routes; fixture save/options/notifications use unavailable dialog                           | Connected / unavailable | Static interaction audit passes            |
| Explore               | search, categories/styles, grid/list, back, empty CTA                | Real fixture search/routes/local view state; visual search/filter/save/options use unavailable dialog  | Connected / unavailable | Static interaction audit passes            |
| Wardrobe              | import, manual add, search, sort, categories, open, favourite, retry | Real RLS data, state mutation, filtering, navigation, loading/error/empty states                       | Connected               | Wardrobe service/workflow/audit tests pass |
| Add Item Entry        | website, manual, camera, gallery                                     | Website/manual route; camera/gallery semantically disabled with visible reasons                        | Connected / disabled    | Static interaction audit passes            |
| Manual Add            | back, continue, selects/toggle, review, edit, save                   | Real local draft followed by Supabase persistence; media actions removed                               | Connected               | Service tests and strict typecheck pass    |
| URL Import Input      | Paste, Clear, Analyse, Cancel, retry, manual fallback                | Real clipboard, validation, Edge call, loading/error paths                                             | Connected               | URL/workflow/audit tests pass              |
| URL Import Preview    | selection, Select/Deselect all, Edit, Open source, save, Back/Cancel | Real state, modal, platform linking, per-item persistence                                              | Connected               | Workflow/audit tests pass                  |
| Wardrobe Detail       | back, favourite, source, delete, style item, related outfit          | Real mutation/link/confirmation/routes; edit labelled unavailable                                      | Connected / unavailable | Static audit and typecheck pass            |
| Stylist flow          | goal/preferences/generation/result/detail/back/cancel                | Real local fixture navigation/state; AI/save/edit/share/alternative dialogs disclose unavailable state | Connected / unavailable | Navigation/static audit passes             |
| 3D controls           | result/detail entry points                                           | Labelled **3D preview unavailable** and opens no-success explanation                                   | Unavailable             | Static audit rejects misleading 3D labels  |
| Profile navigation    | account, appearance, notifications, privacy, help, about, sign out   | Real routes/session/theme/local toggles; unsupported services use unavailable dialog                   | Connected / unavailable | Navigation/static audit passes             |
| Account               | sign out, password change, delete                                    | Sign out real; password/delete use explicit unavailable dialogs                                        | Connected / unavailable | Existing auth store tests pass             |
| Legal/support/privacy | rows                                                                 | Explicit unavailable dialogs; no message, deletion, or legal page is fabricated                        | Unavailable             | Static interaction audit passes            |

The automated audit scans application source for empty handlers, `console.log`/`console.debug`-only
actions, missing direct `Pressable` contracts, unregistered Wardrobe routes, missing import controls,
repeat guards, and misleading enabled-looking 3D labels.

## Tests and verification

Automated coverage added in Phase 3:

- URL validation: HTTPS, HTTP, protocol normalization, malformed, unsupported scheme, localhost,
  loopback, private IPv4/IPv6, link-local, metadata endpoint, credentials, excessive length, and
  unsafe redirect.
- Secure fetch: public DNS requirement, header isolation, HTML-only response, redirect validation,
  and body-size enforcement.
- Parser fixtures: JSON-LD product, Offer, `@graph`, ItemList, Open Graph, Shopify-like,
  WooCommerce-like, generic product cards, malformed JSON-LD, duplicates, no products, and
  decorative images.
- Wardrobe service: ownership mapping, row mapping, duplicate/partial outcomes, safe errors, and
  insert normalization.
- Import workflow: existing duplicates, individual/select-all/deselect-all, editing, persistence
  mapping, partial failure, and completion counts.
- Interaction audit: handler, route, control, repeat-guard, and future-3D contracts.

Final local command results:

| Command                          | Result                                                                     |
| -------------------------------- | -------------------------------------------------------------------------- |
| `npm run validate`               | Passed: strict typecheck, ESLint, Prettier check, 16 test files / 85 tests |
| `npx expo install --check`       | Passed: dependencies are up to date for Expo SDK 57                        |
| `npx expo-doctor`                | Passed: 20/20 checks                                                       |
| `npx expo export --platform web` | Passed: final 1.4 MB web bundle and static `dist` export generated         |
| `git diff --check`               | Passed: no whitespace errors                                               |
| `npm audit --omit=dev`           | Reports 10 moderate advisories in Expo's transitive `xcode` → `uuid` chain |

There is no repository `npm run build` script. The configured Vercel production build command is
the successful Expo web export above. The audit's advertised forced remediation would downgrade
Expo to 46, so it was not applied; a breaking framework downgrade is outside Phase 3 and conflicts
with the validated SDK 57 dependency set.

## Deployment and manual verification

Before live testing:

1. Apply `supabase/migrations/20260805000100_create_wardrobe_items.sql` to the intended project.
2. Deploy `import-wardrobe-url` with JWT verification enabled.
3. Confirm `SUPABASE_URL` plus `SUPABASE_ANON_KEY` (or `SB_PUBLISHABLE_KEY`) exist in the Edge
   Function runtime. Do not add a service-role key to Expo configuration.
4. Test with two disposable authenticated users and prove cross-user reads/writes/deletes fail.
5. Test controlled public product, collection, blocked/unsupported, empty, duplicate, and partial
   failure cases on iOS, Android, narrow web, tablet, and desktop web.

Local Node tests and a static Expo export do not prove retailer access, hosted function networking,
database migration state, RLS against two live users, native clipboard permissions, device back
behavior, or visual layout on physical devices. Those checks must remain open until run in the
deployed target.

## Known limitations and intentionally deferred work

- Best-effort in-memory Edge rate limits are isolate-local; production abuse controls should add a
  durable gateway/database limiter if traffic warrants it.
- DNS-over-HTTPS is an additional fail-closed dependency and does not make arbitrary scraping
  universally reliable.
- Retailer markup changes may reduce extraction quality; low-confidence candidates require review.
- Remote product images remain retailer-hosted URLs; image upload/copying is outside this phase.
- Wardrobe item editing after save remains explicitly unavailable; imported candidates are editable
  before persistence.
- Explore, Home, and Stylist fixture services remain Phase 2 boundaries.
- 3D avatars/clothing, virtual try-on, 3D rendering, Premium Experience, RevenueCat entitlements,
  AI generation, camera/gallery uploads, and Phase 4 polish were not implemented.
