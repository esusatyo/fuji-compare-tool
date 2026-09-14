## Why

L-Mount is on the site through two of the three Alliance founders — Panasonic
and Sigma — but not the one that designed it. Leica's SL bodies and SL lenses
are the reference L-Mount system, and its M rangefinders and Q fixed-lens
full-frame cameras are the products people most often want to weigh against a
Fujifilm X100, a Sony RX1 or a Sigma BF. None of that is comparable here today.

Leica is also the site's first brand whose mirrorless lineup spans two
**unrelated** mounts that share one sensor format: SL (L-Mount) and M are both
full-frame, and Q is full-frame with no mount at all. Every existing multi-mount
brand could tell its mounts apart by sensor (Fujifilm X vs GFX, Panasonic
full-frame vs MFT, Sigma Bayer vs Foveon). Leica can't, so two mount guards in
`tests/data/mounts.test.js` need a second discriminator, and it's the first
brand with a current lens catalogue whose designs predate the 2008 year floor.

## What Changes

- **New `leica/` brand directory**, modelled on `sigma/` (closest analogue —
  L-Mount, a fixed-lens line, and a second mount):
  - `leica/data.js` — the eight dataset consts inside the
    `window.BRAND_DATA['leica']` registration IIFE.
  - `leica/index.html` — thin loader of `../engine.css`, `./data.js`,
    `../engine.js`.
- **Leica camera data (exact count set in task 1.1)** — every Leica mirrorless
  body across five lines (owner scope call, 2026-09-14):
  - **SL** (full-frame L-Mount): SL (Typ 601), SL2, SL2-S, SL3, SL3-S, SL3-P.
  - **TL / CL** (APS-C L-Mount): T (Typ 701), TL, TL2, CL.
  - **M digital rangefinders** (M-Mount): M8 onward, including Monochrom,
    -P, -D, -E, -R variants and the EVF-based M EV1.
  - **Q** (full-frame, fixed lens): Q (Typ 116), Q2, Q2 Monochrom, Q3, Q3 43,
    Q3 Monochrom.
  - **Compacts** (fixed lens, largely Panasonic-derived): D-Lux, V-Lux, C-Lux
    lines within the year floor.
  - **Excluded**: the S system (medium-format DSLRs — mirrorless-only rule),
    film M bodies (M6, M-A, MP), and anything before the year floor. Leica X
    (fixed-lens APS-C), SOFORT and discontinued SL/TL lenses are **open scope
    questions** raised with the owner in task 1.4.
- **First-party lens data** — **current** M lenses only (owner call), current
  SL lenses, and TL lenses per task 1.4.
- **Two mounts**: `l` (reusing Panasonic/Sigma's `L-Mount` id exactly) and a new
  `m` (`M-Mount`). Fixed-lens bodies follow the existing precedent — system
  mount id plus `lensType: 'Fixed'` (owner call, 2026-09-14).
- **Test-rule adaptations** (design §3–§5):
  - `mounts.test.js` `SENSOR_RULES` gains a Leica rule keyed on `series`, since
    `sensorType` can't separate SL, M and Q.
  - `mounts.test.js` `LENS_CROP` learns a per-`line` override so TL lenses
    (1.5×) can share `l` with SL lenses (1.0×).
  - `schema.js` year floors lowered, with comments, for the M8 (2006) and
    for current M lens designs older than 2008.
- **Leica-specific spec section** (fields confirmed in task 1.3; design §6).
- **Registration**: all eight brands' `REGISTERED_BRANDS`, root `VALID_BRANDS`,
  `compare/index.html`, `BRAND_CARD_ACCENTS`, root-redirect tests.
  `MANUFACTURER_COLORS['Leica']` already exists and is reused.
- **`ASIN_GAP_BASELINE` rebase** for the Leica population, in its own commit
  naming every Leica item without a verified ASIN (owner approved 2026-09-14).

## Capabilities

### New Capabilities

- `leica-brand-data`: the Leica brand directory, its registration, its two
  mounts, the Leica-specific test-rule adaptations and the dataset rules its
  cameras and lenses follow.

### Modified Capabilities

None.

## Impact

- **New**: `leica/data.js`, `leica/index.html`, generated vs-pages and SEO blocks.
- **Edited**: every brand's `data.js` (`REGISTERED_BRANDS` only), `index.html`,
  `compare/index.html`, `engine.js` (`SPEC_SECTIONS`), `scripts/generate-seo.js`
  (`BRAND_CARD_ACCENTS`), `tests/helpers/schema.js`, `tests/data/mounts.test.js`,
  `tests/data/completeness.test.js` (`KNOWN_IMAGE_GAPS`),
  `tests/data/links-offline.test.js` (baseline), `tests/logic/root-redirect.test.js`.
- **No behaviour change** for existing brands. `SAME_MOUNT_BRANDS` in
  `tests/data/shared-mount.test.js` does **not** gain a Leica row here: it
  requires shared lens ids, and Leica's first-party lenses aren't in Panasonic
  or Sigma files. That row belongs to the third-party follow-up.
