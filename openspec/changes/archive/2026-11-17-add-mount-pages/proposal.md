## Why

The site holds 1,532 lenses, but crawlers see only their counts: brand pages list current
cameras in a static table and lenses as "183 lenses: Fujifilm 120, Sigma 14, …". Nothing
answers "which lenses fit an L-Mount body?" in crawlable text, and the shared mounts are split
across brand files — L-Mount over Leica, Panasonic and Sigma, Micro Four Thirds over Olympus and
Panasonic — so no page shows a whole mount. Every camera and lens already records its `mount`,
so the data for such pages exists.

## What Changes

- **One static page per lens mount that has lenses** (owner decision, 2026-11-14): every
  interchangeable-lens body for that mount from every brand file, then every lens that fits it,
  grouped by maker with a jump list. Current items first, discontinued ones included and
  marked. Fixed-lens cameras are left off. No hand-written intro: a generated one-line
  summary of counts only.
- **Addresses named after the mount, never the sensor format** (owner decision):
  `/mount/l-mount`, `/mount/e-mount`, `/mount/rf-mount`, `/mount/z-mount`, `/mount/x-mount`,
  `/mount/g-mount`, `/mount/m-mount`, `/mount/micro-four-thirds-mount`, plus an index at
  `/mount/`. Sigma SA (two discontinued bodies, no lenses) gets no page.
- **Linked from the homepage**: a "Browse by lens mount" section directly after the brand
  cards; from each brand page's at-a-glance section; from the index; and in the sitemap.
- Sony E (356 lenses) stays one long page for now; splitting long mount pages is a known
  follow-up (owner, 2026-11-14).

## Capabilities

### New Capabilities
- `mount-pages`: the per-mount pages, the index, and the links to them.

### Modified Capabilities
- `home-landing`: a "Browse by lens mount" section after the brand cards.

## Impact

- `scripts/generate-seo.js` (mount pages, index, homepage section, brand-page links, sitemap,
  stale-file removal), `engine.css` (homepage mount links), ~9 new generated pages.
- Reuses `kit.js`'s lens catalogue for cross-brand de-duplication of shared-mount lenses.
- `analytics.js` grammar and `privacy.html` (one new link event), `CLAUDE.md`.
- Tests: `tests/data/mount-pages.test.js`.
