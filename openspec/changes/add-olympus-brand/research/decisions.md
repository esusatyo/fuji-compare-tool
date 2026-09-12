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

## 5. Discontinued-status baseline for the whole 2013–2020 E-M lineage

None of E-M1 / E-M1 II / E-M1X / E-M1 III / E-M5 / E-M5 II / E-M5 III / E-M10 /
E-M10 II / E-M10 III appear on `explore.omsystem.com/us/en/cameras` — all get
`discontinued: true`. Only E-M10 IV has the documented regional wrinkle above;
the rest have no comparable "manufacturer said otherwise" counter-signal found.
