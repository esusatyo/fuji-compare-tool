---
name: add-thirdparty-lenses
description: Add or expand third-party lenses (Sigma, Tamron, Viltrox, Samyang, Zeiss, Laowa, budget makers, …) for one camera brand in the comparison tool — research the mount's real third-party ecosystem, enter mount-specific specs sourced from the maker's own site, wire dropdown groups and manufacturer colours, fill images and regional prices, and verify the test suite. Use when the user wants to add third-party lenses to a brand, expand a brand's third-party coverage, or finish the third-party pass after onboarding a new brand.
metadata:
  author: fuji-compare-tool
  version: "1.3"
---

Add comprehensive third-party lenses to **one brand** of this repo. The skill is
brand-agnostic — substitute the target brand's `<slug>` throughout. It was
distilled from the five completed third-party changes (all archived under
`openspec/changes/archive/2026-07-0*-*thirdparty-lenses*/`);
`…-add-thirdparty-lenses-sony` is the fullest worked example, and each archive's
`research/lenses.md` records the cross-mount overlap already researched — reuse
it as a checklist of designs to look for, **never** as a source of specs.

Third-party lenses ride the exact same mechanism as first-party ones: a
`LENSES` entry with a `manufacturer` field, grouped in `LENS_DROPDOWN_GROUPS`,
coloured via `MANUFACTURER_COLORS`, Buy-linked from `asin` (or search
fallback). **No engine changes are needed** beyond colour entries.

---

## Golden rules

- **The maker's own site is sufficient on its own** — including its official
  regional sites. Reach for a second source when the maker's table is ambiguous,
  looks wrong, or lumps several mounts into one spec list (the figures are
  usually the DSLR original). Full rules and tiers in Step 2.
- **Always confirm mount availability against the maker**, whatever a retailer
  or aggregator says. This is the single most common way wrong data gets in:
  aggregators list lens/mount combinations that do not exist.
- **Cite as you go.** Every lens lands in `research/lenses.md` with its source
  URLs *before* it lands in `data.js`, and every URL lands in
  `research/sources.md` as you read it. An uncited spec is a guess.
- **Denormalized, per-brand, no `mount` field.** The same optical design (e.g.
  Sigma 18-50mm f/2.8 DC DN) is a separate entry in each brand's `data.js`
  with that mount's own weight/length/price/`asin`/`productUrl`/`imageUrl`.
  No shared catalogue, no cross-mount UI — the brand file implies the mount.
- **Never copy specs between brand files.** Mount variants genuinely differ
  (weight, length, sometimes filter size), and copied entries have shipped
  wrong specs before.
- **Skip rather than guess.** If a required field can't be sourced (dimensions
  are the usual gap for budget MF primes), leave the lens out and log it as a
  deferred tail — don't fabricate.
- **Small per-maker batches, test-checkpointed.** After each batch run
  `npm run test:data`, commit, and update the progress log. A partial dataset
  stays green as long as every *entered* lens is complete.

---

## Step 0 — Open the progress log (do this first)

This skill runs long enough to be interrupted. Before any research, create the
OpenSpec change and its progress log:

```
openspec/changes/expand-thirdparty-lenses-<slug>/
  proposal.md          # why + scope boundary
  tasks.md             # the checklist below, one line per maker batch
  research/lenses.md   # the citation ledger (format in Step 2)
  PROGRESS.md          # the resume point — updated after EVERY batch
```

`PROGRESS.md` is the contract with your future self. Keep it to this shape:

```markdown
# Progress — <brand> third-party lenses

**Resume at:** <the next thing to do, in one line>
**Branch:** expand-thirdparty-lenses-<slug>   **Last green commit:** <sha> <subject>

## Batches
| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma | ✅ 6/6 | ✅ 6 | ✅ | ✅ | ✅ | abc1234 |
| Tamron | ✅ 4/4 | ⬜ | ⬜ | ⬜ | ⬜ | — |

## Deferred / skipped (with reason)
- `ttartisan-27mm-f28` — no published dimensions on any tier-1/2 source

## Open questions for the user
- (none)
```

**Update `PROGRESS.md` in the same commit as each batch**, never as a separate
"docs" commit — that way the log and the data can't disagree. On resume, read
`PROGRESS.md` first and trust it over any memory of the run.

---

## Step 1 — Scope the mount's ecosystem

**Know the mount's licensing reality first** — it bounds the whole list:

| Brand | Mount(s) | Crop for `focalLengthEquiv` | Ecosystem notes |
|---|---|---|---|
| sony | E/FE | 1.5× (APS-C), native (FF) | Deepest catalogue by far — expect Sigma/Tamron/Samyang/Viltrox AF + Zeiss/Voigtländer/Laowa + budget makers |
| fujifilm | X | 1.5× | APS-C only — exclude full-frame-only designs with no X version |
| nikon | Z | 1.5× (DX), native (FF) | Restrictive: Sigma licensed 2023+ (few DC DN); no Zeiss; some Tamron designs are sold **as Nikkor** — exclude those rebadges |
| canon | RF/RF-S | 1.6× (RF-S), native (RF) | Most restrictive: Sigma/Tamron AF only licensed 2024+ (mostly RF-S); exclude EF-via-adapter |
| panasonic | L-mount + MFT | native (L), 2.0× (MFT) | Two mounts: Sigma is an L-Mount Alliance member (full native DG DN line); MFT's key cross-shop is OM System/Olympus; disambiguate colliding slugs with an `-mft` suffix |

**Scope boundary** (what "comprehensive" means here):
- **In:** all native-mount AF lenses from the majors (Sigma, Tamron, Samyang,
  Viltrox); notable MF/specialty lines (Zeiss, Voigtländer, Laowa); a
  *representative* set from budget makers (TTArtisan, 7Artisans, Meike,
  Yongnuo, …). Discontinued-but-notable is fine (`discontinued: true`).
- **Out:** cine/anamorphic/rehoused lenses, teleconverters, adapter-only
  designs, and the long tail of obscure manual clones.

Enumerate from the maker's own "lenses for <mount>" page, one maker at a time —
mount availability changes yearly, so verify a design actually ships in this
mount **today**, not just "was announced".

## Step 2 — Sourcing rules (the part that decides correctness)

### Source tiers

| Tier | What | Use for |
|---|---|---|
| **1** | The maker's own product/spec page **for this mount** (sigma-global.com, tamron.com, viltrox.com, venuslens.net, …) | The primary for every spec. If tier 1 doesn't exist for this mount, the lens probably doesn't ship in this mount. |
| **2** | Independent measurement/review: DPReview, LensTip, Opticallimits, ephotozine, admiringlight | The corroborating source. Independent lab data, not a reprinted press release. |
| **3** | Retailers (B&H, Adorama, Amazon, WEX, digitalcamerawarehouse) | Corroboration and **price/ASIN only**. Never the sole second source — they share one distributor feed. |
| **✗** | Rumour sites, aggregator spec databases, AI summaries, another brand's `data.js` | Never. |

**Tier 1 is sufficient on its own.** A spec taken from the maker's own site
needs no second source — it is the authority for its own product, and a second
lineage would usually just be quoting it back. This includes the maker's
**official regional sites** (laowa.com.au, sigma-photo.co.uk, …), which are the
practical route when the global domain is bot-blocked. Tier 2 remains valuable
for *catching* a suspect tier-1 figure, so still reach for it when a number
looks wrong, when the maker's table is ambiguous, or when it doesn't separate
mounts — see the caution below.

**Beware the combined spec table.** A maker page that lists several mounts
("Canon EF, Canon RF, Nikon Z, Sony E") often prints **one** set of figures,
usually the DSLR original. Those numbers are not this mount's numbers. Before
trusting a single table, confirm it is either mount-specific or that the fields
you're taking don't vary by mount. Where it does vary and the page won't say,
that's exactly when tier 2 earns its keep.

**The independence test** (for when you *are* corroborating): if two pages could
have been populated from the same upstream feed, they count once. Two retailers
= one source. A retailer quoting "Manufacturer specs" = the tier-1 page again. A
review that *measured* the weight = genuinely independent.

**Bot-blocked sources.** DPReview, FujiRumors and several retailers block
`WebFetch`. When the maker's global domain won't load, try its official
regional sites first (still tier 1); failing that, LensTip, Opticallimits,
ephotozine, or the maker's downloadable spec PDF/press release. A lens with no
tier-1 page in this mount and no usable substitute is a **skip**, logged in
`PROGRESS.md` — not a guess.

**New releases — the ≤1-month rule.** A lens that started shipping in this
mount within the **last month** may be entered on whatever the maker publishes,
without waiting for full detail. Fill every field you can source; leave the
nullable ones (`maxMagnification`, `elements`, `groups`, `filterThread`,
`oisStops`) as `null` rather than inventing them, and enrich on a later pass.
Record it in the ledger's notes column (`new release — shipped <date>; specs
incomplete, re-verify next pass`) and list it under `PROGRESS.md`'s deferred
section so the next run knows to come back.

The non-nullable fields (`weight`, `length`, `diameter`, `blades`,
`minFocusDist`, apertures) still need real values — a lens whose maker won't
publish those isn't publishable yet, however new it is.

Past one month, this stops applying: if a design has been on sale a year and
its specs still can't be sourced, that's a sourcing failure, not a publication
gap.

### Field normalisation (where "sources disagree" is usually definitional)

Two correct sources routinely print different numbers. Resolve by convention,
not by picking one:

| Field | Unit | Convention |
|---|---|---|
| `weight` | grams | **Bare lens**: no hood, no caps, no tripod collar, no mount adapter. If a source's figure includes the collar, prefer the maker's "without collar" number and note the delta. |
| `length` | mm | Maker's stated length **from the mount flange to the front tip**, retracted/at its shortest for a zoom. |
| `diameter` | mm | Maximum barrel diameter, *not* the filter thread. |
| `filterThread` | mm | Front thread only; `null` if the lens takes none (rear gels, bulbous fronts). |
| `minFocusDist` | **cm** | From the **sensor/focal plane** (the maker's usual "minimum focusing distance"), not working distance from the front element. Zooms: the shortest across the range. Convert `0.121 m` → `12.1`. |
| `maxMagnification` | decimal | `1:2` → `0.5`, `1:1` → `1.0`. Zooms: the maximum across the range. |
| `maxAperture` | f-number | The widest; for variable zooms the **wide end** (18-300mm f/3.5-6.3 → `3.5`). Never a T-stop. |
| `minAperture` | f-number | The narrowest; for variable zooms the **wide end's** minimum, matching how the row reads. |
| `elements`/`groups` | count | Maker's optical construction. `null` is allowed if genuinely unpublished. |
| `blades` | count | Diaphragm blades. Note "rounded" in nothing — the schema stores the count only. |
| `year` | number | First shipping year **in this mount**, not the design's original launch in another mount. This one is mis-copied constantly. |
| `focalLengthEquiv` | string | Native focal × the Step 1 crop factor, rounded to whole mm, formatted `'29-80mm'` / `'45mm'`. Full-frame lenses on a FF mount use the native value. |
| `afType` | string | Match the maker's motor name (`Stepping Motor`, `VXD`, `HLD`, `Manual focus` for MF lenses). |
| `weatherSealed` | boolean | `true` only for a claimed seal (gasket/"dust- and splash-resistant"). A rear mount gasket alone → `false`. |

**Unit traps:** US retailer pages print oz and inches — convert from the
maker's metric figure instead of round-tripping (3.5 oz → 99 g loses a gram).
`f/2` is `_2` not `_20` in Sigma URLs. Filter thread ≠ diameter.

**When tier 1 and tier 2 still disagree** after normalising, take tier 1, and
record both values in `research/lenses.md` with a one-line note. Don't silently
average.

### The citation ledger — `research/lenses.md`

One row per candidate, filled during research, *before* any data entry:

```markdown
| slug | name | maker | line | type | year | disc | src1 (tier 1) | src2 (tier) | notes / conflicts |
|---|---|---|---|---|---|---|---|---|---|
| sigma-17-40mm-f18 | Sigma 17-40mm F1.8 DC Art | Sigma | Art | Zoom | 2025 | no | https://sigma-global.com/…/a025_17_40_18/ | https://dustinabbott.net/… (2) | **conflict:** review says 528 g / $829 (E-mount sample at announce); tier-1 per-mount table says RF = 560 g, Sigma US lists $919 → tier 1 wins |
```

Include the **rejected** candidates too, with the reason (`out of scope: cine`,
`EF-only`, `rebadged as first-party`) — the next pass shouldn't re-research
them.

**Also keep `research/sources.md`.** The ledger above is per-*candidate*; this
one is per-*source*, and it is what the site will eventually publish so readers
can cross-check a spec. Write each URL in **as you read it**, recording what it
was used for and its reliability class:

**T1** maker's own site, incl. official regional sites · **T2** independent
measurement/review · **T3** retailer — price and availability only · **T4**
aggregator — tables only, never mount attribution · **NEWS** dated
announcement, `year` only.

Three rules that matter more than the format:

1. **Record sources for facts you rejected**, with the reason. "laowa.com.au
   says 638 g; that's the combined DSLR row, so the RF entry keeps 650 g" is
   what stops a later pass "correcting" a right value to a wrong one.
2. **A source's reliability doesn't travel as one lump.** lensfinder.org's spec
   tables matched tier 1 exactly (8/8 on a verified Tamron) while its *mount
   attribution* was ~30% wrong — it listed six lenses under Canon RF that the
   makers don't sell in RF. Trust a source per-field, and **always confirm mount
   availability against the maker.**
3. **Populate `specSources`** on the entry itself where the field exists, so
   provenance ships with the data rather than only in the change folder. A
   composite entry (dimensions from one source, blades from another) is exactly
   what it's for.

Note the traps already found, so they aren't rediscovered: lensfinder.org
**soft-404s** (any slug returns 200 — only sitemap-listed URLs are real, which
is how a whole maker was once wrongly written off as having no coverage);
ttartisan.com page titles **truncate at the first hyphen**, so every APS-C lens
reads "TTArtisan APS"; and 7artisans.com's sitemap serves an error page.

## Step 3 — Shared wiring (before bulk data)

1. Every `manufacturer` value needs a `MANUFACTURER_COLORS` entry in
   `engine.js` (a `referential.test.js` test enforces this across all brands).
   Check which makers are already covered; add bg/text pairs consistent with
   the existing palette for new ones. Use the exact casing already established
   (`Sigma`, `Tamron`, `Viltrox`, `Samyang`, `Voigtländer`, `Zeiss`, `Laowa`,
   `TTArtisan`, `7Artisans`, `Meike`, `Yongnuo`, `OM System`, `Leica`,
   `Sirui`, …).
2. `engine.js` is shared — parallel brand branches **will** conflict on
   `MANUFACTURER_COLORS`. Resolve by taking the **union** of colour entries.
3. Checkpoint: `npm test` green before any lens data lands.

## Step 4 — Lens data, in per-maker batches

Work one manufacturer at a time (majors first, budget makers last). Every
entry must satisfy the **per-lens definition of done**:

- **Specs** normalised per Step 2 and matching `validateLens` in
  `tests/helpers/schema.js`: `type` ∈ {`Prime`,`Zoom`}; primes set
  `focalLength`, zooms `focalLengthMin` < `focalLengthMax` (and
  `focalLength: null`); aperture, elements/groups/blades, size/weight,
  `afType`, `weatherSealed`, `ois`/`oisStops`, `year`, `discontinued`.
- **Both source URLs already in `research/lenses.md`.**
- **Slug**: `<maker>-<focal>-f<aperture-no-dot>[-line/variant]`, e.g.
  `sigma-18-50mm-f28`, `tamron-28-75mm-f28-g2`, `viltrox-27mm-f12`,
  `zeiss-batis-25mm-f2`. On Panasonic, suffix `-mft` when an MFT entry would
  collide with its L-mount sibling. No `:` in any slug (compare-page separator).
- **`manufacturer`** exactly matching a `MANUFACTURER_COLORS` key; **`line`**
  records the sub-brand (`Art`, `Contemporary`, `Di III`, `Air`, `Batis`,
  `Nokton`, …).
- **`productUrl`**: the maker's live https product page for this mount (tier 1).
- **`asin`**: verified plain-product amazon.com ASIN for **this mount's
  variant** (not a bundle/Renewed/International; most third-party listings are
  per-mount — picking the wrong mount's ASIN is the classic mistake), or
  `null` → search fallback.
- **Images** per Step 5, **prices** per Step 6.

After each maker batch: add the ids to `LENS_DROPDOWN_GROUPS` (Step 7),
run `npm run test:data`, commit, update `PROGRESS.md`.

## Step 5 — Images (don't settle for the placeholder)

Three valid outcomes, in order of preference:

1. **Wikimedia Commons** — `imageUrl` on `upload.wikimedia.org` **plus** an
   `imageCredit` block. `checkImageCredit` in `tests/helpers/schema.js` *fails*
   a Commons URL without one, and fails a non-Commons URL that has one. Don't
   hand-write it: `node scripts/fetch-image-credits.js` generates
   `{author, licence, licenceUrl, source}` from the file page. Helpers:
   `scripts/fetch-images-commons.js` (search), `scripts/apply-images.js`,
   `scripts/verify-images.js` (every `imageUrl` returns `image/*`).
   For a deeper hunt — licence proof, visual confirmation it's the right
   product — use the [`fetch-product-images`](../fetch-product-images/SKILL.md) skill.
2. **The maker's own product image** — no `imageCredit` (and the schema
   rejects one). This is how most third-party lenses in the dataset are
   illustrated (`sigma-global.com`, `tamron.com`, `viltrox.com`,
   `venuslens.net`, …). Prefer a stable `…_product_img01.png`-style asset over
   a CDN URL with a cache-busting query.
3. **Allowlist** in `KNOWN_IMAGE_GAPS.<brand>` in
   `tests/data/completeness.test.js`, with an inline comment saying why. The
   test fails if the item later gains an image, so this stays honest.

Never hotlink a retailer's photo, and never use an image you haven't seen
render — a wrong-product photo is worse than the placeholder card.

## Step 6 — Prices (fill all seven, don't default to USD-only)

- **USD = the current US list price (RRP/MSRP)**, from tier 1 or a tier-3
  retailer's list — *not* a sale/deal price. A discount post is a sale, not a
  new RRP.
- Then fill the six regional prices: `node scripts/compute-prices.js <brand> lenses`.
  It derives approximate launch RRPs from USD via regional ratios, anchored to
  any confirmed figures in `scripts/price-overrides/<brand>.json`. Add real
  RRPs there whenever a maker publishes them (AU/UK/JP pages often do).
- **`priceIncomplete: true` is an opt-out, not a default.** `compute-prices.js`
  *skips* every item carrying the flag, so setting it reflexively is what
  leaves a lens showing a lone USD figure forever. Set it only when the item
  should deliberately stay USD-only. Discontinued lenses keep their historical
  USD launch RRP and need no flag.
- Depth backfill (ASINs, regional refresh across the whole dataset) belongs to
  [`check-prices-and-buy-links`](../check-prices-and-buy-links/SKILL.md).

## Step 7 — Dropdown groups

- Append per-maker groups **after** the first-party groups, labelled
  `── <Maker> ──`, ordered majors-first (Sigma, Tamron, Samyang/Viltrox, …),
  with a single `── Other ──` group for the budget makers.
- Every lens must appear in **exactly one** group (referential test enforces).
- On a dual-mount brand (Panasonic), carry the mount in the group label
  (e.g. `── Sigma (L-mount) ──`, `── Sigma (MFT) ──`) — that's the only place
  mount is surfaced.
- A maker with many lenses may be split by line the way first-party groups
  are (e.g. Sigma APS-C / FF primes / FF zooms) — mirror the brand's style.

## Step 8 — Verify

- `npm test` fully green (schema, referential, completeness, colour coverage,
  and the logic tier all auto-cover the new lenses).
- `node scripts/verify-images.js <brand>` — every `imageUrl` returns an image.
- `RUN_LINK_TESTS=1 npm run test:links` to spot-check the new `productUrl`s.
- Re-run `node scripts/generate-seo.js` (lens counts change, so the generated
  pages go stale — a `seo.test.js` test fails until you do).
- **Leave `dataVerified` in `site-config.js` alone.** It backs the page claim
  "Specs & prices last verified: <date>", which is a statement about the
  *whole* dataset — all five brands, cameras and lenses. This skill verifies
  one brand's third-party lenses, so moving that date would overstate what was
  checked. Only the dataset-wide
  [`check-prices-and-buy-links`](../check-prices-and-buy-links/SKILL.md) audit
  earns the bump.
- Open `<slug>/index.html` on the preview server
  (`python3 scripts/preview.py 3456`), switch to Lenses mode: confirm the new
  groups appear, cards render with maker colours (no lens on the default dark
  card = missed colour entry), winner highlighting and Buy links work, and a
  couple of `focalLengthEquiv` values eyeball-check against the crop factor.

## Step 9 — Merge & close out

- Branch per brand (`expand-thirdparty-lenses-<slug>`), one PR per brand; after
  merge, **archive the OpenSpec change** (`/opsx:archive`).
- Carry `PROGRESS.md`'s deferred list into the change's research notes so the
  next pass starts from it.
- Follow up with [`check-prices-and-buy-links`](../check-prices-and-buy-links/SKILL.md)
  to backfill missing ASINs.

---

## Checklist (don't miss one)

- [ ] `PROGRESS.md` created before research, updated in every batch commit
- [ ] `research/lenses.md` enumerates the ecosystem with **2 source URLs per
      lens**, in/out marked, rejects explained
- [ ] every new `manufacturer` has a `MANUFACTURER_COLORS` entry
- [ ] every lens: mount-specific specs, two independent lineages, normalised
      per the Step 2 table (no cross-file copying)
- [ ] every lens in exactly one `── <Maker> ──` dropdown group
- [ ] images: Commons + `imageCredit`, or maker image, or allowlisted with a reason
- [ ] all 7 currencies filled via `compute-prices.js`; `priceIncomplete` only
      where deliberate
- [ ] `npm test` green; `verify-images.js` clean; preview eyeballed in lenses mode
- [ ] `generate-seo.js` re-run (and `dataVerified` deliberately left alone)
- [ ] OpenSpec change archived after the PR merges

## Resumability

Per-maker batches are independently committable units ending in a green
checkpoint. **On resume: read `PROGRESS.md`, go to its "Resume at" line, and
verify the last green commit is actually green (`npm run test:data`) before
adding anything.** If `PROGRESS.md` and the data disagree, the data wins —
recount what's in `LENS_DROPDOWN_GROUPS` and fix the log first.
