# Progress — Nikon third-party lenses (round 2)

**Resume at:** Sigma+Tamron batch is now fully complete (correction half +
new-lens-search half, see below). The other 4 batches (Viltrox+Voigtländer,
Laowa+Samyang, Yongnuo+Meike, TTArtisan+7Artisans) still need to be run —
they never got past the scaffold commit after the earlier spend-limit
deaths.

**Branch (this batch):** `nikon-sigma-tamron-v2`, forked from
`origin/expand-thirdparty-lenses-canon` at commit `25a1be6` — a dedicated
branch for this parallel re-run, not the shared `expand-thirdparty-lenses-
canon` branch the process note below still describes. Merge this branch's
work into the shared branch (take the union, no conflicts expected —
this batch only touches `nikon/data.js`, `nikon/index.html`,
`index.html` (generated SEO counts), and files under
`openspec/changes/expand-thirdparty-lenses-nikon/`).
**PR:** https://github.com/esusatyo/fuji-compare-tool/pull/41 (Canon round-2
PR — merge this branch's diff into it, or open a follow-up PR, per
orchestrator's call)
**Last green commit:** (see git log on `nikon-sigma-tamron-v2` — full
`npm test` green, 416/416)

## Baseline (before this round)

31 total: Sigma 3, Viltrox 11, Tamron 6, Laowa 3, Voigtländer 2, Yongnuo 2,
TTArtisan 1, 7Artisans 1, Meike 2, **Samyang 0**. See
`openspec/changes/archive/2026-07-05-add-thirdparty-lenses-nikon/` for round
1's research ledger (checklist of designs to look for — never a source of
specs) and the `refresh-nikon-run-aug-2026` memory for the PR #25
fabrication/year-fix history.

**Known trap for this brand specifically:** a previous `tamron-11-20mm-f28`
entry claimed Nikon Z availability that never existed and was removed in
PR #25. Every candidate this round must have its mount existence verified
directly against the maker (mount-selector dropdown or per-mount SKU list),
independent of specs — never inferred from "the maker makes this lens" or
from an aggregator.

## Batches

| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma + Tamron re-check | ✅ complete (corrections + new-lens search) | ✅ 6 new | ✅ | ✅ 6/6 (maker photos) | ✅ 6/6 | see below |
| Viltrox + Voigtländer | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Laowa + Samyang | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Yongnuo + Meike | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| TTArtisan + 7Artisans | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |

### Sigma+Tamron batch — what actually landed (2026-08-29, hand-merged after agent died)

The agent got through re-verifying Sigma (still exactly 3 DC DN primes on Z,
no DG DN full-frame — corroborated by a 2025-11-02 PetaPixel piece; USD
prices confirmed as RRP, not sigmaphoto.com's active Instant Savings promo)
and had started correcting 4 **existing** Tamron entries before dying mid-way
through that edit (it never reached the "look for genuinely new Tamron/Sigma
Z-mount lenses" part of the assignment). The correction it did make is real
and independently re-verified by the orchestrator before merging:

**Found:** `tamron-17-70mm-f28`, `tamron-35-150mm-f2-28`,
`tamron-50-400mm-f45-63`, and `tamron-70-300mm-f45-63` all had their
**weight/length figures stored from tamron.com's Sony E-mount column**, not
the Nikon-Z column on the same per-lens spec page (the page lists both mounts
inline, e.g. `"160.1mm / 6.3in (Nikon)"` vs a separate Sony figure) — despite
an existing code comment claiming these were "verified" Nikon-Z values.
Corrected all 4 to the genuine Nikon-Z figures, each with a `specSources`
citation. `tamron-70-300mm-f45-63`'s `maxMagnification` was also fixed
(0.11 → 0.20 — the stored figure had taken the zoom's WIDE-end figure instead
of the true TELE-end maximum). `tamron-35-150mm-f2-28`'s USD price was
corrected 1799 → 1999 (the stored figure matched no found source for this
lens; $1,999 is the confirmed Nikon-Z-mount MSRP, still B&H's current list
price — Best Buy's $1,599 is a discount, not a new RRP).

**Independently re-verified by the orchestrator (not just the agent's
self-report)** before merging: WebFetch confirmed tamron.com's own a058
spec page states `1,190g / 160.1mm (Nikon)`, matching the correction exactly;
WebSearch independently confirmed the $1,999 Nikon-Z MSRP via DPReview's
launch article title, corroborated by B&H's current list price still
showing $1,999.

A stray untracked `scripts/price-overrides/nikon.json` was also found in the
agent's worktree, listing CAD overrides for 4 slugs
(`tamron-12-20mm-f28`, `tamron-35-100mm-f28`, `tamron-70-180mm-f28-g2`,
`tamron-90mm-f28-macro`) that **do not exist anywhere in `nikon/data.js`** —
none of these lenses were ever entered by this agent. This looks like
speculative/premature content, possibly carried over from another brand's
work, not tied to any verified Nikon entry. **Discarded, not merged.**

### Sigma+Tamron batch — new-lens search (2026-08-30, completes this batch)

**Sigma**: re-confirmed complete, no changes. sigma-global.com's Nikon Z
mount filter still lists only the existing 3 DC DN primes; no DG DN
full-frame Sigma exists on Z.

**Tamron: 6 new lenses found and entered.** tamron.com's own Nikon Z lineup
page (`tamron.com/global/consumer/lenses/nikon_z/`) lists 12 Di III/Di III-A
lenses; diffed against the 6 already in `nikon/data.js`, surfacing 6 not yet
entered:

| slug | name | USD | year |
|---|---|---|---|
| `tamron-12-20mm-f28` | Tamron 12-20mm f/2.8 Di III VXD | $1,799 | 2026 |
| `tamron-16-30mm-f28-g2` | Tamron 16-30mm f/2.8 Di III VXD G2 | $929 | 2025 |
| `tamron-28-75mm-f28-g2` | Tamron 28-75mm f/2.8 Di III VXD G2 | $999 | 2024 |
| `tamron-35-100mm-f28` | Tamron 35-100mm f/2.8 Di III VXD | $929 | 2026 |
| `tamron-70-180mm-f28-g2` | Tamron 70-180mm f/2.8 Di III VC VXD G2 | $1,149 | 2025 |
| `tamron-90mm-f28-macro` | Tamron 90mm f/2.8 Di III Macro VXD | $699 | 2024 |

Each mount-verified two ways: (1) its own `tamron.com/.../spec.html` page
carries a Nikon-Z-specific weight/length figure distinct from the Sony E
column on the same page, and (2) an independent per-mount B&H SKU
(`AFA0##Z700`-pattern) and/or Amazon listing exists with "Nikon Z" explicit
in the title. All 7 currencies filled (`compute-prices.js`, with real CAD
figures from Tamron's own announcements as overrides for 5 of the 6 — see
`scripts/price-overrides/nikon.json`); no `priceIncomplete` flag needed once
compute-prices ran. All 6 use a verified, visually-confirmed maker product
photo (tamron-americas.com, no `imageCredit` needed — not Commons).

**Corrected a stale/wrong exclusion note.** The pre-existing Tamron section
header claimed "excludes 17-28/28-75/70-180 (sold as Nikkor Z)". That's only
true of the *G1* originals: Tamron's own spec pages for the G1 28-75mm
(A036) and G1 70-180mm (A056) state "SONY E Mount (End of sale)" — never
shipped for Z at all — and no source found this pass substantiates the
"sold as Nikkor Z" rebadge claim; it reads as a probable misreading of
round-1's incomplete research (the empty "to be enumerated" table in the
round-1 archive never actually recorded a verdict). The **G2** successors
(28-75mm G2, 70-180mm G2) ship for Z directly under the Tamron name and are
now entered. Comment corrected in `nikon/data.js` to state only what's
verified.

**Checked and rejected (confirmed Sony-E-only, not entered):**
- `tamron-20-40mm-f28` (Di III VXD) — DPReview forum threads confirm no
  native Z version; not on tamron.com's Nikon Z lineup page.
- `tamron-50-300mm-f45-63` (Di III VC VXD) — not on tamron.com's Nikon Z
  lineup page (don't confuse with the already-shipped 50-**400**mm, a
  different lens).

**Did NOT re-add** `tamron-11-20mm-f28` (the known PR #25 fabrication) —
independently re-confirmed absent from Z via tamron.com's own B060 spec page
(Sony E / Fuji X / Canon RF only, no Nikon Z).

Nikon Tamron count: 6 → 12. Nikon third-party total: 31 → 37.

**Tests:** `npm test` green (416/416) after `node scripts/generate-seo.js`
(lens counts changed the generated landing/brand pages). `verify-images.js
nikon` run in the background to confirm every Nikon imageUrl (not just the
6 new ones) still resolves — see next update to this file or the commit log
for its result if this note wasn't updated after it finished.

## Deferred / skipped (with reason)

- `tamron-20-40mm-f28`, `tamron-50-300mm-f45-63` — confirmed Sony-E-only,
  not a Nikon Z gap. Re-check on a future pass only if Tamron announces a Z
  version.

## Open questions for the user

(none yet)
