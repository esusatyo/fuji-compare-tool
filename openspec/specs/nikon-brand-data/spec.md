# Nikon Brand Data

### Requirement: Nikon brand directory and registration

The system SHALL provide a self-contained `nikon/` brand consisting of
`nikon/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS`) and `nikon/index.html` (loading `../engine.css`,
`./data.js`, and `../engine.js`), such that `nikon/` loads and renders through
the shared engine with no engine changes required to display a brand page.

Nikon SHALL be registered consistently across the multi-brand wiring: every
brand's `REGISTERED_BRANDS` (Fujifilm, Canon, Sony, Nikon) MUST list the same
set of brands including Nikon, the root `index.html` redirector's `VALID_BRANDS`
MUST include `'nikon'`, and `engine.js` `MANUFACTURER_COLORS` MUST include a
`Nikon` entry.

#### Scenario: Nikon page loads and renders

- **WHEN** a visitor opens `nikon/index.html`
- **THEN** the engine renders the Nikon camera comparison using `BRAND_CONFIG`,
  the brand switcher lists Nikon as the selected brand, and no script errors occur

#### Scenario: Brand switcher parity is preserved

- **WHEN** the data-tier config test loads every brand
- **THEN** all brands' `REGISTERED_BRANDS` resolve to the same slug set
  (`fujifilm`, `canon`, `sony`, `nikon`), and each slug has a matching directory

#### Scenario: Root redirector honours Nikon

- **WHEN** `localStorage['brand']` is `'nikon'`
- **THEN** the root `index.html` redirects to `./nikon/` (preserving any hash)

### Requirement: Nikon camera and lens dataset is complete and valid

The Nikon dataset SHALL comprehensively cover Nikon Z-mount cameras (current and
notable discontinued bodies across full-frame (FX), APS-C (DX), and the retro
Zf/Zfc line) and Nikon first-party NIKKOR Z lenses. Every camera and lens entry
MUST satisfy the existing data schema (`tests/helpers/schema.js`) and pass the
data-tier tests (`schema`, `config`, `completeness`, `referential`), including:
a positive USD RRP with the other six currencies present (or `null` only where
genuinely unavailable, e.g. discontinued bodies), an optional valid 10-character
`asin`, and optional `productUrl`/`imageUrl` that, when present, are `https` URLs.

Each datum (RRP, spec value, `productUrl`, `asin`, `imageUrl`) SHALL be verified
against at least two reputable sources (Nikon official, DPReview, major retailer,
Amazon) before entry; regional prices that cannot be confirmed MAY be derived
and MUST then be flagged `priceIncomplete: true`.

#### Scenario: Every Nikon entry passes schema validation

- **WHEN** `npm test` runs the data-tier suite
- **THEN** all Nikon cameras and lenses validate with zero schema problems

#### Scenario: Referential integrity holds for Nikon

- **WHEN** the referential test runs
- **THEN** every id in Nikon's `CAMERA_ORDER`, `DROPDOWN_GROUPS`,
  `LENS_DROPDOWN_GROUPS`, and `defaultSelected` resolves to a defined
  camera/lens, with no orphans or duplicates

#### Scenario: Buy links resolve per currency

- **WHEN** a Nikon item with an `asin` is shown in any currency
- **THEN** the engine generates an Amazon product Buy link for that ASIN, and
  for items without an `asin` it falls back to an Amazon search link

### Requirement: Nikon-specific spec section

The system SHALL surface Nikon-distinctive specifications via a Nikon-tagged spec
section (`brand: 'nikon'`) added to `engine.js` `SPEC_SECTIONS`, rendered only
when `'nikon'` is present in `BRAND_CONFIG.brandSections`. The corresponding
Nikon camera fields MUST be validated in `tests/helpers/schema.js` under the
`brandSections.includes('nikon')` branch.

#### Scenario: Nikon section renders on Nikon pages only

- **WHEN** the Nikon comparison table renders
- **THEN** the Nikon-specific section (e.g. N-RAW, Pixel Shift, Pre-Release
  Capture) appears, and the same section does NOT appear on Fujifilm, Canon, or
  Sony pages

#### Scenario: Nikon brand fields are validated

- **WHEN** the schema test validates Nikon cameras
- **THEN** the Nikon-specific fields are required/typed for Nikon entries and are
  not required for other brands
