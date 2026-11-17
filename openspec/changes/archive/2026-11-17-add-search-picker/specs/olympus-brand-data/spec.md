## MODIFIED Requirements

### Requirement: Olympus brand directory and registration

The system SHALL provide a self-contained `olympus/` brand consisting of
`olympus/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS` inside the `window.BRAND_DATA['olympus']` registration IIFE)
and `olympus/index.html` (loading `../engine.css`, `./data.js`, `../engine.js`),
such that `olympus/` renders through the shared engine.

Olympus SHALL be registered consistently across the multi-brand wiring: every
brand's `REGISTERED_BRANDS` MUST list the same seven brands including Olympus,
the generated root `index.html` MUST list `olympus` in its camera search index
and its brand-data fetch list,
`compare/index.html` MUST load `../olympus/data.js`, and
`scripts/generate-seo.js` `BRAND_CARD_ACCENTS` MUST carry an Olympus stripe
colour distinct from Panasonic's blue.

`engine.js` `MANUFACTURER_COLORS` already contains `OM System`, `Panasonic`,
`Sigma`, `Laowa` and `Voigtländer` entries and MUST be reused unchanged.

#### Scenario: Olympus page loads and renders

- **WHEN** a visitor opens `olympus/index.html`
- **THEN** the engine renders the Olympus camera comparison using `BRAND_CONFIG`,
  the brand switcher lists Olympus as the selected brand, and no script errors occur

#### Scenario: Brand switcher parity is preserved

- **WHEN** the data-tier config test loads every brand
- **THEN** all brands' `REGISTERED_BRANDS` resolve to the same slug set
  (`fujifilm`, `canon`, `sony`, `nikon`, `panasonic`, `sigma`, `olympus`), and
  each slug has a matching brand directory

#### Scenario: Homepage search finds Olympus cameras

- **WHEN** a visitor types a Olympus camera's name into a homepage search slot
- **THEN** it is offered from the generated index, and picking it fetches
  `./olympus/data.js` and renders that camera's specs

#### Scenario: Olympus cameras are selectable on the cross-brand compare page

- **WHEN** a visitor opens `/compare/` and selects an `olympus:<slug>` camera
- **THEN** that camera renders in its slot alongside cameras from other brands
