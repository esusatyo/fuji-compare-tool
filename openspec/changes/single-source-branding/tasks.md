## 1. Generator sources identity from canonical assets

- [x] 1.1 Identity helpers added inline in `scripts/generate-seo.js`: `identityToken(name)` (throws naming the token) + `logoMark()` (parses viewBox/path/stroke/circles from `assets/logo.svg`, throws if unparseable)
- [x] 1.2 `LOGO_SVG` literal and `#131722` theme-color replaced by the helpers
- [x] 1.3 Regeneration byte-identical (222 artifacts, 0 written); brand-sync generator assertions retargeted (part of 4.1); `npm test` 380/380

## 2. About/Privacy identity blocks

- [x] 2.1 Identity markers added to both pages; hand-maintained identity stripped into the marked regions (head block also gained a canonical — required by the seo test's "every generated .html has a canonical under baseUrl" rule, and a real SEO gain)
- [x] 2.2 `identityHeadBlock(page, site)` + `identityHeaderBlock()` built from the canonical sources and injected via `withBlock()`; both pages in `buildAll()`'s file map (224 artifacts)
- [x] 2.3 Regenerated (+2 files); prose untouched, pages self-contained; freshness gate covers them via `buildAll()`; new seo test asserts both marker pairs exist on disk and both pages are in the output set (missing markers throw via the shared `withBlock` path)

## 3. Touch icon: script + pixel test

- [x] 3.1 `scripts/render-touch-icon.js` written: reuses `identityToken`/`logoMark` from generate-seo, renders via `$CHROME_BIN` or the macOS Chrome path, actionable error if absent
- [x] 3.2 `tests/data/touch-icon.test.js` written: pure-node PNG decode (RGB + RGBA, all filter types), 180×180 + four `--bg-deep` corners (±3/channel); negative-tested against the white-padded qlmanage render (fails) and the fresh render (passes)
- [x] 3.3 Committed icon re-rendered via the script — artifact and script provably agree

## 4. Retarget brand-sync tests

- [x] 4.1 Generator/About/Privacy literal assertions removed (done alongside groups 1–2); kept: `engine.js` + `favicon.svg` geometry/fills, canonical-circle/accent-token check, rgba whitelist over engine.css + generator VS_CSS
- [x] 4.2 Negative-tested: corrupted `engine.js` circle fill → 1 fail naming the file; restored → full `npm test` 376/376

## 5. Header & compare-cell labels

- [ ] 5.1 Set `cameras.headerTitle` to the brand name in all five `<brand>/data.js` files and to `'All Brands'` in `compare/index.html`'s `COMPARE_CONFIG` (`lenses.headerTitle` stays "Lens Compare"); grep to confirm "Camera Compare" no longer appears in page sources
- [ ] 5.2 `engine.css`: hide `.compare-label-text` when the cell has the slot-count field (`.compare-label-cell--compare`); re-show it in the <600px breakpoint where `.slot-count-field` is hidden — exactly one label visible at any width
- [ ] 5.3 Update/extend logic tests: header label equals brand name in cameras mode, "Lens Compare" after mode toggle, "All Brands" on the compare page; label-cell one-label rule asserted at both widths (jsdom class/structure checks)

## 6. Verification debt + docs

- [ ] 6.1 Mobile visual pass (<600px viewport in Chrome): landing, one brand page (2-slot clamp, "Compare" label alone, winner tints), compare page, one vs page — fix any styling bugs found (in scope)
- [ ] 6.2 Font-fallback check: load a brand page with the Google Fonts request blocked (or from `file://`) and confirm the system-stack rendering is acceptable
- [ ] 6.3 Update `CLAUDE.md` rebrand instructions: edit `assets/logo.svg` + `engine.css` tokens → `node scripts/generate-seo.js` + `node scripts/render-touch-icon.js` → `npm test` names anything left; update the design-system memory note
- [ ] 6.4 `openspec validate single-source-branding --strict` passes; commit and push
