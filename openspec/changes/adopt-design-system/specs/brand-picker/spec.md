# Brand Picker (delta)

## MODIFIED Requirements

### Requirement: Root page redirect is conditional on a stored brand preference
The root `index.html` SHALL redirect to `<brand>/index.html` if and only if `localStorage['brand']` holds a registered brand slug **and** the URL's query string does not contain the redirect-suppression parameter `brands`. When no valid preference is stored, or when `?brands` is present, the root page SHALL render its landing content and SHALL NOT redirect. Suppression SHALL NOT clear or modify the stored preference. The redirect SHALL branch solely on client-side stored state and the URL and SHALL NOT inspect the user-agent, so a crawler receives byte-identical content to a first-time visitor. The redirect SHALL use `location.replace` so it does not add a history entry, and SHALL preserve any hash fragment.

#### Scenario: Returning visitor with stored preference
- **WHEN** a user visits the root URL and `localStorage['brand']` equals `'fujifilm'`
- **THEN** the user is redirected to `fujifilm/index.html`

#### Scenario: Visitor with no stored preference
- **WHEN** a user visits the root URL with no `brand` key in `localStorage`
- **THEN** no redirect occurs and the landing page renders

#### Scenario: Stored preference is not a registered brand
- **WHEN** a user visits the root URL and `localStorage['brand']` holds a value that is not a registered brand slug
- **THEN** no redirect occurs and the landing page renders

#### Scenario: Suppression parameter shows the picker despite a stored brand
- **WHEN** a user with `localStorage['brand']` equal to `'canon'` visits the root URL with `?brands` in the query string (e.g. via the header logo link)
- **THEN** no redirect occurs, the landing page renders, and `localStorage['brand']` still equals `'canon'`

#### Scenario: Hash fragment preserved through redirect
- **WHEN** a user with `localStorage['brand']` equal to `'canon'` visits `/#lenses`
- **THEN** the redirect navigates to `canon/#lenses`

#### Scenario: Redirect does not trap the back button
- **WHEN** a returning visitor is redirected from the root to their stored brand
- **THEN** the redirect uses `location.replace` and pressing Back does not return them to the root page
