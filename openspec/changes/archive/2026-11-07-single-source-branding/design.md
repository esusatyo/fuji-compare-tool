## Context

`adopt-design-system` (same branch, unmerged) established two canonical sources — `assets/logo.svg` and the `engine.css` `:root` tokens — but the generator, About/Privacy, and the touch icon still carry literal copies, held in sync by `tests/data/brand-sync.test.js`. The review flagged four residual risks: copy drift, the hand-rendered `apple-touch-icon.png`, no mobile visual pass, no font-fallback check. User decisions: About/Privacy get generator-owned identity blocks; Inter stays on the Google Fonts CDN.

## Goals / Non-Goals

**Goals:**
- A rebrand touches exactly two files (`assets/logo.svg`, `engine.css` tokens) plus one script run (`generate-seo.js`, `render-touch-icon.js`); tests enumerate anything missed.
- About/Privacy prose remains hand-editable; only their identity is generated.
- The touch icon joins the enforced identity set.

**Non-Goals:**
- No self-hosted fonts (CDN decision stands).
- No change to `engine.js`'s inline `LOGO_SVG` — the runtime engine cannot read files; the sync test keeps covering this one copy.
- No visual redesign; output pages should be byte-identical except for the newly generated blocks.

## Decisions

1. **Generator parses the canonical sources with the same regexes the sync test uses.** Extract a tiny shared helper (`scripts/lib/brand-identity.js` or inline duplication kept trivially small): `logoSvg()` reads `assets/logo.svg` and returns the mark scaled for the 24px lockup (swap `width`/`height` attrs, keep geometry verbatim); `token(name)` reads `engine.css` for `--bg-deep`/accents. Failing to parse throws — the generator already fails loudly by design. The sync test then verifies generated output only via the freshness gate, not by re-asserting geometry.

2. **Identity blocks use a new marker pair, not `seo:begin`.** About/Privacy get `<!-- identity:head:begin/end -->` in `<head>` and `<!-- identity:header:begin/end -->` at the top of `<body>`. Separate markers because these pages have no SEO block today and the injected content (style + lockup) is identity, not SEO metadata; `withBlock()` already generalizes to any marker pair. The generator refuses to write if markers are missing (existing convention).

3. **About/Privacy join `buildAll()`.** Their file map entries make `tests/data/seo.test.js`'s "committed output matches regenerated output" gate cover them with zero new test code. The injected `<style>` embeds the current token values, so the served pages remain fully self-contained static HTML (site-pages spec intent preserved).

4. **Touch icon: script + pixel test, not build-time generation.** `scripts/render-touch-icon.js` writes the padded-mark-on-`--bg-deep` HTML to a temp file and shells out to headless Chrome (`--screenshot`, 180×180), erroring with a clear message if no Chrome binary is found (checked at the standard macOS path plus `$CHROME_BIN`). It stays a manual dev tool because CI/test environments may lack Chrome. Enforcement lives in `tests/data/touch-icon.test.js`: a ~50-line pure-node PNG reader (zlib inflate + per-row unfilter, as already prototyped during `adopt-design-system`) asserts dimensions 180×180 and that the four corner pixels equal `--bg-deep` (parsed from `engine.css`, tolerance ±2/channel for Chrome's sRGB rounding).

5. **Header/label tweaks are data + CSS, not engine logic.** The header context label already flows from `BRAND_CONFIG.<mode>.headerTitle`, so the change is data: set `cameras.headerTitle` to the brand name in each `data.js` (and "All Brands" in `compare/index.html`'s `COMPARE_CONFIG`); `lenses.headerTitle` already reads "Lens Compare". No engine branching added. The one-label compare cell is pure CSS: hide `.compare-label-text` inside `.compare-label-cell--compare` at desktop widths; the existing mobile breakpoint (which hides `.slot-count-field`) un-hides it. Brand pages without a slot-count field (none today, but `MAX_SLOTS <= MIN_SLOTS` guards exist) keep the plain "Compare" label.

6. **`brand-sync.test.js` keeps only real duplication.** Post-change it enforces: `engine.js` `LOGO_SVG` geometry + fills, `favicon.svg` geometry + fills, and the rgba whitelist in `engine.css` (the generator's rgba literals in `VS_CSS` remain — retheming VS_CSS from tokens at build time is possible but low-value; the whitelist already catches staleness). Assertions about `about.html`/`privacy.html`/generator literals are deleted — generation makes them unfailable.

## Risks / Trade-offs

- [Generator now depends on parsing `engine.css` — a token rename breaks the build] → It throws with the token name; that's the desired loud failure. Token names are part of the documented contract in CLAUDE.md.
- [Chrome absent when re-rendering the icon] → Script prints an actionable error; the PNG test only fails when the icon is actually stale relative to tokens, which is exactly when a re-render is needed.
- [PNG pixel test brittle to renderer differences] → Assert only corner background pixels with per-channel tolerance, not the mark's anti-aliased pixels.
- [Marker blocks make About/Privacy partially generated — contributor confusion] → Markers carry the same "do not edit by hand" text as the seo blocks; CLAUDE.md documents the split.

## Migration Plan

Implement on this same branch (stacked on `adopt-design-system`'s commits) so the delta specs merge together; one PR total, or a second PR if the first has already merged by then. Order: generator helpers → About/Privacy markers + regenerate → touch-icon script + test → sync-test retarget → visual passes. Rollback = revert; no data or URL changes.

## Open Questions

- None. (If the mobile pass or fallback check surfaces styling bugs, fix them in this change — they're in scope as verification debt.)
