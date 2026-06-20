## 1. Root redirector

- [x] 1.1 In `index.html`, remove the brand-grid markup (`.picker-header`, `.brand-grid`, `.picker-footer`) and all embedded picker CSS.
- [x] 1.2 Replace the inline script with a pure redirector: read `localStorage['brand']`, validate against `['canon', 'fujifilm']`, default to `canon`, and `location.replace('./<brand>/' + (location.hash || ''))`.
- [x] 1.3 Keep the `<title>` and umami analytics tag; ensure the page renders nothing visible before redirecting.

## 2. Header brand switcher → dropdown

- [x] 2.1 In `engine.js`, rewrite `buildBrandSwitcher()` to emit `<select id="brand-switcher">` with one `<option value="<slug>">` per `REGISTERED_BRANDS`, marking the current `BRAND_CONFIG.slug` as `selected`. Still return `''` when fewer than 2 brands are registered.
- [x] 2.2 Change the brand-switcher event handler from a `click` delegate to a `change` listener: read the selected slug, no-op if it equals the current brand, write it to `localStorage['brand']`, and navigate to `../<slug>/<hash>`.

## 3. Styling

- [x] 3.1 In `engine.css`, remove `.brand-sw-btn` rules and update `.brand-switcher` to style the `<select>` consistently with the currency dropdown (`.header-select`), or apply `.header-select` to the brand select in markup.
- [x] 3.2 Remove the mobile `.brand-switcher { display: none }` rule (line ~438) so the dropdown shows on small screens.

## 4. Tests

- [x] 4.1 Update `tests/logic/pickers.test.js` (and any brand-picker markup/link tests) to expect the `<select>` brand switcher instead of buttons.
- [x] 4.2 Add/adjust a test asserting the root redirect defaults to `canon` when no/invalid `localStorage['brand']`, and honors a valid stored brand with hash preservation.
- [x] 4.3 Run `npm test` and confirm all suites pass.

## 5. Manual verification

- [x] 5.1 Load root with cleared storage → lands on Canon; with `brand=fujifilm` stored → lands on Fujifilm; `/#lenses` preserved through redirect.
- [x] 5.2 On a brand page, switch brands via the dropdown → navigates and persists; verify dropdown is visible/usable on a mobile-width viewport.
