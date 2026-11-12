# Site Pages (delta)

## MODIFIED Requirements

### Requirement: About and Privacy pages
The site SHALL provide static `about.html` and `privacy.html` pages at the root whose served output is self-contained (inline styles, no runtime dependencies), working from `file://`. Page prose SHALL be hand-maintained, but each page SHALL carry generator-owned identity blocks delimited by marker comments — a head block (favicon, touch-icon, theme-color, font links, and a token `<style>`) and a body header block (the logo lockup) — injected by `scripts/generate-seo.js` from the canonical identity sources. The generator SHALL refuse to write a page whose markers are missing, and both pages SHALL be part of the generator's output set so the regeneration freshness gate covers them. The About page SHALL describe what the site is, how data is sourced and verified, and who built it. The Privacy page SHALL state that analytics are cookieless, that brand/preference state lives in `localStorage`, and that outbound Buy links go to Amazon.

#### Scenario: Pages exist and are self-contained
- **WHEN** `about.html` or `privacy.html` is opened directly from disk
- **THEN** the page renders fully with no network requests required and links back to the comparison tool

#### Scenario: Identity blocks are generator-owned
- **WHEN** the identity tokens change and the generator is rerun
- **THEN** both pages' identity blocks reflect the new tokens while their hand-written prose is byte-identical

#### Scenario: Missing identity markers fail loudly
- **WHEN** the generator encounters an `about.html` or `privacy.html` without both identity marker pairs
- **THEN** it exits with an error instead of writing the file

#### Scenario: Stale identity blocks are caught
- **WHEN** a committed page's identity block no longer matches regenerated output
- **THEN** the seo freshness test fails, naming the stale file
