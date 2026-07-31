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
| laowa-58mm-f28-macro | Laowa 58mm f/2.8 2X Ultra-Macro APO | Laowa | Ultra Macro APO | Prime | 2022 | no | https://www.laowalenses.ca/product/laowa-58mm-f-2-8-2x-ultra-macro-apo/ (Laowa Canada, official distributor) | https://dustinabbott.net/2022/09/laowa-58mm-f2-8-apo-2x-macro-review/ (2) | **Conflict resolved.** Abbott's 564 g is his own scale reading; Laowa Canada's table says 595 g and kmcamera's RF SKU agrees. Mirrorless-only design (E/RF/Z/L, no DSLR variant) so there is no DSLR figure to confuse it with — one weight across all mounts. Everything else agrees: Ø74 × 117 mm, 13 blades, 67 mm, 2.0×, f/2.8-22, 14/11, MF. |
| laowa-100mm-f28-macro | Laowa 100mm f/2.8 2X Ultra Macro APO | Laowa | Ultra Macro APO | Prime | 2020 | no | https://www.laowalenses.ca/product/100mm-ultra-macro-apo/ (DSLR row only) + kmcamera RF SKU | https://www.cameralabs.com/laowa-100mm-f2-8-2x-macro-apo-review/ (2) | **Conflict resolved by cameralabs:** "DSLR versions are about 30mm shorter and 15g lighter than the mirrorless versions." So the 125 mm / 638 g on Laowa Canada is the **EF** row and the RF is 155 mm / ~653 g → B&H and kmcamera's 155 mm and B&H's 650 g are the RF figures. Abbott's RF review quotes 125 mm/638 g, i.e. EF spec text in an RF review. Blades **13** on RF (Abbott's RF review: "13 … higher than the 9 blades on EF"); DCW confirms 13 for mirrorless. cameralabs' 159 mm/700 g include the supplied UV filter — bare figures used per the normalisation rule. RF announced 20 Apr 2020, so `year: 2020`, not the 2019 EF/F/FE launch. |
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

### TTArtisan — 14 lenses ship in RF (corrected names)

Scraped from TTArtisan's own spec tables (`ttartisan.com/?<category>%2F<id>.html=`,
reachable with curl + browser UA; WebFetch 404s on the URL encoding).

**Correction:** an earlier version of this table mislabelled these lenses. The
page `<title>`s were being cut at the first hyphen, so every APS-C lens read
"TTArtisan APS". Corrected names below.

| page | lens | blades | filter | MFD | weight (as published) |
|---|---|---|---|---|---|
| aps-c-lenses/71 | APS-C 35mm F1.4 | 10 | 39mm | — | ~180 g |
| aps-c-lenses/73 | APS-C 50mm F1.2 | 10 | 52mm | 0.5 m | ~336 g |
| aps-c-lenses/74 | APS-C 17mm F1.4 | 8 | 40.5mm | 0.2 m | ~248 g |
| aps-c-lenses/76 | APS-C 23mm F1.4 | 10 | 43mm | — | ~222–250 g |
| aps-c-lenses/77 | APS-C 50mm F0.95 | 10 | 58mm | — | ~411 g |
| aps-c-lenses/78 | APS-C 25mm F2 | 7 | 43mm | — | ~166–189 g |
| aps-c-lenses/79 | APS-C 10mm F2 ASPH | 8 | holder | 0.25 m | ~333–345 g |
| aps-c-lenses/Tilt-C-35 | Tilt APS-C 35mm F1.4 | 10 | 52mm | 0.35 m | ~341–350 g |
| full-frame-lenses/55 | 50mm F1.4 ASPH | 12 | 49mm | 0.5 m | ~429–457 g |
| full-frame-lenses/60 | Tilt 50mm F1.4 | 13 | 62mm | 0.5 m | ~452 g |
| full-frame-lenses/345 | Tilt-Shift 17mm F4 ASPH | 10 | — | 0.3 m | ~1051–1056 g |
| full-frame-lenses/347 | 14mm F2.8 ASPH | 8 | holder | 0.2 m | (not published) |
| full-frame-lenses/500-F6-3 | 500mm F6.3 | 12 | 82mm | 3.3 m | ~1564–1617 g |
| full-frame-lenses/TS-100-Macro | 100mm F2.8 Macro 2X | 12 | 67mm | 0.25 m | ~700–748 g |

**Completeness against `validateLens`, ignoring dimensions entirely: 0 of 14.**

| required field | how many of the 14 are missing it | why |
|---|---|---|
| `diameter`, `length` | **14** | TTArtisan publishes no dimensions for any lens in its catalogue |
| `maxMagnification` | **13** | only the 100mm macro publishes a ratio (2:1) |
| `weight` | **9** | quoted as a range spanning all mounts (e.g. "429~457 g"), or absent |
| `minFocusDist` | 4 | not published |

So this is not a single missing field pair — three or four required fields are
absent across the board. Making `diameter`/`length` nullable would not unlock a
single lens on its own.

**Dimensions do not exist in any citable form.** For the best-documented lens
(50mm F1.4 ASPH, which has an actual RF-mount review), the only figures found
disagree: CineD says 57 × 68 mm, lensfinder.org says 60 × 69 mm and cites
nothing. Weight is the one number that *is* pinnable — admiringlight's RF review
gives 457 g, the top of TTArtisan's range, consistent with RF being the heaviest
mount.

**Sources exhausted:** TTArtisan official (no dims), 7artisans.com (gzipped,
no crawlable structure), maker Shopify JSON, retailer Shopify JSON (kmcamera,
thecamerastore, pergear — marketing copy only), B&H / Adorama / photospecialist
(403), Amazon (500), TTArtisan download centre (no PDFs exposed),
admiringlight RF review (no dims), phillipreeve (reviews E/M-mount copies),
lensfinder.org (uncited aggregator, conflicts with CineD).

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

## Aggregator route evaluated (2026-07-31)

Per the owner's decision to accept retailer/aggregator figures, `lensfinder.org`
(which has per-mount pages, e.g. `/lenses/canon-rf/<slug>`) was tested rather
than trusted.

**Validation — the structured spec table is largely accurate:**

| lens | cross-check against | result |
|---|---|---|
| Tamron 11-20mm f/2.8 | our tier-1-verified entry | **8/8 exact** (filter, MFD, min ap, weight, elements, groups, length, diameter) |
| Sigma 10-18mm f/2.8 | our tier-1-verified entry | 6/8 — MFD rounded (12 cm vs 11.6), **weight 260 g vs Sigma's RF figure of 270 g** |
| 6 × TTArtisan RF | TTArtisan official spec tables | **20+ field matches, no contradictions**; resolves TTArtisan's cross-mount weight *ranges* to single values at the top of the range, consistent with RF being heaviest (admiringlight independently confirms 457 g for the 50mm F1.4 ASPH) |

**But the prose on those pages is LLM-generated and wrong.** The 50mm F1.4 ASPH
page's review text claims an "11-blade diaphragm"; TTArtisan's own table says
12. **Only the structured table is usable; the prose must be ignored.**

**Coverage:**
- **TTArtisan: 9 of 14** RF lenses have a spec-table page.
- **7Artisans: 0.** Every candidate slug soft-404s. This route does not help
  7Artisans at all, and it remains unsourceable by any means tried.

**The binding constraint has moved from dimensions to `maxMagnification`.**
lensfinder's table has no magnification field, TTArtisan publishes it for the
macros only, and no retailer lists it. `maxMagnification` is schema-required
(`{ type: 'number', min: 0 }`, not nullable), so 12 of 14 TTArtisan lenses
remain un-enterable *even with aggregator data accepted*.

**Also unresolved:** the APS-C 35mm F1.4 has three mutually contradictory
published dimension sets — ø44 × 42 mm, 44 mm long × 56 mm diameter
(lensfinder), and 44 mm long × 42 mm diameter. Mount variation may explain part
of it, but nothing arbitrates.

**Naming hazard for the next pass:** TTArtisan sells both a `100mm F2.8 2X
Macro` and a `Tilt-Shift 100mm F2.8 2X Macro`. The official page slugged
`TS-100-Macro` and lensfinder's `ttartisan-100mm-f28-macro-2x` may not be the
same product — confirm before entering either.
