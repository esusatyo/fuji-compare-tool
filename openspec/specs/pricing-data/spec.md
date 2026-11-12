# Pricing Data

## Purpose
Price data: the currency set, completeness rules, and where each stored price comes from.
## Requirements
### Requirement: Live items carry a complete currency price set

Every non-discontinued item in a brand's `prices` data SHALL provide a non-null value for each supported currency (USD, AUD, EUR, GBP, JPY, CAD, SGD), unless the item is explicitly flagged as having incomplete pricing. Discontinued items are exempt and follow the existing discontinued-display behavior.

#### Scenario: Live item with a missing currency

- **WHEN** a non-discontinued item has a `null` value for any supported currency and is not flagged incomplete
- **THEN** the data violates the requirement

#### Scenario: Live item with full pricing

- **WHEN** a non-discontinued item has non-null values for all supported currencies
- **THEN** the data satisfies the requirement

#### Scenario: Explicitly flagged incomplete item

- **WHEN** an item with missing currency prices carries the documented incomplete-pricing flag
- **THEN** the data satisfies the requirement and the display falls back per the price-display rules

### Requirement: Currency price completeness is enforced by an automated test

A data-tier test SHALL assert the currency price completeness rule across every brand dataset, so missing local-currency prices are caught before they can regress into a mislabeled display.

#### Scenario: Test fails on regression

- **WHEN** a non-discontinued, unflagged item is missing a supported-currency price
- **THEN** the data-tier test fails and identifies the offending item and currency

### Requirement: A price cites every source checked

An item's `priceSource` SHALL be either one citation or a non-empty list of citations (each `{url, tier, title?, note?, date?}`), recording every reputable store whose price was read for the stored figure. Every citation in it SHALL render in the item's References "Price source" row, on interactive brand pages and on static vs-pages alike, in list order, and SHALL be covered by the live link test.

#### Scenario: Several price citations

- **WHEN** an item's `priceSource` lists the maker's store, B&H and Adorama
- **THEN** the References "Price source" row shows three links, in that order, on both the interactive page and the item's vs-pages

#### Scenario: Single citation still valid

- **WHEN** an item's `priceSource` is a single citation object
- **THEN** the data is valid and the row shows that one link, as before

#### Scenario: Empty list

- **WHEN** an item's `priceSource` is an empty list
- **THEN** the data-tier schema test fails for that item

### Requirement: The stored price is the sensible price the sources agree on

The stored USD (and any confirmed local) price SHALL be the regular price that the reputable sources checked agree on: the maker's official store where it sells the product, and major authorised dealers (B&H, Adorama and the like; for local prices, the local official store and major local retailers). A one-off or time-limited discount, an anomalous figure (one store far from the rest, a stale listing), and an inflated figure (a crossed-out "compare-at" price that no store charges) SHALL NOT be stored. A discount that every source charges for months on end is the regular price. Each source read SHALL be cited, with what it showed in the citation's note.

#### Scenario: One store runs a holiday sale

- **WHEN** the maker's store and two dealers list $999 and a third dealer shows $849 for a week-long sale
- **THEN** the stored price is $999 and the sale is noted, not stored

#### Scenario: A maker's compare-at that nobody charges

- **WHEN** a maker's store shows "$369, now $143" and every dealer sells at $143
- **THEN** the stored price is $143

### Requirement: New lenses without a confirmed local price stay USD-only

A lens added to the data SHALL carry a non-USD price only where a local price was confirmed from a local official store or reputable local retailer. Every other currency SHALL be `null`, with `priceIncomplete: true`, and the display falls back per the price-display rules. Ratio-derived estimates SHALL NOT be added for new lenses.

#### Scenario: New lens with a confirmed Japanese price only

- **WHEN** a new lens has a confirmed USD and JPY price and nothing else
- **THEN** its AUD, EUR, GBP, CAD and SGD are `null` and it carries `priceIncomplete: true`

