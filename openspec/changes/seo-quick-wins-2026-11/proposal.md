## Why

The SEO review of 2026-11-26 (Google: 2 clicks and average position 58.6 in 28 days; Bing: the
homepage on page 1 for "camera comparison" with a 1–2% click rate) found a handful of cheap,
mechanical defects in what crawlers receive:

- On vs-pages the spec table's "Lens mount" row prints `lensType`, so a Nikon Z body against a
  Fujifilm X body reads "Interchangeable" vs "Interchangeable". It is the row a cross-brand
  buyer most needs.
- Brand pages, `/compare/`, `/size/` and `/kit/` have no `<h1>` in their static HTML: the
  engine renders it, so crawlers that don't run JavaScript see a page without a heading.
- `/` has no structured data, so nothing tells Google the site's name (`WebSite`).
- No page carries `BreadcrumbList`, which Google shows in place of the URL in results.
- Nothing tests the JSON-LD the generator emits.
- There is no record of when each SEO change shipped and what it should move, so no change
  can be measured later.

## What Changes

1. The vs-page "Lens mount" row names the mount from the brand's `BRAND_CONFIG.mounts`
   (`X-Mount`, `G-Mount (GFX)`, `Z-Mount`, …); a fixed-lens camera reads "Fixed lens" plus its
   `lensSpec`. Display only: no data value changes.
2. A static `<h1>` (the page's hero title) in the generator-owned body block of every brand
   page and of `/compare/`, `/size/` and `/kit/`. The engine moves that element into its hero
   instead of rendering a second one, so a rendered page still has exactly one `<h1>`.
3. `WebSite` + `Organization` JSON-LD on `/` (name, url, logo; no `sameAs`, no `SearchAction`).
   The homepage `<title>` and description do not change (a title experiment runs until late
   January 2027).
4. `BreadcrumbList` JSON-LD on vs-pages, size pages, mount pages and guide/article pages,
   matching the back link each page already shows.
5. A test that parses every JSON-LD block in generated HTML: valid JSON, `@context`, required
   fields per emitted type, and no `review`/`aggregateRating` anywhere.
6. `docs/seo-experiments.md`: one row per SEO change with ship date, metric, baseline and review
   date.

Out of scope on purpose: vs-page title rewrites, more guides, new vs-pairs or pins (the
early-December noindex review covers those), and per-camera pages (proposed separately as
`add-camera-pages`).

## Capabilities

### Modified Capabilities
- `seo-surface`: lens-mount row wording, a static `<h1>` per page, homepage and breadcrumb
  structured data, structured-data validation.

## Impact

- `scripts/generate-seo.js`, `engine.js` (hero `<h1>` adoption), `engine.css` (static `<h1>`
  style for pages seen without JavaScript), every generated page (regenerated; `sitemap.xml`
  and `sitemap-lastmod.json` move for pages whose HTML changed).
- New tests: `tests/data/vs-lens-mount.test.js`, `tests/data/static-h1.test.js`,
  `tests/logic/static-h1.test.js`, `tests/data/structured-data.test.js`.
- New doc: `docs/seo-experiments.md`.
- No URL changes, no data value changes.
