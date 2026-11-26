## ADDED Requirements

### Requirement: Pilot cameras have a static spec page
The generator SHALL write one static page per camera in the pilot set at `/<brand>/<slug>`, built only from brand data: headline specs with the camera's spec citations, dimensions and weight with a to-scale drawing beside a credit card, list prices in every currency the data holds, release year, links to its predecessor's and successor's pages where they exist, its mount linking the mount page with the number of lenses that fit, links to every generated vs-page and size page that includes it, and a link into the comparison tool with the camera preselected. The page SHALL be complete without JavaScript and SHALL be linked extensionless.

#### Scenario: Pilot camera page
- **WHEN** the generator runs and the Fujifilm X-T50 is in the pilot set
- **THEN** `/fujifilm/x-t50` exists with the title "Fujifilm X-T50 Specs, Size & Weight", one `<h1>`, and a link to `/mount/x-mount`

#### Scenario: No clash with the brand tool
- **WHEN** a camera slug equals `vs`, `size`, `data` or `index`
- **THEN** generation fails naming the slug

### Requirement: Only pilot camera pages are indexable
A camera page SHALL be indexable, and listed in `sitemap.xml`, only when the camera is in the pilot set. The pilot set SHALL be derived from data and configuration (proposed: current cameras appearing in at least two pinned vs-pages), never from a hand-kept page list. Any other camera page that is generated SHALL carry `noindex, follow` and SHALL NOT be linked from a brand page's at-a-glance table.

#### Scenario: Camera outside the pilot
- **WHEN** a current camera appears in fewer than two pinned vs-pages
- **THEN** its page, if generated, carries `noindex, follow` and is absent from the sitemap

### Requirement: Camera pages carry truthful structured data
Each camera page SHALL carry `Product` JSON-LD (name, brand, image when the data has one, a USD `Offer` when the data has a USD price) and `BreadcrumbList` JSON-LD (Home → brand page → camera page). It SHALL NOT carry `review` or `aggregateRating`.

#### Scenario: Structured data
- **WHEN** a camera page is generated
- **THEN** the structured-data validation test passes for it and finds no rating or review
