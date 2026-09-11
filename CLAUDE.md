# CLAUDE.md

Guidance for working in this repository. Keep it short and current — update it when a convention changes.

## What this is

A **zero-dependency static website** that compares cameras and lenses side-by-side (Apple "iPhone compare" style). Multiple camera brands share one rendering engine; each brand is a self-contained data file. Runs from `file://` or any static host — no build step, no runtime dependencies (jsdom is a dev-only test dependency). One caveat since URLs went extensionless (see below): a brand page still *renders* fine from `file://`, but its links to other pages (About, Privacy, vs-pages) only resolve through a server that maps `/page` → `page.html`.

## Architecture

- **`engine.js`** — the shared rendering engine. Resolves the active brand's dataset from the `window.BRAND_DATA` registry and renders the camera + lens comparison UI, winner highlighting, currency switching, and Amazon buy-links. Brand-agnostic.
- **`engine.css`** — shared styles + the site-wide design tokens. Two themes share one token set: dark-neutral (default, `:root`) and light "Lavender & Sand" (`:root[data-theme="light"]`), both from `assets/design/`. Page theming is brand-agnostic: `BRAND_CONFIG` has **no** color/logo fields (a test rejects them). Every header shows the shared logo lockup linking to `/?brands` (the `brands` query param suppresses the root page's stored-brand redirect). Landing brand-card stripe colors live in `BRAND_CARD_ACCENTS` in `scripts/generate-seo.js`. **To rebrand**: edit `assets/logo.svg` + the `engine.css` tokens (both theme blocks), run `node scripts/generate-seo.js` (all generated pages and the About/Privacy identity blocks derive from those two sources) and `node scripts/render-touch-icon.js` (needs Chrome), then `npm test` — brand-sync, touch-icon, and seo-freshness tests name anything left. The only inline copy is `engine.js`'s `LOGO_SVG` (runtime code can't read files).
- **`theme.js`** — shared Light/Dark/System toggle, loaded on every page (root, About/Privacy, every brand page, `compare/`). Preference lives in `localStorage['theme-pref']` (default `'system'`); a tiny inline script (part of `assetLinks()` in `scripts/generate-seo.js`, emitted before every page's `engine.css` `<link>`) applies the resolved theme to `<html data-theme>` before first paint, so there's no flash. `theme.js` itself only syncs the toggle's active button, handles clicks, and follows OS changes live while the pref is `'system'`.
- **`analytics.js`** — anonymous GoatCounter interaction events (cookieless). Every page that loads GoatCounter's `count.js` loads `analytics.js` with `defer` **directly after it** — in the hand-written heads *and* the vs-page templates in `scripts/generate-seo.js` (`tests/data/analytics.test.js` enforces both). It defines `window.trackEvent(path, title)`, which `engine.js`/`theme.js` call from their handlers (guarded, so a blocked counter is a no-op), and fires `engaged-30s:<pathname>` once after 30s of visible time. Static links use `data-goatcounter-click` instead. Event paths are `<event>:<detail>` (the grammar is in the file header); a new interactive control should report through `trackEvent`, and `privacy.html` lists what is counted — keep it true.
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
- **`focalLengthEquiv`** is a string (full-frame-equivalent focal length). APS-C brands apply their crop: Fujifilm X / Sony E / Nikon Z DX = **1.5×**, Canon RF-S = **1.6×**, Micro Four Thirds = **2.0×**. Full-frame lenses use the native focal length. **Exception: dual-fisheye/VR lenses** (Canon's `RF 5.2mm f/2.8 L Dual Fisheye`, `RF-S 3.9mm f/3.5 STM Dual Fisheye`) don't apply a crop multiplier — `focalLengthEquiv` equals the native focal length even on the RF-S body. These lenses produce twin circular-fisheye images for stereoscopic VR, not a single rectilinear frame; a "35mm-equivalent" framing multiplier has no meaning for that use case and would only mislead a reader comparing them to normal lenses.

## Mounts

Every camera and lens carries a **`mount`** id, and every `BRAND_CONFIG` declares the `mounts` it spans: `[{ id, label }]`, in the order the filter chips render. Ids: Fujifilm `x`/`g`, Panasonic `l`/`mft`, Sigma `l`/`sa`, Canon `rf`, Nikon `z`, Sony `e`.

The field used to be deliberately absent — "the brand file implies the mount" — which held while one brand meant one mount. Fujifilm (X + GFX), Panasonic (L + MFT) and Sigma (L + SA) broke that, and the mount survived only as prose inside dropdown group labels, where neither the UI nor a test could read it. It is now stored per item, on **every** brand: the redundancy on the three single-mount brands buys an unconditional rule — *every item declares its mount* — instead of one qualified with "…if the brand spans more than one".

Rules a test enforces (`tests/data/mounts.test.js`, `tests/helpers/schema.js`):
- Every camera and lens declares a `mount` that its brand declares in `mounts`, and every declared mount is used by something.
- **One dropdown group, one mount.** Group labels name the mount (`── Sigma (MFT) ──`), so a group whose members disagree makes its own label a lie. Panasonic's box cameras were the one real case (BS1H is L-Mount, BGH1 is MFT) and were split into two groups.
- A camera's mount must agree with its `sensorType` — the guard that catches a mistyped token the other two would wave through.

Two things that are **not** mount distinctions: Canon RF-S, Nikon DX and Sony E APS-C lenses share one mount with their full-frame siblings and fit those bodies (cropping, not failing), so they are `rf`/`z`/`e` like everything else. Full-frame vs APS-C is a separate property and will get its own field. And `BRAND_CONFIG.mount` (singular) is unrelated: it is landing-tile copy naming the brand's *headline* mount, which is deliberately not the full list — Fujifilm's tile says `X-Mount`, not `X-Mount / G-Mount`.

## Third-party lenses

Stored **denormalized per brand** — the same optical design (e.g. a Sigma prime sold for several mounts) is a separate entry in each brand's `data.js`, with that mount's own weight/price/`asin`/`productUrl`/`imageUrl`. There is intentionally **no shared lens catalog**, but every entry does carry a `mount` (see Mounts above) — the brand file no longer implies it, because three brands span two. Group third-party lenses under `── <Maker> ──` labels in `LENS_DROPDOWN_GROUPS`, splitting per mount where the brand spans two (`── Sigma (L-Mount) ──` and `── Sigma (MFT) ──`, not one combined Sigma group). Every `manufacturer` must have a `MANUFACTURER_COLORS` entry (a test enforces this).

The maker's own site — including its official regional sites — is authoritative on its own; a second source is only needed when its table is ambiguous, looks wrong, or lumps several mounts into one spec list (a common trap: the figures are usually the DSLR original). Otherwise corroborate with a reputable independent source. Do not copy specs blindly between brand files (some existing entries have errors). If a non-nullable field can't be sourced, skip the lens rather than guess; lenses released within the last month may be entered with nullable fields left `null` and enriched later.

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

### Pre-commit hook: automatic SEO regeneration

One-time setup after cloning (git hooks aren't version-controlled by default, but worktrees of this repo share the same hooks path once set):

```bash
git config core.hooksPath .githooks
```

With that set, `.githooks/pre-commit` runs automatically on every commit. It's a no-op unless the staged changes touch something that affects generated output (`<brand>/data.js`, `site-config.js`, `scripts/generate-seo.js`, `engine.css`, `assets/logo.svg`) — in that case it runs `node scripts/generate-seo.js`, stages whatever it wrote or removed, then runs the full `npm test` suite as a gate. If tests fail, the commit is aborted but the regenerated files stay staged, so fixing the issue and committing again doesn't require rerunning the generator by hand.

Deliberately scoped to `generate-seo.js` only — it's pure and deterministic (no network calls). The scripts that fetch external data (`fetch-images*.js`, `fetch-image-credits.js`, `compute-prices.js`, `apply-images.js`) are **not** run automatically; those need human/agent review before committing, per the sourcing rules above.

## URLs: always link clean (no `.html`)

Files on disk keep their `.html` names, but **every URL the site publishes is extensionless** — internal `<a href>`s, canonicals, `og:url`s and sitemap entries alike. The host (Cloudflare Pages) 307-redirects `/page.html` → `/page`, so a `.html` href puts a *temporary* redirect on every crawl path: it doesn't consolidate signals the way a 301 does, and it contradicts the clean canonical the destination then declares.

- Generators use `cleanHref()` in `scripts/generate-seo.js` (`vs/a-vs-b.html` → `vs/a-vs-b`, `../index.html` → `../`). `cleanUrl()` does the same for absolute URLs.
- Hand-written links (`about.html`, `privacy.html`, `engine.js`'s footer) must follow the same rule.
- `tests/data/orphan-links.test.js` enforces it: one test fails on any `.html` href, another resolves every internal link through the host's URL→file mapping so a clean link to a missing page still fails.

## Local preview

Static site — serve the directory and open a brand page:

```bash
python3 scripts/preview.py 3456   # then open http://localhost:3456/<brand>/
```

Use this rather than `python3 -m http.server`: extensionless URLs need a server that maps `/page` → `page.html`, which the stdlib one doesn't do (every vs-page link 404s). `scripts/preview.py` is stdlib-only, so the repo stays dependency-free. (`.claude/launch.json` runs the same server.)

## Adding / changing things

- **New brand**: create `<brand>/data.js` + `<brand>/index.html` (copy an existing brand, keep the registry IIFE wrap), add the brand to **every** brand's `REGISTERED_BRANDS` (a test enforces all brands list the same set), add the slug to `VALID_BRANDS` in root `index.html`, add its `data.js` `<script src>` to `compare/index.html`, add a `MANUFACTURER_COLORS` entry, and (if it has distinctive specs) a `brand`-tagged `SPEC_SECTIONS` entry + a `schema.js` validation branch. `BRAND_CONFIG` also needs `mount` (the landing-tile label, e.g. `'RF-Mount'`), `mounts` (the structured list — see Mounts above) and `heroCamera` (a current camera slug — the landing-tile showcase photo; not necessarily the technical flagship, just whichever current body has a clean freely-licensed/official product photo) — both validated by `tests/data/config.test.js`. There's an `add-camera-brand` skill and prior OpenSpec changes that document this end-to-end.
- **New lens/camera**: add the entry **including its `mount`**, add its id to the right `*_DROPDOWN_GROUPS` (one whose other members share that mount), run `npm test`.
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
