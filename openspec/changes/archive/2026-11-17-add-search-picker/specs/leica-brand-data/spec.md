## MODIFIED Requirements

### Requirement: Leica brand directory and registration

The system SHALL provide a self-contained `leica/` brand consisting of
`leica/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS` inside the `window.BRAND_DATA['leica']` registration IIFE)
and `leica/index.html` (loading `../engine.css`, `./data.js`, `../engine.js`).

Leica SHALL be registered consistently: every brand's `REGISTERED_BRANDS` MUST
list the same eight brands including Leica, the generated root `index.html` MUST list `leica` in its camera search index
and its brand-data fetch list, `compare/index.html` MUST load `../leica/data.js`, and
`scripts/generate-seo.js` `BRAND_CARD_ACCENTS` MUST carry a Leica stripe colour
that is not the red shared by Canon and Fujifilm.

#### Scenario: Leica page renders

- **WHEN** a visitor opens `leica/index.html`
- **THEN** the engine renders the Leica camera and lens comparison from
  `window.BRAND_DATA['leica']`

#### Scenario: Leica cameras on the compare page

- **WHEN** a visitor opens `compare/`
- **THEN** Leica cameras are selectable as `leica:<slug>`
