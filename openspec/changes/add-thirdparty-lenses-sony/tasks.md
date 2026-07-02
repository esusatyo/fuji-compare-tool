# Tasks — Add Third-Party Lenses (Sony E / FE)

> **Resumability:** Work top-to-bottom. Each numbered group is an independent,
> committable batch ending in a test checkpoint. If interrupted, resume at the
> first unchecked `- [ ]`. Data entry is split into small per-manufacturer
> batches; a partially-entered dataset still passes tests as long as **each
> entered lens is complete**. Commit after each green checkpoint.
>
> **Per-lens definition of done (applies to every entry in groups 3–10):**
> specs verified against ≥2 sources · RRP in 7 currencies (or `priceIncomplete`
> / USD-only for discontinued) · `productUrl` (manufacturer page, https, live) ·
> `asin` (verified plain-product) **or** deliberate search fallback ·
> `imageUrl` (https, loads) or recorded placeholder gap · added to the correct
> `LENS_DROPDOWN_GROUPS` group.

## 1. Research & scope (do first; no code yet)

- [ ] 1.1 Enumerate the comprehensive third-party E/FE lens list per manufacturer
  (Sigma, Tamron, Samyang, Viltrox, Zeiss, Voigtländer, Laowa, TTArtisan,
  7Artisans, Meike). Record each as `slug | name | manufacturer | line | type`
  in `research/lenses.md`, noting which are discontinued and which share an
  optical design with other mounts (cross-mount note only — no data impact).
- [ ] 1.2 Apply the D7 scope boundary — mark in/out for each candidate; drop
  cine/anamorphic/rehoused/teleconverter/long-tail clones.
- [ ] 1.3 Confirm slug conventions, per-maker dropdown order, and the exact
  `MANUFACTURER_COLORS` additions in `research/decisions.md`.
- [ ] 1.4 For each in-scope lens, list the ≥2 sources to be used at entry
  (manufacturer page, DPReview/spec sheet, retailer, Amazon ASIN).

## 2. Shared wiring (do before bulk data)

- [x] 2.1 Add `Zeiss`, `Laowa`, `Meike` to `MANUFACTURER_COLORS` in `engine.js`
  (bg/text pairs consistent with the existing palette).
- [x] 2.2 Add a data-tier test asserting **every** lens `manufacturer` across all
  brands has a `MANUFACTURER_COLORS` entry (guards future additions). Extend an
  existing referential/config test file rather than adding a new tier.
- [x] 2.3 **Checkpoint:** `npm test` green (no data yet; colour + coverage test
  pass).

## 3. Sigma — DC DN (APS-C) primes & zooms

- [x] 3.1 Primes: 16mm f/1.4, 18mm f/1.4, 23mm f/1.4, 30mm f/1.4, 56mm f/1.4 DC
  DN — full entries per the per-lens DoD.
- [x] 3.2 Zooms: 10-18mm f/2.8, 18-50mm f/2.8 DC DN.
- [x] 3.3 Add ids to a new `── Sigma ──` group in `LENS_DROPDOWN_GROUPS`;
  `npm run test:data` green.

## 4. Sigma — DG DN (full-frame) Contemporary & Art

- [ ] 4.1 Contemporary primes: 17mm f/4, 20mm f/2, 24mm f/2, 24mm f/3.5, 35mm
  f/2, 45mm f/2.8, 50mm f/2, 65mm f/2, 90mm f/2.8, 500mm f/5.6.
- [x] 4.2 Art primes: 20mm f/1.4, 24mm f/1.4, 35mm f/1.2, 35mm f/1.4, 50mm f/1.2,
  50mm f/1.4, 85mm f/1.4, 105mm f/2.8 macro, 135mm f/1.8, 300-600? (verify).
- [ ] 4.3 Zooms: 16-28 f/2.8, 24-70 f/2.8 II, 28-45 f/1.8, 28-70 f/2.8, 70-200
  f/2.8, 100-400, 60-600, 150-600.
- [ ] 4.4 Append to the `── Sigma ──` group; `npm run test:data` green.

## 5. Tamron — Di III (APS-C + full-frame)

- [ ] 5.1 APS-C: 11-20mm f/2.8, 17-70mm f/2.8, 18-300mm.
- [ ] 5.2 Full-frame zooms: 20-40 f/2.8, 28-75 f/2.8 G2, 35-150 f/2-2.8,
  50-300, 70-180 f/2.8 G2, 70-300, 150-500, 17-28 f/2.8, 50-400.
- [ ] 5.3 Full-frame primes: 20 f/2.8, 24 f/2.8, 35 f/2.8, 90 f/2.8 macro.
- [ ] 5.4 New `── Tamron ──` group; `npm run test:data` green.

## 6. Samyang / Rokinon — AF line

- [ ] 6.1 Primes: 12 f/2 (APS-C), 18 f/2.8, 24 f/1.8, 24 f/2.8, 35 f/1.8, 35
  f/2.8, 45 f/1.8, 75 f/1.8, 85 f/1.4 II, 135 f/1.8, 14 f/2.8.
- [ ] 6.2 Zooms: 24-70 f/2.8, 35-150 f/2-2.8 (verify availability).
- [ ] 6.3 New `── Samyang ──` group; `npm run test:data` green.

## 7. Viltrox — AF + LAB / Pro / Air

- [ ] 7.1 APS-C AF: 13 f/1.4, 23 f/1.4, 27 f/1.2, 33 f/1.4, 56 f/1.4; Air:
  25 f/1.7, 35 f/1.7, 40 f/2.5, 56 f/1.7.
- [ ] 7.2 Full-frame: 16 f/1.8 FE, 20 f/2.8, 24 f/1.8, 28 f/4.5, 35 f/1.8,
  50 f/1.8, 85 f/1.8 II, 135 f/1.8 LAB.
- [ ] 7.3 New `── Viltrox ──` group; `npm run test:data` green.

## 8. Zeiss — Batis / Loxia / Touit (mostly discontinued)

- [ ] 8.1 Batis (AF FF): 18 f/2.8, 25 f/2, 40 f/2 CF, 85 f/1.8, 135 f/2.8.
- [ ] 8.2 Loxia (MF FF): 21 f/2.8, 25 f/2.4, 35 f/2, 50 f/2, 85 f/2.4.
- [ ] 8.3 Touit (AF APS-C): 12 f/2.8, 32 f/1.8, 50 f/2.8 macro. Flag
  discontinued; USD-only pricing acceptable, ASIN → search fallback where dead.
- [ ] 8.4 New `── Zeiss ──` group; `npm run test:data` green.

## 9. Voigtländer & Laowa (manual / specialty)

- [ ] 9.1 Voigtländer: Nokton 21 f/1.4, 35 f/1.2, 40 f/1.2, 50 f/1.2;
  APO-Lanthar 35 f/2, 50 f/2, 65 f/2 macro, 110 f/2.5. New `── Voigtländer ──`.
- [ ] 9.2 Laowa: 9 f/5.6, 10 f/4, 12 f/2.8, 15 f/2 FE, 15 f/4 macro, 25 f/2.8
  macro, 33 f/0.95 (APS-C), 58 f/2.8, 65 f/2.8 macro (APS-C), 90 f/2.8 macro,
  100 f/2.8 macro. New `── Laowa ──`.
- [ ] 9.3 `npm run test:data` green.

## 10. Budget makers (TTArtisan / 7Artisans / Meike) — representative set

- [ ] 10.1 TTArtisan AF: 27 f/2.8, 35 f/1.8, 40 f/2.8 macro, 50 f/2, 56 f/1.8,
  75 f/2; plus notable MF (11 f/2.8 fisheye, 50 f/1.2).
- [ ] 10.2 7Artisans AF: 27 f/2.8, 35 f/1.8, 50 f/1.8, 85 f/1.8; notable MF.
- [ ] 10.3 Meike AF: 25 f/1.8, 35 f/1.4, 50 f/1.8, 85 f/1.8.
- [ ] 10.4 New `── Other ──` group; `npm run test:data` green.

## 11. Images, ASIN & pricing finalisation

- [ ] 11.1 Fill/verify `imageUrl` for every new lens (manufacturer product image
  preferred). Record any placeholder gaps in the change (KNOWN_IMAGE_GAPS.sony).
- [ ] 11.2 ASIN backfill via `check-prices-and-buy-links`: verified plain-product
  ASINs; discontinued/unavailable → search fallback. Re-verify a sample of Buy
  links per currency renders `amazon.<tld>/dp/<asin>`.
- [ ] 11.3 Regional pricing: current lenses carry all 7 currencies; discontinued
  USD-only; anything derived → `priceIncomplete: true`.

## 12. Final verification

- [ ] 12.1 Ad-hoc link check over **all** new `productUrl` + `imageUrl`
  (0 dead / 0 bad-image). Record counts.
- [ ] 12.2 `npm test` — full data + logic suite green.
- [ ] 12.3 `completeness.test.js` passes; record final third-party lens count and
  new total for Sony.
- [ ] 12.4 Render spot-check via jsdom/load-brand: new groups appear in the lens
  dropdown, manufacturer card colours resolve, per-currency Buy links generate.

## 13. Archive

- [ ] 13.1 When all above are checked and tests pass, run the OpenSpec archive
  flow for `add-thirdparty-lenses-sony`.
