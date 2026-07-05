---
name: add-thirdparty-lenses
description: Add or expand third-party lenses (Sigma, Tamron, Viltrox, Samyang, Zeiss, Laowa, budget makers, …) for one camera brand in the comparison tool — research the mount's real third-party ecosystem, enter mount-specific verified lens data in per-maker batches, wire dropdown groups and manufacturer colours, and verify the test suite. Use when the user wants to add third-party lenses to a brand, expand a brand's third-party coverage, or finish the third-party pass after onboarding a new brand.
metadata:
  author: fuji-compare-tool
  version: "1.0"
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

- **Denormalized, per-brand, no `mount` field.** The same optical design (e.g.
  Sigma 18-50mm f/2.8 DC DN) is a separate entry in each brand's `data.js`
  with that mount's own weight/length/price/`asin`/`productUrl`/`imageUrl`.
  No shared catalogue, no cross-mount UI — the brand file implies the mount.
- **Never copy specs between brand files.** Mount variants genuinely differ
  (weight, length, sometimes filter size), and copied entries have shipped
  wrong specs before. Re-source every entry from the manufacturer's page for
  **that mount** + one more reputable source (retailer/DPReview).
- **Skip rather than guess.** If a required field (dimensions are the usual
  gap for budget MF primes) can't be sourced, leave the lens out and note it
  as a deferred tail — don't fabricate.
- **Small per-maker batches, test-checkpointed.** After each batch run
  `npm run test:data`. A partial dataset stays green as long as every
  *entered* lens is complete — commit each green checkpoint.

---

## Step 1 — Research & scope (no code yet)

Enumerate the mount's real third-party ecosystem, one maker at a time, into an
OpenSpec change's `research/lenses.md` (record `slug | name | manufacturer |
line | type | discontinued | cross-mount note`).

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

Cross-check the enumeration against the maker's own "lenses for <mount>"
page — makers' mount availability changes yearly (verify a design actually
ships in this mount **today**, not just "was announced").

## Step 2 — Shared wiring (before bulk data)

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

## Step 3 — Lens data, in per-maker batches

Work one manufacturer at a time (majors first, budget makers last). Every
entry must satisfy the **per-lens definition of done**:

- **Specs verified against ≥2 sources** for this mount (manufacturer product
  page + retailer/DPReview). Match `validateLens` in `tests/helpers/schema.js`:
  `type` ∈ {`Prime`,`Zoom`}; primes set `focalLength`, zooms
  `focalLengthMin` < `focalLengthMax` (and `focalLength: null`);
  `focalLengthEquiv` string using the crop factor from the Step 1 table;
  aperture, elements/groups/blades, size/weight, `afType`, `weatherSealed`,
  `ois`/`oisStops`, `year`, `discontinued`.
- **Slug**: `<maker>-<focal>-f<aperture-no-dot>[-line/variant]`, e.g.
  `sigma-18-50mm-f28`, `tamron-28-75mm-f28-g2`, `viltrox-27mm-f12`,
  `zeiss-batis-25mm-f2`. On Panasonic, suffix `-mft` when an MFT entry would
  collide with its L-mount sibling.
- **`manufacturer`** exactly matching a `MANUFACTURER_COLORS` key; **`line`**
  records the sub-brand (`Art`, `Contemporary`, `Di III`, `Air`, `Batis`,
  `Nokton`, …).
- **Prices**: current lenses carry a verified USD RRP; where the six regional
  RRPs can't all be confirmed, set `priceIncomplete: true` (USD-only or
  partial is then fine). Discontinued lenses may be USD-only without the flag.
- **`productUrl`**: the manufacturer's live https product page for this mount.
- **`asin`**: verified plain-product amazon.com ASIN for **this mount's
  variant** (not a bundle/Renewed/International; most third-party listings
  are per-mount — picking the wrong mount's ASIN is the classic mistake), or
  `null` → search fallback. Bulk backfill later via
  [`check-prices-and-buy-links`](../check-prices-and-buy-links/SKILL.md) is fine.
- **`imageUrl`** or an entry in `KNOWN_IMAGE_GAPS[<slug>]` in
  `tests/data/completeness.test.js`. Third-party lenses are rarely on Wikimedia
  Commons — expect most non-Sigma entries to stay on the placeholder card
  (allowlisted), which is fine. Sigma's own site has stable product images.

After each maker batch: add the ids to `LENS_DROPDOWN_GROUPS` (Step 4),
run `npm run test:data`, commit.

## Step 4 — Dropdown groups

- Append per-maker groups **after** the first-party groups, labelled
  `── <Maker> ──`, ordered majors-first (Sigma, Tamron, Samyang/Viltrox, …),
  with a single `── Other ──` group for the budget makers.
- Every lens must appear in **exactly one** group (referential test enforces).
- On a dual-mount brand (Panasonic), carry the mount in the group label
  (e.g. `── Sigma (L-mount) ──`, `── Sigma (MFT) ──`) — that's the only place
  mount is surfaced.
- A maker with many lenses may be split by line the way first-party groups
  are (e.g. Sigma APS-C / FF primes / FF zooms) — mirror the brand's style.

## Step 5 — Verify

- `npm test` fully green (schema, referential, completeness, colour coverage,
  and the logic tier all auto-cover the new lenses).
- Optionally `RUN_LINK_TESTS=1 npm run test:links` to spot-check the new
  `productUrl`/`imageUrl`s.
- Open `<slug>/index.html` on the preview server, switch to Lenses mode:
  confirm the new groups appear, cards render with maker colours (no lens on
  the default dark card = missed colour entry), winner highlighting and Buy
  links work, and a couple of `focalLengthEquiv` values eyeball-check against
  the crop factor.

## Step 6 — Merge & close out

- Branch per brand (`add-thirdparty-lenses-<slug>`), one PR per brand; after
  merge, **archive the OpenSpec change** (`/opsx:archive`).
- Record skipped/deferred lenses (unsourceable dims, rate-limited research
  tails) in the change's research notes so the next pass starts from them.
- Follow up with [`check-prices-and-buy-links`](../check-prices-and-buy-links/SKILL.md)
  to backfill missing ASINs and regional prices flagged `priceIncomplete`.

---

## Checklist (don't miss one)

- [ ] `research/lenses.md` enumerates the mount's ecosystem, in/out marked
- [ ] every new `manufacturer` has a `MANUFACTURER_COLORS` entry
- [ ] every lens: mount-specific specs from ≥2 sources (no cross-file copying)
- [ ] every lens in exactly one `── <Maker> ──` dropdown group
- [ ] `priceIncomplete`/USD-only/discontinued pricing rules applied
- [ ] unimaged lenses allowlisted in `KNOWN_IMAGE_GAPS[<slug>]`
- [ ] `npm test` green; preview eyeballed in lenses mode
- [ ] OpenSpec change archived after the PR merges

## Resumability

Per-maker batches are independently committable units ending in a green
checkpoint. If interrupted, resume at the first maker not yet in
`LENS_DROPDOWN_GROUPS`. Track progress in the OpenSpec change's `tasks.md`
(the archived brand changes are the templates).
