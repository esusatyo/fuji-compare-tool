# Home Landing

### Requirement: Root page is an indexable landing page
The root `index.html` SHALL render crawlable HTML content in its `<body>` for any visitor without a stored brand preference — including search-engine crawlers, which have no `localStorage`. The body content SHALL be generator-owned, living between `<!-- seo:body:begin -->` and `<!-- seo:body:end -->` markers, and SHALL NOT depend on JavaScript execution to be present in the served HTML.

#### Scenario: Crawler sees real content at the root
- **WHEN** the root page is fetched and its HTML parsed without executing scripts
- **THEN** the `<body>` contains a level-1 heading, descriptive copy, and one link per registered brand

#### Scenario: First-time visitor is not redirected
- **WHEN** a user visits the root URL with no `brand` key in `localStorage`
- **THEN** the landing page renders and no redirect occurs

#### Scenario: Body block markers are required
- **WHEN** the generator encounters a root `index.html` without both `seo:body` marker comments
- **THEN** it exits with an error instead of writing the file

### Requirement: Landing page links to every brand with live counts
The landing page SHALL list every brand in `REGISTERED_BRANDS`, each linking to that brand's page (`./<brand>/`), and each labelled with that brand's live camera and lens counts read from its `data.js` at generation time. Counts SHALL NOT be hand-maintained.

#### Scenario: Brand card reflects data
- **WHEN** the generator runs against a brand with 15 cameras and 72 lenses
- **THEN** that brand's landing-page entry links to `./<brand>/` and states 15 cameras and 72 lenses

#### Scenario: New brand appears automatically
- **WHEN** a sixth brand directory is added and the generator is rerun
- **THEN** the landing page contains an entry for it with no hand edits

### Requirement: Landing page links into the comparison cluster
The landing page SHALL link to a deterministic selection of generated vs-pages, so the root page passes authority into the comparison cluster rather than only to brand pages.

#### Scenario: Landing page reaches vs-pages
- **WHEN** the landing page is rendered
- **THEN** it contains at least one `<a>` whose href resolves to a generated `<brand>/vs/<a>-vs-<b>.html` page

#### Scenario: Links only target generated pages
- **WHEN** the landing page's vs-page links are resolved against the generator's output
- **THEN** every target exists in the generated file set
