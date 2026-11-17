## MODIFIED Requirements

### Requirement: Panasonic brand directory and registration

The system SHALL provide a self-contained `panasonic/` brand consisting of
`panasonic/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS`) and `panasonic/index.html` (loading `../engine.css`,
`./data.js`, and `../engine.js`), such that `panasonic/` loads and renders
through the shared engine with no engine changes required to display a brand
page.

Panasonic SHALL be registered consistently across the multi-brand wiring: every
brand's `REGISTERED_BRANDS` (Fujifilm, Canon, Sony, Nikon, Panasonic) MUST list
the same set of brands including Panasonic, the generated root `index.html` MUST list `panasonic` in its camera search index
and its brand-data fetch list, and `engine.js` `MANUFACTURER_COLORS`
MUST include a `Panasonic` entry.

#### Scenario: Panasonic page loads and renders

- **WHEN** a visitor opens `panasonic/index.html`
- **THEN** the engine renders the Panasonic camera comparison using
  `BRAND_CONFIG`, the brand switcher lists Panasonic as the selected brand, and
  no script errors occur

#### Scenario: Brand switcher parity is preserved

- **WHEN** the data-tier config test loads every brand
- **THEN** all brands' `REGISTERED_BRANDS` resolve to the same slug set
  (`fujifilm`, `canon`, `sony`, `nikon`, `panasonic`), and each slug has a
  matching directory

#### Scenario: Homepage search finds Panasonic cameras

- **WHEN** a visitor types a Panasonic camera's name into a homepage search slot
- **THEN** it is offered from the generated index, and picking it fetches
  `./panasonic/data.js` and renders that camera's specs
