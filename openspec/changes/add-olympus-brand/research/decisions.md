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

## 10. Discontinued-status baseline for the whole 2013–2020 E-M lineage

None of E-M1 / E-M1 II / E-M1X / E-M1 III / E-M5 / E-M5 II / E-M5 III / E-M10 /
E-M10 II / E-M10 III appear on `explore.omsystem.com/us/en/cameras` — all get
`discontinued: true`. Only E-M10 IV has the documented regional wrinkle above;
the rest have no comparable "manufacturer said otherwise" counter-signal found.
