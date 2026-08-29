# Progress — Canon third-party lenses (round 2)

**Resume at:** 5 maker batches launched in parallel (2026-08-29); merge and
verify once each lands. Viltrox batch is done (no data change — see
"Confirmed unchanged" below); Sigma+Tamron, TTArtisan, 7Artisans, and
Yongnuo/Meike/Samyang/Zeiss batches still outstanding as of this commit.

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
| Sigma + Tamron re-check | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Viltrox re-check | ✅ no change | — | n/a | n/a | n/a | (this commit) |
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

## Open questions for the user

(none yet)
