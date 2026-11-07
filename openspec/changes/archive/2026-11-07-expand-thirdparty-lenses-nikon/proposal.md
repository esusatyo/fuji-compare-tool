# Expand Nikon Z third-party lens coverage (round 2)

## Why

Nikon Z's third-party catalogue was last built in round 1 (archived
`openspec/changes/archive/2026-07-05-add-thirdparty-lenses-nikon/`, 30
lenses) and touched again during the Aug 2026 data refresh (PR #25), which
**removed a fabricated `tamron-11-20mm-f28` entry** (never shipped in Z
mount) and fixed 4 wrong `year` values. Current baseline (verified against
`nikon/data.js` at the start of this round): **31 third-party lenses** across
9 makers — Sigma 3, Viltrox 11, Tamron 6, Laowa 3, Voigtländer 2, Yongnuo 2,
TTArtisan 1, 7Artisans 1, Meike 2. **Samyang currently has 0 entries** despite
round 1 having entered one — worth re-investigating from scratch, not
assuming the prior entry was wrongly removed or wrongly correct.

Nikon Z is a restrictive mount (Sigma AF limited to DC DN APS-C only, no
Zeiss, some Tamron designs sold as first-party Nikkor rebadges — exclude
those). This round re-enumerates each maker's *current* Z-mount lineup
against the maker's own site, adds anything genuinely new/missed, and
explicitly re-verifies mount existence (not just specs) for every candidate,
per the lesson from the Tamron 11-20mm fabrication.

## Scope boundary

Same as the skill's general Nikon guidance: native Z-mount AF from majors
(Sigma, Tamron, Samyang, Viltrox), notable MF/specialty (Voigtländer, Laowa),
representative budget makers (TTArtisan, 7Artisans, Meike, Yongnuo). Exclude
Nikkor-rebadged Tamron designs, EF/F-mount-via-adapter lenses, cine lenses.

## Process note (this round only)

Per explicit user instruction, this round does **not** open its own branch or
PR. All work lands on the existing `expand-thirdparty-lenses-canon` branch
and pushes to the already-open PR #41 alongside the Canon round-2 work. The
skill's normal Step 9 ("branch per brand, one PR per brand") is deliberately
not followed here.
