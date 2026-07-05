# Price Display

### Requirement: Prices never display with a mismatched currency symbol

The system SHALL NOT render a USD price value with a non-USD currency symbol. When the item has no price for the selected currency, the system SHALL fall back to a clearly tagged USD value (e.g. `USD $1,199`) or, if no price exists at all, the text "Price unavailable". This rule applies to both the slot price display and the comparison-table price row, for cameras and lenses alike.

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
- **THEN** the table price cell uses the same tagged-USD / "Price unavailable" fallback as the slot, never a foreign symbol on the USD number

### Requirement: Price is labeled as RRP

The system SHALL display an "RRP" label to the left of each item's price in the slot display, and the comparison-table price field SHALL be labeled "RRP (list price)", so users understand the figure is a manufacturer list price that may differ from the live Buy-link price.

#### Scenario: Slot price shows RRP label

- **WHEN** a slot renders an item's price
- **THEN** an "RRP" label appears to the left of the price value

#### Scenario: Comparison table price row label

- **WHEN** the comparison table renders the price row
- **THEN** the row is labeled "RRP (list price)"

### Requirement: Disclaimer describes list pricing accurately

The footer disclaimer SHALL describe the displayed prices as approximate manufacturer list prices (RRP) that may differ from live retail prices, and SHALL direct users to the Buy link for current pricing. It SHALL NOT describe the prices as "launch prices".

#### Scenario: Footer disclaimer wording

- **WHEN** the page footer is rendered
- **THEN** the disclaimer refers to RRP / list pricing and points to the Buy link for live prices, and does not say "launch prices"
