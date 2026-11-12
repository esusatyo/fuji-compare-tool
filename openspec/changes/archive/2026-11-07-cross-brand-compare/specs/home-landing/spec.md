# Home Landing (delta)

## ADDED Requirements

### Requirement: Landing page links to the cross-brand compare page
The landing page SHALL contain a generator-owned link to
`./compare/` presented as a peer of the brand cards (e.g. an
"All brands — compare across brands" card), so the cross-brand tool is
reachable from the root without JavaScript.

#### Scenario: Crawler reaches the compare page from the root
- **WHEN** the root page's HTML is parsed without executing scripts
- **THEN** it contains an `<a>` whose href resolves to `compare/index.html`
