# Shareable URLs

## Purpose
Let a comparison be bookmarked and shared: the URL hash names the mode and the items on screen, and loading it restores that comparison.

## Requirements

### Requirement: URL hash encodes the current comparison
The engine SHALL encode the active comparison in the URL hash using the grammar `#<mode>=<slug>,<slug>[,…]`, where `<mode>` is `cameras` or `lenses` and the slugs are the item ids **on screen**, in slot order — so the entry count is the visible slot count (2 to 4; one when a mount filter offers a single item). On every selection change, slot-count change and mode switch, the engine SHALL rewrite the hash via `history.replaceState` (creating no new history entries). Once a selection hash is present, the engine SHALL also rewrite it whenever the number of visible slots changes — the viewport crossing the mobile breakpoint, or a mount filter. Choices hidden by the viewport SHALL be kept in memory, so widening restores both the slots and their slugs.

#### Scenario: Selection change updates the hash
- **WHEN** a user on a brand page changes slot 1 to `x-t50` while slots 0 and 2 hold `x-t5` and `x100vi` in cameras mode, with three slots visible
- **THEN** `location.hash` becomes `#cameras=x-t5,x-t50,x100vi` and `history.length` is unchanged

#### Scenario: Mode switch updates the hash to that mode's selection
- **WHEN** a user switches from cameras mode to lenses mode with the lens selection at its default
- **THEN** `location.hash` becomes `#lenses=<default lens slugs, comma-separated>`

#### Scenario: Two-slot layout shares the two visible slugs
- **WHEN** a user on a viewport below the mobile breakpoint (2 visible slots) changes any slot
- **THEN** the written hash contains exactly the two visible slugs

#### Scenario: Widening restores the hidden slugs
- **WHEN** that viewport widens past the breakpoint and the user's chosen count was 3
- **THEN** three slots show and the hash lists all three slugs

### Requirement: Loading a selection hash restores the comparison
On init, the engine SHALL parse a hash of the form `#<mode>=<slugs>` and preselect that mode and those items before first render. The entry count SHALL set the slot count, clamped to 2..4, on brand pages and the compare page alike. Each slug SHALL be validated against the active mode's item collection; a slug that does not resolve SHALL fall back to that slot's entry in the brand's `defaultSelected` (per-slot fallback, not whole-hash rejection), and a slot past the declared defaults SHALL take the first item, in dropdown order, not already selected. The engine SHALL rewrite the hash during init only when the visible slot count differs from the entry count (a viewport narrower than the link, or a count outside 2..4); a link that fits the screen SHALL be left exactly as it arrived.

#### Scenario: Full hash round-trip
- **WHEN** a brand page loads with `#cameras=x-t5,x-t50,x100vi` on a wide viewport
- **THEN** the three slot dropdowns show `x-t5`, `x-t50`, `x100vi` respectively and the hash is unchanged

#### Scenario: Four-entry link
- **WHEN** a brand page loads with four valid camera slugs on a wide viewport
- **THEN** four slots show those cameras and the hash is unchanged

#### Scenario: Lens deep link
- **WHEN** a brand page loads with `#lenses=<valid lens slugs>`
- **THEN** the page is in lenses mode with those lenses selected

#### Scenario: Invalid slug falls back per slot
- **WHEN** a brand page loads with `#cameras=x-t5,not-a-camera,x100vi`
- **THEN** slots 0 and 2 show `x-t5` and `x100vi`, and slot 1 shows the brand's `defaultSelected[1]`

#### Scenario: One-entry hash shows two slots
- **WHEN** a brand page loads with `#cameras=x-t5`
- **THEN** two slots show `x-t5` and `defaultSelected[1]`, and the hash is rewritten to name both

#### Scenario: Phone opens a wider link
- **WHEN** a brand page loads with a three-entry camera hash below the mobile breakpoint
- **THEN** two slots show the first two cameras and the hash is rewritten to those two slugs

### Requirement: Legacy mode-only hashes keep working
A bare `#cameras`, `#lenses`, or empty hash SHALL behave exactly as before this change: the mode is applied (defaulting to cameras) with that mode's default selection, and the engine SHALL NOT write a selection hash until the user first interacts — resizing the viewport is not an interaction.

#### Scenario: Legacy lenses bookmark
- **WHEN** a brand page loads with `#lenses`
- **THEN** the page is in lenses mode with the default lens selection and `location.hash` is still exactly `#lenses`

#### Scenario: Clean visit leaves URL clean
- **WHEN** a brand page loads with no hash, on any viewport, and the viewport is then resized across the mobile breakpoint
- **THEN** `location.hash` remains empty
