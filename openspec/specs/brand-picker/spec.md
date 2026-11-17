# Brand Picker

## Purpose
The root page: redirecting to a stored brand preference and offering the brand choice.
## Requirements
### Requirement: Brand preference is persisted
The site SHALL write the current brand slug to `localStorage['brand']` whenever a user navigates to a brand page, so their last-visited brand is remembered on return.

#### Scenario: Preference saved on navigation
- **WHEN** a user navigates to `canon/index.html`
- **THEN** `localStorage.getItem('brand')` equals `'canon'`

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

### Requirement: Root page never redirects
The root `index.html` SHALL render for every visitor regardless of any stored brand preference, and SHALL neither read nor modify `localStorage['brand']`.

#### Scenario: Returning visitor
- **WHEN** a user whose `localStorage['brand']` equals `'fujifilm'` visits the root URL
- **THEN** the root page renders, no navigation occurs, and the stored value is unchanged

