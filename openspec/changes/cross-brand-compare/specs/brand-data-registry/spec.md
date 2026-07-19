# Brand Data Registry

## ADDED Requirements

### Requirement: Brand data registers into a shared registry
Each `<brand>/data.js` SHALL register its dataset as
`window.BRAND_DATA[<slug>]`, an object exposing exactly the keys
`BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`, `CAMERA_ORDER`, `DROPDOWN_GROUPS`,
`LENSES`, `LENS_DROPDOWN_GROUPS`, and `REGISTERED_BRANDS`. The registration
SHALL initialize `window.BRAND_DATA` if absent and SHALL NOT overwrite other
brands' entries, so any number of brand files can load on one page in any
order.

#### Scenario: Single brand registers on a brand page
- **WHEN** `fujifilm/data.js` is evaluated on a page where no other brand file has run
- **THEN** `window.BRAND_DATA` has exactly one key, `fujifilm`, whose value exposes all eight dataset keys

#### Scenario: Five brands coexist on one page
- **WHEN** all five brand `data.js` files are evaluated on the same page in any order
- **THEN** no script error is thrown and `window.BRAND_DATA` has five entries, each brand's data intact

### Requirement: Brand files remain standalone browser scripts
Each `data.js` SHALL remain a self-contained plain browser script — no
imports, no references to other brand files or to engine code — with its data
declared inside a function scope (IIFE) so no top-level `const` escapes to
global scope. The file SHALL keep working when loaded directly from `file://`.

#### Scenario: No global const collision
- **WHEN** two brand files are loaded sequentially via plain `<script src>` tags
- **THEN** the second file does not throw `Identifier has already been declared` and neither `CAMERAS` nor `BRAND_CONFIG` exists as a bare global

### Requirement: Registry consumers replace bare-global readers
The engine, test loader, and SEO generator SHALL read brand data exclusively through the registry.
That covers `engine.js`, `tests/helpers/load-brand.js`, and `scripts/generate-seo.js`. On a brand page
(exactly one registered entry) the engine SHALL behave identically to the
pre-registry engine.

#### Scenario: Brand pages render unchanged
- **WHEN** the tier-2 test suite renders every brand page after the registry refactor
- **THEN** all existing assertions pass without modification (other than the loader helper itself)

#### Scenario: Generator reads registry data
- **WHEN** `scripts/generate-seo.js` runs after the refactor
- **THEN** its output for existing pages is byte-identical to the pre-refactor output

### Requirement: Camera slugs are namespace-safe
No camera slug in any brand SHALL contain the `:` character, which is reserved
as the brand/slug separator in cross-brand ids.

#### Scenario: Slug audit
- **WHEN** the tier-1 suite validates a brand's `CAMERAS` keys
- **THEN** a slug containing `:` fails the schema check
