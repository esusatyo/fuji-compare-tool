# Progress — Canon third-party lenses (round 2)

**Resume at:** Sigma+Tamron and Viltrox batches done (both merged). 3
remaining maker batches (TTArtisan, 7Artisans, Yongnuo/Meike/Samyang/Zeiss)
still to land; merge and verify once each does.

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
| Sigma + Tamron re-check | ✅ both lineups enumerated, 0 new | ✅ N/A — 0 new | ✅ N/A | ✅ N/A | ✅ N/A | 6046cbe |
| Viltrox re-check | ✅ no change | — | n/a | n/a | n/a | 9769bce |
| TTArtisan deferred (9 of 14) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 7Artisans deferred (~39 of 42) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Yongnuo + Meike/Samyang/Zeiss re-check | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |

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
