# Panasonic lineup expansion — citation ledger (2026-08-08 refresh)

Source tiers, per the repo convention:
**T1** the maker's own site (incl. official regional sites) · **T2** independent
review/measurement · **T3** retailer, price and availability only · **NEWS**
dated announcement, `year` only.

A T1 page is authoritative on its own. T3 never establishes a spec. Aggregators
are never used for mount availability — a past run measured one at ~30% wrong on
that field while its spec tables were fine.

**Mount-specific specs are mandatory.** Sigma, Viltrox, Samyang and Laowa all
publish per-mount weight/length rows that differ between L-Mount and Sony E.
Every physical figure below is the **L-Mount** (or MFT) row; where a reviewer's
figure differs because they tested another mount's copy, that is recorded under
conflicts rather than silently dropped.

---

## Third-party — L-Mount

| slug | name | maker | T1 source | T2 source | notes / conflicts |
|---|---|---|---|---|---|
| `sigma-135mm-f14-dg` | Sigma 135mm f/1.4 DG Art | Sigma | https://www.sigma-global.com/en/lenses/a025_135_14/?tab=specifications | https://dustinabbott.net/2025/09/sigma-135mm-f1-4-dg-art-review/ | **L-Mount rows used: 1430 g / 135.5 mm.** Sony E is 1420 g / 137.5 mm — Abbott tested the E copy, which independently confirms the split is real. `ois:false` is argument-from-absence (no OS row, no "OS" in the name, no reviewer mentions it); Sigma never states it negatively. Price $1899 unanimous across 4 sources. |
| `sigma-35mm-f14-dg-ii` | Sigma 35mm f/1.4 DG II Art | Sigma | https://www.sigma-global.com/en/lenses/a026_35_14/?tab=specifications | https://dustinabbott.net/2026/02/sigma-35mm-f1-4-dg-ii-art-review/ | **L-Mount rows used: 530 g / 94.0 mm.** Sony E is 525 g / 96.0 mm (Abbott's copy). **Coexists with `sigma-35mm-f14-dg` (a021) — see below.** Nothing copied between generations; they differ on nearly every physical field (a021: 13 blades, 30 cm MFD, ~640 g). Product-image URL 404s → image gap. |
| `viltrox-16mm-f18-l` | Viltrox AF 16mm F1.8 L | Viltrox | https://viltrox.com/products/af-16mm-f1-8-l | https://fstoppers.com/reviews/review-viltroxs-first-l-mount-af-16mm-f18-l-large-aperture-full-frame-ultra-wide-722697 (L-mount copy) | Viltrox's **first** L-mount lens (joined L-Mount Alliance Sept 2025). `line` recorded as `AF` per repo convention — Viltrox publishes no sub-line badge for this model. Two valid L-mount ASINs exist (`B0GLGC7C21`, `B0GH6ZFLQ2`); took the title-verified former. $580 list ($551 launch promo — not used). |
| `viltrox-28mm-f45-l` | Viltrox AF 28mm F4.5 Chip L | Viltrox | https://viltrox.com/products/af-28mm-f4-5-l + https://viltrox.com/blogs/new-in/viltrox-chip-l-built-for-the-l-mount-everyday-carry-setup | https://www.35mmc.com/24/07/2026/viltrox-af-28mm-f4-5-lens-for-l-mount-review/ | **No iris at all** — a fixed polygonal aperture plate ahead of the elements, so `blades:null` and `minAperture == maxAperture == 4.5`. No filter thread → `filterThread:null`. Length 13.2 mm (T1 + 3 corroborations); Fstoppers' "16 mm / ~18 mm" measures including the mount flange, stated as such. Weight 60 g (T1) over 35mmc's own-scale 52 g. **Rejected ASIN `B0H5HSTCNK`** — fetches as a Sony-E 26mm, wrong focal length *and* mount. |
| `samyang-14-24mm-f28-l` | Samyang AF 14-24mm F2.8 L | Samyang | https://www.lksamyang.com/en/product/product-view.php?seq=685 (mount row reads "Leica L") | https://www.provideocoalition.com/samyang-af-14-24mm-f2-8-now-available-for-l-mount-cameras/ | Samyang's **first** L-mount lens. **Mount-carryover trap caught:** samyangus.com lists 98.6/88.8 mm on the L page, but that is the FE figure (verified against the FE page, seq=665). The Korean L page and Newsshooter both give **96.6 mm / 441 g** — exactly 2 mm shorter, matching L's 20 mm flange vs E's 18 mm. Used the L figures. Sold as **Rokinon** in the US; $1199 confirmed on the maker's own US store. No L-mount ASIN exists → `null`. |

### Sigma a021 — explicitly NOT discontinued

`sigma-35mm-f14-dg` (35mm f/1.4 DG DN Art, 2021) stays `discontinued:false`.
Three checks, per the "verify the lineup listing, not just that the page loads"
rule: it still appears in Sigma's current ART grid at
https://www.sigma-global.com/en/lenses/ alongside the DG II; its product page
carries no end-of-production notice; and Sigma's own US store sells it at
"as low as $989". Sigma is running both generations concurrently at two price
points — the same pattern as the 35mm F1.2 DG II.

> **Open item:** that $989 is above our recorded $799. "As low as" on
> sigmaphoto.com matched MSRP exactly for the 135mm, but it could equally be a
> promo here and no press-release MSRP was found to corroborate. Left unchanged
> and raised with the owner rather than applied.

---

## Third-party — L-Mount (Laowa) and MFT (OM System)

| slug | name | maker | T1 source | T2 source | notes / conflicts |
|---|---|---|---|---|---|
| `laowa-180mm-f45-macro-l` | Laowa 180mm f/4.5 1.5x Ultra Macro APO | Laowa | https://www.laowalenses.ca/product/180mm-f4-5-1-5x-ultra-macro-apo/ (official distributor; venuslens.net 502s on 3 of 4 fetches) | https://www.lensrentals.com/rent/venus-optics-laowa-180mm-f4.5-1.5x-ultra-macro-apo-l (L-mount SKU) | **L-mount is the manual-focus variant** — AF ships only E/Z/EF. That changes `minAperture` to **F32** (AF version stops at F22); DCW's "f/4.5–22" is from the Sony E copy. **`weight`/`length` are the weakest figures in this batch:** Laowa publishes only Canon EF (484 g / 88.4 mm) and Sony E (521.6 g / 134.4 mm) rows, no L row. Used Lensrentals' L-mount SKU (≈499 g / ≈134 mm, rounded from imperial) — a T3-grade source, but L-specific. **The EF row must never be substituted: EF is the DSLR-flange build and is ~46 mm shorter.** Elements 12/9 (T1) over FocusNordic's transposed "9/12". |
| `laowa-17mm-f4-tilt-shift-l` | Laowa 17mm f/4 Zero-D Tilt-Shift | Laowa | https://www.venuslens.net/product/laowa-17mm-f-4-zero-d-tilt-shift-shift/ | https://www.lensrentals.com/rent/venus-optics-laowa-17mm-f4-zero-d-tilt-shift-l + https://petapixel.com/2026/03/10/new-laowa-17mm-f-4-zero-d-tilt-shift-lens-looks-fantastic-for-architecture-photographers/ | **Two SKUs share one page:** Tilt-Shift (±10° tilt + ±12 mm shift, 810 g, $1249 — entered) and Shift-only (±11 mm, 770 g, $999 — *not yet entered*). Maker's dimension row `"Approx. Ø111mm*Ø93mm"` labels both figures Ø; resolved to length 111 / diameter 93 via Lensrentals ("3.7 × 4.4″ ø x L") and PetaPixel ("111mm long") — a 93 mm max diameter is also the only value consistent with an 86 mm filter thread. Release is **10 Mar 2026** (CP+), not the May date in the brief. `weatherSealed:false` — the "Frog-Eye Coating" is a front-element coating, not barrel sealing. **⚠ Body incompatibility below.** |
| `omsystem-100-400mm-f5-63-ii` | OM System M.Zuiko 100-400mm f/5-6.3 IS II | OM System | https://explore.omsystem.com/us/en/m-zuiko-ed-100-400mm-f5-0-6-3-is-ii | https://petapixel.com/2025/02/05/om-system-beefs-up-100-400mm-f-5-6-3-lens/ | **Price is a genuine increase, not a sale:** launch MSRP was $1499.99 (Feb 2025); OM's own store and Kenmore Camera both now show **$1699.99 with no discount marker**. Every 2025-vintage source still says $1499.99, so a future aggregator sweep will disagree — this is the reason why. `oisStops:7.0` is the Sync IS (body+lens) figure; lens-only is 4.5 EV. `line` set to `M.Zuiko` because OM publishes **no** PRO/Premium grade for this lens on either its US or global page — do not upgrade it to `PRO`. |

### ⚠ Laowa 17mm Tilt-Shift — incompatible with most current Lumix S bodies

Laowa's own L-mount footnote lists it as **not compatible with the Lumix S5 II,
S5 IIX, S1 II, S1 IIE and S1R II** (the shift mechanism fouls the EVF housing) —
decoded from the maker's garbled model codes by PetaPixel and Lensrentals
independently. That is most of Panasonic's current L-mount line. The dataset has
no compatibility field, so this is recorded here and in a code comment on the
entry only. **Flagged to the owner** — it may warrant dropping the lens or adding
a compatibility note to the schema.

---

## First-party — LUMIX G (Micro Four Thirds) backfill

All six were already on sale and simply absent from the dataset. Panasonic's JP
spec database (`panasonic.jp/dc/p-db/<MODEL>_spec.html`) was the workhorse T1
source: it is the only Panasonic property that records absences affirmatively
(e.g. "防塵防滴: 無し") rather than omitting the row.

| slug | name | year | T1 source | notes / conflicts |
|---|---|---|---|---|
| `lumix-g-14mm-f2-5-ii` | LUMIX G 14mm F2.5 II ASPH. | 2014 | https://panasonic.jp/dc/p-db/H-H014A_spec.html | 55 g / 20.5 mm / Ø55.5 mm are identical to the original H-H014 — **not** a copy error: the II is the same optical and mechanical design with revised cosmetics. Taken from the H-H014**A** sheet directly. |
| `lumix-g-fisheye-8mm-f3-5` | LUMIX G Fisheye 8mm F3.5 | 2010 | https://panasonic.jp/dc/p-db/H-F008_spec.html | `filterThread:null` — takes only a 22×22 mm rear gelatin sheet, no front filter. |
| `lumix-g-macro-30mm-f2-8` | LUMIX G Macro 30mm F2.8 ASPH. MEGA O.I.S. | 2015 | https://panasonic.jp/dc/p-db/H-HS030_spec.html | `minFocusDist:10.5` is genuinely non-integer (0.105 m) — do not round. `afType` is T1-confirmed here (`ステッピングモーター`). Year is **2015** (announced 2015-02-23), not the ~2014 in the brief. |
| `lumix-g-7-14mm-f4` | LUMIX G Vario 7-14mm F4 ASPH. | 2009 | https://panasonic.jp/dc/p-db/H-F007014_spec.html | `filterThread:null` — bulbous front element behind a fixed petal hood; no filter can be mounted. Diameter **70.0 mm** (T1 + cameralabs) over the 75 mm seen in T3 listings. **`afType` inferred** — see below. Oldest item in the dataset; the lens `year` schema floor was lowered 2010 → 2008 (MFT's launch year) to admit it. |
| `lumix-g-x-pz-14-42mm-f3-5-5-6` | LUMIX G X Vario PZ 14-42mm F3.5-5.6 POWER O.I.S. | 2011 | https://panasonic.jp/dc/p-db/H-PS14042_spec.html | **Model identity resolved:** the US store's "14-42mm" URL serves the **power zoom H-PS14042**, not the standard H-FS14042 — a physically larger, different lens. Its own page copy names "LUMIX G X VARIO PZ". Magnification **0.17** native (Imaging Resource's "0.34x" mislabels the 35mm-equivalent as native). Year **2011**, not ~2013. **`afType` inferred**; `asin` unconfirmed → null. |
| `lumix-g-35-100mm-f4-5-6` | LUMIX G Vario 35-100mm F4-5.6 ASPH. MEGA O.I.S. | 2014 | https://panasonic.jp/dc/p-db/H-FS35100_spec.html | The budget/slow telephoto — **not** the F2.8 "X" lens (18/13, 360 g, 58 mm filter). None of the F2.8's figures appear here. Imaging Resource files it as "LUMIX G **X** VARIO", which is wrong — Panasonic's name carries no X. |

**`afType` inferred on two lenses** (`lumix-g-7-14mm-f4`, `lumix-g-x-pz-14-42mm-f3-5-5-6`).
Panasonic published no motor type for either. Applied `Stepping Motor` on the
owner's standing approval (2026-08-08) of pattern-based `afType` inference for
Panasonic lenses: it is T1-confirmed on the 30mm Macro and T2-confirmed on the
14mm II, 8mm Fisheye and 35-100mm F4-5.6, i.e. every contemporaneous sibling
whose motor Panasonic *did* document. Recorded as inference, not as a source.

**`oisStops` is null on all OIS lenses here by fact, not by gap** — Panasonic
never published CIPA stop ratings for MEGA/POWER O.I.S.; numbered ratings only
begin with the later Dual I.S. generation.

**Three are "Sold out" at Panasonic US** (14mm II, 7-14mm, 8mm Fisheye) but retain
live list prices and catalogue entries, so all six are `discontinued:false`.
Revisit if Panasonic delists them.

---

## Cameras

| slug | name | year | T1 source | notes / conflicts |
|---|---|---|---|---|
| `g100` | Lumix G100 | 2020 | https://help.na.panasonic.com/answers/features-and-specifications-lumix-g-series-dc-g100/ + https://panasonic.jp/dc/products/DC-G100V/spec.html | Discontinued — Panasonic's page reads "This model has been refreshed, please see LUMIX G100D", so `productUrl:null` per the supersession rule. **`ibis:false`**: the "5-axis Hybrid I.S." is *electronic* (video-only) plus lens O.I.S.; there is no sensor-shift IBIS. `evfMag:0.73` is the 35mm-equivalent (JP's 1.46× is native) — matches how every other body here is quoted. `maxBurst:10` electronic (6 fps mechanical). Launch price $749.99 is **T2** — Panasonic's own release omits pricing. |
| `bs1h` | Lumix BS1H | 2021 | https://panasonic.jp/dc/p-db/DC-BS1H_spec.html + https://eww.pavc.panasonic.co.jp/dscoi/DC-BS1H/PP_E_GC_GW_GD/DC-BS1H_DVQP2566_eng/chapter15_10.htm | Box body: no LCD, no EVF. `processor:'Venus Engine'` is **T2 only** — Panasonic names it for the BGH1 but conspicuously not for the BS1H on any first-party page. |
| `bgh1` | Lumix BGH1 | 2020 | https://eww.pavc.panasonic.co.jp/dscoi/DC-BGH1/E/DC-BGH1_DVQP2279_eng/chapter14_10.htm + https://panasonic.jp/dc/p-db/DC-BGH1_spec.html | Box body: no LCD, no EVF. `openGate:null` — its 4:3 anamorphic mode (3328×2496) is a **crop**, not a full-sensor readout; do not encode as open gate. `processor` is T1 here. |

### Box-camera encoding decisions

`lcdSize`/`lcdType` are non-nullable strings and `maxBurst` a non-nullable number,
but these bodies have no screen and publish no stills burst rate. Panasonic's JP
spec DB states all three as affirmative absences (`液晶モニター: 無し`,
`ファインダー: 無し`, `連写撮影: なし`), so they are encoded as `'None'` /
`'None'` / `0` — recording a documented absence, not a guess. `batteryLife:null`
because neither has an internal battery (12 V DC / PoE+ / external pack), so CIPA
does not apply.

**Weather sealing — the sibling-inference trap fired here.** Several third-party
pages describe both bodies as sealed "against dust, raindrops and water splashes".
That is Panasonic boilerplate lifted from GH5/S1H marketing. Panasonic's own JP
spec DB records **防塵対応: 無し ("dust resistance: none")** for both, and no
Panasonic page claims splash resistance → `weatherSealed:false`.

---

## Held back — not entered

| candidate | reason |
|---|---|
| **OM System M.Zuiko 50-200mm f/2.8 IS PRO** | `afType` unsourceable and non-nullable. OM's global spec table states **"MSC Mechanism: No"**, which actively *rules out* the sibling inference used for the Panasonic lenses, and no page names the actual drive. The US page's "Type VCM" is under **Image Stabiliser**, not autofocus. Everything else is sourced ($3699.99 list — the $3399.99 is a promo ending 30 Aug 2026; 1075 g, 225.8 mm, 21/13, 9 blades, IP53, 7.0-stop Sync IS, ASIN `B0FQJZCMC4`). Needs one AF-drive source to land. |
| **Laowa 17mm f/4 Zero-D Shift** (shift-only SKU) | Distinct product from the Tilt-Shift that was entered; shares the optical formula but differs on weight (770 g), price ($999) and movements. Only the Tilt-Shift was fully spec'd this pass. |
