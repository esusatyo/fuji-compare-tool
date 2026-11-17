## Why

Size is the strongest demand signal the site has (`docs/growth-backlog.md`, item 2): *camera
size comparison*, *camerasize* and *camera size comparison with lens* lead the Bing queries,
and *camera size comparison* is among Bing Copilot's top grounding queries. The site holds the
data — every one of the 232 cameras has width, height, depth and weight; every one of the
1,532 lenses has length, diameter and weight — but shows it only as one text row
("129.5 × 91 × 63.8 mm"). Nothing draws it, and no page targets "X vs Y size". PetaPixel's
PixelMeter, reviewed in Nov 2026, has no size comparison at all.

## What Changes

- **A to-scale size drawing**, built from one shared module (`size.js`): each item as a
  rounded outline in front, top and side views at a single millimetres-to-pixels scale, in
  its column colour, with a credit-card outline for reference. Two layouts — *overlay*
  (outlines stacked; the default on wide screens) and *side by side* (the default below
  600px) — with a switch. Under it: a plain-language sentence, a dimensions-and-weight table
  with a difference column, and a note that these are makers' stated outer dimensions and
  that each item's sources are listed under References.
- **In the tool, drawn live.** A "Size" section near the bottom of the spec table — after
  the last spec section, above References — on brand pages (cameras **and lenses**),
  `/compare/` and the homepage. It redraws whenever an item, the slot count or the mode
  changes.
- **In every vs-page**, a compact, pre-rendered size section in the same position. Where a
  dedicated size page exists for the pair, it links to it.
- **Dedicated size pages for the same pairs whose vs-pages are indexable** (45 today),
  mirroring the vs-page URLs: `/<brand>/size/<a>-vs-<b>` and `/size/<brandA>-<a>-vs-<brandB>-<b>`.
  Static, crawlable, in the sitemap; the drawing is the main content.
- **An interactive `/size/` page** ("Camera Size Comparison"): the cross-brand tool with the
  size section first. Linked from the homepage by a card placed below the brand cards and
  above the intro.
- Share previews for size pages reuse the pair's existing vs-page card (it already shows
  front outlines to scale).
- Two anonymous events: `size-view:<page>:<overlay|side>` and `size-seen:<pathname>`.
  `privacy.html` lists them.

## Out of scope (agreed with the owner, 2026-11-13)

- **A lens mounted on a body.** Bodies first. Combined depth needs the mount's position
  within the body depth, which the data does not have.
- Real silhouettes or photos: the data is bounding boxes, so outlines are rounded boxes.
- A unit switch.
- Size pages for pairs whose vs-page is `noindex` (~250 of them).

## Capabilities

### New Capabilities
- `size-comparison`: the size drawing, its tool section, vs-page section, dedicated pages and
  the `/size/` page.

### Modified Capabilities
- `home-landing`: a link card to `/size/`.

## Impact

- New `size.js` (drawing + size facts; browser script that `generate-seo.js` also requires).
- `engine.js` / `engine.css` (Size section in `renderTable`, `COMPARE_CONFIG.sizeFirst`).
- `scripts/generate-seo.js` (vs-page section, size pages, `/size/` blocks, sitemap, homepage
  card, share-card outline moved onto `size.js`); new `size/index.html`; ~46 new pages.
- Every page that loads `engine.js` also loads `size.js` (brand pages, `compare/`, root).
- `analytics.js`, `privacy.html`, `CLAUDE.md`, the `add-camera-brand` skill.
- Tests: new `tests/logic/size.test.js`, `tests/data/size-pages.test.js`; loaders run `size.js`.
- **Depends on** `add-search-picker` (#88) and `add-differences-toggle` (#89): the homepage
  embed and the table code this builds on.
