## MODIFIED Requirements

### Requirement: Sony brand directory and registration

The system SHALL provide a self-contained `sony/` brand consisting of
`sony/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS`) and `sony/index.html` (loading `../engine.css`,
`./data.js`, and `../engine.js`), such that `sony/` loads and renders through
the shared engine with no engine changes required to display a brand page.

Sony SHALL be registered consistently across the multi-brand wiring: every
brand's `REGISTERED_BRANDS` (Fujifilm, Canon, Sony) MUST list the same set of
brands including Sony, the generated root `index.html` MUST list `sony` in its camera search index
and its brand-data fetch list, and `engine.js` `MANUFACTURER_COLORS` MUST include a `Sony`
entry.

#### Scenario: Sony page loads and renders

- **WHEN** a visitor opens `sony/index.html`
- **THEN** the engine renders the Sony camera comparison using `BRAND_CONFIG`,
  the brand switcher lists Sony as the selected brand, and no script errors occur

#### Scenario: Brand switcher parity is preserved

- **WHEN** the data-tier config test loads every brand
- **THEN** all brands' `REGISTERED_BRANDS` resolve to the same slug set
  (`fujifilm`, `canon`, `sony`), and each slug has a matching brand directory

#### Scenario: Homepage search finds Sony cameras

- **WHEN** a visitor types a Sony camera's name into a homepage search slot
- **THEN** it is offered from the generated index, and picking it fetches
  `./sony/data.js` and renders that camera's specs
