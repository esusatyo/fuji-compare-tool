# Nikon onboarding — decisions

## Series labels (drive SERIES_COLORS + dropdown grouping)
- `'Z (Full-frame)'` — Z9, Z8, Z7, Z7 II, Z6, Z6 II, Z6 III, Z5, Z5 II
- `'Z (APS-C)'` — Z50, Z50 II, Z30
- `'Z (Retro)'` — Zf (FX), Zfc (DX)

Three series → three `SERIES_COLORS` entries. `DROPDOWN_GROUPS` mirror these
(optionally split FF by era). Retro is split out because Zf/Zfc share a distinct
design language and read better as their own group.

## Colours
- accentColor `#ffd200` (Nikon yellow), heroDark `#1a1700` (near-black).
- logoText `'Nikon'`, logoAccent `''`.
- `MANUFACTURER_COLORS['Nikon']` (engine.js) — yellow-on-dark, e.g.
  `{ bg: '#1a1700', text: '#ffd54a' }`.

## Lens lines (`line` field)
- `'S-Line'` — premium S-designated primes/zooms (+ super-telephotos).
- `'NIKKOR Z'` — non-S full-frame primes/zooms (compact primes, value zooms).
- `'DX'` — APS-C lenses (set `focalLengthEquiv` to the 1.5× crop equivalent).
- `manufacturer: 'Nikon'` for all (matches the `MANUFACTURER_COLORS` key).

## Nikon brand-specific spec section
Section id `'nikon'`, label **"Nikon Imaging"**, `brand: 'nikon'`. Rows chosen to
be Nikon-distinctive and NOT already covered by universal fields (the base
sections already show `processor`, `logVideo`/N-Log, and `subjectDetection`):

| field | type | engine row | notes |
|---|---|---|---|
| `expeed` | string\|null | "EXPEED Generation" (text) | "EXPEED 7" / "EXPEED 6" |
| `nRaw` | string\|null | "N-RAW Internal" (text) | max res e.g. "8.3K", "6K", or `null`→"—" |
| `pixelShift` | string\|null | "Pixel Shift High-Res" (text) | max MP e.g. "96MP", "180MP", or `null` |
| `preCapture` | boolean | "Pre-Release Capture" (boolean) | C30/C120 pre-buffer |

Schema branch `brandSections.includes('nikon')`: `expeed` string nullable,
`nRaw` string nullable, `pixelShift` string nullable, `preCapture` boolean.

Per-camera values (from research):
- EXPEED 7 + nRaw + preCapture: Z9 (8.3K), Z8 (8.3K), Z6 III (6K), Z5 II (verify
  res — likely null/none), Zf (FW), Z50 II (no nRaw). EXPEED 6: Zfc, Z30.
- Pixel Shift: Z6 III/Z5 II/Zf = "96MP"; Z8/Z9 = "180MP" (FW); others null.
- preCapture true: Z9, Z8, Z6 III, Z5 II, Zf, Z50 II. false: Zfc, Z30.

## Pricing / images
- USD = current US list (RRP). Current bodies get all 7 currencies; discontinued
  bodies USD-only (others `null`). Lenses with unconfirmed regional RRP →
  `priceIncomplete: true`; the three flagged unconfirmed lens prices ship
  `priceIncomplete`.
- Images via `scripts/fetch-images-commons.js nikon cameras` (then `--apply`);
  gaps → `KNOWN_IMAGE_GAPS.nikon`. Lenses likely mostly placeholder.

## Scope confirmed
Z-mount mirrorless only (no F-mount DSLRs, no FTZ-adapted F lenses, no
third-party Z lenses). 14 bodies, 48 NIKKOR Z lenses.
