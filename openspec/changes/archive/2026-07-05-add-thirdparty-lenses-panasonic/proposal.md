## Why

`panasonic/data.js` currently ships **only first-party** LUMIX lenses (~39)
across its two systems — L-mount (full-frame) and Micro Four Thirds (MFT). But
both mounts have exceptionally rich third-party ecosystems, arguably the richest
of any brand:

- **L-mount** is an open alliance — **Sigma is a full member** and sells its
  entire DG DN line natively for L, alongside **Leica** SL glass, plus
  Voigtländer, Samyang, Laowa, TTArtisan and others.
- **MFT** is the oldest mirrorless mount with a huge catalogue — most notably
  **OM System / Olympus** (M.Zuiko, a co-founder of the format and a major
  cross-shop against LUMIX G), plus Sigma DN, Voigtländer Nokton f/0.95, Laowa,
  Sirui, 7Artisans, TTArtisan, Meike, Yongnuo and more.

A LUMIX buyer routinely compares an OM System M.Zuiko against a LUMIX G lens, or
a Sigma L against a LUMIX S PRO. This change adds both mounts' third-party lenses
so the comparison tool reflects what buyers actually choose between.

## What Changes

- **Add comprehensive third-party lens data to `panasonic/data.js` for both
  mounts:**
  - **L-mount (full-frame):** **Sigma** (full DG DN Contemporary/Art line, native
    L), **Leica** (SL primes/zooms), **Voigtländer** (Nokton L), **Samyang**,
    **Laowa**, **TTArtisan / 7Artisans / Astrhori**.
  - **MFT:** **OM System / Olympus** (M.Zuiko PRO + standard), **Sigma** (DN /
    DC DN for MFT), **Voigtländer** (Nokton f/0.95), **Laowa**, **Sirui**
    (Sniper AF), **7Artisans / TTArtisan / Meike / Yongnuo**.
- Each entry uses the existing lens schema with a `manufacturer` field;
  MFT lenses set `focalLengthEquiv` = 2.0× crop, L-mount FF lenses are native.
- **Group the new lenses in `LENS_DROPDOWN_GROUPS` by mount then manufacturer**
  (e.g. `── Sigma (L-mount) ──`, `── OM System (MFT) ──`, …), so the two systems
  stay visually separated as the first-party LUMIX lenses already are.
- **Add missing `MANUFACTURER_COLORS`** to `engine.js` (shared, one-time):
  `OM System`, `Leica`, `Laowa`, `Sirui`, `Meike`, `Yongnuo`, `Astrhori`
  (Sigma/Samyang/Voigtländer/TTArtisan/7Artisans already exist).
- **Every entry is denormalized and mount-specific** — the L or MFT version's
  weight, length, RRP (7 currencies), Amazon `asin`, `productUrl`, `imageUrl`,
  each cross-checked against ≥2 reputable sources before entry.

**Storage decision (denormalized):** same-design lenses (e.g. a Sigma DG DN on
both L and Sony E) are stored as independent per-brand entries — no shared
catalogue, no `mount` field on the object, no engine change (see `design.md` D1).
The L-vs-MFT split is expressed through dropdown group labelling and
`focalLengthEquiv`, not a schema field. No cross-mount "also available for…" UI.

No camera data, engine layout, currency logic, or first-party lens data changes.

## Capabilities

### New Capabilities
- `panasonic-thirdparty-lenses`: A comprehensive, schema-valid set of
  third-party L-mount and MFT lenses in `panasonic/data.js`, grouped by mount and
  manufacturer and wired into the shared engine identically to first-party
  lenses, with reference-verified specs, prices, product URLs, purchase links,
  and images.

### Modified Capabilities
<!-- engine.js MANUFACTURER_COLORS additions are additive, covered by the new
     capability. -->

## Impact

- **Modified files**: `panasonic/data.js` (new `LENSES` + `LENS_DROPDOWN_GROUPS`
  groups), `engine.js` (`MANUFACTURER_COLORS`: add `OM System`, `Leica`, `Laowa`,
  `Sirui`, `Meike`, `Yongnuo`, `Astrhori` as needed).
- **Tests**: auto-discovered data tier; manufacturer-colour coverage assertion;
  ad-hoc link check on new `productUrl`/`imageUrl`. This change likely adds the
  most lenses (two mounts) — batches keep each checkpoint green.
- **Data sources**: Sigma / Leica / OM System / Voigtländer / Samyang / Laowa /
  Sirui official pages, DPReview / spec sheets, B&H / Adorama, Amazon (ASIN).
- **No dependency, build, or engine-layout changes.**
