# Tasks — Add Sony Brand

> **Resumability:** Work top-to-bottom. Each numbered group is an independent,
> committable batch ending in a test checkpoint. If a session is interrupted,
> resume at the first unchecked `- [ ]`. Camera/lens data entry (groups 5–8) is
> split into small batches; a partially-entered dataset still passes tests as
> long as **each entered item is complete**. Commit after each green checkpoint.

## 1. Research & source the Sony lineup (do first; no code yet)

- [x] 1.1 Enumerate the comprehensive body list (current + notable discontinued)
  across full-frame (Alpha 7/9/1/FX), APS-C (a6xxx), and ZV lines; record each
  as `slug | name | series | year | discontinued`. Save to
  `openspec/changes/add-sony-brand/research/cameras.md`. → ~33 bodies enumerated.
- [x] 1.2 Enumerate all Sony first-party FE/E lenses (GM / G / standard / E),
  recording `slug | name | line | type`. Save to `.../research/lenses.md`.
  → ~65–70 lenses enumerated (FE primes/zooms, E APS-C primes/zooms, incl. ZA).
- [x] 1.3 For each item, collect verified data from ≥2 sources (Sony official,
  DPReview, major retailer, Amazon ASIN): RRP (USD + 6 currencies), full specs,
  `productUrl`, `asin`, `imageUrl`. Note any datum that can't be confirmed (to
  be `priceIncomplete` / `null`). Keep notes in the research files. → Sources,
  methodology, MP/year/series + anchor USD RRPs captured; full per-item spec/
  ASIN/image verification continues at entry time (groups 4–9), each item
  cross-checked against ≥2 sources immediately before entry.
- [x] 1.4 Decide final Sony series labels + dropdown groupings and the exact
  Sony-specific field set (see group 3). Record decisions in the research files.
  → research/decisions.md: 4 series, Sony fields (logProfile/aiAf/realtimeTracking),
  colours, slug conventions.

## 2. Scaffold the Sony brand directory

- [x] 2.1 Create `sony/index.html` by copying `canon/index.html` and updating the
  `<title>` (e.g. "Sony Alpha Camera & Lens Comparison").
- [x] 2.2 Create `sony/data.js` skeleton from `canon/data.js`: `BRAND_CONFIG`
  (name/slug/accentColor/heroDark/logoText/families/`brandSections:['sony']`/
  cameras+lenses hero copy/`defaultSelected`/footerLinks), `SERIES_COLORS` for
  the Sony series, and empty `CAMERAS`/`CAMERA_ORDER`/`DROPDOWN_GROUPS`/`LENSES`/
  `LENS_DROPDOWN_GROUPS`, plus `REGISTERED_BRANDS` (incl. sony). Validated with
  `node --check`.
- [x] 2.3 Pick Sony accent/hero colours (accent `#ff6a00` Sony orange, heroDark
  `#1a0d00`) and add a `SERIES_COLORS` bg/text pair per Sony series (4 series).

## 3. Wire registration, engine section & schema (do before bulk data)

- [x] 3.1 Add `{ slug: 'sony', name: 'Sony' }` to `REGISTERED_BRANDS` in
  `fujifilm/data.js`, `canon/data.js`, and `sony/data.js` (all three identical).
- [x] 3.2 Add `'sony'` to `VALID_BRANDS` in the root `index.html` redirector.
- [x] 3.3 Add a `'Sony'` entry to `MANUFACTURER_COLORS` in `engine.js`.
- [x] 3.4 Add the Sony-specific spec section (`brand: 'sony'`) to `SPEC_SECTIONS`
  in `engine.js` — section "Color Science & AI AF": Log/Color Profile, AI
  Processing Unit, Real-time Tracking rows.
- [x] 3.5 Add the `brandSections.includes('sony')` validation branch to
  `tests/helpers/schema.js` (logProfile str|null, aiAf bool, realtimeTracking bool).
- [x] 3.6 Extend `tests/logic/root-redirect.test.js` with a case asserting a
  stored brand of `'sony'` redirects to `./sony/` (and preserves the hash).
- [x] 3.7 **Checkpoint:** `npm test` — done together with Group 4 seed (engine
  needs 3 default slots filled to render, so the green checkpoint lands at 4.3).

## 4. Seed cameras + lenses (prove the pipeline end-to-end)

> Note: the engine renders `numSlots = 3` from `defaultSelected`, and the picker
> dedup test needs a 4th non-default camera — so the minimal green seed is
> **4 cameras + 3 lenses** (not literally one each). Full lineup follows in 5–8.
- [x] 4.1 Added fully-specced current cameras to `CAMERAS`/`CAMERA_ORDER`/
  `DROPDOWN_GROUPS`: `a7r-v`, `a7-iv`, `a7c-ii` (Full-frame), `a6700` (APS-C);
  `defaultSelected` = `['a7-iv','a6700','a7c-ii']`. All ASIN/price-verified.
- [x] 4.2 Added fully-specced lenses to `LENSES`/`LENS_DROPDOWN_GROUPS`:
  `fe-50mm-f14-gm` (prime), `fe-24-70mm-f28-gm-ii`, `fe-70-200mm-f28-gm-oss-ii`
  (zooms); `defaultSelected` = the GM trio. ASIN-verified, `priceIncomplete` set.
- [x] 4.3 **Checkpoint:** `npm test` green — **114/114 pass**. Sony logic tests
  (slots render, buy-button follows currency, price switching, spec-section
  gating, brand switcher) cover the render path in automation. Browser preview
  optional (`preview_start`).

## 5. Camera data — full-frame (Alpha 7 / 9 / 1) in batches

- [x] 5.1 Batch A: A1 II, A9 III, A7 V added (A7R V, A7 IV seeded in Group 4).
  A7 V specs confirmed via Wikipedia (post-cutoff model).
- [x] 5.2 Batch B: A7C R, A7S III (current); A1, A7C (discontinued, USD-only).
- [x] 5.3 Batch C: discontinued full-frame A9 II, A7R IV, A7 III, A9, A7R III,
  A7R II, A7S II, A7 II, A7R, A7, A7S (USD-only, asin null → search fallback).
- [x] 5.4 After each batch: ids added to `CAMERA_ORDER`/`DROPDOWN_GROUPS`
  (now grouped by era); `npm run test:data` green each time. **21 FF bodies.**
  NOTE: A7R VI (2026, 66.8MP) deferred — price/specs unconfirmed (see research).

## 6. Camera data — Cinema, APS-C & ZV in batches

- [x] 6.1 Cinema Line: FX3, FX30 (current, ASIN-verified, no-EVF handled).
- [x] 6.2 APS-C: a6400 (current) + a6700 (seeded); discontinued a6600, a6500,
  a6300, a6100, a6000 (USD-only).
- [x] 6.3 ZV: ZV-E1, ZV-E10 II (current, ASIN-verified); ZV-E10 (discontinued).
- [x] 6.4 Orders/groups updated (Cinema + ZV dropdown groups added);
  `npm test` green. **Total cameras now 33** (21 FF, 7 APS-C, 2 Cinema, 3 ZV).

## 7. Lens data — primes in batches by line

- [x] 7.1 FE GM primes: 14/1.8, 24/1.4, 35/1.4, 50/1.2, 50/1.4 (seed), 85/1.4 II,
  85/1.4 (disc), 100 STF, 135/1.8, 300/2.8, 400/2.8, 600/4. `asin:null`
  (search-link fallback) + `priceIncomplete` USD+AUD+CAD — ASIN/regional-price
  backfill deferred to Group 9 / `check-prices-and-buy-links` skill.
- [x] 7.2 FE G + standard + ZA primes added (16/1.8 G, 20/1.8 G, 24/2.8 G,
  40/2.5 G, 50/2.5 G, 90 Macro G, 28/2, 35/1.8, 50/1.8, 50 Macro; ZA 35/1.4,
  35/2.8, 50/1.4, 55/1.8). 100mm Macro GM (2025) deferred — unverified.
- [x] 7.3 E APS-C primes added (11/1.8, 15/1.4 G, 16/2.8, 20/2.8, 24/1.8 ZA,
  30/3.5 Macro, 35/1.8 OSS, 50/1.8 OSS) with `focalLengthEquiv` (1.5× crop).
- [x] 7.4 `LENS_DROPDOWN_GROUPS` updated (FE Primes group + new E APS-C Primes
  group); `npm test` green. **36 lenses total** (26 FE primes, 8 E primes, 2 zooms).

## 8. Lens data — zooms in batches by line

- [x] 8.1 FE GM zooms: 12-24/2.8, 16-35/2.8 II, 16-35/2.8 (disc), 24-70/2.8 II
  (seed), 28-70/2, 50-150/2, 70-200/2.8 II (seed), 100-400.
- [x] 8.2 FE G + standard + ZA zooms: 12-24/4 G, 16-25/2.8 G, 16-35/4 PZ G,
  20-70/4 G, 24-50/2.8 G, 24-105/4 G, 70-200/4 G (disc), 70-200/4 Macro G II,
  70-300 G, 200-600 G, 400-800 G; ZA 16-35/4, 24-70/4; FE 24-240, 28-60,
  28-70 OSS (disc), 28-70 OSS II.
- [x] 8.3 E APS-C zooms: 10-18 OSS, 10-20 PZ G, 16-50 PZ (disc), 16-50 PZ II,
  16-55/2.8 G, 16-70/4 ZA (disc), 18-105 G PZ, 18-135, 55-210, 70-350 G.
- [x] 8.4 `LENS_DROPDOWN_GROUPS` updated (FE Zooms + new E Zooms group);
  `npm test` green. **TOTAL: 69 lenses** (34 primes, 35 zooms; 51 FE, 18 E).

## 9. Images & pricing finalisation

- [~] 9.1 Ran `scripts/fetch-images.js sony all`: its **fuzzy name-matching is
  unreliable for Sony** — most "found" URLs were wrong subjects (Audi A1 for
  a1-ii, a jet for a7-v, a beetle for e-20mm, a Panasonic for fx30). Only
  applied the 3 whose Commons filenames unambiguously name the right product
  (a7-iii, a7-ii, zv-e10-ii) + the a7-iv seed; all 4 pass `verify-images.js`.
  **REMAINING:** the other ~95 items still need a hand-curated Commons File-title
  MAP (the `apply-images.js` approach) — automated fetch can't be trusted here.
- [x] 9.2 Regional pricing: current cameras already carry all 7 currencies (hand-
  entered at data time); discontinued = USD-only; lenses use `priceIncomplete`.
  `compute-prices.js` is Canon-hardcoded and not needed for current Sony cameras.
  ASIN backfill for lenses → `check-prices-and-buy-links` skill (separate pass).
- [ ] 9.3 Spot-check a sample of product/buy/image URLs with
  `RUN_LINK_TESTS=1 npm run test:links` (opt-in; network) — pending.

## 10. Final verification

- [ ] 10.1 `npm test` — entire data + logic suite green.
- [ ] 10.2 Manually open `sony/index.html`: verify dropdown groups, brand
  switch to/from Sony, currency switching, winner highlighting, Sony-specific
  section, and Buy links across cameras and lenses.
- [ ] 10.3 Confirm `completeness.test.js` reports Sony coverage on par with
  other brands (no large gaps); review counts (~30+ cameras, ~70 lenses).

## 11. Reusable add-camera-brand skill

- [x] 11.1 Created `.claude/skills/add-camera-brand/SKILL.md` — brand-agnostic,
  parameterised by brand name/slug, 8-step procedure (research → scaffold → wire
  → engine section + schema → camera/lens batches → images/pricing → verify).
- [x] 11.2 Includes the full wiring checklist (new dir, all brands'
  `REGISTERED_BRANDS`, root `VALID_BRANDS`, `MANUFACTURER_COLORS`, optional
  engine section + `schema.js` branch) + batched/checkpointed/≥2-source/resumable
  guidance, plus gotchas (numSlots=3 + dedup → ≥4 seed cameras; KNOWN_IMAGE_GAPS).
- [x] 11.3 Dry-checked against the Sony work — references `add-sony-brand` as the
  worked example; a future brand (Nikon/OM/Panasonic) can follow it verbatim.

## 12. Archive

- [ ] 12.1 When all above are checked and tests pass, run the OpenSpec archive
  flow for `add-sony-brand`.
