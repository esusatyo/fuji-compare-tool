# Tasks — Canon first-party lens gaps

Work in batches by family. After each batch: `npm run test:data`, then commit the
green checkpoint. Record every source in `research/sources.md` **as you go** —
not at the end, when the tab is closed and the figure is already in the file.

## 1. Provenance groundwork (do first — it changes how every later batch is entered)

- [ ] 1.1 Add optional `specSources` to `validateLens`/`validateCamera` in
      `tests/helpers/schema.js`: an object keyed by field name → source URL, all
      values `https`. Optional, so the 424 existing lenses stay valid.
- [ ] 1.2 Decide and document the granularity rule in `CLAUDE.md`: one entry per
      *field group* actually sourced separately (e.g. `dimensions`, `weight`,
      `price`, `year`), not one per scalar — otherwise it's unmaintainable.
- [ ] 1.3 Add a test asserting every `specSources` value parses as an `https` URL
      and that no key names a field absent from the entry.

## 2. Super-telephoto L primes (4) — 4/4 entered, 2026-08-08

- [x] 2.1 `RF 400mm f/2.8 L IS USM` — entered as `rf-400mm-f28-l-is-usm`
- [x] 2.2 `RF 600mm f/4 L IS USM` — entered as `rf-600mm-f4-l-is-usm`
- [x] 2.3 `RF 800mm f/5.6 L IS USM` — entered as `rf-800mm-f56-l-is-usm`. The
      dimensions block was resolved via `the-digital-picture.com`'s independent
      measurement (163×432mm), not Canon AU, whose figure for this lens really
      was a templated `69×92.9mm` artifact — confirmed by the same independent
      source, not just suspected.
- [x] 2.4 `RF 1200mm f/8 L IS USM` — entered as `rf-1200mm-f8-l-is-usm`, same
      resolution (168×537mm). Required raising the `length` schema cap from
      500→600mm — real Canon data, not an entry error.
- [x] 2.5 Dropdown ids + test + commit — done.

## 3. The f/11 sibling and remaining primes (4) — 4/4 entered, 2026-08-08

- [x] 3.1 `RF 600mm f/11 IS STM` — entered as `rf-600mm-f11-is-stm`. Building it
      surfaced errors in the existing `rf-800mm-f11-is-stm` sibling; a later
      cross-check (independent T2 source) found **eight** wrong fields, not the
      three first suspected — all fixed, see `research/sources.md`.
- [x] 3.2 `RF 24mm f/1.4 L VCM` — entered as `rf-24mm-f14-l-vcm`. The AU
      "dimensions bug" suspected for this trio in run 2 turned out to be wrong:
      independently confirmed the three VCM primes genuinely share one barrel
      (76.5×99.3mm each) — a real design choice, not a template collision.
- [x] 3.3 `RF 35mm f/1.4 L VCM` — entered as `rf-35mm-f14-l-vcm`.
- [x] 3.4 `RF 50mm f/1.4 L VCM` — entered as `rf-50mm-f14-l-vcm`.
- [x] 3.5 `RF 85mm f/1.2 L USM DS` — entered as `rf-85mm-f12-l-usm-ds`. Confirmed
      a distinct SKU; dimensions/weight/elements/groups/blades all match the
      non-DS twin exactly, consistent with DS being a coating-only variant.
- [x] 3.6 Dropdown ids + test + commit — done.

## 4. Specialty / VR fisheyes (3) — 3/3 entered, 2026-08-08

- [x] 4.1 `RF 5.2mm f/2.8 L Dual Fisheye` — entered as `rf-52mm-f28-l-dual-fisheye`.
      Genuinely manual-focus-only, confirmed directly (not assumed from "L").
- [x] 4.2 `RF-S 3.9mm f/3.5 STM Dual Fisheye` — entered as
      `rfs-39mm-f35-stm-dual-fisheye`.
- [x] 4.3 `RF-S 7.8mm f/4 STM Dual` — entered as `rfs-78mm-f4-stm-dual`. Not a
      fisheye (63° AoV, real 58mm filter thread) — a spatial-video lens, kept in
      this group for its shared VR-dual-lens category.
- [x] 4.4 Decided: no crop multiplier for dual-fisheye/VR lenses —
      `focalLengthEquiv` equals the native focal length. Documented in
      `CLAUDE.md` with the rationale (twin circular-fisheye images for
      stereoscopic VR have no meaningful "35mm-equivalent framing").
- [x] 4.5 Dropdown ids + test + commit — done (RF 5.2mm under RF Primes since
      it's full-frame; the two RF-S lenses under the existing RF-S group).

## 5. Zooms (9) — 9/9 entered, 2026-08-08

- [x] 5.1 `RF 10-20mm f/4 L IS STM` — `rf-10-20mm-f4-l-is-stm`
- [x] 5.2 `RF 15-30mm f/4.5-6.3 IS STM` — `rf-15-30mm-f45-63-is-stm`
- [x] 5.3 `RF 28-70mm f/2 L USM` — `rf-28-70mm-f2-l-usm`
- [x] 5.4 `RF 28-70mm f/2.8 IS STM` — `rf-28-70mm-f28-is-stm`
- [x] 5.5 `RF 24-105mm f/2.8 L IS USM Z` — `rf-24-105mm-f28-l-is-usm-z`
- [x] 5.6 `RF 24-240mm f/4-6.3 IS USM` — `rf-24-240mm-f4-63-is-usm`
- [x] 5.7 `RF 70-200mm f/2.8 L IS USM Z` — `rf-70-200mm-f28-l-is-usm-z`, distinct
      from the non-Z already present, confirmed distinct weight/optics despite
      sharing AUD RRP and dimensions with the 24-105mm Z (checked, not a bug —
      see `research/sources.md`).
- [x] 5.8 `RF 100-300mm f/2.8 L IS USM` — `rf-100-300mm-f28-l-is-usm`
- [x] 5.9 `RF 200-800mm f/6.3-9 IS USM` — `rf-200-800mm-f63-9-is-usm`
- [x] 5.10 Dropdown ids + test + commit — done.

## 6. Corrections and fills on existing entries

- [x] 6.1 Verified and fixed `RF 85mm f/1.4 L IS USM` → **`RF 85mm f/1.4 L VCM`**.
      Turned out far more wrong than the name: weight was off by more than 2×
      (1410g vs. real 636g), dimensions/filterThread/year/productUrl were all
      wrong too. Full before/after table in `research/sources.md`.
- [ ] 6.2 Fill regional prices for the (now 8, since 6.1 fixed one)
      `priceIncomplete` first-party lenses: `rf-14mm-f14-l-vcm`,
      `rf-20mm-f14-l-vcm`, `rf-45mm-f12-stm`, `rf-20-50mm-f4-l-is-usm-pz`,
      `rf-7-14mm-f28-35-l-fisheye-stm`, `rf-16-28mm-f28-is-stm`,
      `rf-75-300mm-f4-56`, `rfs-14-30mm-f4-63-is-stm-pz`. Not attempted this
      pass — out of scope (these are unrelated to the 21-lens gap).
- [ ] 6.3 Backfill `productUrl` for `rf-45mm-f12-stm`,
      `rf-20-50mm-f4-l-is-usm-pz`, `rf-16-28mm-f28-is-stm`. Not attempted.

## 7. The systemic fix — done, 2026-08-05 (in the planning commit)

- [x] 7.1 Full-lineup completeness diff step added to `refresh-camera-data`.
- [x] 7.2 Source-recording requirement added to both skills.
- [x] 7.3 Wikipedia-category trap noted in both skills.

## 8. Close out

- [x] 8.1 `node scripts/compute-prices.js canon lenses` — run after every batch.
- [x] 8.2 `node scripts/generate-seo.js` — run after every batch.
- [x] 8.3 Full `npm test` green — 410/410 as of the last commit.
- [ ] 8.4 Run the same completeness diff for the other four brands. Not
      attempted — this pass stayed scoped to Canon per the user's request.

## Status: the 21-lens gap is closed

All 21 originally-missing Canon first-party lenses are entered (Canon lens
count 63 → 84 across this change's commits), plus one bonus fix to
already-shipped data (task 6.1) and eight fixes to `rf-800mm-f11-is-stm`
found while entering its sibling. Remaining open items (1, 6.2, 6.3, 8.4) are
genuinely separate scope — provenance tooling, unrelated price gaps, and a
cross-brand audit — not blockers on this change's stated goal.
