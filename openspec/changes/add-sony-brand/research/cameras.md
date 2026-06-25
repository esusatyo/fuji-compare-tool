# Sony Camera Research — body enumeration (tasks 1.1, 1.3, 1.4)

> Comprehensive E-mount body list (current + notable discontinued). USD = launch
> RRP anchor (confident values below; **verify against ≥2 sources at entry**).
> MP from Sony/DPReview. Non-USD currencies derived via
> `scripts/compute-prices.js` unless confirmed; discontinued bodies may use
> `null` for non-USD. `priceIncomplete:true` where regional RRP unconfirmed.
>
> Sources: Sony official (alpha-universe / sony.com), DPReview product DB,
> sansmirror.com (Thom Hogan), alikgriffin.com camera database, B&H / Adorama.

## Series labels (task 1.4) → drive SERIES_COLORS + DROPDOWN_GROUPS
- `Alpha (Full-frame)` — Alpha 7 / 7R / 7S / 7C / 9 / 1
- `Alpha (APS-C)` — a6x00 line
- `Cinema Line` — FX3 (FF), FX30 (APS-C)
- `ZV (Vlog)` — ZV-E1 (FF), ZV-E10 / ZV-E10 II (APS-C)

## Full-frame — Alpha (slug | name | year | MP | discontinued | launch USD)
| slug | name | year | MP | disc | USD$ |
|---|---|---|---|---|---|
| a7r-vi   | A7R VI   | 2026 | 66.8 | N | TBD (flag) |
| a7-v     | A7 V     | 2025 | ~33  | N | ~2499 (verify) |
| a9-iii   | A9 III   | 2024 | 24.6 (global shutter) | N | 5998 |
| a1-ii    | A1 II    | 2024 | 50.1 | N | 6498 |
| a7cr     | A7C R    | 2023 | 61.0 | N | 2999 |
| a7c-ii   | A7C II   | 2023 | 33.0 | N | 2199 |
| a7r-v    | A7R V    | 2022 | 61.0 | N | 3898 |
| a7-iv    | A7 IV    | 2021 | 33.0 | N | 2499 |
| a1       | A1       | 2021 | 50.1 | N | 6498 |
| a7s-iii  | A7S III  | 2021 | 12.1 | N | 3498 |
| a7c      | A7C      | 2020 | 24.2 | Y | 1799 |
| a9-ii    | A9 II    | 2019 | 24.2 | Y | 4498 |
| a7r-iv   | A7R IV   | 2019 | 61.0 | Y | 3498 |
| a7-iii   | A7 III   | 2018 | 24.2 | Y | 1999 |
| a9       | A9       | 2017 | 24.2 | Y | 4498 |
| a7r-iii  | A7R III  | 2017 | 42.4 | Y | 3198 |
| a7r-ii   | A7R II   | 2015 | 42.4 | Y | 3198 |
| a7s-ii   | A7S II   | 2015 | 12.2 | Y | 2998 |
| a7-ii    | A7 II    | 2014 | 24.3 | Y | 1698 |
| a7r      | A7R      | 2013 | 36.4 | Y | 2298 |
| a7       | A7       | 2013 | 24.3 | Y | 1698 |
| a7s      | A7S      | 2014 | 12.2 | Y | 2498 |

## Cinema Line
| fx3   | FX3   | 2021 | 12.1 (FF)    | N | 3899 |
| fx30  | FX30  | 2022 | 26.0 (APS-C) | N | 1799 |

## ZV (Vlog)
| zv-e1      | ZV-E1      | 2023 | 12.1 (FF)    | N | 2198 |
| zv-e10-ii  | ZV-E10 II  | 2024 | 26.0 (APS-C) | N | 999  |
| zv-e10     | ZV-E10     | 2021 | 24.2 (APS-C) | Y | 699  |

## APS-C — Alpha
| a6700 | A6700 | 2023 | 26.0 | N | 1399 |
| a6600 | A6600 | 2019 | 24.2 | Y | 1399 |
| a6500 | A6500 | 2016 | 24.2 | Y | 1399 |
| a6400 | A6400 | 2019 | 24.2 | N | 899  |
| a6300 | A6300 | 2016 | 24.2 | Y | 999  |
| a6100 | A6100 | 2019 | 24.2 | Y | 748  |
| a6000 | A6000 | 2014 | 24.3 | Y | 648  |

**Count: ~33 bodies.** (Excluded: ILX-LR1 industrial camera; FX6/FX9 pro cinema
— out of consumer scope. Revisit if desired.)

## Per-item fields still to capture at entry (groups 5–6)
processor, dimensions/weight, weatherSealed, LCD (size/dots/type), EVF
(type/dots/mag), faceDetection, subjectDetection, maxBurst, ibis/ibisStops,
maxVideoRes, logVideo, bluetooth, wifi, cardSlots, batteryLife, usbCharging,
lensType('Interchangeable'), + Sony fields (logProfile, aiAf, realtimeTracking),
productUrl, asin, imageUrl, full `prices{}`.
