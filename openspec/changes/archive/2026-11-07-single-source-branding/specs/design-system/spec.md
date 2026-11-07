# Design System (delta)

## ADDED Requirements

### Requirement: Generated pages source identity from the canonical assets
`scripts/generate-seo.js` SHALL read the logo mark from `assets/logo.svg` and the color tokens (`--bg-deep`, `--accent-primary`, `--accent-secondary`) from `engine.css` at generation time, and SHALL NOT contain literal copies of the mark geometry or token hex values. All generated identity output — lockup headers, favicon/theme-color links, injected identity styles — SHALL derive from those two sources. A parse failure (missing token, unreadable SVG) SHALL abort generation with an error naming the missing piece.

#### Scenario: Rebrand propagates through the generator
- **WHEN** a token value in `engine.css` or the mark in `assets/logo.svg` is changed and `node scripts/generate-seo.js` is rerun
- **THEN** every generated page reflects the new identity with no other manual edits, and the freshness gate fails until the regeneration is committed

#### Scenario: Missing token fails loudly
- **WHEN** the generator runs against an `engine.css` that no longer defines `--bg-deep` as a hex token
- **THEN** generation exits with an error naming `--bg-deep` and writes no partial output

### Requirement: Touch icon is script-rendered and pixel-verified
The repo SHALL provide `scripts/render-touch-icon.js`, which renders `apple-touch-icon.png` (180×180, mark from `assets/logo.svg` centered on a solid `--bg-deep` background) via headless Chrome, erroring with an actionable message when no Chrome binary is available. A Tier 1 test SHALL decode the committed PNG with no new dependencies and assert its dimensions are 180×180 and its corner background pixels equal `--bg-deep` (small per-channel tolerance), so a rebrand that skips re-rendering the icon fails the suite.

#### Scenario: Stale icon after a background-token change
- **WHEN** `--bg-deep` is changed in `engine.css` but `apple-touch-icon.png` is not re-rendered
- **THEN** the touch-icon test fails, identifying the icon as stale against the current token

#### Scenario: Icon re-rendered from the sources
- **WHEN** `scripts/render-touch-icon.js` runs successfully after a rebrand
- **THEN** the regenerated PNG passes the pixel test with no manual editing

### Requirement: Sync tests cover only genuine duplicates
`tests/data/brand-sync.test.js` SHALL enforce identity equality only for copies that cannot be generated: the `engine.js` inline mark (runtime code cannot read files), `favicon.svg`, and the rgba fallback whitelist. It SHALL NOT re-assert identity for content the generator owns — staleness there is caught by the regeneration freshness gate.

#### Scenario: Engine copy still drifts loudly
- **WHEN** the mark in `engine.js` diverges from `assets/logo.svg`
- **THEN** the sync test fails naming `engine.js`
