# Tasks — expand Nikon third-party lenses (round 2)

- [x] 0. Scaffold this change (baseline: 31 lenses / 9 makers, confirmed
      against `nikon/data.js`)
- [ ] 1. Sigma + Tamron re-check batch — confirm current 3+6, look for new
      Sigma DG DN / Tamron Di III Z releases; do NOT re-add
      `tamron-11-20mm-f28` (confirmed fabricated, removed PR #25)
- [x] 2. Viltrox + Voigtländer batch — new Viltrox Air/LAB Z releases;
      Voigtländer APO-Lanthar 35mm Z (flagged remaining-tail) + others.
      32 new lenses entered (21 Viltrox + 11 Voigtländer); see PROGRESS.md.
- [ ] 3. Laowa + Samyang batch — full Laowa Z re-enumeration; determine from
      scratch whether Samyang ships ANY native Z-mount lens today
- [ ] 4. Yongnuo + Meike batch — expand representative set beyond current 2+2
- [ ] 5. TTArtisan + 7Artisans batch — expand representative set beyond
      current 1+1; try the `.store` dimension-diagram technique (worked for
      TTArtisan on Canon) against Z-mount pages
- [ ] 6. Merge all batches into `expand-thirdparty-lenses-canon`, resolve
      `MANUFACTURER_COLORS` as a union
- [ ] 7. `npm test` green, `verify-images.js nikon`, `generate-seo.js`
- [ ] 8. Push to existing PR #41 (no new branch/PR — explicit user
      instruction this round); leave `dataVerified` alone
- [ ] 9. After PR #41 merges: archive this change alongside the Canon one;
      follow up with `check-prices-and-buy-links` for ASIN backfill
