# Progress — Nikon third-party lenses (round 2)

**Resume at:** All 5 parallel maker-batch agents hit the account's monthly
spend limit (HTTP 429) mid-run on 2026-08-29 and terminated with zero
commits each. One (Sigma+Tamron) left salvageable uncommitted work in its
worktree, independently re-verified and merged by hand (see below). The
other 4 (Viltrox+Voigtländer, Laowa+Samyang, Yongnuo+Meike,
TTArtisan+7Artisans) produced **no artifacts at all** — their worktrees sit
at the scaffold commit with no diff. **All 5 batches still need to be
(re)run from scratch once the spend limit resets** — none of the "find new
lenses" research actually happened yet; only a spec-correction pass on 4
already-existing Tamron entries got done.

**Branch:** expand-thirdparty-lenses-canon (shared with the Canon round-2
work per explicit user instruction — no dedicated Nikon branch this round)
**PR:** https://github.com/esusatyo/fuji-compare-tool/pull/41 (same PR as Canon)
**Last green commit:** (see git log — the hand-merged Tamron correction commit)

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
| Sigma + Tamron re-check | 🟡 partial | n/a — corrections only | n/a | n/a | ✅ 1 price fix | hand-merged, see below |
| Viltrox + Voigtländer | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Laowa + Samyang | ✅ 21 Laowa + 2 Samyang | ✅ 23 | ✅ | ⬜ deferred (KNOWN_IMAGE_GAPS) | ✅ | pending (see below) |
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

**Still outstanding for this batch** (not started before the agent died):
enumerating genuinely new Sigma/Tamron Z-mount lenses beyond the existing
3+6. Needs a fresh run.

### Laowa + Samyang batch — what landed (2026-08-30)

**Branch note:** this batch's agent was assigned a fresh worktree from
`origin/main` (stale) and had to `git fetch` + branch from
`origin/expand-thirdparty-lenses-canon` at commit `25a1be6` before starting
(that commit is the hand-merged Sigma+Tamron correction above). It ended up
on branch `nikon-laowa-samyang-v2`, pushed separately, **not** landed
directly on `expand-thirdparty-lenses-canon` — the orchestrator will need to
merge it in (expected purely additive: this batch only touches Laowa/Samyang
sections of `LENSES`, the Laowa/Samyang rows of `LENS_DROPDOWN_GROUPS`, and
`KNOWN_IMAGE_GAPS.nikon` — no overlap with the Sigma/Tamron or other
in-flight batches' sections).

**Samyang — the investigation this round was asked to do:** git history
(`git log --all -p -- nikon/data.js`) found commit `9266255` (2026-07-13)
removed round 1's single Samyang entry, `samyang-135mm-f18` (AF), with the
stated reason "Samyang's Nikon Z lineup doesn't include this lens (their AF
135mm F1.8 is Sony E-only)" — a genuine mount-fabrication fix, not
unrelated link-rot cleanup. **Independently re-verified from scratch**
against `samyangus.com`'s own Nikon Z collection filter (not the removed
entry, not an aggregator): it lists exactly 2 lenses today, both tagged
Manual Focus — `14mm F2.8 Full Frame Ultra Wide Angle (Nikon Z)` and `85mm
F1.4 Full Frame Telephoto (Nikon Z)`. Both entered with full spec tables
from the maker's own Specifications accordion. Cross-checked against
independent 2026 reporting (Nikon Rumors, Digital Camera World): Nikon has
**not** licensed Samyang for AF Z-mount lenses as of this writing — which is
exactly why the AF 135mm f/1.8 was fabricated/wrong and why these two MF
lenses (no electronic contacts, no license needed) are the *entire*
legitimate Samyang Z-mount lineup today. Not "0 entries was wrong" in a
simple sense — the 135mm removal was correct — but "0 entries" undersold
what Samyang actually does ship: two long-standing manual primes (customer
reviews on both date back to 2019-2020).

**Laowa — full re-enumeration:** read venuslens.net's entire 72-product
camera-lens shop listing end-to-end (not just the round-1 candidate leads)
and checked every product's Nikon Z availability. Found 21 new lenses beyond
the 3 already entered, including all 5 round-1 leads that turned out to
genuinely ship (12mm f/2.8 Lite Zero-D AF, 58mm f/2.8 2X macro, 65mm f/2.8
2X macro, 100mm f/2.8 2X macro, Argus 33mm f/0.95 APS-C) plus 16 more not on
that list at all — notably Laowa's entire Tilt-Shift/Shift family (17mm,
20mm, 15mm shift; 35mm/55mm/100mm tilt-shift-macro; 12-24mm zoom-shift) and
both of Laowa's current *autofocus* lenses (10mm f/2.8, 12mm f/2.8 Lite —
Laowa's only two AF designs to date, both Sony E/Nikon Z only). Full
per-lens citation ledger in `research/lenses.md`; every mount confirmed via
the live purchase-mount dropdown (not just prose, which was caught being
stale for the 65mm macro).

**Data entered:** all 23 lenses have full specs (`elements`/`groups`,
apertures, dimensions, weight, `afType`, `year`), a `specSources` citation
block (T1 + T2 each), `LENS_DROPDOWN_GROUPS` placement (Laowa group
expanded to 24 total; new `── Samyang ──` group added), USD pricing sourced
from the maker, and all 7 currencies filled via
`node scripts/compute-prices.js nikon lenses` (initially entered with
`priceIncomplete:true` matching this file's existing third-party-lens
convention, then deliberately removed before running compute-prices.js —
per the skill, that flag is an opt-out for "should stay USD-only", not a
default, and there was no reason these 23 should be withheld from the
approximate-RRP derivation the rest of the round is using).
`MANUFACTURER_COLORS.Samyang` in `engine.js` already existed (from another
brand's earlier work) — no engine change needed.

**Images:** deferred to `KNOWN_IMAGE_GAPS.nikon` for all 23, with a comment
explaining why (batch size vs. time budget) — a genuine documented gap per
the skill's 3rd allowed outcome, not a silent skip. Follow-up
`fetch-product-images` pass needed.

**Test status:** `npm test` — 416/416 green (174 data + 242 logic).
`node scripts/generate-seo.js` re-run (lens counts changed).

## Deferred / skipped (with reason)

- All 23 new Laowa/Samyang lenses' `imageUrl` — genuine gap, allowlisted in
  `KNOWN_IMAGE_GAPS.nikon`; needs a `fetch-product-images` follow-up pass.
- No ASINs sourced for the 23 new lenses (`asin:null` throughout) — belongs
  to a `check-prices-and-buy-links` follow-up per the skill's division of
  labor.
- `laowa-15mm-f45-shift`'s USD price ($1,199) is the top of a
  venuslens.net "Sale!" range ($839–$1,199) whose lower/upper split by
  variant (blade count) wasn't fully disambiguated — flagged in case a more
  precise per-variant figure surfaces later.

## Open questions for the user

(none yet)
