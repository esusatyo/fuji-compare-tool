## Why

A vs-page is where search visitors land, and its answer is a twelve-row table: a reader has to
scan it to learn which camera has the bigger sensor, the better stabilization or the lower
price. PetaPixel's PixelMeter (reviewed Nov 2026) puts five "key spec" tiles above its table
for exactly this reason. The site also has no single statement of *which* specs are the key
ones — the vs-page table, the brand at-a-glance table and the summary sentence each pick their
own — so nothing else can reuse the choice.

## What Changes

- **Key-spec tiles on every vs-page**, same-brand and cross-brand, directly above the spec
  table: Sensor, Max video, Stabilization, Burst and Price. Each tile shows both cameras'
  values; where one is objectively better (more megapixels, more stops, more frames per
  second, lower price) it is marked in the site's "better" green. Max video is free text and
  is shown without a verdict. A dead heat marks nothing.
- **The choice of key specs is recorded once, in `site-config.js`** (`SITE_CONFIG.keySpecs`),
  the site-wide source both the browser and the generator already read (owner request,
  2026-11-14: "recorded in the data source so that we can use it elsewhere").
- **A shared module, `key-specs.js`**, defines each key spec — label, how to word a camera's
  value, and which way is better — and turns the list into tiles. It runs in Node (the
  generator) and in the browser, so the interactive tool, share cards or the brand tables can
  adopt the same tiles later without redefining them.

## Out of scope

- Tiles in the interactive tool (brand pages, `/compare/`, the homepage, `/size/`). The module
  and the list are built so that is a small follow-up.
- Key specs for lenses: nothing shows them yet, so none are recorded.
- Ranking video modes ("6.2K / 30P" against "4K / 60P" has no honest single winner).

## Capabilities

### New Capabilities
- `key-specs`: the recorded list, the shared definitions, and the tiles on vs-pages.

## Impact

- `site-config.js` (`keySpecs`), new `key-specs.js`.
- `scripts/generate-seo.js` (tiles in both vs-page templates), `engine.css` (tile styles),
  every generated vs-page.
- Tests: `tests/logic/key-specs.test.js`, `tests/data/key-specs.test.js`.
- `CLAUDE.md`.
