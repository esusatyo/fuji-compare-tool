## MODIFIED Requirements

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

### Requirement: Generated output cannot go stale
Generated artifacts (head blocks, vs-pages, sitemap, robots) SHALL be committed, and a Tier 1 test SHALL regenerate them in memory and fail on any difference from the committed files. Share images SHALL be held to the same rule through their manifest hashes (see the `share-images` capability).

#### Scenario: Data edit without regeneration fails tests
- **WHEN** a camera's USD price changes in `data.js` but the generator is not rerun
- **THEN** `npm test` fails, naming the stale artifact

#### Scenario: Card change without rendering fails tests
- **WHEN** a camera's `sensorMP` changes and the generator is rerun but the renderer is not
- **THEN** `npm test` fails, naming the stale share image
