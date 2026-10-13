## ADDED Requirements

### Requirement: SG-image, Voigtländer and Laowa X-mount coverage

The Fujifilm `LENSES` dataset SHALL include every current X-mount lens from
**SG-image**, **Voigtländer** and **Laowa** whose required specs can be sourced
from the maker (or, where the maker publishes none for the X version, from an
independent source per the third-party sourcing rules). A candidate that can't
be sourced SHALL be recorded as skipped, with its reason, in the change's
research notes rather than entered with guessed values. SG-image lenses SHALL
sit in their own `── SG-image ──` dropdown group, and `SG-image` SHALL have a
`MANUFACTURER_COLORS` entry.

#### Scenario: New makers' lenses validate and render with their colour

- **WHEN** `npm test` runs
- **THEN** every SG-image, Voigtländer and Laowa X-mount entry passes schema,
  mount and referential checks, and its `manufacturer` has a
  `MANUFACTURER_COLORS` key

#### Scenario: Unsourceable lenses are logged, not guessed

- **WHEN** a candidate X-mount lens lacks a sourceable non-nullable spec
- **THEN** it is absent from `LENSES` and listed with its reason in the change's
  deferred/skipped notes
