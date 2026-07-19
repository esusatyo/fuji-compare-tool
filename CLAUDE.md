# CLAUDE.md

Guidance for working in this repository. Keep it short and current — update it when a convention changes.

## What this is

A **zero-dependency static website** that compares cameras and lenses side-by-side (Apple "iPhone compare" style). Multiple camera brands share one rendering engine; each brand is a self-contained data file. Runs from `file://` or any static host — no build step, no runtime dependencies (jsdom is a dev-only test dependency).

## Architecture

- **`engine.js`** — the shared rendering engine. Resolves the active brand's dataset from the `window.BRAND_DATA` registry and renders the camera + lens comparison UI, winner highlighting, currency switching, and Amazon buy-links. Brand-agnostic.
- **`engine.css`** — shared styles + the site-wide design tokens (dark-neutral theme from `assets/design/`, purple/teal accents). Page theming is brand-agnostic: `BRAND_CONFIG` has **no** color/logo fields (a test rejects them). Every header shows the shared logo lockup linking to `/?brands` (the `brands` query param suppresses the root page's stored-brand redirect). Landing brand-card stripe colors live in `BRAND_CARD_ACCENTS` in `scripts/generate-seo.js`. **To rebrand**: edit `assets/logo.svg` + the `engine.css` tokens, then run `npm test` — `tests/data/brand-sync.test.js` fails listing every file still carrying the old identity (inline logo copies, theme-color metas, rgba fallbacks, About/Privacy token copies); re-render `apple-touch-icon.png` by hand.
- **`<brand>/data.js`** — one per brand (`canon/`, `fujifilm/`, `nikon/`, `panasonic/`, `sony/`). Each file wraps its data in an IIFE and registers it as `window.BRAND_DATA[<slug>] = (() => { …; return { BRAND_CONFIG, SERIES_COLORS, CAMERAS, CAMERA_ORDER, DROPDOWN_GROUPS, LENSES, LENS_DROPDOWN_GROUPS, REGISTERED_BRANDS }; })();` — this lets several brands load on one page (see `compare/`) without top-level `const` name collisions. No camera/lens slug may contain `:` (reserved as the compare page's brand/slug separator).
- **`<brand>/index.html`** — a thin loader: `../engine.css` → `./data.js` → `../engine.js`.
- **`index.html`** (root) — a redirector that sends visitors to a brand directory based on `localStorage['brand']` (`VALID_BRANDS` / `DEFAULT_BRAND`).
- **`compare/index.html`** — the cross-brand comparison page. Loads every brand's `data.js` plus an inline `window.COMPARE_CONFIG`, which switches the engine into cross-brand mode: cameras only, 2–4 user-adjustable slots (clamped to 2 below the 600px breakpoint), items addressed as `<brand>:<slug>`. Adding a brand means adding its `<script src>` here too.
- **`engine.js` shared lookups** — `MANUFACTURER_COLORS` (lens card colors, keyed by `manufacturer`) and `SPEC_SECTIONS` (spec rows). A spec section tagged `brand: '<slug>'` renders on a brand page only when that slug is in `BRAND_CONFIG.brandSections`; on the compare page it renders whenever any selected camera belongs to that brand, with foreign cameras' cells showing "—".

Each brand `data.js` is a **standalone browser script** (plain `const` globals inside the registration IIFE, no modules/imports). Don't introduce shared imports between brand files or `engine.js` — the loader and tests depend on this "each brand is one self-contained script" invariant.

## Data model

`CAMERAS` and `LENSES` are objects keyed by slug (e.g. `'x-t5'`, `'sigma-56mm-f14'`). Lens entries carry a `manufacturer` field (first-party = the brand; third-party = `Sigma`, `Tamron`, `Viltrox`, etc.). Field shapes and rules live in **`tests/helpers/schema.js`** — treat it as the source of truth.

Key conventions:
- **Prices**: `prices` object with 7 currencies (`USD, AUD, EUR, GBP, JPY, CAD, SGD`). `USD` must be a positive number. Missing regional prices are `null`.
  - A **current** item missing any currency must set `priceIncomplete: true` (explicit "no regional RRP available"); this exempts it from the currency-completeness check but still requires a valid USD price.
  - **Discontinued** items (`discontinued: true`) may legitimately be USD-only — no `priceIncomplete` needed.
- **Buy links**: generated at render time. If an item has an `asin` (10-char Amazon ID), the button deep-links to `/dp/<asin>` on the currency's regional marketplace; otherwise it falls back to an Amazon search. So `asin: null` is always safe.
- **Images**: `imageUrl` should be a live `https` URL. Items with no freely-licensed image are allowlisted in `KNOWN_IMAGE_GAPS[<brand>]` in `tests/data/completeness.test.js` (a documented exception, not a silent skip — the test fails if a gapped item later gains an image).
- **`focalLengthEquiv`** is a string (full-frame-equivalent focal length). APS-C brands apply their crop: Fujifilm X / Sony E / Nikon Z DX = **1.5×**, Canon RF-S = **1.6×**, Micro Four Thirds = **2.0×**. Full-frame lenses use the native focal length.

## Third-party lenses

Stored **denormalized per brand** — the same optical design (e.g. a Sigma prime sold for several mounts) is a separate entry in each brand's `data.js`, with that mount's own weight/price/`asin`/`productUrl`/`imageUrl`. There is intentionally **no shared lens catalog and no `mount` field**; the brand file implies the mount, and dropdown group labels carry it where a brand spans two mounts (Panasonic L-mount vs MFT). Group third-party lenses under `── <Maker> ──` labels in `LENS_DROPDOWN_GROUPS`. Every `manufacturer` must have a `MANUFACTURER_COLORS` entry (a test enforces this).

Verify specs against ≥2 reputable sources (manufacturer page + retailer/DPReview); do not copy specs blindly between brand files (some existing entries have errors). If a required field can't be sourced, skip the lens rather than guess.

## Tests

`node --test` + `jsdom`. Run before every commit:

```bash
npm test          # data + logic tiers (the gate)
npm run test:data # Tier 1: schema, referential integrity, config, completeness
npm run test:logic# Tier 2: jsdom render — winners, currency, pickers, buy-links, redirect
npm run test:links# opt-in live URL check (RUN_LINK_TESTS=1); slow, network
```

- **Tier 1 auto-discovers every brand directory** via `tests/helpers/load-brand.js` — add a brand or lens and it's validated automatically.
- Referential tests catch orphans/dupes: every dropdown id must resolve, every camera/lens must appear in exactly one dropdown group, `CAMERA_ORDER` must match `CAMERAS`, `defaultSelected` must resolve.
- Brand-specific camera fields are validated conditionally in `schema.js` under a `brandSections.includes('<slug>')` branch.

## Local preview

Static site — serve the directory and open a brand page:

```bash
python3 -m http.server 3456   # then open http://localhost:3456/<brand>/
```

(`.claude/launch.json` configures the same server.)

## Adding / changing things

- **New brand**: create `<brand>/data.js` + `<brand>/index.html` (copy an existing brand, keep the registry IIFE wrap), add the brand to **every** brand's `REGISTERED_BRANDS` (a test enforces all brands list the same set), add the slug to `VALID_BRANDS` in root `index.html`, add its `data.js` `<script src>` to `compare/index.html`, add a `MANUFACTURER_COLORS` entry, and (if it has distinctive specs) a `brand`-tagged `SPEC_SECTIONS` entry + a `schema.js` validation branch. There's an `add-camera-brand` skill and prior OpenSpec changes that document this end-to-end.
- **New lens/camera**: add the entry, add its id to the right `*_DROPDOWN_GROUPS`, run `npm test`.
- **New cross-brand vs-page**: add a resolved pair to `CROSS_BRAND_MATCHUPS` in `scripts/generate-seo.js`, then `node scripts/generate-seo.js` (fails loudly on an unresolvable brand/slug or a same-brand/duplicate pair).

## Workflow & conventions

- **Planning uses OpenSpec** (`openspec/changes/<name>/` with proposal/design/tasks/spec + research). `openspec validate <name> --strict` should pass; archive a change after its PR merges.
- **Git**: branch off `main` for changes; one logical change per PR. Because `engine.js` (`MANUFACTURER_COLORS`) is shared, parallel brand branches will conflict there — resolve by taking the **union** of color entries.
- Keep changes minimal and match surrounding style (the data files are hand-formatted, aligned `const` object literals).

## Effort policy
- Medium by default.
- High only for: hard debugging, multi-file refactors,
  architecture calls.
- Low for: formatting, renames, boilerplate.

## Model routing
- Default to Sonnet 5 for everything.
- Escalate to Opus 4.8 only after two failed Sonnet attempts,
  or for the deepest reasoning tasks.

## Cost note
- Intro pricing ($2/$10) ends Aug 31, 2026. Run large batch
  jobs before then where possible.
