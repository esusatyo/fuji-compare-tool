## Why

`sitemap.xml` lists 57 URLs with no `<lastmod>`, so a search engine reading it can't tell which pages changed. Bing now hears about changes through IndexNow (#79), but Google doesn't use IndexNow: the sitemap is the only change signal Google gets from us, and Google ranks the homepage around position 86 and indexes the site slowly. Google uses `<lastmod>` only when it is consistently accurate, so the date has to move when a page's content changes and never otherwise. (`docs/seo-manual-tasks.md` already claims `<lastmod>` is "handled in the repo"; it wasn't.)

## What Changes

- Every `sitemap.xml` entry gets a `<lastmod>` date (`YYYY-MM-DD`).
- A new committed manifest, `sitemap-lastmod.json`, records for each sitemap URL a hash of the page's content and the date that hash last changed. The generator keeps the date when the hash is unchanged and stamps today's date (UTC) when it changes, so dates only move with real content changes.
- A brand page's hash covers both its generated `index.html` and its `<brand>/data.js`, because brand pages render their specs from `data.js` in the browser.
- Initial dates are seeded from git history: the date of the last commit that touched each page's inputs.
- The pre-commit hook stages the manifest. The data skills say that regeneration also moves `<lastmod>` and that the manifest must be committed with the data change.

## Capabilities

### Modified Capabilities
- `seo-surface`: "Sitemap and robots" gains accurate `<lastmod>` dates.

## Impact

- **Files**: `scripts/generate-seo.js`, new `sitemap-lastmod.json`, `sitemap.xml`, `tests/data/seo.test.js`, `.githooks/pre-commit`, CLAUDE.md, five skills.
- **No page or runtime change.** IndexNow is unaffected: it reads `<loc>` only.
- `generate-seo.js` stays deterministic for unchanged content. Its output only depends on the date when a page's hash changes, and the existing staleness test then fails until the regenerated manifest is committed, which is the intended guard.
