# Brand Picker

### Requirement: Root page redirect is conditional on a stored brand preference
The root `index.html` SHALL redirect to `<brand>/index.html` if and only if `localStorage['brand']` holds a registered brand slug. When no valid preference is stored, the root page SHALL render its landing content and SHALL NOT redirect. The redirect SHALL branch solely on client-side stored state and SHALL NOT inspect the user-agent, so a crawler receives byte-identical content to a first-time visitor. The redirect SHALL use `location.replace` so it does not add a history entry, and SHALL preserve any hash fragment.

#### Scenario: Returning visitor with stored preference
- **WHEN** a user visits the root URL and `localStorage['brand']` equals `'fujifilm'`
- **THEN** the user is redirected to `fujifilm/index.html`

#### Scenario: Visitor with no stored preference
- **WHEN** a user visits the root URL with no `brand` key in `localStorage`
- **THEN** no redirect occurs and the landing page renders

#### Scenario: Stored preference is not a registered brand
- **WHEN** a user visits the root URL and `localStorage['brand']` holds a value that is not a registered brand slug
- **THEN** no redirect occurs and the landing page renders

#### Scenario: Hash fragment preserved through redirect
- **WHEN** a user with `localStorage['brand']` equal to `'canon'` visits `/#lenses`
- **THEN** the redirect navigates to `canon/#lenses`

#### Scenario: Redirect does not trap the back button
- **WHEN** a returning visitor is redirected from the root to their stored brand
- **THEN** the redirect uses `location.replace` and pressing Back does not return them to the root page

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
