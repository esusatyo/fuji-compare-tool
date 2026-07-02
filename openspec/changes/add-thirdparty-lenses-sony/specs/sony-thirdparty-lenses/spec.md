## ADDED Requirements

### Requirement: Comprehensive third-party E/FE lens dataset

The system SHALL add third-party native Sony E / FE-mount lenses to
`sony/data.js` `LENSES`, covering — at comprehensive scope — current AF lenses
from **Sigma** (DC DN APS-C and DG DN Contemporary/Art full-frame), **Tamron**
(Di III APS-C and full-frame), **Samyang/Rokinon** (AF line), and **Viltrox**
(AF/LAB/Air), plus notable manual/specialty lenses from **Zeiss**
(Batis/Loxia/Touit, including discontinued), **Voigtländer**, and **Laowa**, and
a representative selection from **TTArtisan / 7Artisans / Meike**. Each lens
entry MUST carry a `manufacturer` field and otherwise satisfy the existing lens
schema (`tests/helpers/schema.js`).

Each entry SHALL be **Sony-mount-specific**: its weight, length, price, `asin`,
`productUrl`, and `imageUrl` describe the E/FE version of the lens, independent of
any same-design copy sold for other mounts. No shared cross-mount catalogue,
`mount` field, or cross-mount UI is introduced.

#### Scenario: Every third-party lens passes schema validation

- **WHEN** `npm test` runs the data-tier suite
- **THEN** all newly added third-party Sony lenses validate with zero schema
  problems, including a positive USD RRP with the other six currencies present
  (or `priceIncomplete: true` / USD-only where genuinely unavailable), an
  optional valid 10-character `asin`, and `https` `productUrl`/`imageUrl` when
  present

#### Scenario: Data is reference-verified

- **WHEN** any third-party lens is entered
- **THEN** its RRP, key specs, `productUrl`, `asin`, and `imageUrl` have been
  cross-checked against at least two reputable sources (manufacturer official,
  DPReview/spec sheet, major retailer, Amazon), and any datum that cannot be
  confirmed is left `null` (never guessed) or flagged `priceIncomplete: true`

### Requirement: Manufacturer grouping and card colours

The third-party lenses SHALL be grouped in `LENS_DROPDOWN_GROUPS` by
manufacturer, appended after the existing Sony lens groups, in the order Sigma,
Tamron, Samyang, Viltrox, Zeiss, Voigtländer, Laowa, then `── Other ──`
(TTArtisan/7Artisans/Meike). Every `manufacturer` used SHALL have a
`MANUFACTURER_COLORS` entry in `engine.js`.

#### Scenario: New manufacturers render with distinct card colours

- **WHEN** a third-party lens is shown in a comparison slot
- **THEN** its card uses the `MANUFACTURER_COLORS` entry for its manufacturer
  (never the default fallback), with `Zeiss`, `Laowa`, and `Meike` added
  alongside the existing entries

#### Scenario: Referential integrity holds for the new groups

- **WHEN** the referential test runs
- **THEN** every id in the new `LENS_DROPDOWN_GROUPS` groups resolves to a
  defined lens in `LENSES`, with no orphans and no duplicate ids across groups,
  and every lens in `LENSES` appears in exactly one dropdown group

#### Scenario: Every lens manufacturer has a colour

- **WHEN** the manufacturer-colour coverage test runs across all brands
- **THEN** every distinct lens `manufacturer` value has a matching
  `MANUFACTURER_COLORS` key

### Requirement: Purchase links and images resolve

Third-party lenses SHALL produce a working per-currency Buy link and a valid
product image (or a recorded placeholder gap).

#### Scenario: Buy link resolves per currency

- **WHEN** a third-party lens with an `asin` is shown in any currency
- **THEN** the engine generates an Amazon product Buy link
  (`amazon.<tld>/dp/<asin>`) for that currency, and a lens without an `asin`
  falls back to an Amazon search link built from the brand + lens name

#### Scenario: Product URLs and images are live

- **WHEN** the ad-hoc link check runs over the new lenses
- **THEN** every `productUrl` and `imageUrl` returns a live (non-404/410)
  response, and any lens left on the engine placeholder card is recorded as a
  known image gap
