## REMOVED Requirements

### Requirement: Buy button disabled when no URL provided

**Reason**: Describes behaviour that no longer exists. `buyUrl` was removed when
buy links moved to per-currency generation; measured 2026-09-07, **zero** items
in any brand carry a `buyUrl`, and `engine.js` renders every Buy button as an
enabled `<a>` built by `amazonBuyUrl()` (engine.js:694, 702). There is no
disabled state in the engine at all, so this requirement has been describing
fiction since the migration.

## ADDED Requirements

### Requirement: Buy links are generated per-currency from ASIN

The engine SHALL generate every Buy link at render time from the selected
currency and the item's `asin`, via `amazonBuyUrl()`. With an `asin` the link
MUST target `https://<regional-amazon-host>/dp/<asin>`; without one it MUST fall
back to an Amazon search for the brand and model on that same regional host.

A null `asin` is therefore a degraded link, never a broken one, and the Buy
button SHALL always render as an enabled link. Items MUST NOT carry a stored
`buyUrl`.

#### Scenario: Item with an ASIN deep-links to the product page

- **WHEN** an item with a non-null `asin` renders under a selected currency
- **THEN** its Buy link points at that currency's Amazon marketplace `/dp/<asin>`

#### Scenario: Item without an ASIN falls back to search

- **WHEN** an item with `asin: null` renders
- **THEN** its Buy link is an enabled Amazon search URL on the currency's
  regional host, not a disabled button
