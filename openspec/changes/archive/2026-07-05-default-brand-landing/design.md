## Context

The site is a static, dependency-free multi-brand camera/lens comparison tool. Each brand lives at `/<brand>/index.html` and loads `data.js` + the shared `engine.js`/`engine.css`. The root `index.html` is currently a standalone landing page: it renders brand cards (its own embedded CSS) and runs a small script that redirects returning visitors (those with `localStorage['brand']` set) to their last brand, while showing the cards to first-time visitors.

Inside a brand page, the header offers a brand switcher built by `buildBrandSwitcher()` in `engine.js` — a segmented group of `<button>` elements, one per `REGISTERED_BRANDS` entry, hidden below the mobile breakpoint (`engine.css:438`). `REGISTERED_BRANDS` is defined in each brand's `data.js`.

This change removes the landing UI (default to Canon, remember last brand) and converts the segmented switcher to a dropdown so it scales to 3+ brands and works on mobile.

## Goals / Non-Goals

**Goals:**
- Root URL takes users straight into a brand compare page with zero clicks.
- Default brand for first-time visitors is Canon.
- Last-used brand is remembered and restored on return (existing `localStorage['brand']` mechanism).
- Header brand switcher is a `<select>` dropdown that renders all registered brands and is visible on mobile.

**Non-Goals:**
- No change to brand data, camera/lens content, or `REGISTERED_BRANDS` shape.
- No new third brand is added here (the dropdown merely makes adding one trivial later).
- No routing/build-system changes — the site stays static and `file://`-compatible.

## Decisions

### Root `index.html` becomes a pure redirector
Strip all brand-card markup and embedded CSS. Keep a single inline script that:
1. Reads `localStorage['brand']`.
2. Validates it against the known brand slugs; falls back to `canon` if missing or invalid.
3. `location.replace()`s to `./<brand>/<hash>`, preserving `location.hash`.

Using `location.replace()` (not `href`) keeps the redirector out of browser history so Back doesn't bounce. The brand-slug allowlist stays inline in the root page since the root does not load `data.js`; it lists `['canon', 'fujifilm']` and the default `'canon'`.

*Alternative considered:* a `<meta http-equiv="refresh">` to Canon with JS overriding for stored brands. Rejected — it flashes/double-navigates and can't preserve the hash cleanly.

### Brand switcher renders as a `<select>`
`buildBrandSwitcher()` emits a `<select id="brand-switcher">` with one `<option value="<slug>">` per `REGISTERED_BRANDS` entry and the current brand's option marked `selected`. The handler changes from a `click` delegate to a `change` listener that reads `event.target.value`, writes it to `localStorage['brand']`, and navigates to `../<slug>/<hash>`. Guard against selecting the current brand (no-op).

*Alternative considered:* keep buttons and let them wrap on overflow. Rejected — wrapping looks broken in a single-row header and still needs a separate mobile treatment; a native select is compact, scales infinitely, and is accessible for free.

### Styling
Remove `.brand-sw-btn` rules and the `.brand-switcher { display: none }` mobile override. Add `<select>` styling consistent with the existing `.header-select` currency dropdown (likely reuse that class) so the brand and currency dropdowns match.

## Risks / Trade-offs

- **Root no longer offers an explicit brand choice for first-timers** → They land on Canon and switch via the header dropdown, which is always present; acceptable per the proposal.
- **A stale/invalid `localStorage['brand']` value** → The redirector validates against the slug allowlist and falls back to Canon, so a bad value can't dead-end the user.
- **Slug allowlist duplicated in root `index.html`** → It's a tiny, rarely-changing list; the root intentionally avoids loading `data.js`. Adding a brand means one line in the root array plus the brand's `data.js` — noted in tasks.
- **Existing tests assert the old picker/button markup** → Update `tests/logic/pickers.test.js` and the brand-picker link/markup tests to expect the dropdown and Canon default.

## Migration Plan

Pure front-end, static deploy — ship all files together. No data migration. Rollback is reverting the three edited files (`index.html`, `engine.js`, `engine.css`) and the tests. Existing `localStorage['brand']` values keep working since the key and slug values are unchanged.
