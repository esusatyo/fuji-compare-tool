# Brand Engine (delta)

## MODIFIED Requirements

### Requirement: Engine is brand-agnostic
The engine SHALL render any brand's comparison page without containing
brand-specific data, colors, or copy. All brand identity SHALL be supplied at
runtime via `BRAND_CONFIG`, resolved from the `window.BRAND_DATA` registry
rather than bare globals. On a page with exactly one registered brand the
engine SHALL run in single-brand mode with behavior identical to the
pre-registry engine; the engine SHALL NOT read `CAMERAS`, `BRAND_CONFIG`, or
any other brand dataset key as a global variable.

#### Scenario: Engine loads Fujifilm brand
- **WHEN** `fujifilm/index.html` is loaded (which includes `fujifilm/data.js` before `engine.js` init)
- **THEN** the page header shows the Fujifilm logo, accent color is `#cc0000`, and Film Simulations spec section is visible

#### Scenario: Engine loads Canon brand
- **WHEN** `canon/index.html` is loaded (which includes `canon/data.js` before `engine.js` init)
- **THEN** the page header shows the Canon logo, accent color is `#cc0000`, and DPAF / C-Log spec sections are visible while Film Simulations section is absent

#### Scenario: Engine resolves data through the registry
- **WHEN** a brand page is loaded with its data available only under `window.BRAND_DATA[<slug>]` (no bare globals)
- **THEN** the engine initializes and renders normally

## ADDED Requirements

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
