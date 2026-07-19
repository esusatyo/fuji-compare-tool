# Shareable URLs (delta)

## ADDED Requirements

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
