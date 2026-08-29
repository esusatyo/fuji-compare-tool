# Canon RF third-party lens candidate ledger (round 2)

One row per candidate, filled during research before any data entry. Rejected
candidates stay in the table with a reason so a later pass doesn't
re-research them. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/research/lenses.md`
for round 1's ledger (34 rows including TTArtisan/7Artisans dimension tables)
— don't duplicate its confirmed facts, only its still-open items.

| slug | name | maker | line | type | year | disc | src1 (tier 1) | src2 (tier) | notes / conflicts |
|---|---|---|---|---|---|---|---|---|---|
| samyang-14mm-f28 | Samyang MF 14mm F2.8 RF | Samyang | Manual | Prime | 2019 | no | https://www.lksamyang.com/en/product/product-view.php?seq=410 (1) | https://samyangus.com/products/14mm-f2-8-full-frame-ultra-wide-angle-canon-rf (1, live-sale confirmation) | **Round-1 scope call corrected**: round 1 said "no native RF Samyang" — wrong. This is one of Samyang's first two Canon RF lenses, announced 28 Feb 2019 alongside an MF 85mm F1.4 RF, and is still actively sold today (2026-08-29) on samyangus.com and jessops.com. Full spec table on lksamyang.com. No filter thread (bulbous front, rear gel holder). |
| samyang-12mm-f2-rf-s | Samyang AF 12mm F2 RF-S | Samyang | AF | Prime | 2025 | no | https://www.lksamyang.com/en/product/product-view.php?seq=657 (1) | https://samyangus.com/products/samyang-af-12mm-f2-0-rf-s-ultra-wide-angle-lens (1, live-sale + price confirmation) | Samyang's first RF-S (APS-C) lens, announced 5 Dec 2024, shipping from Jan 2025. Linear STM AF, weather sealed. USD list $499 (site shows a $449 sale price — used list price per skill convention). |

## Deferred / rejected — Yongnuo batch (2026-08-29)

Yongnuo's Canon "EOS RF/EF/R" category (https://yongnuo.eu/lenses/eos-rf-ef/, 13
products) has four AF candidates beyond the 2 already entered
(`yongnuo-35mm-f2`, `yongnuo-85mm-f18`), all confirmed genuine "R Mount"
(Yongnuo's own term for Canon RF) products but **none publish the required
non-nullable dimension fields** (weight/length/diameter/blades/elements/groups/
minFocusDist) on any reachable page — same pattern as TTArtisan/7Artisans in
round 1. WebSearch-summarized numbers (e.g. "183g", "360g", "143g/55mm/67mm")
surfaced for some of these are aggregator/AI-summary claims I could not trace
to a specific page I read myself, so per "skip rather than guess" they are not
used. Skipped, not entered:

| candidate | reason |
|---|---|
| YN 23mm f/1.4 APS-C (R Mount) — yongnuo.eu/lenses/eos-rf-ef/yn-23mm-f-1-4-aps-c-lens-for-r-mount/ | confirmed genuine RF-S AF product; page publishes no weight/length/diameter/filter/MFD/elements/groups/blades. th.hkyongnuo.com's Shopify sibling page (23mmf14) only adds an unverifiable "approx. 360g" in marketing prose, not a spec table |
| YN 35mm F1.8 R DA DSM(-C) — yongnuo.eu/lenses/eos-rf-ef/yn35mm-f1-8r-da-dsm/ | confirmed genuine RF full-frame/APS-C-compatible AF product (works on both, no RF-S-only crop applied per Yongnuo's own compatibility note); no dimension spec table anywhere reachable (yongnuo.eu, th.hkyongnuo.com/products/yn35mm-f18r-da-dsm both text-only marketing copy) |
| YN 50mm F1.8 DSM (R-Mount) — yongnuo.eu/lenses/eos-rf-ef/yn-50mm-f1-8-dsm-for-r-mount-cameras/ | confirmed genuine RF full-frame AF product; same gap — no weight/length/diameter/filter/elements/groups/blades on any reachable page. th.hkyongnuo.com's sibling page's only numeric field is a `"Weight":0.25` in a cart-JS `data-` attribute — that's a shipping weight (rounded to the nearest 250g shipping bracket), not a bare-lens spec, so unusable per Step 2's weight convention |
| YN85mm F1.8R DF DSM II — yongnuo.eu/lenses/eos-rf-ef/yn85mm-f1-8r-df-dsm-ii/ | **flagged, not entered — ambiguous, not a clean skip.** Page has a full spec table (381g, 88×67mm, 58mm filter, 0.8m MFD, 0.13×, 9 el/8 gr, 7 blades) and a distinct URL/nav entry alongside the un-suffixed original, satisfying "tier 1 is sufficient alone." But independent 2021 press (CineD, DPReview, PetaPixel) on the ORIGINAL (non-"II") YN85mm F1.8R DF DSM already reports near-identical specs (346–380g, 67×88mm, 9/8, 7 blades, 80cm MFD) — i.e. the "II" page's numbers read as the *original* product's own long-published specs, not a distinguishable second revision. yongnuo.eu has a **documented history of template/copy errors** on this exact lens family (the entered `yongnuo-85mm-f18`'s own imageSource note flags the original page's prose as a Fujifilm-X template leak). Given that track record, "II" reads more likely as a site-catalog artifact (a re-listed/renamed page) than a genuine second hardware SKU, but I have no independent source confirming either way. Entering it risks a near-duplicate spurious entry; not entering it risks missing a real product. Recorded here for the next pass rather than guessed either direction. |

## Meike — AF vs MF distinction (re-checked 2026-08-29)

Round 1's "Meike AF primes are EF-mount workaround, not native RF" **still
holds for AF** — meikeglobal.com's Canon-RF-labelled AF-adjacent listings are
all **cine** lenses (T-stop, PL/EF/RF/E mount kits, e.g. the FF Prime Cine
16/24/35/50/85/105/135mm line) — out of scope per Step 1 (cine excluded), and
in any case not photography AF primes.

**But round 1 never checked Meike's still-photography *manual-focus* lines
against Canon RF specifically, and that gap is real**: meikeglobal.com sells
at least a native-RF MF prime (`meikeglobal.com/products/10mm-f2-0rf`, "10mm
F2.0 APS-C Prime Manual Focus Wide Angle Lens for RF Mount") plus RF-mount
full-frame MF primes sold through Amazon (Meike MK-50mm F1.7 and MK-50mm
F1.2 RF, both "Manual Focus... Canon RF Mount"). These are genuine native-RF
products Meike sells directly for RF, distinct from the EF-adapter AF
workaround. **Not entered this round** (out of time budget) — logged as a
confirmed, real gap for the next Meike-focused pass: re-scope
meikeglobal.com's full RF-mount MF catalogue (likely several more than these
3), source full specs per Step 2, enter as a new maker batch.

## Samyang — scope call corrected (2026-08-29)

Round 1's "no native RF Samyang" was **wrong** — see the two entered lenses
above. Samyang has sold native Canon RF products since Feb 2019 (`MF 14mm
F2.8 RF`, entered) and expanded into RF-S in Jan 2025 (`AF 12mm F2 RF-S`,
entered). A third candidate surfaced but wasn't researched this round: press
references to an "MF 85mm F1.4 RF" (Samyang's other Feb-2019 RF launch
lens, alongside the 14mm) — check lksamyang.com for its current product page
and specs on the next pass. There are also scattered references to an "AF
14mm F2.8 RF" (a later autofocus version of the same focal length) that I did
not verify directly against lksamyang.com/samyangus.com — some search results
describing it may be conflating it with the Sony FE version of the same
optical design; needs a direct tier-1 read before entering.

## Zeiss — confirmed still absent from RF (2026-08-29)

Re-checked directly: Zeiss's mirrorless/DSLR consumer stills lines (Loxia
for Sony E, Batis for Sony E, Milvus for Canon EF/Nikon F) are **discontinued
company-wide**, not just absent from RF — confirmed by its own distributor
statements and multiple 2026 trade reports (Zeiss is winding down consumer
photo lenses generally, shifting focus toward smartphone optics). Coverage
from mid-2026 notes Zeiss still manufactures a small number of **DSLR-mount**
lenses by continued popular demand, but these are EF/F-mount only — never
RF, never any mirrorless mount. So "no native RF Zeiss" stands, with the
sharper fact behind it: there is no *current* Zeiss stills lens on any
mirrorless mount at all, RF included. No change to Canon's data.
