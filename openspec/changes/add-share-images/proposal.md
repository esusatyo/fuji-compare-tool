## Why

No page on the site declares an `og:image`, so every shared link shows as a bare text card (`twitter:card` is `summary`, and it has no image) on Reddit, Threads, Discord, iMessage and Slack. Reddit is the only outside channel that has kept sending traffic (about 20% of identified referrers, five weeks running, as of 2026-10-12), and the plan to grow it is to post comparison links into real "X vs Y" threads. A large preview card carrying the comparison itself makes those links much more likely to be clicked. This was the agreed next code task in the July launch roadmap and was never started.

## What Changes

- Every generated page head (root, About, Privacy, `compare/`, each brand page, every same-brand and cross-brand vs-page) gains `og:image` (absolute URL), `og:image:width`/`og:image:height` (1200×630), `og:image:alt`, `twitter:image`, and switches `twitter:card` from `summary` to `summary_large_image`.
- New committed static images under `og/`, one per page, laid out like the page path (`og/fujifilm.png`, `og/fujifilm/vs/x-t5-vs-x-s20.png`, `og/vs/<pair>.png`, `og/home.png`, `og/compare.png`, `og/site.png` for About/Privacy).
- Cards are **typographic, with no photos**: the site's identity (logo lockup, dark tokens) plus page-specific content. Vs-cards show both camera names, 3–4 headline specs that rarely change (sensor MP, IBIS stops, weight, year) and **front silhouettes of both bodies drawn to scale** from their stored width × height. Brand cards show the brand name, camera/lens counts and mounts. No prices, since prices churn and depend on currency.
- `scripts/generate-seo.js` gains a pure `shareCardHTML(page)` builder and emits the new tags. A new `scripts/render-share-images.js` screenshots the card HTML with headless Chrome (the same approach as `render-touch-icon.js`), renders only stale or missing cards, and writes `og/manifest.json` recording the input hash for each card.
- New Tier 1 test: every page's `og:image` file exists, is 1200×630, and its manifest hash matches the current card HTML. No orphan images.
- `.githooks/pre-commit` runs the incremental renderer after `generate-seo.js` when a Chrome binary is available. Without Chrome, the test failure names the command to run.
- `_headers` gets a cache rule for `/og/*`.
- **Share button on the interactive tool** (brand pages and `compare/`). On phones with a native share sheet it opens the sheet; elsewhere it copies the current comparison URL to the clipboard and confirms with "Link copied". Each use reports a `share-link` GoatCounter event, and `privacy.html` lists it. Its job is to measure whether people share interactive comparisons, which decides whether a follow-up change for on-demand cards (drawn by the Worker for any selection) is worth building. Until then, a shared interactive link previews as its brand card, because crawlers never see the `#` selection.

## Capabilities

### New Capabilities
- `share-images`: per-page 1200×630 social preview cards: what each page type's card shows, how cards are rendered and kept fresh, and the no-photo rule.

### Modified Capabilities
- `shareable-urls`: adds a share button that hands the current comparison URL to the native share sheet or the clipboard, and reports its use.
- `seo-surface`: "Every page has SEO head tags" now requires the image and large-card tags on every generated page, and "Generated output cannot go stale" now covers share images.

## Impact

- **Code**: `scripts/generate-seo.js` (card builder + tags in `metaBlock`, `vsPageHTML`, `crossVsPageHTML`, `identityHeadBlock`, `compareHeadBlock`), new `scripts/render-share-images.js`, `.githooks/pre-commit`, `_headers`, new `tests/data/share-images.test.js`. Every generated HTML file changes once, in its head block only.
- **Repo size**: about 305 PNGs, one per page, estimated at 30–60 KB each (roughly 10–18 MB). Task 1 measures this before committing to "every page gets its own card".
- **Workflow**: a data edit that adds a vs-pair or changes a card's specs now also needs a render. The hook covers it when Chrome is present.
- **Runtime**: only the share button, a small addition to `engine.js` and `engine.css` plus one new event in `analytics.js`'s grammar header. The cards themselves add no JS, no Worker change no new dependency, and the images are unaffected by analytics (they are same-origin static files fetched by social-platform crawlers).
