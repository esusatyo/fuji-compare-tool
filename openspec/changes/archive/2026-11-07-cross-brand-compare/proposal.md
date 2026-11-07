# Cross-Brand Camera Comparison

## Why

Every comparison today is locked to a single brand, but real buying decisions cross
brands ("X-T5 or A7 IV?") — and cross-brand "X vs Y" search queries are the largest
keyword space the site does not yet cover. A dedicated cross-brand compare page plus
curated cross-brand vs-pages opens both the product gap and the SEO gap at once.

## What Changes

- **Brand data registry**: each `<brand>/data.js` wraps its existing `const` globals
  in an IIFE and registers them under `window.BRAND_DATA[<slug>]`, so multiple brand
  datasets can load on one page without `const` redeclaration collisions. Files stay
  standalone browser scripts (no imports); brand pages and `file://` keep working.
- **Engine reads the registry**: `engine.js` resolves the active brand's data from
  `BRAND_DATA` instead of bare globals. **BREAKING** for any consumer that read the
  old globals directly (tests' `load-brand.js` is updated in the same change).
- **New `/compare/` page**: loads all five brand datasets; each slot picks any
  camera from any brand via brand-grouped dropdowns; ids are namespaced
  `<brand>:<slug>`. Neutral site accent, per-camera series colors from the owning
  brand.
- **2–4 slots**: user-adjustable slot count on `/compare/` (2, 3, or 4); viewports
  under the mobile breakpoint are clamped to 2 regardless of the setting. Brand
  pages keep their existing 3-slot behavior.
- **Brand-tagged spec sections across brands**: a section tagged `brand: '<slug>'`
  renders when any selected camera belongs to that brand; cameras from other brands
  show "—" in those rows.
- **Shareable compare URLs**: `/compare/#cameras=<brand>:<slug>,…` with 2–4 entries,
  same `history.replaceState` semantics as brand pages.
- **Cross-brand SEO vs-pages**: `scripts/generate-seo.js` gains a curated list of
  popular cross-brand matchups and generates static pages under root `vs/`
  (e.g. `/vs/fujifilm-x100vi-vs-sony-a6700.html`), added to the sitemap and linked
  from the homepage cluster, with CTAs into `/compare/`.
- **Homepage & brand-page entry points**: a "Compare across brands" link on the
  landing page and brand pages.
- **Tests**: registry-shape validation, cross-brand slug-collision guard, jsdom
  render tests for `/compare/` (slot count, mobile clamp, cross-brand winners,
  "—" rendering, hash round-trip), and vs-page generation checks.

## Capabilities

### New Capabilities

- `brand-data-registry`: multi-brand-safe loading — each brand's data.js registers
  its dataset in `window.BRAND_DATA`; the engine and tools resolve data through it.
- `cross-brand-compare`: the `/compare/` page — brand-namespaced selection across
  all registered brands, 2–4 adjustable slots with mobile clamp, cross-brand
  winner highlighting and brand-tagged section rendering, shareable hash URLs.
- `cross-brand-seo-pages`: generator-owned static cross-brand vs-pages at root
  `vs/`, curated matchup list, sitemap inclusion, interlinking with brand vs-pages
  and the homepage.

### Modified Capabilities

- `brand-engine`: the engine SHALL resolve brand data via the `BRAND_DATA` registry
  (single registered brand on brand pages) instead of reading bare globals.
- `shareable-urls`: hash grammar extended — on `/compare/` slugs are
  brand-namespaced and the slug count follows the active slot count (2–4).
- `home-landing`: the landing page SHALL additionally link to the cross-brand
  compare page.

## Impact

- **Modified**: all five `<brand>/data.js` (mechanical IIFE wrap + registration),
  `engine.js` (data resolution, slot generalization, cross-brand mode), root
  `index.html` (compare link), `scripts/generate-seo.js` (cross-brand pages,
  sitemap), `tests/helpers/load-brand.js`, existing tier-1/tier-2 tests.
- **New**: `compare/index.html`, generated `vs/*.html`, new tier-1/tier-2 test
  files for registry and compare page.
- **No dependency changes**; still zero runtime dependencies, no build step.
- **Risk concentration**: the registry refactor touches every brand file — kept
  purely mechanical (wrap + register, no data edits) so review is diff-shape only.
