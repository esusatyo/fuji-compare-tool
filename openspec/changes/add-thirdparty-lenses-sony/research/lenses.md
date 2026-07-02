# Sony E / FE — Third-Party Lens Enumeration (Group 1)

> **FINAL COVERAGE (implemented): 59 lenses across 10 makers** — Sigma 23, Tamron 8,
> Viltrox 6, Samyang 5, Voigtländer 3, Laowa 3, Zeiss 4, TTArtisan 1, 7Artisans 1, Meike 1.
> All specs source-verified (manufacturer pages / reputable specs); Sigma images
> live-checked. Sony total lenses 69 → 117. Remaining long-tail (optional): more
> Viltrox Air/f1.4 II, Samyang 24/45 + zooms, 7Artisans, more TTArtisan/Meike,
> Zeiss Touit APS-C, Tamron 70-300/90-macro/18-300, Sigma 17/4·45/2.8·50/2·500/5.6.


> Scope: **third-party** native-AF E/FE lenses (Sigma, Tamron, Samyang, Viltrox)
> + notable manual/specialty (Zeiss, Voigtländer, Laowa) + representative budget
> (TTArtisan, 7Artisans, Meike). First-party Sony lenses already in `data.js`.
> APS-C lenses use `focalLengthEquiv` = 1.5× crop. Prices/specs verified ≥2
> sources **at entry**. `X-mount` / other-mount column is a **cross-mount note
> only** (which mounts share the optical design) — it has no effect on the stored
> Sony entry (denormalized, see design D1). Tables below are the enumeration
> skeleton to be completed and checked off during implementation.

## Sigma — DC DN (APS-C)  [ENTERED ✅ — Sony E specs from Sigma official pages]
> Sony APS-C crop = 1.5×. Weights are Sony E-mount values (verified). Note the
> 18mm f/1.4 DC DN is NOT made in Sony E (it's X/Z/RF-S only) → excluded here.
| name | slug | E weight | E length | USD | year | done |
|------|------|----------|----------|-----|------|------|
| 16mm F1.4 DC DN | sigma-16mm-f14 | 405g | 92.3 | $449 | 2017 | ✅ (asin) |
| 23mm F1.4 DC DN | sigma-23mm-f14 | 330g | 78.9 | $549 | 2023 | ✅ |
| 30mm F1.4 DC DN | sigma-30mm-f14 | 265g | 73.3 | $339 | 2016 | ✅ |
| 56mm F1.4 DC DN | sigma-56mm-f14 | 280g | 59.5 | $479 | 2018 | ✅ (asin) |
| 10-18mm F2.8 DC DN | sigma-10-18mm-f28 | 255g | 64.0 | $659 | 2023 | ✅ |
| 18-50mm F2.8 DC DN | sigma-18-50mm-f28 | 290g | 76.5 | $549 | 2021 | ✅ |

## Sigma — DG DN (full-frame) Contemporary + Art
> Art f/1.4 primes ENTERED ✅ (specs from Sigma official Sony-E spec pages, all
> link-checked live). Remaining Contemporary + zooms NEXT.
| name | slug | weight | filter | USD | year | done |
|------|------|--------|--------|-----|------|------|
| 24mm F1.4 DG DN Art | sigma-24mm-f14-dg | 510g | 72 | $799 | 2022 | ✅ |
| 35mm F1.4 DG DN Art | sigma-35mm-f14-dg | 640g | 67 | $799 | 2021 | ✅ |
| 50mm F1.4 DG DN Art | sigma-50mm-f14-dg | 660g | 72 | $849 | 2023 | ✅ |
| 85mm F1.4 DG DN Art | sigma-85mm-f14-dg | 625g | 77 | $1199 | 2020 | ✅ |
| 20mm F1.4 DG DN Art | | | | | | NEXT |
| Contemporary 17/4, 20/2, 24/2, 35/2, 45/2.8, 50/2, 65/2, 90/2.8, 500/5.6 | | | | | | NEXT |
| Zooms 16-28/2.8, 24-70/2.8 II, 28-45/1.8, 28-70/2.8, 70-200/2.8, 100-400, 60-600, 150-600 | | | | | | NEXT |

> Sigma URL scheme confirmed: `sigma-global.com/en/lenses/a<YY>_<focal>_<ap>/`
> and image `/lenses/a<YY>_<focal>_<ap>_product_img01.png` (both 200 OK).

## Tamron — Di III (APS-C + full-frame)
> APS-C: 11-20/2.8, 17-70/2.8, 18-300. FF zooms: 20-40/2.8, 28-75/2.8 G2,
> 35-150/2-2.8, 50-300, 70-180/2.8 G2, 70-300, 150-500, 17-28/2.8, 50-400.
> FF primes: 20/2.8, 24/2.8, 35/2.8, 90/2.8 macro. (Some also on Nikon Z / RF.)
| name | slug | focal | aperture | year | in-scope |
|------|------|-------|----------|------|----------|
| _to be enumerated_ | | | | | |

## Samyang / Rokinon — AF
> 12/2 (APS-C), 18/2.8, 24/1.8, 24/2.8, 35/1.8, 35/2.8, 45/1.8, 75/1.8, 85/1.4 II,
> 135/1.8, 14/2.8; zooms 24-70/2.8, 35-150 (verify). `manufacturer: 'Samyang'`.
| name | slug | focal | aperture | year | in-scope |
|------|------|-------|----------|------|----------|
| _to be enumerated_ | | | | | |

## Viltrox — AF + LAB / Pro / Air
> APS-C: 13/1.4, 23/1.4, 27/1.2, 33/1.4, 56/1.4; Air 25/1.7, 35/1.7, 40/2.5,
> 56/1.7. FF: 16/1.8 FE, 20/2.8, 24/1.8, 28/4.5, 35/1.8, 50/1.8, 85/1.8 II,
> 135/1.8 LAB. (Most also on X / Z; some on RF.)
| name | slug | focal | aperture | line | year | in-scope |
|------|------|-------|----------|------|------|----------|
| _to be enumerated_ | | | | | |

## Zeiss — Batis / Loxia / Touit (mostly discontinued)
> Batis (AF FF): 18/2.8, 25/2, 40/2 CF, 85/1.8, 135/2.8. Loxia (MF FF): 21/2.8,
> 25/2.4, 35/2, 50/2, 85/2.4. Touit (AF APS-C, also X): 12/2.8, 32/1.8, 50/2.8.
> Flag `discontinued: true`; USD-only pricing acceptable; ASIN→search fallback.
| name | slug | focal | aperture | line | discontinued | in-scope |
|------|------|-------|----------|------|--------------|----------|
| _to be enumerated_ | | | | | | |

## Voigtländer & Laowa (manual / specialty)
> Voigtländer: Nokton 21/1.4, 35/1.2, 40/1.2, 50/1.2; APO-Lanthar 35/2, 50/2,
> 65/2 macro, 110/2.5. Laowa: 9/5.6, 10/4, 12/2.8, 15/2 FE, 15/4 macro,
> 25/2.8 macro, 33/0.95 (APS-C), 58/2.8, 65/2.8 macro, 90/2.8 macro, 100/2.8.
| name | slug | maker | focal | aperture | in-scope |
|------|------|-------|-------|----------|----------|
| _to be enumerated_ | | | | | |

## TTArtisan / 7Artisans / Meike (representative)
> TTArtisan AF: 27/2.8, 35/1.8, 40/2.8 macro, 50/2, 56/1.8, 75/2 (+ notable MF).
> 7Artisans AF: 27/2.8, 35/1.8, 50/1.8, 85/1.8. Meike AF: 25/1.8, 35/1.4,
> 50/1.8, 85/1.8. Group under `── Other ──`.
| name | slug | maker | focal | aperture | in-scope |
|------|------|-------|-------|----------|----------|
| _to be enumerated_ | | | | | |

## Sources (fill per lens at entry — ≥2 each)
- Manufacturer: sigma-global.com / tamron.com / samyanglensglobal.com /
  viltrox.com / zeiss.com / voigtlaender.de / venuslens.net (Laowa) / product pages
- Specs cross-check: DPReview, manufacturer spec sheet, B&H, Adorama
- ASIN: Amazon (plain product listing; exclude bundle/Renewed/International)
