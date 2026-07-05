## ADDED Requirements

### Requirement: Canon BRAND_CONFIG defined
`canon/data.js` SHALL declare a `BRAND_CONFIG` that identifies Canon and registers its brand-specific spec sections.

#### Scenario: Canon brand identity applied
- **WHEN** `canon/index.html` is loaded
- **THEN** the logo reads "Canon", accent color is `#cc0000`, and `brandSections` includes `'dpaf'` and `'clog'`

### Requirement: Canon EOS R camera data complete
`canon/data.js` SHALL include all current Canon EOS R system interchangeable-lens bodies. Each camera object SHALL have the same universal fields as Fujifilm cameras (sensor, processor, weight, dimensions, weather sealing, LCD, EVF, AF, IBIS, video, connectivity, storage, battery) plus Canon-specific fields (`dpafPoints`, `clogTiers`).

#### Scenario: Canon camera renders in comparison slot
- **WHEN** a user selects a Canon EOS R camera in a comparison slot
- **THEN** all universal spec rows display correct values and Canon-specific sections (DPAF, C-Log) are populated

#### Scenario: Specs cross-verified
- **WHEN** Canon camera data is authored
- **THEN** each camera's specs SHALL be verified against at least two sources (Wikipedia and Canon's official product page) before commit

### Requirement: Canon RF lens data complete
`canon/data.js` SHALL include Canon RF-mount lenses (Canon-manufactured only; third-party RF lenses are out of scope for this change). Each lens SHALL carry the same universal lens fields as Fujifilm lenses (focal length, aperture, weight, dimensions, AF type, weather sealing, OIS).

#### Scenario: Canon lens renders in lens comparison slot
- **WHEN** a user selects a Canon RF lens in a comparison slot on the Canon page
- **THEN** all universal lens spec rows display correct values

### Requirement: Buy button handling for Canon items
Canon camera and lens objects SHALL include `buyUrl` pointing to an Amazon AU, B&H, or KEH listing where available. When no retailer link is found, `buyUrl` SHALL be `null` and the Buy button SHALL render as disabled per the brand-engine spec.

#### Scenario: Buy button active for available item
- **WHEN** a Canon camera has a valid `buyUrl`
- **THEN** the Buy button links to that URL and is interactive

#### Scenario: Buy button disabled for unavailable item
- **WHEN** a Canon camera has `buyUrl: null`
- **THEN** the Buy button is visible but disabled

### Requirement: Canon-specific spec sections defined in engine
The universal `SPEC_SECTIONS` array in `engine.js` SHALL include two Canon-specific sections:
- `dpaf`: displays Dual Pixel AF point count
- `clog`: displays supported C-Log tiers (C-Log, C-Log 2, C-Log 3)

Both sections SHALL carry `brand: 'canon'` and SHALL only render on Canon brand pages.

#### Scenario: DPAF section on Canon page
- **WHEN** the Canon compare page renders
- **THEN** a "Dual Pixel AF" spec section is visible showing each selected camera's DPAF point count

#### Scenario: DPAF section absent on Fujifilm page
- **WHEN** the Fujifilm compare page renders
- **THEN** no "Dual Pixel AF" section appears in the spec table
