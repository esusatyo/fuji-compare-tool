# Canon RF third-party lens candidate ledger (round 2)

One row per candidate, filled during research before any data entry. Rejected
candidates stay in the table with a reason so a later pass doesn't
re-research them. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/research/lenses.md`
for round 1's ledger (34 rows including TTArtisan/7Artisans dimension tables)
— don't duplicate its confirmed facts, only its still-open items.

| slug | name | maker | line | type | year | disc | src1 (tier 1) | src2 (tier) | notes / conflicts |
|---|---|---|---|---|---|---|---|---|---|
| tamron-17-70mm-f28 | Tamron 17-70mm f/2.8 Di III-A VC RXD | Tamron | Di III-A | Zoom | 2026 | no | https://tamron-americas.com/canon/ (re-confirms RF-specific 117.3 mm / 530 g) | none found — see notes | **Re-verification, no new candidate.** Round 1 entered this on tier-1 alone (shipped 2026-07-02, no tier-2 existed yet). Re-checked 2026-08-29, ~2 months post-ship: **still no tier-2 hands-on review of the RF copy exists.** rfshooters.com's Canon-RF forum (thread "In-depth review of Tamron's 17-70 f2.8 for RF since it's release?") confirms this directly — as of the thread, "a few on YT" but no written measured review. dustinabbott.net, lenstip, ephotozine, the-digital-picture.com all only have reviews of the original 2021 Sony E-mount / 2023 Fujifilm X-mount copy (the-digital-picture.com's page is an archive.org-dated March-2026 snapshot, i.e. pre-dates the 2026-07-02 RF ship date, so it is not RF-specific either). All stored figures (530 g, 117.3 mm, 67 mm filter, $749 USD) re-confirmed unchanged against tamron-americas.com's Canon RF mount page. photographytalk.com's "review" independently states the same per-mount breakdown (RF 530 g/117.3 mm vs Sony E 525 g/119.3 mm vs Fuji X 530 g/119.6 mm vs Nikon Z 540 g/121.3 mm) but reads as a spec-comparison piece with no hands-on testing claims — logged as T4 corroboration only, not counted as the tier-2 lineage. No figure needed correcting. `specSources` added to the entry recording this. |
| viltrox-85mm-f18 | Viltrox AF 85mm f/1.8 RF II | Viltrox | RF II | Prime | 2021 | no | *(none — see notes)* | https://www.gearfocus.com/products/viltrox-af-85mm-f18-rf-ii-lens-for-canon-rf-14290 (3, via search snippet) | **re-verified, no change (2026-08-29).** viltrox.com no longer lists any Canon RF product — its own mount filter (`E-mount, FE-mount, X-mount, Z-mount, L-mount, M-mount, DL-mount, PL-mount`) omits Canon entirely, and an on-site search for "85mm RF" returns zero RF results (confirmed by direct browse, not just absence of a hit). No tier-1 source exists to re-check against; this was already known and allowlisted in `completeness.test.js` (2026-08-17 note) for the image gap, now reconfirmed true for specs too. Cross-checked existing weight/dims (484g, 92×80mm, 72mm filter, 80cm MFD, 10el/7gr, 9 blades, $399) against current retailer listings (B&H product title still reads "RF II"; GearFocus listing) — all match the dataset exactly, no drift found. Note: the *original* Nov 2021 Canon-RF announcement (newsshooter.com, petapixel.com, both NEWS-tier) quoted 530g — that figure is for the first-generation RF release; "RF II" is Viltrox's later, lighter (484g) hardware revision, which is what B&H/GearFocus currently sell and what the dataset already reflects. No mis-relabeling found — the entry's "II" is a genuine second RF hardware generation, not an inflated rename of the same product. |
| viltrox-rfs-23mm-f14 / -33mm-f14 / -56mm-f14 | Viltrox AF 23/33/56mm f/1.4 RF-S | Viltrox | — | Prime | — | — | *(none — unreleased)* | https://thenewcamera.com/viltrox-rf-s-lenses-incoming-for-canon-in-2026/ (NEWS, updated 2025-12-21) | **still rejected — not shipping.** Round 1 (2026-08-05) found these "only rumoured for 2026." Re-checked 2026-08-29: thenewcamera.com's Dec 2025 update claims the lenses are coming "with full authorization from Canon" as an "official partner," but as of today no product has shipped — viltrox.com's own store carries zero Canon-mount lenses (see row above), and Viltrox's most recent roadmap news (photorumors.com, 2026-08-20; digitalcameraworld.com, 2026-04-10) covers only L-mount/NAB announcements with no RF-S mention. Licensing-reversal claim is unconfirmed by any shipped product or maker page — stays a rumor, not a fact, and stays out of scope. |

## No new Sigma or Tamron candidates found

Both makers' current Canon RF-S lineups were enumerated directly against their
own sites and matched the 10 Sigma + 3 Tamron entries already in `canon/data.js`
exactly — nothing new to enter this round.

**Sigma (10/10, unchanged):** `sigma-global.com/en/special/sigma_rfmount_lenses/`
(Sigma's own dedicated Canon RF mount lens landing page, T1) lists exactly:
12mm f/1.4 DC, 15mm f/1.4 DC, 16mm f/1.4 DC DN, 23mm f/1.4 DC DN, 30mm f/1.4 DC DN,
56mm f/1.4 DC DN, 10-18mm f/2.8 DC DN, 16-300mm f/3.5-6.7 DC OS, 17-40mm f/1.8 DC,
18-50mm f/2.8 DC DN — all 10 already in `canon/data.js`. Cross-checked against a
general web search for any Sigma RF announcement after the 15mm f/1.4 (Mar 2026,
the most recent addition already entered) through 2026-08-29: none found.

**Tamron (3/3, unchanged):** `tamron.com/global/consumer/lenses/canon_rf/` and
`tamron-americas.com/canon/` (both T1) list exactly: 11-20mm f/2.8 Di III-A RXD
(B060), 17-70mm f/2.8 Di III-A VC RXD (B070), 18-300mm f/3.5-6.3 Di III-A VC VXD
(B061) — all 3 already in `canon/data.js`. Cross-checked against a general web
search for any Tamron RF announcement after the 17-70mm (Jun 2026) through
2026-08-29: none found (a Digital Camera World piece on Tamron's 2026 roadmap
mentions plans to expand across "four mounts" generically but names no specific
new Canon RF SKU).

**No rejected candidates for Sigma/Tamron this round** — there was nothing
new to consider for either maker; both lineups were fully accounted for
already. Viltrox's rejected candidate (the still-unshipped RF-S primes) is
in the ledger above.
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

## 7Artisans deferred batch (2026-08-29) — no new lenses entered

**Re-pulled the current catalogue.** `7artisans.store/products.json?limit=250`
(121 products total, single page) filtered to genuine Canon RF-capable mount
tokens (`Canon RF`, `Canon RF-S`, `Canon EOS-R`, `Canon EOS-RF`, `Canon R`,
`EOS-R mount` — explicitly excluding `Canon EOS-M`, which is the discontinued
EF-M mount and not RF) yields **30 RF-capable products**, of which:
- 3 are already entered (`7artisans-9mm-f56`, `7artisans-10mm-f28-ii`,
  `7artisans-35mm-f14-iii`)
- ~13 are cine/T-stop lenses (title contains "Cine" or a T-stop aperture like
  T1.5/T1.05/T2.0/T2.1/T2.9) — **out of scope** per the skill's boundary
- 1 is an accessory (PL lens adapter kit) — not a lens, excluded
- **14 are non-cine MF primes not yet entered** (the actual candidate pool,
  smaller than round 1's ~39-remaining estimate because that count included
  the cine lenses this pass explicitly excludes):

  6mm f/2.0 APS-C fisheye · 12mm f/2.8 Mark II APS-C · 14mm f/2.8 full-frame ·
  75mm f/1.4 full-frame · original 10mm f/2.8 fisheye (full-frame, pre-Mark-II) ·
  original 35mm f/1.4 APS-C (pre-Mark-III) · 25mm f/0.95 APS-C ·
  50mm f/0.95 APS-C · 60mm f/2.8 full-frame 2X ultra-macro ·
  60mm f/2.8 Mark II APS-C macro · 55mm f/1.4 Mark II APS-C ·
  50mm f/1.05 full-frame · 35mm f/5.6 full-frame · 35mm f/0.95 APS-C ·
  7.5mm f/2.8 Mark II APS-C fisheye

**The `.store` unlock (confirmed real, but narrower than hoped).** Round 1's
premise was right for a minority of the catalogue: `7artisans.store` product
pages *can* render a `Φ<diameter>mm` / `<length>mm` dimension diagram plus a
plain-text spec grid (Focal length/Frame/Weight/Aperture blade/Filter
size/Closest Focus/Optical structure/etc.) below the marketing images —
confirmed by re-reading the **already-entered** `7artisans-9mm-f56` product
page (`9mm-f-5-6-full-frame-wide-angle-lens-for-e-l-r-z`), whose diagram reads
**Φ70mm × 86mm** — an exact match to the entered `diameter:70, length:86`.
This proves the technique is real and was the actual source for the existing
3 entries.

**But it does not generalise to the rest of the catalogue.** Checked 5 of the
14 remaining candidates for the same template:

| candidate | spec grid present? | dimension diagram present? | outcome |
|---|---|---|---|
| 35mm f/0.95 APS-C (`35mm-0-95`) | full grid (weight 369g, 11/8, 12 blades, Φ52mm filter, MFD 0.37m, f/0.95-16, 43.9° AOV) | page ends at footer, no diagram | **no length/diameter — deferred** |
| 50mm f/1.05 full-frame (`50mm-f1-05`) | older template (mount-compat chart only, no numeric grid) | none | **deferred, minimal specs available** |
| 55mm f/1.4 Mark II APS-C | older template | none | **deferred** |
| 60mm f/2.8 full-frame 2X ultra-macro (`60mm-f-2-8-full-frame-2x-ultra-macro-lens-for-e-rf-z`) | partial — marketing copy states weight "≈550g", shown mounted on a Canon EOS R body | no diagram section on this page | **deferred — weight sourced, no length/diameter** |
| 14mm f/2.8 full-frame (new release, on sale $209.30 from $299 RRP) | full grid: F2.8-F22, Φ77mm filter, 13 elements/9 groups, 116° AOV, 10 blades, **weight ≈504g marked "(E)" — Sony E only, not confirmed for RF**, manual focus, metal body | "Product Parameters" heading present but the rounded-corner canvas/video element beneath it never renders — confirmed blank via 6s wait, re-navigate, and a `zoom` capture of the exact region (solid near-black, no content at any resolution) | **deferred — likely a broken/unloaded video component on 7artisans.store, not a lazy-load timing issue** |

**Conclusion for this pass:** the browser-automation unlock is confirmed to
still work (validated the existing 3 entries' provenance), but of the 5
untried candidates checked, **0 had both a length and a diameter available**.
The 35mm f/0.95 page has everything except the diagram; the 14mm f/2.8 page
has the diagram *section* but its content element renders empty; the other
three pages simply don't ship the richer template at all. This is a
**narrower version of round 1's same blocker** ("no published dimensions"),
not a new one — the technique that worked for the 3 already-entered lenses
does not reliably extend to the rest of the catalogue as currently built.

**All 14 remaining candidates are deferred, none entered.** No lens was added
to `canon/data.js` in this batch — see `PROGRESS.md` for the per-candidate
status and what a future pass should try next (Amazon/AliExpress box-dimension
corroboration, or re-checking the 14mm f/2.8 page after 7Artisans' storefront
possibly fixes the broken diagram component).
