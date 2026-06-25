## Why

The comparison tool is now multi-brand: Fujifilm, Canon, and Sony share one
engine, each brand living in its own self-contained `<brand>/data.js`. Nikon is
the next most-requested mirrorless ecosystem and the first brand to be added via
the reusable `add-camera-brand` skill (distilled from the Sony onboarding) — so
this change both grows coverage and proves that skill produces a clean,
green-tested brand with no engine regressions.

## What Changes

- **New `nikon/` brand directory** mirroring `canon/`, `sony/`, and `fujifilm/`:
  - `nikon/data.js` — `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
    `CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`,
    `REGISTERED_BRANDS`.
  - `nikon/index.html` — thin loader of `../engine.css`, `./data.js`,
    `../engine.js`.
- **Comprehensive Nikon Z-mount camera data (~14+ bodies)**, current + notable
  discontinued, across full-frame (FX), APS-C (DX), and the retro Zf/Zfc line —
  each with verified RRP (7 currencies for current bodies), specs, `productUrl`,
  Amazon `asin` (for per-currency Buy links), and `imageUrl`.
- **Comprehensive Nikon first-party Z lens data (~30–45 lenses)** — NIKKOR Z
  S-Line and non-S primes/zooms (FX) plus DX lenses, with verified specs, RRP,
  `productUrl`, `asin`, and `imageUrl`.
- **Nikon-specific spec section** added to the shared `engine.js`
  (`brand: 'nikon'`), surfacing Nikon-distinctive imaging features (N-RAW
  internal recording, High-Res Pixel Shift, Pre-Release Capture), gated by
  `BRAND_CONFIG.brandSections`.
- **Brand registration wiring** — add `{ slug: 'nikon', name: 'Nikon' }` to
  `REGISTERED_BRANDS` in **every** brand's `data.js` (a test enforces all brands
  list the same set), add `'nikon'` to `VALID_BRANDS` in the root `index.html`
  redirector, and add a `Nikon` entry to `MANUFACTURER_COLORS` in `engine.js`.
- **Test updates** — Nikon is auto-discovered by the data-tier tests via
  `brandDirs()`; add Nikon-field validation to `tests/helpers/schema.js`, extend
  `root-redirect.test.js` to honour `nikon`, and ensure the full suite is green.

No existing brand behaviour, UI layout, or currency logic changes — Nikon plugs
into the same dropdown/brand-switcher and renders through the same engine. The
reusable `add-camera-brand` skill already exists (shipped with the Sony change),
so this change consumes it rather than creating it.

## Capabilities

### New Capabilities
- `nikon-brand-data`: The Nikon brand dataset (cameras + lenses) and its
  registration/wiring into the multi-brand engine, including the Nikon-specific
  spec section and schema validation, such that Nikon renders and compares
  identically to existing brands.

### Modified Capabilities
<!-- No existing OpenSpec spec capabilities under openspec/specs/; this change
     introduces a new capability only. Engine/test changes are additive and
     covered by the new nikon-brand-data capability. -->

## Impact

- **New files**: `nikon/data.js`, `nikon/index.html`.
- **Modified files**: `engine.js` (Nikon spec section + `MANUFACTURER_COLORS`),
  `index.html` (root `VALID_BRANDS`), `fujifilm/data.js`, `canon/data.js`,
  `sony/data.js` (`REGISTERED_BRANDS`), `tests/helpers/schema.js` (Nikon brand
  fields), `tests/logic/root-redirect.test.js` (honour `nikon`).
- **Data sources**: Nikon official product pages, DPReview, B&H/Adorama, and
  Amazon (ASIN lookup) — each datum cross-checked against ≥2 sources before entry.
- **Tooling**: existing `scripts/fetch-images-commons.js`,
  `scripts/compute-prices.js`, `scripts/verify-images.js` reused to source images
  and derive regional prices.
- **No dependency or build changes**; zero-dependency static site is preserved.
