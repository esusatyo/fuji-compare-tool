# Spec verification — Olympus + Leica — 2026-11-17

Scope: `node .claude/skills/verify-specs/scope.js --brand olympus` and `--brand leica`.
Almost everything already carried a citation, but those were added when the brands were onboarded: Olympus cameras were mostly Wikipedia and DPReview, and Leica relied on maker PDFs plus DPReview. This is the first field-by-field pass against the makers.

## PROGRESS (resume here)

- [x] Batch O1: 43 Olympus / OM System cameras (33 verified and cited, 10 with no surviving maker source)
- [ ] Batch L1: 49 Leica cameras
- [ ] Batch L2: 48 Leica lenses
- [ ] Batch T: third-party lenses in `olympus/` and `leica/` not checked in #98 (Laowa, Samyang, Voigtländer, Zeiss, Thypoch, TTArtisan, 7Artisans, SG-image, Meike, Viltrox)

## Sources (Olympus)

| source | covers | notes |
|---|---|---|
| `jp.omsystem.com/product/<path>/spec.html` (T1) | OM-1, OM-1 II, OM-3, OM-5, OM-5 II, PEN (2026), E-M1X, E-M1 III, E-M5 III, E-M10 IV, E-P7, E-PL10, TG-6, TG-7 | full Japanese spec table. A short path `/product/dslr/<code>/spec.html` redirects to the real one, or to the archived PDF |
| `jp.omsystem.com/cms/record/<dslr\|compact>/<code>/spec.pdf` (T1) | E-M1, E-M1 II, E-M5, E-M5 II, E-M10, E-M10 II, E-M10 III, PEN-F, E-PL5–E-PL9, E-PM2, TG-3, TG-4, TG-5 | an archived screenshot of the old spec page: no text layer. Read with macOS Vision OCR (ja-JP), tiled at 1,600 px |
| `explore.omsystem.com/c/en/<slug>` (T1) | OM-3 ASTRO, E-M1 III ASTRO | summary specs only |

Conventions applied:
- **Viewfinder magnification:** Olympus quotes native magnification with a 50 mm lens, so divide by 2. Where the page gives a range across finder styles, the maximum is stored, matching the existing E-M1X / OM-1 / OM-3 entries.
- **Battery:** the standard CIPA figure, not the low-power mode.
- **Burst split:** mechanical = 連写H (the top mechanical rate). Electronic = the top 静音 (silent) or SH1 rate; SH1 locks focus and exposure on the first frame but is full-resolution RAW. The TG-3/TG-4 15/60 fps modes are 3 MP only, so they are excluded.

## Batch O1 — fixes applied

| item | field(s) | stored → source |
|---|---|---|
| om-1-ii | batteryLife | 520 → 500 |
| om-3 | batteryLife | null → 590 |
| om-5-ii | depth / bluetooth | 49.7 / 4.2 → 52.0 / 5.2 (stored figures were the OM-5's) |
| pen-om | evfMag | 0.58 → 0.62 (1.10–1.23×) |
| pen-om | battery split | LCD 410 / EVF 410 (both stated) |
| e-m10-iv | evfMag | 0.67 → 0.62 (1.23×) |
| e-m5-iii | evfMag | 0.67 → 0.68 (1.37×; matches OM-5) |
| e-p7 | batteryLife | 330 → 360 |
| e-pl10 | bluetooth | 4.2 → 4.0 |
| e-pl9 | bluetooth | 4.2 → 4.0 |
| e-m1 | batteryLife / ibisStops | 330 / null → 350 / 4.0 |
| e-m5 | lcdDots / width / height / depth | null / 122 / 89 / 43 → 610 / 121 / 89.6 / 41.9 |
| e-m5-ii | batteryLife | 580 → 310 (low-power mode is 750; 580 matches neither) |
| e-m10-ii | weight | 390 → 399 |
| pen-f | weight / maxBurst | 434 / 10.4 → 427 / 10 |
| e-pl5 | batteryLife / weight | 330 / 279 → 360 / 325 (279 was body only) |
| e-pl6 | batteryLife | 330 → 360 |
| e-pl7 | ibisStops | null → 3.5 |
| e-pl8 | maxBurst / batteryLife / W×H×D / weight | 8.6 / 330 / 115×67×38 / 357 → 8.5 / 350 / 117.1×68.3×38.4 / 374 (stored body figures were the E-PL7's) |
| e-pm2 | batteryLife | 330 → 360 |
| tg-3, tg-4 | batteryLife | 330 → 380 |
| tg-5 | ibisStops | null → 2.5 (sensor-shift) |

Burst split (mechanical / electronic), applied to 19 bodies:

| bodies | mechanical / electronic (fps) |
|---|---|
| om-1, om-1-ii | 10 / 120 |
| om-3, om-3-astro | 6 / 120 |
| om-5 | 10 / 30 |
| om-5-ii | 6 / 30 |
| pen-om | 5 / 30 (maxBurst 5 → 30) |
| e-m1-ii, e-m1x, e-m1-iii, e-m1-iii-astro | 15 / 60 |
| e-m5-iii | 10 / 30 |
| e-m10-iv | 8.7 / 15 (maxBurst 8.7 → 15) |
| e-p7 | 8.7 / 15 |
| e-pl9, e-pl10 | 8.6 / 14.1 (maxBurst → 14.1) |
| tg-5, tg-6, tg-7 | 5 / 20 |

Rounding only, not changed: E-M1 II, E-M5 II, E-M10, E-M10 II, E-M10 III, E-PL6, E-PL7, E-PM2, TG-3/4/6 and PEN-F dimensions (all ≤0.5 mm off), plus several 1037 vs 1040k-dot monitors.

## Open questions (not changed)

- **IBIS figure: body-only or Sync IS?** OM System gives both. The stored values mix them:
  - Body-only: OM-1 7.0, OM-1 II 8.5, E-M1 II 5.5, PEN 5.5.
  - Sync IS: OM-3 / OM-5 / OM-5 II / OM-3 ASTRO 7.5 (body 6.5), E-M1 III / E-M1 III ASTRO / E-M1X 7.5 (body 7.0), E-M5 III 6.5 (body 5.5).
  - Panasonic's S9 was moved to the body-only (B.I.S.) figure in #98. Suggest body-only here too: 8 changes.
- **OM-3 ASTRO weight 413** is body only (the page gives nothing else). The identical OM-3 body is 496 with battery and card. Suggest 496.
- **E-M5 II hiResShot "40MP handheld"**: the sheet lists one 40 MP mode built from 8 shots. Handheld High Res first appeared on the E-M1X. Suggest "40MP tripod".

Unsourced on the page, kept: E-M1 II weight 574 (the sheet gives only the 498 g body-only figure); E-M10 III IS stops (the OCR missed the value); weather sealing on E-M1 / E-M1 II / E-M5 / E-M5 II (the old sheets have no sealing row, and Olympus claimed it elsewhere).

## Unverifiable (Olympus)

E-P1, E-P2, E-P3, E-P5, E-PL1, E-PL2, E-PL3, E-PM1, TG-1 and TG-2: there is no HTML page, the archived PDF URL returns 403, and olympus-global.com press releases carry no spec table. Their existing T2 citations stay.
