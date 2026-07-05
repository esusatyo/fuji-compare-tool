## ADDED Requirements

### Requirement: Engine is brand-agnostic
The engine SHALL render any brand's comparison page without containing brand-specific data, colors, or copy. All brand identity SHALL be supplied at runtime via `BRAND_CONFIG`.

#### Scenario: Engine loads Fujifilm brand
- **WHEN** `fujifilm/index.html` is loaded (which includes `fujifilm/data.js` before `engine.js` init)
- **THEN** the page header shows the Fujifilm logo, accent color is `#cc0000`, and Film Simulations spec section is visible

#### Scenario: Engine loads Canon brand
- **WHEN** `canon/index.html` is loaded (which includes `canon/data.js` before `engine.js` init)
- **THEN** the page header shows the Canon logo, accent color is `#cc0000`, and DPAF / C-Log spec sections are visible while Film Simulations section is absent

### Requirement: BRAND_CONFIG contract
Each brand's `data.js` SHALL declare a `BRAND_CONFIG` constant with the following required fields: `name`, `accentColor`, `logoText`, `logoAccent`, `families`, `brandSections`.

#### Scenario: Missing BRAND_CONFIG field
- **WHEN** `BRAND_CONFIG` is declared without a required field (e.g. `accentColor`)
- **THEN** the engine SHALL fall back to a sensible default (e.g. `#333333`) and not throw a runtime error

### Requirement: Accent color applied via CSS custom property
The engine SHALL set `--accent-color` on the `<html>` element using `BRAND_CONFIG.accentColor` at init time, replacing any hardcoded brand color references in the CSS.

#### Scenario: Accent color applied on load
- **WHEN** a brand page initialises
- **THEN** `document.documentElement.style.getPropertyValue('--accent-color')` equals `BRAND_CONFIG.accentColor`

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
