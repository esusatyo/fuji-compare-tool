## Context

A high-fidelity design handoff (scratchpad copy of `Compare Camera Specs Logo.zip`, to be checked into the repo under `assets/design/`) defines:

- **Logo**: "Framed Duo" mark — four viewfinder corner brackets (stroke 3, round caps) framing two overlapping circles (r=10 at (24,32)/(40,32)) filled purple `#B48CE0` and teal `#4FC7B0`. Three SVGs provided (dark-theme, light-lavender, monochrome `#3A3A3A`). Lockup = mark + "Compare Camera Specs" in Inter 700; never put the wordmark inside the mark.
- **Theme A — Dark Neutral (chosen, sole theme)**: `bg-deep ~#131722`, `bg-surface ~#20242F–#262B38`, `border ~#3C4150`, `text-primary ~#ECEDF1`, `text-secondary ~#9CA3B5–#B7BCC9`, `accent-primary ~#B48CE0` (purple), `accent-secondary ~#4FC7B0` (teal).
- **Conventions**: accents label compared columns (A=primary, B=secondary); badges = accent at ~18% opacity fill + full-strength accent text; winner cell = accent/0.15 tint + bold; radii 9/12–16/20; 8px spacing increments; Inter 400–800.

Current state: light theme with per-brand accents (`BRAND_CONFIG.accentColor`/`heroDark` set on `:root` by `engine.js` init), text wordmark only, no logo, no favicon. ~110 generated vs pages and the landing body come from `scripts/generate-seo.js` templates. About/Privacy are self-contained static pages.

User decisions already made: dark-neutral only; wordmark "Compare Camera Specs" (plural); logo links home with redirect suppressed by query param; data-identity colors (SERIES_COLORS, MANUFACTURER_COLORS, landing brand-card stripes) are kept.

## Goals / Non-Goals

**Goals:**
- One theme, every page: landing, 5 brand pages, compare, all vs pages, About, Privacy render from the same tokens with no per-brand recoloring.
- Logo lockup top-left on every page, linking to the root brand picker; favicon on every page.
- Pixel-faithful to the handoff for colors, logo geometry, nav/button/badge/table treatments.
- Stay zero-build, zero-runtime-dependency, `file://`-compatible.

**Non-Goals:**
- No light mode / theme switcher (alternates B–D are documented but not implemented).
- No redesign of information architecture, spec content, or generated-page structure.
- No replacement of data-identity colors (series chips, lens-maker placeholders, brand-card stripes).
- No new imagery/icons beyond the provided logo mark.

## Decisions

1. **Token layer in `engine.css` `:root`, keeping `--accent-color` as an alias.** New tokens: `--bg-deep`, `--bg-surface`, `--bg-surface-2`, `--border`, `--text-primary`, `--text-secondary`, `--accent-primary`, `--accent-secondary`, plus radius/spacing tokens. `--accent-color: var(--accent-primary)` is retained as a compatibility alias because generated pages, the landing inline styles, and many engine rules reference it — this shrinks the diff and keeps un-regenerated pages coherent. Old light-theme tokens (`--bg`, `--white`, `--gray-*`, `--green-*`, `--header-dark`, `--hero-dark`) are remapped or removed as each rule is restyled. Use the hex values from the handoff tables (`oklch` equivalents noted in comments only — hex keeps `file://`/old-browser safety trivial).

2. **Engine stops applying brand colors; `BRAND_CONFIG` sheds theming fields.** `init()` no longer sets `--accent-color`/`--hero-dark`; `accentColor`, `heroDark`, `logoText`, `logoAccent` are removed from all five `data.js` files, `compareBrandConfig()`, and the schema test. Chosen over "keep fields but ignore them" because dead required fields in a hand-maintained data contract invite drift, and the schema test is the enforcement point anyway.

3. **Logo lockup is inline SVG emitted by `engine.js` (engine pages) and by the generator templates (static pages).** Inlining avoids a relative-path asset lookup that differs per directory depth and works from `file://` with zero extra requests. The canonical mark also lives at `assets/logo.svg` (checked in, with the handoff's other variants under `assets/design/`) as the source of truth; the inline copies must match it byte-for-byte in geometry. The lockup anchor: `<a class="brand-home" href="<root-relative>?brands">` wrapping mark (24px) + wordmark "Compare Camera Specs" (15px/700). The `?brands` target is depth-aware: `./?brands` on the landing, `../?brands` from `<brand>/`, `compare/`, and `vs/`, `../../?brands` from `<brand>/vs/`.

4. **Redirect suppression via `URLSearchParams`.** Root `index.html`'s redirect IIFE gains an early return when `new URLSearchParams(location.search).has('brands')`. Chosen over clearing `localStorage` (user keeps their brand shortcut for direct visits) and over removing the redirect (existing spec'd behavior worth keeping). Canonical URL is unaffected; crawlers see identical content either way.

5. **Favicon: SVG primary, generated PNG fallback, emitted inside the generator-owned head block.** `favicon.svg` = the mark tight-cropped (viewBox trimmed to stroke extents) at repo root. Generator emits `<link rel="icon" type="image/svg+xml" href="<depth-relative>/favicon.svg">` + `<meta name="theme-color" content="#131722">` in every `seo:begin` head block so relative paths are always depth-correct; About/Privacy get the same links by hand. A 180px `apple-touch-icon.png` is produced once from the SVG via macOS tooling (`qlmanage`/`sips`) if available at implementation time; if not, ship SVG-only and note it (all evergreen browsers accept SVG favicons).

6. **Inter via Google Fonts `<link>` with a full system fallback stack.** `font-family: 'Inter', -apple-system, …` so `file://`/offline use falls back gracefully. The site already loads external analytics, so a font CDN doesn't change the dependency posture; self-hosting woff2 was considered but rejected to avoid checking binaries into a hand-maintained repo. The font link joins the generator head block + engine-page `<head>`s + About/Privacy.

7. **Column accents cycle primary/secondary; winner cells tint with their column's accent.** Slots 1/3 use `--accent-primary`, slots 2/4 `--accent-secondary` (matching the handoff's "camera A purple / camera B teal" with an obvious extension). Implemented purely in CSS via `:nth-child` on `.compare-slot`/`.spec-value` setting a `--col-accent` custom property; winner style becomes `background: color-mix(in srgb, var(--col-accent) 15%, transparent)` with a plain-rgba fallback line for older engines. This replaces the green `--green-bg`/`--green-text` highlight.

8. **Product photos sit on a light chip.** Real camera/lens photos (white-background JPEGs from Wikimedia/manufacturers) would float as white rectangles on `bg-deep`. `.cam-image-wrap` (and vs-page photo wraps) get a near-white rounded surface (`#F4F5F7`, radius 12) so photos read as intentional cards — consistent with the handoff's "image area placeholder" card treatment. SVG placeholder chips (series/manufacturer colored) keep their own dark backgrounds and render on the same chip.

9. **Generated pages: template edit + full regenerate.** All vs pages, the landing body, and head blocks are generator-owned; the theme lands there by editing `scripts/generate-seo.js` templates (header lockup, favicon/font links, removal of `--accent-color`/`--hero-dark` inline overrides, dark-theme inline styles for vs-specific components) and rerunning `node scripts/generate-seo.js`. No generated file is hand-edited.

## Risks / Trade-offs

- [Dark-only flip surprises users / hurts readability somewhere] → The handoff names dark as the primary; contrast tokens meet the handoff's own pairings. Verify each page type visually (landing, brand, compare, vs, About, Privacy) before merge; light alternates remain documented in `assets/design/` for a future mode.
- [`color-mix()` unsupported in older browsers] → Every `color-mix` rule is preceded by a plain rgba fallback declaration; worst case the winner tint is slightly off-hue, never missing.
- [~110 regenerated vs pages make an unreviewable diff] → Review the template diff + a spot-check sample (one cross-brand, one per-brand vs page); tests (`cross-vs`, seo tests) gate structural regressions.
- [Tests encode the old look (accent colors, logo text, green winner)] → Schema/logic tests are updated in the same change; `npm test` is the gate before regeneration and before commit.
- [Google Fonts unreachable (offline, `file://`, blocked)] → System fallback stack keeps the UI legible; no layout depends on Inter metrics.
- [Removing `BRAND_CONFIG` theming fields breaks the add-camera-brand skill/docs] → Update `.claude/skills/add-camera-brand/SKILL.md` and `CLAUDE.md` in the same change.

## Migration Plan

Single PR off `main`. Order: assets + tokens → engine (markup, then CSS) → data files + schema/tests → root/compare/About/Privacy → generator templates → regenerate → `npm test` + visual pass. Rollback = revert the PR; no data migration, no stored-state format changes (`localStorage['brand']` semantics unchanged).

## Open Questions

- None blocking. (PNG favicon fallback is best-effort per Decision 5; skipping it is acceptable.)
