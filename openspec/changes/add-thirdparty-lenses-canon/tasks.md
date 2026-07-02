# Tasks — Add Third-Party Lenses (Canon RF / RF-S)

> **Resumability:** Work top-to-bottom; each group is an independent, committable
> batch ending in a test checkpoint. Resume at the first unchecked `- [ ]`.
> Partial data still passes as long as **each entered lens is complete**. Commit
> after each green checkpoint.
>
> **Per-lens definition of done (groups 3–6):** **RF/RF-S availability confirmed**
> · specs verified ≥2 sources · RRP 7 currencies (or `priceIncomplete`) · correct
> `focalLengthEquiv` (1.6× for RF-S APS-C, native for FF RF) · `productUrl`
> (manufacturer, https, live) · `asin` (verified plain-product) **or** search
> fallback · `imageUrl` (https, loads) or recorded gap · added to correct
> `LENS_DROPDOWN_GROUPS` group.

## 1. Research & scope (do first; no code yet)

- [x] 1.1 Enumerate **currently-shipping** third-party RF/RF-S lenses per maker
  (Sigma, Tamron, Viltrox, Samyang, Yongnuo, TTArtisan, 7Artisans, Laowa, Meike)
  → `research/lenses.md`. For each, **confirm RF/RF-S availability** (Canon
  licensing is recent — don't assume parity with E/X/Z).
- [x] 1.2 Apply the D7 scope boundary (honest, un-padded): exclude lenses not
  offered in RF/RF-S, EF-via-adapter, cine/anamorphic. Mark in/out.
- [x] 1.3 Confirm slug conventions, dropdown order, and `MANUFACTURER_COLORS`
  additions in `research/decisions.md`.
- [x] 1.4 List the ≥2 sources per in-scope lens.

## 2. Shared wiring (do before bulk data)

- [x] 2.1 Add `Laowa`, `Meike`, `Yongnuo` to `MANUFACTURER_COLORS` in `engine.js`
  (skip any already added by a sibling change).
- [x] 2.2 Ensure the manufacturer-colour coverage test passes (add it here if
  this change lands before its siblings).
- [x] 2.3 **Checkpoint:** `npm test` green.

## 3. Sigma — RF-S (APS-C) + any FF RF

- [x] 3.1 RF-S DC DN primes: 16 f/1.4, 23 f/1.4, 30 f/1.4, 56 f/1.4 (confirm each
  is RF-released). `focalLengthEquiv` = 1.6× crop.
- [x] 3.2 RF-S DC DN zooms: 10-18 f/2.8, 18-50 f/2.8.
- [x] 3.3 Any full-frame RF Sigma DG DN released (verify at entry).
- [x] 3.4 New `── Sigma ──` group; `npm run test:data` green.

## 4. Tamron — RF-S (APS-C) + any FF RF

- [x] 4.1 RF-S: 11-20 f/2.8, 17-70 f/2.8, 18-300 (confirm RF release).
- [x] 4.2 Any FF RF Tamron released (verify).
- [x] 4.3 New `── Tamron ──` group; `npm run test:data` green.

## 5. Viltrox — RF AF

- [x] 5.1 Confirmed RF AF lenses (e.g. 16 f/1.8, 27 f/1.2, 28 f/4.5, 56 f/1.4,
  Air series) — verify RF availability per lens.
- [x] 5.2 New `── Viltrox ──` group; `npm run test:data` green.

## 6. Other makers — Samyang / Yongnuo / TTArtisan / 7Artisans / Laowa / Meike

- [x] 6.1 Samyang RF AF (verify list); Yongnuo RF AF (e.g. 50 f/1.8, 85 f/1.8,
  35 f/2).
- [~] 6.2 [DEFERRED — sources lack required dims for budget MF primes; Laowa trio covers native-RF MF] TTArtisan RF (AF 27/2.8, 56/1.8, 75/2 where available; notable MF);
  7Artisans / Meike RF representative primes.
- [x] 6.3 Laowa RF (MF specialty: 10/4, 15/2, 58/2.8, 90/2.8 macro — verify RF).
- [x] 6.4 New `── Other ──` group; `npm run test:data` green.

## 7. Images, ASIN & pricing finalisation

- [x] 7.1 Fill/verify `imageUrl` for every new lens; record placeholder gaps
  (KNOWN_IMAGE_GAPS.canon).
- [~] 7.2 [PARTIAL — Tamron 11-20 + 3 Laowa have verified ASINs; Sigma/Viltrox/Yongnuo/Tamron-18-300 use search fallback pending check-prices-and-buy-links backfill] ASIN backfill via `check-prices-and-buy-links`; verify per-currency Buy
  links render `amazon.<tld>/dp/<asin>`.
- [x] 7.3 Regional pricing: current → 7 currencies; derived → `priceIncomplete`.

## 8. Final verification

- [x] 8.1 Ad-hoc link check over all new `productUrl` + `imageUrl` (0 dead).
- [x] 8.2 `npm test` — full suite green.
- [x] 8.3 `completeness.test.js` passes; record final third-party count + new
  Canon total (expected smallest of the five brands — that's correct).
- [x] 8.4 jsdom render spot-check: new groups appear, card colours resolve,
  RF-S `focalLengthEquiv` correct, per-currency Buy links generate.

## 9. Archive

- [ ] 9.1 Run the OpenSpec archive flow for `add-thirdparty-lenses-canon`.
