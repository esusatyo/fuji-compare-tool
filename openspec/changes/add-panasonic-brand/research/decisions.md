# Panasonic — Design Decisions (Group 1.4)

Resolved choices that drive the scaffold (Group 2) and wiring (Group 3).

## Slug & directory
- Brand slug / directory: `panasonic`. `BRAND_CONFIG.slug = 'panasonic'`,
  `name = 'Panasonic'`. `REGISTERED_BRANDS` entry `{ slug:'panasonic', name:'Panasonic' }`.

## Series labels (drive `SERIES_COLORS` + dropdown grouping)
Three series, split by system + line:
- `'Lumix S (Full-frame)'` — all L-mount bodies (S1R II, S1 II, S5 II, S5 IIX, S9, S1H, S1, S1R, S5).
- `'Lumix GH (MFT)'` — video flagship MFT line (GH7, GH6, GH5 II, GH5).
- `'Lumix G (MFT)'` — photo/compact/entry MFT (G9 II, G9, G100D, GX9, G95).

## Colours (Lumix/Panasonic blue on near-black)
- `BRAND_CONFIG.accentColor = '#0046ad'`, `heroDark = '#0a1530'`.
- `SERIES_COLORS`:
  - `'Lumix S (Full-frame)'`: `{ bg:'#0a1530', text:'#6fa8ff' }`
  - `'Lumix GH (MFT)'`:      `{ bg:'#0a1228', text:'#7fb0ff' }`
  - `'Lumix G (MFT)'`:       `{ bg:'#0c1426', text:'#8ab4ff' }`
- `engine.js` `MANUFACTURER_COLORS['Panasonic'] = { bg:'#0a1228', text:'#6fa8ff' }`.

## Brand-specific spec section (D2)
- `engine.js` `SPEC_SECTIONS`: `{ id:'panasonic', brand:'panasonic', label:'Panasonic Video', specs:[…] }`.
- Rows (camera fields), chosen to NOT duplicate universal fields (processor,
  logVideo, subjectDetection already in base sections):
  - `vLog` (string|null) — text, "V-Log" / "V-Log L" / `—`.
  - `dualNativeIso` (boolean) — Dual Native ISO.
  - `openGate` (string|null) — text, Open Gate max capture (e.g. "6.4K"/"5.8K") / `—`.
  - `proResInternal` (boolean) — internal Apple ProRes / ProRes RAW.
- `tests/helpers/schema.js` branch `brandSections.includes('panasonic')`:
  - `vLog`        → `{ type:'string', nullable:true }`
  - `openGate`    → `{ type:'string', nullable:true }`
  - `dualNativeIso`   → `{ type:'boolean' }`
  - `proResInternal`  → `{ type:'boolean' }`
- `BRAND_CONFIG.brandSections = ['panasonic']`.

## Lens taxonomy
- `manufacturer: 'Panasonic'` for ALL first-party lenses (incl. Leica DG —
  Leica-designed, Panasonic-made — to keep them on the Panasonic placeholder card).
- `line` ∈ { `'LUMIX S'` (L-mount, full-frame), `'LUMIX G'` (MFT) }.
- `type` ∈ { `'Prime'`, `'Zoom'` }.
- MFT `focalLengthEquiv` = 2.0× crop (e.g. 25mm → "50mm"); L-mount = native FF.
- `LENS_DROPDOWN_GROUPS` (refine in 7.3/8.3): "LUMIX S Primes", "LUMIX S Zooms",
  "LUMIX G Primes", "LUMIX G Zooms".

## Defaults
- `cameras.defaultSelected`: 3 current flagships across both mounts —
  `['s5-ii', 's1r-ii', 'gh7']` (need a 4th non-default current body, e.g.
  `g9-ii`, for the picker-dedup test).
- `lenses.defaultSelected`: `['lumix-s-50mm-f1-8', 'lumix-s-24-70mm-f2-8-pro', 'lumix-g-12-35mm-f2-8-ii']`
  (final slugs confirmed at entry).

## Pricing / images / ASIN conventions (D5)
- USD = exact current US list RRP; non-USD = confirmed RRP or derived approx;
  unconfirmed regional → `priceIncomplete:true`. Discontinued bodies USD-only,
  `asin:null` OK (engine Amazon-search fallback).
- Images prefer Wikimedia Commons via `scripts/fetch-images-commons.js panasonic`;
  gaps allowlisted in `KNOWN_IMAGE_GAPS.panasonic` (`tests/data/completeness.test.js`).
- ASINs (Group 9.3) by model code (DC-S5M2, DC-S1RM2, DC-GH7, DC-G9M2…),
  plain body-only / lens-only listings — no kit/Renewed/International.

## Non-Goals (confirmed)
- No third-party L-mount (Sigma/Leica) or third-party MFT (OM/Sigma/Voigtländer).
- No box/cine bodies (BS1H/BGH1), no fixed-lens compacts, no original 4/3 DSLRs.
- Default first-visit brand stays Canon (unchanged).
