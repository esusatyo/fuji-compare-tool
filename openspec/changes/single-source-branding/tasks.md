## 1. Generator sources identity from canonical assets

- [x] 1.1 Identity helpers added inline in `scripts/generate-seo.js`: `identityToken(name)` (throws naming the token) + `logoMark()` (parses viewBox/path/stroke/circles from `assets/logo.svg`, throws if unparseable)
- [x] 1.2 `LOGO_SVG` literal and `#131722` theme-color replaced by the helpers
- [x] 1.3 Regeneration byte-identical (222 artifacts, 0 written); brand-sync generator assertions retargeted (part of 4.1); `npm test` 380/380

## 2. About/Privacy identity blocks

- [ ] 2.1 Add `<!-- identity:head:begin/end -->` and `<!-- identity:header:begin/end -->` markers to `about.html` and `privacy.html`; strip their hand-maintained identity (head links, token `<style>` values, inline lockup) into the marked regions
- [ ] 2.2 Generator: build the two identity blocks from the canonical sources (head: favicon/touch-icon/theme-color/font links + token style; header: lockup linking `./?brands`) and inject via `withBlock()`; add both pages to `buildAll()`'s file map
- [ ] 2.3 Regenerate; confirm prose is untouched, pages still render self-contained from `file://`, and `tests/data/seo.test.js` now gates their freshness; extend a seo test case asserting missing identity markers throw

## 3. Touch icon: script + pixel test

- [ ] 3.1 Write `scripts/render-touch-icon.js`: builds the padded mark-on-`--bg-deep` HTML from the canonical sources, renders 180×180 via headless Chrome (`$CHROME_BIN` or the standard macOS path), writes `apple-touch-icon.png`; clear error if Chrome is missing
- [ ] 3.2 Write `tests/data/touch-icon.test.js`: pure-node PNG decode (zlib inflate + row unfilter), assert 180×180 and four corner pixels equal `--bg-deep` (±2/channel); negative-test by asserting it fails against a wrong-color fixture during development
- [ ] 3.3 Re-render the committed icon via the new script so the committed artifact and the script provably agree

## 4. Retarget brand-sync tests

- [ ] 4.1 Remove `brand-sync.test.js` assertions covering generator/About/Privacy literals (now generated); keep `engine.js`, `favicon.svg`, and the rgba whitelist (engine.css + generator VS_CSS)
- [ ] 4.2 Negative-test the retained checks still fail on a corrupted `engine.js` copy; full `npm test` green

## 5. Header & compare-cell labels

- [ ] 5.1 Set `cameras.headerTitle` to the brand name in all five `<brand>/data.js` files and to `'All Brands'` in `compare/index.html`'s `COMPARE_CONFIG` (`lenses.headerTitle` stays "Lens Compare"); grep to confirm "Camera Compare" no longer appears in page sources
- [ ] 5.2 `engine.css`: hide `.compare-label-text` when the cell has the slot-count field (`.compare-label-cell--compare`); re-show it in the <600px breakpoint where `.slot-count-field` is hidden — exactly one label visible at any width
- [ ] 5.3 Update/extend logic tests: header label equals brand name in cameras mode, "Lens Compare" after mode toggle, "All Brands" on the compare page; label-cell one-label rule asserted at both widths (jsdom class/structure checks)

## 6. Verification debt + docs

- [ ] 6.1 Mobile visual pass (<600px viewport in Chrome): landing, one brand page (2-slot clamp, "Compare" label alone, winner tints), compare page, one vs page — fix any styling bugs found (in scope)
- [ ] 6.2 Font-fallback check: load a brand page with the Google Fonts request blocked (or from `file://`) and confirm the system-stack rendering is acceptable
- [ ] 6.3 Update `CLAUDE.md` rebrand instructions: edit `assets/logo.svg` + `engine.css` tokens → `node scripts/generate-seo.js` + `node scripts/render-touch-icon.js` → `npm test` names anything left; update the design-system memory note
- [ ] 6.4 `openspec validate single-source-branding --strict` passes; commit and push
