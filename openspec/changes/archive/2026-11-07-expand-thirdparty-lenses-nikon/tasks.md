# Tasks — expand Nikon third-party lenses (round 2)

- [x] 0. Scaffold this change (baseline: 31 lenses / 9 makers, confirmed
      against `nikon/data.js`)
- [x] 1. Sigma + Tamron re-check batch — confirm current 3+6, look for new
      Sigma DG DN / Tamron Di III Z releases; do NOT re-add
      `tamron-11-20mm-f28` (confirmed fabricated, removed PR #25).
      **Done 2026-08-30**: Sigma re-confirmed complete (still 3, no DG DN on
      Z); 6 new Tamron lenses found and entered (12-20mm, 16-30mm G2, 28-75mm
      G2, 35-100mm, 70-180mm G2, 90mm macro) — see PROGRESS.md. Branch
      `nikon-sigma-tamron-v2`.
- [x] 2. Viltrox + Voigtländer batch — new Viltrox Air/LAB Z releases;
      Voigtländer APO-Lanthar 35mm Z (flagged remaining-tail) + others.
      **Done 2026-08-30**: 32 new lenses entered (21 Viltrox + 11
      Voigtländer); see PROGRESS.md. Branch `nikon-viltrox-voigtlander-v2`.
- [x] 3. Laowa + Samyang batch — full Laowa Z re-enumeration; determine from
      scratch whether Samyang ships ANY native Z-mount lens today
      **Done 2026-08-30**: 21 new Laowa + 2 new Samyang lenses entered; see
      PROGRESS.md. Branch `nikon-laowa-samyang-v2` (stale checkbox fixed —
      PROGRESS.md already documented this as complete).
- [x] 4. Yongnuo + Meike batch — expand representative set beyond current 2+2
      **Done 2026-08-31**: 7 new Yongnuo (11mm/23mm/33mm/35mm-APS-C/
      50mm-DA/56mm/85mm f/1.8 — the maker's entire remaining Z-mount
      catalogue) + 4 new Meike (24mm MIX/35mm Pro/50mm SE/85mm Pro) entered;
      see PROGRESS.md. Deferred: Yongnuo 16mm f/1.8 (DF/DX naming
      contradiction), Meike 55mm f/1.8 Pro (dims unpublished), Meike 25mm
      f/1.7 Air (too new). Branch `nikon-yongnuo-meike-v4`.
- [x] 5. TTArtisan + 7Artisans batch — expand representative set beyond
      current 1+1; try the `.store` dimension-diagram technique (worked for
      TTArtisan on Canon) against Z-mount pages
      **Done 2026-08-31**: 8 new TTArtisan (23mm/35mm II/56mm/75mm/40mm/
      17mm Air/50mm Neo/85mm Neo f/1.8-f/2) + 8 new 7Artisans (10mm/25mm
      Lite/35mm Lite/50mm Lite/35mm/40mm Lite/50mm/85mm) entered; see
      PROGRESS.md. Dimension-diagram technique confirmed working again for
      TTArtisan (all 8), confirmed NOT generalizing to 7Artisans (tested
      directly, per the task's instruction not to assume). Deferred:
      TTArtisan 35mm F1.8 original + 32mm F2.8 Nikon Mount (both sold-out,
      stale page redirects), 7Artisans 24mm F1.8 (weight unpublished
      anywhere found), 7Artisans 135mm F1.8 (too new for the T2 tracker).
      Branch `nikon-ttartisan-7artisans-v4`.
- [x] 6. Merge all batches into `expand-thirdparty-lenses-canon`, resolve
      `MANUFACTURER_COLORS` as a union. **Done 2026-08-31**: all 5 branches
      merged (2 with real conflicts, resolved as unions per the skill's
      guidance; 2 clean fast-forwards). No `MANUFACTURER_COLORS` conflicts
      arose this round — every maker touched already had an entry.
- [x] 7. `npm test` green, `verify-images.js nikon`, `generate-seo.js`.
      **Done 2026-08-31**: `npm test` 416/416 after every merge;
      `generate-seo.js` re-run clean each time; `verify-images.js nikon`
      clean throughout (only known tool-specific false positives — Laowa
      `venuslens.net` 403s and the `voigtlaender.de` Node-TLS gap, both
      independently confirmed via `curl` to be real, loading images).
- [x] 8. Push to existing PR #41 (no new branch/PR — explicit user
      instruction this round); leave `dataVerified` alone. **Done** — PR #41
      description kept current after every batch landed.
- [ ] 9. After PR #41 merges: archive this change alongside the Canon one;
      follow up with `check-prices-and-buy-links` for ASIN backfill
