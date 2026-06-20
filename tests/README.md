# Test Harness

Correctness checks for the multi-brand comparison tool. The source files
(`*/data.js`, `engine.js`) stay 100% browser-compatible — the harness loads
them into [jsdom](https://github.com/jsdom/jsdom) and bridges their top-level
`const` globals via a small shim (see `helpers/load-brand.js`).

Every suite runs against **all** brand directories automatically (any folder
containing a `data.js`).

## Commands

```bash
npm test          # Tier 1 + 2 — offline, fast, safe for pre-commit / CI
npm run test:data # Tier 1 only (data validation)
npm run test:logic# Tier 2 only (engine logic)
npm run test:links# Tier 3 — network link/image liveness (opt-in, see below)
npm run test:all  # everything
```

Requires `npm install` once (adds `jsdom`). Node 18+ (uses built-in
`node:test` and global `fetch`).

## Tiers

### Tier 1 — Data (`tests/data/`)
- **schema** — every camera/lens has required fields with correct types and
  sane ranges (`helpers/schema.js`). `null` is allowed where the UI handles it
  (e.g. non-USD prices, unknown optical formulas, `bluetooth: false`).
- **config** — `BRAND_CONFIG`, sub-configs, footer links, and
  `REGISTERED_BRANDS` integrity; slug matches the directory; all brands list
  the same switcher set.
- **referential** — the high-value cross-checks: dropdown ids ↔ `CAMERAS`/
  `LENSES` (no orphans either way), `CAMERA_ORDER` completeness, no duplicate
  ids, `defaultSelected` resolves, every `series`/`manufacturer` has a colour
  entry, `brandSections` map to real spec sections.

### Tier 2 — Logic (`tests/logic/`)
Drives the real engine through the DOM (`helpers/dom.js`):
- **winners** — `computeWinners` higher/lower-better, ties, no-winner specs.
- **pickers** — dropdown dedup, mode toggle (cameras ↔ lenses), brand-section
  visibility, brand switcher persistence.
- **currency** — `formatPrice`, currency switching, lens USD fallback.

### Tier 3 — Links (`tests/links/`) — STUB
URL collector is real; the network checker is stubbed (`checkUrl` throws) and
marked `todo`. Skipped unless `RUN_LINK_TESTS=1` (set by `npm run test:links`).
Intended status policy when implemented: `404/410` → fail, `403/429/503`
(anti-bot) → warn, images must return `image/*`. Best run on a schedule, never
as a blocking hook.

## Adding a brand
Drop in `<brand>/data.js` + `<brand>/index.html`. All suites pick it up with no
further wiring.
