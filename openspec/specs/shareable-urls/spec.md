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

### Requirement: Compare-page hash grammar
On the compare page the hash grammar SHALL be
`#cameras=<brand>:<slug>,…` with 2–4 comma-separated brand-namespaced ids.
The number of ids written SHALL equal the user's chosen slot count (not the
responsive-clamped visible count), and every selection or slot-count change
SHALL rewrite the hash via `history.replaceState` (no new history entries).
Brand-page hash grammar (bare slugs, fixed three) is unchanged.

#### Scenario: Compare selection writes namespaced hash
- **WHEN** a compare-page user with 3 slots selects `fujifilm:x-t5`, `sony:a7-iv`, `canon:eos-r6-iii`
- **THEN** `location.hash` becomes `#cameras=fujifilm:x-t5,sony:a7-iv,canon:eos-r6-iii` and `history.length` is unchanged

#### Scenario: Mobile clamp does not truncate the hash
- **WHEN** a compare-page user with a 4-slot choice is on a viewport showing only 2 slots and changes a selection
- **THEN** the written hash contains all four namespaced ids

### Requirement: Loading a compare hash restores selection and slot count
On compare-page init, a hash with N valid entries (2 ≤ N ≤ 4) SHALL set the
slot count to N and preselect those cameras before first render. An id whose
brand prefix or slug does not resolve SHALL fall back per-slot to the compare
default; counts outside [2,4] SHALL be clamped. The engine SHALL NOT rewrite
the hash during init.

#### Scenario: Four-camera deep link
- **WHEN** the compare page loads with `#cameras=fujifilm:x-t5,sony:a7-iv,canon:eos-r6-iii,nikon:z6-iii`
- **THEN** four slots render (viewport permitting) with those cameras in order

#### Scenario: Invalid entry falls back per slot
- **WHEN** the compare page loads with `#cameras=fujifilm:x-t5,sony:not-a-camera`
- **THEN** slot 0 shows `fujifilm:x-t5` and slot 1 shows the compare default for that slot

### Requirement: Share button hands off the current comparison
Brand pages and the cross-brand compare page SHALL show a share button in the page hero, above the comparison. Activating it SHALL hand the current `location.href` (including the selection hash) to `navigator.share` when that API exists, otherwise copy it with `navigator.clipboard.writeText` and confirm with a visible "Link copied" state, and otherwise reveal the URL in a selected read-only text field. It SHALL NOT use `alert()`, `confirm()` or `prompt()`.

#### Scenario: Desktop copy
- **WHEN** a visitor on a browser without `navigator.share` activates the button while comparing X-T5 and X-S20
- **THEN** the clipboard holds the page URL ending in `#cameras=x-t5,x-s20` and the button shows "Link copied"

#### Scenario: Phone share sheet
- **WHEN** a visitor on a browser with `navigator.share` activates the button
- **THEN** `navigator.share` is called with the current URL and page title

#### Scenario: No clipboard access
- **WHEN** neither `navigator.share` nor `navigator.clipboard` is available
- **THEN** the URL appears in a selected read-only field and no browser dialog opens

### Requirement: Share button use is counted anonymously
Each successful share hand-off SHALL report the event `share-link:<brand|compare>:<cameras|lenses>:<native|copy>` through `window.trackEvent`. A cancelled share sheet or a failed copy SHALL NOT report the event. `analytics.js`'s event grammar header and `privacy.html`'s list of counted interactions SHALL name it.

#### Scenario: Cancelled share sheet
- **WHEN** a visitor opens the native share sheet and dismisses it
- **THEN** no `share-link` event is sent

#### Scenario: Copy on the compare page
- **WHEN** a visitor copies the link on `compare/` in cameras mode
- **THEN** the event `share-link:compare:cameras:copy` is sent

### Requirement: Homepage hash names the picked cameras
On the root page the hash SHALL use the compare-page grammar `#cameras=<brand>:<slug>[,…]` and SHALL list exactly the cameras in the visible slots, omitting empty slots. With no camera picked the URL SHALL carry no hash. Loading the root page with such a hash SHALL restore those cameras in order, show as many slots as there are valid entries (at least 2, at most 4, subject to the mobile clamp) and fetch the brand data without further interaction. Entries that are not known cameras, and repeated entries, SHALL be dropped; a hash with no valid entry SHALL leave the page in its empty state.

#### Scenario: Link from a comparison
- **WHEN** a visitor picks the X-T5 and the A7 IV on the root page
- **THEN** the URL is `/#cameras=fujifilm:x-t5,sony:a7-iv`

#### Scenario: Opening a shared link
- **WHEN** a visitor opens `/#cameras=fujifilm:x-t5,sony:a7-iv,canon:eos-r6-iii`
- **THEN** three slots name those cameras at once and the three-column table renders when the data has loaded

#### Scenario: Unknown entries
- **WHEN** a visitor opens `/#cameras=nope:x,nikon:zf`
- **THEN** the Nikon Zf is in the first slot, the second is empty, and the URL is rewritten to `#cameras=nikon:zf`

#### Scenario: Emptying has no hash
- **WHEN** no slot on the root page holds a camera
- **THEN** the URL has no hash

