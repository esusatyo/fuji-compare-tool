## ADDED Requirements

### Requirement: Comparison pages are split into indexable and noindex sets
The generator SHALL classify every generated vs-page (same-brand and cross-brand) as indexable or non-indexable:
- A page SHALL be indexable if it is listed in the generator's pinned-pairs list.
- A page SHALL also be indexable if it is a same-brand successor pair (consecutive generations within a model line) that is not on the generator's successor-exclude list.
- Every other page SHALL be non-indexable.

A non-indexable page SHALL still be generated and linked, and SHALL carry `<meta name="robots" content="noindex, follow">` in its head. An indexable page SHALL NOT carry a robots `noindex` directive. Both kinds SHALL keep their self-referencing canonical URL.

#### Scenario: Price-neighbour page without a pin is noindexed
- **WHEN** a same-brand pair is produced only by the price-neighbour rule and is not pinned
- **THEN** its vs-page is generated, carries `noindex, follow`, and is absent from `sitemap.xml`

#### Scenario: Successor page is indexable by default
- **WHEN** a new current camera is added whose predecessor is in the same model line
- **THEN** its successor vs-page is generated without a `noindex` directive and is listed in `sitemap.xml`, with no pin required

#### Scenario: Excluded successor false match is noindexed
- **WHEN** the successor rule pairs two cameras listed on the successor-exclude list (e.g. Canon EOS R8 vs EOS R7)
- **THEN** that page carries `noindex, follow` and is absent from `sitemap.xml`

#### Scenario: Unpinned cross-brand page is noindexed
- **WHEN** a `CROSS_BRAND_MATCHUPS` page is not pinned
- **THEN** it is generated, carries `noindex, follow`, and is absent from `sitemap.xml`

### Requirement: Pinned comparison pairs are stable
The generator SHALL maintain an explicit pinned-pairs list of vs-page paths, written as their URLs (for example `panasonic/vs/s1-ii-vs-s1h` and `vs/sony-a1-ii-vs-canon-eos-r1`).
- A pinned same-brand pair SHALL always be generated at exactly the pinned path, in the pinned slug order, whatever the pairing rules produce. If a pairing rule yields the same two cameras in the other order, only the pinned order SHALL be emitted.
- A pinned cross-brand path SHALL name a page generated from `CROSS_BRAND_MATCHUPS`.
- The generator SHALL exit with an error naming the entry when a pin names an unknown brand, an unknown camera slug, a missing cross-brand page, or a same-camera pair.

#### Scenario: Pinned page survives a price change
- **WHEN** a pinned same-brand pair stops being produced by the price-neighbour rule after a price edit and the generator is rerun
- **THEN** the pinned vs-page is still generated at the same path and is still indexable

#### Scenario: Restored page keeps its original URL
- **WHEN** `panasonic/vs/s1-ii-vs-s1h` is pinned
- **THEN** `panasonic/vs/s1-ii-vs-s1h.html` is generated, and no `panasonic/vs/s1h-vs-s1-ii.html` is generated

#### Scenario: Stale pin fails loudly
- **WHEN** a pinned pair names a camera slug that no longer exists in its brand's `data.js`
- **THEN** the generator exits with an error naming the pin instead of writing any files

## MODIFIED Requirements

### Requirement: Sitemap and robots
The generator SHALL emit a root `sitemap.xml` listing, as absolute URLs under `baseUrl`:
- the root page;
- every brand page;
- the cross-brand compare page;
- every **indexable** vs-page;
- the About and Privacy pages.

It SHALL NOT list any non-indexable vs-page. The generator SHALL also emit a `robots.txt` that permits crawling and references the sitemap's absolute URL. Non-indexable pages SHALL be excluded through the page-level robots meta tag, not through `robots.txt` disallow rules.

#### Scenario: Sitemap covers all indexable pages
- **WHEN** the generator runs
- **THEN** `sitemap.xml` contains one `<loc>` per brand page and per indexable vs-page, each beginning with `baseUrl`

#### Scenario: Sitemap omits noindexed pages
- **WHEN** the generator runs
- **THEN** no vs-page carrying a `noindex` directive appears in `sitemap.xml`

#### Scenario: robots.txt does not block vs-pages
- **WHEN** the generator emits `robots.txt`
- **THEN** it contains no `Disallow` rule matching any vs-page path
