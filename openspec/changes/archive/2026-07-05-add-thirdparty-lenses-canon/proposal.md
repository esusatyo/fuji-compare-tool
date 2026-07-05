## Why

`canon/data.js` currently ships **only first-party** RF lenses (~34). Canon
historically kept the RF mount **closed to third-party autofocus lenses**, which
is why Canon has the smallest third-party ecosystem of the five brands. That
changed in **2024**, when Canon licensed the RF-S (APS-C) mount to **Sigma and
Tamron**, who now ship their popular APS-C AF lenses for RF-S, with full-frame RF
third-party AF beginning to follow. Alongside them, **Viltrox, Samyang, Yongnuo,
TTArtisan, 7Artisans, Laowa and Meike** offer RF glass (AF where licensed, plus
manual-focus primes). Adding these gives Canon shooters the same cross-shop view
the other brands now have — while being honest about the (currently) smaller set.

## What Changes

- **Add currently-shipping third-party RF / RF-S lens data to `canon/data.js`:**
  - **Sigma** RF-S APS-C AF (DC DN: 16/23/30/56 f/1.4, 10-18 f/2.8, 18-50 f/2.8)
    plus any full-frame RF Sigma released.
  - **Tamron** RF-S APS-C AF (11-20 f/2.8, 17-70 f/2.8, 18-300) plus any FF RF.
  - **Viltrox** RF AF (e.g. 16 f/1.8, 27 f/1.2, 28 f/4.5, 56 f/1.4, Air series).
  - **Samyang / Yongnuo** AF where available; **TTArtisan / 7Artisans / Laowa /
    Meike** AF + notable manual-focus RF primes.
- Each entry uses the existing lens schema with a `manufacturer` field; RF-S
  APS-C lenses set `focalLengthEquiv` = 1.6× crop (Canon APS-C), full-frame RF
  lenses are native.
- **Group the new lenses in `LENS_DROPDOWN_GROUPS` by manufacturer** (Sigma,
  Tamron, Viltrox, `── Other ──`), matching the Fujifilm/Sony/Nikon layout.
- **Add any missing `MANUFACTURER_COLORS`** to `engine.js` (shared, one-time):
  `Laowa`, `Meike`, `Yongnuo` (Sigma/Tamron/Viltrox/Samyang/TTArtisan/7Artisans
  already exist).
- **Every entry is denormalized and RF-mount-specific** — the RF/RF-S version's
  weight, length, RRP (7 currencies), Amazon `asin`, `productUrl`, `imageUrl`,
  each cross-checked against ≥2 reputable sources before entry.

**Storage decision (denormalized):** same-design lenses for other mounts are
independent per-brand entries — no shared catalogue, no `mount` field, no engine
change (see `design.md` D1). No cross-mount "also available for…" UI.

No camera data, engine layout, currency logic, or first-party lens data changes.

## Capabilities

### New Capabilities
- `canon-thirdparty-lenses`: A schema-valid set of currently-shipping third-party
  RF / RF-S lenses in `canon/data.js`, grouped by manufacturer and wired into the
  shared engine identically to first-party lenses, with reference-verified specs,
  prices, product URLs, purchase links, and images.

### Modified Capabilities
<!-- engine.js MANUFACTURER_COLORS additions are additive, covered by the new
     capability. -->

## Impact

- **Modified files**: `canon/data.js` (new `LENSES` + `LENS_DROPDOWN_GROUPS`
  groups), `engine.js` (`MANUFACTURER_COLORS`: add `Laowa`, `Meike`, `Yongnuo`
  if not already present).
- **Tests**: auto-discovered data tier; manufacturer-colour coverage assertion;
  ad-hoc link check on new `productUrl`/`imageUrl`.
- **Data sources**: Sigma / Tamron / Viltrox / Samyang / Yongnuo / Laowa official
  pages, DPReview / spec sheets, B&H / Adorama, Amazon (ASIN).
- **Scope note**: this is intentionally the **smallest** third-party set of the
  five brands — RF/RF-S third-party AF only opened in 2024; enumerate exactly
  what ships, don't pad.
- **No dependency, build, or engine-layout changes.**
