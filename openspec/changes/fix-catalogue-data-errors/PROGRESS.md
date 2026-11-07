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
