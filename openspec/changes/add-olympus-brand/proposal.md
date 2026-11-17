## Why

Micro Four Thirds is the only mount on this site carried by a brand that doesn't
own it. `panasonic/data.js` already holds **11 OM System M.Zuiko lenses** as
third-party glass — sourced, priced, image-credited, three of them credited on
`about.html` — but the cameras those lenses were designed for aren't on the site
at all. A visitor comparing MFT bodies today sees Lumix G and nothing else, which
is roughly half the system.

Olympus is also the site's first brand whose corporate identity changed mid-life.
The imaging division was sold to JIP in 2021 and now ships as **OM System**, but
the mount, the lens line and the product lineage are continuous from the 2009
PEN E-P1 to the 2025 OM-3. That makes it a good test of a rule the architecture
has implied but never exercised: a brand page is **one system**, not one company.

Unlike every previous onboarding, a meaningful slice of the data already exists
and has been verified — the 11 OM System lenses plus 28 Lumix G lenses that
become third-party glass on the Olympus page. This change is therefore less
research-heavy per item than Sigma was, but it creates the site's **second**
shared-mount brand pair, which needs the same drift guard L-Mount already has.

## What Changes

- **New `olympus/` brand directory**, modelled on `panasonic/` (closest analogue
  — same mount, same lens-line structure):
  - `olympus/data.js` — the eight dataset consts inside the
    `window.BRAND_DATA['olympus']` registration IIFE.
  - `olympus/index.html` — thin loader of `../engine.css`, `./data.js`,
    `../engine.js`.
- **Olympus camera data (~35–40 bodies, exact count set in task 1.1)** — the
  full Micro Four Thirds mirrorless lineage: PEN (`E-P`, `E-PL`, `E-PM`,
  `PEN-F`), OM-D (`E-M1`, `E-M1X`, `E-M5`, `E-M10`), and the current OM System
  bodies (`OM-1`, `OM-1 Mark II`, `OM-5`, `OM-5 Mark II`, `OM-3`). Olympus's
  **Four Thirds DSLRs (E-1…E-5) are excluded** — every brand here starts at its
  mirrorless system, never the company's camera history.
- **First-party M.Zuiko lens data (~30, current catalogue)** — every current PRO
  lens plus the current Premium/standard primes and zooms. This closes the PRO
  gap a prior audit documented; note that audit's own arithmetic is inconsistent
  ("6 of 12 present" but 8 listed missing = 14), so the true PRO count is
  resolved against the live catalogue in task 1.2 rather than asserted here.
  11 entries port directly from `panasonic/data.js`, 6 of them PRO.
  Discontinued M.Zuiko glass is deliberately deferred.
- **Third-party MFT lenses in the same change (owner decision, 2026-09-12)** —
  Panasonic's 28 current Lumix G / Leica DG lenses become third-party entries on
  the Olympus page, mirroring how M.Zuiko glass already appears under Panasonic.
  The 6 remaining MFT third parties already in `panasonic/data.js`
  (Sigma ×3, Laowa ×2, Voigtländer ×1) are included in the same pass — they cost
  2 ASIN slots and no new research, and omitting them would leave the Olympus
  lens tab visibly thinner than Panasonic's for no reason. This departs from the
  skill's "third-party lenses are a follow-up change" default, deliberately.
- **Second shared-mount pair.** `tests/data/shared-mount.test.js` gains
  `['panasonic', 'olympus', 'Micro Four Thirds']`. Its header comment already
  anticipates this exact row ("Micro Four Thirds (Panasonic/OM System if ever
  added)"). ~45 lenses will then exist in both files describing one physical
  product, and the guard pins all 25 optic fields plus `prices.USD` together.
- **Olympus-specific spec section** in `engine.js` (`brand: 'olympus'`) surfacing
  the computational features that actually distinguish these bodies — Live ND,
  High Res Shot, Pro Capture and Live Composite — plus the matching
  `brandSections.includes('olympus')` branch in `tests/helpers/schema.js`.
- **Brand registration wiring** — `REGISTERED_BRANDS` in all seven `data.js`
  files, `VALID_BRANDS` in the root redirector, `BRAND_CARD_ACCENTS` in
  `scripts/generate-seo.js`, a `compare/index.html` script tag, a
  `root-redirect.test.js` case, and `KNOWN_IMAGE_GAPS['olympus']` as images land.

`engine.js` `MANUFACTURER_COLORS` needs **no change**: `'OM System'`,
`'Panasonic'`, `'Sigma'`, `'Laowa'` and `'Voigtländer'` all already exist, and
first-party Olympus lenses keep `manufacturer: 'OM System'` (see design §3).

No existing brand's data or behaviour changes beyond registration. The 46 MFT
entries in `panasonic/data.js` stay exactly where they are.

## Capabilities

### New Capabilities
- `olympus-brand-data`: The Olympus brand dataset — the Micro Four Thirds
  mirrorless camera lineage, the current first-party M.Zuiko catalogue, and the
  third-party MFT glass — plus its registration into the multi-brand engine, the
  Olympus-specific spec section with its schema validation, and the shared-mount
  drift guard covering the Panasonic ↔ Olympus duplication.

### Modified Capabilities
<!-- None. The shared-mount guard is extended with a second row rather than
     redefined, and no existing capability under openspec/specs/ covers it. -->

## Impact

- **New files**: `olympus/data.js`, `olympus/index.html`, plus generated SEO
  pages under `olympus/vs/`.
- **Modified files**: `engine.js` (Olympus spec section), root `index.html`
  (`VALID_BRANDS`), all six existing `<brand>/data.js` (`REGISTERED_BRANDS`),
  `tests/helpers/schema.js` (Olympus field branch),
  `tests/data/shared-mount.test.js` (second pair),
  `tests/logic/root-redirect.test.js`, `tests/data/completeness.test.js`
  (`KNOWN_IMAGE_GAPS['olympus']`), `compare/index.html`,
  `scripts/generate-seo.js` (`BRAND_CARD_ACCENTS`).
- **ASIN ratchet headroom is the one real budget constraint.** 57 current items
  lack an ASIN against an `ASIN_GAP_BASELINE` of 86 — **29 slots**. Duplicating
  the Panasonic MFT corpus costs exactly **2** of them (`omsystem-17mm-f12-pro`,
  `omsystem-25mm-f18`; every Lumix G, Sigma and Laowa MFT entry already has an
  ASIN). The remaining ~27 slots must absorb every *current* new Olympus item
  without one. Discontinued bodies — most of the PEN/OM-D lineage — don't count
  against it at all. Rebase only if the population genuinely grew, and say why.
- **No new `ALLOWED_HOSTS` entry**: `omsystem.com` is already allowlisted, which
  covers `explore.omsystem.com` and its `nala.` CDN.
- **Data sources**: explore.omsystem.com (T1 for current products),
  Olympus regional archive pages and DPReview for the discontinued lineage,
  Wikipedia's MFT lens/body lists as a completeness spine, B&H/Adorama/Amazon
  for price and ASIN.
- **No dependency or build changes**; the zero-dependency static site is preserved.
