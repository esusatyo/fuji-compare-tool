# Tasks — Add Third-Party Lenses (Panasonic: L-mount + MFT)

> **Resumability:** Work top-to-bottom; each group is an independent, committable
> batch ending in a test checkpoint. Resume at the first unchecked `- [ ]`.
> Partial data still passes as long as **each entered lens is complete**. Commit
> after each green checkpoint. This is the largest change (two mounts) — batches
> are split by mount then manufacturer.
>
> **Per-lens definition of done (groups 4–11):** specs verified ≥2 sources · RRP
> 7 currencies (or `priceIncomplete` / USD-only if discontinued) · correct
> `focalLengthEquiv` (2.0× for MFT, native for L) · `productUrl` (manufacturer,
> https, live) · `asin` (verified plain-product) **or** search fallback ·
> `imageUrl` (https, loads) or recorded gap · added to correct mount-labelled
> `LENS_DROPDOWN_GROUPS` group.

## 1. Research & scope (do first; no code yet)

- [x] 1.1 Enumerate third-party **L-mount** lenses per maker (Sigma, Leica,
  Voigtländer, Samyang, Laowa, TTArtisan/7Artisans/Astrhori) →
  `research/lenses.md`.
- [x] 1.2 Enumerate third-party **MFT** lenses per maker (OM System/Olympus,
  Sigma DN/DC DN, Voigtländer Nokton, Laowa, Sirui, 7Artisans/TTArtisan/Meike/
  Yongnuo) → `research/lenses.md`.
- [x] 1.3 Apply the D7 scope boundary; mark in/out. For Leica, pick a
  representative SL set (not the exhaustive catalogue).
- [x] 1.4 Confirm slug conventions incl. **cross-mount collision discriminators**
  (`-l` / line suffix), dropdown group order, and `MANUFACTURER_COLORS`
  additions in `research/decisions.md`.

## 2. Shared wiring (do before bulk data)

- [x] 2.1 Add `OM System`, `Leica`, `Laowa`, `Sirui`, `Meike`, `Yongnuo`,
  `Astrhori` to `MANUFACTURER_COLORS` in `engine.js` (skip any added by siblings).
- [x] 2.2 Ensure the manufacturer-colour coverage test passes (add it here if
  this change lands before Sony/Nikon).
- [x] 2.3 **Checkpoint:** `npm test` green.

## 3. Dropdown scaffolding

- [x] 3.1 Add the empty mount-labelled groups to `LENS_DROPDOWN_GROUPS` in the D3
  order (L-mount groups after LUMIX S, MFT groups after LUMIX G) so subsequent
  batches only append ids.

## 4. L-mount — Sigma (native DG DN)

- [x] 4.1 Contemporary primes: 17 f/4, 20 f/2, 24 f/2, 24 f/3.5, 35 f/2,
  45 f/2.8, 50 f/2, 65 f/2, 90 f/2.8, 500 f/5.6.
- [x] 4.2 Art primes: 20 f/1.4, 24 f/1.4, 35 f/1.2, 35 f/1.4, 50 f/1.2,
  50 f/1.4, 85 f/1.4, 105 f/2.8 macro, 135 f/1.8.
- [x] 4.3 Zooms: 16-28 f/2.8, 24-70 f/2.8 II, 28-45 f/1.8, 28-70 f/2.8,
  70-200 f/2.8, 100-400, 60-600, 150-600. (+ DC DN APS-C 18-50/10-18 if L crop.)
- [x] 4.4 Append to `── Sigma (L-mount) ──`; `npm run test:data` green.

## 5. L-mount — Leica SL (representative)

- [x] 5.1 Representative SL primes: 35 f/2, 50 f/2, 75 f/2, 90 f/2 APO-Summicron;
  a couple of SL zooms (24-70 f/2.8, 24-90). `manufacturer: 'Leica'`.
- [x] 5.2 Append to `── Leica (L-mount) ──`; `npm run test:data` green.

## 6. L-mount — Voigtländer / Samyang / Laowa / budget

- [x] 6.1 Voigtländer L: Nokton 35 f/1.2, 40 f/1.2, 50 f/1, 50 f/1.2, APO-Lanthar
  as released. `── Voigtländer (L-mount) ──`.
- [x] 6.2 Samyang L (verify AF availability); Laowa L (10/4, 12/2.8, 15/2,
  58/2.8, 90/2.8 macro, 100/2.8 macro); TTArtisan/7Artisans/Astrhori AF/MF L.
  Group `── Other (L-mount) ──`.
- [x] 6.3 `npm run test:data` green.

## 7. MFT — OM System / Olympus (M.Zuiko)

- [x] 7.1 PRO zooms: 7-14 f/2.8, 8-25 f/4, 12-40 f/2.8 (I/II), 12-100 f/4,
  40-150 f/2.8, 40-150 f/4, 100-400, 150-400 f/4.5 TC.
- [x] 7.2 PRO primes: 8 f/1.8 fisheye, 17 f/1.2, 20 f/1.4, 25 f/1.2, 45 f/1.2,
  90 f/3.5 macro, 300 f/4.
- [x] 7.3 Popular standard/primes: 17 f/1.8, 25 f/1.8, 45 f/1.8, 60 f/2.8 macro,
  12 f/2, 75 f/1.8, 9-18, 14-150 II, 40-150 R, 75-300 II.
- [x] 7.4 New `── OM System (MFT) ──` group; `npm run test:data` green.

## 8. MFT — Sigma (DN / DC DN)

- [x] 8.1 Sigma DN Art: 19 f/2.8, 30 f/2.8, 60 f/2.8; DC DN: 16 f/1.4, 30 f/1.4,
  56 f/1.4 (MFT versions). Slug discriminated from L entries (D2).
- [x] 8.2 New `── Sigma (MFT) ──` group; `npm run test:data` green.

## 9. MFT — Voigtländer Nokton f/0.95

- [x] 9.1 Nokton 10.5 f/0.95, 17.5 f/0.95, 25 f/0.95 (II), 42.5 f/0.95,
  60 f/0.95. New `── Voigtländer (MFT) ──` group.
- [x] 9.2 `npm run test:data` green.

## 10. MFT — Sirui (Sniper AF) + Laowa

- [x] 10.1 Sirui Sniper AF: 23 f/1.2, 33 f/1.2, 56 f/1.2 (MFT). New
  `── Sirui (MFT) ──`.
- [x] 10.2 Laowa MFT: 4 f/2.8 fisheye, 7.5 f/2, 10 f/2, 17 f/1.8, 50 f/2.8 macro.
  (Add to MFT `── Other ──` or a Laowa group.)
- [x] 10.3 `npm run test:data` green.

## 11. MFT — budget makers (7Artisans / TTArtisan / Meike / Yongnuo) — representative

- [x] 11.1 Representative popular AF/MF primes per maker (e.g. 7Artisans 25 f/1.8,
  TTArtisan 17 f/1.4, Meike 25 f/1.8, Yongnuo 25 f/1.7 / 42.5 f/1.7).
- [x] 11.2 New `── Other (MFT) ──` group; `npm run test:data` green.

## 12. Images, ASIN & pricing finalisation

- [x] 12.1 Fill/verify `imageUrl` for every new lens; record placeholder gaps
  (KNOWN_IMAGE_GAPS.panasonic).
- [x] 12.2 ASIN backfill via `check-prices-and-buy-links`; verify per-currency Buy
  links render `amazon.<tld>/dp/<asin>`. (OM System/Sigma widely stocked.)
- [x] 12.3 Regional pricing: current → 7 currencies; derived → `priceIncomplete`.

## 13. Final verification

- [x] 13.1 Ad-hoc link check over all new `productUrl` + `imageUrl` (0 dead).
- [x] 13.2 `npm test` — full suite green.
- [x] 13.3 `completeness.test.js` passes; record third-party counts **per mount**
  and new Panasonic total.
- [x] 13.4 jsdom render spot-check: L-mount and MFT third-party groups appear
  separately, card colours resolve, `focalLengthEquiv` correct per mount,
  per-currency Buy links generate.

## 14. Archive

- [ ] 14.1 Run the OpenSpec archive flow for `add-thirdparty-lenses-panasonic`.
