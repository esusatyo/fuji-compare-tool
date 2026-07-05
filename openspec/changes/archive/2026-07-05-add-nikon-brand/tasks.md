# Tasks — Add Nikon Brand

> **Resumability:** Work top-to-bottom. Each numbered group is an independent,
> committable batch ending in a test checkpoint. If a session is interrupted,
> resume at the first unchecked `- [ ]`. Camera/lens data entry (groups 5–8) is
> split into small batches; a partially-entered dataset still passes tests as
> long as **each entered item is complete**. Commit after each green checkpoint.

## 1. Research & source the Nikon lineup (do first; no code yet)

- [x] 1.1 Enumerated the comprehensive Z-mount body list (current + notable
  discontinued) across full-frame (FX), APS-C (DX), and retro (Zf/Zfc).
  → `research/cameras.md`: **14 bodies** (8 current, 6 discontinued).
- [x] 1.2 Enumerated NIKKOR Z first-party lenses (S-Line / non-S FX / DX).
  → `research/lenses.md`: **48 lenses** across 6 groups.
- [x] 1.3 Collected verified data from ≥2 sources (Nikon official, DPReview,
  Wikipedia, B&H, Thom Hogan). UNCONFIRMED items flagged for `priceIncomplete`/
  per-item re-check at entry: Z5 II internal N-RAW/CIPA/weight, Zf N-RAW (FW),
  Z30 launch price, Z7 II EOL status; lens prices for 50/1.4, DX 16-50/2.8, DX
  35/1.7 MC. Full per-item spec/ASIN/image verification continues at entry time.
- [x] 1.4 Decided final series labels (3), brand-section field set (expeed/nRaw/
  pixelShift/preCapture), colours, lens lines, slug conventions.
  → `research/decisions.md`.

## 2. Scaffold the Nikon brand directory

- [x] 2.1 Created `nikon/index.html` (title "Nikon Z Camera & Lens Comparison").
- [x] 2.2 Created `nikon/data.js` from the `canon/` template: `BRAND_CONFIG`,
  `SERIES_COLORS` (3 series), `CAMERAS`/`CAMERA_ORDER`/`DROPDOWN_GROUPS`,
  `LENSES`/`LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`. `node --check` OK.
- [x] 2.3 Accent `#ffd200` / heroDark `#1a1700`; SERIES_COLORS pair per series
  (Full-frame / APS-C / Retro).

## 3. Wire registration, engine section & schema (do before bulk data)

- [x] 3.1 Added `{ slug: 'nikon', name: 'Nikon' }` to `REGISTERED_BRANDS` in all
  four brand files (fujifilm, canon, sony, nikon).
- [x] 3.2 Added `'nikon'` to `VALID_BRANDS` in the root `index.html`.
- [x] 3.3 Added `MANUFACTURER_COLORS['Nikon']` to `engine.js`.
- [x] 3.4 Added the Nikon spec section (`brand:'nikon'`, "Nikon Imaging"):
  EXPEED Generation, N-RAW Internal, Pixel Shift High-Res, Pre-Release Capture.
- [x] 3.5 Added the `brandSections.includes('nikon')` schema branch (expeed/nRaw/
  pixelShift str|null, preCapture bool).
- [x] 3.6 Updated `root-redirect.test.js`: swapped the now-valid `'nikon'`
  invalid-brand case to `'pentax'` and added a `'nikon'` honored case (+hash).
- [x] 3.7 **Checkpoint:** landed with Group 4 (see 4.3).

## 4. Seed cameras + lenses (prove the pipeline end-to-end)

> Note: the engine renders `numSlots = 3` from `defaultSelected`, and the picker
> dedup test needs a 4th non-default camera — so the minimal green seed is
> **4 cameras + 3 lenses**. Full lineup follows in 5–8.
- [x] 4.1 Added 4 current cameras (`z8`, `z6-iii`, `z5-ii` FX + `z50-ii` DX) with
  full specs + 7-currency prices (USD exact, regional derived/approx); Nikon
  fields populated. `defaultSelected` = `['z8','z6-iii','z50-ii']`. ASINs `null`
  (search fallback) → backfilled in 9.3; images `null` → allowlisted, fetched 9.1.
- [x] 4.2 Added 3 lenses (`z-50mm-f1-8-s`, `z-24-70mm-f2-8-s`,
  `z-70-200mm-f2-8-vr-s`) with full specs; `priceIncomplete` (USD+AUD+CAD).
- [x] 4.3 **Checkpoint:** `npm test` green — **151/151 pass** (72 nikon-tagged).

## 5. Camera data — full-frame (FX) in batches

- [x] 5.1 Batch A: z9 (current flagship) added with full specs + 7 currencies.
- [x] 5.2 Batch B: discontinued FX z7-ii, z7, z6-ii, z6, z5 (USD-only, asin null
  → search fallback; EXPEED 6, no nRaw/pixelShift/preCapture).
- [x] 5.3 `CAMERA_ORDER`/`DROPDOWN_GROUPS` updated; `npm run test:data` green.
  **9 FX bodies.**

## 6. Camera data — APS-C (DX) & Retro in batches

- [x] 6.1 DX: z50-ii (seed), z50 (disc), z30 (current vlog, no EVF); Retro group
  added with zf (current FX) + zfc (current DX).
- [x] 6.2 Orders/groups updated (Retro group added); `npm test` green —
  **151/151**. **Total cameras: 14** (9 FX, 3 DX, 2 Retro).

## 7. Lens data — primes in batches by line

- [x] 7.1 S-Line primes: 20/1.8, 24/1.8, 35/1.8, 50/1.8 (seed), 85/1.8, 35/1.2,
  50/1.2, 85/1.2, 135/1.8 Plena, MC 105/2.8 VR, 58/0.95 Noct (MF). **11.**
- [x] 7.2 Non-S FX primes (26/2.8, 28/2.8, 28/2.8 SE, 35/1.4, 40/2, 40/2 SE,
  50/1.4, MC 50/2.8) + DX 24/1.7 (`focalLengthEquiv` 36mm). **9.**
  DEFERRED (2025, unconfirmed specs/price): DX 35/1.7 MC.
- [x] 7.3 `LENS_DROPDOWN_GROUPS` updated (S-Line Primes / Standard Primes / DX
  Lenses groups added); `npm run test:data` green. **20 primes total.**

## 8. Lens data — zooms in batches by line

- [x] 8.1 S-Line zooms: 14-24/2.8, 24-70/2.8 (seed), 24-70/4, 14-30/4, 24-120/4,
  70-200/2.8 VR (seed), 100-400 VR. Super-tele S primes: 400/4.5, 400/2.8 TC,
  600/6.3 PF, 600/4 TC, 800/6.3 PF. DEFERRED (recency/round-price risk, Wikipedia-
  spine only): 24-70/2.8 S II, 70-200/2.8 VR S II.
- [x] 8.2 Non-S FX zooms (17-28/2.8, 24-50, 24-200 VR, 28-75/2.8, 28-400 VR) +
  tele zooms (70-180/2.8, 180-600 VR) + DX zooms (12-28 PZ, 16-50 VR, 18-140 VR,
  50-250 VR). DEFERRED: DX 16-50/2.8 VR (2025, unconfirmed).
- [x] 8.3 `LENS_DROPDOWN_GROUPS` updated (6 groups). `npm test` green — **151/151**.
  **TOTAL: 43 lenses** (25 primes, 18 zooms).

## 9. Images & pricing finalisation

- [x] 9.1 Images via `scripts/fetch-images-commons.js nikon` (strict model-token
  Commons match): **21 of 57 items imaged** — 4 cameras (z6-iii, z7-ii, z6-ii,
  z50-ii) + 17 lenses. `KNOWN_IMAGE_GAPS.nikon` pruned to the 36 remaining (10
  cameras incl. z8/z9/zf with no clean Commons photo yet; 26 lenses). The 3
  URLs `verify-images.js` flagged were transient Wikimedia 429s — re-checked
  directly, all HTTP 200 (live). `npm test` green.
- [x] 9.2 Regional pricing: 8 current cameras carry all 7 currencies (USD exact,
  regional derived/approx per the documented convention); 6 discontinued bodies
  USD-only; all 43 lenses ship `priceIncomplete` (USD+AUD+CAD), with 50/1.4
  USD-best-known pending verification. `compute-prices.js` is Canon-hardcoded so
  not used; regional refinement is a later maintenance pass.
- [x] 9.3 ASINs: backfilled all **8 current cameras** with web-verified plain
  USA-model body-only Amazon ASINs (z9 B09KHC4XCT, z8 B0C4Q71JBY, z6-iii
  B0D77SL8CY, z5-ii B0F3HJD64Y, zf B0CJDHSFTN, zfc B09883MWLL, z50-ii B0DMJBLQGP,
  z30 B0B527JD1C) — excluded bundles/Renewed/International. 6 discontinued bodies
  keep `asin:null` (Amazon search fallback). **Lens ASINs backfilled** via the
  `check-prices-and-buy-links` skill — all **43 lenses** now have web-verified
  plain lens-only ASINs (no kit/Renewed/International). **100% ASIN coverage for
  current items** (8 cameras + 43 lenses = 51 product-page Buy links).
  `npm test` green (151/151).

## 10. Final verification

- [x] 10.1 `npm test` — entire data + logic suite green: **151/151**.
- [x] 10.2 Render verified via jsdom logic tests: 3 slots render, brand switcher
  lists all four brands (fujifilm/canon/sony/nikon), per-currency Amazon Buy
  links (product page w/ asin, search fallback otherwise), "Nikon Imaging"
  section gated ("only this brand's spec sections render"). Browser preview
  optional via preview_start.
- [x] 10.3 `completeness.test.js` green for Nikon. Counts: **14 cameras
  (4 imaged, 8 ASIN), 43 lenses (17 imaged)** — on par with Canon (17/34) and
  ahead of Sony on lens images (17 vs 0).

## 11. Archive

- [x] 11.1 When all above are checked and tests pass, run the OpenSpec archive
  flow for `add-nikon-brand`.
