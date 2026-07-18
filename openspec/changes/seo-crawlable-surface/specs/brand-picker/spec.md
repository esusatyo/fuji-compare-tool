## REMOVED Requirements

### Requirement: Root page defaults to Canon
**Reason**: This requirement makes the root URL — the domain's most authoritative page and the natural target for head terms like "compare camera specs" — unconditionally redirect with an empty `<body>`, so it can rank for nothing. Redirecting visitors who have expressed no preference trades the site's most valuable SEO asset for one saved click.

**Migration**: Replaced by "Root page redirect is conditional on a stored brand preference" (below) plus the `home-landing` capability. Returning-visitor behaviour (redirect to stored brand, hash preserved, invalid value ignored) is preserved unchanged; only the no-preference case changes, from "redirect to Canon" to "render the landing page". Users with no preference reach a brand via a landing-page link; users changing brands continue to use the brand switcher, which is unaffected.

## ADDED Requirements

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
