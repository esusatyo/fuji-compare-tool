# Progress — fix catalogue data errors (after PR #78)

**Branch:** data-fixes-nov2026 (from main 3715cca)
**Resume at:** 2.1

**Owner (2026-11-07):** "do the follow up PR, please make sure that you have
double checked the data and save the citation of the sources of the data, and
also please fix any other mistakes you have mentioned."

## Scan (2026-11-07, main 3715cca)

Minimum focus distance vs stored magnification (thin-lens estimate), and the
MFD(cm) / longest focal(mm) spread for every lens at >= 100 cm: the largest
real ratio is 1.11 (Leica APO-Telyt-M 135 at 150 cm); the eight below are
1.6-3.4.

| Entry | Stored MFD | Stored mag | Added in |
|---|---|---|---|
| nikon/z-24-70mm-f2-8-s-ii | 240 | 0.32 | #25 |
| nikon/z-70-200mm-f2-8-vr-s-ii | 380 | 0.3 | #25 |
| nikon/z-24-105mm-f4-71 | 200 | 0.5 | #25 |
| nikon/z-28-135mm-f4-pz | 340 | 0.25 | #25 |
| nikon/z-dx-16-50mm-f28-vr | 150 | 0.24 | #40 |
| sony/fe-100mm-f28-macro-gm | 260 | 1.4 | #27 |
| sony/fe-100-400mm-f45-gm-oss | 640 | 0.25 | #27 |
| sony/fe-100-400mm-f56-8-oss | 860 | 0.41 | #27 |

Benign scan hits (checked, not errors): filter wider than barrel on Laowa
15 f/2 and 12-24 f/5.6 (flared front) and Nikon Z 14-24 S (filter on the
hood); Leica M density above 3 g/cm3 (brass); identical sizes on Sigma 17/24
I-series, Leica APO-Summicron-SL family and Viltrox Air 25/35; "year before
mount" on the X100 and Leica X compacts (fixed-lens bodies).

## 2. Minimum focus distance (done 2026-11-07)

All eight re-read from the maker's own spec table (Nikon USA product data,
Sony Electronics US spec tab in Chrome); every other spec field on those
entries matched. Extra fix: Z 70-200 f/2.8 VR S II VR 5.5 -> 6.0 stops (Nikon:
"6.0 stops, CIPA 2024 standard"). FE 100-400 F5.6-8 USD 850 -> 849 ($849.99).
Guard tightened to >= 150 cm and > 1.4x longest focal length.

## 3. Prices (done 2026-11-07)

- 3.1/3.2: USD confirmed at two or three stores each; the regional prices had
  no source and contradicted USD -> null + priceIncomplete.
- 3.3: correction to the 2026-11-07 scan claim. A CAD price under 1.1x USD is
  not wrong by itself: US tariffs raised USD only. 8 of the 42 already cite
  sony.ca / explore.omsystem.com and are right. The other 34 were checked:
  - Nikon (11): store.nikon.ca regular (RRP) prices, all higher than stored
    (stored figures were stale), e.g. Z 50 f/1.8 S 599 -> 869, Z 14-24 S
    2599 -> 3459, Z7 II 2499 -> 3499.
  - Canon (5): canon.ca "MSRP", e.g. RF 600 f/11 899 -> 1099.
  - Sony (7): sony.ca list price; three were the sale price (749 vs 799), E
    16-55 G 1799 -> 1449, E 50 f/1.8 449 -> 399, E PZ 10-20 confirmed 949.
  - Fujifilm XF 10-24 WR: no price on Fujifilm Canada; Aden Camera and Best
    Buy Canada both $1,349.99 -> 1349.
  - Lumix G 100-300 II (panasonic + olympus): Panasonic Canada $899.99 -> 899.
  - Third-party (TTArtisan 50 / 23 RF, 7Artisans 35 III RF, 7Artisans 50 f/1.2
    / 10mm X, SG-image 35 / 50 X): makers sell in USD only; the regional
    prices were round placeholders (99/199/299) -> null + priceIncomplete;
    USD re-read at the maker store (+ B&H where listed), unchanged.
  - **Not confirmable, left as is:** Canon EOS R100 CAD 599. Canon Canada
    sells the R100 only as the RF-S18-45 kit (MSRP $899.99, 6052C012); Best
    Buy Canada lists only kits; no body-only Canadian price exists. A current
    camera needs all seven currencies, so the figure stays and is flagged.

## 4. Release years (2026-11-07)

Convention (add-thirdparty-lenses skill): `year` = first shipping year in
this mount, not the announcement or the design's DSLR launch. Every touched
entry got a dated citation (confirmed or "X -> Y").

- 4.1 Fujifilm Samyang 8mm (Fisheye II, X-mount March 2014; renamed to say
  Fisheye II, which its specs and the current Samyang US product are) and
  14mm (X-mount February 2014). Found while checking: the 14mm's USD 199 was
  a Rokinon-branded B&H sale; Samyang US and B&H's Samyang listing are both
  $399 -> USD 399, unsourced regionals -> null.
- 4.2 Samyang manual-focus "2020" entries: 33 changed (2013-2018), 6 MK II
  confirmed 2020. Sony E 14/35/85 = Dec 2013 full-frame E release; MFT 14 =
  B&H MFT listing archived 2014-03-14 (best available); MFT 85 = Photo
  Review Oct 2014 "recently released". **Still open:** the 8mm f/3.5 CS II on
  Sony E (discontinued) and MFT (olympus, panasonic) - no dated mirrorless
  CS II launch found (the E-mount 8mm f/3.5 VG10 version shipped May 2011;
  a Swiss retailer lists the E CS II from 2016-10-18; Wayback was offline).
- 4.3 Other estimates: Samyang AF 14 FE 2017 -> 2016, AF 24-70 FE 2024 ->
  2021 (the "early 2024" note was wrong; launch spec table also gives 9
  blades, was null), Nokton 21 E 2020 -> 2019. Confirmed: Zeiss ZM 25/28/35/
  Planar 50 2004, Biogon 21 2005 (shipped Oct 2005), C Biogon 35 2008, C
  Sonnar 50 2006, Thypoch Eureka 50 2024, Meike AF 35 E 2024, Samyang AF 18
  2019 / AF 35 2017. **Left as is:** 7Artisans M 28 f/1.4 = 2019 (announced
  Nov 2018; first shipping date not found).
- 4.4 Store-listing years, at-risk ones checked: TTArtisan 11mm fisheye Z/L
  2022 -> 2020; TTArtisan TS 17mm Z/L 2025 -> 2026 (those mounts came March
  2026); TTArtisan 35 f/1.4 E 2022 -> 2020; Viltrox AF 28 f/1.8 FE 2024 ->
  2023. Confirmed with a dated source: TTArtisan M 50 f/1.4 and f/0.95, TS 17
  E, Samyang AF 12 E, FE II 50/35/85, P 35/16/85, 14-24 FE, Viltrox 35 LAB,
  SG-image 35 f/1.2, 50 f/1.4, 7.5, 12, 24 (all mounts). SG-image's store was
  rebuilt Aug-Sep 2025, so all its listing dates read 2025. **Ambiguous, left
  at 2025:** SG-image 25 f/1.8 MF and 35 f/0.95 (announced in China
  Feb/Apr 2024; Japanese/global launch July 2025) and 50 f/1.8 shaped
  aperture (shown July/Nov 2024, no ship date). Not re-checked (recent
  launches where a listing date is reliable): the other Viltrox 2024-2026,
  Thypoch, 7Artisans 6mm / M 75 II, TTArtisan 14mm ASPH and 7.5 f/2.
