# Progress — Canon third-party lenses (round 2)

**Resume at:** TTArtisan deferred batch is done (7 of 9 unblocked via the
`ttartisan.store` per-mount Size-image technique). Remaining batches (Sigma +
Tamron re-check, Viltrox re-check, 7Artisans deferred, Yongnuo + Meike/
Samyang/Zeiss re-check) are still open from the parallel launch — resume
those independently; this batch's work is self-contained and committed.

**Branch:** expand-thirdparty-lenses-canon   **Last green commit:** (this
batch's commit — see `git log -1`)

## Baseline (before this round)

29 total: Sigma 10, TTArtisan 5, Laowa 5, Tamron 3, 7Artisans 3, Yongnuo 2,
Viltrox 1. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/`
for the full prior research ledger — read it before re-researching anything,
especially the "Rejected candidates" and "Deferred with unresolved source
conflicts" tables.

## Batches

| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma + Tamron re-check | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Viltrox re-check | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| TTArtisan deferred (9 of 14) | ✅ 9/9 | ✅ 7 | ✅ | ✅ | ✅ | this batch |
| 7Artisans deferred (~39 of 42) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Yongnuo + Meike/Samyang/Zeiss re-check | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |

TTArtisan is now **12 total** (5 from round 1 + 7 this batch):
`ttartisan-50mm-f14-asph`, `ttartisan-tilt-50mm-f14`, `ttartisan-500mm-f63`,
`ttartisan-50mm-f12`, `ttartisan-50mm-f095`, `ttartisan-35mm-f14-apsc`,
`ttartisan-23mm-f14-apsc`, `ttartisan-10mm-f2-asph-apsc`,
`ttartisan-tilt-35mm-f14-apsc`, `ttartisan-tilt-shift-17mm-f4-asph`,
`ttartisan-14mm-f28-asph`, `ttartisan-100mm-f28-2x-macro`.

## TTArtisan deferred-batch outcome (2026-08-29)

**The unlock worked**: `ttartisan.store`'s per-mount "Size" comparison image
gave real RF-specific diameter/length for 7 of the 9 lenses round 1 deferred
— see `research/lenses.md` for full citations. `ttartisan.com` (round 1's
primary tier-1 source) was **completely unreachable this round** (connection
refused, both WebFetch and browser) — a worse starting point than round 1,
made up for entirely by the store technique.

**Entered (7):** APS-C 35mm f/1.4, APS-C 23mm f/1.4, APS-C 10mm f/2 ASPH,
Tilt APS-C 35mm f/1.4, Tilt-Shift 17mm f/4 ASPH, 14mm f/2.8 ASPH, 100mm f/2.8
2X Macro. The last one also resolves round 1's open "TS-100-Macro naming
hazard" question (see ledger) — it's the plain macro, not a tilt-shift
product.

**Still deferred (2), narrower reasons than round 1's blanket one:**
- `ttartisan-17mm-f14-apsc` (APS-C 17mm F1.4) — round 1 believed this shipped
  in RF; this round found the *opposite* on the maker's own current
  storefront (Mount selector + spec prose both omit RF). A 2022 RF SKU
  existed at retail historically but appears delisted from TTArtisan's
  current catalogue.
- `ttartisan-25mm-f2-apsc` (APS-C 25mm F2) — RF *is* a live add-to-cart Mount
  option, but neither the spec-table prose nor — critically — the page's own
  per-mount Size **image** (which only has 3 columns: E/X, Z, M43) include an
  RF entry. The unlock technique doesn't help here because the maker hasn't
  published the diagram for this mount yet, not because of an image-reading
  problem.

**New-since-round-1 scope check:** re-scanned all 75 products on
`ttartisan.store` (`products.json`). Two Canon-RF-capable lenses exist that
were **not** on round 1's original 14-lens list and are **not yet entered**:
- `90mm-f1-25` — "90mm F1.25 Multi Mounts" (Sony E/Nikon Z/Canon RF/L
  mount/Fuji GFX/X1D)
- `ttartisan-21mm-f1-5` — "21mm F1.5 Multi Mounts" (Sony E/Nikon Z/Canon RF)

Neither was researched/entered this batch (out of the assigned scope: this
batch was "unblock the 9 deferred", not "find new SKUs") — flag for the next
Sigma/Tamron/Viltrox/Yongnuo re-check pass or a dedicated follow-up.
Also confirmed via the same scan: none of TTArtisan's `AF`-prefixed lenses
(17mm f/1.8 Air, 40mm F2, 75mm F2, 56mm F1.8, 35mm F1.8, 27mm F2.8) carry a
Canon RF mount option — consistent with this project's established scope
fact that TTArtisan AF lenses aren't RF-licensed. `TTARTISAN 100mm f/2.8
Macro Tilt-Shift RF` was also seen referenced externally (a 2026 RF add for
the *separate* `ts100` tilt-shift macro product, distinct from the plain
macro entered this batch) — also not researched/entered, same reason.

## Deferred / skipped (with reason)

(carried forward from the archived round — see its PROGRESS.md, plus the two
TTArtisan items above)

## Open questions for the user

(none yet)
