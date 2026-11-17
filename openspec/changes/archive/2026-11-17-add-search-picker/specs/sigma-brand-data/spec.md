## MODIFIED Requirements

### Requirement: Sigma brand directory and registration

The system SHALL provide a self-contained `sigma/` brand consisting of
`sigma/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS` inside the `window.BRAND_DATA['sigma']` registration IIFE)
and `sigma/index.html` (loading `../engine.css`, `./data.js`, `../engine.js`),
such that `sigma/` renders through the shared engine.

Sigma SHALL be registered consistently across the multi-brand wiring: every
brand's `REGISTERED_BRANDS` MUST list the same six brands including Sigma, the generated root `index.html` MUST list `sigma` in its camera search index
and its brand-data fetch list,
`compare/index.html` MUST load `../sigma/data.js`, and
`scripts/generate-seo.js` `BRAND_CARD_ACCENTS` MUST carry a Sigma stripe colour.
`engine.js` `MANUFACTURER_COLORS` already contains a `Sigma` entry and MUST be
reused unchanged.

#### Scenario: Sigma page loads and renders

- **WHEN** a visitor opens `sigma/index.html`
- **THEN** the engine renders the Sigma camera comparison using `BRAND_CONFIG`,
  the brand switcher lists Sigma as the selected brand, and no script errors occur

#### Scenario: Brand switcher parity is preserved

- **WHEN** the data-tier config test loads every brand
- **THEN** all brands' `REGISTERED_BRANDS` resolve to the same slug set
  (`fujifilm`, `canon`, `sony`, `nikon`, `panasonic`, `sigma`), and each slug has
  a matching brand directory

#### Scenario: Homepage search finds Sigma cameras

- **WHEN** a visitor types a Sigma camera's name into a homepage search slot
- **THEN** it is offered from the generated index, and picking it fetches
  `./sigma/data.js` and renders that camera's specs

#### Scenario: Sigma cameras are selectable on the cross-brand compare page

- **WHEN** a visitor opens `/compare/` and selects a `sigma:<slug>` camera
- **THEN** that camera renders in its slot alongside cameras from other brands
