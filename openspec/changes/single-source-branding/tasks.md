## 1. Generator sources identity from canonical assets

- [ ] 1.1 Add identity helpers to `scripts/generate-seo.js` (or a small `scripts/lib/brand-identity.js`): `token(name)` parses `--bg-deep`/`--accent-primary`/`--accent-secondary` from `engine.css` (throws naming the token on failure); `logoSvg(size)` reads `assets/logo.svg` and returns the mark with lockup sizing, geometry verbatim
- [ ] 1.2 Replace the generator's `LOGO_SVG` literal and hardcoded `#131722` theme-color with the helpers; `lockupHTML`/`assetLinks` derive from them
- [ ] 1.3 Regenerate and diff: generated pages must be byte-identical to current output (pure refactor — no visual change); `npm test` green

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

## 5. Verification debt + docs

- [ ] 5.1 Mobile visual pass (<600px viewport in Chrome): landing, one brand page (2-slot clamp, header without lockup, winner tints), compare page, one vs page — fix any styling bugs found (in scope)
- [ ] 5.2 Font-fallback check: load a brand page with the Google Fonts request blocked (or from `file://`) and confirm the system-stack rendering is acceptable
- [ ] 5.3 Update `CLAUDE.md` rebrand instructions: edit `assets/logo.svg` + `engine.css` tokens → `node scripts/generate-seo.js` + `node scripts/render-touch-icon.js` → `npm test` names anything left; update the design-system memory note
- [ ] 5.4 `openspec validate single-source-branding --strict` passes; commit and push
