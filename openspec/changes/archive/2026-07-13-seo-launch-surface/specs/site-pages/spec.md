# Site Pages

## ADDED Requirements

### Requirement: About and Privacy pages
The site SHALL provide static `about.html` and `privacy.html` pages at the root, self-contained (inline styles, no runtime dependencies), working from `file://`. The About page SHALL describe what the site is, how data is sourced and verified, and who built it. The Privacy page SHALL state that analytics are cookieless (Umami), that brand/preference state lives in `localStorage`, and that outbound Buy links go to Amazon.

#### Scenario: Pages exist and are self-contained
- **WHEN** `about.html` or `privacy.html` is opened directly from disk
- **THEN** the page renders fully with no network requests required and links back to the comparison tool

### Requirement: Footer trust elements
The engine footer SHALL render: a "data last verified" date sourced from `SITE_CONFIG.dataVerified` (never the current date — the date states when data was last audited), links to the About and Privacy pages, and an empty `affiliate-disclosure` element reserved for post-launch activation. When `SITE_CONFIG` is not defined (e.g. a page loaded without `site-config.js`), the footer SHALL omit the date rather than fail.

#### Scenario: Config-driven freshness date
- **WHEN** `SITE_CONFIG.dataVerified` is `2026-07-03` and a brand page renders
- **THEN** the footer shows a "last verified" statement containing that date, replacing the previously hardcoded "April 2026" text

#### Scenario: About/Privacy reachable from every brand page
- **WHEN** any brand page renders
- **THEN** the footer contains working relative links to `../about.html` and `../privacy.html`

#### Scenario: Disclosure slot present but inert
- **WHEN** a brand page renders pre-launch
- **THEN** an empty element with id `affiliate-disclosure` exists in the footer and displays no visible text

#### Scenario: Missing site-config degrades gracefully
- **WHEN** `engine.js` runs on a page that did not load `site-config.js`
- **THEN** the footer renders without a verified date and no script error occurs
