# Progress — Canon third-party lenses (round 2)

**Resume at:** Sigma+Tamron batch done (this commit). 4 remaining maker
batches (Viltrox, TTArtisan, 7Artisans, Yongnuo/Meike/Samyang/Zeiss) still to
land; merge and verify once each does.

**Branch:** expand-thirdparty-lenses-canon   **Last green commit:** dae183b (archival housekeeping)

## Baseline (before this round)

29 total: Sigma 10, TTArtisan 5, Laowa 5, Tamron 3, 7Artisans 3, Yongnuo 2,
Viltrox 1. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/`
for the full prior research ledger — read it before re-researching anything,
especially the "Rejected candidates" and "Deferred with unresolved source
conflicts" tables.

## Batches

| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma + Tamron re-check | ✅ both lineups enumerated, 0 new | ✅ N/A — 0 new | ✅ N/A | ✅ N/A | ✅ N/A | pending |
| Viltrox re-check | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| TTArtisan deferred (9 of 14) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 7Artisans deferred (~39 of 42) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Yongnuo + Meike/Samyang/Zeiss re-check | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |

## Deferred / skipped (with reason)

(carried forward from the archived round — see its PROGRESS.md; nothing new yet)

- **Sigma + Tamron re-check (2026-08-29): no new lenses, both lineups
  confirmed unchanged and complete.** Sigma's own Canon-RF landing page
  (`sigma-global.com/en/special/sigma_rfmount_lenses/`) lists exactly the 10
  lenses already in `canon/data.js`; Tamron's (`tamron.com/.../canon_rf/` and
  `tamron-americas.com/canon/`) lists exactly the 3 already entered. Nothing
  deferred — there was nothing new to defer.
- `tamron-17-70mm-f28` re-verified (was flagged in round 1 as needing a
  tier-2 check once time passed): still no independent hands-on review of
  the RF copy exists ~2 months post-launch (confirmed via an rfshooters.com
  forum thread explicitly asking for one — only YouTube coverage exists).
  All stored figures (530 g, 117.3 mm, 67 mm filter, $749) re-confirmed
  correct against tamron-americas.com; a `specSources` block was added to
  the entry recording the re-check and the tier-2 absence, plus a T4
  corroborating source (photographytalk.com, spec-comparison not a
  measurement). Nothing needed correcting. This item can come off the
  "needs re-verification" list; a genuine tier-2 review, if one appears in a
  later pass, would still be worth adding.

## Open questions for the user

(none yet)
