## Why

Today a visitor can only reach a camera or lens by name (the search picker) or by mount (the
mount pages). Nobody can ask "which full-frame cameras weigh under 500 g?" or "which Sony E
primes are f/1.8 or faster and under $600?". Search engines have no page that answers such
questions either. The data to answer them is already in every brand file.

Search demand for these lists has **not** been measured. This is a bet on usefulness first;
the preset list is configuration so it can follow the evidence later.

## What Changes

- **`/cameras/` — camera finder.** Every camera (232 today) in one pre-rendered table, with
  filters (brand, sensor size, mount or fixed lens, price, weight, megapixels, stabilisation,
  weather sealing, viewfinder, release year) and sorting. Discontinued cameras are hidden
  until the visitor turns on "Show discontinued". Ticking 2–4 rows offers "Compare these",
  which opens `/compare/` on that set.
- **`/lenses/` — lens finder.** Every lens once (about 1,245 after shared-mount copies are
  folded), with filters (mount, maker, prime/zoom, focal length, aperture, weight, price,
  autofocus, stabilisation, weather sealing, filter thread) and sorting. Same discontinued
  switch.
- **Prices in all seven currencies.** The price column and the price filter follow the
  selected currency. An item with no price in that currency is hidden while a price filter or
  price sort is active, and the page says how many were hidden and why.
- **Preset list pages**, such as `/cameras/lightest-full-frame`: static pages that are a saved
  filter + sort, generated from a list in `site-config.js` (`SITE_CONFIG.finderPresets`).
  Adding, changing or removing a preset is a config edit plus a regenerate. Six camera
  presets ship; the lens list ships empty until the owner picks some.
- Homepage card, footer links, sitemap entries, share cards, usage events (and the privacy
  page's list of what is counted).

No database, no library, no build step: the generator writes the rows; a small browser script
hides and reorders them.

## Capabilities

### New Capabilities
- `finder-pages`: the camera and lens finders, their filter grammar, and preset list pages.

### Modified Capabilities
- `home-landing`: the homepage links the two finders.

## Impact

- New: `finder.js` (shared browser + Node module, like `kit.js`), `cameras/index.html`,
  `lenses/index.html`, `cameras/<preset>.html` (generated), `og/cameras.png`, `og/lenses.png`,
  `tests/logic/finder.test.js`, `tests/logic/finder-page.test.js`,
  `tests/data/finder-pages.test.js`.
- Changed: `scripts/generate-seo.js` (pages, sitemap, stale removal, homepage card),
  `site-config.js` (`finderPresets`), `engine.css`, `engine.js` (footer links only),
  `about.html` / `privacy.html` (footer, events list), `CLAUDE.md`.
- `/lenses/` is about 300 KB of HTML before compression (estimated from the Sony E mount
  page) — the heaviest page on the site.
