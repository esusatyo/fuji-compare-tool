# Research — Sigma data-entry conventions

Concrete conventions for entry. Rationale lives in `design.md`; this file is the
lookup you keep open while typing data.

## Slugs

- Cameras: lowercase, `.`/space stripped — `bf`, `fp`, `fp-l`, `sd-quattro`,
  `sd-quattro-h`, `dp0-quattro`, `dp1-merrill`, `dp1x`.
- Lenses: existing `sigma-<focal>-<aperture>-<designation>` pattern, ported
  as-is from `panasonic/data.js`. New APS-C L-Mount entries take a `-dc` suffix
  to stay distinct from the MFT copies (`sigma-16mm-f14-dc` vs the existing
  `sigma-16mm-f14-mft`).
- **No slug may contain `:`** — reserved as the `/compare/` brand separator.

## `BRAND_CONFIG`

```
name:          'Sigma'
slug:          'sigma'
families:      ['L-Mount Mirrorless', 'Foveon (SA-Mount & Compact)']
brandSections: ['sigma']
mount:         'L-Mount'
heroCamera:    'bf'          // current, distinctive, good official photo
```

`heroCamera: 'bf'` — the BF's milled unibody is the most recognisable thing
Sigma has made and it is current. Confirm a freely-licensed or official photo
resolves before locking it in; fall back to `fp` if not.

No theming fields (`accentColor`/`heroDark`/`logoText`/`logoAccent`) — a test
rejects them. The landing-card stripe goes in `BRAND_CARD_ACCENTS` in
`scripts/generate-seo.js`; pick something distinct from the five existing
stripes and from `MANUFACTURER_COLORS['Sigma']`'s muted `#8080c0` (which stays
as-is for lens placeholder cards on other brands' pages).

## `SERIES_COLORS` — 6 series

| series | members |
|---|---|
| `BF` | bf |
| `fp Series` | fp, fp-l |
| `sd Quattro` | sd-quattro, sd-quattro-h |
| `dp Quattro` | dp0/1/2/3-quattro |
| `Merrill` | dp1/2/3-merrill |
| `DP Compact` | dp1, dp1s, dp1x, dp2, dp2s, dp2x |

## Sigma camera fields (drive the `brand: 'sigma'` spec section)

| field | type | values |
|---|---|---|
| `foveonGen` | `string \| null` | `'X3'` · `'X3 Merrill'` · `'X3 Quattro'` · `null` (Bayer: fp/fp L/BF) |
| `shutterType` | `string` | `'Mechanical + electronic'` · `'Electronic only'` · `'Mechanical'` |
| `internalStorage` | `string \| null` | `'230GB SSD'` (BF only), else `null` |
| `lLog` | `boolean` | BF and fp L true; everything Foveon false |

## Field conventions for the odd bodies

- `sensorMP` = **output image resolution**, not summed photodiodes (design §3).
  Layer structure goes in `sensorType`, e.g. `'Foveon X3 Quattro (APS-C)'`.
- `maxVideoRes` = `'None'` for the early DP compacts (required string).
- `evfType` — the EVF spec on the `sd Quattro` pair; `null` everywhere else
  (fp, fp L, BF and every dp/DP compact have no built-in finder).
- `lensType` — only `'Interchangeable'` or `'Fixed'`; every existing brand on
  the site uses exactly these two values. The mount/fixed-lens detail belongs in
  `tagline` or the Overview section, not here.
- `cardSlots` — BF takes `'None (230GB internal SSD)'`.
- `ibis: false` on every Sigma body; `ibisStops: null`.
- `subjectDetection` — `null` on everything except BF/fp L.

## Pricing

- Only `bf`, `fp-l`, `fp` need all 7 currencies.
- The other 15 bodies are `discontinued: true` and may be USD-only with no
  `priceIncomplete` flag (schema's discontinued rule).
- Record the **launch** USD RRP for discontinued bodies.
- Ported lenses: clear `priceIncomplete` before running
  `compute-prices.js sigma lenses --recompute` — the script skips flagged items.

## Images

- `scripts/fetch-images-commons.js sigma cameras` **without** `--apply` first;
  eyeball the id→url map (a model code appearing only in a trailing `(...)` is
  the capture camera, not the subject).
- Anything unresolved goes in `KNOWN_IMAGE_GAPS['sigma']` in
  `tests/data/completeness.test.js` — documented gap, never a silent `null`.
- Then `scripts/verify-images.js sigma`, and
  `RUN_LINK_TESTS=1 npm run test:links` before the PR (required whenever URLs
  change).
