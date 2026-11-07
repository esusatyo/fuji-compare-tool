## ADDED Requirements

### Requirement: Catalogue-complete budget-maker X-mount lenses

The Fujifilm dataset SHALL include every X-mount lens currently listed in the
own-store catalogues of 7Artisans, TTArtisan, SG-image and Thypoch, except
out-of-scope designs (cine, adapter-only, GFX) and lenses whose non-nullable
specs cannot be sourced, which MUST be logged with the reason in the change's
research ledger instead of being entered with guessed values.

#### Scenario: Entered lenses are fully sourced

- **WHEN** a lens from this pass is added to `fujifilm/data.js`
- **THEN** it carries `mount:'x'`, a `specSources` citation for its specs, a
  `priceSource` for its USD price, and passes `npm test`

#### Scenario: Unsourceable lenses are logged, not guessed

- **WHEN** a catalogue lens lacks a published weight, length, diameter, blade
  count or minimum focus distance
- **THEN** it is not entered, and the research ledger records it as skipped
  with the missing field named
