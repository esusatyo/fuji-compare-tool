# Progress — Canon third-party lenses (round 2)

**Resume at:** 5 maker batches launched in parallel (2026-08-29); merge and
verify once each lands. Batch 5 (Yongnuo + Meike/Samyang/Zeiss re-check) is
done — see its row below and `research/lenses.md` for the full writeup.

**Branch:** expand-thirdparty-lenses-canon   **Last green commit:** (this
batch's commit, on top of dae183b)

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
| TTArtisan deferred (9 of 14) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 7Artisans deferred (~39 of 42) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Yongnuo + Meike/Samyang/Zeiss re-check | ✅ | ✅ 2 (Samyang) | ✅ | ✅ | ✅ | (this commit) |

## Batch 5 summary (2026-08-29)

- **Yongnuo**: 4 new AF candidates found on yongnuo.eu's RF category beyond
  the 2 already entered (23mm f/1.4 APS-C, 35mm F1.8 R DA DSM, 50mm F1.8
  R-mount, 85mm F1.8R II) — all genuine "R Mount" (= Canon RF) products, but
  **none entered**: the first 3 publish no weight/length/diameter/filter/
  MFD/elements/groups/blades on any reachable page (same pattern as round
  1's TTArtisan/7Artisans blocker); the 4th ("II") has full specs but reads
  suspiciously like the original product's own long-published numbers
  re-served under a new URL — flagged as ambiguous rather than entered as a
  probable duplicate. Full detail + all 4 candidates in `research/lenses.md`.
- **Meike**: AF re-confirmed EF-adapter-only (round 1 stands; RF-labelled
  listings are cine kits, out of scope anyway). **MF is a real, previously
  unchecked gap** — meikeglobal.com sells at least a native-RF MF prime
  (10mm F2.0 APS-C) plus RF-mount MF full-frame primes (50mm F1.7, 50mm
  F1.2) via Amazon. Not entered (time budget) — flagged for a dedicated
  Meike MF pass.
- **Samyang**: **round 1's "no native RF Samyang" was wrong.** Samyang has
  sold native Canon RF lenses since Feb 2019. Entered 2: `samyang-14mm-f28`
  (MF 14mm F2.8 RF, one of Samyang's first two RF lenses, still current) and
  `samyang-12mm-f2-rf-s` (AF 12mm F2 RF-S, Samyang's first RF-S lens,
  shipping since Jan 2025). A sibling MF 85mm F1.4 RF (announced alongside
  the 14mm in 2019) and a possible AF 14mm F2.8 RF surfaced but weren't
  independently verified this round — see `research/lenses.md`.
- **Zeiss**: re-confirmed absent from RF, with the sharper underlying fact
  that Zeiss has discontinued every mirrorless/DSLR consumer stills line
  company-wide (Loxia/Batis/Milvus/Otus) — RF was never a special case, no
  current mount at all has a new Zeiss stills lens except a handful of
  legacy DSLR (EF/F) primes kept in production by demand.
- `MANUFACTURER_COLORS['Samyang']` already existed (added for another
  brand) — no engine.js change needed.
- New `── Samyang ──` dropdown group added to `LENS_DROPDOWN_GROUPS`,
  ordered after Tamron / before Viltrox.
- `npm test` green (416/416) after `node scripts/generate-seo.js`.

## Deferred / skipped (with reason)

(carried forward from the archived round — see its PROGRESS.md)
- Yongnuo: 4 candidates above (3 no-spec-table skips, 1 ambiguous flag)
- Meike: native-RF MF catalogue (10mm F2.0 confirmed, likely more) — needs
  its own maker batch with full Step 2 spec sourcing
- Samyang: MF 85mm F1.4 RF and a possibly-real AF 14mm F2.8 RF — need a
  direct lksamyang.com/samyangus.com tier-1 read before entering

## Open questions for the user

- Yongnuo `yongnuo-85mm-f18-ii`: is this worth entering with the "II" page's
  own published specs despite the near-duplicate-of-the-original pattern, or
  should it stay deferred until Yongnuo's site reliability on this lens
  family improves? Left un-entered pending guidance.
