# Design System

## ADDED Requirements

### Requirement: Site-wide dark neutral theme tokens
The site SHALL define a single design-token set in `engine.css` `:root` implementing the handoff's Theme A (Dark Neutral): `--bg-deep` (~`#131722`, page background), `--bg-surface` (~`#20242F`, cards/nav), `--border` (~`#3C4150`), `--text-primary` (~`#ECEDF1`), `--text-secondary` (~`#9CA3B5`), `--accent-primary` (~`#B48CE0`, purple), `--accent-secondary` (~`#4FC7B0`, teal). Every page — landing, brand pages, compare page, generated vs pages, About, Privacy — SHALL render from these tokens with no per-brand page recoloring. `--accent-color` SHALL remain defined as an alias of `--accent-primary` for compatibility. Radii SHALL follow the handoff scale (9px buttons, 12–16px cards, 20px pills/panels).

#### Scenario: Brand pages share one theme
- **WHEN** any two brand pages (e.g. Canon and Nikon) are loaded
- **THEN** both render with identical background, surface, border, text, and accent colors — no brand-specific accent or hero color appears

#### Scenario: Static pages match engine pages
- **WHEN** the landing page, a vs page, About, or Privacy is rendered
- **THEN** its background, text, and accent colors are the same token values used on engine-rendered pages

### Requirement: Logo lockup links to the brand picker
Every page header SHALL display, at the top left, the "Framed Duo" logo mark (inline SVG matching `assets/logo.svg` geometry: four corner brackets stroke-width 3 round-capped, two r=10 circles filled `--accent-primary` and `--accent-secondary`) at ~24px, followed by the wordmark "Compare Camera Specs" in 700 weight. The mark and wordmark together SHALL be a single link to the root landing page with the redirect-suppression query parameter (`?brands`), using the correct relative path for the page's directory depth. The wordmark SHALL NOT be embedded inside the mark's SVG.

#### Scenario: Logo returns a brand-locked user to the picker
- **WHEN** a user with `localStorage['brand']` set clicks the header logo lockup on any page
- **THEN** the browser lands on the root landing page showing the brand picker, without being redirected back to the stored brand

#### Scenario: Lockup present on generated pages
- **WHEN** any generated vs page is rendered
- **THEN** its header contains the same mark + "Compare Camera Specs" lockup linking to the root landing page with `?brands`

### Requirement: Favicon on every page
The site SHALL provide a favicon derived from the logo mark (tight crop, both circles at equal weight) as `favicon.svg` at the repo root. Every page's `<head>` SHALL reference it via a depth-correct relative `<link rel="icon">`, and SHALL declare `<meta name="theme-color" content="#131722">`. On generated pages these tags SHALL be emitted inside the generator-owned head block.

#### Scenario: Favicon resolves from a nested page
- **WHEN** a page in `vs/` or `<brand>/vs/` is loaded
- **THEN** its favicon link resolves to the root `favicon.svg` (correct `../` depth)

### Requirement: Column accents and winner highlighting
Comparison columns SHALL alternate accent identity — odd slots (1st, 3rd) use `--accent-primary`, even slots (2nd, 4th) use `--accent-secondary`. A winning spec cell SHALL be highlighted with its column accent at ~15% opacity background and emphasized text, replacing the previous green highlight. Badges/pills SHALL use an accent at ~18% opacity fill with the full-strength accent as text color.

#### Scenario: Winner cell tinted with column accent
- **WHEN** a spec row's best value is in the second column
- **THEN** that cell's highlight derives from `--accent-secondary` (teal family), and no green highlight colors remain in the stylesheet

### Requirement: Typography is Inter with system fallback
All UI text SHALL use the Inter font family (weights 400–800) loaded via a font `<link>` with `font-display: swap`, falling back to the platform system-font stack so pages remain fully legible offline and from `file://`.

#### Scenario: Font unavailable
- **WHEN** the font CDN is unreachable
- **THEN** the page renders in the system fallback stack with no missing text or broken layout

### Requirement: Data-identity colors are retained
The theme SHALL NOT replace colors that encode item identity rather than page theme: `SERIES_COLORS` camera-placeholder chips, `MANUFACTURER_COLORS` lens-placeholder chips, and the per-brand accent stripes on the landing page's brand cards SHALL keep their existing values. Product photos SHALL render on a light surface chip so white-background images read correctly on the dark theme.

#### Scenario: Series chips survive the theme change
- **WHEN** a camera slot renders its SVG placeholder
- **THEN** the placeholder uses that camera's `SERIES_COLORS` entry, unchanged by the site theme
