# Design — Add Sigma Brand

Sigma breaks two assumptions the previous five brands quietly shared: that a
brand page covers one mount, and that a brand's cameras and lenses belong to the
same system. This document records how we resolve that, plus the smaller
modelling calls.

---

## 1. Scope: 18 non-DSLR bodies, L-Mount lenses

**Decision.** The camera tab carries every **mirrorless and fixed-lens** camera
Sigma has released — 18 bodies: L-Mount mirrorless (`BF`, `fp L`, `fp`),
SA-mount Foveon mirrorless (`sd Quattro`, `sd Quattro H`) and the 13 Foveon
fixed-lens compacts. Sigma's six SA-mount **DSLRs are excluded**. The lens tab
carries **L-Mount only**.

**Why exclude the DSLRs.** Every brand on the site starts at the beginning of
its *mirrorless* system, not the company's camera history: Canon 2018 (RF, no
EOS DSLRs), Nikon 2018 (Z, no F-mount), Sony 2013 (E-mount full-frame — even the
2010–12 NEX bodies are out), Panasonic 2017, Fujifilm 2011 (X). Across all 152
existing cameras `lensType` only ever takes `'Interchangeable'` or `'Fixed'`.
Adding `SD9`–`SD1 Merrill` would make Sigma the only brand with DSLRs, for the
era where sourcing is weakest and the Foveon megapixel ambiguity is worst.

The `sd Quattro` pair stay: they are genuinely mirrorless and only *look*
DSLR-adjacent because they kept the SA mount. The 13 fixed-lens compacts stay
too — Fujifilm's X100 series and X Half already establish `lensType: 'Fixed'`.

**Why L-Mount only for lenses.** It is the only Sigma mount you can still buy a
Sigma body for, and the only one where the lens data is already sourced and
priced (22 entries exist in `panasonic/data.js`).

**The wrinkle we accept.** Most cameras on the page still cannot mount the
lenses on it: a `dp2 Quattro` has a fixed lens, an `sd Quattro` is SA-mount, and
only three bodies (`fp`, `fp L`, `BF`) take the L-Mount glass.

We accept this because the two tabs are independent comparison surfaces — the
engine never claims a lens fits a selected camera, and Panasonic already ships a
page spanning two incompatible mounts (L and MFT). Documenting the split in the
`families` label and hero copy is enough. The alternative — restricting cameras
to L-Mount for coherence — throws away the Foveon lineage, which is the part of
this dataset nothing else on the site or in the market covers.

**Rejected alternative: pull all 76 Sigma lenses onto the Sigma page.** This was
considered and rejected before the change was written. It would break the
one-page-one-system model, require a `mount` field the architecture explicitly
does not have (see CLAUDE.md), and make the cross-brand compare page offer
meaningless matchups between an E-mount and an X-mount copy of the same optic.
The existing per-brand denormalisation stays untouched.

---

## 2. The `year` floor blocks three real cameras

`tests/helpers/schema.js` validates camera `year` as
`{ type: 'number', min: 2010, max: 2027 }`. Three in-scope Sigma bodies predate
it: DP1 (2008), DP2 (2009), DP1s (2009).

**Decision.** Lower the camera floor to `2008` — the value `schema.js` already
uses for the lens floor.

**Why.** The floor is a typo guard, not a business rule: it exists to catch a
`year: 210` fat-finger, and `2008` catches that just as well. Matching the
existing lens floor means the file ends up with one number instead of two
arbitrary ones, which is easier to defend than the `2002` an all-cameras scope
would have needed. No existing brand has a pre-2010 body, so nothing else is
affected.

---

## 3. Foveon megapixels are ambiguous — pick one convention and state it

A Foveon X3 sensor stacks three photodiode layers. Sigma has historically
marketed the sum — the DP Merrill bodies were sold as "46 megapixels" while
writing a 4704×3136 (≈14.75MP) file. Quattro complicates it further with an
unequal 1:1:4 layer split.

**Decision.** `sensorMP` records the **output image resolution** — the pixel
count of the file the camera actually writes. The layer structure goes in
`sensorType` as free text (`'Foveon X3 (APS-C, 3-layer)'`,
`'Foveon X3 Quattro (APS-C)'`), and the marketing figure, where it differs, is
noted in `tagline`.

**Why.** `sensorMP` drives winner-highlighting: it is a numeric column compared
head-to-head against Bayer sensors from five other brands. Feeding it a summed
photodiode count would make an SD9 "beat" a 24MP body on a row that claims to
compare resolution, which is exactly the sort of quietly-wrong comparison the
winner highlighting is supposed to earn trust on. Output resolution is the
honest apples-to-apples number.

---

## 4. Sigma-specific spec section

Added to `SPEC_SECTIONS` in `engine.js` tagged `brand: 'sigma'`, gated by
`BRAND_CONFIG.brandSections`, with a matching
`brandSections.includes('sigma')` branch in `schema.js`.

Section label: **Foveon & L-Mount**

| Field | Type | Notes |
|---|---|---|
| `foveonGen` | `string \| null` | `'X3'`, `'X3 Merrill'`, `'X3 Quattro'`; `null` on the Bayer bodies (`fp`, `fp L`, `BF`) |
| `shutterType` | `string` | `'Mechanical + electronic'`, `'Electronic only'` — the `fp`/`fp L`/`BF` have no mechanical shutter, which is a real buying consideration |
| `internalStorage` | `string \| null` | `'230GB SSD'` on the `BF`, `null` elsewhere |
| `lLog` | `boolean` | L-Log support |

`shutterType` earns its place because "electronic only" implies rolling shutter
and flash-sync limits that no other row on the page surfaces.

**`cardSlots` and the BF.** The `BF` has no card slot at all. `cardSlots` is a
required string, so it takes `'None (230GB internal SSD)'` and `internalStorage`
carries the machine-readable detail. No schema change needed.

---

## 5. Series, grouping and the reused lens entries

**`SERIES_COLORS`** — six series: `BF`, `fp Series`, `sd Quattro`,
`dp Quattro`, `Merrill`, `DP Compact`.

**`DROPDOWN_GROUPS`** — grouped by lineage rather than era, because Sigma's
eras and lines coincide:

```
Current L-Mount      BF, fp L, fp
Foveon Mirrorless    sd Quattro, sd Quattro H
dp Quattro           dp0, dp1, dp2, dp3 Quattro
DP Merrill           DP1 Merrill, DP2 Merrill, DP3 Merrill
DP Compact           DP1, DP1s, DP1x, DP2, DP2s, DP2x
```

**Porting the 22 existing L-Mount entries.** CLAUDE.md warns against copying
specs between brand files. That warning is about *mount* differences — the usual
trap is copying a DSLR original's figures onto a mirrorless entry. Here the
source and destination are both L-Mount, so weight, dimensions, optics, `asin`,
`imageUrl` and `productUrl` describe the identical physical product and port
verbatim. This is the one legitimate cross-file copy, and it is worth stating so
a future reader does not "fix" it.

Two things do change on port: `line` stays (`Art`/`Contemporary`/`Sports`), but
these become **first-party**, so they move out of `── Sigma ──` third-party
groups into normal line-based groups.

**Regional prices.** All 22 ported entries are currently `priceIncomplete: true`
with USD only — acceptable for a third-party lens, weak for a brand's own
catalogue. Note that `compute-prices.js` *skips* `priceIncomplete` items, so
filling these means clearing the flag first and running with `--recompute`.

**L-Mount APS-C crop — not needed.** The `DC` lenses that would have required a
1.5× multiplier (and an L-Mount row in CLAUDE.md's crop table) are deferred; see
§7. Every lens in scope is full-frame, so `focalLengthEquiv` equals the native
focal length throughout.

---

## 6. Sharing one source for same-mount lenses (deferred, with a trigger)

**The question.** After the port, 22 Sigma L-Mount lenses exist in both
`panasonic/data.js` and `sigma/data.js` describing one physical product. Should
they reference a single shared source instead of being duplicated?

**Why this is a new problem.** Until now every brand file mapped to a distinct
mount, so cross-brand entries for "the same lens" legitimately *differed* — a
Sigma 35mm in RF and in X mount are different products with different weights,
ASINs and prices. That is why CLAUDE.md says there is intentionally no shared
lens catalog. This change creates the first case where two files describe the
**same mount**, and there the overlap is near-total: everything except which
dropdown group the entry lands in.

**And it will recur.** The mounts that span makers are L-Mount (Panasonic,
Sigma, and Leica if ever added) and Micro Four Thirds (Panasonic and OM System,
already on the radar). Every other mount on the site is single-maker. So the
ceiling on this problem is two shared mounts, not N.

### Options

**A — Duplicate, guarded by a drift test.** Keep both copies; a test asserts
same-slug entries agree on mount-invariant fields (task 7.5).

**B — Shared registry script.** A `shared/lenses-l-mount.js` sets
`window.SHARED_LENSES['l-mount']`, loaded before each brand's `data.js`. The
brand IIFE merges what it needs: `const LENSES = { ...pickShared('l-mount',
[ids]), ...ownEntries }`. This is the *same registry pattern* the repo already
uses for `window.BRAND_DATA` — a global, not an `import` — so it does not breach
the "standalone browser script, no imports" invariant. Crucially the merge
happens inside the IIFE, so `LENSES` is still a fully-resolved plain object and
every existing test and engine path keeps working untouched.

**C — Build-time generation.** A canonical JSON plus a generator that writes
entries into each `data.js`. The repo already generates-and-commits
(`generate-seo.js` + the pre-commit hook), so the pattern is established.

### Decision: A now, B at a defined trigger

**Trigger to revisit: when a third file shares a mount** — an OM System brand
(MFT, shared with Panasonic) or a Leica brand (L, shared with Panasonic and
Sigma). At two files a drift test is cheap and total; at three, one edit needs
replicating three ways and the test stops being the cheaper option.

**Why not B now.** It would mean refactoring Panasonic's existing 22 entries as
a rider on a change whose job is adding Sigma — scope creep on an already large
change. It also introduces a load-order dependency, a class of runtime bug this
site currently has none of, for a benefit that 22 entries do not yet justify.

**Why C is the weakest.** The data files are hand-formatted aligned object
literals that people edit directly; a generator writing into them fights that
formatting and makes hand-edits clobberable. B keeps hand-editing safe because
the shared file *is* the hand-edited source.

**The drift guard is a prerequisite for B, not an alternative to it.** Before
collapsing 22 pairs into one source you need to know they are actually
identical — which is exactly what task 7.5 reports. If it turns up fields that
legitimately differ per brand, those become B's override map.

---

## 6b. Follow-up: let a thin brand render 2 slots

Sigma exposed a limitation that cost this change real scope. A brand page
hardcodes `slotChoice = 3` (`engine.js:431`), so `defaultSelected` must hold
three ids or `renderSlot` dereferences an undefined item and the page dies.
That, plus the picker-dedup test needing a camera outside the default set,
forces a **4-camera minimum** — which is why two `sd Quattro` bodies were pulled
forward against the Foveon deferral.

That minimum is incidental, not a product rule. The 2-slot UI already ships:
`MIN_SLOTS = 2`, `effectiveSlots()` clamps to exactly 2 below the 600px
breakpoint, and the compare page already takes its count from
`COMPARE_CONFIG.defaultSlots`. Only the brand page lacks the equivalent knob.

**Follow-up (owner, 2026-09-07):** add a per-brand default slot count so a thin
brand renders two slots instead of being padded with filler cameras. Two
products is enough for a comparison.

---

## 7. Out of scope

- **The six SA-mount DSLRs** (`SD9` 2002 → `SD1 Merrill` 2012). See §1. If they
  are ever revisited, note it would make Sigma the only brand on the site with a
  DSLR, and would need the `year` floor at 2002 rather than 2008.
- **SA-mount lenses.** Excluded by the L-Mount-only decision. This does leave
  the `sd Quattro` pair without compatible glass on the page — see §1.
- **Third-party L-Mount lenses** (Panasonic Lumix S, Leica, Samyang, Viltrox,
  Laowa). A follow-up `add-thirdparty-lenses-sigma` change, per the skill's
  Step 9. Note the pleasing inversion: on the Sigma page, *Panasonic* is the
  third party.
- **The full-frame Foveon body.** Still R&D as of CP+ 2026 with no announced
  product; nothing to enter.
