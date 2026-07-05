## ADDED Requirements

### Requirement: Root page defaults to Fujifilm
The root `index.html` SHALL redirect to `fujifilm/index.html` by default when no brand preference is stored.

#### Scenario: First-time visitor
- **WHEN** a user visits the root URL with no `brand` key in `localStorage`
- **THEN** the user is redirected to `fujifilm/index.html` (preserving any hash fragment)

#### Scenario: Returning visitor with stored preference
- **WHEN** a user visits the root URL and `localStorage['brand']` equals `'canon'`
- **THEN** the user is redirected to `canon/index.html`

### Requirement: Brand preference is persisted
The site SHALL write the current brand slug to `localStorage['brand']` whenever a user navigates to a brand page, so their last-visited brand is remembered on return.

#### Scenario: Preference saved on navigation
- **WHEN** a user navigates to `canon/index.html`
- **THEN** `localStorage.getItem('brand')` equals `'canon'`

### Requirement: Brand switcher is accessible from every brand page
Each brand page SHALL include a brand switcher control in the site header, allowing users to navigate to another brand's compare page without returning to the root.

#### Scenario: Switching brand from Fujifilm to Canon
- **WHEN** a user on `fujifilm/index.html` selects Canon from the brand switcher
- **THEN** the browser navigates to `canon/index.html` and `localStorage['brand']` is updated to `'canon'`

### Requirement: Root page renders a visible brand picker
The root `index.html` SHALL render a visible brand picker (logo cards or list) before or during the redirect, so users arriving at the root can consciously choose a brand.

#### Scenario: Brand picker visible on root page
- **WHEN** a user visits the root URL
- **THEN** brand cards for all registered brands (Fujifilm, Canon) are visible before the redirect fires

#### Scenario: Hash fragment preserved through redirect
- **WHEN** a user visits `/#lenses`
- **THEN** the redirect navigates to `fujifilm/#lenses` (or the stored brand's page with `#lenses`)
