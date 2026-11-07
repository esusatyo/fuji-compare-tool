# Adopt Design System

## Why

The site currently has no unified visual identity: each brand page recolors itself with that brand's corporate accent (Canon red, Nikon yellow, …), the landing/compare/vs pages use an ad-hoc neutral blue, and there is no logo or favicon anywhere. A finished design handoff ("Compare Camera Specs — Logo & Color Theme System", July 2026) now exists: a "Framed Duo" logo mark, a dark-neutral token theme as the site default, and component treatments (nav, buttons, badges, table). Adopting it before launch gives every page one consistent look and a recognizable brand.

## What Changes

- Introduce a site-wide design-token theme (Theme A — Dark Neutral from the handoff: `#131722` background, `#20242F` surfaces, purple `#B48CE0` + teal `#4FC7B0` accents, Inter typography) in `engine.css`, applied identically on the landing page, brand pages, compare page, vs pages, About, and Privacy. **BREAKING**: per-brand page theming is removed — `BRAND_CONFIG.accentColor` / `heroDark` no longer drive page colors; all brands render with the same tokens.
- Add the "Framed Duo" logo mark (SVG from the handoff) to the repo and render it in the top-left of every page header, paired with the wordmark **"Compare Camera Specs"** (Inter 700). The mark + wordmark lockup links to the root landing page so users can re-pick a brand.
- Add a favicon derived from the logo mark (tight crop per the handoff) and reference it from every page, including all generated vs pages.
- The root landing page's returning-visitor auto-redirect is suppressed when a `?brands` query parameter is present, so the header logo link can reliably land on the brand picker without wiping the stored preference.
- Data-identity colors are explicitly retained: `SERIES_COLORS` camera-placeholder chips, `MANUFACTURER_COLORS` lens-placeholder colors, and per-brand landing-card accent stripes stay as-is (they encode what an item is, not page theme).
- Winner highlighting, buttons, badges, dropdowns, hero, and footer restyled to the token system (accent-tinted winner cells replace the green highlight).
- `scripts/generate-seo.js` templates (landing body, vs pages) updated to emit the new header lockup, favicon link, and themed styles; all generated pages regenerated.

## Capabilities

### New Capabilities
- `design-system`: The site-wide visual system — design tokens (dark neutral theme), the Framed Duo logo lockup with home link, favicon, typography, and the requirement that every page (landing, brand, compare, vs, about, privacy) renders with the same theme.

### Modified Capabilities
- `brand-engine`: The engine no longer applies per-brand page colors; `accentColor`/`heroDark`/`logoText`/`logoAccent` leave the `BRAND_CONFIG` contract. The header renders the shared site lockup (linking home) instead of a per-brand logo.
- `brand-picker`: The root redirect gains a suppression condition — a `?brands` (or equivalent) query parameter forces the landing page to render even when a valid brand preference is stored.

## Impact

- **`engine.css`** — full token overhaul (largest single change; every component restyled for dark surfaces).
- **`engine.js`** — header markup (logo lockup + home link), removal of per-brand color application in `init()`, winner/badge class output unchanged structurally.
- **`<brand>/data.js` ×5** — `accentColor`, `heroDark`, `logoText`, `logoAccent` removed from `BRAND_CONFIG`.
- **`tests/helpers/schema.js` + logic tests** — BRAND_CONFIG shape, header assertions, and any color assertions updated.
- **Root `index.html`** — redirect param, restyle, header lockup (via generator template).
- **`compare/index.html`** — drop inline accent override.
- **`scripts/generate-seo.js`** — landing/vs templates: favicon, lockup, theme; regenerate ~110 vs pages + sitemap.
- **`about.html`, `privacy.html`** — restyled to tokens (remain self-contained).
- **New assets** — `assets/logo.svg`, `favicon.svg` (checked in; no build step, no new runtime dependencies; Inter loaded with system-font fallback).
