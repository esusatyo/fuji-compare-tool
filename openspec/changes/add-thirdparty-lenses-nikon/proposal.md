## Why

`nikon/data.js` currently ships **only first-party** Z-mount lenses (~43). For
years Nikon kept the Z mount closed to third-party AF, but that changed: **Sigma
officially licensed the Z mount in 2023** and now ships its DC DN and DG DN
lines for Z, **Tamron** offers Z-mount zooms (some even rebadged and sold by
Nikon), and **Viltrox, Samyang, Voigtländer, Laowa, TTArtisan, 7Artisans, Meike
and Yongnuo** all make Z glass. These are real cross-shop options against
Nikkor Z lenses, so the comparison tool should include them — matching the
third-party coverage Fujifilm already has and this change set is adding to Sony.

## What Changes

- **Add comprehensive third-party AF lens data to `nikon/data.js`** — native
  Nikon Z lenses from **Sigma** (DC DN APS-C + DG DN Contemporary/Art
  full-frame, Z-licensed 2023+), **Tamron** (Di III Z zooms/primes), **Viltrox**
  (AF + LAB/Air), and **Samyang** (AF). Each uses the existing lens schema with a
  `manufacturer` field.
- **Add notable manual/specialty and budget makers** — **Voigtländer** (native
  Z Nokton/APO-Lanthar), **Laowa** (Venus Optics), and representative
  **TTArtisan / 7Artisans / Meike / Yongnuo** AF lenses.
- **Group the new lenses in `LENS_DROPDOWN_GROUPS` by manufacturer** (Sigma,
  Tamron, Viltrox, Samyang, Voigtländer, Laowa, `── Other ──`), matching the
  Fujifilm/Sony layout.
- **Add any missing `MANUFACTURER_COLORS`** to `engine.js` (shared, one-time):
  `Laowa`, `Meike`, `Yongnuo` (Sigma/Tamron/Viltrox/Samyang/Voigtländer/
  TTArtisan/7Artisans already exist; `Zeiss` may be added by the Sony change).
- **Every entry is denormalized and Z-mount-specific** — the Z version's weight,
  length, RRP (7 currencies), Amazon `asin`, `productUrl`, and `imageUrl`, each
  cross-checked against ≥2 reputable sources before entry.

**Storage decision (denormalized):** same-design lenses sold for other mounts are
stored as independent per-brand entries (no shared catalogue, no `mount` field,
no engine change) — see `design.md` D1. No cross-mount "also available for…" UI.

No camera data, engine layout, currency logic, or first-party lens data changes.

## Capabilities

### New Capabilities
- `nikon-thirdparty-lenses`: A comprehensive, schema-valid set of third-party
  Z-mount lenses in `nikon/data.js`, grouped by manufacturer and wired into the
  shared engine identically to first-party lenses, with reference-verified specs,
  prices, product URLs, purchase links, and images.

### Modified Capabilities
<!-- engine.js MANUFACTURER_COLORS additions are additive, covered by the new
     capability. -->

## Impact

- **Modified files**: `nikon/data.js` (new `LENSES` + `LENS_DROPDOWN_GROUPS`
  groups), `engine.js` (`MANUFACTURER_COLORS`: add `Laowa`, `Meike`, `Yongnuo`
  if not already present).
- **Tests**: auto-discovered data tier (`schema`, `referential`, `config`,
  `completeness`); the manufacturer-colour coverage assertion (shared across
  brands); ad-hoc link check on new `productUrl`/`imageUrl`.
- **Data sources**: Sigma / Tamron / Viltrox / Samyang / Voigtländer / Laowa /
  Yongnuo official pages, DPReview / spec sheets, B&H / Adorama, Amazon (ASIN).
- **No dependency, build, or engine-layout changes.**
