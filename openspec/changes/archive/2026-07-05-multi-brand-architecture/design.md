## Context

The current site is a single `index.html` (~2,500 lines) containing the rendering engine, all CSS, all Fujifilm camera/lens data, and brand identity fused together. It is served over HTTP (not `file://`) and already has a `MODE_CONFIG` abstraction that cleanly separates cameras vs. lenses rendering — this is the seed for a brand-agnostic engine.

The `MANUFACTURER_COLORS` and `SERIES_COLORS` maps, and the `MODE_CONFIG` pattern, show the code is already mostly brand-neutral in its rendering logic. The extraction is primarily a structural move, not a logic rewrite.

## Goals / Non-Goals

**Goals:**
- Fujifilm comparison works identically after the refactor (zero regression)
- Adding a new brand requires only creating a `<brand>/data.js` + `<brand>/index.html` shell — no engine changes
- Root `index.html` defaults to showing Fujifilm, with a brand switcher for other brands
- Canon EOS R cameras and RF lenses are added as the first non-Fujifilm brand
- Brand-specific spec sections render conditionally based on the active brand

**Non-Goals:**
- Cross-brand comparison (comparing a Fujifilm body against a Canon body)
- Filtering or search UI
- Lazy loading of brand data
- Automated data pipelines — Canon data is hand-verified AI-assisted entry

## Decisions

### 1. `engine.js` as a plain `<script>` include, not an ES module

The current architecture uses no bundler and works from HTTP with plain `<script>` tags. Introducing ES modules (`import`/`export`) would require either a bundler or a dev server with correct MIME types, and would break the simplicity of the single-file mental model.

**Decision**: `engine.js` is included via `<script src="../engine.js">` before the brand data script. It exposes its API on a global `window.CameraEngine` object (or simply relies on global function/variable hoisting as the current code does).

**Alternative considered**: ES modules with `type="module"` — rejected because it complicates local development and adds no tangible benefit at this scale.

### 2. `BRAND_CONFIG` contract defined in each brand's `data.js`

Each `data.js` declares a `BRAND_CONFIG` constant before being consumed by the engine. The engine reads `BRAND_CONFIG` at init time to set CSS custom properties and hero text.

```js
// Shape
const BRAND_CONFIG = {
  name:          'Fujifilm',       // display name
  accentColor:   '#cc0000',        // CSS --accent-color
  logoText:      'FUJI',           // bold part of logo
  logoAccent:    'film',           // lighter part of logo
  families:      ['X Series', 'GFX'],  // hero eyebrow
  brandSections: ['film-simulations'], // section IDs to show
};
```

The engine applies `accentColor` as a CSS custom property on `<html>` at init, replacing the hardcoded `--fuji-red`.

### 3. Spec sections carry a `brand` field; engine filters at render time

Universal sections (Sensor, Body, Video, etc.) have no `brand` field. Brand-specific sections declare `brand: 'fujifilm'` or `brand: 'canon'`. `renderTable()` skips sections whose `brand` doesn't match `BRAND_CONFIG.brandSections`.

```js
// In SPEC_SECTIONS (engine.js)
{ id: 'film-simulations', label: 'Film Simulations', brand: 'fujifilm', specs: [...] }
{ id: 'dpaf',             label: 'DPAF',             brand: 'canon',    specs: [...] }
{ id: 'clog',             label: 'C-Log',            brand: 'canon',    specs: [...] }
```

**Alternative considered**: Each brand's `data.js` defines its own `SPEC_SECTIONS` array — rejected because it duplicates the 10 universal sections across every brand file and makes universal spec changes require edits in N files.

### 4. Root `index.html` defaults to Fujifilm via redirect

The root `index.html` is a minimal HTML page that immediately redirects to `fujifilm/index.html` unless another brand is stored in `localStorage`. It also renders a visible brand picker in case JS is slow or the user wants to switch.

```
User visits /          → redirect to /fujifilm/ (default)
User clicks Canon      → navigate to /canon/
localStorage['brand']  → used to remember last visited brand
```

**Alternative considered**: iframe embed of brand page in root — rejected as overly complex and bad for SEO/sharing.

### 5. Canon data entry: AI-assisted, cross-verified

Canon EOS R camera specs are generated with AI assistance then cross-checked against Wikipedia camera comparison tables and Canon's official product pages. Buy links use Amazon AU / B&H / KEH; if no link is found, `buyUrl` is set to `null` and the Buy button renders as disabled.

## Risks / Trade-offs

- **Global variable collisions**: Extracting to `engine.js` means all engine functions are globals. Low risk given controlled file structure, but naming should be prefixed or namespaced if this becomes a concern later.
  → Mitigation: prefix engine globals with `CE_` or wrap in an IIFE if collisions appear.

- **Canon data accuracy**: AI-generated specs may have errors (wrong megapixel count, missing weather sealing, etc.).
  → Mitigation: each camera cross-checked against at least two sources (Wikipedia + Canon official) before commit. Prices sourced from live retailer pages.

- **`fujifilm/` URL change is a breaking change**: Any existing bookmarks or shared links to the root `index.html` will redirect, but direct links to hash fragments (`#lenses`) will need to be re-tested.
  → Mitigation: root `index.html` preserves hash and forwards it: `/fujifilm/#lenses`.

## Migration Plan

1. Create `multi-brand` git branch (already done)
2. Phase 1 — Restructure: extract engine, move Fujifilm data, validate parity
3. Phase 2 — Canon: add Canon data, validate conditionally rendered sections
4. Manual smoke test both brand pages before merging to `main`
5. No rollback needed — old `index.html` preserved in git history

## Open Questions

- Should the brand picker root page have its own visual design (hero/grid), or just redirect silently to Fujifilm?
- Canon lenses: include third-party RF-mount lenses (Sigma RF, Tamron RF) as Fujifilm does for X-mount, or Fujifilm-only for now?
