# Tasks — Expand Third-Party Lenses (Fujifilm X)

> **Resumability:** Work top-to-bottom; each group is an independent, committable
> batch ending in a test checkpoint. Resume at the first unchecked `- [ ]`.
> Partial data still passes as long as **each entered lens is complete**. Commit
> after each green checkpoint. This is an **expansion** — the existing 23
> third-party entries stay; add gaps + re-verify.
>
> **Per-lens definition of done (groups 3–7):** X-mount availability confirmed
> (APS-C only) · specs verified ≥2 sources · RRP 7 currencies (or
> `priceIncomplete` / USD-only for discontinued) · `focalLengthEquiv` = 1.5×
> crop · `productUrl` (manufacturer, https, live) · `asin` (verified plain-product)
> **or** search fallback · `imageUrl` (https, loads) or recorded gap · added to
> correct `LENS_DROPDOWN_GROUPS` group.

## 1. Research & gap analysis (do first; no code yet)

- [x] 1.1 Inventory the **existing** 23 Fujifilm third-party entries (from
  `LENS_DROPDOWN_GROUPS`) → `research/lenses.md`, marked "have".
- [x] 1.2 Enumerate the comprehensive X-mount third-party set per maker and mark
  the **gaps** to add (Sigma missing DC DN; Viltrox Air + missing AF; Zeiss
  Touit; Laowa; Meike; more TTArtisan/7Artisans). **APS-C only** — exclude
  full-frame-only designs.
- [x] 1.3 Confirm slug conventions (match existing), new dropdown groups, and
  `MANUFACTURER_COLORS` additions in `research/decisions.md`.
- [x] 1.4 List the ≥2 sources per gap lens + for the re-verification pass.

## 2. Shared wiring (do before bulk data)

- [x] 2.1 Add `Zeiss`, `Laowa`, `Meike` to `MANUFACTURER_COLORS` in `engine.js`
  (already present from a sibling change).
- [x] 2.2 Ensure the manufacturer-colour coverage test passes.
- [x] 2.3 **Checkpoint:** `npm test` green.

## 3. Sigma — complete the DC DN line

- [x] 3.1 Sigma 18mm f/1.4 DC DN does **not exist in any mount** (verified
  against Sigma's own catalog — the F1.4 DC DN series is 12/16/23/30/56mm
  only). No gap to fill; Sigma's X-mount DC DN Contemporary line is already
  complete in the dataset.
- [x] 3.2 N/A — no new Sigma entry.

## 4. Viltrox — Air series + missing AF

- [x] 4.1 Air series added: 25mm f/1.7, 35mm f/1.7, 56mm f/1.7 (40mm f/2.5 Air
  confirmed **not released for X-mount** — Sony E/Nikon Z only, excluded).
- [x] 4.2 27mm f/1.2 Pro added (confirmed X-mount). 20mm f/2.8 confirmed
  **declined for X-mount** by Viltrox — excluded.
- [x] 4.3 Appended to the existing `── Viltrox ──` group; `npm run test:data`
  green.

## 5. Zeiss — Touit (X-mount, discontinued)

- [x] 5.1 Touit 12mm f/2.8, 32mm f/1.8, 50mm f/2.8 macro added, all flagged
  `discontinued: true`, USD-only pricing (last known list price); `asin: null`
  (legacy listings unreliable) → search fallback.
- [x] 5.2 New `── Zeiss ──` group; `npm run test:data` green.

## 6. Laowa & Meike (new makers for Fujifilm)

- [x] 6.1 Laowa X: 9mm f/2.8 Zero-D, 65mm f/2.8 2x Ultra Macro APO, 4mm f/2.8
  Circular Fisheye — all confirmed for X-mount. New `── Laowa ──` group.
- [x] 6.2 Meike X AF: requested 25/35/50mm AF variants do **not exist** for
  X-mount (verified against Meike's official AF collection — those focal
  lengths are manual-focus-only or E/Z/RF-only). Added the genuine X-mount AF
  lineup instead: 33mm f/1.4, 55mm f/1.8 Pro, 85mm f/1.8 Pro. New `── Meike ──`
  group.
- [x] 6.3 `npm run test:data` green.

## 7. TTArtisan & 7Artisans — expand to representative comprehensive

- [x] 7.1 TTArtisan X added: AF 56mm f/1.8, AF 75mm f/2, manual 40mm f/2.8
  macro (confirmed MF, not AF — corrected from proposal wording), manual
  17mm f/1.4, 23mm f/1.4, 50mm f/1.2.
- [x] 7.2 7Artisans X added: AF 27mm f/2.8, AF 50mm f/1.8 (Lite series),
  manual 25mm f/1.8, manual 55mm f/1.4 II (current Mark II, not the
  superseded V1).
- [x] 7.3 Grew the existing `── Other ──` group; `npm run test:data` green.

## 8. Re-verify the existing 23 entries

- [x] 8.1 Re-checked each existing third-party entry's price/`asin`/
  `productUrl`/`imageUrl`. Findings applied: all 7 Sigma prices updated
  (June 2025 US tariff increase); Sigma 10-18mm f/2.8 corrected
  weight/length/diameter/elements/groups (was materially wrong); all 3 dead
  Tamron `productUrl`s fixed + 2 price corrections; all 6 Viltrox `productUrl`s
  fixed (Shopify restructure) + price updates; Viltrox 23mm f/1.4 flagged
  `discontinued: true` (confirmed sold out / discontinued line); TTArtisan,
  7Artisans, Samyang, Voigtländer price updates applied. All ASINs and image
  URLs on the original 23 confirmed live — no changes needed there.
- [x] 8.2 `npm run test:data` green.

## 9. Images, ASIN & pricing finalisation

- [x] 9.1 `imageUrl` filled for all new lenses where a live direct image URL
  was found; 8 items recorded in `KNOWN_IMAGE_GAPS.fujifilm` (Zeiss Touit ×3,
  Meike ×3, 7Artisans 25mm/50mm) where manufacturer/retailer pages blocked
  automated image retrieval.
- [x] 9.2 ASINs added where a confident single-listing match was found;
  left `null` (search fallback) where research flagged genuine duplicate/
  ambiguous reseller listings (Viltrox Air 35mm, Meike 85mm Pro).
- [x] 9.3 Regional pricing: current lenses with partial regional data flagged
  `priceIncomplete: true`; Zeiss Touit (discontinued) USD-only per convention.

## 10. Final verification

- [x] 10.1 Ad-hoc link check over all new + re-verified `productUrl` +
  `imageUrl` — all live (200) except a handful of B&H/7Artisans/Meike pages
  that return 403 to automated `curl` (known bot-protection behavior,
  confirmed reachable in normal browser use during research).
- [x] 10.2 `npm test` — full suite green (188/188).
- [x] 10.3 `completeness.test.js` passes. Fujifilm third-party lens count:
  23 → **46**; Fujifilm total lens count: **86**.
- [x] 10.4 jsdom render spot-check: new groups (Zeiss/Laowa/Meike) appear,
  existing entries intact, all manufacturer card colours resolve, per-currency
  Buy links generate correctly.

## 11. Archive

- [ ] 11.1 Run the OpenSpec archive flow for `expand-thirdparty-lenses-fujifilm`.
