# Brand Picker (delta)

## MODIFIED Requirements

### Requirement: Brand switcher is accessible from every brand page
Each brand page SHALL include a brand switcher control in the site header, allowing users to navigate to another brand's compare page without returning to the root. The control SHALL be a dropdown (`<select>`) that lists every entry in `REGISTERED_BRANDS`, so the layout accommodates three or more brands without change. The dropdown SHALL be visible on mobile viewports. When navigating to another brand, the switcher SHALL carry over only the mode portion of the hash (`#cameras` or `#lenses`) — selection slugs are brand-specific and SHALL NOT be forwarded.

#### Scenario: Switcher lists all registered brands
- **WHEN** a brand page renders with `REGISTERED_BRANDS` containing Fujifilm, Canon, and any further brands
- **THEN** the header dropdown contains one option per registered brand, with the current brand pre-selected

#### Scenario: Switching brand from Canon to Fujifilm
- **WHEN** a user on `canon/index.html` selects Fujifilm from the brand dropdown
- **THEN** the browser navigates to `fujifilm/index.html` (preserving the mode portion of the hash) and `localStorage['brand']` is updated to `'fujifilm'`

#### Scenario: Selection slugs are not forwarded across brands
- **WHEN** a user on `fujifilm/index.html` with hash `#lenses=<fujifilm lens slugs>` switches to Sony via the brand dropdown
- **THEN** the browser navigates to `sony/index.html#lenses` (mode preserved, slugs dropped) and the Sony page renders lenses mode with its own default selection

#### Scenario: Dropdown available on mobile
- **WHEN** a brand page is viewed on a viewport narrower than the mobile breakpoint
- **THEN** the brand dropdown remains visible and usable
