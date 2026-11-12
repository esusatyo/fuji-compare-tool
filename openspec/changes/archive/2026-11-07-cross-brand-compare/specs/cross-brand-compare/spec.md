# Cross-Brand Compare Page

## ADDED Requirements

### Requirement: Dedicated compare page loads all brands
The site SHALL provide `compare/index.html`, loading `../engine.css`,
`../site-config.js`, every registered brand's `data.js`, and `../engine.js`,
and declaring an inline `COMPARE_CONFIG` (hero copy, default selection, slot
bounds) before the engine loads. The engine SHALL enter cross-brand mode if
and only if `COMPARE_CONFIG` is present. The page SHALL work from `file://`
and any static host, with the site's neutral accent color (not a brand
accent).

#### Scenario: Compare page initializes
- **WHEN** `compare/index.html` is opened
- **THEN** the comparison UI renders with cameras from more than one brand selectable and no script errors

#### Scenario: Brand pages are unaffected
- **WHEN** a brand page (no `COMPARE_CONFIG`) initializes
- **THEN** the engine runs in single-brand mode exactly as before

### Requirement: Any camera from any brand per slot
Each slot's dropdown SHALL offer every registered brand's cameras, grouped by
brand, using namespaced ids of the form `<brand>:<slug>`
(e.g. `fujifilm:x-t5`). Duplicate prevention SHALL work across brands: an id
selected in one slot is disabled in the others. Cameras only — the page SHALL
NOT render a lens mode toggle.

#### Scenario: Cross-brand selection
- **WHEN** slot 0 holds `fujifilm:x-t5` and the user selects `sony:a7-iv` in slot 1
- **THEN** both cameras render side by side and `sony:a7-iv` is disabled in every other slot's dropdown

#### Scenario: No lens mode
- **WHEN** the compare page renders its header
- **THEN** no Cameras/Lenses mode toggle is present and the page is always in cameras mode

### Requirement: Adjustable slot count with mobile clamp
The compare page SHALL let the user choose 2, 3, or 4 slots. The effective
rendered count SHALL be `min(choice, viewport allowance)`, where viewports
narrower than the mobile breakpoint (600px) allow exactly 2. The user's
choice SHALL survive clamping: shrinking the viewport reduces the visible
slots to 2, and widening it restores the chosen count. Slot-count logic SHALL
be a pure function of (choice, viewport width) so it is unit-testable.

#### Scenario: Four slots on desktop
- **WHEN** a user at a 1200px viewport selects 4 slots
- **THEN** four slot columns render and the comparison table shows four value cells per row

#### Scenario: Mobile clamps to two
- **WHEN** the viewport is 500px wide and the user's slot choice is 4
- **THEN** exactly 2 slots are visible

#### Scenario: Choice restored on widening
- **WHEN** a user with a 4-slot choice shrinks the viewport below 600px and then widens it back
- **THEN** the visible slot count returns to 4 without re-selecting

### Requirement: Brand-tagged sections render across brands
In cross-brand mode, a spec section tagged `brand: '<slug>'` SHALL render
when at least one selected camera belongs to that brand. Within such a
section, cells for cameras of other brands SHALL display "—" and SHALL be
excluded from winner computation. Universal sections (no `brand` tag) SHALL
render for all cameras as usual.

#### Scenario: Foreign cameras show a dash
- **WHEN** a Fujifilm and a Sony camera are compared and the Film Simulations section (brand `fujifilm`) renders
- **THEN** the Fujifilm column shows its film-simulation value and the Sony column shows "—"

#### Scenario: Untagged sections unaffected
- **WHEN** cameras from four different brands are compared
- **THEN** every universal section row shows a real value for all four cameras

#### Scenario: One camera per brand renders every brand section
- **WHEN** one camera from each of the five brands is selected (across available slots and renders)
- **THEN** each brand-tagged section renders without throwing, with "—" in all non-matching columns

### Requirement: Per-item brand identity drives rendering
For each selected camera, the engine SHALL resolve the owning brand from the
id prefix and use that brand's data for: `SERIES_COLORS` placeholder styling,
the brand name in the Amazon search fallback of the Buy link, and
brand-section matching. Winner highlighting, currency switching, and the
price-display rules (discontinued, `priceIncomplete`) SHALL behave per item
exactly as on that item's own brand page.

#### Scenario: Buy link uses the owning brand's name
- **WHEN** a Sony camera without an `asin` is selected on the compare page
- **THEN** its Buy link is an Amazon search for "Sony <camera name>", not the page's neutral identity or another brand

#### Scenario: Mixed price completeness renders correctly
- **WHEN** a discontinued camera from one brand and a `priceIncomplete` camera from another are compared with a non-USD currency active
- **THEN** each column follows its own price-display fallback rules with no mismatched currency symbols

#### Scenario: Cross-brand winner highlighting
- **WHEN** two cameras from different brands are compared on a `higherBetter` spec where one value is greater
- **THEN** the greater value's cell carries the winner styling

### Requirement: Compare page entry points
The site SHALL link to the compare page from the landing page and from every
brand page (alongside or within the existing brand switcher), and the compare
page SHALL link back to individual brand pages.

#### Scenario: Reachable from a brand page
- **WHEN** a user on any brand page uses the cross-brand entry point
- **THEN** they land on `compare/index.html`
