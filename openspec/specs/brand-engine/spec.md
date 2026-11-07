# Brand Engine

## Purpose
The shared rendering engine: brand-agnostic rendering, the BRAND_CONFIG contract, and brand-tagged spec sections.
## Requirements
### Requirement: Engine is brand-agnostic
The engine SHALL render any brand's comparison page without containing brand-specific data or copy. All brand identity SHALL be supplied at runtime via `BRAND_CONFIG`, resolved from the `window.BRAND_DATA` registry rather than bare globals. On a page with exactly one registered brand the engine SHALL run in single-brand mode; the engine SHALL NOT read `CAMERAS`, `BRAND_CONFIG`, or any other brand dataset key as a global variable. Page theming SHALL NOT vary by brand: every brand page renders with the shared design-system tokens, and the header shows the shared site lockup (not a per-brand logo) alongside brand-specific header/hero copy from `BRAND_CONFIG`.

#### Scenario: Engine loads Fujifilm brand
- **WHEN** `fujifilm/index.html` is loaded (which includes `fujifilm/data.js` before `engine.js` init)
- **THEN** the page header shows the shared site lockup, the hero/header copy is Fujifilm's, and the Film Simulations spec section is visible

#### Scenario: Engine loads Canon brand
- **WHEN** `canon/index.html` is loaded (which includes `canon/data.js` before `engine.js` init)
- **THEN** the page header shows the shared site lockup, the hero/header copy is Canon's, and DPAF / C-Log spec sections are visible while Film Simulations section is absent

#### Scenario: Theme identical across brands
- **WHEN** any brand page initialises
- **THEN** the engine sets no brand-specific color properties and the computed accent colors equal the shared design-system tokens

### Requirement: BRAND_CONFIG contract
Each brand's `data.js` SHALL declare a `BRAND_CONFIG` constant with the following required fields: `name`, `families`, `brandSections`. Theming fields (`accentColor`, `heroDark`, `logoText`, `logoAccent`) SHALL NOT be part of the contract — brand files SHALL NOT declare them, and the engine SHALL NOT read them.

#### Scenario: Missing BRAND_CONFIG field
- **WHEN** `BRAND_CONFIG` is declared without a required field
- **THEN** the engine SHALL fall back to a sensible default and not throw a runtime error

#### Scenario: Theming fields rejected by schema
- **WHEN** a brand `data.js` declares `accentColor` (or `heroDark`/`logoText`/`logoAccent`) in `BRAND_CONFIG`
- **THEN** the Tier 1 schema test fails, flagging the field as no longer part of the contract

### Requirement: Conditional spec sections
The engine SHALL only render spec sections whose `brand` field matches an entry in `BRAND_CONFIG.brandSections`, or whose `brand` field is absent (universal sections).

#### Scenario: Universal section always shown
- **WHEN** any brand page renders the comparison table
- **THEN** sections without a `brand` field (e.g. Sensor & Processor, Body & Build) are visible

#### Scenario: Brand section shown for matching brand
- **WHEN** the Fujifilm brand page renders
- **THEN** the Film Simulations section (brand: `'fujifilm'`) is visible

#### Scenario: Brand section hidden for non-matching brand
- **WHEN** the Canon brand page renders
- **THEN** the Film Simulations section (brand: `'fujifilm'`) is NOT rendered in the table

### Requirement: Buy button disabled when no URL provided
The engine SHALL render the Buy button in a disabled state (not hidden) when `buyUrl` is `null` or absent on a camera or lens item.

#### Scenario: Buy button disabled
- **WHEN** an item has `buyUrl: null`
- **THEN** the Buy button is visible but non-interactive, with a visually distinct disabled style

### Requirement: Engine renders into a container and preserves static content
The engine SHALL render the comparison UI into the element with id `app`, falling back to `document.body` when no such element exists. It SHALL NOT destroy or overwrite static content that lives outside its render container, so generator-owned crawlable blocks in a brand page survive rendering.

#### Scenario: Static block survives rendering
- **WHEN** a brand page containing `<div id="app"></div>` followed by a static `seo:body` block is rendered by the engine
- **THEN** the comparison UI appears inside `#app` and the static block remains present in the DOM

#### Scenario: Fallback when no container is present
- **WHEN** the engine runs on a page with no `#app` element
- **THEN** it renders into `document.body` as before

#### Scenario: Delegated behaviour still works
- **WHEN** the engine has rendered into `#app` and a user clicks a section header or changes a slot select
- **THEN** section collapsing and slot re-rendering behave exactly as when rendering into the body

### Requirement: The mount filter is inert for single-mount brands
The engine SHALL render no chip row, and apply no filtering, for a brand whose `BRAND_CONFIG.mounts` holds one entry — producing the same DOM as before the filter existed.

#### Scenario: Brand declares one mount
- **WHEN** a brand page whose `BRAND_CONFIG.mounts` has a single entry initialises
- **THEN** the engine renders no chip row, offers every item in the slot dropdowns, and lays out the compare header unchanged

#### Scenario: Brand declares two mounts
- **WHEN** a brand page whose `BRAND_CONFIG.mounts` has two entries initialises
- **THEN** the engine renders the chip row described by the `mount-filter` capability, and no other part of the page changes

#### Scenario: Compare page shows no chip row
- **WHEN** `compare/index.html` initialises with its synthesized cross-brand config
- **THEN** no chip row renders

### Requirement: Conditional spec sections in cross-brand mode
In cross-brand mode a section with a `brand` field SHALL render when any selected camera's owning brand matches;
sections without a `brand` field SHALL always render. Single-brand pages keep
the existing rule (`BRAND_CONFIG.brandSections` membership) unchanged.

#### Scenario: Section appears when a matching camera is added
- **WHEN** a compare-page selection with no Fujifilm camera gains a Fujifilm camera in any slot
- **THEN** the Film Simulations section appears in the table

#### Scenario: Section disappears with its last matching camera
- **WHEN** the only Fujifilm camera in a compare-page selection is replaced by a Canon camera
- **THEN** the Film Simulations section is no longer rendered

### Requirement: Spec functions tolerate foreign cameras
Every spec `fn` — including brand-specific ones — SHALL return safely
(`undefined`/`null`, no throw) when given a camera that lacks the fields the
spec reads, and the renderer SHALL display "—" for such values.

#### Scenario: Brand-specific spec on a foreign camera
- **WHEN** a Fujifilm-tagged spec's `fn` is applied to a Sony camera during a cross-brand render
- **THEN** no exception is thrown and the cell renders "—"

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

