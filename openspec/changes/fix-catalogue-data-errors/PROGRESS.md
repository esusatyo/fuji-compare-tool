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
