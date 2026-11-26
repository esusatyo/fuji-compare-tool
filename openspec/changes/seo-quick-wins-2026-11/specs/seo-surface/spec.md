## ADDED Requirements

### Requirement: The vs-page lens mount row names the mount
Each vs-page's spec table SHALL show, in its "Lens mount" row, the mount label the camera's brand declares in `BRAND_CONFIG.mounts` for the camera's `mount` id, followed by the mount's `system` in parentheses when it declares one. A fixed-lens camera SHALL read "Fixed lens", followed by its `lensSpec` when it has one. Two cameras on different mounts SHALL never show the same text in that row.

#### Scenario: Cross-brand page
- **WHEN** the generator renders the Nikon Zf vs Fujifilm X-T5 page
- **THEN** the "Lens mount" row reads "Z-Mount" and "X-Mount"

#### Scenario: Fixed-lens camera
- **WHEN** a vs-page includes the Fujifilm X100VI
- **THEN** its "Lens mount" cell reads "Fixed lens: 23mm f/2 (35mm equiv.)"

### Requirement: Every generated page has one static h1
Every HTML page the generator writes SHALL contain exactly one `<h1>` in its served HTML, including brand pages, `/compare/`, `/size/` and `/kit/`, whose tools render in the browser. On those pages the `<h1>` text SHALL be the hero title the engine shows, and once the engine has rendered the page SHALL still contain exactly one `<h1>`.

#### Scenario: Brand page without JavaScript
- **WHEN** a crawler that does not run JavaScript fetches `/fujifilm/`
- **THEN** the HTML contains one `<h1>` reading "Fujifilm Camera Comparison"

#### Scenario: Brand page after render
- **WHEN** the engine renders `/fujifilm/`
- **THEN** the page has exactly one `<h1>`, inside the hero, reading "Fujifilm Camera Comparison"

### Requirement: The homepage declares the site
The root page SHALL carry `WebSite` and `Organization` JSON-LD naming the site (`siteName`) at its base URL, with the organization's logo. It SHALL NOT declare a `SearchAction`, and SHALL declare `sameAs` only for profiles the owner has confirmed.

#### Scenario: Site name
- **WHEN** the root page is generated
- **THEN** its JSON-LD contains a `WebSite` whose `name` is the configured site name and whose `url` is the base URL with a trailing slash

### Requirement: Content pages carry breadcrumb structured data
Vs-pages, size pages, mount pages, guides and articles SHALL carry `BreadcrumbList` JSON-LD of the form Home → section → page, where the section is the page's visible back link and the last item is the page's canonical URL.

#### Scenario: Same-brand vs-page
- **WHEN** `fujifilm/vs/x-t50-vs-x100v` is generated
- **THEN** its breadcrumb reads Home → Fujifilm cameras (`/fujifilm/`) → the page

#### Scenario: Cross-brand vs-page
- **WHEN** a cross-brand vs-page is generated
- **THEN** its breadcrumb's middle item is the cross-brand compare page (`/compare/`)

### Requirement: Structured data is valid and truthful
Every JSON-LD block in generated HTML SHALL parse as JSON, declare `@context` `https://schema.org`, and carry the required fields of each type it uses. No block SHALL contain `review` or `aggregateRating`: the site publishes no reviews.

#### Scenario: Invalid block
- **WHEN** a generated page carries a JSON-LD block that does not parse, lacks `@context`, or uses a type with no validation rule
- **THEN** `npm test` fails naming the page
