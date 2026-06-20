## Why

The current site is a single monolithic `index.html` tightly coupled to Fujifilm — the brand identity, all camera/lens data, and the rendering engine are fused together. Expanding to support Canon, Nikon, or any other brand requires a clean separation between the shared rendering engine and brand-specific data, so new brands can be added without touching the engine.

## What Changes

- **BREAKING**: `index.html` is replaced by a brand picker landing page; Fujifilm compare moves to `fujifilm/index.html`
- Extract all rendering, state management, CSS, and UI logic into a shared `engine.js`
- Move all Fujifilm data (cameras, lenses, spec sections, dropdown groups) into `fujifilm/data.js`
- Introduce a `BRAND_CONFIG` contract that each brand's data file must satisfy
- Add `brand` field to spec sections so Fujifilm-specific sections (Film Simulations) are shown conditionally
- Add Canon EOS R as the first non-Fujifilm brand (`canon/data.js` + `canon/index.html`)
- Add Canon-specific spec sections (DPAF, C-Log) that only appear on the Canon page
- Brand picker `index.html` at root defaults to showing the Fujifilm compare page; users can switch brands from there
- Buy buttons are disabled (not hidden) when no retailer link is available
- No cross-brand comparison in this change — each brand page compares within its own catalog

## Capabilities

### New Capabilities

- `brand-engine`: Shared rendering engine and UI shell that is brand-agnostic; consumes a `BRAND_CONFIG` + item data at runtime
- `brand-picker`: Root landing page that defaults to Fujifilm compare on first visit; presents a brand switcher so users can navigate to other brand pages
- `canon-eos-r`: Canon EOS R camera and RF lens data, with Canon-specific spec sections

### Modified Capabilities

- None — this is a structural refactor; existing Fujifilm comparison behaviour is preserved exactly

## Impact

- **`index.html`**: Replaced by brand picker; Fujifilm experience moves to `fujifilm/index.html`
- **`engine.js`** (new): All rendering, CSS, state management extracted here
- **`fujifilm/data.js`** (new): All Fujifilm camera + lens data + `BRAND_CONFIG`
- **`fujifilm/index.html`** (new): Thin shell — imports engine + Fujifilm data
- **`canon/data.js`** (new): Canon EOS R cameras + RF lenses + `BRAND_CONFIG`
- **`canon/index.html`** (new): Thin shell — imports engine + Canon data
- **Umami analytics**: Script tag needs to be present in each brand shell; same website ID is fine
- **No external dependencies added**
