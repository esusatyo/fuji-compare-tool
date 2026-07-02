# Tasks — Add Third-Party Lenses (Nikon Z)

> **Resumability:** Work top-to-bottom; each group is an independent, committable
> batch ending in a test checkpoint. Resume at the first unchecked `- [ ]`.
> A partial dataset still passes tests as long as **each entered lens is
> complete**. Commit after each green checkpoint.
>
> **Per-lens definition of done (groups 3–8):** specs verified ≥2 sources · RRP
> 7 currencies (or `priceIncomplete` / USD-only if discontinued) · `productUrl`
> (manufacturer, https, live) · `asin` (verified plain-product) **or** search
> fallback · `imageUrl` (https, loads) or recorded gap · added to correct
> `LENS_DROPDOWN_GROUPS` group.

## 1. Research & scope (do first; no code yet)

- [x] 1.1 Enumerate currently-shipping third-party Z lenses per manufacturer
  (Sigma, Tamron, Viltrox, Samyang, Voigtländer, Laowa, TTArtisan, 7Artisans,
  Meike, Yongnuo) → `research/lenses.md` (`slug | name | manufacturer | line |
  type`, + cross-mount note, + discontinued flag).
- [x] 1.2 Apply the D7 scope boundary and **rebadge de-duplication**: exclude any
  lens Nikon already sells as first-party Nikkor (avoid double-listing a Tamron
  design). Mark in/out per candidate.
- [x] 1.3 Confirm slug conventions, dropdown order, and `MANUFACTURER_COLORS`
  additions in `research/decisions.md`.
- [x] 1.4 List the ≥2 sources per in-scope lens.

## 2. Shared wiring (do before bulk data)

- [x] 2.1 Add `Laowa`, `Meike`, `Yongnuo` to `MANUFACTURER_COLORS` in `engine.js`
  (skip any already added by a sibling change).
- [x] 2.2 Ensure the manufacturer-colour coverage test (added by the Sony change,
  or add it here if this change lands first) passes.
- [x] 2.3 **Checkpoint:** `npm test` green.

## 3. Sigma — DC DN (APS-C) for Z

- [x] 3.1 Primes: 16 f/1.4, 18 f/1.4, 23 f/1.4, 30 f/1.4, 56 f/1.4 DC DN.
- [x] 3.2 Zooms: 10-18 f/2.8, 18-50 f/2.8 DC DN.
- [x] 3.3 New `── Sigma ──` group; `npm run test:data` green.

## 4. Sigma — DG DN (full-frame) for Z

- [x] 4.1 Contemporary: 17 f/4, 20 f/2, 24 f/2, 45 f/2.8, 65 f/2, 90 f/2.8,
  500 f/5.6 (verify which are Z-released).
- [x] 4.2 Art: 24 f/1.4, 35 f/1.4, 50 f/1.4, 85 f/1.4, 105 f/2.8 macro (verify Z).
- [x] 4.3 Zooms: 28-45 f/1.8, 28-70 f/2.8, 24-70 f/2.8 II, 70-200 f/2.8,
  60-600, 100-400, 150-600 (verify Z availability at entry).
- [x] 4.4 Append to `── Sigma ──`; `npm run test:data` green.

## 5. Tamron — Di III for Z

- [x] 5.1 Zooms confirmed for Z (e.g. 17-70 f/2.8, 18-300, 28-75 f/2.8 G2,
  35-150, 50-300, 70-300, 150-500). **Exclude any Nikon sells as Nikkor.**
- [x] 5.2 New `── Tamron ──` group; `npm run test:data` green.

## 6. Viltrox (AF/LAB/Air) + Samyang (AF)

- [x] 6.1 Viltrox APS-C: 13 f/1.4, 23 f/1.4, 27 f/1.2, 33 f/1.4, 56 f/1.4;
  Air 25/35/40/56. FF: 16 f/1.8, 24 f/1.8, 35 f/1.8, 50 f/1.8, 85 f/1.8,
  135 f/1.8 LAB. New `── Viltrox ──`.
- [x] 6.2 Samyang AF for Z (verify list: 24/1.8, 35/1.8, 45/1.8, 75/1.8,
  135/1.8, 14 f/2.8, etc.). New `── Samyang ──`.
- [x] 6.3 `npm run test:data` green.

## 7. Voigtländer & Laowa (manual / specialty)

- [x] 7.1 Voigtländer native Z: APO-Lanthar 50 f/2, Nokton 40 f/1.2, others as
  released. New `── Voigtländer ──`.
- [x] 7.2 Laowa Z: 10 f/4, 12 f/2.8, 15 f/2, 33 f/0.95 (APS-C), 58 f/2.8,
  65 f/2.8 macro, 90 f/2.8 macro, 100 f/2.8 macro. New `── Laowa ──`.
- [x] 7.3 `npm run test:data` green.

## 8. Budget makers (TTArtisan / 7Artisans / Meike / Yongnuo) — representative

- [x] 8.1 TTArtisan AF Z: 27 f/2.8, 35 f/1.8, 56 f/1.8, 75 f/2 (+ notable MF).
- [x] 8.2 7Artisans + Meike AF Z: representative popular primes.
- [x] 8.3 Yongnuo AF Z: 35 f/2, 50 f/1.8, 85 f/1.8 (verify).
- [x] 8.4 New `── Other ──` group; `npm run test:data` green.

## 9. Images, ASIN & pricing finalisation

- [x] 9.1 Fill/verify `imageUrl` for every new lens; record placeholder gaps
  (KNOWN_IMAGE_GAPS.nikon).
- [x] 9.2 ASIN backfill via `check-prices-and-buy-links`; verify per-currency Buy
  links render `amazon.<tld>/dp/<asin>`.
- [x] 9.3 Regional pricing: current → 7 currencies; derived → `priceIncomplete`.

## 10. Final verification

- [x] 10.1 Ad-hoc link check over all new `productUrl` + `imageUrl` (0 dead).
- [x] 10.2 `npm test` — full suite green.
- [x] 10.3 `completeness.test.js` passes; record final third-party count + new
  Nikon total.
- [x] 10.4 jsdom render spot-check: new groups appear, card colours resolve,
  per-currency Buy links generate.

## 11. Archive

- [ ] 11.1 Run the OpenSpec archive flow for `add-thirdparty-lenses-nikon`.
