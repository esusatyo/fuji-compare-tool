## MODIFIED Requirements

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
