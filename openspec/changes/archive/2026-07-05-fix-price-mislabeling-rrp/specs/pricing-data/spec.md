## ADDED Requirements

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
