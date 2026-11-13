## ADDED Requirements

### Requirement: The spec table can show only the rows that differ
Whenever two or more items are being compared, the comparison table SHALL offer a "Show differences only" control, off by default, together with a count of how many spec rows differ out of how many there are. A row differs when the values shown for the compared items are not all the same; empty slots are not items. With the control on, rows that do not differ SHALL be hidden, a section left with no rows SHALL be hidden, and the References section SHALL remain. The choice SHALL persist while the visitor changes items, slot count, currency or mode on that page, SHALL NOT be written to the URL, and SHALL NOT persist across page loads. With fewer than two items the control SHALL NOT be shown and no row SHALL be hidden.

#### Scenario: Hiding identical rows
- **WHEN** a visitor comparing three cameras switches "Show differences only" on
- **THEN** only the rows whose three values are not all the same remain, in their original order, and the count is unchanged

#### Scenario: Empty section
- **WHEN** every row of a section is identical across the compared items and the control is on
- **THEN** that section is not rendered

#### Scenario: Nothing differs
- **WHEN** the compared items match on every spec and the control is on
- **THEN** the table says there are no differences and the control remains available

#### Scenario: One item
- **WHEN** only one item is shown (a single camera on the homepage)
- **THEN** no differences control is shown and the full spec sheet renders

### Requirement: Winning cells use one dedicated colour, and a dead heat has no winner
A winning cell SHALL be styled with a single "better" colour that is the same in every column and is defined for both the dark and the light theme. When every compared item has the same numeric value for a spec, no cell in that row SHALL be marked as a winner; when several, but not all, share the best value, each of those SHALL be marked.

#### Scenario: Tie for best
- **WHEN** two of three cameras share the highest resolution
- **THEN** both of their cells are highlighted and the third is not

#### Scenario: Dead heat
- **WHEN** all compared cameras have the same resolution
- **THEN** no cell in that row is highlighted
