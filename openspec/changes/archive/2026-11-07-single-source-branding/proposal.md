# Single-Source Branding

## Why

The design-system adoption (`adopt-design-system`, this branch) left four known soft spots, flagged at review: the logo mark and palette exist as literal copies in several files (currently held in sync only by `tests/data/brand-sync.test.js`), `apple-touch-icon.png` is hand-rendered and pixel-unverified, and neither the mobile breakpoint nor the Inter fallback rendering got a visual pass. To support pivoting the branding regularly, a rebrand should be: edit `assets/logo.svg` + the `engine.css` tokens, rerun the generator, and have everything else follow mechanically.

## What Changes

- **Generator reads the canonical sources instead of carrying copies**: `scripts/generate-seo.js` loads the mark from `assets/logo.svg` and the tokens (`--bg-deep`, accents) from `engine.css` at build time — its `LOGO_SVG` literal and hardcoded `#131722` theme-color go away. Every generated page then derives its identity from the two sources of truth.
- **About/Privacy gain generator-owned identity blocks**: marker-delimited head block (favicon/touch-icon/theme-color/font links + token `<style>`) and body header block (logo lockup), injected by the generator from the canonical sources. Prose stays hand-maintained; the pages join `buildAll()`, so the existing freshness gate (`tests/data/seo.test.js`) covers them automatically. Their inline identity copies stop being hand-synced.
- **`apple-touch-icon.png` becomes scripted and pixel-verified**: new `scripts/render-touch-icon.js` renders the icon from `assets/logo.svg` + `--bg-deep` via headless Chrome; a new Tier 1 test decodes the PNG (node `zlib`, no new deps) and asserts 180×180 and background pixels equal to `--bg-deep`, so a rebrand that forgets the icon fails tests.
- **`brand-sync.test.js` shrinks to what's genuinely duplicated**: after generation-time sourcing, the only remaining inline copy is `engine.js`'s `LOGO_SVG` (the engine can't read files at runtime) — the test keeps enforcing it, plus the favicon and the rgba-fallback whitelist, and drops the assertions that generation now makes impossible to violate.
- **Header context label**: the text next to the lockup no longer says "Camera Compare". In cameras mode it shows the active brand's name ("Fujifilm", "Canon", …; "All Brands" on the cross-brand compare page); in lenses mode it says "Lens Compare".
- **Compare cell shows one label at a time**: when the "Cameras to compare" slot-count field is visible (desktop), the "Compare" label is hidden; when the field is hidden (mobile, where the viewport clamps to 2 slots), "Compare" shows alone. Never both.
- **Verification debt paid**: a mobile (<600px) visual pass and an Inter-fallback rendering check are explicit tasks. Font stays on the Google Fonts CDN (decided).

## Capabilities

### New Capabilities
_None — all changes extend existing capabilities._

### Modified Capabilities
- `design-system`: identity on generated pages must be sourced from `assets/logo.svg` + `engine.css` tokens at generation time (not copied); the touch icon must be script-rendered from the same sources and pixel-verified by a test. (Delta applies on top of the `adopt-design-system` spec, which merges with this branch.)
- `site-pages`: About/Privacy remain hand-maintained prose but carry generator-owned identity blocks; "self-contained" is preserved in the served output (the injected content is static HTML/CSS).
- `brand-engine`: the header context label contract changes (brand name in cameras mode, "Lens Compare" in lenses mode — "Camera Compare" retired), and the compare label cell shows exactly one label depending on slot-count-field visibility.

## Impact

- **`scripts/generate-seo.js`** — reads `assets/logo.svg` + `engine.css` tokens; injects identity blocks into `about.html`/`privacy.html`; drops its `LOGO_SVG`/`#131722` literals.
- **`about.html`, `privacy.html`** — gain identity marker blocks; lose hand-maintained identity copies.
- **New `scripts/render-touch-icon.js`** — headless-Chrome renderer (dev-machine tool; fails with a clear message if Chrome is absent).
- **`tests/data/brand-sync.test.js`** — retargeted; **new `tests/data/touch-icon.test.js`** — PNG pixel check.
- **`tests/data/seo.test.js`** — no code change expected; About/Privacy enter its freshness gate via `buildAll()`.
- **`CLAUDE.md`** — rebrand instructions simplify (edit two sources → generator → test).
- **`<brand>/data.js` ×5 + `compare/index.html`** — `cameras.headerTitle` values become the brand name / "All Brands"; **`engine.css`** — one-label rule for the compare cell; **logic tests** — header-title and label-cell assertions updated.
- No runtime behavior changes; all generated output is still static, `file://`-compatible HTML.
