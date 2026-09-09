## MODIFIED Requirements

### Requirement: BRAND_CONFIG contract
Each brand's `data.js` SHALL declare a `BRAND_CONFIG` constant with the following required fields: `name`, `slug`, `families`, `brandSections`, `heroCamera`, `mount`, `mounts`, `cameras`, `lenses`. `mount` stays the landing-tile display string; `mounts` is an ordered array of `{ id, label }` describing every mount the brand spans, and is the machine-readable list the filter reads.

#### Scenario: Missing BRAND_CONFIG field
- **WHEN** `BRAND_CONFIG` is declared without a required field
- **THEN** `tests/data/config.test.js` fails naming the brand and the missing field

#### Scenario: Single-mount brand declares a one-entry array
- **WHEN** `canon/data.js` is loaded
- **THEN** `BRAND_CONFIG.mounts` is `[{ id:'rf', label:'RF-Mount' }]` and `BRAND_CONFIG.mount` still reads `'RF-Mount'`

## ADDED Requirements

### Requirement: The mount filter is inert for single-mount brands
The engine SHALL render no chip row, and apply no filtering, for a brand whose `BRAND_CONFIG.mounts` holds one entry — producing the same DOM as before the filter existed.

#### Scenario: Brand declares one mount
- **WHEN** a brand page whose `BRAND_CONFIG.mounts` has a single entry initialises
- **THEN** the engine renders no chip row, offers every item in the slot dropdowns, and lays out the compare header unchanged

#### Scenario: Brand declares two mounts
- **WHEN** a brand page whose `BRAND_CONFIG.mounts` has two entries initialises
- **THEN** the engine renders the chip row described by the `mount-filter` capability, and no other part of the page changes

#### Scenario: Compare page shows no chip row
- **WHEN** `compare/index.html` initialises with its synthesized cross-brand config
- **THEN** no chip row renders
