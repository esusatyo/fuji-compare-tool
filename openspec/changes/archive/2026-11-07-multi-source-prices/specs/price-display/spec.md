## MODIFIED Requirements

### Requirement: Prices never display with a mismatched currency symbol

The system SHALL NOT render a USD price value with a non-USD currency symbol or with a bare `$` that could read as the selected currency's dollar. When the item has no price for the selected currency, the system SHALL fall back to a clearly tagged USD value (e.g. `USD $1,199`) or, if no price exists at all, the text "Price unavailable". This rule applies to the slot price display, the discontinued launch price, and the comparison-table price row, for cameras and lenses alike.

#### Scenario: Lens missing the selected-currency price

- **WHEN** a lens has `prices.USD = 1199` and `prices.AUD = null` and the selected currency is AUD
- **THEN** the slot displays the value tagged as USD (e.g. `USD $1,199`), not `A$1,199`

#### Scenario: Item has the selected-currency price

- **WHEN** an item has a non-null price for the selected currency
- **THEN** the slot and table display that value with the matching currency symbol

#### Scenario: Item has no price in any currency

- **WHEN** an item has no USD price and no selected-currency price
- **THEN** the display reads "Price unavailable"

#### Scenario: Comparison-table price row uses the same fallback

- **WHEN** a lens missing the selected-currency price is shown in the comparison table
- **THEN** the table price cell shows the tagged USD value (e.g. `USD $1,199`), never "—" and never a foreign symbol on the USD number

#### Scenario: Discontinued launch price is labelled USD

- **WHEN** a discontinued item has only a USD launch price and the selected currency is not USD
- **THEN** the slot shows "Discontinued" with the launch price tagged as USD (e.g. `Launch: USD $1,299`)

## ADDED Requirements

### Requirement: The cheapest-price highlight compares like with like

The comparison table SHALL highlight the lowest price only when every selected item has a price in the selected currency. A missing local price means the price isn't published in that currency, not that it is higher, and a tagged USD fallback is not comparable with a local price.

#### Scenario: One selected lens has no local price

- **WHEN** two lenses are compared in AUD, one with `prices.AUD = 999` and the other with `prices.AUD = null` and a USD price
- **THEN** neither price cell is highlighted as the winner

#### Scenario: Every selected item has a local price

- **WHEN** every selected item has a price in the selected currency
- **THEN** the lowest one is highlighted as before
