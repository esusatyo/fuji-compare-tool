# Canon first-party RF lineup — gap enumeration (2026-08-05)

## Method

Dataset side: `loadBrand('canon').data.LENSES` filtered to
`manufacturer === 'Canon'` → **34 lenses**.

Upstream side: the lineup tables inside the Wikipedia article
**`Canon RF lens mount`**, pulled via the MediaWiki API
(`action=parse&prop=wikitext`) and name-normalised for comparison.

⚠️ **Do not use `Category:Canon RF lenses` for enumeration** — it contains only
2 members (`Canon RF 70–200mm lens`, `Canon RF lens mount`) and looks like a
complete category while being nothing of the sort. The article's own tables are
the usable source. Cross-check against canon.co.jp / canon.com.au lens listings
before entry; Wikipedia is an enumeration aid, **not** a spec source.

Upstream total after de-noising the wikitext: **~55 Canon-branded RF/RF-S
lenses**. Coverage: **34/55 ≈ 62%**.

## Missing — 21 lenses

### Super-telephoto L primes (4)
| lens | note |
|---|---|
| RF 400mm f/2.8 L IS USM | |
| RF 600mm f/4 L IS USM | |
| RF 800mm f/5.6 L IS USM | |
| RF 1200mm f/8 L IS USM | |

### Other primes (5)
| lens | note |
|---|---|
| RF 600mm f/11 IS STM | **direct sibling of the RF 800mm f/11 already present** — the most conspicuous single omission |
| RF 24mm f/1.4 L VCM | the 14mm and 20mm VCMs are present; this one isn't |
| RF 35mm f/1.4 L VCM | |
| RF 50mm f/1.4 L VCM | |
| RF 85mm f/1.2 L USM DS | confirm DS is a distinct SKU, not a finish option, before entering |

### Specialty / VR fisheyes (3)
| lens | note |
|---|---|
| RF 5.2mm f/2.8 L Dual Fisheye | stereoscopic pair — `focalLengthEquiv` convention needs a decision |
| RF-S 3.9mm f/3.5 Dual Fisheye | naive 1.6× crop would be misleading here |
| RF-S 7.8mm f/4 Dual STM VR | |

### Zooms (9)
| lens | note |
|---|---|
| RF 10-20mm f/4 L IS STM | |
| RF 15-30mm f/4.5-6.3 IS STM | |
| RF 28-70mm f/2 L USM | flagship constant-f/2 standard zoom |
| RF 28-70mm f/2.8 IS STM | distinct from the f/2 L above |
| RF 24-105mm f/2.8 L IS USM Z | distinct from the f/4 L already present |
| RF 24-240mm f/4-6.3 IS USM | |
| RF 70-200mm f/2.8 L IS USM **Z** | distinct SKU from the non-Z already present |
| RF 100-300mm f/2.8 L IS USM | |
| RF 200-800mm f/6.3-9 IS USM | |

## Suspected naming error on an existing entry

The dataset has **`RF 85mm f/1.4 L IS USM`**. Canon's product appears to be the
**`RF 85mm f/1.4 L VCM`** — VCM (voice coil motor), matching the 14/20/24/35/50mm
VCM family, not IS USM. Verify against Canon directly and correct the name plus
any spec that shifted with it (VCM and IS USM bodies differ in weight and length,
so this is not a cosmetic fix).

## Existing entries needing completion

`priceIncomplete: true`, i.e. USD-only (9): `rf-14mm-f14-l-vcm`,
`rf-20mm-f14-l-vcm`, `rf-45mm-f12-stm`, `rf-85mm-f14-l-vcm`,
`rf-20-50mm-f4-l-is-usm-pz`, `rf-7-14mm-f28-35-l-fisheye-stm`,
`rf-16-28mm-f28-is-stm`, `rf-75-300mm-f4-56`, `rfs-14-30mm-f4-63-is-stm-pz`.

Missing `productUrl` (3): `rf-45mm-f12-stm`, `rf-20-50mm-f4-l-is-usm-pz`,
`rf-16-28mm-f28-is-stm`.

## Why this went unnoticed

`refresh-camera-data` searches for **newly released** gear. Nothing in any skill
asks whether the *existing* lineup is fully represented, so a lens that was never
entered stays invisible forever — it is not new, so no refresh surfaces it. Task
7.1 adds that cross-check. Task 8.4 measures the same gap on the other four
brands, which have never been checked either.
