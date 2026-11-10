## Context

`brandBodyBlock(brand, data, site, pairs)` in `scripts/generate-seo.js` writes the block
between `<!-- seo:body:begin -->` and `<!-- seo:body:end -->` in `<brand>/index.html`. The
block sits **after** `<div id="app">`, which `engine.js` `injectBody()` fills once with the
header, tool and `<footer>`. So the static block currently renders below the footer.

Vs-pages already render a static spec table from `VS_ROWS` (same file). The pre-commit hook
regenerates pages when `data.js` or the generator changes, and the "every generated artifact
matches the committed file" test fails on anything stale. The sitemap `<lastmod>` hash for a
brand page already covers its `data.js`.

## Goals / Non-goals

Goals: crawlable, accurate, visible spec text on every brand page; stays in sync with data
with no new manual step; looks deliberate, not like leftover content.

Non-goals: lens tables; JSON-LD/structured data (Product markup on a list page tends to
raise Merchant-listing warnings; revisit once the table is indexed); deep links that open
the tool with a camera selected (the engine has no `hashchange` listener, so a same-page
`#cameras=…` link would not update the tool; separate change); changes to vs-pages or `/compare/`.

## Decisions

### D1. Visible section, open (not collapsed)
Shown to everyone, in the normal page flow. Hidden or crawler-only text risks being treated
as cloaking. An open table was recommended over a collapsed `<details>` (2026-11-09). The owner
hasn't confirmed this yet, so confirm before task 1.2. A collapsed version only needs the table
wrapped in `<details><summary>`.

### D2. Structure of the block (top to bottom)
```html
<section class="seo-links seo-glance" aria-label="Sony cameras at a glance">
  <h2>Sony cameras at a glance</h2>
  <p>The 21 current Sony cameras in this comparison. Use the tool above to compare any of them side by side.</p>
  <div class="seo-table-wrap">
    <table class="seo-table">
      <thead><tr><th scope="col">Camera</th><th scope="col">Announced</th> … </tr></thead>
      <tbody>
        <tr><th scope="row"><a href="vs/a7-v-vs-a7-iv">A7 V</a></th><td>2025</td> … </tr>
        <tr><th scope="row">ZV-1F</th><td>2022</td> … </tr>
      </tbody>
    </table>
  </div>
  <p>Older Sony cameras in this comparison: A7 III, A7 II, …</p>
  <p>Lenses: 352 for Sony cameras: Sony 120, Sigma 61, Tamron 38, …</p>
</section>
<section class="seo-links" aria-label="Popular Sony comparisons">   ← existing, unchanged
  …
</section>
```
Both sections stay inside the existing `seo:body` markers, so `withBodyBlock` needs no change.
Wording above is the template. Use singular forms when a count is 1 (Sigma has one current camera).

### D3. Rows and order
- Rows: cameras with `!discontinued`, in `CAMERA_ORDER` order (the brand's own display order).
- Older line: cameras with `discontinued`, in `CAMERA_ORDER` order, names joined with ", ".
  Omit the line when there are none.
- If a brand has **zero** current cameras, omit the table and its intro paragraph (the older
  line and the lens line still render). No brand hits this today, but the code must not emit
  an empty `<table>`.

### D4. Columns and formatting
Reuse the `VS_ROWS` formatters so a value can't read differently on a brand page and a vs-page.
Add a lookup helper (e.g. `const vsRow = label => VS_ROWS.find(r => r[0] === label)[1]`).

| Column header | Source |
|---|---|
| Camera | `cam.name` (row header `<th scope="row">`) |
| Announced | `VS_ROWS` "Announced" |
| Sensor | `VS_ROWS` "Sensor" |
| Stabilization | `VS_ROWS` "In-body stabilization" |
| Max video | `VS_ROWS` "Max video" |
| Weight | `VS_ROWS` "Weight" |
| Size (W×H×D) | new `sizeText(cam)`: `` `${w} × ${h} × ${d} mm` `` when all three are non-null, else null |
| Price (USD) | `VS_ROWS` "Price (USD RRP)" |

A null value renders as `—`. Every value goes through `esc()`.

### D5. Camera-name links
The name links to that camera's first **indexable** vs-page in `pairs` order (`href="vs/<a>-vs-<b>"`,
extensionless). If none is indexable, the name is plain text. Linking only to indexable
pages avoids sending link equity to noindexed pages.
`brandBodyBlock` doesn't know about indexability today, so pass the existing `indexable`
closure from `buildSite` in as a new last parameter `isIndexable(a, b)`.
Its signature there is `indexable(rel, a, b)` with `rel = <brand>/vs/<a>-vs-<b>.html`; wrap it.
Keep a default (`() => false`) so existing callers and tests don't break.

### D6. Lens line
`Lenses: N for <Brand> cameras: <Maker> n, <Maker> n, …`. Counts are by `manufacturer` over all
`LENSES` (current and discontinued). The brand's own name comes first, then descending count,
then name. Multi-mount brands are not split by mount (one line, kept short).

### D7. Footer placement (engine.js)
At the end of `injectBody()`, after `mount.innerHTML = …`:
```js
// Generator-owned static sections (crawlable specs, popular comparisons) sit
// after #app in the HTML; move the footer below them so the page ends with it.
const statics = document.querySelectorAll('body > .seo-links');
const footer = mount.querySelector('footer');
if (statics.length && footer) statics[statics.length - 1].after(footer);
```
`injectBody()` runs once (no re-render of the shell), so a moved footer is never re-created.
The footer leaves `#app`. Check that nothing queries `#app footer` (grep `footer` in
`engine.js`, `theme.js`, `analytics.js`, tests) before relying on this. `/compare/` also has a
`.seo-links` block, so its footer moves too, which is the intended consistent result.
The static HTML order is unchanged, so crawlers are unaffected.

### D8. Styles (engine.css, next to the `.seo-links` rules)
- `.seo-table-wrap { overflow-x: auto; }` so the table scrolls inside its box and the page never scrolls sideways.
- `.seo-table`: `border-collapse: collapse; font-size: 13px; width: 100%; min-width: 720px;`
  cells `padding: 6px 10px; text-align: left; white-space: nowrap;`
  `border-bottom: 1px solid var(--border-subtle)` (use whichever existing border token
  `.seo-links`/tables already use; grep `--border` in engine.css). Header row `color: var(--text-secondary)`.
- Tokens only, no raw colours, so both themes work (the design-system test may enforce this).
- No winner highlighting, no images.

## Risks

- **Stale table after a data edit**: covered. The pre-commit hook regenerates, and the
  "generated artifact matches" test fails otherwise.
- **Thin or duplicate content**: each brand's table is unique data. Low risk.
- **Layout on phones**: test at 375px in the preview, and ask the owner to check on a real
  phone (simulated mobile has missed bugs before).
