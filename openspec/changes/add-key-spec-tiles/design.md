## Context

Spec rows are defined twice today: `SPEC_SECTIONS` in `engine.js` (browser only) and `VS_ROWS`
in `scripts/generate-seo.js` (Node only), because the engine is a classic script the generator
cannot `require`. `size.js` introduced the way out: a small module with no DOM or globals that
is both a browser script and a CommonJS module. `site-config.js` is already the one file both
sides read for site-wide facts (`baseUrl`, `dataVerified`).

## Decisions

### The list lives in `site-config.js`; the definitions in `key-specs.js`
`SITE_CONFIG.keySpecs = { cameras: ['sensor', 'video', 'stabilization', 'burst', 'price'] }`
is data: which specs, in which order. `key-specs.js` holds what cannot be data — how a value is
worded ("7 stops", "None") and how two cameras are ranked. Changing the selection or order is
a one-line config edit; a test fails if the list names an id with no definition, or a
definition reads a field no camera has. *Alternative considered:* storing the tile values on
each camera in `data.js`. Rejected: they are derived from fields already there (`sensorMP`,
`ibisStops`, `maxBurst`, `maxVideoRes`, `prices`), so a second copy could only drift.

### Verdict rule: the engine's, restated
Same semantics as `computeWinners`: at least two items; a spec with no direction (video) never
has a winner; all values equal means no winner; a tie for best among some marks each of them.
Price and stabilization need every item's value (`needsAll`) — a body with IBIS but no
published stop rating cannot be ranked against a rated one.

### Placement and markup
On a vs-page: products, summary, "Compare these interactively", **tiles**, table. The CTA
keeps its position (it is the page's main click). Tiles are a `<section class="key-specs">`
of `<dl>`s, complete without JavaScript; the better value carries a visually hidden
"(better)" so the verdict is not colour-only. Styles are in `engine.css`, which vs-pages
already load, so the tool can reuse them.

### Price
vs-pages are priced in USD throughout, so the tile is "Price (USD)". The definition takes the
currency and a formatter as options, for the tool's currency switcher later.

## Risks / Trade-offs

- **Every vs-page changes**, so every vs-page's sitemap `lastmod` moves. Accurate — the
  content did change.
- **Duplicated wording with `VS_ROWS`** remains (the table still has its own formatters).
  Folding the table onto `key-specs.js` is possible later; out of scope here.
