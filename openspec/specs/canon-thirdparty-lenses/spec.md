# Canon Third-Party Lenses

### Requirement: Currently-shipping third-party RF/RF-S lens dataset

The system SHALL add currently-shipping third-party RF / RF-S lenses to
`canon/data.js` `LENSES`, covering — at comprehensive-but-honest scope — AF
lenses from **Sigma** (RF-S DC DN APS-C + any full-frame RF), **Tamron** (RF-S
APS-C + any full-frame RF), and **Viltrox** (RF AF), plus **Samyang / Yongnuo**
AF where available and notable **TTArtisan / 7Artisans / Laowa / Meike** AF and
manual-focus RF primes. Each entry MUST carry a `manufacturer` field, satisfy the
existing lens schema, and set `focalLengthEquiv` correctly (1.6× crop for RF-S
APS-C, native for full-frame RF).

Because Canon only opened RF/RF-S to third-party AF in 2024, each entry's **RF/RF-S
availability MUST be confirmed** at entry — lenses offered only in other mounts
are out of scope. The resulting set is expected to be the smallest of the five
brands, which is correct and MUST NOT be padded with unavailable lenses.

#### Scenario: Every third-party lens passes schema validation

- **WHEN** `npm test` runs the data-tier suite
- **THEN** all newly added third-party Canon lenses validate with zero schema
  problems (positive USD RRP with six other currencies present, or
  `priceIncomplete` where unavailable; optional valid 10-char `asin`; `https`
  `productUrl`/`imageUrl` when present)

#### Scenario: RF-S crop factor is applied

- **WHEN** an RF-S APS-C third-party lens is validated
- **THEN** its `focalLengthEquiv` reflects the 1.6× Canon APS-C crop, and
  full-frame RF entries use native focal lengths

#### Scenario: Only RF/RF-available lenses are listed

- **WHEN** any third-party lens is entered
- **THEN** its availability in RF or RF-S has been confirmed against ≥2 reputable
  sources, and no lens available only in E/X/Z mount is included

### Requirement: Manufacturer grouping and card colours

The third-party lenses SHALL be grouped in `LENS_DROPDOWN_GROUPS` by
manufacturer, appended after the existing Canon groups, in the order Sigma,
Tamron, Viltrox, then `── Other ──` (Samyang/Yongnuo/TTArtisan/7Artisans/Laowa/
Meike). Every `manufacturer` used SHALL have a `MANUFACTURER_COLORS` entry
(`Laowa`, `Meike`, `Yongnuo` added as needed).

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
