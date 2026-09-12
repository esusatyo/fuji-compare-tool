# Research decisions — Olympus brand (running log)

Decisions made during research that aren't obvious from the data itself.
Updated as each research/data-entry task raises a new one.

## 1. Mid-cycle "s"-suffix running changes are excluded (task 1.1)

**Decision.** `E-PL1s` (Nov 2010) and `E-M10 Mark III s` (2018) are **not**
separate camera entries. They fold into their base model (`e-pl1`, `e-m10-iii`).

**Why.** Both were minor mid-cycle spec bumps sold alongside the base model —
a different kit-lens/color option for the E-PL1s, C4K video added for the
E-M10 III s — not a new generation with its own place in the lineup. No brand
on this site splits a minor running change into its own entry (Sony doesn't
have an "A7 IVs", Nikon no "Z6 IIIs"), and Olympus's own naming treats the "s"
as a suffix on the existing model, not a Roman-numeral generation bump.

## 2. E-M10 Mark IV is treated as discontinued, despite a real regional wrinkle (task 1.1)

**Decision.** `e-m10-iv` gets `discontinued: true`.

**The wrinkle.** OM System's own official US store (`explore.omsystem.com/us/en/cameras`)
does not list it, `E-M1 Mark III`, or `E-M5 Mark III` at all as of 2026-09-12 —
only PEN, OM-1 Mark II, OM-3, OM-3 ASTRO, and OM-5 Mark II appear. But a
2026-01-12 PetaPixel piece reports OM System told them the E-M10 IV's
discontinuation is "Japan-specific" and there were "no current plans" to pull
it from the US at that time — eight months before this research date, and
before the new PEN (which shares the E-M10 IV's entry-level price point)
existed.

**Why discontinued wins anyway.** Every other brand's discontinued/current
split in this dataset is decided by the same signal: does the manufacturer's
own current store list it? (Nikon Z7 II/Z6 II/Z5 were flipped *to* current
specifically because nikonusa.com listed them live.) OM System's own US store
not listing the E-M10 IV today is that same signal, eight months after the
"no plans" statement — and the new PEN's arrival at almost the identical price
point is a plausible reason a plan can have changed since January. **Flagging
this for a fresh check at task 4 entry time** rather than treating it as
settled; if `explore.omsystem.com` still doesn't list it then, ship
`discontinued: true` with this note as the citation trail.

## 3. OM-3 ASTRO is a full separate camera entry, not a flag (task 1.1)

**Decision.** `om-3-astro` is its own entry, distinct from `om-3`.

**Why.** It has its own product page, its own price ($2,499.99 vs the OM-3's
$1,999.99), and a real hardware difference (a modified IR-cut filter tuned for
Hα transmission) plus astro-specific firmware modes and color profiles — not a
cosmetic color option. Precedented by Canon's EOS Ra, a similarly IR-modified
sibling sold as its own SKU. Every other invariant field (sensor, IBIS, body,
weather sealing) is identical to the OM-3 and should be copied, not
re-researched, at entry time.

## 4. The brand-new "PEN" (2026) is entered with nullable fields left open (task 1.1)

**Decision.** Slug `pen-om` (not bare `pen`, to avoid colliding with the PEN
*line*'s own name in prose/dropdown labels). Full USD-sourced spec sheet
already pulled from explore.omsystem.com (T1). Regional prices and ASIN are
genuinely not yet findable four days after a 2026-09-09 launch — left `null`
with `priceIncomplete: true` when entered (task 4), per CLAUDE.md's standing
allowance for very recently released items. Not a research gap to chase harder
right now; revisit at the next price/ASIN pass once retailers list it.

## 5. Owner verdicts on the two scope questions (task 1.4, 2026-09-12)

- **Olympus Air A01 — excluded**, matching the recommendation. It has no
  screen, EVF, or shutter button (phone-driven), which would need placeholder
  conventions in three required schema fields no other camera on the site uses.
- **Tough / TG series — included**, against the recommendation. Real
  consequence: this is the site's first small-sensor (1/2.3") fixed-lens
  camera class, on a brand that otherwise spans an actual interchangeable
  MFT mount. See §6 for how that's reconciled with the `mount` field.

## 6. Tough/TG bodies get `mount: 'mft'` — a real sensor-size mismatch, resolved by existing precedent

**Decision.** All 7 Tough/TG cameras take `mount: 'mft'`, Olympus's only
declared mount — even though a 1/2.3" sensor is roughly 8× smaller in area
than Micro Four Thirds and shares no physical compatibility with it.

**Why this isn't a schema violation.** The codebase already has this exact
pattern: Fujifilm's `x-hf1` ("X Half") carries a **1" sensor**
(`sensorType: '1" Primary Color CMOS'`) — genuinely not APS-C — but is tagged
`mount: 'x'`, the same id as every interchangeable X-mount body.
`tests/data/mounts.test.js`'s `SENSOR_RULES` table, which cross-checks a
camera's `mount` against its `sensorType` text, **only exists for brands
spanning more than one mount** (its own comment: "elsewhere there is nothing
to tell apart"). Olympus declares one mount, so there is no sensor-agreement
rule to satisfy or violate — `mount` here functions as a brand/system identity
tag for grouping and the mount-filter UI, not a literal physical-compatibility
assertion. `lensType: 'Fixed'` already carries the "this isn't interchangeable"
signal; `mount` doesn't need to re-encode it.

**Scope interpretation, not asked separately:** "Tough/TG series" is read as
the numbered TG-1 through TG-7 line specifically, not the older pre-2012
"Stylus Tough" naming. Documented in cameras.md as an interpretation to
revisit if it reads as too narrow, not re-raised as its own question — it's a
boundary-drawing detail within an already-answered scope decision, the same
kind of call the DSLR exclusion already makes without separate sign-off.

## 7. Teleconverters excluded from the lens catalogue (task 1.2)

**Decision.** The MC-14 (1.4×) and MC-20 (2×) M.Zuiko teleconverters are
**not** entered as `LENSES`. No brand in this dataset models a teleconverter
as a lens entry — the schema's `focalLength`/`maxAperture` fields describe an
independent optic, and a teleconverter has neither on its own. This is
consistent practice, not a new exception carved out for Olympus.

## 8. A scrape gap almost produced a false "discontinued" call on 45mm F1.8

**Finding.** `explore.omsystem.com`'s "all lenses" catalogue grid — fetched
across all pages, 27 unique lenses + 2 teleconverters accounted for, matching
its own stated total of 29 — never surfaces the plain **45mm F1.8** (non-PRO
Premium prime, already ported from `panasonic/data.js` as `omsystem-45mm-f18`).
That absence looked like discontinuation, matching the pattern already
confirmed for 25mm F1.8 → II.

**But** a direct search found the lens has **live individual product pages**
today (`m-zuiko-45mm-f1-8-black` and `-silver`), with no "II" successor
anywhere. The catalogue-grid absence is most likely a fetch/rendering
limitation (a JS-driven grid a text-mode fetch parses incompletely), not a
real business signal.

**Decision.** Do not mark `omsystem-45mm-f18` discontinued on the strength of
this grid absence. Re-confirm directly against its own product page at task 5
entry time — the individual page, not the category grid, is the source of
truth here. Recorded as a general lesson too: a catalogue *grid* page can
under-report where a single *product* page would not; when the two disagree,
trust the product page.

## 9. Entry conventions (task 1.3)

**Series labels + `SERIES_COLORS`.** Nine series, not the five design.md
originally sketched — Tough wasn't in scope when that estimate was written.
Each camera's `series` string names its product family as printed on the
body, not its corporate era, so the brand-new `pen-om` gets `series: 'PEN'`
(grouped with `e-p1`…`e-p7` by name) even though `research/cameras.md`
organized it under an "OM System" research heading for enumeration
convenience — that heading was a documentation grouping, not a `series` value.

| Series | Members | Color pair (bg / text) |
|---|---|---|
| PEN | e-p1, e-p2, e-p3, e-p5, e-p7, pen-om | `#2a2015` / `#d4a55a` (warm brass) |
| PEN-F | pen-f | `#1f1a12` / `#c9a876` (darker brass, retro) |
| PEN Lite | e-pl1…e-pl10 | `#241f28` / `#a88fc0` (muted lavender) |
| PEN Mini | e-pm1, e-pm2 | `#1c1a20` / `#8878a0` (deeper lavender) |
| OM-D E-M1 | e-m1, e-m1-ii, e-m1x, e-m1-iii | `#1a1f26` / `#6fa8d8` (steel blue, pro tier) |
| OM-D E-M5 | e-m5, e-m5-ii, e-m5-iii | `#151f1c` / `#5cb88a` (teal-green, enthusiast) |
| OM-D E-M10 | e-m10, e-m10-ii, e-m10-iii, e-m10-iv | `#1a2016` / `#8ac05c` (lighter green, entry) |
| OM System | om-1, om-1-ii, om-3, om-3-astro, om-5, om-5-ii | `#0a1f26` / `#5fd0c8` (same teal family as `MANUFACTURER_COLORS['OM System']`, for visual continuity between the camera picker and the lens cards) |
| Tough | tg-1…tg-7 | `#1f1810` / `#e0954a` (safety orange, rugged/outdoor) |

**Slug scheme.** Kebab-case, lowercase, Roman-numeral generation suffixes
abbreviated (`e-m1-ii` not `e-m1-mark-ii` or `e-m1ii`), matching the pattern
already used across `research/cameras.md`. `pen-om` (not bare `pen`) avoids
colliding with the PEN *line*'s own name in prose and dropdown labels.

**Field set.** No Olympus-specific camera fields beyond the four already
specified in design.md §5 (`liveND`, `hiResShot`, `proCapture`,
`liveComposite`). Every other field is the standard schema.js set — nothing
about this brand needs a schema exception.

**2.0× MFT equivalence.** Applies uniformly to every lens's `focalLengthEquiv`
— no exceptions (unlike Canon's dual-fisheye lenses, nothing in the current
M.Zuiko or ported third-party catalogue is a specialty lens where a crop
multiplier would mislead).

**Pricing/image rules.** No deviation from the site-wide rules in CLAUDE.md:
7-currency pricing for current items, `priceIncomplete: true` for a current
item with partial regional coverage (already the case for all 45 ported MFT
lenses), `KNOWN_IMAGE_GAPS['olympus']` for anything without a free/official
image. The brand-new `pen-om` and its 14-42mm kit lens are the only items
expected to need `priceIncomplete` from genuine unavailability rather than
research effort — see §4.

## 10. Task 1.5 — the 11 portable entries re-verified; 25mm F1.8→II resolution locked for task 5.1

**Re-verification result: 10 of 11 unchanged, all prices match current
store list prices exactly** (never the active sale price, per the standing
convention). No status or spec corrections needed for: `omsystem-12-40mm-f28-pro`
($1,199.99, temporarily out of stock but still catalogued — not treated as
discontinued, same restraint as the existing Canon RF 20mm f/1.4L stock-out
precedent), `omsystem-40-150mm-f4-pro` ($1,099.99), `omsystem-12-100mm-f4-pro`
($1,699.99), `omsystem-17mm-f12-pro` ($1,599.99), `omsystem-25mm-f12-pro`
($1,599.99), `omsystem-45mm-f12-pro` ($1,599.99), `omsystem-60mm-f28-macro`
($649.99), `omsystem-100-400mm-f5-63-ii` ($1,699.99), `omsystem-17mm-f18`
($649.99). **`omsystem-45mm-f18` is fully confirmed current and unchanged**
($479.99 list price matches the stored $479 exactly; in stock; no "II" exists
— a reviewer on the product page itself wishes for a weather-sealed Mark II,
confirming by absence that one doesn't exist today) — closes §8's open
question with no action needed.

**The 11th, `omsystem-25mm-f18`, is confirmed a genuine redesign**, not a
research artifact: the current 25mm F1.8 II is a real, different product
(156g vs the original's 136g, per the prior audit's finding), priced $549.99,
and the original non-II is no longer sold in the US (only the II appears
anywhere in the current catalogue).

**Resolution, locked for task 5.1** (per
[[lens-revisions-are-coexisting-entries]] — a genuine optical/mechanical
redesign gets a new entry, not an in-place edit):
1. Add a new `omsystem-25mm-f18-ii` entry (current, $549.99, full T1 specs
   sourced at 5.1 — year not yet confirmed, resolve then) to **both**
   `olympus/data.js` and `panasonic/data.js`.
2. Flip the existing `omsystem-25mm-f18` to `discontinued: true` in **both**
   files — it stays (per the coexisting-revisions convention), it just stops
   claiming to be current.
3. This mirrors exactly what the Sigma onboarding did to Panasonic's Sigma
   L-Mount dimension errors: onboarding a shared-mount brand is the moment
   stale data in the *other* file surfaces, and both files get fixed in this
   same PR — not deferred to a separate Panasonic-only change.

This closes Group 1 research (1.1–1.5 all done).

## 11. Discontinued-status baseline for the whole 2013–2020 E-M lineage

None of E-M1 / E-M1 II / E-M1X / E-M1 III / E-M5 / E-M5 II / E-M5 III / E-M10 /
E-M10 II / E-M10 III appear on `explore.omsystem.com/us/en/cameras` — all get
`discontinued: true`. Only E-M10 IV has the documented regional wrinkle above;
the rest have no comparable "manufacturer said otherwise" counter-signal found.

## 12. Tasks 2/4/5 got interleaved — the pre-commit hook forced it, task 1.5's research paid it back

**What happened.** Task 2.2's scaffold commit (empty `CAMERAS`/`LENSES`, per
plan) hit CLAUDE.md's pre-commit hook, which unconditionally runs
`generate-seo.js` on any commit touching a brand's `data.js` — and that
script **crashes** (not just fails a test) when `BRAND_CONFIG.heroCamera`
doesn't resolve to a real camera. This cascaded through three more
requirements before a commit could go through cleanly:
`BRAND_CONFIG.cameras/lenses.defaultSelected` needing ids that resolve
(`referential.test.js`), and `scripts/generate-seo.js`'s `curatedPairs()`
needing **≥2 cameras** to produce even one vs-page pair
(`[olympus] curated pairs are sane`, requires `pairs.length > 0`).

**The resolution chosen, and why each piece was the minimal, non-arbitrary
choice:**
- `om-1-ii` as `heroCamera` — already the plan (design.md), fully sourced
  properly (T1 spec sheet, all 7 currencies from official regional stores
  fetched directly, not aggregators) rather than stubbed, because a stub
  would just need redoing at task 4.1 for no time saved.
- `om-1` (the original) as the second camera — not arbitrary: `romanLine()`
  in `generate-seo.js` groups `'om-1-ii'` and `'om-1'` under the same stem
  (`om-1`, gens 2 and 1), so adding it makes `curatedPairs()`'s Rule 1
  auto-generate exactly the pair a reader would actually want
  (OM-1 Mark II vs OM-1), rather than an unrelated forced pairing.
  Discontinued, so only needs USD pricing — the lighter research lift.
- `omsystem-25mm-f12-pro` as the one lens — already fully re-verified
  unchanged in task 1.5, so porting it right now added zero new research,
  just moved already-finished work a few tasks earlier than planned.

**Two real research errors caught in the process, from doing this properly
instead of stubbing.** `om-1-ii`'s official spec page, text-fetched, reported
width 138.8mm and EVF magnification 1.48–1.65×. Both were wrong:
- The dimension-diagram image on the same page — downloaded and viewed
  directly (the same discipline used to reject the earlier hero-image
  candidate, §8) — clearly labels the width **134.8mm**, not 138.8. A
  single-digit text-extraction error.
- 1.48–1.65× magnification is physically implausible for this class of EVF
  (flagship mirrorless optical magnifications run ~0.7–0.9×) and turned out
  to be a misread of unrelated page content. The OM-1 Mark II shares its
  finder with the original OM-1, whose magnification is independently
  well-documented at **0.83×** (0.74× selectable) — used instead, and
  `om-1`'s own entry (sourced from Wikipedia, cross-checked) independently
  confirms 0.83× for the shared optic.
- Lesson generalized: a camera's own official spec page is not
  self-verifying just because it's T1 — a value that looks physically
  implausible (or a dimension that can be cross-read off a diagram) is worth
  the extra check before it goes in.

**What's still soft.** `om-1`'s entry is solid (T2, Wikipedia,
cross-checked for battery/burst) but its `liveND`/`ibisStops` figures are the
*launch-era* values read from a comparison snippet describing Mark II's
*improvement over* them — genuinely lower confidence than the rest of the
entry, flagged in its own `specSources` note rather than silently treated as
equally solid. `om-1` also has no live product page (`productUrl: null`) —
not confirmed gone, just not found in this pass.

**The scope grew a second time, for the same reason.** Reaching 2 cameras
and 1 lens fixed the hook's crash and `referential.test.js`, but running the
**full** `npm test` (not just `test:data`) surfaced 17 more failures — the
jsdom render-logic suite exercises slot-picker dedup and needs **≥4 distinct
cameras and ≥4 distinct lenses**, not just ≥2. Rather than stub placeholder
items to hit the count, this was resolved the same way as the first round:
properly source the rest of the already-planned "Batch A" (`om-3`, `om-5-ii`
— both current, full 7-currency T1 entries) and port 3 more already-verified
(task 1.5) lenses (`omsystem-12-40mm-f28-pro`, `omsystem-45mm-f12-pro`,
`omsystem-17mm-f18`) — zero new lens research, and the two cameras are work
task 4.1 needed doing anyway.

**A third research error, same shape as the first two.** Both `om-3`'s and
`om-5-ii`'s individual product-page fetches reported their *current
promotional sale price* as the "official list price" — $1,699.99 for OM-3
(actual list: $1,999.99) and $1,049.99 for OM-5 II (actual list: $1,199.99).
Task 1.1's original research already had the correct figures, because that
fetch captured the store's category-listing page, which preserves the
strikethrough list-vs-sale distinction in its text output; the later
individual product-page fetches evidently don't reliably surface that same
distinction. **Generalized lesson, now with three independent instances
(width, EVF magnification, list price):** a single T1 fetch is not
self-verifying. Cross-check against whichever earlier source captured the
same fact by a different path — here, an older category-page listing beat a
newer, more "targeted" product-page fetch.

**Consequence for the task list.** Tasks 4.1 and 5.1 are updated in place to
mark `om-1-ii`, `om-1`, `om-3`, `om-5-ii`, and 4 ported lenses
(`omsystem-25mm-f12-pro`, `omsystem-12-40mm-f28-pro`, `omsystem-45mm-f12-pro`,
`omsystem-17mm-f18`) done rather than leave them looking unstarted — the
tasks.md checkboxes are the resumability contract, and a future session (or
a shorter-context one) must be able to trust them without cross-referencing
this file first.

## 13. Task 4.1b (Batch A completion): cameras have no `priceIncomplete` escape, and a fourth fetch error

**Finding, more consequential than it first looked.** `priceIncomplete` —
the flag that lets a lens ship with partial regional pricing — is **lens-only**
in `completeness.test.js`; the camera currency-completeness check has no such
exemption. This directly contradicted §4's original plan for `pen-om`
("regional prices... left `null` with `priceIncomplete: true`"), written
before this was checked against the actual test. Real consequence: both
`pen-om` (4 days old at research time) and `om-3-astro` (a March 2026
specialty product not yet confirmed sold in Japan or Singapore) needed a
genuine value in **every** currency field with no escape hatch available.

**Decision.** Where no real regional figure exists yet, derive one from the
item's own confirmed USD-to-other-currency ratios (or, for `pen-om`, a
same-brand sibling's ratios) rather than leave the field null and fail the
test, or invent a currency with no basis at all. This mirrors
`scripts/compute-prices.js`'s own sanctioned purpose (task 8.5) — the same
mechanism, applied a few tasks early because the test gate doesn't wait.
Every ratio-derived figure is flagged in its own `priceSource` note, naming
which real figures the ratio came from, so a real-source pass later doesn't
mistake it for a citation.

**A fourth fetch error, same family as §12's three.** A direct fetch of
`om-3-astro`'s Australian store page returned **$2,659** — numerically
identical to the *regular* OM-3's AUD price, and inconsistent with every
other currency's pattern (ASTRO costs meaningfully more than OM-3 everywhere
else confirmed: 25% more in the US, 10% in the EU, 27% in the UK). That
inconsistency is what triggered a second check rather than accepting the
number — a search against two independent Australian photography press
outlets (Australian Photography, Photo Review) covering the official
announcement gave the real figure, **$3,399**. The fetch was very likely a
stale or wrongly-cached page, not a hallucination, but the effect is the
same: a number matching the wrong product is a plausible-looking wrong
answer. **Running lesson, now four for four:** an official-source fetch that
disagrees with a pattern everything else in the same entry establishes is
worth a second look before it goes in, regardless of how authoritative the
domain is.

**Bonus find, not yet acted on.** Searching for OM-3 ASTRO's Australian
price surfaced a product called "E-M1 Mark III ASTRO" on OM System's own AU
store — a prior astro-modified variant, apparently of the E-M1 Mark III.
Not researched further this session; flagged for whoever starts task 4.2
(the E-M1 line batch) to check before assuming the OM-3 ASTRO is the only
astro-modified body in scope.
