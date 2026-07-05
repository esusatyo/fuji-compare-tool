# Panasonic Brand Data

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
the same set of brands including Panasonic, the root `index.html` redirector's
`VALID_BRANDS` MUST include `'panasonic'`, and `engine.js` `MANUFACTURER_COLORS`
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

#### Scenario: Root redirector honours Panasonic

- **WHEN** `localStorage['brand']` is `'panasonic'`
- **THEN** the root `index.html` redirects to `./panasonic/` (preserving any
  hash)

### Requirement: Panasonic camera and lens dataset is complete and valid

The Panasonic dataset SHALL cover Panasonic Lumix cameras across both systems —
full-frame L-mount (Lumix S) and Micro Four Thirds (Lumix G/GH) — current and
notable discontinued bodies, and Panasonic first-party lenses for both mounts
(LUMIX S for L-mount, LUMIX G for MFT). Every camera and lens entry MUST satisfy
the existing data schema (`tests/helpers/schema.js`) and pass the data-tier
tests (`schema`, `config`, `completeness`, `referential`), including: a positive
USD RRP with the other six currencies present (or `null` only where genuinely
unavailable, e.g. discontinued bodies), an optional valid 10-character `asin`,
and optional `productUrl`/`imageUrl` that, when present, are `https` URLs.

Each datum (RRP, spec value, `productUrl`, `asin`, `imageUrl`) SHALL be verified
against at least two reputable sources (Panasonic official, DPReview, major
retailer, Amazon) before entry; regional prices that cannot be confirmed MAY be
derived and MUST then be flagged `priceIncomplete: true`.

#### Scenario: Every Panasonic entry passes schema validation

- **WHEN** `npm test` runs the data-tier suite
- **THEN** all Panasonic cameras and lenses validate with zero schema problems

#### Scenario: Referential integrity holds for Panasonic

- **WHEN** the referential test runs
- **THEN** every id in Panasonic's `CAMERA_ORDER`, `DROPDOWN_GROUPS`,
  `LENS_DROPDOWN_GROUPS`, and `defaultSelected` resolves to a defined
  camera/lens, with no orphans or duplicates

#### Scenario: Buy links resolve per currency

- **WHEN** a Panasonic item with an `asin` is shown in any currency
- **THEN** the engine generates an Amazon product Buy link for that ASIN, and
  for items without an `asin` it falls back to an Amazon search link

### Requirement: Panasonic-specific spec section

The system SHALL surface Panasonic-distinctive specifications via a
Panasonic-tagged spec section (`brand: 'panasonic'`) added to `engine.js`
`SPEC_SECTIONS`, rendered only when `'panasonic'` is present in
`BRAND_CONFIG.brandSections`. The corresponding Panasonic camera fields MUST be
validated in `tests/helpers/schema.js` under the
`brandSections.includes('panasonic')` branch.

#### Scenario: Panasonic section renders on Panasonic pages only

- **WHEN** the Panasonic comparison table renders
- **THEN** the Panasonic-specific section (e.g. V-Log, Dual Native ISO, Open
  Gate, internal ProRes) appears, and the same section does NOT appear on
  Fujifilm, Canon, Sony, or Nikon pages

#### Scenario: Panasonic brand fields are validated

- **WHEN** the schema test validates Panasonic cameras
- **THEN** the Panasonic-specific fields are required/typed for Panasonic
  entries and are not required for other brands
