## Why

People who search "camera comparison" land on the homepage, which is a brand chooser: pick a
brand, wait for the tool, then scroll a long dropdown to find a camera. Bing and Copilot
visitors land on `/` and leave without triggering a single engagement event
(`docs/growth-backlog.md`, item 1). A review of PetaPixel's PixelMeter (Nov 2026) showed the
shape that works: type a model name — "xt5" — and be comparing within two taps.

Our pickers are native `<select>`s: 231 cameras on the compare page, up to ~350 lenses on a
brand page, no search.

## What Changes

- **A type-to-search picker replaces the `<select>` in every slot, on every page** (brand
  pages — cameras and lenses — and `/compare/`). A slot shows its item on a button; pressing
  it opens a search field and a list. Nothing typed lists the whole catalogue under the same
  group headings the dropdown had; typing ranks matches. Matching ignores punctuation and
  case ("xt5" → X-T5), reads roman and arabic generation numbers alike ("a7 4" → A7 IV),
  treats "Mark" and "mm" as optional, and lets a brand or lens-maker word narrow the list.
  Below 600px the picker is a full-screen sheet.
- **The homepage becomes the tool.** Under the hero sits the cross-brand comparison with
  empty slots — each one a "Search cameras…" field — and a visible 2 / 3 / 4 control for how
  many cameras to compare. The spec table appears in place with the first pick; the second
  pick turns it into a comparison. No navigation.
- **The homepage stays light.** It ships a ~7 KB generated camera-name index instead of the
  eight brand files (~420 KB gzipped); the engine fetches those the first time a picker
  opens.
- **BREAKING (behaviour): the homepage no longer redirects returning visitors** to their
  stored brand. With the tool on the homepage, the redirect would hide it from exactly the
  people most likely to use it. Brand pages still remember the brand, and header logos still
  link `/?brands`, so the redirect can be reinstated by restoring one script.
- Two anonymous events: `picker-pick:<page>:<search|browse>` (never the typed text) and
  `quick-compare:<first|pair>` on the homepage. `privacy.html` says so.

## Out of scope (decided with the owner, 2026-11-13)

- Per-column replace / remove (×) controls and a "Not listed? Suggest it" row — later change.
- More than two columns on phones (needs sideways-scrolling columns) — phones stay at two.
- Cross-brand lens comparison; the homepage, like `/compare/`, is cameras only.
- Thumbnails in search results (photos are hot-linked from makers' servers).

## Capabilities

### New Capabilities
- `item-picker`: the searchable slot picker — matching rules, ranking, popover behaviour.

### Modified Capabilities
- `home-landing`: the landing page embeds the comparison tool and a generated name index.
- `brand-picker`: the conditional root redirect is removed.
- `shareable-urls`: selection hashes on the homepage.

## Impact

- `engine.js` (picker, search, embed mode, empty slots, on-demand data), `engine.css`.
- `scripts/generate-seo.js` (`cameraIndex`, `homeConfigScript`, homepage block), `index.html`.
- `analytics.js` (grammar comment), `privacy.html`.
- Tests: `tests/helpers/dom.js` rewritten for the picker, new `load-home.js`,
  `search-picker.test.js`, `home-embed.test.js`; `root-redirect.test.js` → `root-page.test.js`.
- `CLAUDE.md`, the `add-camera-brand` skill (no more `VALID_BRANDS` step), growth backlog.
