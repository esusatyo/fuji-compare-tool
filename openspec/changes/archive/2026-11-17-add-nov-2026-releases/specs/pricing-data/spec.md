## ADDED Requirements

### Requirement: Announced items not yet on sale may carry no price

An item that is officially announced but not yet on sale SHALL carry `preRelease: true`. Only a maker's press release or the maker's own news or product page counts as an announcement; rumours, leaks and teasers do not. A pre-release item MAY store `prices.USD` as `null` when the announcement gives no USD price, and then every other currency SHALL be `null` as well. A pre-release current camera is exempt from the all-currencies rule. `preRelease` SHALL NOT be combined with `discontinued: true`. Once the item goes on sale, the flag is removed and the normal price rules apply.

#### Scenario: Announced lens with no announced price

- **WHEN** a lens has `preRelease: true` and every price, USD included, is `null`
- **THEN** the data is valid

#### Scenario: Price missing without the flag

- **WHEN** a lens without `preRelease` has `prices.USD: null`
- **THEN** the data violates the requirement

#### Scenario: Regional price without a USD price

- **WHEN** a pre-release item has `prices.USD: null` but a non-null EUR price
- **THEN** the data violates the requirement

#### Scenario: Flag on a discontinued item

- **WHEN** an item carries both `preRelease: true` and `discontinued: true`
- **THEN** the data violates the requirement
