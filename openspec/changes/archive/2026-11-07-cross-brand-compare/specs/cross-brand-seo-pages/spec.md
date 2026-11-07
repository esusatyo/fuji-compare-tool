# Cross-Brand SEO Pages

## ADDED Requirements

### Requirement: Curated cross-brand matchup list drives generation
`scripts/generate-seo.js` SHALL define a hand-curated `CROSS_BRAND_MATCHUPS`
list of camera pairs spanning different brands. The generator SHALL fail hard
(non-zero exit, no partial output) if any entry references a brand slug or
camera slug that does not resolve in the loaded brand data. The generator
SHALL NOT auto-generate the full cross-brand cartesian product.

#### Scenario: Typo in the matchup list
- **WHEN** the generator runs with a matchup referencing `sony:a7-vi` (nonexistent)
- **THEN** it exits with an error naming the bad entry and writes no pages

### Requirement: Cross-brand vs-pages generated at root vs/
For each matchup, the generator SHALL emit a static page at
`vs/<brandA>-<slugA>-vs-<brandB>-<slugB>.html` with the same content contract
as brand vs-pages: unique title and meta description naming both cameras with
brand names, canonical URL, OG tags, ItemList/Product JSON-LD with both
offers, a static spec comparison table, product cards with View/Buy links,
and a related-comparisons block. The interactive CTA SHALL deep-link to
`../compare/#cameras=<brandA>:<slugA>,<brandB>:<slugB>`.

#### Scenario: Page generated for a matchup
- **WHEN** the matchup `[['fujifilm','x100vi'],['sony','a6700']]` is processed
- **THEN** `vs/fujifilm-x100vi-vs-sony-a6700.html` exists, its title names both "Fujifilm X100VI" and "Sony A6700", and its CTA href is `../compare/#cameras=fujifilm:x100vi,sony:a6700`

#### Scenario: Spec table is static HTML
- **WHEN** a generated cross-brand page is parsed without executing scripts
- **THEN** the spec table rows and both camera names are present in the HTML

### Requirement: Cross-brand pages join the crawl surface
Every generated cross-brand page SHALL be listed in `sitemap.xml`, and the
landing page's comparison cluster SHALL link to a deterministic selection of
them. Cross-brand pages SHALL link to related comparisons (other cross-brand
pages and/or the two cameras' same-brand vs-pages), so no generated page is
an orphan.

#### Scenario: Sitemap includes cross-brand pages
- **WHEN** the generator runs
- **THEN** `sitemap.xml` contains one `<url>` entry per cross-brand page under `<baseUrl>/vs/`

#### Scenario: No orphan pages
- **WHEN** the generated file set is analyzed
- **THEN** every cross-brand page is reachable from at least one other generated page
