# SEO Surface

## Purpose
What the generator emits for search engines and sharing: head tags, vs-pages and their indexability, sitemap, robots and freshness.
## Requirements
### Requirement: Single-source site configuration
The site SHALL define `baseUrl`, `siteName`, and `dataVerified` in exactly one file (`site-config.js`), loaded by every brand page as a plain browser script and evaluated by the SEO generator. No other hand-maintained file SHALL contain an absolute site URL. Until launch, `baseUrl` SHALL be a clearly-fake reserved-TLD placeholder.

#### Scenario: One-file domain swap
- **WHEN** `baseUrl` is changed in `site-config.js` and the generator is rerun
- **THEN** every canonical, OG URL, sitemap entry, and robots sitemap reference reflects the new domain with no other manual edits

### Requirement: Every page has SEO head tags
Each brand `index.html` and the root `index.html` SHALL contain a generator-owned block (between `<!-- seo:begin -->` and `<!-- seo:end -->` markers) providing a meta description, canonical URL, and Open Graph/Twitter-card tags. Brand descriptions SHALL embed the live camera and lens counts from that brand's data. Every generated page head (root, brand pages, `compare/`, About, Privacy, and every vs-page) SHALL also carry `og:image` and `twitter:image` as absolute URLs built from `baseUrl`, `og:image:width` 1200, `og:image:height` 630, a non-empty `og:image:alt`, and `twitter:card` set to `summary_large_image`.

#### Scenario: Brand page head block
- **WHEN** the generator runs against a brand with 35 cameras and 86 lenses
- **THEN** that brand's `index.html` head block contains a canonical of `<baseUrl>/<brand>/` and a description mentioning 35 cameras and 86 lenses

#### Scenario: Missing markers fail loudly
- **WHEN** the generator encounters an `index.html` without both seo marker comments
- **THEN** it exits with an error instead of writing the file

#### Scenario: Large share card tags
- **WHEN** the generator emits any page's head block
- **THEN** it contains `twitter:card` = `summary_large_image` and an `og:image` beginning with `<baseUrl>/og/` and ending in `.png`

### Requirement: Curated prerendered vs-pages
The generator SHALL emit static comparison pages at `<brand>/vs/<a>-vs-<b>.html` for a curated, deterministic set of camera pairs per brand: consecutive generations within a model line (lines derived from slug structure — roman-numeral suffixes and numbered tiers with a price-similarity gate — with the newer camera not discontinued), plus each non-discontinued camera paired with its two nearest USD-price neighbours, deduplicated. It SHALL NOT emit all possible pairs. Each page SHALL contain a crawlable HTML table of key specs built from schema-guaranteed data fields, `Product` JSON-LD, a canonical URL, and a link into the interactive tool using the shareable-hash format `../index.html#cameras=<a>,<b>`.

#### Scenario: Successor pair page exists
- **WHEN** a current camera has a direct predecessor in its model line (e.g. X-T5 succeeds X-T4; a7 V succeeds a7 IV; X100VI succeeds X100V)
- **THEN** a vs-page exists for the pair with both camera names in the title and a spec table showing both columns

#### Scenario: No thin-content explosion
- **WHEN** the generator runs against a brand with 35 cameras
- **THEN** the number of generated vs-pages for that brand is far below the 595 possible pairs (curated rules only)

#### Scenario: Deep link into the tool
- **WHEN** a visitor on `fujifilm/vs/x-t5-vs-x-t50.html` clicks the interactive-comparison link
- **THEN** they land on the brand page with X-T5 and X-T50 preselected and the third slot at the brand default

### Requirement: Comparison pages are split into indexable and noindex sets
The generator SHALL classify every generated vs-page (same-brand and cross-brand) as indexable or non-indexable:
- A page SHALL be indexable if it is listed in the generator's pinned-pairs list.
- A page SHALL also be indexable if it is a same-brand successor pair (consecutive generations within a model line) whose newer camera's launch year is at least the generator's successor-index threshold (`SUCCESSOR_INDEX_SINCE`).
- Every other page SHALL be non-indexable.

A non-indexable page SHALL still be generated and linked, and SHALL carry `<meta name="robots" content="noindex, follow">` in its head. An indexable page SHALL NOT carry a robots `noindex` directive. Both kinds SHALL keep their self-referencing canonical URL.

#### Scenario: Price-neighbour page without a pin is noindexed
- **WHEN** a same-brand pair is produced only by the price-neighbour rule and is not pinned
- **THEN** its vs-page is generated, carries `noindex, follow`, and is absent from `sitemap.xml`

#### Scenario: Recent successor page is indexable by default
- **WHEN** a new current camera launched in or after `SUCCESSOR_INDEX_SINCE` is added whose predecessor is in the same model line
- **THEN** its successor vs-page is generated without a `noindex` directive and is listed in `sitemap.xml`, with no pin required

#### Scenario: Older unpinned successor page is noindexed
- **WHEN** a successor pair's newer camera launched before `SUCCESSOR_INDEX_SINCE` and the page is not pinned
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

### Requirement: Generated output cannot go stale
Generated artifacts (head blocks, vs-pages, sitemap, robots) SHALL be committed, and a Tier 1 test SHALL regenerate them in memory and fail on any difference from the committed files. Share images SHALL be held to the same rule through their manifest hashes (see the `share-images` capability).

#### Scenario: Data edit without regeneration fails tests
- **WHEN** a camera's USD price changes in `data.js` but the generator is not rerun
- **THEN** `npm test` fails, naming the stale artifact

#### Scenario: Card change without rendering fails tests
- **WHEN** a camera's `sensorMP` changes and the generator is rerun but the renderer is not
- **THEN** `npm test` fails, naming the stale share image

### Requirement: No generated page is orphaned
Every generated page except the root SHALL be the target of at least one crawlable `<a href>` link from another page in the generated output. A sitemap entry SHALL NOT be considered a link for this purpose. A Tier 1 test SHALL build the generator's output in memory, resolve every anchor href relative to its containing file, and fail naming any generated page that no other page links to.

#### Scenario: Orphaned vs-page fails tests
- **WHEN** a vs-page is generated but no other page links to it
- **THEN** `npm test` fails, naming the orphaned page

#### Scenario: Sitemap presence is not sufficient
- **WHEN** a page appears in `sitemap.xml` but is the target of no `<a href>` on any page
- **THEN** the orphan test still fails for that page

#### Scenario: Links resolve to real pages
- **WHEN** the generated output is built
- **THEN** every internal `<a href>` in it resolves to a path that exists in the generated file set

### Requirement: Brand pages carry a generated crawlable block
Each `<brand>/index.html` SHALL contain a generator-owned block between `<!-- seo:body:begin -->` and `<!-- seo:body:end -->` markers, positioned outside the engine's render container so it survives rendering. The block SHALL contain crawlable prose naming the brand with its live camera and lens counts, and links to that brand's generated vs-pages. As with head blocks, the generator SHALL refuse to write a brand page missing either marker.

The block SHALL also contain, as visible content:
- a table with exactly one row per current (non-discontinued) camera, in `CAMERA_ORDER` order, giving announcement year, sensor, in-body stabilization, maximum video, weight, size (width × height × depth) and USD price, formatted identically to the vs-page spec table, with `—` for a missing value;
- a line naming every discontinued camera of the brand, when there is at least one;
- a line giving the brand's total lens count and the count per lens maker.

A camera's name in the table SHALL link (extensionless) to one of its indexable vs-pages when one exists, and SHALL be plain text otherwise. When a brand has no current cameras, the table SHALL be omitted. The engine SHALL place its footer after the generator-owned static sections once rendered.

#### Scenario: Brand block links its comparisons
- **WHEN** the generator runs against a brand with generated vs-pages
- **THEN** that brand's `index.html` body block links to those vs-pages, and the links survive engine rendering

#### Scenario: Counts come from data
- **WHEN** a camera is added to a brand's `data.js` and the generator is rerun
- **THEN** the brand page's body block reflects the new camera count

#### Scenario: Missing body markers fail loudly
- **WHEN** the generator encounters a brand `index.html` without both `seo:body` marker comments
- **THEN** it exits with an error instead of writing the file

#### Scenario: Current cameras appear in the static table
- **WHEN** a brand's `data.js` has N cameras without `discontinued: true`
- **THEN** its brand page's at-a-glance table has exactly N body rows, in `CAMERA_ORDER` order, each matching that camera's data

#### Scenario: Discontinuing a camera moves it to the older line
- **WHEN** a camera is marked `discontinued: true` and the generator is rerun
- **THEN** its row leaves the table and its name appears in the older-cameras line

#### Scenario: Names link only to indexable comparisons
- **WHEN** a current camera appears in no indexable vs-page
- **THEN** its table name is plain text, never a link to a noindexed page

#### Scenario: Footer ends the rendered page
- **WHEN** the engine renders a brand page that has generator-owned static sections
- **THEN** the footer is the last of those elements in document order, and the static sections are unchanged

### Requirement: Vs-pages link related comparisons
Each generated vs-page SHALL link to other vs-pages for the same brand that share a camera with it, selected deterministically from the curated pair set and capped at six links, so the comparison pages form a connected cluster rather than isolated leaves. Related links SHALL only target pages the generator actually emits.

#### Scenario: Related links present
- **WHEN** a vs-page for cameras A and B is generated and other curated pairs include A or B
- **THEN** the page contains links to those pages, at most six

#### Scenario: Related links are deterministic
- **WHEN** the generator is run twice against unchanged data
- **THEN** each vs-page's related links are identical in content and order

#### Scenario: No link to a non-existent page
- **WHEN** a vs-page's related links are resolved
- **THEN** every target exists in the generated file set

### Requirement: Search engines are notified of changed pages
The site SHALL serve its IndexNow key file at the root. After each successful production deploy, it SHALL submit to IndexNow the sitemap URLs whose pages changed in the deployed commit range, plus any URLs dropped from the sitemap in that range. It SHALL NOT submit URLs that are neither in the current sitemap nor dropped from it.

#### Scenario: A vs-page changes
- **WHEN** a push to `main` changes `vs/sony-a7r-vi-vs-nikon-z8.html`, which is in the sitemap, and the Workers Builds deploy succeeds
- **THEN** `https://comparecameraspecs.com/vs/sony-a7r-vi-vs-nikon-z8` is submitted to IndexNow

#### Scenario: A noindexed page changes
- **WHEN** a push changes a vs-page that is not in the sitemap
- **THEN** that URL is not submitted

#### Scenario: A page leaves the sitemap
- **WHEN** a push removes a URL from `sitemap.xml`
- **THEN** that URL is submitted, so the engine re-crawls it and sees the removal

#### Scenario: Brand data changes
- **WHEN** a push changes `sony/data.js`
- **THEN** `https://comparecameraspecs.com/sony/` is submitted

#### Scenario: Deploy fails
- **WHEN** the Workers Builds check for the pushed commit fails or does not finish within the timeout
- **THEN** nothing is submitted

