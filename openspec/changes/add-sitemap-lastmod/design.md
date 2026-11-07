## Context

`buildSite()` in `scripts/generate-seo.js` builds every generated file in memory, including `sitemap.xml` from a list of paths, and `tests/data/seo.test.js` fails if any committed file differs. Share cards already use a committed hash manifest (`og/manifest.json`) to tell stale from fresh. A sitemap date needs the same thing: something durable that remembers when each page last changed.

## Decisions

**1. A hash manifest, not git dates or file mtimes.** Mtimes change on checkout. Git commit dates aren't available while the pre-commit hook runs (the commit doesn't exist yet), and CI clones are often shallow. A committed manifest `{ "<clean path>": { "hash", "lastmod" } }` is stable on every machine, and its diff shows exactly which pages a commit changed.

**2. What counts as a page's content.** For a vs-page, About, Privacy, `compare/` and the root: the generated HTML file. For a brand page: its generated `index.html` plus its `data.js` (specs render client-side, so the data file *is* the content). Shared assets (`engine.js`, `engine.css`) are excluded; a CSS or engine change is not a content change to every page, and bumping all 57 dates at once is exactly the inaccuracy that makes Google ignore `<lastmod>`.

**3. Today's date, in UTC, only on change.** `lastmodManifest(prev, hashes, today)` is pure and exported for tests. `buildSite()` passes `new Date()` as UTC `YYYY-MM-DD`. With an unchanged hash the old entry is copied verbatim, so regenerating a clean tree is a no-op on any day. URLs that leave the sitemap drop out of the manifest.

**4. The manifest is a generated artifact.** It goes into `buildSite()`'s file map, so the existing "every generated artifact matches the committed file" test covers it: a data edit without a regenerate fails the suite exactly as it does today.

**5. Seed from git once.** For the first manifest, each entry's date is the last commit date (`%cs`) touching that page's inputs. That's accurate history rather than stamping all 57 pages with the rollout date.

## Risks / Trade-offs

- [Regenerating on a later day than the data edit stamps that later day] → acceptable; dates are within days, and the hook regenerates in the same commit.
- [A generator-wide template change (footer, head tags) bumps every page] → correct: those pages really changed. Rare.
- [UTC vs Sydney date can differ by a day] → harmless for crawlers.
