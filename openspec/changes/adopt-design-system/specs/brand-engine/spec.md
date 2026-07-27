# Brand Engine (delta)

## MODIFIED Requirements

### Requirement: Engine is brand-agnostic
The engine SHALL render any brand's comparison page without containing brand-specific data or copy. All brand identity SHALL be supplied at runtime via `BRAND_CONFIG`. Page theming SHALL NOT vary by brand: every brand page renders with the shared design-system tokens, and the header shows the shared site lockup (not a per-brand logo) alongside brand-specific header/hero copy from `BRAND_CONFIG`.

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

## REMOVED Requirements

### Requirement: Accent color applied via CSS custom property
**Reason**: Per-brand accent theming is replaced by the site-wide design-system tokens; the engine no longer sets `--accent-color` from brand data.
**Migration**: `--accent-color` is defined statically in `engine.css` as an alias of `--accent-primary`. Remove `accentColor`/`heroDark` from every brand `BRAND_CONFIG` and delete the `init()` lines that set `--accent-color`/`--hero-dark` on the document element.
