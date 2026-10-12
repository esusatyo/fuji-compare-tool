## ADDED Requirements

### Requirement: Every generated page has its own share image
The generator SHALL assign every generated page a 1200×630 PNG under `og/`, at a path that mirrors the page path (`og/home.png` for the root, `og/compare.png`, `og/<brand>.png`, `og/<brand>/vs/<pair>.png`, `og/vs/<pair>.png`), except About and Privacy, which SHALL share `og/site.png`.

#### Scenario: Vs-page image path
- **WHEN** the generator emits `fujifilm/vs/x-t5-vs-x-s20.html`
- **THEN** that page's share image is `og/fujifilm/vs/x-t5-vs-x-s20.png`

#### Scenario: Trust pages share one image
- **WHEN** the generator emits the About and Privacy head blocks
- **THEN** both reference `og/site.png`

### Requirement: Share cards are typographic and photo-free
Share cards SHALL be rendered from site identity tokens, the logo mark and dataset fields only, and SHALL NOT embed any product photograph or other third-party image. Cards SHALL NOT show prices.

#### Scenario: Camera with a Commons photo
- **WHEN** a vs-card is built for a camera whose `imageUrl` is a Wikimedia Commons photo
- **THEN** the card HTML contains no `<img>` and no reference to that URL

### Requirement: Vs-cards show the comparison
A vs-card SHALL show both camera names (with brand names on cross-brand cards), a row each for sensor megapixels, IBIS, weight and release year, and front silhouettes of both bodies drawn at one shared scale from their `width` and `height`. A camera missing either dimension SHALL be drawn without a silhouette rather than with an estimated one.

#### Scenario: Silhouettes share a scale
- **WHEN** a card compares a 130 mm-wide body with a 104 mm-wide body
- **THEN** the first silhouette's drawn width is 130/104 times the second's

#### Scenario: Missing dimensions
- **WHEN** one camera in the pair has `height: null`
- **THEN** its silhouette is omitted and the other camera's is still drawn

### Requirement: Brand, compare and home cards
A brand card SHALL show the brand name, its live camera and lens counts, and its declared mount labels. The compare card SHALL name the cross-brand comparison and list the registered brands. The home and site cards SHALL show the site name and tagline.

#### Scenario: Brand counts follow data
- **WHEN** a camera is added to a brand's `data.js`
- **THEN** that brand's card HTML changes and its share image is reported stale until re-rendered

### Requirement: Share images are rendered incrementally and recorded in a manifest
`scripts/render-share-images.js` SHALL render each card's HTML with headless Chrome. It SHALL re-render only cards whose card-HTML hash differs from `og/manifest.json` or whose PNG is missing, SHALL delete PNGs that belong to no page, and SHALL rewrite the manifest. It SHALL exit with an error naming `CHROME_BIN` when no Chrome binary is found.

#### Scenario: Price refresh renders nothing
- **WHEN** only `prices` fields change and the renderer runs
- **THEN** zero cards are re-rendered

#### Scenario: New vs-pair
- **WHEN** a data edit adds a new curated pair and the renderer runs
- **THEN** exactly that pair's card is rendered and added to the manifest

### Requirement: Share images cannot go stale
A Tier 1 test SHALL fail when any page's share image is missing, not 1200×630, or has a manifest hash that differs from its current card HTML, and when any PNG or manifest entry under `og/` belongs to no page. The failure message SHALL name `node scripts/render-share-images.js`.

#### Scenario: Data edit changes a card field
- **WHEN** a camera's `weight` changes and only `generate-seo.js` is rerun
- **THEN** `npm test` fails, naming every affected share image and the render command

### Requirement: Pre-commit hook renders cards when Chrome is available
When the pre-commit hook regenerates SEO output, it SHALL then run the incremental renderer and stage its output if a Chrome binary is available, and SHALL skip rendering (leaving the test gate to report staleness) when none is.

#### Scenario: Commit on a machine without Chrome
- **WHEN** a staged data edit changes a card and no Chrome binary exists
- **THEN** the hook skips rendering and the test gate aborts the commit naming the render command
