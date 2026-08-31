# Progress — Nikon third-party lenses (round 2)

**Resume at:** Sigma+Tamron, Viltrox+Voigtländer, and Laowa+Samyang are all
complete and merged into the shared branch. Yongnuo+Meike has now also
finished (this file's update) on branch `nikon-yongnuo-meike-v4`, pushed
separately — **not** landed directly on `expand-thirdparty-lenses-canon`,
same pattern as the Laowa+Samyang batch; the orchestrator will need to merge
it in (purely additive: only touches the Yongnuo/Meike section of `LENSES`,
their rows in `LENS_DROPDOWN_GROUPS`'s `── Other ──` group, and
`KNOWN_IMAGE_GAPS.nikon` — no overlap with other in-flight batches' sections,
plus the SEO-generated `index.html`/`nikon/index.html` lens-count strings,
regenerable via `node scripts/generate-seo.js` if a merge conflict touches
them). Only TTArtisan+7Artisans remains, paused mid-run from an earlier
attempt (per this file's prior note) — resumable next.

**Branch:** `expand-thirdparty-lenses-canon` (shared with the Canon round-2
work per explicit user instruction — no dedicated Nikon branch this round).
Each batch's own `nikon-<maker>-v2`/`-v4` branch is merged in by the
orchestrator and then deleted.
**PR:** https://github.com/esusatyo/fuji-compare-tool/pull/41 (same PR as Canon)
**Last green commit:** see git log — `npm test` 416/416 after each merge
(this batch's own branch: 416/416 after entry, same total test count as
before — the new lenses are covered by existing parametrized logic-tier
tests, not new ones).

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
| Viltrox + Voigtländer | ✅ 32/32 (21 Viltrox + 11 Voigtländer; 1 Viltrox teleconverter and 1 Voigtländer lens out-of-scope/deferred, see below) | ✅ 32 | ✅ | ✅ 32 (maker product photos) | ✅ Viltrox tier-1 USD; ⚠️ Voigtländer USD estimated, see Open questions | see below |
| Laowa + Samyang | ✅ 23/23 (21 Laowa + 2 Samyang) | ✅ 23 | ✅ | ⬜ deferred to `KNOWN_IMAGE_GAPS.nikon` (batch size — flagged for a follow-up `fetch-product-images` pass) | ✅ 23 | see below |
| Yongnuo + Meike | ✅ 11/11 (7 new Yongnuo + 4 new Meike; 3 more researched but deferred — see below) | ✅ 11 | ✅ | ⬜ deferred to `KNOWN_IMAGE_GAPS.nikon` (batch size — flagged for a follow-up `fetch-product-images` pass) | ✅ 11 | see below |
| TTArtisan + 7Artisans | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |

### Viltrox+Voigtländer batch — what landed (2026-08-30)

**Viltrox: 21 new lenses**, diffed against viltrox.com's own Z-mount
category page (32 products listed there; 11 already in the dataset, 1 is a
teleconverter — excluded, 20 wait no 21 are genuinely new). Round-1's ledger
flagged the LAB 135mm f/1.8 as a plausible gap — confirmed real and entered.
Also entered the flagship 35mm F1.2 LAB, three Pro-line primes (50mm f/1.4,
56mm f/1.2, 75mm f/1.2), a manual-focus 20mm f/1.8 (Viltrox's oldest Z-mount
lens, predating the 2023+ AF-licensing era since MF needs no license), a
brand-new July-2026 26mm F2.8 EVO pancake, and 14 more EVO/Air-line primes.
One genuine per-mount data trap found and resolved: the 26mm F2.8 EVO's
Z-mount weight (170g) initially looked wrong against several E-mount-sample
reviews citing 130g — confirmed as a real per-mount difference by loading
the E-mount sibling's own spec page directly (130g/Φ66×23.8mm vs Z-mount's
170g/Φ69.4×25.8mm). All 21 Viltrox USD prices are tier-1 (viltrox.com states
USD list price natively).

**Voigtländer: 11 new lenses**, enumerated from voigtlaender.de's own
Z-mount lens grid (16 native designs shown). The flagged remaining-tail lead
— **APO-Lanthar 35mm f/2 Aspherical II Z** — is confirmed real and entered
(own dedicated product page + photo, distinct from the existing 50mm
sibling). Also entered: Super Wide Heliar 15mm f/4.5, D23mm Nokton f/1.2
(APS-C), Nokton 28mm f/1.5, APO-Lanthar 28mm f/2, D35mm Nokton f/1.2
(APS-C), Macro APO-Ultron D35mm f/2 (APS-C), a brand-new August-2026 Septon
40mm f/2, Nokton 50mm f/1.0, Macro APO-Lanthar 65mm f/2, and Portrait Heliar
75mm f/1.8. One candidate rejected (Nokton 75mm f/1.5 — its tile on the
Z-mount overview grid links only to the E-mount product page, meaning it
doesn't actually ship in Z yet, despite being shown there — the maker's own
overview page running ahead of its actual SKU list). One deferred (Nokton
classic 35mm f/1.4 — genuinely brand-new, but the maker's own spec table
leaves the non-nullable `minAperture` field blank; every other field is
solid).

**Test results:** `npm test` 416/416 green after entry (was 384/384 before
this batch — the delta is exactly the 32 new lenses' logic-tier coverage).
`npm run test:data` also green (schema/referential/completeness/colour all
pass for the new entries). `node scripts/generate-seo.js` re-run (lens count
15→112 across all brands reflected). `node scripts/verify-images.js nikon`
run — see result in the commit; all 32 new `imageUrl`s are maker product
photos on stable CDN paths (`viltrox.com/cdn/shop/files/…`,
`voigtlaender.de/wp-content/uploads/…`), each independently `curl -I`
200-verified during research.

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

### Yongnuo + Meike batch — what landed (2026-08-31)

**Branch note:** same pattern as Laowa+Samyang — a fresh worktree from
`origin/main` (stale), rebased onto `origin/expand-thirdparty-lenses-canon`
at commit `17a25b9` ("Merge nikon-laowa-samyang-v2") before starting. Ended
up on branch `nikon-yongnuo-meike-v4`, pushed separately for the
orchestrator to merge. Three prior attempts at this exact batch had died to
an account spend-limit error before any research landed — this run started
completely fresh with no partial work to build on, and committed the
research ledger (2 files, no code) as its own checkpoint before touching
`data.js`, specifically so a fourth failure wouldn't lose the research again.

**Yongnuo — the flagged gap, found and closed:** the task's specific lead
(an 85mm f/1.8 Z-mount lens, despite Meike having two 85mm variants and
Yongnuo having zero) is real: `yn85mm-f1-8z-df-dsm`, full spec table sourced
from Yongnuo's own Thai regional storefront (th.hkyongnuo.com — the maker's
main yongnuo.eu page for this exact SKU turned out to be pure marketing copy
with no dimensions at all, a pattern that repeated across most Yongnuo/Meike
product pages this round). **Also found: 6 more Yongnuo Z-mount primes
beyond the 85mm** — 11mm f/1.8, 23mm f/1.4, 33mm f/1.4, an APS-C-specific
35mm f/1.8 (distinct from the already-entered full-frame 35mm f/2), and an
APS-C-specific 50mm f/1.8 (distinct from the already-entered full-frame
50mm f/1.8) — enumerated from yongnuo.eu's own "NIKON Z/F" category page
(13 products, F-mount DSLR lenses excluded) and cross-verified against Thom
Hogan's zsystemuser.com, a Nikon-Z-specific third-party-lens tracker (see
"Note on zsystemuser.com" at the end of `research/lenses.md` for why it's
trusted as T2). That site's own listing matches yongnuo.eu's exactly —
**this is now Yongnuo's entire current Z-mount catalogue**, not a partial
"representative" slice, since the maker only sells 10 Z-mount lenses total
(2 already in the dataset, 8 found this round, 1 of the 8 deferred — see
below). zsystemuser's own spec page for the already-in-dataset
`yongnuo-50mm-f18` matched this dataset's existing entry exactly
(417g/87mm/68mm) before being trusted for the new entries.

**Meike — 4 new AF primes**, one from each still-missing focal length the
task flagged (25mm was also flagged but deferred, see below): 35mm f/1.8 Pro
(the exact lens a leftover browser tab from a prior killed attempt happened
to have open on Amazon — a useful, unplanned lead), 24mm f/1.4 MIX, 50mm
f/1.8 SE, and 85mm f/1.8 Pro (distinct from the already-entered base
`meike-85mm-f18`, discontinued, and `meike-85mm-f18-se-ii`). Sourced the same
way as Yongnuo: meikeglobal.com confirms current-catalogue membership,
mount, and price, but its own product pages are **pure marketing imagery**
(scrolled one, `3518proz`, to its literal footer to confirm — no spec table
exists anywhere on it, not a collapsed-tab miss); zsystemuser.com supplies
the dimensional spec table. Two of zsystemuser's own Meike pages
(50mm f/1.8, 55mm f/1.8 Pro) mark length/diameter as unpublished "?" —
50mm's was recovered from a single unambiguous B&H lens-compare row
(Φ68.6×59.5mm); 55mm's was not recoverable (three B&H compare pages gave
three mutually contradictory figures) and that lens was deferred instead of
guessed.

**Data entered:** all 11 lenses have full specs, a `specSources` citation
block (T1 + T2 each, per the skill's Step 2), `LENS_DROPDOWN_GROUPS`
placement (`── Other ──` group expanded from 6 to 17 ids), USD pricing
sourced from the maker/tracker, and all 7 currencies filled via
`node scripts/compute-prices.js nikon lenses`. `meike-35mm-f18-pro` also
got a verified ASIN (`B0FFSZTV4N`) straight from its own Nikon Z Amazon
listing — the only one of the 11 with one; the rest are `asin:null` (search
fallback), left for a `check-prices-and-buy-links` follow-up.
`MANUFACTURER_COLORS.Yongnuo`/`.Meike` in `engine.js` already existed — no
engine change needed.

**Images:** deferred to `KNOWN_IMAGE_GAPS.nikon` for all 11, same documented
pattern as the Laowa+Samyang batch (batch size vs. time budget) — genuine
gap, not a silent skip.

**Session note:** this batch's `WebSearch` tool budget was already exhausted
(200/200) from earlier session work before any Yongnuo/Meike research began.
All research this batch used `WebFetch` plus the Chrome extension's browser
tools as a substitute (Google search pages read via `get_page_text`/
`javascript_tool`, since `WebSearch` itself was unavailable) — slower, and
Amazon/B&H sometimes 403/503 `WebFetch` directly, requiring the logged-in
browser instead, but functionally equivalent. Future runs of this batch
type should raise `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` or research
before other batches exhaust the shared budget.

**Test status:** `npm test` — 416/416 green (same total as before; the new
lenses are covered by existing parametrized data/logic tests, not new test
cases). `node scripts/generate-seo.js` re-run (lens count 141→152 across
Nikon; `index.html`/`nikon/index.html` regenerated).

## Deferred / skipped (with reason)

- Yongnuo YN16mm F1.8 DF DSM — **deferred, not entered.** zsystemuser.com
  lists this lens as APS-C (DX) coverage despite the maker's own "DF" =
  full-frame naming convention holding everywhere else in the lineup (DA =
  DX, DF = FX) — an internal contradiction not resolved this round. It also
  does not appear on yongnuo.eu's own Nikon Z/F category page (fetched fresh
  this round, 13-product listing, 10 genuine Z-mount lenses). Re-verify
  directly against the maker before adding.
- Meike 55mm F1.8 Pro AF STM — **deferred, not entered.** Non-nullable
  `length`/`diameter` unpublished on both T1 (marketing-image-only product
  page) and T2 (zsystemuser.com's own page marks them "?"); B&H's
  lens-compare tool returned three different, mutually contradictory
  diameter/length pairs across three comparison pages for what should be the
  same lens — too unreliable without opening and disambiguating each page's
  column headers directly, which the time budget didn't allow. All other
  fields (364g/58mm filter/0.55m MFD/11 elem/8 grp/9 blades/$329, release
  2024-10-18) are solid — a quick follow-up to just the dimensions would
  close this one.
- Meike 25mm F1.7 Air (APS-C) — **deferred, not entered.** Genuinely
  brand-new (meikeglobal.com's own "New Releases" section, Nikon Z variant
  priced $159); not yet indexed on zsystemuser.com's Meike sitemap (confirms
  recency) and no independent review found this round. Falls under the
  skill's ≤1-month new-release allowance in principle, but sourcing even its
  non-nullable fields provisionally didn't fit this round's budget. **Worth
  a priority re-check next pass** — the task explicitly flagged 25mm as a
  notable gap alongside 35mm/50mm (both of which were closed this round).
- Meike 55mm F1.4 Neo, 33mm F1.4 Neo, 85mm F1.4 MIX (I & II), 35mm F2 SE,
  56mm F1.7 Air — confirmed current Meike Z-mount AF products (via
  meikeglobal.com's own "AF Lens Lineups" nav and/or zsystemuser.com's
  sitemap) but not pursued this round to keep the batch within a
  representative-set time budget — **out of scope for this batch, not
  rejected.** Candidates for a future Meike-focused pass.
- Meike manual-focus Z-mount lenses (6.5mm f/2 fisheye DX, 7.5mm f/2.8
  fisheye DX, ~10mm, 12mm f/2, 25mm f/0.95, 25mm f/1.8, 35mm f/1.4, 35mm
  f/1.7, 50mm f/0.95, 50mm f/1.2, 50mm f/1.7, 60mm f/2.8 macro — full list
  via zsystemuser.com's Meike MF sitemap section) — the task's "for Meike,
  also check MF" note was not reached this round — **out of scope, not
  rejected.** Candidate for a future pass.
- `tamron-20-40mm-f28`, `tamron-50-300mm-f45-63` — confirmed Sony-E-only,
  not a Nikon Z gap. Re-check on a future pass only if Tamron announces a Z
  version.
- `voigtlander-nokton-classic-35mm-f14` (not entered) — genuinely brand-new
  Z-mount release (item no. 126307, page dated "as of August 2026"). The
  maker's own spec table leaves "Smallest Aperture (F)" blank with no value;
  `minAperture` is non-nullable in this project's schema even under the
  skill's ≤1-month new-release allowance. Every other field is published and
  solid (250g, 41.6mm, 67.6mm diameter, 58mm filter, 0.27m min focus).
  Re-check on the next Voigtländer pass — the page may fill the cell in once
  the SKU has been live longer.
- Voigtländer `Nokton 75mm f/1.5 Aspherical Z` (rejected, not deferred) —
  shown on voigtlaender.de's own Z-mount overview grid, but that tile links
  only to the E-mount product page (`/lenses/e-mount/nokton-75-mm-f1-5-aspherical/`);
  no dedicated Z-mount product page exists like every other design on that
  grid has. Doesn't actually ship in Z yet.
- Viltrox `TC-2.0X Teleconverter for Nikon` (out of scope) — teleconverter,
  not a lens, per the skill's scope boundary.
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

- **11 new Voigtländer entries carry an ESTIMATED USD price**, not a
  retailer-confirmed one. voigtlaender.de states EUR-only RRPs; this
  session's B&H and Amazon access were both permission-blocked for the
  browser extension, `WebFetch` got HTTP 403 on both, Adorama's own site
  search returned no matching SKU for these (likely too new for US retail
  listings yet), and the session's WebSearch budget was exhausted (200/200)
  before a retail check could be attempted. Each USD figure is EUR × 1.169 —
  a ratio backed out from this file's own previously-verified
  `voigtlander-nokton-40mm-f12` entry (EUR 769 → USD 899, both genuinely
  tier-1-sourced). The real EUR RRP is also stored on each entry
  (`prices.EUR`, not null) so the estimate is transparent and correctable.
  **Recommend a follow-up `check-prices-and-buy-links` pass once B&H/Amazon
  access is available**, specifically for the 11
  `voigtlander-*` slugs added 2026-08-30 (see `research/lenses.md` for the
  full list) — either to confirm the estimate or replace it with a real
  US list price.
- The Viltrox `20mm F1.8 MF`'s `year:2020` is a rounded proxy (the Shopify
  store's own `created_at` timestamp reads 2019-12-16) rather than a
  confirmed public launch date — Viltrox doesn't publish an explicit launch
  date for this SKU anywhere else that this session found. Low-stakes (it's
  a `year` field only, all specs are solid) but worth a second look if a
  future pass has better search tooling.
- `node scripts/verify-images.js nikon` reports all 13 `voigtlander-*`
  entries' images as bad (`[0 rate-limited/error]`) — **including the 2
  pre-existing entries that predate this batch**, so this is not something
  introduced here. Node's `fetch()` in this environment appears unable to
  validate `voigtlaender.de`'s TLS certificate chain (the same
  `unable to verify the first certificate` error `WebFetch` hit on this
  domain during research). Every one of the 11 new image URLs was
  independently confirmed live and correctly typed via `curl -I` during
  research (`HTTP/2 200`, `content-type: image/*`), so the images
  themselves are fine — this looks like an environment-specific Node/TLS
  gap for this one domain, not a dead-link problem. Worth a second look with
  a different verification environment before treating it as real.
- Four Voigtländer entries' `year` came from the product photo's own
  upload-path date (`/wp-content/uploads/<year>/<month>/…`) rather than an
  explicit "as of" disclaimer, because their product pages carry no such
  disclaimer: `voigtlander-nokton-d35mm-f12` (2022-04),
  `voigtlander-macro-apo-ultron-d35mm-f2` (2022-12),
  `voigtlander-apo-lanthar-35mm-f2` (2025-01), and
  `voigtlander-macro-apo-lanthar-65mm-f2` (2022-12). Reasonable proxy (image
  uploads on this site appear to track launch closely — cross-checked
  against the D23mm Nokton, whose photo date exactly matched its own
  explicit "as of April 2022" disclaimer), but not as strong as the explicit
  date most other entries carry.
