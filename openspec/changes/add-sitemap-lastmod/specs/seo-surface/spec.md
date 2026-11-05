## MODIFIED Requirements

### Requirement: Sitemap and robots
The generator SHALL emit a root `sitemap.xml` listing, as absolute URLs under `baseUrl`:
- the root page;
- every brand page;
- the cross-brand compare page;
- every **indexable** vs-page;
- the About and Privacy pages.

It SHALL NOT list any non-indexable vs-page. Every entry SHALL carry a `<lastmod>` date (`YYYY-MM-DD`) that changes only when that page's content changes; for a brand page, content includes its `data.js`. The dates SHALL be kept in a committed manifest of per-page content hashes. The generator SHALL also emit a `robots.txt` that permits crawling and references the sitemap's absolute URL. Non-indexable pages SHALL be excluded through the page-level robots meta tag, not through `robots.txt` disallow rules.

#### Scenario: Sitemap covers all indexable pages
- **WHEN** the generator runs
- **THEN** `sitemap.xml` contains one `<loc>` per brand page and per indexable vs-page, each beginning with `baseUrl`

#### Scenario: Sitemap omits noindexed pages
- **WHEN** the generator runs
- **THEN** no vs-page carrying a `noindex` directive appears in `sitemap.xml`

#### Scenario: robots.txt does not block vs-pages
- **WHEN** the generator emits `robots.txt`
- **THEN** it contains no `Disallow` rule matching any vs-page path

#### Scenario: Unchanged pages keep their date
- **WHEN** the generator runs on a later day with no content change
- **THEN** every `<lastmod>` is unchanged and the generator writes nothing

#### Scenario: Brand data changes
- **WHEN** a price in `sony/data.js` changes and the generator runs
- **THEN** the `<lastmod>` of `/sony/` becomes the run's date, and pages whose content did not change keep theirs
