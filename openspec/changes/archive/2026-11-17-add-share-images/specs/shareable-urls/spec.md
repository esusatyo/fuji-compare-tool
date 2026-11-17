## ADDED Requirements

### Requirement: Share button hands off the current comparison
Brand pages and the cross-brand compare page SHALL show a share button in the page hero, above the comparison. Activating it SHALL hand the current `location.href` (including the selection hash) to `navigator.share` when that API exists, otherwise copy it with `navigator.clipboard.writeText` and confirm with a visible "Link copied" state, and otherwise reveal the URL in a selected read-only text field. It SHALL NOT use `alert()`, `confirm()` or `prompt()`.

#### Scenario: Desktop copy
- **WHEN** a visitor on a browser without `navigator.share` activates the button while comparing X-T5 and X-S20
- **THEN** the clipboard holds the page URL ending in `#cameras=x-t5,x-s20` and the button shows "Link copied"

#### Scenario: Phone share sheet
- **WHEN** a visitor on a browser with `navigator.share` activates the button
- **THEN** `navigator.share` is called with the current URL and page title

#### Scenario: No clipboard access
- **WHEN** neither `navigator.share` nor `navigator.clipboard` is available
- **THEN** the URL appears in a selected read-only field and no browser dialog opens

### Requirement: Share button use is counted anonymously
Each successful share hand-off SHALL report the event `share-link:<brand|compare>:<cameras|lenses>:<native|copy>` through `window.trackEvent`. A cancelled share sheet or a failed copy SHALL NOT report the event. `analytics.js`'s event grammar header and `privacy.html`'s list of counted interactions SHALL name it.

#### Scenario: Cancelled share sheet
- **WHEN** a visitor opens the native share sheet and dismisses it
- **THEN** no `share-link` event is sent

#### Scenario: Copy on the compare page
- **WHEN** a visitor copies the link on `compare/` in cameras mode
- **THEN** the event `share-link:compare:cameras:copy` is sent
