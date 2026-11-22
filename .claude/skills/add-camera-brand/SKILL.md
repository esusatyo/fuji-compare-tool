---
name: add-camera-brand
description: Add a brand-new camera brand (e.g. Nikon, OM System, Panasonic) to the multi-brand comparison tool end-to-end — research and validate the brand's cameras and lenses, scaffold the brand directory, wire it into the shared engine, add any brand-specific spec section, and verify the test suite. Use when the user wants to add/onboard a new camera brand.
metadata:
  author: fuji-compare-tool
  version: "1.2"
---

Add a new camera brand to this repo end-to-end. This skill is **brand-agnostic** —
substitute the target brand's name and `<slug>` (kebab-case directory name)
throughout. It was distilled from the Sony onboarding
(`openspec/changes/add-sony-brand/`), which is a complete worked example.

The tool is a zero-dependency static site: a shared `engine.js` + `engine.css`
render any brand whose `<brand>/data.js` registers a fixed dataset shape under
`window.BRAND_DATA[<slug>]`. Adding a brand is **purely additive** — no existing
brand changes except registration.

---

## Keep the methodology current

If this work changes **how we collect, choose or verify data** (specs, prices, images, scope,
a trusted or banned source, an exception, any owner decision), update these in the same commit:

1. `docs/data-methodology.md`: the rule, plus a dated row in its decision log. Mark a replaced
   rule superseded; never delete it.
2. `methodology.html` (the public /methodology page): the rule in plain words, plus the matching
   "Rule changes" row. Its test only compares row counts, so it won't catch stale wording: reread it.
3. Every other skill, and `CLAUDE.md`, that restates the rule.
4. `about.html` if it now says something untrue. Articles are frozen: tell the owner which
   sentence is out of date and let them decide.

A rule is not proof that the data follows it. Before public copy says "every", "never" or
"always", count in the data, and state the gap if there is one.

## Golden rules

- **Accuracy first.** The manufacturer's own page, PDF or manual is enough on its own
  for a spec; an independent measured review is the only backup. Retailers are for
  prices and ASINs only, and Wikipedia and spec databases never set a spec
  (`docs/data-methodology.md`, section 1).
- **Work in small, test-checkpointed batches.** After every batch run
  `npm run test:data` (or `npm test`). A partial dataset stays green as long as
  every *entered* item is complete. This makes the work resumable across sessions.
- **Match the existing pattern.** Clone the closest existing brand's `data.js`
  (interchangeable-lens → `canon/`; fixed-lens heavy → `fujifilm/`) and replace
  data. Keep each brand a standalone browser script (no imports/exports).
- **Never fabricate.** If a spec/price/ASIN/image can't be confirmed, use the
  documented escape (`null`, `priceIncomplete`, `KNOWN_IMAGE_GAPS`) — don't guess.

---

## Step 1 — Research & enumerate (no code yet)

Research the brand's lineup on the web and write enumeration notes (a scratch dir
or an OpenSpec change's `research/` folder works well):

- **Cameras**: comprehensive list (current + notable discontinued) as
  `slug | name | series | year | discontinued | launch USD`.
- **Lenses**: first-party lenses as `slug | name | line | type (Prime/Zoom) |
  focal | aperture | year`. (Wikipedia "List of <brand> … lenses" is a good spine.)
- Decide: **series labels** (drive `SERIES_COLORS` + dropdown grouping), the
  **accent/hero colours**, and whether the brand needs a **brand-specific spec
  section** (see Step 4) and which fields it adds.

## Step 2 — Scaffold `<brand>/`

- `cp canon/index.html <brand>/index.html`; update the `<title>`. It just loads
  `../engine.css`, `./data.js`, `../engine.js`.
- Create `<brand>/data.js` from `canon/data.js`. Cloning keeps the registry
  wrap intact — just update the registration key:
  `window.BRAND_DATA['<slug>'] = (() => { … })();` (first line after the
  `window.BRAND_DATA = window.BRAND_DATA || {};` guard) — and define the eight
  dataset consts the engine expects inside that IIFE, returned at the end:
  `BRAND_CONFIG`, `SERIES_COLORS`, `CAMERAS`, `CAMERA_ORDER`,
  `DROPDOWN_GROUPS`, `LENSES`, `LENS_DROPDOWN_GROUPS`, `REGISTERED_BRANDS`.
  - `BRAND_CONFIG`: name, `slug` (= directory name, matches the registry key),
    `families[]`, `brandSections: ['<slug>']` (or `[]` if no brand section),
    `mount` (e.g. `'RF-Mount'` — shown on the landing-page brand tile),
    `heroCamera` (a current camera slug — the landing-tile showcase photo;
    pick whichever current body has a clean freely-licensed or official
    product photo, not necessarily the technical flagship — both validated
    by `tests/data/config.test.js`), `cameras`/`lenses` sub-configs (hero
    copy + `defaultSelected` of 1–3 ids), `footerLinks[]` (https). No
    theming fields — page colors come from the site-wide design tokens in
    `engine.css`, and a test rejects `accentColor`/`heroDark`/`logoText`/
    `logoAccent` if reintroduced. The landing-page card stripe color lives
    in `BRAND_CARD_ACCENTS` in `scripts/generate-seo.js` — add the new
    brand there.
  - Start with empty `CAMERAS`/`LENSES` and seed during Steps 5–6.
  - No camera or lens slug may contain `:` — it's reserved as the brand/slug
    separator on the cross-brand `/compare/` page.
- `node --check <brand>/data.js` to confirm valid JS.

## Step 3 — Wire registration (do before bulk data)

The data tests auto-discover any directory with a `data.js`, so wire these
**together** to keep the suite consistent:

1. Add `{ slug: '<slug>', name: '<Name>' }` to `REGISTERED_BRANDS` in **every**
   brand's `data.js` (all must list the identical set — `config.test.js` enforces).
2. Nothing to edit in the root `index.html`: its brand cards, its camera search index and the
   list of data files it fetches are all generated from the brand directories (`node scripts/generate-seo.js`).
3. Add a `'<Manufacturer>'` entry to `MANUFACTURER_COLORS` in `engine.js` (used
   for lens placeholder cards; `manufacturer` on each lens must match a key here).
4. No homepage test to extend: `tests/logic/home-embed.test.js` checks that the generated
   search index and fetch list cover every brand directory, so a missing regeneration fails there.
5. Add `<script src="../<slug>/data.js"></script>` to `compare/index.html`, **`size/index.html` and `kit/index.html`**
   (alongside the other brands, before `engine.js`) so the cross-brand compare
   page picks up the new brand's cameras.

## Step 4 — Brand-specific spec section (optional)

If the brand has distinctive specs (Fuji = Film Sims; Canon = DPAF/C-Log;
Sony = Log/AI AF):

1. Add a section to `SPEC_SECTIONS` in `engine.js` tagged `brand: '<slug>'`
   (render-gated by `BRAND_CONFIG.brandSections`). Each row: `{ key, label, type,
   fn, ... }` reading the new camera fields.
2. Add a `brandSections.includes('<slug>')` branch to `tests/helpers/schema.js`
   validating those fields (type/nullable). `referential.test.js` checks every
   `brandSection` maps to a real `SPEC_SECTIONS` entry.

## Step 5 — Camera data, in batches

**Spec conventions** (which of a maker's several figures to store) are owned by
`docs/data-methodology.md`, the single source of truth for every owner decision; read it
before entering specs. If you settle a new convention with the owner, add it there
(table row + decision log, dated, with the reason) and then here.

Fill `CAMERAS` in small batches (by era/line); after each, add ids to
`CAMERA_ORDER` (must match `CAMERAS` exactly) and `DROPDOWN_GROUPS` (every camera
in exactly one group), then `npm run test:data`.

- **Current bodies** need all 7 currency prices (`USD AUD EUR GBP JPY CAD SGD`)
  and benefit from a verified `asin`.
- **Discontinued bodies** may use `USD` only (other currencies `null`); `asin`
  may be `null` (engine falls back to an Amazon search link).
- Every camera needs a **`mount`** id declared in `BRAND_CONFIG.mounts`, and it
  must agree with its `sensorType` (`tests/data/mounts.test.js` re-derives it).
  A brand spanning one mount still declares a one-entry `mounts` array and still
  tags every item. A brand spanning two (Fujifilm X/G, Panasonic L/MFT, Sigma
  L/SA) also needs each dropdown group to hold a single mount — that is what
  drives the mount filter chips.
- Every `series` value needs a `SERIES_COLORS` entry. Match the camera field
  shape exactly (see `tests/helpers/schema.js` `validateCamera`): sensor, body,
  display/EVF (nullable for no-EVF cinema bodies), AF, IBIS, video, connectivity,
  storage, power, plus any brand fields. `bluetooth` may be a version string,
  `false`, or `null`.
- Camera spec conventions (owner decisions, full list and reasons in `docs/data-methodology.md`):
    weight **with battery and card**; `lcdDots` in thousands, `evfDots` in millions;
    `evfMag` **35mm-equivalent** (divide native by the crop) and, on hybrid finders, the
    **optical** figure; `ibisStops` **body-only**, never Sync IS / Dual I.S.; `sensorMP`
    effective (Foveon: top layer); battery = CIPA, Fujifilm Normal mode, Nikon Energy-saving
    OFF, Panasonic the SD-card set, split into `batteryLifeLcd` / `batteryLifeEvf` when the
    maker gives both (hybrid finders: `batteryLifeEvf` + `batteryLifeOvf`, `batteryLifeLcd:
    null`); burst split into `maxBurstMech` (electronic first curtain counts as mechanical)
    / `maxBurstElec` (incl. crop modes, `maxBurstElecCrop`; Nikon C30/C60/C120 excluded);
    `weatherSealed` only on a maker claim (silence, a mount gasket, or sealing that needs an
    accessory = `false`; conflicting maker pages = `false` until a third maker source).
- **Engine renders `numSlots = 3`** from `defaultSelected`, and the picker dedup
  test needs a 4th non-default camera — so the first green checkpoint needs
  **≥4 cameras** entered with `defaultSelected` pointing at 3 of them.

## Step 6 — Lens data, in batches

Fill `LENSES` in batches by line (e.g. GM/G/standard, then APS-C; primes then
zooms). After each, update `LENS_DROPDOWN_GROUPS` (every lens in exactly one
group) and `npm run test:data`.

- Match `validateLens`: `type` ∈ {`Prime`,`Zoom`}; primes set `focalLength`,
  zooms set `focalLengthMin`<`focalLengthMax` (and `focalLength: null`);
  `focalLengthEquiv` string (APS-C → 1.5×/1.6× crop equivalent); aperture,
  optics, size, `afType`, `weatherSealed`, `ois`/`oisStops`, year, discontinued.
- Lens spec conventions (full list in `docs/data-methodology.md`): bare-lens weight;
    length without hood, zoom shortest; `minFocusDist` cm, shortest across the range, the
    **AF** figure where AF and MF differ (same for `maxMagnification`); `minAperture` on
    variable zooms = the **wide-end** minimum; fixed-aperture lenses store min = max;
    `weatherSealed` only on a maker claim.
- `manufacturer` must match a `MANUFACTURER_COLORS` key (first-party = the brand).
- Lenses may set `priceIncomplete: true` to ship with `USD` (+ partial regional)
  and skip the all-currencies check; discontinued lenses may be `USD`-only.
  `asin` may be `null` initially — backfill via the price/buy-link skill.

## Step 7 — Images & pricing finalisation

- **Images** — every camera/lens needs a non-null `imageUrl` **or** an entry in
  `KNOWN_IMAGE_GAPS[<slug>]` in `tests/data/completeness.test.js` (the documented
  "no freely-licensed image yet" escape; it self-cleans — the test fails if an
  allowlisted item later gains an image). Prefer Wikimedia Commons (stable https).
  - **Use `scripts/fetch-images-commons.js <brand> [cameras|lenses|all] [--apply]`.**
    It sources from curated Commons **category members** + strict model-token
    file-search, so it's reliable (cameras especially). Run it **without**
    `--apply` first and eyeball the printed `id -> url` map; a model code that only
    appears in a trailing `(...)` is usually the *capture* camera, not the subject
    — the tool already rejects those, but sanity-check anything surprising
    (download + view a thumbnail when unsure). Then re-run with `--apply`, remove
    the filled ids from `KNOWN_IMAGE_GAPS`, and run `scripts/verify-images.js <brand>`.
  - Do **not** rely on the older `scripts/fetch-images.js` (fuzzy name-match —
    returns wrong subjects). Lenses are rarely on Commons; expect most to stay on
    the placeholder card (allowlisted), which is fine.
- **Pricing** — use cited local prices first. `scripts/compute-prices.js <brand> cameras`
  estimates what is still missing for current cameras (approximate); never run its fill
  mode on new lenses (owner 2026-10-24). Put any confirmed regional figures in
  `scripts/price-overrides/<brand>.json`. Flag unconfirmable lens regional prices
  `priceIncomplete: true`.
- **ASINs** — fill missing `asin`s with the **check-prices-and-buy-links** skill
  (search amazon.com by the brand's model code, e.g. Sony `SEL…`, and pick the
  plain product listing — not a bundle/Renewed/International) so Buy buttons hit
  the product page, not a search.

## Step 8 — Verify

- `node scripts/generate-seo.js` — generates the brand's head/body blocks, vs-pages
  and sitemap entries. The new pages get today's `<lastmod>` in
  `sitemap-lastmod.json`; commit it and `sitemap.xml` with the brand.
- `npm test` must be fully green (data + logic; logic tests auto-cover the
  new brand — winners, currency, pickers, buy-links, spec-section gating, switcher).
- Optionally `RUN_LINK_TESTS=1 npm run test:links` to spot-check live URLs.
- Manually open `<brand>/index.html` (preview server): confirm dropdown groups,
  brand switch in/out, currency switching, winner highlighting, the brand-specific
  section, and Buy links for both cameras and lenses.

## Step 9 — Merge & close out

- Open the PR; after it merges, **archive the OpenSpec change**
  (`/opsx:archive`) so its delta specs sync into `openspec/specs/` and
  `openspec/changes/` stays a list of genuinely open work.
- **Third-party lenses are a follow-up change**, not part of onboarding: propose
  a separate `add-thirdparty-lenses-<brand>` OpenSpec change following the
  conventions in CLAUDE.md (denormalized per brand, no `mount` field,
  `── <Maker> ──` dropdown groups, every `manufacturer` in
  `MANUFACTURER_COLORS`). The archived `add-thirdparty-lenses-*` changes are
  worked examples.

---

## Full wiring checklist (don't miss one)

- [ ] `<brand>/data.js` + `<brand>/index.html`
- [ ] `BRAND_CONFIG.mount` + `BRAND_CONFIG.heroCamera` set (landing-tile mount badge + photo)
- [ ] `BRAND_CARD_ACCENTS` in `scripts/generate-seo.js` has the new brand's stripe color
- [ ] `REGISTERED_BRANDS` updated in **all** brands' `data.js` (identical sets)
- [ ] root `index.html` regenerated (brand card + the brand's cameras in the search index)
- [ ] `engine.js` `MANUFACTURER_COLORS` has the brand
- [ ] (optional) `engine.js` `SPEC_SECTIONS` brand section + `schema.js` branch
- [ ] `npm test` green, including `tests/logic/home-embed.test.js` (index ↔ brand files)
- [ ] `compare/index.html`, `size/index.html` and `kit/index.html` load `<brand>/data.js`
- [ ] new items in `KNOWN_IMAGE_GAPS[<slug>]` until images land
- [ ] `generate-seo.js` re-run; `sitemap-lastmod.json` + `sitemap.xml` committed
- [ ] `npm test` green
- [ ] OpenSpec change archived after the PR merges

## Resumability

Because datasets are large, treat each batch as an independently-committable unit
ending in a green checkpoint; commit after each. If interrupted, the next session
resumes at the first incomplete batch with no lost context. Track progress in an
OpenSpec change's `tasks.md` (see `openspec/changes/add-sony-brand/` for the
template that drove the Sony onboarding).
