## ADDED Requirements

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

#### Scenario: Brand block links its comparisons
- **WHEN** the generator runs against a brand with generated vs-pages
- **THEN** that brand's `index.html` body block links to those vs-pages, and the links survive engine rendering

#### Scenario: Counts come from data
- **WHEN** a camera is added to a brand's `data.js` and the generator is rerun
- **THEN** the brand page's body block reflects the new camera count

#### Scenario: Missing body markers fail loudly
- **WHEN** the generator encounters a brand `index.html` without both `seo:body` marker comments
- **THEN** it exits with an error instead of writing the file

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
