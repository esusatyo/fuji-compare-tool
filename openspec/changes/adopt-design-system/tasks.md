## 1. Assets

- [x] 1.1 Create a feature branch off `main` (e.g. `adopt-design-system`)
- [x] 1.2 Check the design handoff into the repo: `assets/design/` (README + all three logo SVG variants + design_reference.dc.html from the zip), and `assets/logo.svg` as the canonical dark-theme mark
- [x] 1.3 Create root `favicon.svg` — the mark tight-cropped per the handoff (viewBox trimmed to stroke extents, both circles equal weight)
- [x] 1.4 Best-effort: generate `apple-touch-icon.png` (180px) from the SVG via headless Chrome (qlmanage produced white padding; Chrome render is full-bleed 180×180 on #131722)

## 2. Token theme in engine.css

- [x] 2.1 Replace the `:root` block with the Theme A token set (`--bg-deep`, `--bg-surface`, `--bg-surface-2`, `--border`, `--text-primary`, `--text-secondary`, `--accent-primary`, `--accent-secondary`, radius/spacing tokens) keeping `--accent-color` as an alias of `--accent-primary`; add the Inter font-family stack with system fallback
- [x] 2.2 Restyle site header/nav to the handoff nav treatment (bg-surface, lockup left, controls right) and add `.brand-home` lockup styles (24px mark + 15px/700 wordmark, single link)
- [x] 2.3 Restyle hero, compare header, slot cards, selects, and buttons (primary/secondary/outline treatments, 9px radius) for dark surfaces; give `.cam-image-wrap` the light photo chip (~#F4F5F7, radius 12)
- [x] 2.4 Restyle the spec table: dark row striping, borders, section headers; replace green winner highlight with per-column accent tint — `:nth-child`-driven `--col-accent` (grid child 1 is the label, so slot A = nth-child(2)/even = primary, slot B = odd = secondary), `color-mix` with rgba fallback; badges/pills restyled to accent/0.18 fill + accent text (`.badge-disc` went neutral-gray — teal/purple misread semantically for "Discontinued")
- [x] 2.5 Restyle footer + `.seo-links` block; swept all light-theme literals (`--gray-*`, `--white`, `--green-*`, `#fafafa`, `#eaeaec`, `#e07b00`) and mobile breakpoint rules

## 3. Engine markup (engine.js)

- [x] 3.1 Replace the header brand span with the lockup: inline Framed Duo SVG + "Compare Camera Specs" wordmark wrapped in `<a class="brand-home" href="../?brands">`; keep the `header-title` page context and other header controls
- [x] 3.2 Delete the `init()` lines applying `--accent-color`/`--hero-dark`; drop `accentColor`/`heroDark`/`logoText`/`logoAccent` from `compareBrandConfig()` and any other engine reads
- [x] 3.3 Remove `compare/index.html`'s inline `--accent-color`/`--hero-dark` override (favicon + theme-color + Inter links for all engine pages are generator-emitted — task 6.1)

## 4. Brand data + schema

- [x] 4.1 Remove `accentColor`, `heroDark`, `logoText`, `logoAccent` from `BRAND_CONFIG` in all five `<brand>/data.js` files
- [x] 4.2 Contract enforcement lived in `tests/data/config.test.js` (not schema.js): required fields trimmed + new test asserting the four theming fields are absent
- [x] 4.3 No logic test asserted the old logo/green-winner markup (verified by grep); added `tests/logic/header.test.js` — lockup present on every brand page + compare page, `../?brands` href, wordmark text, 2-circle mark, and engine sets no `--accent-color`/`--hero-dark`. 364/365 pass; the 1 failure is the intentional "generated pages stale" gate resolved by group 6

## 5. Root landing, About, Privacy

- [ ] 5.1 Root `index.html`: add the `?brands` early-return (`URLSearchParams`) to the redirect IIFE; keep `location.replace` + hash behavior; update/extend the redirect logic test for suppression
- [ ] 5.2 Restyle the landing inline styles for the dark theme (brand cards keep their per-brand accent stripes); landing header gets the lockup (linking `./?brands`)
- [ ] 5.3 Restyle `about.html` and `privacy.html` to the token theme (still self-contained inline CSS), adding lockup header, favicon, theme-color, and font links

## 6. Generator + regenerate

- [ ] 6.1 Update `scripts/generate-seo.js` templates: emit favicon + theme-color + Inter links in every `seo:begin` head block (depth-correct relative paths); emit the lockup header (depth-correct `?brands` href) in landing and vs-page bodies; remove `--accent-color`/`--hero-dark` inline overrides; retheme vs-page inline styles (photo chips, CTA, related links)
- [ ] 6.2 Run `node scripts/generate-seo.js` and verify the full regeneration (root, brand heads, compare, all vs pages, sitemap); spot-check one cross-brand and one per-brand vs page
- [ ] 6.3 Update `.claude/skills/add-camera-brand/SKILL.md` and `CLAUDE.md` to drop the removed `BRAND_CONFIG` theming fields from their instructions

## 7. Verify

- [ ] 7.1 `npm test` passes (Tier 1 + Tier 2)
- [ ] 7.2 Visual pass over `http.server`: landing (with and without stored brand + `?brands`), one brand page (cameras + lenses modes, currency switch, winner tint), compare page (2–4 slots), a vs page, About, Privacy, mobile breakpoint — favicon and lockup present everywhere, no per-brand recoloring
- [ ] 7.3 `openspec validate adopt-design-system --strict` passes
