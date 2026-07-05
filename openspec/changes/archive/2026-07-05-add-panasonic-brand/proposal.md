## Why

The comparison tool is now multi-brand: Fujifilm, Canon, Sony, and Nikon share
one engine, each brand living in its own self-contained `<brand>/data.js`.
Panasonic Lumix is the most-cross-shopped remaining mirrorless maker and the
only major brand spanning **two systems** — full-frame L-mount (Lumix S) and
Micro Four Thirds (Lumix G/GH) — so adding it both fills the tool's L-mount/MFT
gap and further exercises the reusable `add-camera-brand` skill.

## What Changes

- **New `panasonic/` brand directory** mirroring `nikon/`, `canon/`, `sony/`,
  and `fujifilm/`:
  - `panasonic/data.js` — `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
    `CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`,
    `REGISTERED_BRANDS`.
  - `panasonic/index.html` — thin loader of `../engine.css`, `./data.js`,
    `../engine.js`.
- **Comprehensive Panasonic camera data across both systems**, current +
  notable discontinued:
  - **Full-frame L-mount (Lumix S)** — e.g. S1R II, S5 II / S5 IIX, S9, S1R,
    S1, S1H, S5.
  - **Micro Four Thirds (Lumix G/GH)** — e.g. GH7, GH6, G9 II, G9, GH5 II, G100,
    GX9, plus notable discontinued bodies.
  - Each with verified RRP (7 currencies for current bodies), specs,
    `productUrl`, Amazon `asin` (per-currency Buy links), and `imageUrl`.
- **Comprehensive Panasonic first-party lens data across both mounts** —
  LUMIX S (L-mount, full-frame) primes/zooms plus LUMIX G (MFT) primes/zooms,
  with verified specs, RRP, `productUrl`, `asin`, and `imageUrl`.
- **Panasonic-specific spec section** added to the shared `engine.js`
  (`brand: 'panasonic'`), surfacing Panasonic-distinctive video/imaging features
  (V-Log / V-Log L, Dual Native ISO, Open Gate recording, internal recording
  limits / ProRes), gated by `BRAND_CONFIG.brandSections`.
- **Brand registration wiring** — add `{ slug: 'panasonic', name: 'Panasonic' }`
  to `REGISTERED_BRANDS` in **every** brand's `data.js` (a test enforces all
  brands list the same set), add `'panasonic'` to `VALID_BRANDS` in the root
  `index.html` redirector, and add a `Panasonic` entry to `MANUFACTURER_COLORS`
  in `engine.js`.
- **Test updates** — Panasonic is auto-discovered by the data-tier tests via
  `brandDirs()`; add Panasonic-field validation to `tests/helpers/schema.js`,
  extend `root-redirect.test.js` to honour `panasonic`, and keep the full suite
  green via small test-checkpointed batches.

No existing brand behaviour, UI layout, or currency logic changes — Panasonic
plugs into the same dropdown/brand-switcher and renders through the same engine.
The reusable `add-camera-brand` skill already exists, so this change consumes it.

## Capabilities

### New Capabilities
- `panasonic-brand-data`: The Panasonic brand dataset (L-mount + MFT cameras and
  lenses) and its registration/wiring into the multi-brand engine, including the
  Panasonic-specific video/log spec section and schema validation, such that
  Panasonic renders and compares identically to existing brands.

### Modified Capabilities
<!-- No existing OpenSpec spec capabilities under openspec/specs/; this change
     introduces a new capability only. Engine/test changes are additive and
     covered by the new panasonic-brand-data capability. -->

## Impact

- **New files**: `panasonic/data.js`, `panasonic/index.html`.
- **Modified files**: `engine.js` (Panasonic spec section + `MANUFACTURER_COLORS`),
  `index.html` (root `VALID_BRANDS`), `fujifilm/data.js`, `canon/data.js`,
  `sony/data.js`, `nikon/data.js` (`REGISTERED_BRANDS`), `tests/helpers/schema.js`
  (Panasonic brand fields), `tests/logic/root-redirect.test.js` (honour
  `panasonic`).
- **Data sources**: Panasonic official product pages, DPReview, B&H/Adorama, and
  Amazon (ASIN lookup) — each datum cross-checked against ≥2 sources before entry.
- **Tooling**: existing `scripts/fetch-images-commons.js`,
  `scripts/compute-prices.js`, `scripts/verify-images.js` reused to source images
  and derive regional prices.
- **No dependency or build changes**; zero-dependency static site is preserved.
