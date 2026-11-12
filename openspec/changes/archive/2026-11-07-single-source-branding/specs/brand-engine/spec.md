# Brand Engine (delta)

## ADDED Requirements

### Requirement: Header context label names the brand or the lens mode
The header text next to the logo lockup SHALL be the active brand's name (e.g. "Fujifilm", "Canon"; "All Brands" on the cross-brand compare page) while in cameras mode, and "Lens Compare" while in lenses mode. The label SHALL NOT read "Camera Compare". Switching modes SHALL update the label immediately, and the value SHALL continue to flow from `BRAND_CONFIG.<mode>.headerTitle` (no engine-side branching).

#### Scenario: Brand page in cameras mode
- **WHEN** `fujifilm/index.html` loads in cameras mode
- **THEN** the header context label reads "Fujifilm"

#### Scenario: Brand page switched to lenses mode
- **WHEN** the user toggles a brand page to lenses mode
- **THEN** the header context label reads "Lens Compare"

#### Scenario: Cross-brand compare page
- **WHEN** `compare/index.html` loads
- **THEN** the header context label reads "All Brands"

### Requirement: Compare label cell shows exactly one label
The left cell of the compare header SHALL show exactly one label at a time: when the "Cameras to compare" slot-count field is visible, the "Compare" label SHALL be hidden; when the slot-count field is hidden (below the mobile breakpoint, or on pages without a slot-count field), the "Compare" label SHALL be shown alone. Both labels SHALL never be visible simultaneously.

#### Scenario: Desktop with slot-count field
- **WHEN** a brand or compare page renders at a viewport ≥ 600px
- **THEN** the cell shows the "Cameras to compare" field and the "Compare" label is not visible

#### Scenario: Mobile clamp hides the field
- **WHEN** the same page renders below the 600px breakpoint (slot count clamped to 2, field hidden)
- **THEN** the cell shows only the "Compare" label
