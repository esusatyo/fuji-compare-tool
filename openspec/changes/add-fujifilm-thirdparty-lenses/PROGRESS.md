# Progress — Fujifilm third-party lenses (SG-image, Voigtländer, Laowa)

**Resume at:** done — PR open; awaiting owner on the Laowa GFX question. Archive the change after merge
**Branch:** add-fujifilm-thirdparty-lenses   **Last green commit:** b172b10
**Worktree:** /Users/enricosusatyo/Projects/fuji-compare-tool-fuji-lenses

## Batches
| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| SG-image | ✅ 2 in / 2 deferred / MF+cine out | ✅ 2 | ✅ | ✅ maker | ✅ (JPY override on 55) | 81946e4 |
| Voigtländer | ✅ 7/7 X designs | ✅ 5 new + 2 corrected | ✅ | ✅ Cosina | ✅ (EUR/JPY overrides) | 9da94a9 |
| Laowa | ✅ X: 5 new + 1 deferred; GFX = open question | ✅ 5 | ✅ | ✅ maker | ✅ compute-prices | f2c8e4f + b172b10 (images) |

## Deferred / skipped (with reason)
- `SG-image AF 35mm f/1.4` — new release (global listing 2026-09-25); no source publishes diameter/length/blades. Re-check the maker page for a spec image next pass
- `SG-image AF 35mm f/2.2` (X) — China-only so far; the global store has no X variant
- ASIN gaps: sgimage-55mm-f18, laowa-4-5-10mm-f28-fisheye, laowa-8-16mm-f35-5, laowa-12-24mm-f56-shift — no X-mount amazon.com listing (baseline 44→47; main was at 43)
- `Laowa 180mm f/4.5 1.5X Ultra Macro APO` (X) — preorder only; no X dimensions published (EF/E figures differ widely)

## Verification (2026-10-13)
- npm test 834/834; verify-images: only the two Aksen venuslens images fail (already on main); test:links: every new/changed URL OK, the only failure is an unrelated, transient ECONNRESET on a Canon B&H search link

## Open questions for the user
- Add Laowa's GFX (G-mount) lenses? None of the dataset's third-party lenses are G-mount yet; 3 have clean GFX tables, the shift lenses don't
