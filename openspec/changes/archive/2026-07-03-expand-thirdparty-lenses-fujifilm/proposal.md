## Why

Fujifilm is the one brand that **already** carries third-party X-mount lenses
(~23: Sigma ×7, Viltrox ×6, Tamron ×4, TTArtisan ×2, Samyang, 7Artisans,
Voigtländer ×2) — it was the template for the sibling third-party changes
(Sony/Nikon/Panasonic/Canon). But its set is **not yet comprehensive**: the X
mount is one of the most third-party-rich APS-C systems, and several notable
lines are missing — the **Viltrox Air** budget primes, more **TTArtisan /
7Artisans** AF lenses, the entire **Meike** and **Laowa** presence, the
historically important **Zeiss Touit** X-mount trio, and a couple of gaps in the
**Sigma** DC DN line. This change brings Fujifilm to the same comprehensive
third-party bar the other four brands are being raised to, so cross-brand
coverage is consistent.

## What Changes

- **Expand `fujifilm/data.js` third-party X-mount `LENSES` to comprehensive
  scope** (X mount is APS-C only — full-frame third-party designs do not apply):
  - **Sigma:** add the missing DC DN prime(s) (e.g. 18mm f/1.4) to complete the
    APS-C line.
  - **Viltrox:** add the **Air** series (25/35/40/56 f/1.7) and any missing AF
    primes (e.g. 20 f/2.8, 27 f/1.2) alongside the existing six.
  - **Zeiss:** add the **Touit** X-mount trio — 12 f/2.8, 32 f/1.8, 50 f/2.8
    macro (discontinued but historically significant), flagged
    `discontinued: true`.
  - **Laowa:** add the notable X-mount specialty lenses (e.g. 9 f/2.8, 65 f/2.8
    macro, fisheye).
  - **Meike:** add the popular AF primes (25 f/1.8, 35 f/1.4, 50 f/1.8, 85 f/1.8).
  - **TTArtisan / 7Artisans:** expand beyond the current few to a representative
    comprehensive set (more AF + notable MF primes).
- **Re-verify the existing 23 entries** against current sources (price, `asin`,
  `productUrl`, `imageUrl` freshness) as part of the pass.
- **Extend `LENS_DROPDOWN_GROUPS`** — add `── Zeiss ──`, `── Laowa ──`,
  `── Meike ──` groups; grow the existing Viltrox / Other groups.
- **Add missing `MANUFACTURER_COLORS`** to `engine.js` (shared, one-time):
  `Zeiss`, `Laowa`, `Meike` (Sigma/Tamron/Viltrox/Samyang/Voigtländer/TTArtisan/
  7Artisans already exist).

**Storage decision (denormalized):** consistent with the existing Fujifilm
third-party entries and the sibling changes — per-brand entries, no shared
catalogue, no `mount` field, no engine layout change (see `design.md` D1). No
cross-mount "also available for…" UI.

No camera data, engine layout, currency logic, or first-party Fujifilm lens data
changes.

## Capabilities

### New Capabilities
- `fujifilm-thirdparty-lenses`: The Fujifilm X-mount third-party lens set brought
  to comprehensive scope (Sigma/Viltrox/Tamron/Zeiss/Voigtländer/Laowa/Meike/
  TTArtisan/7Artisans/Samyang), grouped by manufacturer and wired into the shared
  engine, with reference-verified specs, prices, product URLs, purchase links,
  and images — including re-verification of the pre-existing entries.

### Modified Capabilities
<!-- No prior OpenSpec spec capability for Fujifilm lenses; the existing
     third-party entries were added directly. engine.js MANUFACTURER_COLORS
     additions are additive, covered by the new capability. -->

## Impact

- **Modified files**: `fujifilm/data.js` (new + re-verified `LENSES`;
  `LENS_DROPDOWN_GROUPS` new/grown groups), `engine.js` (`MANUFACTURER_COLORS`:
  add `Zeiss`, `Laowa`, `Meike` if not already added by a sibling change).
- **Tests**: auto-discovered data tier; manufacturer-colour coverage assertion;
  ad-hoc link check on new + re-verified `productUrl`/`imageUrl`.
- **Data sources**: Sigma / Viltrox / Zeiss / Laowa / Meike / TTArtisan /
  7Artisans official pages, DPReview / spec sheets, B&H / Adorama, Amazon (ASIN).
- **Scope note**: X mount is **APS-C only** — exclude full-frame-only third-party
  designs (e.g. Sigma DG DN Art, Viltrox LAB FF) that have no X-mount version.
- **No dependency, build, or engine-layout changes.**
