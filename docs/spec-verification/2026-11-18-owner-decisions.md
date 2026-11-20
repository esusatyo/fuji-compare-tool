# Spec verification — owner decisions on the open questions — 2026-11-18

Follow-up to the runs in `2026-11-14-fujifilm.md` … `2026-11-17-olympus-leica.md`
(PRs #96, #98, #102). The owner answered the open questions; this ledger records
what was applied, what new evidence turned up while applying it, and what is still
open. The conventions themselves now live in `docs/data-methodology.md`.

## New sources read today

| source | items | result |
|---|---|---|
| Canon Japan `personal.canon.jp/product/camera/rf/<code>/spec` (T1) | 15 Canon zooms | per-focal-length min aperture, AF/MF close focus and magnification, diameter × length |
| Canon Japan product pages (T1) | RF 16-28, RF 75-300, RF 24-240, RF 100-500, EOS R8, EOS R8 Mark II | sealing claims (防塵・防滴) |
| Fujifilm global / en-AU / en-NZ / de-DE (T1) | XF56mmF1.2 R WR; X100VI, X100V, X100F, X-Pro3 | Ø79.4 × 76 mm, 445 g on all four; hybrid battery figures |
| SG-image store page + spec card (OCR) (T1) | SG-image 50mm f/1.8 | "Aperture Ring: Fixed Aperture" |
| Leica US technical-specification page (T1) | APO-Summicron-M 35 | "Length approx. 49,3 mm", no hood wording |

canon.co.uk and canon.ie returned Akamai "Access Denied" to Chrome today.

## Applied

| item(s) | change | basis |
|---|---|---|
| canon: rf-15-30 | minAperture 32 → 22; minFocusDist 13 → 28; maxMagnification 0.52 → 0.16 | wide-end rule; AF rule (MF 0.128 m / 0.52× had been stored) |
| canon: rf-24-105 f/4-7.1 STM | minAperture 32 → 22; maxMagnification 0.3 → 0.4 | wide end; AF 0.4× at 105mm |
| canon: rf-24-240 | minAperture 38 → 22 | wide end (22 / 36) |
| canon: rf-100-500 | minAperture 40 → 32 | wide end (32 / 51) |
| canon: rf-200-800 | minAperture 54 → 32 | wide end (32 / 51) |
| canon: rfs-10-18 | minFocusDist 12 → 14; maxMagnification 0.32 → 0.23 | AF figures |
| canon: rfs-18-45 | minFocusDist 10 → 20; maxMagnification 0.42 → 0.16 | AF figures |
| canon: rfs-18-150 | minAperture 32 → 22; minFocusDist 14 → 17; maxMagnification 0.42 → 0.44 | wide end; AF figures |
| canon: rfs-55-210 | minAperture 32 → 22; minFocusDist 60 → 73; maxMagnification 0.25 → 0.28 | wide end; Canon Japan 0.73 m / 0.28× at 210mm |
| canon: eos-r8 | weatherSealed true → false | Canon UK claims it, Canon Japan does not; held until a third Canon source |
| canon: rf-16-28 f/2.8 IS STM | **kept** weatherSealed true (owner had agreed to revert) | Canon Japan: "防塵防滴構造を採用" (dust- and drip-resistant construction). Re-raised to the owner |
| olympus: om-3, om-5, om-5-ii, om-3-astro | ibisStops 7.5 → 6.5 | body-only rule |
| olympus: e-m1-iii, e-m1-iii-astro, e-m1x | ibisStops 7.5 → 7.0 | body-only rule |
| olympus: e-m5-iii | ibisStops 6.5 → 5.5 | body-only rule |
| olympus: om-3-astro | weight 413 → 496 | with battery and card, same body as OM-3 |
| olympus + panasonic: omsystem-40-150mm-f4-pro | elements 15 → 19 | OM System page |
| panasonic: s5-ii, s5-iix | ibisStops 6.5 → 5.0 | body (B.I.S.) figure |
| panasonic, leica, sigma, sony: sigma-16-28mm-f28-dg | weatherSealed true → false | Sigma makes no claim |
| panasonic + leica: laowa-15mm-f2-l | diameter 66 → 77.2 | Laowa page (Canon/Nikon/Sony copies already 77.2). The M-mount version (63) is a different lens, untouched |
| leica: q2, q2-monochrom | maxBurst 20 → 10 | Leica lists 10/5/3 fps |
| leica: apo-summicron-m-35mm-f2-asph | length 40.9 → 49.3, live page cited | owner decision; hood caveat recorded in the note |
| sigma: sd-quattro-h | evfMag 0.74 → 0.71 | 0.96 × 26.7/36 |
| fujifilm: x100vi, x100v, x100f, x-pro3, x-pro2 | battery split: batteryLifeEvf / batteryLifeOvf = 310/450, 350/420, 270/390, 370/440, 250/350; batteryLifeLcd null; batteryLife = EVF | hybrid-finder rule; new `batteryLifeOvf` field (engine row "Battery (Optical VF, CIPA)", schema, vs-page formatter, test) |
| nikon: zr | batteryLife 370 → 350 | Energy-saving OFF rule (370 was the ON figure) |

## Checked, no change

- **fujifilm: xf-56mm-f12-wr** diameter 79.4: four Fujifilm regional pages agree.
- **sgimage-50mm-f18** (all 7 copies) minAperture 1.8 = maxAperture 1.8: correct. The
  lens has no iris; the shaped-aperture plates drop in. The earlier "certainly wrong"
  flag was a mistake. Barrel engraving 50/1.8 confirms the maximum.
- **canon: rf-75-300** stays weatherSealed false: Canon Japan makes no claim, so
  Canon UK's "Yes" is a page error.
- **canon: rfs-10-18** minAperture: Canon Japan prints only "32"; stored 22 (Canon UK,
  wide end) kept.
- X100VI evfMag 0.52 (optical) kept under the new rule; X100F/X-Pro3 already optical.

## Still open (re-asked)

- E-M5 II High Res label (owner wants more detail).
- Canon RF-S 55-210 length (UK 135, Japan 92.9, stored 89.8) and RF-S 18-150 diameter
  (UK and Japan both 69, stored 74.4).
- T2 second sources for image-only / blocked makers; owner's manuals for old bodies.
- EOS R8 Mark II stored sealed; Canon Japan makes no claim.
- APO-Summicron-M 35: whether 49.3 includes the hood.
