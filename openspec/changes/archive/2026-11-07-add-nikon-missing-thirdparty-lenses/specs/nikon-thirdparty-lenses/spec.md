## ADDED Requirements

### Requirement: Catalogue-complete third-party Z-mount lenses

The Nikon dataset SHALL include every Z-mount lens currently listed in the
in-scope makers' own catalogues, except out-of-scope designs and lenses whose
non-nullable specs cannot be sourced, which MUST be logged with the reason in
the change's PROGRESS.md instead of being entered with guessed values.

#### Scenario: Entered lenses are fully sourced

- **WHEN** a lens from this pass is added to `nikon/data.js`
- **THEN** it carries `mount:'z'`, a `specSources` citation, a `priceSource`
  for its USD price, and passes `npm test`

#### Scenario: Unsourceable lenses are logged, not guessed

- **WHEN** a catalogue lens lacks a published weight, length, diameter, blade
  count or minimum focus distance for Z-mount
- **THEN** it is not entered, and PROGRESS.md records why
