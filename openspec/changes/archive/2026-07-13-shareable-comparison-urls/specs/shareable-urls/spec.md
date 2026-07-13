# Shareable URLs

## ADDED Requirements

### Requirement: URL hash encodes the current comparison
The engine SHALL encode the active comparison in the URL hash using the grammar `#<mode>=<slug>,<slug>,<slug>`, where `<mode>` is `cameras` or `lenses` and the slugs are the three selected item ids for that mode. On every selection change and every mode switch, the engine SHALL rewrite the hash via `history.replaceState` (creating no new history entries). All three slugs SHALL be written even when the responsive layout shows only two slots.

#### Scenario: Selection change updates the hash
- **WHEN** a user on a brand page changes slot 1 to `x-t50` while slots 0 and 2 hold `x-t5` and `x100vi` in cameras mode
- **THEN** `location.hash` becomes `#cameras=x-t5,x-t50,x100vi` and `history.length` is unchanged

#### Scenario: Mode switch updates the hash to that mode's selection
- **WHEN** a user switches from cameras mode to lenses mode with the lens selection at its default
- **THEN** `location.hash` becomes `#lenses=<default lens slugs, comma-separated>`

#### Scenario: Two-slot layout still shares three slugs
- **WHEN** a user on a viewport below the mobile breakpoint (2 visible slots) changes any slot
- **THEN** the written hash contains all three selected slugs

### Requirement: Loading a selection hash restores the comparison
On init, the engine SHALL parse a hash of the form `#<mode>=<slugs>` and preselect that mode and those items before first render. Each slug SHALL be validated against the active mode's item collection; a slug that does not resolve SHALL fall back to that slot's entry in the brand's `defaultSelected` (per-slot fallback, not whole-hash rejection). Fewer than three slugs SHALL leave the remaining slots at their defaults. The engine SHALL NOT rewrite the hash during init.

#### Scenario: Full hash round-trip
- **WHEN** a brand page loads with `#cameras=x-t5,x-t50,x100vi`
- **THEN** the three slot dropdowns show `x-t5`, `x-t50`, `x100vi` respectively

#### Scenario: Lens deep link
- **WHEN** a brand page loads with `#lenses=<three valid lens slugs>`
- **THEN** the page is in lenses mode with those lenses selected

#### Scenario: Invalid slug falls back per slot
- **WHEN** a brand page loads with `#cameras=x-t5,not-a-camera,x100vi`
- **THEN** slots 0 and 2 show `x-t5` and `x100vi`, and slot 1 shows the brand's `defaultSelected[1]`

#### Scenario: Partial hash fills remaining slots with defaults
- **WHEN** a brand page loads with `#cameras=x-t5`
- **THEN** slot 0 shows `x-t5` and slots 1 and 2 show `defaultSelected[1]` and `defaultSelected[2]`

### Requirement: Legacy mode-only hashes keep working
A bare `#cameras`, `#lenses`, or empty hash SHALL behave exactly as before this change: the mode is applied (defaulting to cameras) with that mode's default selection, and the engine SHALL NOT write a selection hash until the user first interacts.

#### Scenario: Legacy lenses bookmark
- **WHEN** a brand page loads with `#lenses`
- **THEN** the page is in lenses mode with the default lens selection and `location.hash` is still exactly `#lenses`

#### Scenario: Clean visit leaves URL clean
- **WHEN** a brand page loads with no hash
- **THEN** cameras mode renders with defaults and `location.hash` remains empty
