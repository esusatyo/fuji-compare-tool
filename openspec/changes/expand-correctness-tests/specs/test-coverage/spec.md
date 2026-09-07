## ADDED Requirements

### Requirement: Rendered compare table is free of leaked sentinel values
The test suite SHALL render every camera and every lens through the engine and verify the compare table never displays the literal strings `undefined`, `null`, `NaN`, or `[object Object]`. The check SHALL run for all brand directories and for both cameras and lenses modes.

#### Scenario: No sentinel strings in any camera comparison
- **WHEN** each camera in a brand is placed into a comparison slot and the table is rendered
- **THEN** the table's text contains none of `undefined`, `null`, `NaN`, or `[object Object]`

#### Scenario: No sentinel strings in any lens comparison
- **WHEN** the engine is switched to lenses mode and each lens is placed into a comparison slot
- **THEN** the rendered table's text contains none of `undefined`, `null`, `NaN`, or `[object Object]`

### Requirement: Every spec cell renders content
The test suite SHALL verify that every spec-value cell in the rendered table contains non-empty text for every item, where the em-dash/placeholder counts as content. No cell SHALL render blank.

#### Scenario: No blank cells for any item
- **WHEN** an item is rendered in the compare table
- **THEN** every `.spec-value` cell has non-empty trimmed text content

### Requirement: Item placeholders and icons resolve for every item
The test suite SHALL verify that the rendered image area for every camera and lens is valid: an `<img>` with non-empty `alt` text when the item has an `imageUrl`, otherwise an SVG/colour placeholder whose series (camera) or manufacturer (lens) colour resolves.

#### Scenario: Item with an image renders an img with alt
- **WHEN** an item has a non-null `imageUrl` and is rendered in a slot
- **THEN** the slot contains an `<img class="cam-photo">` whose `alt` attribute is non-empty

#### Scenario: Item without an image renders a coloured placeholder
- **WHEN** an item has no `imageUrl` and is rendered in a slot
- **THEN** the slot contains a `.cam-placeholder` element with a resolved (non-empty) background colour

### Requirement: All links are well-formed and point at expected domains
The test suite SHALL verify, offline, that every `imageUrl` and `productUrl` across all items parses as a valid `https` URL whose host is in the expected-domain allowlist, and that every `imageUrl` path ends with a recognised image file extension. (`buyUrl` is not tested — the field no longer exists in the data.)

#### Scenario: URLs parse and use allowed hosts
- **WHEN** any item declares an `imageUrl` or `productUrl`
- **THEN** the value parses with `new URL()`, uses the `https` scheme, and its host matches an entry in the expected-domain allowlist

#### Scenario: Image URLs reference image files
- **WHEN** an item declares an `imageUrl`
- **THEN** the URL path ends with one of `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.svg`

### Requirement: Shared links and ASINs are legitimate only in known shapes
Duplication is normal in this dataset and a global uniqueness rule would be wrong: one maker product page and one product photo routinely serve every mount of the same optic. As of 2026-09-07 there are **98 cross-brand duplicate `imageUrl`/`productUrl`/`asin` values** and 6 within-brand ones, essentially all legitimate. The guard SHALL therefore be scoped rather than global.

`imageUrl` and `productUrl` uniqueness SHALL be asserted **within a single brand**, never across brands. Legitimate within-brand duplicates (a maker's series page shared by several focal lengths; two mounts of one optic in a brand spanning two mounts) SHALL be recorded in a reviewed allowlist, so that a *new* duplicate fails while known ones stay green.

A shared `asin` SHALL be treated as legitimate, because Amazon lists mount variants of one lens under a single parent ASIN. Entries sharing an `asin` MUST however agree on `manufacturer`, and their `name` values MUST be closely similar — differing only by mount or variant wording, not naming a different product.

#### Scenario: Unexplained duplicate image or product URL within a brand
- **WHEN** two distinct items in the same brand share an `imageUrl` or `productUrl`
- **AND** that pair is not in the reviewed allowlist
- **THEN** the test fails

#### Scenario: Cross-brand duplicates are not flagged
- **WHEN** the same maker product page or photo is used by entries in different brands
- **THEN** no failure is reported

#### Scenario: Entries sharing an ASIN describe the same product
- **WHEN** two or more entries declare the same `asin`
- **THEN** they all share the same `manufacturer`, and their `name` values are closely similar

### Requirement: ASIN coverage does not regress
`buyUrl` is no longer stored — buy links are generated per-currency from `asin`, and a null `asin` falls back to an Amazon search rather than breaking. A missing ASIN is therefore a degraded link, not a defect, and MUST NOT fail the suite outright: 56 of 670 non-discontinued items lack one as of 2026-09-07.

The suite SHALL instead ratchet: assert the number of non-discontinued items without an `asin` does not exceed a recorded baseline, so coverage can only improve.

#### Scenario: ASIN coverage regresses
- **WHEN** a change raises the count of non-discontinued items lacking an `asin` above the recorded baseline
- **THEN** the test fails, naming the items

### Requirement: Prices are internally plausible across currencies
The test suite SHALL verify that, for each item, every present non-null currency price sits within a documented ratio band relative to the item's USD price, catching order-of-magnitude and decimal-entry errors.

#### Scenario: Per-currency price within its band
- **WHEN** an item declares a non-null price in a currency other than USD
- **THEN** the price divided by the USD price falls within that currency's allowed ratio band

### Requirement: Text and identity fields are clean
The test suite SHALL verify that human-readable text fields contain no residual placeholder markers (`TODO`, `TBD`, `???`) and no leading/trailing whitespace, that taglines stay within a maximum length, and that no two cameras (and no two lenses) share an identical `name`.

#### Scenario: No placeholder residue or stray whitespace
- **WHEN** a string field such as `name` or `tagline` is inspected
- **THEN** it contains none of `TODO`, `TBD`, `???` and has no leading or trailing whitespace

#### Scenario: Taglines stay within budget
- **WHEN** a camera declares a `tagline`
- **THEN** its length does not exceed the configured maximum

#### Scenario: Names are unique within a collection
- **WHEN** all camera names (and separately all lens names) are collected for a brand
- **THEN** no name appears more than once

### Requirement: Network link liveness is verifiable on demand
The test suite SHALL provide a working network link checker, enabled by `RUN_LINK_TESTS=1`, that fetches every collected URL and classifies the result: `404`/`410` fail the suite, anti-bot statuses (`403`/`429`/`503`) warn without failing, and image URLs must return an `image/*` content type. The checker SHALL cache results to keep reruns inexpensive and SHALL remain disabled by default.

#### Scenario: Dead link fails the opt-in suite
- **WHEN** the link suite runs with `RUN_LINK_TESTS=1` and a URL returns `404` or `410`
- **THEN** the suite fails and reports the dead URL with its referencing products

#### Scenario: Anti-bot status warns but does not fail
- **WHEN** a URL returns `403`, `429`, or `503`
- **THEN** the suite records a warning and does not fail on that URL

#### Scenario: Suite is skipped by default
- **WHEN** the test suite runs without `RUN_LINK_TESTS` set
- **THEN** the network link checks do not execute
