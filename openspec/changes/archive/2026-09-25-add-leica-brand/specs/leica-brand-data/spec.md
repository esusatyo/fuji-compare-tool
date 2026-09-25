## ADDED Requirements

### Requirement: Leica brand directory and registration

The system SHALL provide a self-contained `leica/` brand consisting of
`leica/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS` inside the `window.BRAND_DATA['leica']` registration IIFE)
and `leica/index.html` (loading `../engine.css`, `./data.js`, `../engine.js`).

Leica SHALL be registered consistently: every brand's `REGISTERED_BRANDS` MUST
list the same eight brands including Leica, the root `index.html` `VALID_BRANDS`
MUST include `'leica'`, `compare/index.html` MUST load `../leica/data.js`, and
`scripts/generate-seo.js` `BRAND_CARD_ACCENTS` MUST carry a Leica stripe colour
that is not the red shared by Canon and Fujifilm.

#### Scenario: Leica page renders

- **WHEN** a visitor opens `leica/index.html`
- **THEN** the engine renders the Leica camera and lens comparison from
  `window.BRAND_DATA['leica']`

#### Scenario: Leica cameras on the compare page

- **WHEN** a visitor opens `compare/`
- **THEN** Leica cameras are selectable as `leica:<slug>`

### Requirement: Leica mounts

`BRAND_CONFIG.mounts` SHALL declare `l` with label `L-Mount` (identical to
Panasonic and Sigma) and `m` with label `M-Mount`. Every Leica camera and lens
MUST declare one of them. Fixed-lens cameras MUST use `mount: 'l'` with
`lensType: 'Fixed'`.

#### Scenario: A camera's mount agrees with its series

- **WHEN** a Leica camera's `series` begins with `M`
- **THEN** its `mount` MUST be `m`, and every other Leica series MUST be `l`

#### Scenario: TL lenses use the APS-C crop

- **WHEN** a Leica lens has `line: 'TL'`
- **THEN** its `focalLengthEquiv` MUST reflect a 1.5× crop while its `mount`
  stays `l`

### Requirement: Leica dataset scope

The Leica dataset SHALL contain digital bodies from the SL, TL/CL, M, Q and
Leica X lines and the large-sensor (1-inch or larger) D-Lux, V-Lux and C-Lux
compacts, and MUST NOT contain S-system DSLRs, film cameras, SOFORT instant
cameras or small-sensor compacts. First-party M and SL lenses MUST be limited
to lenses currently sold by Leica; TL lenses MAY be discontinued.

#### Scenario: Excluded bodies stay out

- **WHEN** the dataset is loaded
- **THEN** it contains no S-system, film M, SOFORT or small-sensor compact camera

### Requirement: Year floors accommodate Leica

The schema's camera year floor SHALL admit the 2006 Leica M8, and the lens year
floor SHALL admit the oldest optical design in Leica's current M catalogue,
each with a comment naming the item that sets it.

#### Scenario: M8 validates

- **WHEN** a camera with `year: 2006` is validated
- **THEN** the year check passes
