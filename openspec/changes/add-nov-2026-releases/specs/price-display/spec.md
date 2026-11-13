## ADDED Requirements

### Requirement: A pre-release item with no price says the price is not announced

When a selected item has `preRelease: true` and no price in either the active currency or USD, its price cell SHALL read "Price not announced", not "Price unavailable", so a reader can tell a product that has no price yet from one we couldn't source.

#### Scenario: Announced lens without a price

- **WHEN** a lens with `preRelease: true` and all-null prices is selected
- **THEN** its price cell reads "Price not announced"

#### Scenario: Pre-release lens with an announced USD price

- **WHEN** a lens with `preRelease: true` and a USD price is shown in AUD
- **THEN** its price cell shows the tagged USD price, as for any item without a local price
