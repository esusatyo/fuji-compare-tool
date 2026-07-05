## Why

Sony's `sony/data.js` currently ships **only first-party** FE/E lenses (~69).
But the Sony E-mount has the **largest third-party lens ecosystem of any
mirrorless system** — Sigma, Tamron, and Samyang have shipped native AF E-mount
glass for years, and Viltrox, Zeiss, Voigtländer, Laowa, TTArtisan, 7Artisans
and Meike round it out. These are exactly the lenses buyers cross-shop against
first-party options (a Sigma 24-70 f/2.8 DG DN vs Sony's GM II; a Tamron 28-75
vs the Sony 24-70), so a comparison tool that omits them is materially
incomplete. Fujifilm already lists third-party X-mount lenses; this change brings
Sony to parity and beyond.

## What Changes

- **Add comprehensive third-party AF lens data to `sony/data.js`** — native
  Sony E / FE lenses from **Sigma** (DC DN APS-C + DG DN Contemporary/Art
  full-frame), **Tamron** (Di III APS-C + full-frame zooms/primes), **Samyang /
  Rokinon** (AF line), and **Viltrox** (AF + LAB/Pro line). Each entry uses the
  existing lens schema with a `manufacturer` field.
- **Add notable manual-focus / specialty third-party lenses** — **Zeiss**
  (Batis / Loxia / Touit, discontinued but historically significant),
  **Voigtländer** (Nokton / APO-Lanthar), **Laowa** (Venus Optics ultra-wide &
  macro), and representative budget makers **TTArtisan / 7Artisans / Meike**.
- **Group the new lenses in `LENS_DROPDOWN_GROUPS` by manufacturer** (`── Sigma
  ──`, `── Tamron ──`, `── Samyang ──`, `── Viltrox ──`, `── Zeiss ──`,
  `── Voigtländer ──`, `── Laowa ──`, `── Other ──`), matching how Fujifilm
  groups its third-party lenses.
- **Add any missing `MANUFACTURER_COLORS`** to `engine.js` (shared, done once):
  `Zeiss`, `Laowa`, `Meike` (Sigma / Tamron / Viltrox / Samyang / Voigtländer /
  TTArtisan / 7Artisans already exist).
- **Every entry is denormalized and mount-specific** — the *Sony-mount* weight,
  length, RRP (7 currencies), Amazon `asin`, `productUrl`, and `imageUrl`,
  each cross-checked against ≥2 reputable sources before entry.

**Storage decision (denormalized):** the same optical design (e.g. Sigma
18-50 f/2.8) is also sold for other mounts; it is stored as an independent
per-brand entry here (no shared catalog, no `mount` field, no engine change) —
consistent with the established per-brand architecture and Fujifilm's existing
third-party lenses. See `design.md` D1. No cross-mount "also available for…" UI
is in scope.

No camera data, engine layout, currency logic, or existing first-party lens data
changes — the new lenses plug into the same dropdown, table, winner-highlighting,
and per-currency Buy-link path.

## Capabilities

### New Capabilities
- `sony-thirdparty-lenses`: A comprehensive, schema-valid set of third-party
  E/FE-mount lenses in `sony/data.js`, grouped by manufacturer and wired into
  the shared engine (dropdowns, table, buy-links) identically to first-party
  lenses, with reference-verified specs, prices, product URLs, purchase links,
  and images.

### Modified Capabilities
<!-- No existing OpenSpec spec capabilities under openspec/specs/. engine.js
     MANUFACTURER_COLORS additions are additive and covered by the new
     capability. -->

## Impact

- **Modified files**: `sony/data.js` (new `LENSES` entries +
  `LENS_DROPDOWN_GROUPS` groups), `engine.js` (`MANUFACTURER_COLORS`: add
  `Zeiss`, `Laowa`, `Meike`).
- **Tests**: covered by the auto-discovered data tier (`schema`, `referential`,
  `config`, `completeness`) — no new test files required; a manufacturer-coverage
  assertion is added so every lens `manufacturer` has a `MANUFACTURER_COLORS`
  entry, and an ad-hoc link check validates all new `productUrl`/`imageUrl`.
- **Data sources**: Sigma / Tamron / Samyang / Viltrox / Zeiss / Voigtländer /
  Laowa official product pages, DPReview / manufacturer spec sheets, B&H /
  Adorama, and Amazon (ASIN lookup) — each datum cross-checked against ≥2
  sources.
- **No dependency, build, or engine-layout changes**; zero-dependency static
  site preserved.
