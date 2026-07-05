# Panasonic Third-Party Lenses

### Requirement: Comprehensive third-party L-mount and MFT lens dataset

The system SHALL add third-party lenses to `panasonic/data.js` `LENSES` for both
Panasonic mounts:

- **L-mount (full-frame):** **Sigma** (full DG DN Contemporary/Art line, native
  L), representative **Leica** SL, **Voigtländer**, **Samyang**, **Laowa**, and
  **TTArtisan / 7Artisans / Astrhori**.
- **MFT:** **OM System / Olympus** (M.Zuiko PRO + popular standard/primes),
  **Sigma** (DN / DC DN for MFT), **Voigtländer** (Nokton f/0.95), **Laowa**,
  **Sirui** (Sniper AF), and **7Artisans / TTArtisan / Meike / Yongnuo**.

Each entry MUST carry a `manufacturer` field, satisfy the existing lens schema,
and set `focalLengthEquiv` correctly (2.0× crop for MFT, native for L-mount). No
`mount` schema field is introduced — mount is conveyed by dropdown group label
and `focalLengthEquiv`.

#### Scenario: Every third-party lens passes schema validation

- **WHEN** `npm test` runs the data-tier suite
- **THEN** all newly added third-party Panasonic lenses (both mounts) validate
  with zero schema problems (positive USD RRP with six other currencies present,
  or `priceIncomplete`/USD-only where genuinely unavailable; optional valid
  10-char `asin`; `https` `productUrl`/`imageUrl` when present)

#### Scenario: MFT crop factor is applied

- **WHEN** an MFT third-party lens is validated
- **THEN** its `focalLengthEquiv` reflects the 2.0× crop, and L-mount entries use
  native full-frame focal lengths

#### Scenario: Data is reference-verified

- **WHEN** any third-party lens is entered
- **THEN** its RRP, key specs, `productUrl`, `asin`, and `imageUrl` are
  cross-checked against ≥2 reputable sources, and unconfirmable data is left
  `null`

### Requirement: Mount-then-manufacturer grouping and card colours

The third-party lenses SHALL be grouped in `LENS_DROPDOWN_GROUPS` **by mount then
manufacturer**, with each group label naming its mount (e.g.
`── Sigma (L-mount) ──`, `── OM System (MFT) ──`), placed after the corresponding
first-party LUMIX S / LUMIX G groups. Every `manufacturer` used SHALL have a
`MANUFACTURER_COLORS` entry (`OM System`, `Leica`, `Laowa`, `Sirui`, `Meike`,
`Yongnuo`, `Astrhori` added as needed).

#### Scenario: L-mount and MFT third-party lenses stay visually separated

- **WHEN** the lens dropdown renders for Panasonic
- **THEN** L-mount third-party groups and MFT third-party groups are distinct and
  mount-labelled, mirroring the first-party LUMIX S / LUMIX G separation

#### Scenario: Referential integrity holds with no cross-mount slug collisions

- **WHEN** the referential test runs
- **THEN** every id in the new groups resolves to a defined lens, no id is
  duplicated across groups (including no collision between the L and MFT versions
  of a same-focal Sigma design), and every lens appears in exactly one group

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
