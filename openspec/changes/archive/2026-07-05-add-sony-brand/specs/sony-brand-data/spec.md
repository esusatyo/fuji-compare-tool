## ADDED Requirements

### Requirement: Sony brand directory and registration

The system SHALL provide a self-contained `sony/` brand consisting of
`sony/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS`) and `sony/index.html` (loading `../engine.css`,
`./data.js`, and `../engine.js`), such that `sony/` loads and renders through
the shared engine with no engine changes required to display a brand page.

Sony SHALL be registered consistently across the multi-brand wiring: every
brand's `REGISTERED_BRANDS` (Fujifilm, Canon, Sony) MUST list the same set of
brands including Sony, the root `index.html` redirector's `VALID_BRANDS` MUST
include `'sony'`, and `engine.js` `MANUFACTURER_COLORS` MUST include a `Sony`
entry.

#### Scenario: Sony page loads and renders

- **WHEN** a visitor opens `sony/index.html`
- **THEN** the engine renders the Sony camera comparison using `BRAND_CONFIG`,
  the brand switcher lists Sony as the selected brand, and no script errors occur

#### Scenario: Brand switcher parity is preserved

- **WHEN** the data-tier config test loads every brand
- **THEN** all brands' `REGISTERED_BRANDS` resolve to the same slug set
  (`fujifilm`, `canon`, `sony`), and each slug has a matching brand directory

#### Scenario: Root redirector honours Sony

- **WHEN** `localStorage['brand']` is `'sony'`
- **THEN** the root `index.html` redirects to `./sony/` (preserving any hash)

### Requirement: Sony camera and lens dataset is complete and valid

The Sony dataset SHALL comprehensively cover Sony E-mount cameras (current and
notable discontinued bodies across full-frame, APS-C, Cinema, and ZV lines) and
Sony first-party FE/E lenses. Every camera and lens entry MUST satisfy the
existing data schema (`tests/helpers/schema.js`) and pass the data-tier tests
(`schema`, `config`, `completeness`, `referential`), including: a positive USD
RRP with the other six currencies present (or `null` only where genuinely
unavailable, e.g. discontinued bodies), an optional valid 10-character `asin`,
and optional `productUrl`/`imageUrl` that, when present, are `https` URLs.

Each datum (RRP, spec value, `productUrl`, `asin`, `imageUrl`) SHALL be verified
against at least two reputable sources (Sony official, DPReview, major retailer,
Amazon) before entry; regional prices that cannot be confirmed MAY be derived
and MUST then be flagged `priceIncomplete: true`.

#### Scenario: Every Sony entry passes schema validation

- **WHEN** `npm test` runs the data-tier suite
- **THEN** all Sony cameras and lenses validate with zero schema problems

#### Scenario: Referential integrity holds for Sony

- **WHEN** the referential test runs
- **THEN** every id in Sony's `CAMERA_ORDER`, `DROPDOWN_GROUPS`,
  `LENS_DROPDOWN_GROUPS`, and `defaultSelected` resolves to a defined
  camera/lens, with no orphans or duplicates

#### Scenario: Buy links resolve per currency

- **WHEN** a Sony item with an `asin` is shown in any currency
- **THEN** the engine generates an Amazon product Buy link for that ASIN, and
  for items without an `asin` it falls back to an Amazon search link

### Requirement: Sony-specific spec section

The system SHALL surface Sony-distinctive specifications via a Sony-tagged spec
section (`brand: 'sony'`) added to `engine.js` `SPEC_SECTIONS`, rendered only
when `'sony'` is present in `BRAND_CONFIG.brandSections`. The corresponding
Sony camera fields MUST be validated in `tests/helpers/schema.js` under the
`brandSections.includes('sony')` branch.

#### Scenario: Sony section renders on Sony pages only

- **WHEN** the Sony comparison table renders
- **THEN** the Sony-specific section (e.g. Log/Picture Profile, AI AF) appears,
  and the same section does NOT appear on Fujifilm or Canon pages

#### Scenario: Sony brand fields are validated

- **WHEN** the schema test validates Sony cameras
- **THEN** the Sony-specific fields are required/typed for Sony entries and are
  not required for other brands
