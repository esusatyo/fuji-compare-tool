# Tasks — Add Panasonic Brand

> **Resumability:** Work top-to-bottom. Each numbered group is an independent,
> committable batch ending in a test checkpoint. If a session is interrupted,
> resume at the first unchecked `- [ ]`. Camera/lens data entry (groups 5–8) is
> split into small batches; a partially-entered dataset still passes tests as
> long as **each entered item is complete**. Commit after each green checkpoint.

## 1. Research & source the Panasonic lineup (do first; no code yet)

- [x] 1.1 Enumerated the comprehensive Lumix body list (current + notable
  discontinued) — **~18 bodies** (9 L-mount, 9 MFT). → `research/cameras.md`.
- [x] 1.2 Enumerated Panasonic first-party lenses: LUMIX S (L-mount) + LUMIX G
  (MFT) primes/zooms — **~43 lenses** (≈21 S, ≈22 G). → `research/lenses.md`.
- [x] 1.3 Collected data from ≥2 sources (Panasonic shop/global, DPReview,
  Wikipedia, B&H, DigitalCameraWorld, PetaPixel, Amazon spine). Flagged
  current-vs-discontinued items to verify at entry (s1h, gh6, gh5-ii, g95) and
  recency items (S 100-500, S 18-40, S1 II E). Per-item spec/ASIN/image
  verification continues at entry time.
- [x] 1.4 Decided final series labels (3), brand-section field set (vLog/
  dualNativeIso/openGate/proResInternal), colours (Lumix blue #0046ad), lens
  lines (LUMIX S / LUMIX G), slug conventions. → `research/decisions.md`.

## 2. Scaffold the Panasonic brand directory

- [x] 2.1 Create `panasonic/index.html` (title "Panasonic Lumix Camera & Lens
  Comparison"); loads `../engine.css`, `./data.js`, `../engine.js`.
- [x] 2.2 Create `panasonic/data.js` from the `canon/` template: `BRAND_CONFIG`,
  `SERIES_COLORS`, `CAMERAS`/`CAMERA_ORDER`/`DROPDOWN_GROUPS`,
  `LENSES`/`LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`. `node --check` OK.
- [x] 2.3 Accent `#0046ad` / heroDark `#0a1530`; `SERIES_COLORS` pair per series
  (Lumix S Full-frame / Lumix GH MFT / Lumix G MFT).

## 3. Wire registration, engine section & schema (do before bulk data)

- [x] 3.1 Add `{ slug: 'panasonic', name: 'Panasonic' }` to `REGISTERED_BRANDS`
  in all five brand files (fujifilm, canon, sony, nikon, panasonic).
- [x] 3.2 Add `'panasonic'` to `VALID_BRANDS` in the root `index.html`.
- [x] 3.3 Add `MANUFACTURER_COLORS['Panasonic']` to `engine.js`.
- [x] 3.4 Add the Panasonic spec section (`brand:'panasonic'`, "Panasonic
  Video"): V-Log/V-Log L, Dual Native ISO, Open Gate, Internal ProRes.
- [x] 3.5 Add the `brandSections.includes('panasonic')` schema branch (vLog/
  openGate str|null, dualNativeIso/proResInternal bool).
- [x] 3.6 Update `root-redirect.test.js`: add a `'panasonic'` honored case
  (+hash); keep an invalid-brand case pointing at a still-invalid slug.
- [x] 3.7 **Checkpoint:** land with Group 4 (see 4.3).

## 4. Seed cameras + lenses (prove the pipeline end-to-end)

> Note: the engine renders `numSlots = 3` from `defaultSelected`, and the picker
> dedup test needs a 4th non-default camera — so the minimal green seed is
> **4 cameras + 3 lenses**. Full lineup follows in 5–8.
- [x] 4.1 Add 4 current cameras (mix of L-mount + MFT, e.g. `s5-ii`, `s1r-ii`,
  `gh7`, `g9-ii`) with full specs + 7-currency prices (USD exact, regional
  derived/approx); Panasonic fields populated. `defaultSelected` = 3 of them.
  ASINs `null` → backfilled in 9.3; images `null` → allowlisted, fetched in 9.1.
- [x] 4.2 Add 3 lenses (mix of LUMIX S + LUMIX G) with full specs;
  `priceIncomplete` as needed.
- [x] 4.3 **Checkpoint:** `npm test` green.

## 5. Camera data — full-frame L-mount (Lumix S) in batches

- [x] 5.1 Batch A: remaining current S bodies (e.g. s9, s5-iix, s1r-ii flagship).
- [x] 5.2 Batch B: discontinued/older S bodies (s1, s1r, s1h, s5) — USD-only
  where regional unconfirmed, asin null → search fallback.
- [x] 5.3 `CAMERA_ORDER`/`DROPDOWN_GROUPS` updated; `npm run test:data` green.

## 6. Camera data — Micro Four Thirds (Lumix G/GH) in batches

- [x] 6.1 Current MFT: gh7 (seed), g9-ii (seed), gh6, g100-ii/g100, gx9, etc.
- [x] 6.2 Notable discontinued MFT (gh5-ii, gh5, g9, gx85, etc.).
- [x] 6.3 Orders/groups updated; `npm test` green.

## 7. Lens data — primes in batches by mount/line

- [x] 7.1 LUMIX S (L-mount) primes (e.g. 18/1.8, 24/1.8, 35/1.8, 50/1.8, 85/1.8,
  S PRO 50/1.4, 100/2.8 Macro).
- [x] 7.2 LUMIX G (MFT) primes (e.g. Leica 15/1.7, 25/1.4, 42.5/1.7, 12-32 etc.;
  `focalLengthEquiv` 2.0× crop).
- [x] 7.3 `LENS_DROPDOWN_GROUPS` updated; `npm run test:data` green.

## 8. Lens data — zooms in batches by mount/line

- [x] 8.1 LUMIX S (L-mount) zooms (e.g. 16-35/4, 20-60, 24-60/2.8, 24-105/4,
  70-200/4, 70-200/2.8, 100-400).
- [x] 8.2 LUMIX G (MFT) zooms (e.g. 8-18, 12-35/2.8, 12-60, 35-100/2.8,
  45-175, 100-300, Leica 50-200).
- [x] 8.3 `LENS_DROPDOWN_GROUPS` updated; `npm test` green.

## 9. Images & pricing finalisation

- [x] 9.1 Images via `scripts/fetch-images-commons.js panasonic` (strict
  model-token Commons match); prune `KNOWN_IMAGE_GAPS.panasonic` to the
  remaining gaps; run `scripts/verify-images.js panasonic`. `npm test` green.
- [x] 9.2 Regional pricing: 10 current cameras carry all 7 currencies (USD
  exact, regional derived/approx per the documented convention); 8 discontinued
  bodies USD-only; all 39 lenses ship `priceIncomplete` (USD+AUD+CAD).
  `compute-prices.js` is Canon-hardcoded so not used; regional lens refinement
  is a later maintenance pass.
- [x] 9.3 ASINs: backfilled **9 of 10 current cameras** with web-verified plain
  USA body-only Amazon ASINs (s1r-ii B0DY21GMBD, s1-ii B0F8MHCD7V, s5-ii
  B0BR8JMCYG, s5-iix B0BR8FY5HT, s9 B0D4FBF5NK, s1h B07WSRHXPR, gh7 B0D613NW2M,
  gh6 B09T2RJ27P, g9-ii B0CHTHLVHS) — excluded bundles/Renewed/International.
  g100d has only third-party-bundle Amazon listings → `asin:null` (search
  fallback). 8 discontinued bodies keep `asin:null`. **All 39 lenses backfilled**
  with web-verified plain lens-only USA ASINs (no kit/Renewed/International) —
  100% lens ASIN coverage. **48 product-page Buy links** total (9 cameras +
  39 lenses). `npm test` green (188/188).

## 10. Final verification

- [x] 10.1 `npm test` — entire data + logic suite green: **188/188**.
- [x] 10.2 Render verified via jsdom logic tests: 3 slots render, brand switcher
  lists all five brands (fujifilm/canon/sony/nikon/panasonic), per-currency
  Amazon Buy links (product page w/ asin, search fallback otherwise), and the
  "Panasonic Video" section (V-Log / Dual Native ISO / Open Gate / Internal
  ProRes) gated ("only this brand's spec sections render"). Browser preview
  optional.
- [x] 10.3 `completeness.test.js` green for Panasonic. Counts: **18 cameras**
  (10 current, 6 imaged, 9 ASIN), **39 lenses** (17 primes, 22 zooms; 6 imaged,
  39 ASIN) — **48 product-page Buy links** total.

## 11. Archive

- [ ] 11.1 When all above are checked and tests pass, run the OpenSpec archive
  flow for `add-panasonic-brand`.
