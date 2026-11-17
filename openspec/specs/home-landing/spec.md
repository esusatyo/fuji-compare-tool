# Home Landing

## Purpose
The landing page: brand cards and the entry points into each brand and the cross-brand compare page.
## Requirements
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

### Requirement: Landing page links to the cross-brand compare page
The landing page SHALL contain a generator-owned link to
`./compare/` presented as a peer of the brand cards (e.g. an
"All brands — compare across brands" card), so the cross-brand tool is
reachable from the root without JavaScript.

#### Scenario: Crawler reaches the compare page from the root
- **WHEN** the root page's HTML is parsed without executing scripts
- **THEN** it contains an `<a>` whose href resolves to `compare/index.html`

### Requirement: Landing page links to the size comparison page
The root page SHALL contain a link card to `/size/` positioned after the brand cards and before the introduction, present in the served HTML.

#### Scenario: Card position
- **WHEN** the root page is generated
- **THEN** a link to `./size/` appears after the last brand card and before the intro section

### Requirement: Landing page links to the kit builder
The root page SHALL contain a link card to `/kit/` after the size comparison card and before the introduction, present in the served HTML.

#### Scenario: Card position
- **WHEN** the root page is generated
- **THEN** a link to `./kit/` appears after the link to `./size/` and before the intro section

### Requirement: Landing page links every mount page
The root page SHALL contain a "Browse by lens mount" section directly after the brand cards, linking every mount page, present in the served HTML.

#### Scenario: Position
- **WHEN** the root page is generated
- **THEN** the mount links appear after the brand grid and before the size comparison card

### Requirement: Landing page embeds the cross-brand comparison tool
The root page SHALL render the cross-brand camera comparison inside its own layout — one site header, one `<h1>`, one footer — directly under the hero. The tool SHALL open with empty slots, each presenting a camera search, and SHALL show no spec table until a camera is picked. Picking a camera SHALL render the table in place without navigating; with one camera it SHALL show that camera's specs and no winner highlighting, and with two or more it SHALL behave as the compare page does. The page SHALL offer a visible control to choose 2, 3 or 4 slots (default 2), subject to the two-slot clamp below the mobile breakpoint. The landing page's static, crawlable content SHALL remain in the served HTML.

#### Scenario: First visit
- **WHEN** a visitor opens the root URL
- **THEN** two empty camera-search slots show, no spec table is present, and the URL has no hash

#### Scenario: First pick shows the table
- **WHEN** the visitor searches "xt5" in the first slot and selects the X-T5
- **THEN** the X-T5's specs render below the slots on the same page, with the second column blank and no winners

#### Scenario: Second pick compares
- **WHEN** the visitor then picks a Canon EOS R6 Mark III in the second slot
- **THEN** both columns are filled, winners are highlighted, and both brands' spec sections show

#### Scenario: Choosing four
- **WHEN** a visitor at a desktop viewport chooses 4
- **THEN** four slots show, and any not yet picked stay empty

### Requirement: Homepage comparison can be reset
Once at least one camera is picked, the root page SHALL show a "Reset" button below the spec table. Pressing it SHALL clear every slot, remove the table and the URL hash, keep the chosen slot count, and report `quick-compare:reset`. The button SHALL NOT appear while no camera is picked, nor on any other page.

#### Scenario: Reset after comparing
- **WHEN** a visitor with two cameras picked presses Reset
- **THEN** both slots return to empty search fields, no table is shown, and the URL has no hash

### Requirement: Landing page searches a generated index and loads brand data on demand
The root page SHALL NOT load any brand `data.js` in its HTML. `scripts/generate-seo.js` SHALL emit, in the page's generated block, an index of every brand's cameras (slug, name, year, discontinued) and the list of brand data files, both derived from the brand directories. The picker SHALL search this index before brand data is present. Brand data SHALL be fetched when a picker is first opened, when a camera is picked, or at load when the URL names cameras. While a picked camera's data is in flight its slot SHALL show the camera's name and a loading state; if the fetch fails the slot SHALL say so and offer a retry.

#### Scenario: Index matches the data
- **WHEN** a camera is added to a brand's `data.js` and the generator is rerun
- **THEN** the root page's index contains it, and a test fails if the index and the data disagree

#### Scenario: Pick before data arrives
- **WHEN** a visitor picks a camera before the brand files have loaded
- **THEN** the slot names the camera and says its specs are loading, and the table appears when they arrive

#### Scenario: Fetch failure
- **WHEN** the brand files fail to load
- **THEN** the slot keeps the pick, reports the failure and offers a retry that fetches again

### Requirement: Homepage comparison starts are counted once
The root page SHALL report `quick-compare:first` when a visitor first picks a camera and `quick-compare:pair` when two slots are first filled, each at most once per page load.

#### Scenario: Two picks
- **WHEN** a visitor picks a first and then a second camera
- **THEN** `quick-compare:first` and `quick-compare:pair` are each reported once

