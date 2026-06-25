# Sony Brand — Decisions (task 1.4)

## Sony-specific spec section + fields (engine.js + schema.js)
Section id `sony`, label **"Color Science & AI AF"**, `brand: 'sony'`, rows:
- **Log / Color Profile** — `logProfile` (string|null) → value or `'—'`
  e.g. `'S-Log3 / S-Cinetone'`, `'S-Log3 / S-Cinetone / S-Log2'`, `null` (older bodies)
- **AI Processing Unit** — `aiAf` (boolean) → dedicated AI AF chip
  (A1 II, A9 III, A7R V, A7C R, A6700, ZV-E10 II, A7 V, A7R VI; FX30 = yes)
- **Real-time Tracking** — `realtimeTracking` (boolean) → most bodies 2019+

`schema.js` branch `brandSections.includes('sony')`:
```
add(checkField(cam, 'logProfile', { type: 'string', nullable: true }));
add(checkField(cam, 'aiAf', { type: 'boolean' }));
add(checkField(cam, 'realtimeTracking', { type: 'boolean' }));
```

## BRAND_CONFIG essentials
- name `Sony`, slug `sony`, accentColor `#ff6a00` (Sony orange), heroDark `#1a0d00`
- logoText `Sony`, logoAccent `''`, families `['E-mount System']`
- brandSections `['sony']`
- cameras.defaultSelected: `['a7-iv','a6700','a7c-ii']` (popular, in-stock)
- lenses.defaultSelected: `['fe-50mm-f14-gm','fe-24-70mm-f28-gm-ii','fe-70-200mm-f28-gm-oss-ii']`
- footerLinks: Sony Alpha Universe, DPReview Sony, Sony Alpha Rumors

## SERIES_COLORS (Sony orange/grey family)
- `Alpha (Full-frame)` → bg `#2a1500` text `#ffae66`
- `Alpha (APS-C)`      → bg `#1f1000` text `#e09a5a`
- `Cinema Line`        → bg `#1a1a1a` text `#d0d0d0`
- `ZV (Vlog)`          → bg `#241200` text `#ffc080`

## MANUFACTURER_COLORS['Sony'] (engine.js, for lens cards)
`{ bg: '#1a1408', text: '#ffae66' }`

## Slug conventions
- Cameras: lowercase, hyphenated, drop "Sony"/"Alpha" prefix: `a7-iv`, `a7r-v`,
  `a9-iii`, `a1-ii`, `a7c-ii`, `a7cr`, `fx30`, `zv-e10-ii`, `a6700`.
- Lenses: `fe-` / `e-` + focal + aperture + line, e.g.
  `fe-50mm-f14-gm`, `fe-24-70mm-f28-gm-ii`, `e-16-55mm-f28-g`.

## Sourcing methodology (≥2 sources per datum)
1. **Specs** — Sony official product page (primary) + DPReview spec sheet.
2. **RRP USD** — Sony US store / B&H launch price; cross-check Adorama.
3. **Regional RRP** — Sony regional stores where available, else derive via
   `scripts/compute-prices.js`; flag `priceIncomplete:true` if unconfirmed.
4. **ASIN** — Amazon US product page (10-char). Buy links generated per-currency.
5. **imageUrl** — Wikimedia Commons (stable https) preferred; verify embeddable
   via `scripts/verify-images.js`; `null` → engine placeholder fallback.

## Out of scope (this change)
ILX-LR1 (industrial), FX6/FX9 (pro cinema), third-party lenses, broadcast PZ
lenses (unless chosen at entry).
