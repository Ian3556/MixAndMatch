# First outfit and saved inspiration

Implemented and verified on 28 September 2026.

## Delivered flows

- Home and Wardrobe show a first-outfit guide until an outfit is saved or marked worn on this device.
- The guide uses actual wardrobe categories and the existing recommendation engine. A dress or a top/bottom pair can start a look; excluded items and avoided colours can prevent generation. Missing pieces lead to the existing manual form with a category selected, or to website import.
- Generation, recommendations, feedback and saved outfits use the existing Stylist store and device persistence. Failed feedback writes report an error and roll back the feedback instead of claiming success.
- Home and Explore use the same image-backed inspiration detail and canonical inspiration ID. Save/remove controls share an account-scoped store.
- Explore has a Saved inspirations collection. An inspiration can seed the existing style brief using its style; it does not promise to recreate the pictured garments.
- Cloud inspiration saves use `public.saved_inspirations`, with ownership policies for select, insert and delete. Generated outfits retain their existing device-local storage.

## Automated regression checks

`npm run validate` passed: typecheck, lint, formatting and 50 test files / 219 tests.

New regression coverage:

- Empty wardrobe → manual top → manual bottom → real engine recommendation → save → fresh hydration.
- Dress-only readiness, accessories-only insufficiency, avoided colours and excluded items.
- Failed local outfit save, rollback, retry and persisted wear feedback.
- Inspiration save/remove across fresh stores, account isolation, stale read/write responses, concurrent loads, duplicate taps and failure/retry.

`npx expo export -p web` passed. No dependencies were added.

## Browser evidence

Headless Edge exercised the exported app at 390 × 844 and inspected the empty collection at 1280 × 900. The browser used intercepted API fixtures; screens, navigation, wardrobe normalization, styling, feedback and local outfit persistence ran as implemented.

The browser completed manual item entry, category-prefilled forms, recommendation generation, saving and reload. Inspiration checks covered a failed save followed by retry, the saved collection, reload, Home/Explore shared saved status, removal and seeding the Minimalist styling brief.

Screenshots and the browser report are local artifacts under `.expo/qa-first-outfit/`:

- `01-empty-mobile.png`
- `02-ready-mobile.png`
- `03-saved-mobile.png`
- `04-collection-mobile.png`
- `05-brief-mobile.png`
- `06-empty-collection-desktop.png`
- `result.json`

## Live Supabase verification

The user applied `supabase/migrations/20260928000100_create_saved_inspirations.sql` in the SQL Editor. Subsequent live checks passed using two disposable accounts:

- Authenticated save and idempotent duplicate save.
- Read after sign-in with a fresh client.
- Another account cannot read the saved row, insert for its owner or remove it.
- Anonymous reads are denied.
- Owner removal persists in a fresh client.

Both temporary accounts were deleted after verification. Existing accounts and wardrobe data were not used or changed by these checks. The local report is `.expo/qa-first-outfit/live-result.json` and contains no credentials.

## Verification limits

- Browser interaction checks used fixtures; live database policy and persistence checks ran separately through the Supabase API.
- Physical Android/iOS devices and a deployed frontend were not tested.
- First-outfit completion describes a generated look the user saved or marked worn. It does not measure outfit quality or validate retention with real users.
- Graphify was refreshed. SQL graph extraction remains unavailable because its optional SQL parser is not installed.
