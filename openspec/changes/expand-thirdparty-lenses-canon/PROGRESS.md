# Progress — Canon third-party lenses (round 2)

**Resume at:** Sigma+Tamron, Viltrox, and Yongnuo/Meike/Samyang/Zeiss batches
done (all merged). 2 remaining maker batches (TTArtisan, 7Artisans) still to
land; merge and verify once each does.

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
| Sigma + Tamron re-check | ✅ both lineups enumerated, 0 new | ✅ N/A — 0 new | ✅ N/A | ✅ N/A | ✅ N/A | 6046cbe |
| Viltrox re-check | ✅ no change | — | n/a | n/a | n/a | 9769bce |
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

## Confirmed unchanged

**Viltrox (re-checked 2026-08-29).** No new Canon RF/RF-S Viltrox product
exists. Findings:
- **viltrox.com's own store lists zero Canon-mount products of any kind** —
  its mount filter (`E-mount, FE-mount, X-mount, Z-mount, L-mount, M-mount,
  DL-mount, PL-mount`) doesn't even include Canon as an option, and an
  on-site search for "85mm RF" returns nine results, none of them RF. This
  is a stronger signal than round 1 had: Canon isn't just under-served, it's
  entirely absent from the maker's own storefront.
- **The 2022 cease-and-desist is the same historical event round 1 already
  found**, not a new dispute — a DPReview headline ("Canon told them to stop
  selling all RF mount products") reads as fresh but dates to 2022-08-29,
  corroborated by Canon Germany's official statement (fstoppers.com,
  2022-09-05).
- **RF-S AF primes (23/33/56mm f/1.4) remain unshipped.** A December 2025
  rumor (thenewcamera.com) claims Viltrox got "full authorization from
  Canon" as an "official partner" for RF-S lenses landing "first half of
  2026." As of today (2026-08-29, past that window), nothing has shipped —
  Viltrox's own most recent roadmap news (2026-08-20, 2026-04-10) covers
  L-mount and NAB announcements only, no Canon mention. Treated as an
  unconfirmed claim, not a scope change; still out per the skill's "verify
  against the maker, not a rumor" rule.
- **Existing `viltrox-85mm-f18` entry re-verified, no drift found.** No
  tier-1 page exists to check against (see above), but current retailer
  listings (B&H, GearFocus) still sell it under the same "RF II" name with
  the same 484g/92×80mm/72mm-filter/80cm-MFD/10-7-9/$399 figures already in
  the dataset. The 530g figure from the original Nov 2021 announcement
  belongs to a first-generation RF release that "RF II" (lighter, and what's
  actually sold today) superseded — not a data error, just two real
  generations. `productUrl:null`/`imageUrl:null` stay as-is; both are
  already correctly allowlisted in `completeness.test.js` (2026-08-17 note).
- Full citation trail in `research/sources.md` and `research/lenses.md`.

## Deferred / skipped (with reason)

(carried forward from the archived round — see its PROGRESS.md; nothing new
from the Viltrox batch — see "Confirmed unchanged" above)

- Yongnuo: 4 candidates found beyond the 2 already entered (3 no-spec-table
  skips, 1 ambiguous flag) — see `research/lenses.md`
- Meike: native-RF MF catalogue found (10mm F2.0 confirmed, likely more) —
  needs its own maker batch with full Step 2 spec sourcing
- Samyang: MF 85mm F1.4 RF and a possibly-real AF 14mm F2.8 RF surfaced but
  weren't independently verified — need a direct lksamyang.com/samyangus.com
  tier-1 read before entering
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

- Yongnuo `yongnuo-85mm-f18-ii`: is this worth entering with the "II" page's
  own published specs despite the near-duplicate-of-the-original pattern, or
  should it stay deferred until Yongnuo's site reliability on this lens
  family improves? Left un-entered pending guidance.
