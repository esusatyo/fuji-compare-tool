## MODIFIED Requirements

### Requirement: Root page defaults to Canon
The root `index.html` SHALL redirect to `canon/index.html` by default when no brand preference is stored. The redirect SHALL happen with no user interaction.

#### Scenario: First-time visitor
- **WHEN** a user visits the root URL with no `brand` key in `localStorage`
- **THEN** the user is redirected to `canon/index.html` (preserving any hash fragment)

#### Scenario: Returning visitor with stored preference
- **WHEN** a user visits the root URL and `localStorage['brand']` equals `'fujifilm'`
- **THEN** the user is redirected to `fujifilm/index.html`

#### Scenario: Stored preference is not a registered brand
- **WHEN** a user visits the root URL and `localStorage['brand']` holds a value that is not a registered brand slug
- **THEN** the user is redirected to the default `canon/index.html`

#### Scenario: Hash fragment preserved through redirect
- **WHEN** a user visits `/#lenses`
- **THEN** the redirect navigates to the resolved brand's page with `#lenses` appended (e.g. `canon/#lenses`)

### Requirement: Brand switcher is accessible from every brand page
Each brand page SHALL include a brand switcher control in the site header, allowing users to navigate to another brand's compare page without returning to the root. The control SHALL be a dropdown (`<select>`) that lists every entry in `REGISTERED_BRANDS`, so the layout accommodates three or more brands without change. The dropdown SHALL be visible on mobile viewports.

#### Scenario: Switcher lists all registered brands
- **WHEN** a brand page renders with `REGISTERED_BRANDS` containing Fujifilm, Canon, and any further brands
- **THEN** the header dropdown contains one option per registered brand, with the current brand pre-selected

#### Scenario: Switching brand from Canon to Fujifilm
- **WHEN** a user on `canon/index.html` selects Fujifilm from the brand dropdown
- **THEN** the browser navigates to `fujifilm/index.html` (preserving any hash fragment) and `localStorage['brand']` is updated to `'fujifilm'`

#### Scenario: Dropdown available on mobile
- **WHEN** a brand page is viewed on a viewport narrower than the mobile breakpoint
- **THEN** the brand dropdown remains visible and usable

## REMOVED Requirements

### Requirement: Root page renders a visible brand picker
**Reason**: The landing page added an extra click and duplicated branding UI. The root is now a silent redirector that sends users straight to a brand compare page.
**Migration**: Users choose or change brand via the header brand dropdown on any brand page; first-time visitors land on Canon automatically.
