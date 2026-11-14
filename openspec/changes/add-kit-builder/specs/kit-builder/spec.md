## ADDED Requirements

### Requirement: A kit is one body and the lenses that fit it
The kit builder page at `/kit/` SHALL let a visitor choose one camera body per kit from every brand and add up to six lenses to it. The lenses offered for a body SHALL be exactly the lenses whose mount equals the body's mount, taken from every brand's data, with a lens stored in more than one brand file offered once. A lens already in the kit SHALL NOT be offered again. A camera with a fixed lens SHALL be selectable as a body, SHALL take no lenses, and SHALL show its built-in lens.

#### Scenario: Lenses match the mount
- **WHEN** a visitor picks the Fujifilm X-T5 as a body and opens the lens search
- **THEN** every lens listed is an X-Mount lens and no G-Mount lens is listed

#### Scenario: Shared mount across brands
- **WHEN** a visitor picks a Leica L-Mount body
- **THEN** Sigma and Panasonic L-Mount lenses are offered, and a lens stored in several brand files appears once

#### Scenario: Fixed-lens camera
- **WHEN** a visitor picks the Fujifilm X100VI
- **THEN** the kit shows its built-in lens and offers no lens search

#### Scenario: Changing the body
- **WHEN** a kit holds lenses and its body is replaced by one of another mount
- **THEN** the lenses that do not fit the new body are removed and those that fit are kept

### Requirement: Each kit shows itemised rows and totals
Each kit SHALL list its body and each lens with that item's weight and price and a Buy link, and SHALL show the total weight in grams with ounces as secondary text, the total price, the full-frame-equivalent focal range its lenses span, and the distinct filter thread sizes they use. Totals SHALL update whenever an item is added, replaced or removed or the currency changes.

#### Scenario: Weight total
- **WHEN** a kit holds a 557 g body and lenses of 180 g and 655 g
- **THEN** the total weight shown is 1,392 g

#### Scenario: Removing a lens
- **WHEN** a visitor removes a lens from a kit
- **THEN** its row disappears and both totals fall by that lens's weight and price

### Requirement: Price totals never mix currencies
The page SHALL price every row and both totals in the selected currency only when every priced item in both kits has a list price in that currency. Otherwise it SHALL price every row and both totals in US dollars and SHALL name the items that had no price in the selected currency. Prices SHALL NOT be converted between currencies. An item with no US price SHALL be excluded from the total and named as not priced. A discontinued item SHALL be counted at its stored price and marked as discontinued. The page SHALL state that totals are sums of individual list prices.

#### Scenario: Every item has a local price
- **WHEN** AUD is selected and every item in both kits has an AUD price
- **THEN** rows and totals are in AUD and no fallback note is shown

#### Scenario: One item lacks a local price
- **WHEN** AUD is selected and one lens has no AUD price
- **THEN** every row and both totals are shown in USD and a note names that lens

#### Scenario: Unpriced item
- **WHEN** a kit contains an announced lens with no price
- **THEN** the total excludes it and a note says it is not priced

### Requirement: Two kits can be compared side by side
The page SHALL show two kits side by side at every viewport width, the second being optional. When both kits have a body, the lower total weight and the lower total price SHALL be highlighted where they differ, and one sentence SHALL state the weight and price difference. Price SHALL be compared only when neither kit contains an unpriced item.

#### Scenario: Lighter and cheaper
- **WHEN** kit 2 weighs 320 g less and costs less than kit 1
- **THEN** kit 2's weight and price totals are highlighted and the sentence says it is lighter and cheaper

#### Scenario: One kit only
- **WHEN** only the first kit has a body
- **THEN** its totals are shown without a highlight or a comparison sentence

### Requirement: Kits are shareable by URL
The page SHALL record both kits in the URL fragment as `#kit=<body>[,<lens>…][;<body>[,<lens>…]]` once a visitor changes a kit, and SHALL restore them from it on load. Entries that are unknown, duplicated, of another mount, on a fixed-lens body, or beyond six lenses SHALL be dropped rather than rejecting the link. With both kits empty the fragment SHALL be removed.

#### Scenario: Round trip
- **WHEN** a visitor builds two kits and opens the resulting URL in a new tab
- **THEN** the same bodies and lenses are shown in the same order

#### Scenario: Bad entry
- **WHEN** a link names a lens of a different mount than its body
- **THEN** the body is restored and that lens is left out

### Requirement: The kit builder is discoverable and counted
`/kit/` SHALL be in the sitemap, SHALL carry a generated title, description and canonical URL, and SHALL be linked from the footer of every page. Picking a body, adding a lens, removing an item and first filling both kits SHALL each report an anonymous event, and `privacy.html` SHALL list them.

#### Scenario: Sitemap
- **WHEN** the generator runs
- **THEN** `sitemap.xml` contains `https://comparecameraspecs.com/kit/`
