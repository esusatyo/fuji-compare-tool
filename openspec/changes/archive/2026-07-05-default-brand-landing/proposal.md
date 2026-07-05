## Why

The root `index.html` brand-selector landing page adds an extra click before users can compare anything, and it shows its own bespoke UI that duplicates branding logic. Visitors should land directly on a brand's compare page — Canon by default — and the in-app brand switcher should scale past two brands instead of being a fixed two-button toggle.

## What Changes

- **BREAKING**: Remove the visible brand-picker landing UI from root `index.html`. The root becomes a pure redirector with no cards or interactive content.
- Root `index.html` defaults to the **Canon** compare page for first-time visitors (changed from the previous Fujifilm default).
- Returning visitors are still redirected to their last-used brand via `localStorage['brand']` (behavior retained), preserving any URL hash fragment.
- Replace the header brand switcher's segmented two-button control with a `<select>` dropdown that renders all `REGISTERED_BRANDS`, so adding a third+ brand needs no layout changes.
- Make the brand dropdown visible on mobile (the old segmented switcher was hidden below the mobile breakpoint).

## Capabilities

### New Capabilities
<!-- None — this change modifies existing brand-picker behavior. -->

### Modified Capabilities
- `brand-picker`: Root no longer renders a visible picker (removed requirement); default brand changes from Fujifilm to Canon; the per-page brand switcher becomes a dropdown that scales to 3+ brands and is available on mobile.

## Impact

- `index.html` (root) — remove brand-grid markup/styles; keep only the redirect script, defaulting to `canon`.
- `engine.js` — `buildBrandSwitcher()` emits a `<select>` instead of buttons; switch handler listens for `change` instead of `click`.
- `engine.css` — replace `.brand-switcher`/`.brand-sw-btn` styles with dropdown styling; remove the mobile `display: none` rule so the dropdown shows on small screens.
- `tests/logic/pickers.test.js` and any brand-picker tests — update to reflect dropdown markup and the Canon default.
- No data changes; `REGISTERED_BRANDS` continues to drive the brand list.
