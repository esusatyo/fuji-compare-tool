# SEO Surface

## ADDED Requirements

### Requirement: Single-source site configuration
The site SHALL define `baseUrl`, `siteName`, and `dataVerified` in exactly one file (`site-config.js`), loaded by every brand page as a plain browser script and evaluated by the SEO generator. No other hand-maintained file SHALL contain an absolute site URL. Until launch, `baseUrl` SHALL be a clearly-fake reserved-TLD placeholder.

#### Scenario: One-file domain swap
- **WHEN** `baseUrl` is changed in `site-config.js` and the generator is rerun
- **THEN** every canonical, OG URL, sitemap entry, and robots sitemap reference reflects the new domain with no other manual edits

### Requirement: Every page has SEO head tags
Each brand `index.html` and the root `index.html` SHALL contain a generator-owned block (between `<!-- seo:begin -->` and `<!-- seo:end -->` markers) providing a meta description, canonical URL, and Open Graph/Twitter-card tags. Brand descriptions SHALL embed the live camera and lens counts from that brand's data.

#### Scenario: Brand page head block
- **WHEN** the generator runs against a brand with 35 cameras and 86 lenses
- **THEN** that brand's `index.html` head block contains a canonical of `<baseUrl>/<brand>/` and a description mentioning 35 cameras and 86 lenses

#### Scenario: Missing markers fail loudly
- **WHEN** the generator encounters an `index.html` without both seo marker comments
- **THEN** it exits with an error instead of writing the file

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

### Requirement: Sitemap and robots
The generator SHALL emit a root `sitemap.xml` listing the root page, every brand page, every vs-page, and the About/Privacy pages — all as absolute URLs under `baseUrl` — and a `robots.txt` that permits crawling and references the sitemap's absolute URL.

#### Scenario: Sitemap covers all pages
- **WHEN** the generator runs
- **THEN** `sitemap.xml` contains one `<loc>` per brand page and per committed vs-page, each beginning with `baseUrl`

### Requirement: Generated output cannot go stale
Generated artifacts (head blocks, vs-pages, sitemap, robots) SHALL be committed, and a Tier 1 test SHALL regenerate them in memory and fail on any difference from the committed files.

#### Scenario: Data edit without regeneration fails tests
- **WHEN** a camera's USD price changes in `data.js` but the generator is not rerun
- **THEN** `npm test` fails, naming the stale artifact
