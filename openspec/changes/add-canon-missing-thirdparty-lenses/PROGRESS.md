# Progress — Canon missing third-party lenses + price consistency

**Resume at:** 3.1/3.2 Samyang (owner decision pending), then 4.1
**Branch:** csr-continue → origin canon-sony-lens-refresh (PR #78)
**Baseline 2026-10-22:** 39 third-party Canon lenses — Sigma 11, TTArtisan 12,
Laowa 5, Tamron 3, 7Artisans 3, Samyang 2, Yongnuo 2 (discontinued), Viltrox 1
(discontinued).

## Catalogue diff (2026-10-22)

Store catalogues read on 2026-10-21 (Shopify `products.json`, Laowa's Woo Store
API) and filtered to RF / EOS-R variants; EOS-M variants are EF-M, a different
mount, and are excluded.

| Maker | RF in catalogue, not in data | Notes |
|---|---|---|
| Laowa | ~30 | ACRIS 35, Aksen 45 / 17.5, 4.5-10 fisheye, 17 TS, 35 TS, 180 macro, 12 Lite, 8-15 fisheye, 15 f/4.5 macro, 55 TS, 100 TS, 15 Cookie, 12-24 shift, 10 f/2.8, 8-16, Argus 28 / 33 / 35 / 45, 12-24, 20 shift, 85 f/5.6, 15 shift, 14 RL, 11 RL, 65 2x, 4mm, 9mm, 25 2.5-5x (+ Argus 25 on laowa.com.au). Out: cine, probes, kits, MSC, Aurogon, 12mm f/2.8 Zero-D (DSLR-era) |
| 7Artisans | ~12 | 6 f/2, 14 f/2.8, 75 f/1.4, 60 f/2.8 2X, 35 f/1.4 APS-C, 25 f/0.95, 50 f/0.95, 10 f/2.8 fisheye (I), 60 f/2.8 II, 35 f/5.6, 35 f/0.95, 7.5 f/2.8 II |
| TTArtisan | ~8 | APS-C 35 f/0.95, APS-C 25 f/2, 50 f/2, 11 f/2.8 fisheye, 90 f/1.25, APS-C 40 macro, APS-C 7.5 f/2, 21 f/1.5, Tilt-Shift 100 f/2.8 |
| Voigtländer | 3 | Nokton 50 f/1, 40 f/1.2, 75 f/1.5 (RF versions) |
| Thypoch | 2 | Simera 28 f/1.4, Simera 35 f/1.4 |
| Samyang | 1 | MF 85mm f/1.4 RF |
| Meike | ? | none on meikeglobal.com for RF; MF RF primes reported at retailers |
| Yongnuo | 4 leads | from August: 23 f/1.4 APS-C, 35 f/1.8 DA, 50 f/1.8, 85 f/1.8R II (no specs then) |
| SG-image, Viltrox | 0 | SG-image sells EF-M, not RF; Viltrox's RF AF lenses were withdrawn |

**2.1 done 2026-10-22 (29 Laowa RF lenses):** Nikon entries cloned (Laowa publishes one spec table across its mirrorless mounts and every lens has a Canon RF variation on its store and a B&H Canon RF listing). RF-specific figures: 12-24mm f/5.6 length 91.6mm (Laowa gives R/M/E/Z lengths), 85mm f/5.6 310g (Laowa + B&H RF), 180mm macro is manual focus on RF (522g / 134.4mm from B&H RF, f/32 min), 12mm Lite and 10mm f/2.8 are manual focus on RF (12mm Lite 480g). APS-C designs (4.5-10, 8-16, 12-24 Shift CF, Argus 25/33, 65mm, 4mm, 9mm) use the 1.6x RF-S crop. Photos reused from the Sony entries (Panasonic L for the 180mm); the 5 lenses gapped on the other brands are gapped here too. The existing 5 Laowa lenses moved out of "Other" into a new Laowa group; "Other" is now "Yongnuo".

**2.2 done 2026-10-22 (5 Voigtländer RF lenses):** Cosina's whole RF list (Nokton 40 f/1.2, 50 f/1, 75 f/1.5, Nokton Classic 35 f/1.4, Portrait Heliar 75 f/1.8) from the RF-mount EN pages (RF housings differ from the other mounts); release years from the JP pages (発売日); USD = B&H regular for the RF listing (50mm and 75mm on sale at the time). Product shot = the "-01"/"web01" image (P00 is a sample photo), checked visually.

**2.3 done 2026-10-22 (3 TTArtisan RF lenses + 1 Fujifilm fix):** 7.5mm f/2 fisheye, 40mm f/2.8 macro, 11mm f/2.8 fisheye - the only RF candidates with a B&H Canon RF listing giving size and weight; shared optics cloned from sony/ (11mm from panasonic/ L, same B&H size). USD = store RF variant (no compare-at). The 7.5mm size diagram (all mounts 57mm long x 72mm wide) showed **fujifilm/ttartisan-7-5mm-f2-fisheye had length and diameter transposed** (72/57) - fixed.

**2.4 done 2026-10-22 (6 7Artisans RF lenses):** 14mm f/2.8, 75mm f/1.4, 60mm f/2.8 2X macro, 10mm f/2.8 fisheye (Mark I), 60mm f/2.8 II macro (B&H Canon RF listings: size/weight equal the Sony entries) and 6mm f/2 fisheye (7Artisans gives one size for all mounts incl. R). **USD = B&H RF price**, not the store: 7Artisans shows a compare-at and a permanent "sale" on most lenses (14mm $299 / $179.40, B&H $209; 75mm $189 / $141.75, B&H $151). The Sony/Nikon/L copies of these lenses still carry the store compare-at - task 3.

**2.5 done 2026-10-22 (Thypoch 1 + Samyang 1):** Thypoch Simera 28mm f/1.4 RF (thypoch.com RF column: 68.6mm, 353g; USD = B&H RF regular $549, as on Fujifilm) and Samyang MF 85mm F1.4 RF (Samyang US RF spec table: 730g, 98.7 x 78mm, weather sealed; announced 2019-02-28 with the 14mm RF; USD = B&H Rokinon RF regular $329 - the Samyang store's $399 compare-at and $318.02 "sale" are not used).

**2.7 done 2026-10-22:** Sigma - B&H lists exactly the 11 RF lenses already entered (all APS-C; no full-frame RF Sigma exists). Viltrox - no RF lens on its store or at B&H (EF-M only). Tamron - **new release found: 16-50mm F2.8 A (B091)**, announced 2026-10-14; Canon RF and Sony E ship 2026-10-29, Nikon Z 2026-11-19, Fujifilm X 2026-12-17 (Tamron spec page, per-mount columns). Added to canon/ (RF: 69.2 x 77.6mm, 305g, US $549 Tamron Americas). Sony/Nikon/Fujifilm versions are NOT added here (outside this pass) - follow-up.

**3.3 done 2026-10-22:** nikon z-58mm-f0-95-s-noct afType Manual Focus -> Manual (the only lens of 1,300+ not using "Manual"; the spec table shows it in the AF Motor Type row).

## Batches

| Batch | Added | Skipped | Commit |
|---|---|---|---|
| 2.1 Laowa | 29 | 2 | (this commit) |
| 2.2 Voigtländer | 5 | 0 | (this commit) |
| 2.3 TTArtisan | 3 | 6 | (this commit) |
| 2.4 7Artisans | 6 | 7 | (this commit) |
| 2.5 Thypoch + Samyang | 2 | 1 | (this commit) |
| 2.6 Meike + Yongnuo | 0 | 4 | (this commit) |
| 2.7 Sigma / Tamron / Viltrox | 1 | 0 | (this commit) |

## Price consistency

47 compare-at entries (sony 23, fujifilm 22, canon 2): samyangus.com 37,
viltrox.com 5, 7artisans.store 2, meikeglobal.com 2, ttartisan.store 1.
Sale/compare-at ratio at read time 0.39 (7Artisans 25 f/0.95, fujifilm) to
0.94 (Meike 25 f/1.8, fujifilm).

The first scan's regex missed differently worded notes; the widened scan
(`compare-at` + `on sale at`, store sources only) finds **103 entries**:
Samyang 59, 7Artisans 26, Thypoch 6, Meike 5, Viltrox 5, TTArtisan 2.

**Rule applied:** USD = B&H's regular price for that mount (its strikethrough
price if it shows one, else its listed price), the same rule the owner's
Fujifilm Simera 28 ($549) and Leica Thypoch decisions follow. Where B&H has no
listing for a mount, the store's selling price is used only when B&H's price
for the same lens in another mount shows the compare-at is not a real price.

**Applied 2026-10-22 (31 entries, non-Samyang):**
- 7Artisans 22: 14mm f/2.8 299 -> 209 (E/Z/L x2), 18mm f/5.6 89 -> 62 (E/Z/L x2),
  25mm f/0.95 369 -> 143 (E; X from the store's $143.40, = B&H E), 50mm f/0.95 X
  236 -> 149, 55mm f/1.4 X 109 -> 49 (store price, no dealer listing), 60mm 2X
  macro 335 -> 284 (E) / 285 (Z, B&H regular $284.75), 75mm f/1.4 189 -> 151
  (E/Z/L x2), 9mm f/5.6 479 -> 335 (E/Z/RF), Leica M 28mm f/1.4 459 -> 321.
  B&H shows no strikethrough on any of these; its prices sit at or near the
  store's "sale" prices, so 7Artisans' compare-at prices are not real prices.
- Meike 4: 25mm f/1.8 80 -> 74 (E, X), 35mm f/1.4 E 110 -> 99, 35mm f/1.7 E
  80 -> 79. Left: Fujifilm meike-50mm-f17-ff stays $130 (B&H's X listing says
  $180, above Meike's own $129.99 list and B&H's E price of $109 - looks like
  a stale listing).
- TTArtisan AF 56mm f/1.8 158 -> 129 (E, X).
- Viltrox X 33mm f/1.4 279 -> 239, 56mm f/1.4 299 -> 239, 85mm f/1.8 II
  399 -> 329. Viltrox 56mm f/1.2 Pro (X, E) stays $580 = B&H regular.
- Thypoch: no change - B&H's regular equals the stored $549 / $649 (Simera
  28/35 Z+E, Voyager 24-50 E).
- Regional prices recomputed only where they were ratio-derived from the old
  USD (fujifilm 7Artisans 25/50/55, Meike 25, Viltrox 85 II; canon 7Artisans
  9mm). The Viltrox 33/56 and TTArtisan 56 regional figures are not
  ratio-derived (local store prices) and were kept.
- `scripts/compute-prices.js` round99 gives GBP -1 below ~$56 USD (49 x 0.90
  -> -1); fujifilm 7Artisans 55mm GBP set to 49 by hand. Script not changed.

**Samyang (59): pending owner decision** - see the PR #78 follow-ups.

## Skipped (with reason)
- Laowa ACRIS 35mm f/2.8 RF (2.1): the RF version is manual focus and Laowa gives weight/size for E, Z and EF only; B&H RF listing (2004642) has no dimensions or weight. Same skip as the L-Mount pass.
- Laowa 15mm f/5 Cookie RF (2.1): Laowa gives E (35.2mm, 138g) and M (25mm, 104g) only; B&H RF listing (1861639) gives only box size and a 158g shipping weight.
- Laowa 12mm f/2.8 Zero-D, Aurogon 10-50X, probes, cine lenses, kits, MSC: out of scope (DSLR-era design per owner decision; microscope objective; cine/probe/bundle).
- TTArtisan APS-C 35mm f/0.95 and APS-C 25mm f/2 RF (2.3): no B&H Canon RF listing; TTArtisan gives weight only as a cross-mount range (247-267g, 166-189g) - same open owner question as on Nikon.
- TTArtisan 50mm f/2, 90mm f/1.25, 21mm f/1.5, Tilt-Shift 100mm f/2.8 RF (2.3): no RF dimensions from TTArtisan or B&H (same skips as Sony/Nikon).
- 7Artisans 35mm f/1.4 APS-C and 7.5mm f/2.8 II RF (2.4): B&H Canon RF listings give only the box size; no RF lens size from 7Artisans.
- 7Artisans 25mm f/0.95, 50mm f/0.95, 35mm f/0.95, 35mm f/5.6, 12mm f/2.8 II RF (2.4): no B&H Canon RF listing and no RF (or all-mount) size from 7Artisans.
- Thypoch Simera 35mm f/1.4 RF (2.5): Thypoch's spec table has an RF column (62.8mm, 310g), but the store sells only M / Z / E variants and B&H has no RF listing, so RF availability is unconfirmed.
- Meike (2.6): no RF still lens on meikeglobal.com or B&H (RF listings are cine lenses, adapters, extension tubes); retailer-only MF RF primes (masterfoto.lv, eBay) quote E-mount specs.
- Yongnuo YN 23mm f/1.4 APS-C, YN 35mm F1.8R DA DSM, YN 50mm F1.8 DSM R (2.6): yongnuo.eu still publishes no size/weight (50mm: 300g and 0.45m only); not at B&H.
- Yongnuo YN85mm F1.8R DF DSM II (2.6): yongnuo.eu gives full specs (381g, 67 x 88mm, 0.8m, 9/8, 7 blades) identical to the original YN85mm F1.8R already entered, and no US price anywhere (not at B&H) - same ambiguity as August.
