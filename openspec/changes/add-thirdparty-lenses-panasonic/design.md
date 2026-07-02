## Context

`panasonic/data.js` defines `LENSES` and `LENS_DROPDOWN_GROUPS` spanning two
mounts — L-mount (full-frame LUMIX S) and MFT (LUMIX G). The first-party lenses
are already grouped by mount. The shared `engine.js` renders any lens with a
`manufacturer` field, colours the card from `MANUFACTURER_COLORS`, and builds
per-currency Amazon Buy links from `asin` or a search fallback. Tests
auto-discover brands and validate against `tests/helpers/schema.js`.

Panasonic is the highest-volume third-party target in this change set because it
covers **two** mounts, and each has a deep catalogue — L-mount via the Sigma-led
L-Mount Alliance, MFT via the long-established Four Thirds ecosystem (OM System /
Olympus being the standout cross-shop). The mechanism is identical to the
Fujifilm/Sony/Nikon third-party changes; the extra work is volume and the
two-mount split.

## Goals / Non-Goals

**Goals:**
- Add comprehensive third-party lenses for **both** mounts:
  - L-mount: Sigma (full DG DN line), Leica SL, Voigtländer, Samyang, Laowa,
    TTArtisan/7Artisans/Astrhori.
  - MFT: OM System/Olympus (M.Zuiko), Sigma DN/DC DN, Voigtländer Nokton f/0.95,
    Laowa, Sirui, 7Artisans/TTArtisan/Meike/Yongnuo.
- Every entry **mount-specific and reference-verified** (≥2 sources): specs, RRP
  (7 currencies or `priceIncomplete`), `productUrl`, `asin`/search fallback,
  `imageUrl`. MFT lenses carry `focalLengthEquiv` = 2.0× crop.
- Keep the two mounts visually separated in the dropdown (group labels name the
  mount). Every manufacturer has a card colour.
- Resumable in small per-mount, per-manufacturer batches with test checkpoints.

**Non-Goals:**
- No shared cross-mount catalogue, `mount` field on the lens object, or
  cross-mount UI. (Mount is conveyed by dropdown group label + `focalLengthEquiv`.)
- No changes to Panasonic cameras or first-party LUMIX lenses; no engine/currency
  changes.
- No exhaustive vintage Four Thirds (non-micro) glass or discontinued clones —
  scope bounded in D7.
- Leica SL lenses are included as notable/premium options but not exhaustively
  (the full Leica catalogue is large and niche); representative coverage only.

## Decisions

### D1: Denormalized, per-brand storage (no shared catalogue, no `mount` field)
Store each lens as an L or MFT instance in `panasonic/data.js`. Same-design
copies for other mounts (e.g. Sigma DG DN on Sony E) live in their own brand
files. Alternatives (shared catalogue, `mount` field) rejected — engine change +
taxonomy + tests for no rendering benefit; per-mount specs differ anyway. The
L-vs-MFT distinction is expressed via **dropdown group label** and
`focalLengthEquiv` (2.0× for MFT, native for L), not a new schema field —
matching how the first-party LUMIX S vs G lenses are already separated.

### D2: Slug and naming conventions
`<maker>-<focal>-<aperture>[-mount|variant]`. Because the same maker (esp. Sigma)
ships for both mounts, **append a mount discriminator when a collision is
possible**: e.g. `sigma-30mm-f14-l` (L-mount DC DN) vs an MFT `sigma-30mm-f28-dn`.
Prefer the natural distinction where focal/aperture already differ. Examples:
`omsystem-12-40mm-f28-pro`, `leica-sl-50mm-f2`, `voigtlander-nokton-25mm-f095`,
`sirui-sniper-35mm-f12`. `manufacturer` matches `MANUFACTURER_COLORS` casing;
`line` records sub-brand (Art / Contemporary / M.Zuiko PRO / Nokton / SL /
Sniper). `manufacturer: 'OM System'` covers both OM-era and Olympus-era M.Zuiko
lenses (note Olympus era in `line`/`name`).

### D3: Dropdown grouping by mount then manufacturer
Existing LUMIX S and LUMIX G groups first, then L-mount third-party groups
(`── Sigma (L-mount) ──`, `── Leica (L-mount) ──`, `── Voigtländer (L-mount) ──`,
`── Other (L-mount) ──`), then MFT third-party groups
(`── OM System (MFT) ──`, `── Sigma (MFT) ──`, `── Voigtländer (MFT) ──`,
`── Sirui (MFT) ──`, `── Other (MFT) ──`). Labels carry the mount so the two
systems never blur together.

### D4: Manufacturer colours (shared, one-time)
Add `OM System`, `Leica`, `Laowa`, `Sirui`, `Meike`, `Yongnuo`, `Astrhori` to
`MANUFACTURER_COLORS` (skip any already added by sibling changes). Present:
Sigma, Samyang, Voigtländer, TTArtisan, 7Artisans. Shared coverage test asserts
no lens manufacturer is uncoloured.

### D5: Pricing, ASIN, images
Current lenses: 7 currencies; derived regional → `priceIncomplete: true`. ASIN =
verified plain product, else search fallback. `imageUrl` from manufacturer page;
placeholder gaps recorded (KNOWN_IMAGE_GAPS.panasonic). Note OM System M.Zuiko
lenses are widely stocked → ASINs should be readily found.

### D6: Reference verification (≥2 sources)
Every RRP, key spec (focal, aperture, weight, length, filter, min-focus, OIS/IS,
AF motor, year), `productUrl`, `asin`, `imageUrl` cross-checked against ≥2 of
manufacturer page / DPReview-spec sheet / major retailer / Amazon. Unconfirmable
data left `null`, noted in `research/lenses.md`.

### D7: Scope boundary for "comprehensive"
In: full current Sigma L line; representative Leica SL primes/zooms; current OM
System / recent Olympus M.Zuiko (PRO + popular standard/primes); Sigma MFT DN/DC
DN; Voigtländer Nokton f/0.95 MFT + L; Laowa specialty; Sirui Sniper AF; popular
7Artisans/TTArtisan/Meike/Yongnuo/Astrhori. Out: vintage non-micro Four Thirds,
cine/anamorphic, teleconverters, exhaustive Leica catalogue, retired clones.

### D8: Tests & verification
No schema change (both mounts use the same lens schema; MFT vs L differ only by
`focalLengthEquiv` value). Coverage: `schema`, `referential` (both mounts' new
groups resolve; no orphans/dupes; slug-collision-free across mounts), `config`,
`completeness`, plus the manufacturer-colour coverage assertion. Ad-hoc liveness
check over new `productUrl`/`imageUrl`. `npm test` green at every checkpoint.
