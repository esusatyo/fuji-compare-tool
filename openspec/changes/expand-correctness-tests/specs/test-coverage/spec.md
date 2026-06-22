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
The test suite SHALL verify, offline, that every `imageUrl`, `buyUrl`, and `productUrl` across all items parses as a valid `https` URL whose host is in the expected-domain allowlist, and that every `imageUrl` path ends with a recognised image file extension.

#### Scenario: URLs parse and use allowed hosts
- **WHEN** any item declares an `imageUrl`, `buyUrl`, or `productUrl`
- **THEN** the value parses with `new URL()`, uses the `https` scheme, and its host matches an entry in the expected-domain allowlist

#### Scenario: Image URLs reference image files
- **WHEN** an item declares an `imageUrl`
- **THEN** the URL path ends with one of `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.svg`

### Requirement: Links are not accidentally shared between products
The test suite SHALL verify that no two distinct products share the same `imageUrl`, `buyUrl`, or `productUrl`, guarding against copy-paste errors that point a product at the wrong asset.

#### Scenario: No duplicate image URLs across products
- **WHEN** the full set of non-null `imageUrl` values is collected across cameras and lenses
- **THEN** no URL is used by more than one distinct product id

#### Scenario: No duplicate buy or product URLs across products
- **WHEN** the full set of non-null `buyUrl` and `productUrl` values is collected
- **THEN** no buy URL and no product URL is shared by more than one distinct product id

### Requirement: Purchasable items have a buy link
The test suite SHALL verify that every non-discontinued camera and lens declares a non-null `buyUrl`.

#### Scenario: Current item has a buy link
- **WHEN** an item has `discontinued: false`
- **THEN** the item declares a non-null `buyUrl`

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
