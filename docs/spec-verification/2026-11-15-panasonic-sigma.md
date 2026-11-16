# Spec verification — Panasonic + Sigma — 2026-11-15

Scope commands:
`node .claude/skills/verify-specs/scope.js --brand sigma --uncited` (40 items)
`node .claude/skills/verify-specs/scope.js --brand panasonic --uncited` (148 items)

## PROGRESS (resume here)

- [x] Batch 1: Sigma lenses (35 L-Mount in `sigma/` and `panasonic/`, plus 3 Sigma MFT in `panasonic/`), 5 Sigma cameras, 24 Panasonic cameras
- [x] Batch 2: Panasonic first-party lenses (LUMIX S, LUMIX G, Leica DG): 50, mirrored into the `leica/` (21) and `olympus/` (29) copies
- [x] Batch 3: OM System lenses (29 of 33 cited in `panasonic/`, same 29 in `olympus/`; fixes mirrored). Source `explore.omsystem.com/us/en/<slug>`
- [ ] Batch 4: Laowa, Viltrox, Samyang, Voigtländer in `panasonic/` (9; Viltrox likely unverifiable)

## Sources

| maker | source (T1) | notes |
|---|---|---|
| Sigma lenses | `sigma-global.com/en/lenses/<code>/` | per-mount rows for size and weight; the L-Mount figures are identical across `sigma/`, `panasonic/` and `leica/` |
| Sigma cameras | `sigma-global.com/en/cameras/<slug>/` | full spec table on the product page |
| Panasonic cameras | `panasonic.jp/dc/products/<model>/spec.html` | the US shop and the UK/AU/SG pages carry only a summary now. Japanese model codes: S1R II = DC-S1RM2, S1IIE = DC-S1M2ES, G97 = DC-G99D, G95 = DC-G99, GX9 = DC-GX7MK3, G100 = DC-G100V, G100D = DC-G100DV. Older pages give no battery or IBIS figure |

## Batch 1 — fixes applied

Sigma lenses (sigma-global.com, T1):

| item | field | stored → source | note |
|---|---|---|---|
| sigma-45mm-f28-dg (sigma, panasonic, leica) | weight | 220 → 215 | L-Mount row |
| sigma-24-70mm-f28-dg-ii (sigma, panasonic, leica) | maxMagnification | 0.34 → 0.37 | 1:2.7 (W) |
| sigma-100-400mm-f5-63-dg (sigma, panasonic, leica) | weatherSealed | true → false | Sigma claims only a "Mount with Dust and Splash Resistant Structure" (gasket); skill rule: a mount gasket alone = false |
| sigma-16mm-f14-mft (panasonic, olympus) | weight / length | 405 / 92.3 → 395 / 91.1 | stored figures were the Sony E / EF-M row |
| sigma-30mm-f14-mft (panasonic, olympus) | weight / length | 265 / 73.3 → 260 / 72.1 | same |
| sigma-56mm-f14-mft (panasonic, olympus) | weight / length | 280 / 59.5 → 256 / 58.1 | same |

Everything else on the 38 Sigma lenses matched: elements/groups, blades, minimum aperture, minimum focus, magnification, filter, diameter, length and weight.

Sigma cameras (sigma-global.com, T1):

| item | field | stored → source |
|---|---|---|
| fp | maxVideoRes | UHD 4K / 24P → UHD 4K / 30P (frame rates listed to 29.97p) |
| bf, fp, fp-l | burst split | electronic shutter only: Mech null; Elec 8 / 18 / 10 |

Panasonic cameras (panasonic.jp, T1):

| item | field | stored → source |
|---|---|---|
| s1h | weight | 1052 → 1164 (1052 is body only; dataset stores with battery and card) |
| s1r | weight | 1020 → 1016 |
| s1iie | sensorMP | 24.1 → 24.2 |
| gh5-ii | bluetooth | 5.0 → 4.2 |
| g97 | lcdDots | 1840 → 1040 (OLED monitor, approx. 1.04M dots) |
| s9 | ibisStops | 6.5 → 5.0 (B.I.S. 5.0; 6.5 is the Dual I.S. 2 figure; siblings S1R II and GH7 store the B.I.S. figure) |
| g9-ii | maxBurst | 60 → 75 (SH75) |
| g100d | weight / height / evfDots | 412 / 82.5 / 3.68 → 346 / 83.1 / 2.36 (412 was with the kit lens) |
| l10 | evfMag | null → 0.74 |
| s1-ii | batteryLife | 350 → 360 (SD-card figure) |
| s1 | batteryLife | 380 → 400 (SD-card figure) |
| s1r | batteryLife | 360 → 380 (SD-card figure) |
| g9-ii | batteryLife | 390 → 370 |
| l10 | batteryLife | null → 420 |

The burst split was applied to 22 Panasonic bodies (all except the BS1H and BGH1 box cameras). The battery split was applied to 13, where the page gives monitor and LVF figures.

## Batch 2 — Panasonic lenses (panasonic.jp `/dc/products/<model>/spec.html`, T1)

Magnification is the native figure (the page also prints the 35mm-equivalent one in brackets). The pages do not state weather sealing, so `weatherSealed` was not checked.

| item | field | stored → source |
|---|---|---|
| lumix-s-18mm-f1-8 | maxMagnification / groups / minAperture | 0.08 / 11 / 22 → 0.2 / 12 / 16 |
| lumix-s-24mm-f1-8 | minAperture | 22 → 16 |
| lumix-s-35mm-f1-8 | maxMagnification / groups | 0.15 / 10 → 0.22 / 9 |
| lumix-s-pro-16-35mm-f4 | length / diameter | 100 / 84.6 → 99.6 / 85 |
| lumix-s-14-28mm-f4-5-6-macro | length / blades | 89.6 / 9 → 89.8 / 7 |
| lumix-s-24-60mm-f2-8 | length / diameter / filter / minFocus / mag / elements | 99.7 / 77.5 / 67 / 30 / 0.2 / 13 → 99.9 / 84 / 77 / 19 / 0.3 / 14 (stored figures looked like the 20-60's) |
| lumix-s-28-200mm-f4-7-1-macro | blades / minAperture | 7 / 22 → 9 / 32 (F32-45) |
| lumix-s-70-300mm-f4-5-5-6-macro | blades | 9 → 11 |
| leica-dg-9mm-f1-7 | diameter | 60.3 → 60.8 |
| leica-dg-25mm-f1-4-ii | weight / blades | 200 / 9 → 205 / 7 |
| leica-dg-42-5mm-f1-2-nocticron | maxMagnification | 0.2 → 0.1 (0.2 is the 35mm-equivalent) |
| lumix-g-35-100mm-f2-8-ii | weight / length | 360 / 100 → 357 / 99.9 |
| leica-dg-25-50mm-f1-7 | length / maxMagnification | 128 / 0.18 → 127.6 / 0.21 |
| leica-dg-50-200mm-f2-8-4 | maxMagnification | 0.21 → 0.25 |
| leica-dg-100-400mm-f4-6-3-ii | length | 172 → 171.5 |

The other 35 lenses matched on every field the page states.

## Batch 3 — OM System lenses (explore.omsystem.com, T1)

The page's "Maximum image magnification" gives the Micro Four Thirds figure first and the 35mm-equivalent one second. The dataset stores the native figure.

| item | field | stored → source |
|---|---|---|
| omsystem-12-40mm-f28-pro | diameter | 70 → 69.9 |
| omsystem-40-150mm-f4-pro | length / diameter / mag | 99 / 69 / 0.2 → 99.4 / 68.9 / 0.21 |
| omsystem-12-100mm-f4-pro | length / diameter | 117 / 78 → 116.5 / 77.5 |
| omsystem-17mm-f18 | length / diameter | 38 / 58 → 37.6 / 57.6 |
| omsystem-7-14mm-f28-pro | length / diameter / mag | 106 / 79 / 0.12 → 105.8 / 78.9 / 0.11 |
| omsystem-8mm-f18-fisheye-pro | weight | 314 → 315 |
| omsystem-8-25mm-f4-pro | length / mag | 89 / 0.14 → 88.5 / 0.21 |
| omsystem-20mm-f14-pro | length / minAperture | 62 / 22 → 61.7 / 16 |
| omsystem-40-150mm-f28-pro | weight / diameter | 880 / 79 → 760 / 79.4 (880 includes the removable tripod foot) |
| omsystem-150-400mm-f45-tc125x-is-pro | length / diameter / groups | 314 / 116 / 17 → 314.3 / 115.8 / 18 |
| omsystem-30mm-f35-macro | minFocusDist | 10 → 9.5 |
| omsystem-12-200mm-f35-63 | length / diameter / mag | 100 / 78 / 0.46 → 99.7 / 77.5 / 0.23 (0.46 is the 35mm-equivalent) |
| omsystem-300mm-f4-is-pro | maxMagnification | 0.48 → 0.24 (same) |
| omsystem-150-600mm-f5-63-is | maxMagnification | 0.7 → 0.35 (same) |

Not cited: 17mm f/1.2 PRO, 45mm f/1.8 and 14-42mm III (their pages carry no spec table), and the discontinued 25mm f/1.8 (no product page).

Open: 40-150mm f/4 PRO, where the page says 19 elements / 9 groups. The stored 15 is kept; this looks like a page error and needs a second source.

## Open questions (not changed)

- **Battery card variant.** Panasonic bodies with CFexpress/XQD plus SD list two CIPA sets. The stored values mixed the two (S1R II and S1IIE used SD; S1 II, S1 and S1R used CFexpress/XQD). I made them all SD, the card every body takes. Switch to CFexpress if preferred.
- **S5 II / S5 IIX IBIS 6.5.** Panasonic quotes 5.0 B.I.S. / 6.5 Dual I.S. 2 elsewhere, but the JP page gives no figure, so I left it. It is probably the same issue as the S9.
- **sigma-16-28mm-f28-dg weatherSealed true.** The Sigma page says nothing about weather resistance. Under the rule, silence means false, but I held it because the page may simply be thin.
- **sd Quattro / sd Quattro H.** Sigma gives weight only without battery and card (stored as is). The page has no burst rate and no weather-resistance claim, so I kept the stored values.
- **sd Quattro sensorMP 19.6 / 25.5.** Sigma's "effective pixels" are 29.5 / 38.6 MP (Foveon, counting all layers); the stored figure is the top layer. Foveon convention: owner's call.
- **sd Quattro H evfMag 0.74.** Derived from 0.96× × (26.7 / 36) ≈ 0.71. Held because it is derived, not quoted.

## Unverifiable / unsourced

- Panasonic S9, S1H, GH6, GH5 II, GH5, G97, G9, GX9, G95: the JP page has no battery figure, so `batteryLife` stays on the single row.
- Panasonic video resolution and log fields were not re-checked in this batch.
