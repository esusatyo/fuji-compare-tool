## ADDED Requirements

### Requirement: Olympus brand directory and registration

The system SHALL provide a self-contained `olympus/` brand consisting of
`olympus/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS` inside the `window.BRAND_DATA['olympus']` registration IIFE)
and `olympus/index.html` (loading `../engine.css`, `./data.js`, `../engine.js`),
such that `olympus/` renders through the shared engine.

Olympus SHALL be registered consistently across the multi-brand wiring: every
brand's `REGISTERED_BRANDS` MUST list the same seven brands including Olympus,
the root `index.html` redirector's `VALID_BRANDS` MUST include `'olympus'`,
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

#### Scenario: Root redirector honours Olympus

- **WHEN** `localStorage['brand']` is `'olympus'`
- **THEN** the root `index.html` redirects to `./olympus/` (preserving any hash)

#### Scenario: Olympus cameras are selectable on the cross-brand compare page

- **WHEN** a visitor opens `/compare/` and selects an `olympus:<slug>` camera
- **THEN** that camera renders in its slot alongside cameras from other brands

### Requirement: Olympus camera dataset covers the Micro Four Thirds mirrorless lineage

The Olympus dataset SHALL cover the Micro Four Thirds mirrorless bodies Olympus
and OM Digital Solutions have released, spanning the PEN line (`E-P`, `E-PL`,
`E-PM`, `PEN-F`), the OM-D line (`E-M1`, `E-M1X`, `E-M5`, `E-M10`) and the
current OM System bodies (`OM-1`, `OM-1 Mark II`, `OM-5`, `OM-5 Mark II`,
`OM-3`).

Olympus's Four Thirds DSLRs (`E-1` through `E-5`) SHALL NOT be included. Every
brand on the site begins at its mirrorless system rather than the company's
camera history.

The brand SHALL be presented under the single name `Olympus` covering both the
Olympus and OM System eras, because the mount, lens line and body lineage are
continuous across the 2021 ownership change, and `BRAND_CONFIG.heroCamera` MUST
resolve to a current OM System body.

#### Scenario: DSLR bodies are absent

- **WHEN** the data tier loads `olympus/data.js`
- **THEN** no camera in `CAMERAS` is a Four Thirds DSLR, and every camera
  declares `mount: 'mft'`

#### Scenario: Hero camera is current

- **WHEN** `tests/data/config.test.js` validates `BRAND_CONFIG.heroCamera`
- **THEN** it resolves to a camera in `CAMERAS` whose `discontinued` is `false`

### Requirement: Olympus declares the shared Micro Four Thirds mount identically

Every Olympus camera and lens SHALL declare `mount: 'mft'`, and
`BRAND_CONFIG.mounts` SHALL be exactly
`[{ id: 'mft', label: 'Micro Four Thirds' }]` — the same id and label Panasonic
declares, so that a mount id means one thing site-wide and the shared "Lens
Mount" spec row resolves correctly on the cross-brand compare page.

Lens `focalLengthEquiv` values SHALL apply the 2.0× Micro Four Thirds crop.

#### Scenario: Mount ids agree across brands

- **WHEN** `tests/data/mounts.test.js` compares every brand's declared mounts
- **THEN** `mft` carries an identical label in both `panasonic` and `olympus`,
  and every declared mount is used by at least one item

### Requirement: Shared Micro Four Thirds lenses agree across brands

The `SAME_MOUNT_BRANDS` list in `tests/data/shared-mount.test.js` SHALL include
`['panasonic', 'olympus', 'Micro Four Thirds']`, because Micro Four Thirds
lenses are denormalized into both `panasonic/data.js` and `olympus/data.js`
while describing one physical product.

Every lens id present in both files MUST agree on all invariant optic fields
(name, manufacturer, line, type, focal lengths and equivalence, apertures,
elements, groups, blades, weight, length, diameter, filter thread, minimum focus
distance, maximum magnification, AF type, weather sealing, OIS and stops, year,
discontinued) and on `prices.USD`.

Listing-level fields — `asin`, `productUrl`, `imageUrl`, `imageCredit`,
`imageSource` and regional prices — MAY legitimately differ between the two
files and SHALL NOT be constrained.

First-party Olympus lenses SHALL carry `manufacturer: 'OM System'`, matching the
entries already in `panasonic/data.js`, so that the shared-mount guard and the
ASIN-sharing guard in `tests/data/links-offline.test.js` both hold.

#### Scenario: A shared lens drifts

- **WHEN** a Micro Four Thirds lens present in both brands has a different
  `weight`, `length` or `prices.USD` in each file
- **THEN** the shared-mount test fails and names the field and both values

#### Scenario: Listing fields may differ

- **WHEN** a shared lens has a different `asin` or `productUrl` in each file
- **THEN** the shared-mount test still passes

### Requirement: Olympus-specific computational photography spec section

`engine.js` `SPEC_SECTIONS` SHALL include a section tagged `brand: 'olympus'`
labelled "Computational Photography", surfacing `liveND`, `hiResShot`,
`proCapture` and `liveComposite`, and rendering only when `'olympus'` is present
in `BRAND_CONFIG.brandSections`.

`tests/helpers/schema.js` SHALL validate those fields under a
`brandSections.includes('olympus')` branch: `liveND` and `hiResShot` as nullable
strings, `proCapture` and `liveComposite` as booleans.

`hiResShot` SHALL be stored as a string rather than a number, because the tripod
and handheld output resolutions differ and a numeric value would be
winner-highlighted as though it were directly comparable to another brand's
sensor resolution.

#### Scenario: Section renders only for Olympus

- **WHEN** a visitor views the Olympus camera comparison
- **THEN** the Computational Photography section renders

- **WHEN** a visitor views any other brand's camera comparison
- **THEN** that section does not render

#### Scenario: Foreign cameras on the compare page show placeholders

- **WHEN** an Olympus camera and a non-Olympus camera are compared on `/compare/`
- **THEN** the Computational Photography section renders and the non-Olympus
  camera's cells show "—"

### Requirement: Olympus lens coverage spans first-party and third-party Micro Four Thirds glass

The Olympus lens dataset SHALL carry the current first-party M.Zuiko catalogue,
including every current PRO lens, and SHALL additionally carry the
third-party Micro Four Thirds glass already present in `panasonic/data.js` —
Panasonic's Lumix G / Leica DG lenses, Sigma's DC DN primes, and the Laowa and
Voigtländer manual-focus specialty lenses — entered under `── <Maker> ──`
dropdown group labels.

Discontinued M.Zuiko lenses and Four Thirds (non-micro) lenses SHALL NOT be
included in this change.

Every lens SHALL appear in exactly one `LENS_DROPDOWN_GROUPS` group, and every
`manufacturer` value MUST resolve to an existing `MANUFACTURER_COLORS` key.

#### Scenario: Referential integrity holds

- **WHEN** the data tier validates `olympus/data.js`
- **THEN** every dropdown id resolves to a real lens, every lens appears in
  exactly one group, and every `manufacturer` has a `MANUFACTURER_COLORS` entry

#### Scenario: Image and price completeness

- **WHEN** the completeness test runs against Olympus
- **THEN** every camera and lens has an `imageUrl` or an entry in
  `KNOWN_IMAGE_GAPS['olympus']`, every current camera is priced in all seven
  currencies, and every current lens is either fully priced or flagged
  `priceIncomplete: true`
