## Why

The comparison tool is now multi-brand (Fujifilm + Canon share one engine, each
brand living in its own self-contained `<brand>/data.js`). Sony is the largest
mirrorless ecosystem and the most-requested missing brand. Adding it both grows
the tool's coverage and proves the multi-brand architecture generalises — which
is why this change also extracts the "add a brand" procedure into a reusable
skill so the next brand (Nikon, OM System, …) is a repeatable, low-effort task.

## What Changes

- **New `sony/` brand directory** mirroring `canon/` and `fujifilm/`:
  - `sony/data.js` — `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`, `CAMERA_ORDER`,
    `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`.
  - `sony/index.html` — thin loader of `../engine.css`, `./data.js`, `../engine.js`.
- **Comprehensive Sony E-mount camera data (~30+ bodies)**, current + notable
  discontinued, across full-frame (Alpha 7/9/1/FX), APS-C (a6xxx), and vlogging
  (ZV) lines — each with verified RRP (7 currencies), specs, `productUrl`,
  Amazon `asin` (for per-currency Buy links), and `imageUrl`.
- **Comprehensive Sony first-party lens data (~70 lenses)** — all current
  Sony-branded FE (G Master / G / standard) and E-mount APS-C lenses, with
  verified specs, RRP, `productUrl`, `asin`, and `imageUrl`.
- **Sony-specific spec section** added to the shared `engine.js`
  (`brand: 'sony'`), surfacing Sony-distinctive specs (e.g. Picture Profiles /
  S-Log3 / S-Cinetone, AI Processing Unit, Real-time Recognition AF), gated by
  `BRAND_CONFIG.brandSections`.
- **Brand registration wiring** — add `{ slug: 'sony', name: 'Sony' }` to
  `REGISTERED_BRANDS` in **every** brand's `data.js` (a test enforces all brands
  list the same set), add `'sony'` to `VALID_BRANDS` in the root `index.html`
  redirector, and add a `Sony` entry to `MANUFACTURER_COLORS` in `engine.js`.
- **Test updates** — Sony is auto-discovered by the data-tier tests via
  `brandDirs()`; add Sony-field validation to `tests/helpers/schema.js`, extend
  `root-redirect.test.js` to honour `sony`, and ensure the full suite is green.
- **New reusable skill** `add-camera-brand` documenting the full end-to-end
  procedure (research → scaffold → wire → brand section + schema → price/image
  scripts → verify tests) so any future brand can be added the same way.

No existing brand behaviour, UI layout, or currency logic changes — Sony plugs
into the same dropdown/brand-switcher and renders through the same engine.

## Capabilities

### New Capabilities
- `sony-brand-data`: The Sony brand dataset (cameras + lenses) and its
  registration/wiring into the multi-brand engine, including the Sony-specific
  spec section and schema validation, such that Sony renders and compares
  identically to existing brands.
- `add-brand-skill`: A reusable, brand-agnostic skill that codifies how to add a
  new camera brand end-to-end (data research/validation, scaffolding, wiring,
  brand section, scripts, tests).

### Modified Capabilities
<!-- No existing OpenSpec spec capabilities defined under openspec/specs/; this
     change introduces new capabilities only. Engine/test changes are additive
     and covered by the new sony-brand-data capability. -->

## Impact

- **New files**: `sony/data.js`, `sony/index.html`,
  `.claude/skills/add-camera-brand/SKILL.md` (+ any helper notes).
- **Modified files**: `engine.js` (Sony spec section + `MANUFACTURER_COLORS`),
  `index.html` (root `VALID_BRANDS`), `fujifilm/data.js` & `canon/data.js`
  (`REGISTERED_BRANDS`), `tests/helpers/schema.js` (Sony brand fields),
  `tests/logic/root-redirect.test.js` (honour `sony`).
- **Data sources**: Sony official product pages (alpha-universe / sony.com),
  DPReview, B&H/Adorama, and Amazon (ASIN lookup) — each datum cross-checked
  against ≥2 sources before entry.
- **Tooling**: existing `scripts/compute-prices.js`, `scripts/fetch-images.js`,
  `scripts/apply-images.js`, `scripts/verify-images.js` reused to derive
  regional prices and source images.
- **No dependency or build changes**; zero-dependency static site is preserved.
