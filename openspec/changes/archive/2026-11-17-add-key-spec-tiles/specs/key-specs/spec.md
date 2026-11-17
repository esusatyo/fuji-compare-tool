## ADDED Requirements

### Requirement: The key specs are recorded once
The list of key specs for cameras SHALL be recorded in `site-config.js` as `SITE_CONFIG.keySpecs.cameras`, an ordered list of ids. Each id SHALL have exactly one definition, in a module usable both by the generator and in the browser, giving its label, how an item's value is worded, and which direction (if any) is better. No page SHALL carry its own list of key specs.

#### Scenario: Unknown id
- **WHEN** the recorded list names an id that has no definition
- **THEN** the test suite fails and names the id

#### Scenario: Reordering
- **WHEN** the order of ids in `SITE_CONFIG.keySpecs.cameras` is changed and the generator is rerun
- **THEN** every vs-page shows its tiles in the new order

### Requirement: vs-pages show key-spec tiles above the spec table
Every vs-page, same-brand and cross-brand, SHALL show one tile per recorded key spec immediately before its spec table, each tile naming the spec and giving both cameras' values. The tiles SHALL be present in the served HTML and complete without JavaScript. A tile for which neither camera has a value SHALL be omitted.

#### Scenario: Tiles present
- **WHEN** a vs-page is generated
- **THEN** it contains tiles for Sensor, Max video, Stabilization, Burst and Price before its spec table, with each camera's value taken from its data

### Requirement: The better value is marked, and only when there is one
For a key spec with a direction, the better of the compared values SHALL be marked, in the same colour as a winning spec cell and with a text equivalent that does not rely on colour. When the values are equal, when the spec has no direction, or when a spec that needs every value is missing one, nothing SHALL be marked.

#### Scenario: Higher resolution
- **WHEN** a 40.2 MP camera is compared with a 26.1 MP camera
- **THEN** the 40.2 MP value is marked as better in the Sensor tile

#### Scenario: Dead heat
- **WHEN** both cameras shoot 15 fps
- **THEN** neither Burst value is marked

#### Scenario: Unranked spec
- **WHEN** two cameras' maximum video modes differ
- **THEN** the Max video tile shows both and marks neither
