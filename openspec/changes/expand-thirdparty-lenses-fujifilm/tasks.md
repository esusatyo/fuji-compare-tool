# Tasks — Expand Third-Party Lenses (Fujifilm X)

> **Resumability:** Work top-to-bottom; each group is an independent, committable
> batch ending in a test checkpoint. Resume at the first unchecked `- [ ]`.
> Partial data still passes as long as **each entered lens is complete**. Commit
> after each green checkpoint. This is an **expansion** — the existing 23
> third-party entries stay; add gaps + re-verify.
>
> **Per-lens definition of done (groups 3–7):** X-mount availability confirmed
> (APS-C only) · specs verified ≥2 sources · RRP 7 currencies (or
> `priceIncomplete` / USD-only for discontinued) · `focalLengthEquiv` = 1.5× crop
> · `productUrl` (manufacturer, https, live) · `asin` (verified plain-product)
> **or** search fallback · `imageUrl` (https, loads) or recorded gap · added to
> correct `LENS_DROPDOWN_GROUPS` group.

## 1. Research & gap analysis (do first; no code yet)

- [ ] 1.1 Inventory the **existing** 23 Fujifilm third-party entries (from
  `LENS_DROPDOWN_GROUPS`) → `research/lenses.md`, marked "have".
- [ ] 1.2 Enumerate the comprehensive X-mount third-party set per maker and mark
  the **gaps** to add (Sigma missing DC DN; Viltrox Air + missing AF; Zeiss
  Touit; Laowa; Meike; more TTArtisan/7Artisans). **APS-C only** — exclude
  full-frame-only designs.
- [ ] 1.3 Confirm slug conventions (match existing), new dropdown groups, and
  `MANUFACTURER_COLORS` additions in `research/decisions.md`.
- [ ] 1.4 List the ≥2 sources per gap lens + for the re-verification pass.

## 2. Shared wiring (do before bulk data)

- [ ] 2.1 Add `Zeiss`, `Laowa`, `Meike` to `MANUFACTURER_COLORS` in `engine.js`
  (skip any already added by a sibling change).
- [ ] 2.2 Ensure the manufacturer-colour coverage test passes (add it here if
  this change lands before its siblings).
- [ ] 2.3 **Checkpoint:** `npm test` green.

## 3. Sigma — complete the DC DN line

- [ ] 3.1 Add missing DC DN prime(s) for X (e.g. 18mm f/1.4) — verify X release.
- [ ] 3.2 Append to the existing `── Sigma ──` group; `npm run test:data` green.

## 4. Viltrox — Air series + missing AF

- [ ] 4.1 Air series: 25 f/1.7, 35 f/1.7, 40 f/2.5, 56 f/1.7 (X).
- [ ] 4.2 Missing AF primes (e.g. 20 f/2.8, 27 f/1.2) — verify X.
- [ ] 4.3 Append to the existing `── Viltrox ──` group; `npm run test:data` green.

## 5. Zeiss — Touit (X-mount, discontinued)

- [ ] 5.1 Touit 12 f/2.8, 32 f/1.8, 50 f/2.8 macro. Flag `discontinued: true`;
  USD-only pricing acceptable; ASIN → search fallback where dead.
- [ ] 5.2 New `── Zeiss ──` group; `npm run test:data` green.

## 6. Laowa & Meike (new makers for Fujifilm)

- [ ] 6.1 Laowa X: 9 f/2.8, 65 f/2.8 macro, 4 f/2.8 fisheye (verify X). New
  `── Laowa ──` group.
- [ ] 6.2 Meike X AF: 25 f/1.8, 35 f/1.4, 50 f/1.8, 85 f/1.8. New `── Meike ──`
  group.
- [ ] 6.3 `npm run test:data` green.

## 7. TTArtisan & 7Artisans — expand to representative comprehensive

- [ ] 7.1 TTArtisan X: add beyond the current 2 (e.g. AF 27/2.8, 56/1.8, 40/2.8
  macro; notable MF 17/1.4, 23/1.4, 50/1.2, 75/2).
- [ ] 7.2 7Artisans X: add beyond the current 1 (e.g. AF 27/2.8, 50/1.8; notable
  MF 25/1.8, 55/1.4).
- [ ] 7.3 Grow the existing `── Other ──` group; `npm run test:data` green.

## 8. Re-verify the existing 23 entries

- [ ] 8.1 Re-check each existing third-party entry's price / `asin` /
  `productUrl` / `imageUrl` against current sources; update stale values, flag
  any newly discontinued. Use `check-prices-and-buy-links`.
- [ ] 8.2 `npm run test:data` green.

## 9. Images, ASIN & pricing finalisation

- [ ] 9.1 Fill/verify `imageUrl` for every new lens; record placeholder gaps
  (KNOWN_IMAGE_GAPS.fujifilm).
- [ ] 9.2 ASIN backfill via `check-prices-and-buy-links`; verify per-currency Buy
  links render `amazon.<tld>/dp/<asin>`.
- [ ] 9.3 Regional pricing: current → 7 currencies; discontinued (Touit) USD-only;
  derived → `priceIncomplete`.

## 10. Final verification

- [ ] 10.1 Ad-hoc link check over all new + re-verified `productUrl` + `imageUrl`
  (0 dead).
- [ ] 10.2 `npm test` — full suite green.
- [ ] 10.3 `completeness.test.js` passes; record new third-party count + new
  Fujifilm total (was ~23 third-party).
- [ ] 10.4 jsdom render spot-check: new groups appear, existing entries intact,
  card colours resolve, per-currency Buy links generate.

## 11. Archive

- [ ] 11.1 Run the OpenSpec archive flow for `expand-thirdparty-lenses-fujifilm`.
