## ADDED Requirements

### Requirement: Catalogue-complete third-party RF lenses

The Canon dataset SHALL include every RF and RF-S lens currently listed in the
in-scope makers' own catalogues, except out-of-scope designs and lenses whose
non-nullable specs cannot be sourced, which MUST be logged with the reason in
the change's PROGRESS.md instead of being entered with guessed values.

#### Scenario: Entered lenses are fully sourced

- **WHEN** a lens from this pass is added to `canon/data.js`
- **THEN** it carries `mount:'rf'`, a `specSources` citation, a `priceSource`
  for its USD price, and passes `npm test`

#### Scenario: Unsourceable lenses are logged, not guessed

- **WHEN** a catalogue lens lacks a published weight, length, diameter, blade
  count or minimum focus distance for RF mount
- **THEN** it is not entered, and PROGRESS.md records why

### Requirement: Third-party USD is a price a dealer actually charges

A third-party lens's USD price SHALL be the regular (non-promotional) price a
major authorised US dealer charges, or the maker's own store price when that
is the same figure. A maker store's compare-at price MUST NOT be used as USD
when no dealer charges it as its regular price.

#### Scenario: Permanent store "sale"

- **WHEN** a maker's store shows a compare-at above its selling price and the
  dealer's regular price equals (or is near) the selling price
- **THEN** USD is the dealer's regular price, and the priceSource note records
  the store's compare-at as not used

#### Scenario: Temporary sale

- **WHEN** the dealer's regular price matches the store's compare-at
- **THEN** USD stays at that regular price

## MODIFIED Requirements

### Requirement: Manufacturer grouping and card colours

The third-party lenses SHALL be grouped in `LENS_DROPDOWN_GROUPS` by
manufacturer, appended after the existing Canon groups, one group per maker
(`── Sigma ──`, `── Tamron ──`, `── Laowa ──`, `── Voigtländer ──`, …), as on
the Sony and Nikon pages; a combined `── Other ──` group holds only makers
with too few lenses to warrant their own. Every `manufacturer` used SHALL have
a `MANUFACTURER_COLORS` entry.

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
