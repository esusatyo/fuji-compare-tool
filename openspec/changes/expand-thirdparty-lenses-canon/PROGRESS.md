# Progress — Canon third-party lenses (round 2)

**Resume at:** 7Artisans batch researched and closed out with 0 new entries
(2026-08-29) — see "Deferred / skipped" below for the 14-candidate list and
per-candidate blocker before re-attempting. TTArtisan deferred batch and the
Viltrox re-check are still outstanding.

**Branch:** expand-thirdparty-lenses-canon   **Last green commit:** dae183b (archival housekeeping) — this batch made no `canon/data.js` changes, so it stays the last green commit.

## Baseline (before this round)

29 total: Sigma 10, TTArtisan 5, Laowa 5, Tamron 3, 7Artisans 3, Yongnuo 2,
Viltrox 1. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/`
for the full prior research ledger — read it before re-researching anything,
especially the "Rejected candidates" and "Deferred with unresolved source
conflicts" tables.

## Batches

| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma + Tamron re-check | ⬜ (not touched by this worktree) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Viltrox re-check | ⬜ (not touched by this worktree) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| TTArtisan deferred (9 of 14) | ⬜ (not touched by this worktree) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| 7Artisans deferred | 14/14 researched | 0 entered | n/a | n/a | n/a | no data commit — research/PROGRESS only |
| Yongnuo + Meike/Samyang/Zeiss re-check | ⬜ (not touched by this worktree) | ⬜ | ⬜ | ⬜ | ⬜ | — |

Note: other batches may have been worked in parallel by other agents/worktrees
on this same branch name — check `git log` and `tasks.md` against the branch
you're actually resuming on before trusting this table's ⬜ marks; this
worktree's own `tasks.md` (as of this commit) shows only task 0 checked.

## 7Artisans batch — findings (2026-08-29)

Re-pulled `7artisans.store/products.json` fresh (121 products). After
excluding cine/T-stop lenses (out of scope), the discontinued EF-M mount
(`Canon EOS-M` is not RF), the 3 already-entered lenses, and one accessory
(PL adapter kit), **14 non-cine candidates remain, none entered this pass.**

The `.store` dimension-diagram technique from round 1 is confirmed still
real (validated against the 3 existing entries — `7artisans-9mm-f56`'s page
still shows the exact Φ70mm × 86mm that's in `data.js`), but it does **not**
generalize across the catalogue:
- Several candidate pages (50mm f/1.05, 55mm f/1.4 Mark II) use an older page
  template with no numeric spec grid or dimension diagram at all.
- One candidate (35mm f/0.95 APS-C) has a full spec grid but **no dimension
  diagram anywhere on the page** (confirmed to footer).
- One candidate (60mm f/2.8 full-frame 2X ultra-macro) has a weight figure in
  marketing prose (about 550g) but no numeric grid or diagram.
- One candidate (14mm f/2.8, a very recent release) has the richest template
  seen — full spec grid *and* a "Product Parameters" dimension-diagram
  section — but the diagram's underlying element (a rounded-corner
  canvas/video component) never renders any content, confirmed via repeated
  waits, a fresh reload, and a pixel-region zoom capture. Its weight figure
  is also explicitly marked "(E)" (Sony E-mount only), so even a working
  diagram wouldn't have resolved the RF-specific weight.

Full per-candidate detail (spec-grid presence, diagram presence, sourced
partial figures) is in `research/lenses.md` and `research/sources.md` under
their 2026-08-29 sections.

## Deferred / skipped (with reason)

7Artisans candidates deferred this pass (all lack a sourceable
`length`/`diameter` pair, which is non-nullable):

- `7artisans-6mm-f2` (6mm f/2.0 APS-C fisheye) — not checked for template
  richness yet; untried.
- `7artisans-12mm-f28-ii` (12mm f/2.8 Mark II APS-C) — untried.
- `7artisans-14mm-f28` (14mm f/2.8 full-frame, new release) — spec grid
  sourced (F2.8-F22, Φ77mm filter, 13/9 elements/groups, 116° AOV, 10
  blades, manual focus, metal) but weight is Sony-E-specific (about 504g)
  and the dimension-diagram element renders empty (likely broken video
  component, not a timing issue) — re-check next pass in case 7Artisans
  fixes the storefront component, or source length/diameter from a
  corroborating retailer listing (B&H/Amazon box dims) instead.
- `7artisans-75mm-f14` (75mm f/1.4 full-frame) — untried.
- `7artisans-10mm-f28` (original 10mm f/2.8 fisheye, pre-Mark-II) — untried;
  round 1 already captured partial specs for this exact lens (filter none,
  MFD 17cm, f22 min, 570g, 11/8 elements/groups, 68x87mm L x diameter, store
  USD 256.00) blocked only on `year` at the time — worth checking if that
  old partial data plus a fresh year lookup is enough to enter without
  needing the diagram again.
- `7artisans-35mm-f14` (original 35mm f/1.4 APS-C, pre-Mark-III) — untried.
- `7artisans-25mm-f095` (25mm f/0.95 APS-C) — round 1 also captured partial
  specs (filter 52mm, MFD 25cm, f16 min, 587g, 11/9 elements/groups, 100x62mm
  L x diameter, store USD 143.40) blocked on `year`, with a flagged
  sanity-check concern (587g/100mm looked heavy/long for an APS-C 25mm) —
  re-verify that concern before trusting the old figures.
- `7artisans-50mm-f095` (50mm f/0.95 APS-C) — untried.
- `7artisans-60mm-f28-2x-macro` (60mm f/2.8 full-frame 2X ultra-macro) —
  weight sourced (about 550g, confirmed shown on a Canon EOS R body) but no
  length/diameter; page has no numeric grid or diagram at all.
- `7artisans-60mm-f28-ii-macro` (60mm f/2.8 Mark II APS-C macro) — untried.
- `7artisans-55mm-f14-ii` (55mm f/1.4 Mark II APS-C) — checked, older
  template, no numeric specs beyond marketing prose at all.
- `7artisans-50mm-f105` (50mm f/1.05 full-frame) — checked, older template,
  no numeric specs beyond marketing prose at all.
- `7artisans-35mm-f56` (35mm f/5.6 full-frame) — untried.
- `7artisans-35mm-f095` (35mm f/0.95 APS-C) — checked, full spec grid
  sourced (weight 369g, 11/8 elements/groups, 12 blades, Φ52mm filter, MFD
  0.37m, f0.95-16, 43.9° AOV, stepless aperture ring, metal body, USD RRP
  $249 — do not use the $149.25 sale price seen at read time) but **no
  dimension diagram anywhere on the page** — confirmed scrolled to footer.
  Closest to enterable of anything checked; only length/diameter missing.
- `7artisans-75mm-f28-ii` (7.5mm f/2.8 Mark II APS-C fisheye) — untried.

**Next-pass recommendation:** try Amazon/AliExpress listing "package
dimensions" as a tier-3 corroborating source for `35mm-0-95` and
`60mm-f-2-8-2x-macro` specifically, since both have every other field sourced
tier-1 and are blocked on exactly one pair of numbers each. For the 6
completely-untried candidates, check template richness first (does the page
have a numeric spec grid at all?) before investing in the diagram hunt.

(carried forward from the archived round — see its PROGRESS.md for older
TTArtisan/7Artisans deferred items pre-dating this round)

## Open questions for the user

(none yet)
