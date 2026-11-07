## ADDED Requirements

### Requirement: Catalogue-complete third-party lenses on Panasonic and Leica

The Panasonic dataset SHALL include every full-frame L-Mount and every Micro
Four Thirds lens currently listed in the in-scope makers' own catalogues, and
the Leica dataset SHALL include every full-frame L-Mount lens the Panasonic
dataset lists plus every M-mount lens currently listed by the in-scope M
makers, except out-of-scope designs and lenses whose non-nullable specs cannot
be sourced, which MUST be logged with the reason in the change's PROGRESS.md
instead of being entered with guessed values.

#### Scenario: Entered lenses are fully sourced

- **WHEN** a lens from this pass is added to `panasonic/data.js`,
  `olympus/data.js` or `leica/data.js`
- **THEN** it carries the brand's mount id, a `specSources` citation, a
  `priceSource` for its USD price, and passes `npm test`

#### Scenario: Unsourceable lenses are logged, not guessed

- **WHEN** a catalogue lens lacks a published weight, length, diameter, blade
  count or minimum focus distance for the mount
- **THEN** it is not entered, and PROGRESS.md records why

### Requirement: Same-mount copies agree

A lens entered in more than one brand file on the same mount SHALL describe
one product: its optic fields and USD price MUST be identical in every file.

#### Scenario: Leica and Panasonic share an L-Mount lens

- **WHEN** a slug exists in both `leica/data.js` and `panasonic/data.js` (or
  `sigma/data.js`)
- **THEN** `tests/data/shared-mount.test.js` compares the two entries and
  fails on any disagreement
