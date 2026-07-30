# Canon RF / RF-S — third-party citation ledger (v1.1)

Every lens gets **two independent source lineages** before it is entered:
tier 1 = the maker's own product page for the RF mount; tier 2 = an independent
review/measurement. Retailers (tier 3) are price/ASIN corroboration only and
never count as the second lineage.

Carried forward from `archive/2026-07-05-add-thirdparty-lenses-canon/research/`:
the RF-availability findings (Canon licensed RF-S AF to Sigma/Tamron in 2024;
Viltrox had its APS-C RF AF primes pulled by a 2022 cease-and-desist; Meike
routes around Canon with EF-mount AF → out of scope; no native RF Samyang or
Zeiss). **Those are scope facts, not spec sources** — every spec below is
re-sourced.

## Ledger

| slug | name | maker | line | type | year | disc | src1 (tier 1) | src2 (tier) | notes / conflicts |
|---|---|---|---|---|---|---|---|---|---|
| sigma-12mm-f14 | Sigma 12mm F1.4 DC \| Contemporary | Sigma | Contemporary | Prime | 2025 | no | https://www.sigma-global.com/en/lenses/c025_12_14/?tab=specifications | https://dustinabbott.net/2025/08/sigma-12mm-f1-4-dc-contemporary-review/ (2) | **RF-specific**: 250 g, φ69.0 × 67.4 mm. Abbott independently confirms "Canon version 25g more" than the 225 g E-mount copy he tested. Do **not** take the 225 g / 68.0 × 69.4 mm figures — those are Sony E. |
| sigma-15mm-f14 | Sigma 15mm F1.4 DC \| Contemporary | Sigma | Contemporary | Prime | 2026 | no | https://www.sigma-global.com/en/lenses/c026_15_14/?tab=specifications | https://dustinabbott.net/2026/02/sigma-15mm-f1-4-dc-contemporary-review/ (2) | **RF-specific**: 240 g, φ69.0 × 62.8 mm — Abbott lists the identical per-mount split. Released 12 Mar 2026 → `year: 2026`. |
| sigma-17-40mm-f18 | Sigma 17-40mm F1.8 DC \| Art | Sigma | Art | Zoom | 2025 | no | https://www.sigma-global.com/en/lenses/a025_17_40_18/ | https://dustinabbott.net/2025/06/sigma-17-40mm-f1-8-dc-art-review/ (2) | **Conflict, resolved:** Abbott lists 528 g and $829; Sigma's per-mount table gives RF = 560 g and Sigma US lists $919. Abbott reviewed a pre-RF (E/L) sample at announcement. Tier 1 wins on both: 560 g, $919. RF version launched Aug 2025. |
| tamron-17-70mm-f28 | Tamron 17-70mm F/2.8 Di III-A VC RXD (B070) | Tamron | Di III-A | Zoom | 2026 | no | https://www.tamron.com/global/consumer/lenses/b070/spec.html | https://www.tamron.eu/en/newsroom/newsroom/17-70mm-f-2-8-di-iii-a-vc-rxd-for-nikon-z-mount-and-canon-rf-mount (1, separate doc) | **New for RF** — the previous pass recorded "NOT on RF"; that changed. Announced 24 Jun 2026, shipping 2 Jul 2026, $749. RF length **117.3 mm** (tamron.com per-mount + Tamron Americas); the EU newsroom's 119.3 mm is the mount-generic figure. **tier 2 unavailable — shipped 2026-07-02; re-verify next pass.** |
| sigma-16-300mm-f35-67 | Sigma 16-300mm F3.5-6.7 DC OS \| Contemporary | Sigma | Contemporary | Zoom | 2025 | no | https://www.sigma-global.com/en/lenses/c025_16_300_35_67/?tab=specifications | https://www.ephotozine.com/article/sigma-16-300mm-f-3-5-6-7-dc-os-contemporary-lens-review-37216 (2) | **RF-specific**: 625 g (ePHOTOzine's 615 g is the L/X/E figure). `minAperture` F22-45 → store the wide end, 22. RF launched May 2025. |

## Rejected candidates (do not re-research)

| candidate | reason |
|---|---|
| ~~Tamron 17-70mm F2.8~~ | **no longer rejected** — shipped for RF 2 Jul 2026, now entered |
| Viltrox RF-S AF primes (23/33/56 f/1.4) | still only rumoured for 2026 — nothing shipping. Re-check next pass |
| Sigma full-frame DG DN (RF) | none released for RF as of this run |
| Meike AF primes | EF-mount workaround, not native RF |
| Samyang, Zeiss | no native RF |
| Viltrox 1.33× anamorphics | out of scope: cine/anamorphic |
| Viltrox 13/23/33/56 f/1.4 RF | withdrawn after Canon C&D — not shipping |

## Deferred with unresolved source conflicts

These were researched to the point of conflict and left out rather than
guessed. Each needs one reachable tier-1 page with a Canon RF row.

| candidate | agreed | in conflict |
|---|---|---|
| Laowa 100mm f/2.8 2× Ultra Macro APO | 12/10, 13 blades, f/2.8-22, MFD 24.7 cm, 2.0×, 67 mm | length 125 mm (Abbott, RF review; laowalenses.ca "Canon") vs 155 mm (B&H RF SKU; laowalenses.ca "Sony FE"); weight 638 g vs 650 g |
| Laowa 58mm f/2.8 2× Ultra Macro APO | Ф74 × 117 mm, 13 blades, 67 mm, 2.0×, 14/11 | weight 595 g (B&H) vs 564 g (Abbott); venuslens.net 403s |
| TTArtisan RF MF primes | RF versions exist | no reachable spec table: official pages 404, store pages omit dimensions/blades/filter |
| 7Artisans RF MF primes | RF versions exist | same — no reachable spec table, B&H 403s |

## Follow-up research (2026-07-30): why the budget makers stay out

Re-attempted with `curl` + a browser UA and Shopify's `products.json`, which
reach pages `WebFetch` could not. **The blocker is not access — it is that the
data is not published.**

### TTArtisan — 14 lenses do ship in RF

From TTArtisan's own spec tables (`ttartisan.com/?<category>%2F<id>.html=`,
reachable via curl; WebFetch 404s on the URL encoding):

| lens | frame | blades | filter | MFD | weight |
|---|---|---|---|---|---|
| APS-C 10mm F2 | APS-C | 10 | 39mm | — | ~180 g |
| APS-C 23mm F1.4 | APS-C | 10 | 52mm | 0.5 m | ~336 g |
| APS-C 25mm F2 | APS-C | 8 | 40.5mm | 0.2 m | ~248 g |
| APS-C 35mm F1.4 | APS-C | 10 | 43mm | — | ~222–250 g |
| APS-C 50mm F0.95 | APS-C | 10 | 58mm | — | ~411 g |
| APS-C 40mm F2.8 Macro | APS-C | 7 | 43mm | — | ~166–189 g |
| APS-C 7.5mm F2 fisheye | APS-C | 8 | holder | 0.25 m | ~333–345 g |
| Tilt APS-C 35mm F1.4 | APS-C | 10 | 52mm | 0.35 m | ~341–350 g |
| 50mm F1.4 ASPH | FF | 12 | 49mm | 0.5 m | ~429–457 g |
| Tilt 50mm F1.4 | FF | 13 | 62mm | 0.5 m | ~452 g |
| Tilt-Shift 17mm F4 | FF | 10 | — | 0.3 m | ~1051–1056 g |
| 14mm F2.8 ASPH | FF | 8 | holder | 0.2 m | — |
| 500mm F6.3 | FF | 12 | 82mm | 3.3 m | ~1564–1617 g |
| 100mm F2.8 2X Macro | FF | 12 | 67mm | 0.25 m | ~700–748 g |

**Two hard blockers, both structural:**
1. **TTArtisan publishes no dimensions for any lens.** Their spec table has
   focal length, apertures, MFD, frame, blades, filter size, optical design,
   angle of view, focus method, weight and mount — never diameter × length.
   `diameter` and `length` are schema-required (`min: 1`), so an entry is
   impossible without inventing them. 14 of 14 affected.
2. **Weight is a cross-mount range, not a per-mount figure** ("Around
   429~457g" spans E/Z/RF/L). The RF value can't be pinned from tier 1.
   admiringlight's RF-mount review of the 50mm F1.4 gives 457 g — the top of
   the range — which is a usable per-mount value for that *one* lens only.

Also worth recording: **none of TTArtisan's AF lenses ship in RF.** All nine
(AF 23, AF 56, AF 35 II, AF 14, AF 75, AF 50 Neo, AF 17 Air, …) are E/X/Z/L
only. Canon still has no budget third-party AF at all.

### 7Artisans — 42 RF-capable SKUs, no dimensions anywhere

`7artisans.store/products.json` lists 42 products with a Canon RF option. Not
one publishes dimensions in its product body, and 7artisans.com serves no
crawlable spec table. Roughly half the RF list is cine/anamorphic (T-stop
designs, PL kits), which is out of scope regardless.

### Verdict

These are not "couldn't find it" gaps — they are makers who don't publish the
fields the schema requires. Entering them needs a measurement source per lens
(a retailer's box dimensions corroborated independently, or a reviewer who
measured), which is per-lens manual work with no bulk path. Recommend leaving
them out until a maker starts publishing dimensions, and revisiting the two
Laowa macros first since those are one number each.
