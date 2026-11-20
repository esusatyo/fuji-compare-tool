# Data methodology: how specs are researched and which number is stored

This is the **single source of truth** for how camera and lens specs are sourced,
normalised and verified. It is also the raw material for a public methodology page,
so it records *why* each rule exists, who decided it and when, and the cases that
shaped it. Keep everything: when a rule changes, mark the old one superseded and keep
it in the log at the bottom rather than deleting it.

Skills that gather data (`verify-specs`, `add-thirdparty-lenses`, `add-camera-brand`,
`refresh-camera-data`) restate the parts they need, but this file wins on any
conflict. Update this file **first**, then the skills.

Per-run evidence (every value read, every rejected value) lives in the ledgers under
`docs/spec-verification/`. Each item's own evidence is in its `specSources` citations
in `<brand>/data.js` (URL, tier, date, and a note saying what was read or changed).

---

## 1. Sources and how much we trust them

| Tier | What | Can it set a spec? |
|---|---|---|
| **T1** | The maker's own spec page **for this mount**, an official regional site (canon.co.uk, personal.canon.jp, panasonic.jp, jp.omsystem.com, laowa.com.au, fujifilm-x.com/<region>), or the maker's spec PDF / press release / owner's manual | Yes, alone |
| **T2** | Independent measurement: LensTip, Opticallimits, DPReview, ephotozine, Dustin Abbott, admiringlight | Only when T1 is missing, ambiguous, lumps mounts together, or looks physically wrong |
| T3 | Retailers | Never for specs (one shared distributor feed); prices only |
| T4 | Aggregator databases (lensfinder.org etc.) | Never. lensfinder matched T1 numbers exactly but had ~30% of mount attributions wrong |
| — | Rumour sites, AI summaries, Wikipedia, **another brand file in this repo** | Never. Copied errors between brand files are exactly what verification hunts |

Rules that follow from this:

- **T1 wins** when sources still disagree after normalising (section 2). Both values
  go in the ledger with a one-line reason. Never average.
- **Two T1 pages from the same maker can disagree.** Then neither is applied
  blindly: look for a third maker source (another regional site, the PDF, the
  manual). Example (2026-11-18): Canon UK lists "Dust/Moisture Resistance: Yes"
  for the budget RF 75-300 and "Weather-resistant construction" for the EOS R8;
  Canon Japan claims neither, so both are stored as not sealed. For the RF 16-28
  f/2.8 IS STM, Canon Japan *also* claims dust- and drip-resistance, so it stays
  sealed.
- **Combined spec tables** (one row for "Sony E / Nikon Z / RF / L") usually print
  one mount's figures. Weight and length genuinely differ by mount (L-Mount barrels
  run ~2 mm shorter than E). Use the per-mount tab, or T2. Exception, accepted by
  the owner: Laowa (venuslens.net) and SG-image publish one figure for all mounts,
  and that figure is used.
- A 403 or Access Denied is a bot block, not evidence. Try the browser, then another
  regional site, then T2.
- Nothing found after reasonable effort → **unverifiable**: the stored value is left
  alone and listed. Never "verify" from memory.
- **Revisions are separate items** ("II", "Mark II", redesigns). Never correct one
  model's specs to its successor's.

## 2. Which number we store (normalisation conventions)

Makers quote the same quantity in different ways. These rules pick one, so that
values compare fairly across brands.

### Lenses

| Field | Stored as | Decided |
|---|---|---|
| `weight` | grams, bare lens: no hood, caps, tripod collar or foot | original convention; OM 40-150 f/2.8 PRO 880 → 760 (880 included the removable foot) |
| `length` | mm, mount flange to front tip, zoom at its shortest, **without hood** | original convention (see open item on APO-Summicron-M 35, section 5) |
| `diameter` | maximum barrel diameter, not the filter thread | original |
| `filterThread` | front thread in mm; `null` if none | original |
| `minFocusDist` | cm from the focal plane; zooms: the shortest across the range | original |
| `minFocusDist` when the maker gives **autofocus and manual-focus** figures | the **autofocus** figure | **owner, 2026-11-18**. Reason: it is the distance most buyers will actually focus at; MF-only close focus is a special case. First applied to Canon RF 15-30, RF-S 10-18, RF-S 18-45, RF-S 18-150 |
| `maxMagnification` | decimal (1:2 → 0.5); zooms: the maximum across the range; **AF figure** when AF and MF are both given (follows the rule above) | original; AF part 2026-11-18 |
| `maxAperture` | f-number at the wide end; never a T-stop | original |
| `minAperture` on variable-aperture zooms | the **wide-end** minimum (Canon "22 (24mm) / 36 (240mm)" → 22) | **owner, 2026-11-18**. Reason: matches how `maxAperture` is read (wide end). First applied to Canon RF 15-30, RF 24-105 STM, RF 24-240, RF 100-500, RF 200-800, RF-S 18-150, RF-S 55-210 |
| `minAperture` on fixed-aperture lenses | equals `maxAperture` | 2026-11-18: SG-image 50mm f/1.8 has no iris (spec card: "Aperture Ring: Fixed Aperture", drop-in shaped plates), so 1.8 / 1.8 is correct, not an error |
| `elements` / `groups` | maker's optical construction | original. Where the maker's own page contradicts an older stored count, the maker page wins (owner, 2026-11-18: OM 40-150 f/4 PRO 15 → 19) |
| `focalLengthEquiv` | native × crop: X / Sony APS-C / Nikon DX / Leica TL 1.5, Canon RF-S 1.6, MFT 2.0, full frame 1.0; dual-fisheye VR lenses take no crop | original |
| `year` | first shipping year **in this mount** | original |
| `afType` | the maker's own motor name | original |
| `weatherSealed` | see "Weather sealing" below | |

### Cameras

| Field | Stored as | Decided |
|---|---|---|
| `weight` | grams **with battery and card** | original. Where a page gives body-only, the with-battery figure from the maker for the identical body is used (owner, 2026-11-18: OM-3 ASTRO 413 → 496, same body as the OM-3) |
| `width` × `height` × `depth` | maker's headline figures (Sony: headline depth, not grip-to-monitor) | original |
| `sensorMP` | effective megapixels | original |
| `sensorMP` on **Foveon** (Sigma sd Quattro) | the **top-layer** figure (19.6 / 25.5), not Sigma's all-layer "effective" 29.5 / 38.6 | **owner, 2026-11-18**. Reason: the top layer sets the output resolution; the all-layer count is not comparable with Bayer sensors |
| `lcdDots` | thousands of dots (1840) | original; Leica stored raw dots until 2026-11-17 (fixed) |
| `evfDots` | millions of dots (3.69) | original; same Leica fix |
| `evfMag` | **35mm-equivalent** magnification. Divide a native figure by the crop (APS-C 1.5, RF-S 1.6, APS-H 1.35 (26.7/36), MFT 2.0) | original; sd Quattro H 0.74 → 0.71 (0.96 × 26.7/36), owner 2026-11-18 |
| `evfMag` on **hybrid optical/electronic finders** (Fujifilm X100 / X-Pro) | the **optical finder** figure (X100VI 0.52, not the EVF's 0.66) | **owner, 2026-11-18**. Reason: the optical finder is the defining mode of these bodies, and it is the figure Fujifilm lists first |
| `ibisStops` | the **body-only** figure, not the figure with a stabilised lens (Sync IS, Dual I.S. 2) | **owner, 2026-11-18** (first applied to Panasonic S9 on 2026-11-16). Reason: comparable across bodies whatever lens is mounted. Applied: OM-3, OM-3 ASTRO, OM-5, OM-5 II 7.5 → 6.5; E-M1 III, E-M1 III ASTRO, E-M1X 7.5 → 7.0; E-M5 III 6.5 → 5.5; Panasonic S5 II / S5 IIX 6.5 → 5.0 |
| `batteryLife` (single figure) | CIPA shots. Fujifilm: the **Normal**-mode figure, not Economy | owner, 2026-11-14 |
| battery split | `batteryLifeLcd` (screen) + `batteryLifeEvf` (viewfinder) when the maker publishes both; `batteryLife` = the screen figure (schema-enforced). Never derive one from the other | owner, 2026-11-15 |
| battery on **hybrid finders** | split into `batteryLifeEvf` + `batteryLifeOvf`; Fujifilm gives no screen-only figure, so `batteryLifeLcd` is `null` and `batteryLife` = the EVF figure (schema-enforced). Engine shows an "Optical VF" row | **owner, 2026-11-18**. Applied: X100VI 310/450, X100V 350/420, X100F 270/390, X-Pro3 370/440, X-Pro2 250/350 (EVF/OVF). Older X100 / X100S / X100T / X-Pro1 have no maker page yet |
| battery, **Nikon** | the **Energy-saving OFF** figure | owner, confirmed 2026-11-18. Z R 370 → 350 |
| battery, **Panasonic** with CFexpress/XQD + SD | the **SD-card** CIPA set | owner, confirmed 2026-11-18 |
| burst split | `maxBurstMech` = top mechanical rate; `maxBurstElec` = top electronic rate *including* crop modes; `maxBurstElecCrop` = that rate's crop; `maxBurst` = the faster (schema-enforced) | owner, 2026-11-14 |
| burst: electronic first curtain | counts as **mechanical** (it uses the mechanical rear curtain) | owner, 2026-11-15 |
| burst, **Nikon** | the low-resolution high-speed frame capture modes (C30 / C60 / C120) are **excluded** from `maxBurstElec` | owner, confirmed 2026-11-18. Reason: they are reduced-resolution JPEG modes, closer to video frame grabs |
| burst when the maker lists only some rates | store what the maker lists; a widely quoted figure that no maker source contains is not used (owner, 2026-11-18: Leica Q2 / Q2 Monochrom 20 → 10, Leica lists 10/5/3 fps) | |

### Weather sealing (cameras and lenses)

`weatherSealed: true` **only** when the maker claims dust/splash/moisture
resistance for this product. Then:

- Maker silence = `false` (owner, 2026-11-18: Sigma 16-28 f/2.8 DG DN → false).
- A rear mount gasket alone = `false`; Sigma's "mount with dust and splash resistant
  structure" is a gasket only.
- Sealing that needs an accessory (adapter ring + filter on X100VI / GFX100RF) =
  `false` (owner, 2026-11-14).
- A review calling a body "robust" is not a claim.
- Conflicting maker pages: see section 1 (Canon UK vs Canon Japan).

## 3. The verification process

1. Resolve the scope with `.claude/skills/verify-specs/scope.js` (brand, lens maker,
   mount or items), in batches of about 15.
2. Read each item's T1 source and write a ledger row per field **while reading**:
   stored value, source value, normalised value, verdict, source.
3. Verdicts: **ok**, **MISMATCH**, **rounding** (≤1 g / ≤0.5 mm: counted, never
   changed), **convention?** (stored value follows a different but consistent rule:
   a question for the owner), **unsourced**, **unverifiable**.
4. Before calling a convention mismatch, check how two or three sibling entries in
   the same brand are stored.
5. Report before editing. Clear-cut T1 mismatches are applied (owner standing rule);
   judgment calls wait for the owner.
6. Every item read gets a `specSources` citation (URL, tier, date, title, note), even
   when nothing changed. A changed value's note says old → new and why.
7. Values **rejected** are recorded too (in the ledger and the item's note), so the
   next pass does not "correct" a right number to a wrong one. Examples: Leica's
   own web pages copied figures between lenses (Summicron-M 35 diameter 30.7 is the
   Elmarit-M 28's length; APO-Summicron-M 50 scale 1:17.4).
8. The same lens in several brand files (same mount) must agree; a test enforces it,
   so a fix is mirrored to every copy.
9. A decision the owner made on the evidence available is **re-raised** if a new T1
   source contradicts it (2026-11-18: the RF 16-28 was going to revert to "not
   sealed" until Canon Japan confirmed the sealing).
10. `dataVerified` in `site-config.js` is never bumped by a verification batch.
11. `npm test` must pass; `npm run test:links` runs whenever a URL changes. It
    sweeps every product, image and citation URL. Since 2026-11-18 any error
    status that persists after a retry fails, not just 404/410, because Leica
    serves deleted PDFs as 502 and ~30 dead citations had passed silently.

## 4. Where each maker's specs live

The working recipes (URL patterns, which row to read, bot blocks and workarounds)
are in `.claude/skills/verify-specs/SKILL.md` → "Per-brand source recipes". Notable:

- Canon Europe (canon.co.uk / canon.ie) started returning Access Denied on
  2026-11-18 even in a browser; **Canon Japan** (`personal.canon.jp/product/camera/rf/<code>/spec`)
  has the full table, including AF/MF figures and per-focal-length apertures.
- OM System's Japanese spec sheets are screenshot PDFs read with OCR.
- Panasonic's full tables are only on panasonic.jp.
- Fujifilm's regional sites all serve the same table; global is canonical.

## 5. Open questions (waiting on the owner)

- **E-M5 II High Res Shot** label ("40MP handheld" vs "40MP tripod"): to be re-asked
  with more detail.
- **Canon second-source items**: RF-S 55-210 length (Canon UK 135, Canon Japan 92.9,
  stored 89.8) and RF-S 18-150 diameter (Canon UK and Canon Japan both 69, stored 74.4).
- **T2 second sources** for makers whose specs are images only (Viltrox, 7Artisans,
  Meike, Yongnuo) or blocked (Zeiss).
- **Owner's manuals** as T1 for old bodies with no maker web page (10 Fujifilm,
  10 Olympus).
- **APO-Summicron-M 35 length**: stored 49.3 per Leica's live page (owner,
  2026-11-18). The now-dead datasheet gave 40.9 and an earlier note read the 8.4 mm
  difference as the screw-on hood; if a Leica source confirms that, the no-hood
  convention means 40.9.
- **EOS R8 Mark II** sealing is stored `true`; Canon Japan makes no claim for it either.

## 6. Decision log (append only)

| Date | Decision | By | Trigger |
|---|---|---|---|
| 2026-11-14 | Fujifilm battery = Normal mode | owner | verify-specs Fujifilm |
| 2026-11-14 | Sealing that needs an accessory = not sealed | owner | X100VI, GFX100RF |
| 2026-11-14 | Burst split into mechanical / electronic (with crop) | owner | Fujifilm mixed conventions |
| 2026-11-15 | Electronic first curtain counts as mechanical | owner | Canon, Sony |
| 2026-11-15 | Battery split screen / viewfinder where both are published | owner | Canon, Sony, Nikon, Panasonic |
| 2026-11-16 | Panasonic IBIS = body (B.I.S.) figure; S9 6.5 → 5.0 | verify-specs, owner later confirmed | S9 |
| 2026-11-18 | Zoom `minAperture` = wide end | owner | Canon zooms stored tele end |
| 2026-11-18 | Close focus / magnification = AF figure when AF and MF differ | owner | Canon RF-S zooms |
| 2026-11-18 | Nikon battery = Energy-saving OFF | owner (confirmed) | Nikon run |
| 2026-11-18 | Nikon burst excludes C30/C60/C120 | owner (confirmed) | Nikon run |
| 2026-11-18 | Panasonic battery = SD-card set | owner (confirmed) | Panasonic run |
| 2026-11-18 | Hybrid finders: battery split EVF + OVF (`batteryLifeOvf`) | owner | X100F, X-Pro2 |
| 2026-11-18 | Hybrid finders: `evfMag` = optical figure | owner | X100VI |
| 2026-11-18 | Foveon `sensorMP` = top layer | owner | sd Quattro |
| 2026-11-18 | IBIS = body-only, never Sync IS / Dual I.S. | owner | OM System, Panasonic S5 II |
| 2026-11-18 | Maker silence on sealing = not sealed (applied to Sigma 16-28) | owner | Sigma 16-28 |
| 2026-11-18 | Conflicting maker pages need a third maker source; Canon UK sealing field treated as unreliable | owner + Canon Japan evidence | RF 16-28, RF 75-300, EOS R8 |
| 2026-11-18 | A maker page beats an older stored figure even when it looks odd (OM 40-150 f/4 PRO 19 elements; Laowa 15mm f/2 Ø77.2) | owner | Panasonic / Olympus / Leica runs |
| 2026-11-18 | `test:links` fails on any persistent error status, not only 404/410 | owner asked for citation URLs to be checked | dead Leica PDFs (502) |
