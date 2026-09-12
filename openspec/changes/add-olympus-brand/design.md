# Design — Add Olympus Brand

Olympus breaks an assumption the previous six brands shared: that the brand name
on the page and the manufacturer name on the products are the same string.
It is also the first brand to arrive with a large slice of its data already
sourced — in another brand's file. This document records how we resolve both,
plus the smaller modelling calls.

---

## 1. One brand, named "Olympus", covering the OM System era

**Decision.** A single `olympus/` brand, `BRAND_CONFIG.name = 'Olympus'`,
covering the whole Micro Four Thirds mirrorless lineage from the 2009 PEN E-P1
through the current OM System bodies (OM-1 Mark II, OM-3, OM-5 Mark II).

**Why not "OM System".** The corporate entity changed in 2021; the system did
not. The mount, the lens mount flange, the M.Zuiko line and the body lineage are
continuous — the OM-1 is the E-M1X's successor in every way that matters to
someone comparing cameras. Splitting on the ownership change would put the OM-1
and the E-M1 Mark III on different pages while an OM-1 and a Lumix GH7 share one,
which inverts the relationship that actually matters to a buyer.

"Olympus" wins the naming coin-flip over "OM System" on recognition: the great
majority of bodies in scope are Olympus-branded, and the discontinued lineage is
where this dataset's differentiated depth lives. Hero copy and `families` name
both eras so the page is never misleading about what you can buy today.

**Why not two brands.** `tests/data/config.test.js` requires every brand's
`heroCamera` to resolve to a **non-discontinued** camera. An Olympus brand ending
in 2020 has no current body, so it could not satisfy that rule without relaxing a
test that exists for good reason. The corporate split is real but it is not a
*system* boundary, and the site's unit is the system — Sigma already spans SA and
L mounts under one tile, Panasonic spans L and MFT.

**Excluded: Four Thirds DSLRs (E-1 … E-5).** Every brand here starts at its
mirrorless system, never the company's camera history — Canon 2018, Nikon 2018,
Sony 2013, Panasonic 2017, Fujifilm 2011, Sigma's DSLRs likewise dropped. Olympus
does not become the exception.

**Two scope questions deliberately raised rather than assumed** (per the
"box/cinema cameras: ask first" precedent; resolved in task 1.4, 2026-09-12):
- **Olympus Air A01** (2015) — **excluded**, matching the recommendation. A
  lens-style MFT body with no screen, EVF or shutter button, driven by a
  phone. It is genuinely mirrorless and genuinely interchangeable-lens, but
  `lcdSize`/`lcdType` are required strings and `evfType` is
  nullable-but-present — it would need placeholder copy in three required
  fields no other camera on the site needs.
- **Tough / TG series** — **included, against the recommendation.** The
  recommendation called these a different product class from the site's
  existing fixed-lens precedents (Fujifilm X100, Sigma DP — large-sensor
  enthusiast compacts vs. Tough's rugged 1/2.3" sensor), and that's still
  true; the owner chose to include them anyway. This makes Olympus the site's
  first brand with a small-sensor fixed-lens line, and creates a real
  `mount`-field question — see research/decisions.md §6, resolved via an
  existing precedent (Fujifilm's 1"-sensor `x-hf1` already tags `mount: 'x'`
  despite an equally genuine sensor-size mismatch, because the field is a
  brand/system tag on single-mount brands, not a physical-compatibility
  assertion). 7 TG-1…TG-7 bodies added; research/cameras.md.

---

## 2. Mount: reuse Panasonic's `mft` id exactly

**Decision.** `mounts: [{ id: 'mft', label: 'Micro Four Thirds' }]` — byte-identical
to Panasonic's entry. `BRAND_CONFIG.mount` (the landing-tile headline string) is
`'Micro Four Thirds'`.

`tests/data/mounts.test.js` asserts that a mount id means the same thing in every
brand, comparing `label` and `system`; a different label would fail. This is also
what lets the "Lens Mount" spec row resolve a label from the id alone on the
cross-brand compare page.

Olympus is a **single-mount brand**, so it needs no `LENS_CROP` or `SENSOR_RULES`
entry in `mounts.test.js` — those tables only cover brands spanning two mounts,
where there is something to tell apart. Every item still declares `mount: 'mft'`,
per the unconditional rule in CLAUDE.md.

`focalLengthEquiv` uses the **2.0× MFT crop** already documented in CLAUDE.md and
already applied across Panasonic's MFT entries.

---

## 3. First-party lenses keep `manufacturer: 'OM System'`

**Decision.** Olympus's own lenses carry `manufacturer: 'OM System'`, not
`'Olympus'` — even the Olympus-era ones, and even though the brand is named
Olympus. No new `MANUFACTURER_COLORS` entry is added.

**Why.** This is forced, not stylistic. `shared-mount.test.js`'s `INVARIANT` list
includes `manufacturer`, and the 11 M.Zuiko entries already in
`panasonic/data.js` say `'OM System'`. The `items sharing an ASIN describe the
same product` test in `links-offline.test.js` independently requires every entry
sharing an ASIN to agree on `manufacturer`. Using `'Olympus'` on the Olympus page
would break both guards for all 11 shared ids, and "fixing" it by rewriting
Panasonic's entries would rename a maker that really is called OM System today.

The brand tile says Olympus; the glass says who currently makes it. Both are
true, and `MANUFACTURER_COLORS['OM System']` already exists with a teal that
reads clearly against the Panasonic blue on a mixed lens list.

---

## 4. The shared-mount guard gets its second row

`tests/data/shared-mount.test.js` exists because 22 Sigma L-Mount lenses live in
both `panasonic/data.js` and `sigma/data.js`, and before the guard existed every
one of them carried Sony E-mount dimensions. Its header comment names this change
in advance: *"Micro Four Thirds (Panasonic/OM System if ever added)"*.

**Decision.** Add `['panasonic', 'olympus', 'Micro Four Thirds']` to
`SAME_MOUNT_BRANDS`. After the port, ~45 lens ids exist in both files — the 11
M.Zuiko, the 28 Lumix G / Leica DG, and the 6 other MFT third parties — and all
25 `INVARIANT` optic fields plus `prices.USD` must match.

**This is the point of doing the port by copy, not by re-research.** The two
files describe one physical product; the guard makes drift a test failure instead
of a slow corruption. The entries keep their own `asin`, `productUrl`, `imageUrl`
and regional prices, which are listing properties and legitimately per-file.

**Consequence to accept:** a future price correction to any shared MFT lens must
be applied to both files in the same commit. That is exactly the property the
L-Mount pair already has, and it is why the pre-tariff Sigma prices were caught.

---

## 5. Olympus-specific spec section

Added to `SPEC_SECTIONS` in `engine.js` tagged `brand: 'olympus'`, gated by
`BRAND_CONFIG.brandSections`, with a matching `brandSections.includes('olympus')`
branch in `tests/helpers/schema.js`.

Section label: **Computational Photography**

| Field | Type | Notes |
|---|---|---|
| `liveND` | `string \| null` | e.g. `'ND2–ND64 (6 steps)'`; `null` on bodies without it |
| `hiResShot` | `string \| null` | e.g. `'80MP tripod / 50MP handheld'` — the mode's output resolution, not the sensor's |
| `proCapture` | `boolean` | pre-shutter buffered capture |
| `liveComposite` | `boolean` | in-camera stacked long exposure |

**Why these four.** They are the features Olympus bodies are actually bought for
and the ones no existing row surfaces. Live ND and Live Composite have no
equivalent column anywhere in `SPEC_SECTIONS` — they are computational modes, not
sensor or AF specs. Pro Capture is comparable to Nikon's `preCapture` field,
which already earned its own row on that brand's section.

`hiResShot` is a **string, not a number**, on the same reasoning that governs
Sigma's `sensorMP`: the tripod and handheld figures differ, and feeding either
into a numeric winner-highlighted column would let a 20MP body "beat" a 25MP one
on a row a reader will parse as resolution.

---

## 6. Series, grouping and landing-tile accent

**`SERIES_COLORS`** — proposed five series, finalised in task 1.3:
`OM System`, `OM-D E-M1`, `OM-D E-M5 / E-M10`, `PEN-F & PEN`, `PEN Lite / Mini`.

**Dropdown groups.** One group per mount is the binding rule, and Olympus has one
mount, so grouping is free to follow era/line as the other brands do. Lens groups
follow the `── <Maker> ──` convention already in `panasonic/data.js`:
`── M.Zuiko PRO ──`, `── M.Zuiko Primes ──`, `── M.Zuiko Zooms ──`, then
`── LUMIX G (MFT) ──`, `── Sigma (MFT) ──`, `── Laowa & Voigtländer (MFT) ──`.

**`BRAND_CARD_ACCENTS['olympus']`** — a teal drawn from the existing
`MANUFACTURER_COLORS['OM System']` family rather than Olympus's historic navy.
Panasonic's stripe is already `#0046ad`; two blue MFT tiles adjacent on the
landing page would read as one brand. Exact hex set in task 4.7.

---

## 7. What this change does *not* do

- **No discontinued M.Zuiko glass.** The current catalogue only (~30 lenses).
  Superseded optics (original 12-40 PRO, the 14-42 kit variants, body-cap
  lenses) are a later expansion, the same way every other brand grew.
- **No Four Thirds (non-micro) lenses.** The adapted FT line belongs to the
  excluded DSLR system.
- **No `CROSS_BRAND_MATCHUPS` entries required.** The curated list needs ≥60
  resolving pairs and has no per-brand quota — Sigma added none when it landed.
  Olympus-vs-Panasonic MFT matchups are a cheap, genuinely useful follow-up
  (`om-1-ii-vs-gh7`, `om-3-vs-g9-ii`) and are listed as an optional task, not a
  blocker.
