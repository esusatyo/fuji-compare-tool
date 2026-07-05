## ADDED Requirements

### Requirement: Comprehensive third-party Z-mount lens dataset

The system SHALL add currently-shipping third-party native Nikon Z-mount lenses
to `nikon/data.js` `LENSES`, covering — at comprehensive scope — AF lenses from
**Sigma** (DC DN APS-C + DG DN Contemporary/Art full-frame, Z-licensed 2023+),
**Tamron** (Di III Z), **Viltrox** (AF/LAB/Air), and **Samyang** (AF), plus
notable **Voigtländer** (native Z) and **Laowa** lenses and a representative
selection from **TTArtisan / 7Artisans / Meike / Yongnuo**. Each entry MUST carry
a `manufacturer` field and satisfy the existing lens schema.

Each entry SHALL be **Z-mount-specific** (weight, length, price, `asin`,
`productUrl`, `imageUrl` describe the Z version), independent of same-design
copies for other mounts. A third-party lens that Nikon also sells rebadged as a
first-party Nikkor MUST NOT be double-listed.

#### Scenario: Every third-party lens passes schema validation

- **WHEN** `npm test` runs the data-tier suite
- **THEN** all newly added third-party Nikon lenses validate with zero schema
  problems (positive USD RRP with six other currencies present, or
  `priceIncomplete`/USD-only where genuinely unavailable; optional valid 10-char
  `asin`; `https` `productUrl`/`imageUrl` when present)

#### Scenario: Data is reference-verified and de-duplicated

- **WHEN** any third-party lens is entered
- **THEN** its RRP, key specs, `productUrl`, `asin`, and `imageUrl` are
  cross-checked against ≥2 reputable sources, unconfirmable data is left `null`,
  and no lens duplicates a first-party Nikkor rebadge

### Requirement: Manufacturer grouping and card colours

The third-party lenses SHALL be grouped in `LENS_DROPDOWN_GROUPS` by
manufacturer, appended after the existing Nikon groups, in the order Sigma,
Tamron, Viltrox, Samyang, Voigtländer, Laowa, then `── Other ──`
(TTArtisan/7Artisans/Meike/Yongnuo). Every `manufacturer` used SHALL have a
`MANUFACTURER_COLORS` entry (`Laowa`, `Meike`, `Yongnuo` added as needed).

#### Scenario: New manufacturers render with distinct card colours

- **WHEN** a third-party lens is shown in a slot
- **THEN** its card uses the `MANUFACTURER_COLORS` entry for its manufacturer,
  never the default fallback

#### Scenario: Referential integrity holds for the new groups

- **WHEN** the referential test runs
- **THEN** every id in the new groups resolves to a defined lens, with no orphans
  and no duplicate ids, and every lens appears in exactly one dropdown group

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

- **WHEN** the ad-hoc link check runs over the new lenses
- **THEN** every `productUrl` and `imageUrl` returns a live response, and any
  placeholder-card lens is recorded as a known image gap
