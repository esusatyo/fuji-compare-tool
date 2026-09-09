## Why

Sigma is already the most-represented third-party lens maker in this tool — 76
Sigma lens entries live across the five existing brands. But Sigma is also a
camera maker, and has been since 2002: the L-Mount `fp` (2019), `fp L` (2021)
and `BF` (2025) sit alongside two decades of Foveon bodies. Adding Sigma as the
sixth brand turns the site's most-cited third party into a first-party page, and
gives the tool its first coverage of the Foveon sensor lineage — a genuinely
differentiated dataset no competitor comparison site carries in full.

It also stresses the multi-brand architecture in a new way. Every brand so far
has been one living mount with a conventional lineup. Sigma is a brand whose
cameras span two mounts plus a fixed-lens line across 17 years, and whose lens
catalogue on this page is deliberately scoped to just one of them.

## What Changes

- **New `sigma/` brand directory** mirroring `panasonic/` (closest analogue —
  L-Mount, multi-line):
  - `sigma/data.js` — `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`, `CAMERA_ORDER`,
    `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`.
  - `sigma/index.html` — thin loader of `../engine.css`, `./data.js`, `../engine.js`.
- **Sigma camera data (18 bodies)** — every mirrorless and fixed-lens camera
  Sigma has released: L-Mount mirrorless (`BF`, `fp L`, `fp`), SA-mount Foveon
  mirrorless (`sd Quattro`, `sd Quattro H`), and the 13 Foveon fixed-lens
  compacts (`dp` Quattro, `DP` Merrill, the original `DP` line). Sigma's six
  SA-mount **DSLRs are excluded** — no brand on the site carries a DSLR, and
  every existing brand starts at its mirrorless system rather than the company's
  camera history.
- **Sigma first-party L-Mount lens data (~39–42 lenses)** — scoped to L-Mount
  full-frame `DG` glass. SA-mount DSLR lenses are out of scope, and the ~10
  APS-C `DC` L-Mount lenses are deferred (no Sigma body is APS-C L-Mount).
  22 of these already
  exist as third-party entries in `panasonic/data.js` and port over directly
  (same mount, same physical product).
- **Lower the camera `year` floor** in `tests/helpers/schema.js` from `2010` to
  `2008`, matching the lens floor already in that file — the current floor is a
  typo guard, and it excludes three real Sigma bodies (DP1 2008, DP2 2009,
  DP1s 2009).
- **Sigma-specific spec section** in `engine.js` (`brand: 'sigma'`) surfacing
  Foveon generation, shutter type, internal storage and L-Log — the specs that
  actually distinguish these bodies.
- **Two new test files.** `tests/data/schema-guards.test.js` gives
  `tests/helpers/schema.js` its first negative coverage (nothing currently
  asserts the schema rejects anything, so the `year` floor edit would be
  invisible to the suite). `tests/data/shared-mount.test.js` guards the new
  duplication this change creates: 22 lenses will exist in both
  `panasonic/data.js` and `sigma/data.js` as the same L-Mount product, and
  nothing else would stop them drifting apart.
- **Link & ASIN hygiene, delivered early from `expand-correctness-tests`.**
  This PR is the one that creates same-mount duplicate URLs and ASINs, so it
  also lands that change's link-hygiene group: per-brand (not global) URL
  uniqueness with a reviewed allowlist, the rule that entries sharing an `asin`
  must agree on `manufacturer` and have closely-similar `name`s, an ASIN
  coverage ratchet, and retirement of two stale `buyUrl` capability specs that
  mandate a disabled Buy state the engine has never implemented. The rest of
  `expand-correctness-tests` (rendered-output sweep, placeholder integrity, data
  plausibility, network link checker) stays open and is out of scope here.
- **Brand registration wiring** — `REGISTERED_BRANDS` in all six `data.js`
  files, `VALID_BRANDS` in the root redirector, `BRAND_CARD_ACCENTS` in
  `scripts/generate-seo.js`, a `compare/index.html` script tag, and a
  `root-redirect.test.js` case. `MANUFACTURER_COLORS` already has a `Sigma`
  entry and needs no change.

No existing brand's data or behaviour changes beyond registration. The 76
existing Sigma third-party entries in other brands' files stay exactly where
they are.

## Capabilities

### New Capabilities
- `sigma-brand-data`: The Sigma brand dataset (all released cameras + L-Mount
  first-party lenses) and its registration into the multi-brand engine,
  including the Sigma-specific spec section and its schema validation, such
  that Sigma renders and compares identically to existing brands.

### Modified Capabilities
<!-- None. The camera `year` validation floor drops from 2010 to 2008, but no
     existing capability under openspec/specs/ covers schema year validation
     (pricing-data is scoped to currency completeness), so that requirement is
     folded into sigma-brand-data. Engine and test changes are additive. -->


## Impact

- **New files**: `sigma/data.js`, `sigma/index.html`, plus generated SEO pages.
- **Modified files**: `engine.js` (Sigma spec section), root `index.html`
  (`VALID_BRANDS`), all five existing `<brand>/data.js` (`REGISTERED_BRANDS`),
  `tests/helpers/schema.js` (year floor + Sigma field branch),
  `tests/logic/root-redirect.test.js`, `tests/data/completeness.test.js`
  (`KNOWN_IMAGE_GAPS['sigma']`), `compare/index.html`,
  `scripts/generate-seo.js` (`BRAND_CARD_ACCENTS`).
- **Data sources**: sigma-global.com (authoritative for its own products),
  DPReview, Wikipedia (for the discontinued Foveon lineage), B&H/Adorama and
  Amazon for price/ASIN.
- **No dependency or build changes**; the zero-dependency static site is preserved.
