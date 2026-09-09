# sigma-brand-data Specification

## Purpose
TBD - created by archiving change add-sigma-brand. Update Purpose after archive.
## Requirements
### Requirement: Sigma brand directory and registration

The system SHALL provide a self-contained `sigma/` brand consisting of
`sigma/data.js` (defining `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`,
`CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, and
`REGISTERED_BRANDS` inside the `window.BRAND_DATA['sigma']` registration IIFE)
and `sigma/index.html` (loading `../engine.css`, `./data.js`, `../engine.js`),
such that `sigma/` renders through the shared engine.

Sigma SHALL be registered consistently across the multi-brand wiring: every
brand's `REGISTERED_BRANDS` MUST list the same six brands including Sigma, the
root `index.html` redirector's `VALID_BRANDS` MUST include `'sigma'`,
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

#### Scenario: Root redirector honours Sigma

- **WHEN** `localStorage['brand']` is `'sigma'`
- **THEN** the root `index.html` redirects to `./sigma/` (preserving any hash)

#### Scenario: Sigma cameras are selectable on the cross-brand compare page

- **WHEN** a visitor opens `/compare/` and selects a `sigma:<slug>` camera
- **THEN** that camera renders in its slot alongside cameras from other brands

### Requirement: Sigma camera dataset covers the non-DSLR lineup

The Sigma dataset SHALL cover every mirrorless and fixed-lens camera Sigma has
released — 18 bodies spanning L-Mount mirrorless (`BF`, `fp L`, `fp`), Foveon
SA-mount mirrorless (`sd Quattro`, `sd Quattro H`), and the Foveon fixed-lens
compacts (`dp` Quattro, `DP` Merrill, and the original `DP` line).

Sigma's six SA-mount DSLRs (`SD9` through `SD1 Merrill`) SHALL NOT be included.
Every brand on the site begins at its mirrorless system rather than the
company's camera history, and `lensType` across the existing dataset takes only
`'Interchangeable'` or `'Fixed'`; Sigma SHALL NOT become the sole exception.

To admit the three in-scope bodies released before 2010 (DP1 2008, DP2 2009,
DP1s 2009), the camera `year` validation floor in `tests/helpers/schema.js`
SHALL be lowered from `2010` to `2008`, matching the lens floor already defined
there.

Because Foveon sensors stack three photodiode layers and Sigma has historically
marketed the summed count, `sensorMP` SHALL record the **output image
resolution** the camera writes, not the summed photodiode count; the layer
structure SHALL be described in `sensorType`.

#### Scenario: Pre-2010 Sigma bodies validate

- **WHEN** the schema test validates the Sigma dataset
- **THEN** `dp1` (2008), `dp2` (2009) and `dp1s` (2009) all pass `year` validation

#### Scenario: No DSLR enters the dataset

- **WHEN** the Sigma camera dataset is inspected
- **THEN** no SA-mount DSLR body is present, and every camera's `lensType` is
  either `'Interchangeable'` or `'Fixed'`

#### Scenario: Foveon resolution is comparable to Bayer resolution

- **WHEN** a Foveon body is compared against a Bayer body on the `sensorMP` row
- **THEN** the Foveon body's value is its output image resolution, so
  winner-highlighting compares like with like

#### Scenario: Bodies without video or a viewfinder validate

- **WHEN** the schema test validates an early DP compact
- **THEN** `maxVideoRes` of `'None'`, `evfType` of `null`, and `ibis: false`
  all pass validation

### Requirement: Sigma lens dataset is scoped to L-Mount

The Sigma lens dataset SHALL contain only L-Mount Sigma lenses. Sigma SA-mount
DSLR lenses SHALL NOT be included, and the existing Sigma entries denormalized
into other brands' files (Canon RF, Fujifilm X, Nikon Z, Sony E, Panasonic MFT)
SHALL remain in those files unchanged.

Lenses ported from `panasonic/data.js` are the same physical L-Mount product and
MAY carry their specs, `asin`, `imageUrl` and `productUrl` across verbatim; each
ported entry MUST first be re-verified against Sigma's live catalogue.

The dataset SHALL be limited to full-frame (`DG`) L-Mount lenses; Sigma's APS-C
(`DC`) L-Mount lenses are out of scope for this change, since no Sigma body is
APS-C L-Mount. Every lens in scope therefore has a `focalLengthEquiv` equal to
its native focal length. An L-Mount copy of a lens that already exists in
another mount MUST use a distinct slug.

#### Scenario: No SA-mount glass is present

- **WHEN** the Sigma lens dataset is inspected
- **THEN** every lens is an L-Mount product

#### Scenario: Other brands' Sigma entries are untouched

- **WHEN** the change is applied
- **THEN** the Sigma lens entries in `canon/`, `fujifilm/`, `nikon/`, `sony/`
  and `panasonic/` `data.js` are unchanged, and no `mount` field is introduced

#### Scenario: A ported entry agrees with its Panasonic twin

- **WHEN** the same lens slug appears in both `panasonic/data.js` and
  `sigma/data.js` (both L-Mount, the same physical product)
- **THEN** the two entries agree on their mount-invariant specs — weight,
  length, diameter, elements, groups, blades, apertures, focal lengths and year

### Requirement: Sigma-specific spec section

`engine.js` `SPEC_SECTIONS` SHALL gain a section tagged `brand: 'sigma'`
surfacing the specs that distinguish Sigma bodies: Foveon generation
(`foveonGen`), shutter type (`shutterType`), internal storage
(`internalStorage`) and L-Log support (`lLog`). The section SHALL render on the
Sigma brand page via `BRAND_CONFIG.brandSections`, and on `/compare/` whenever a
selected camera is a Sigma body, with non-Sigma cameras' cells showing "—".

`tests/helpers/schema.js` SHALL validate these four fields under a
`brandSections.includes('sigma')` branch.

#### Scenario: The Foveon section renders only where relevant

- **WHEN** the Sigma brand page renders
- **THEN** the "Foveon & L-Mount" section is present
- **AND WHEN** another brand's page renders
- **THEN** that section is absent

#### Scenario: Mixed cross-brand comparison shows placeholders

- **WHEN** `/compare/` holds one Sigma body and one non-Sigma body
- **THEN** the Foveon section renders and the non-Sigma column shows "—"

### Requirement: Schema guards and same-mount drift are tested

The test suite SHALL cover `tests/helpers/schema.js` negatively, asserting that
`validateCamera` and `validateLens` return errors for out-of-range years (below
the floor and above the ceiling), missing required fields, `null` in
non-nullable fields, wrong-typed fields, a `type` outside `['Prime','Zoom']`, a
zoom whose `focalLengthMin` is not less than its `focalLengthMax`, a
non-positive USD price, and a malformed `asin`. It MUST also assert that a
known-good fixture returns zero errors, so the suite cannot pass by rejecting
everything.

This matters because the schema helper underpins every data-tier test yet has no
negative coverage today — nothing asserts it rejects anything, so this change's
`year` floor edit would otherwise be invisible to the suite.

The test suite SHALL also guard against same-mount drift: any lens slug present
in two brands declared to share a mount MUST agree on its mount-invariant
fields. That declaration SHALL be a table, so a future mount-sharing brand is
one line to add.

#### Scenario: The year floor still rejects out-of-range values

- **WHEN** a camera fixture declares `year: 2007` or `year: 2028`
- **THEN** `validateCamera` returns an error for that field

#### Scenario: A valid fixture is not rejected

- **WHEN** a known-good camera and lens fixture are validated
- **THEN** zero errors are returned

#### Scenario: Same-mount entries that drift are caught

- **WHEN** a lens slug appears in two brands declared to share a mount and their
  mount-invariant specs disagree
- **THEN** the drift test fails, naming the slug and the differing fields

### Requirement: Sigma data meets the project's sourcing and completeness bar

Every Sigma camera and lens entry MUST satisfy `tests/helpers/schema.js` and
pass the data-tier tests (`schema`, `config`, `completeness`, `referential`),
including a positive USD RRP, an optional valid 10-character `asin`, and
`productUrl`/`imageUrl` that are `https` when present. Current bodies MUST carry
all seven currencies; discontinued bodies MAY be USD-only.

Each datum SHALL be verified against at least two reputable sources before
entry, with sigma-global.com authoritative for Sigma's own products. Any item
without a freely-licensed image MUST be listed in `KNOWN_IMAGE_GAPS['sigma']`
rather than left silently null, and `RUN_LINK_TESTS=1 npm run test:links` MUST
pass before the PR.

#### Scenario: The full suite is green

- **WHEN** `npm test` runs
- **THEN** all data-tier and logic-tier tests pass with Sigma present

#### Scenario: Image gaps are documented, not silent

- **WHEN** a Sigma item has no freely-licensed image
- **THEN** its id appears in `KNOWN_IMAGE_GAPS['sigma']`, and the completeness
  test fails if that item later gains an `imageUrl`

