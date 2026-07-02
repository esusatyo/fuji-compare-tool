# Sony E / FE — Third-Party Lens Enumeration (Group 1)

> Scope: **third-party** native-AF E/FE lenses (Sigma, Tamron, Samyang, Viltrox)
> + notable manual/specialty (Zeiss, Voigtländer, Laowa) + representative budget
> (TTArtisan, 7Artisans, Meike). First-party Sony lenses already in `data.js`.
> APS-C lenses use `focalLengthEquiv` = 1.5× crop. Prices/specs verified ≥2
> sources **at entry**. `X-mount` / other-mount column is a **cross-mount note
> only** (which mounts share the optical design) — it has no effect on the stored
> Sony entry (denormalized, see design D1). Tables below are the enumeration
> skeleton to be completed and checked off during implementation.

## Sigma — DC DN (APS-C)
| name | slug | focal | aperture | year | also on mounts | in-scope |
|------|------|-------|----------|------|----------------|----------|
| 16mm F1.4 DC DN | sigma-16mm-f14 | 16 | 1.4 | 2017 | X, Z, RF-S, MFT | ✅ |
| 18mm F1.4 DC DN | sigma-18mm-f14 | 18 | 1.4 | 2023 | X, Z, RF-S | ✅ |
| 23mm F1.4 DC DN | sigma-23mm-f14 | 23 | 1.4 | 2023 | X, Z, RF-S | ✅ |
| 30mm F1.4 DC DN | sigma-30mm-f14 | 30 | 1.4 | 2016 | X, Z, RF-S, MFT, L | ✅ |
| 56mm F1.4 DC DN | sigma-56mm-f14 | 56 | 1.4 | 2018 | X, Z, RF-S, MFT, L | ✅ |
| 10-18mm F2.8 DC DN | sigma-10-18mm-f28 | 10-18 | 2.8 | 2023 | X, Z, RF-S, L | ✅ |
| 18-50mm F2.8 DC DN | sigma-18-50mm-f28 | 18-50 | 2.8 | 2021 | X, Z, RF-S, L | ✅ |

## Sigma — DG DN (full-frame) Contemporary + Art
> Contemporary (I-series + telephoto) and Art. Also on L-mount natively; several
> now on Nikon Z / Canon RF too. Enumerate: 17/4, 20/2, 24/2, 24/3.5, 35/2,
> 45/2.8, 50/2, 65/2, 90/2.8, 500/5.6 (Contemporary); 20/1.4, 24/1.4, 35/1.2,
> 35/1.4, 50/1.2, 50/1.4, 85/1.4, 105/2.8 macro, 135/1.8 (Art); zooms 16-28/2.8,
> 24-70/2.8 II, 28-45/1.8, 28-70/2.8, 70-200/2.8, 100-400, 60-600, 150-600.
| name | slug | focal | aperture | line | year | in-scope |
|------|------|-------|----------|------|------|----------|
| _to be enumerated_ | | | | | | |

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
