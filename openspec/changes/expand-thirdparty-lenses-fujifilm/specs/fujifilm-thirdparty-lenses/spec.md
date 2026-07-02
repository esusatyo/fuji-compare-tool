## ADDED Requirements

### Requirement: Comprehensive third-party X-mount lens dataset

The system SHALL expand the existing Fujifilm X-mount third-party lens set in
`fujifilm/data.js` `LENSES` to comprehensive scope, adding the missing lines:
complete **Sigma** DC DN, **Viltrox** Air + missing AF primes, the **Zeiss**
Touit trio (discontinued), **Laowa** X-mount specialty lenses, **Meike** AF
primes, and an expanded representative set from **TTArtisan / 7Artisans** — while
retaining and re-verifying the pre-existing entries. Because the X mount is
**APS-C only**, full-frame-only third-party designs (e.g. Sigma DG DN Art,
Viltrox LAB full-frame) are out of scope. Each entry MUST carry a `manufacturer`
field, satisfy the existing lens schema, and set `focalLengthEquiv` per the 1.5×
crop.

#### Scenario: Every third-party lens passes schema validation

- **WHEN** `npm test` runs the data-tier suite
- **THEN** all Fujifilm third-party lenses (existing + newly added) validate with
  zero schema problems (positive USD RRP with six other currencies present, or
  `priceIncomplete`/USD-only for discontinued; optional valid 10-char `asin`;
  `https` `productUrl`/`imageUrl` when present)

#### Scenario: Only APS-C X-mount designs are included

- **WHEN** any third-party lens is entered
- **THEN** it has a confirmed X-mount (APS-C) version, and no full-frame-only
  design without an X version is included

#### Scenario: Existing entries are re-verified

- **WHEN** the expansion pass runs
- **THEN** each pre-existing third-party entry's price, `asin`, `productUrl`, and
  `imageUrl` are re-checked against current sources and updated where stale, with
  any newly discontinued lens flagged

### Requirement: Manufacturer grouping and card colours

The lenses SHALL be grouped in `LENS_DROPDOWN_GROUPS` by manufacturer — growing
the existing Sigma / Viltrox / Other groups and adding `── Zeiss ──`,
`── Laowa ──`, `── Meike ──`. Every `manufacturer` used SHALL have a
`MANUFACTURER_COLORS` entry (`Zeiss`, `Laowa`, `Meike` added as needed).

#### Scenario: New manufacturers render with distinct card colours

- **WHEN** a newly added third-party lens is shown in a slot
- **THEN** its card uses the `MANUFACTURER_COLORS` entry for its manufacturer,
  never the default fallback

#### Scenario: Referential integrity holds for existing and new groups

- **WHEN** the referential test runs
- **THEN** every id in the grown and new groups resolves to a defined lens, with
  no orphans and no duplicate ids, every existing entry remains in exactly one
  group, and every lens appears in exactly one dropdown group

#### Scenario: Every lens manufacturer has a colour

- **WHEN** the manufacturer-colour coverage test runs across all brands
- **THEN** every distinct lens `manufacturer` value has a matching
  `MANUFACTURER_COLORS` key

### Requirement: Purchase links and images resolve

Third-party lenses SHALL produce a working per-currency Buy link and a valid
product image (or a recorded placeholder gap).

#### Scenario: Buy link resolves per currency

- **WHEN** a third-party lens with an `asin` is shown in any currency
- **THEN** the engine generates an `amazon.<tld>/dp/<asin>` Buy link, and a lens
  without an `asin` falls back to an Amazon search link

#### Scenario: Product URLs and images are live

- **WHEN** the ad-hoc link check runs over the new and re-verified lenses
- **THEN** every `productUrl` and `imageUrl` returns a live response, and any
  placeholder-card lens is recorded as a known image gap
