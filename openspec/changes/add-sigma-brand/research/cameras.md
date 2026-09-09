# Research — Sigma camera enumeration

Scope: **every mirrorless and fixed-lens digital camera Sigma has released** —
18 bodies. Sigma's six SA-mount **DSLRs are deliberately excluded**; see
"Excluded" below.

Years below are from the enumeration pass and are good enough to plan against;
each is re-verified against ≥2 sources at entry time per the skill's golden
rules. Slugs are proposed — none contains `:` (reserved by `/compare/`).

## L-Mount mirrorless — Bayer sensor (current)

| slug | name | series | year | disc. | notes |
|---|---|---|---|---|---|
| `bf` | Sigma BF | BF | 2025 | no | 24.6MP FF, 230GB internal SSD, **no card slot**, electronic shutter only, 6K + L-Log, USD 1,999 |
| `fp-l` | Sigma fp L | fp Series | 2021 | no | 61MP FF, electronic shutter only |
| `fp` | Sigma fp | fp Series | 2019 | no | 24.6MP FF, "world's smallest full-frame"; modular/cinema-leaning |

> **Resolved 2026-09-07:** the `fp` was raised under the standing "ask first"
> rule for BS1H/BGH1-class bodies (no EVF, sold heavily as a rig component) and
> is **in**, entered as a normal body.

## Foveon mirrorless — SA mount

Mirrorless bodies (no mirror, EVF), so they meet the site's body-type
precedent — they merely use the SA mount inherited from the DSLR line. No
lens on the lens tab fits them.

| slug | name | series | year | disc. |
|---|---|---|---|---|
| `sd-quattro-h` | Sigma sd Quattro H | sd Quattro | 2016 | yes |
| `sd-quattro` | Sigma sd Quattro | sd Quattro | 2016 | yes |

## Foveon fixed-lens compacts — Quattro

Precedent for fixed-lens bodies already exists (Fujifilm X100 series / X Half,
plus one Panasonic body all use `lensType: 'Fixed'`).

| slug | name | series | year | disc. | fixed lens |
|---|---|---|---|---|---|
| `dp0-quattro` | Sigma dp0 Quattro | dp Quattro | 2015 | yes | 14mm f/4 (21mm equiv) |
| `dp3-quattro` | Sigma dp3 Quattro | dp Quattro | 2014 | yes | 50mm f/2.8 (75mm equiv) |
| `dp2-quattro` | Sigma dp2 Quattro | dp Quattro | 2014 | yes | 30mm f/2.8 (45mm equiv) |
| `dp1-quattro` | Sigma dp1 Quattro | dp Quattro | 2014 | yes | 19mm f/2.8 (28mm equiv) |

## Foveon fixed-lens compacts — Merrill

| slug | name | series | year | disc. | fixed lens |
|---|---|---|---|---|---|
| `dp3-merrill` | Sigma DP3 Merrill | Merrill | 2013 | yes | 50mm f/2.8 (75mm equiv) |
| `dp2-merrill` | Sigma DP2 Merrill | Merrill | 2012 | yes | 30mm f/2.8 (45mm equiv) |
| `dp1-merrill` | Sigma DP1 Merrill | Merrill | 2012 | yes | 19mm f/2.8 (28mm equiv) |

## Foveon fixed-lens compacts — original DP line

| slug | name | series | year | disc. | ⚠ |
|---|---|---|---|---|---|
| `dp2x` | Sigma DP2x | DP Compact | 2011 | yes | |
| `dp2s` | Sigma DP2s | DP Compact | 2010 | yes | |
| `dp1x` | Sigma DP1x | DP Compact | 2010 | yes | |
| `dp2` | Sigma DP2 | DP Compact | 2009 | yes | below year floor |
| `dp1s` | Sigma DP1s | DP Compact | 2009 | yes | below year floor |
| `dp1` | Sigma DP1 | DP Compact | 2008 | yes | below year floor |

---

## Excluded — the six SA-mount DSLRs

`sd9` (2002) · `sd10` (2003) · `sd14` (2007) · `sd15` (2010) · `sd1` (2011) ·
`sd1-merrill` (2012)

**Why.** Every brand on the site starts at the beginning of its *mirrorless*
system, not the company's camera history — Canon 2018 (RF), Nikon 2018 (Z),
Sony 2013 (E-mount full-frame, excluding even the 2010–12 NEX bodies),
Panasonic 2017, Fujifilm 2011 (X). Across all 152 existing cameras `lensType`
only ever takes `'Interchangeable'` or `'Fixed'`; there is not one DSLR on the
site. Adding six would make Sigma the sole exception.

Two supporting reasons: the DSLR era is where sourcing is weakest (Wikipedia
gives SD14 as 2008 and SD1 as 2010, other sources 2007 and 2011 —
announce-vs-ship confusion), and it is where the Foveon megapixel ambiguity
bites hardest (the SD9 writes a 3.43MP file but was marketed as "10.2MP").

Sigma's first digital camera was indeed the SD9 — announced 18 Feb 2002, on
sale 21 Oct 2002 at USD 1,800 — so the *company's* digital line does start in
2002. This dataset starts in 2008 with the DP1 because that is where Sigma's
non-DSLR line starts.

## Blockers and data notes

1. **Three bodies fall below the camera `year` floor** of `2010`: DP1 (2008),
   DP2 (2009), DP1s (2009). Resolved by lowering the floor to `2008`, which
   simply matches the lens floor already in `schema.js` — see design §2.
2. **Foveon megapixels** need the output-resolution convention from design §3.
   Expect to dig for true file dimensions rather than the marketing figure,
   especially for Quattro (unequal 1:1:4 layer split).
3. **No video on the early DP compacts.** `maxVideoRes` is a required string —
   use `'None'`. `logVideo: false`, `ibis: false`, `subjectDetection: null`.
4. **Viewfinders.** `evfType` is nullable: the `sd Quattro` pair take their EVF
   spec; `fp`/`fp L`/`BF` and every `dp`/`DP` compact take `null` (no finder —
   the early DP line offered only an optional clip-on optical finder).
5. **Pricing.** All 15 discontinued bodies may ship USD-only per the schema's
   discontinued rule — no `priceIncomplete` needed. Only `BF`, `fp L` and `fp`
   need all seven currencies.
6. **Images.** Wikimedia Commons has good coverage of the older Foveon bodies
   (several have their own Wikipedia articles). Use
   `scripts/fetch-images-commons.js sigma cameras` without `--apply` first.

## Sources

- [Sigma Corporation — Wikipedia](https://en.wikipedia.org/wiki/Sigma_Corporation)
- [Sigma fp — Wikipedia](https://en.wikipedia.org/wiki/Sigma_fp)
- [Sigma dp0 Quattro — Wikipedia](https://en.wikipedia.org/wiki/Sigma_dp0_Quattro)
- [Sigma DP1/DP2/DP3 Merrill — Wikipedia](https://en.wikipedia.org/wiki/Sigma_DP1_Merrill)
- [Sigma SD9 review — DPReview](https://www.dpreview.com/reviews/sigmasd9/) (SD9 dates/pricing, Foveon output resolution)
- [The Sigma BF is a 'Radically Simple' 24.6MP Full Frame Compact Camera — PetaPixel](https://petapixel.com/2025/02/23/the-sigma-bf-is-a-radically-simple-24-6mp-full-frame-compact-camera/)
- [Sigma BF — 6K, L-Log & unibody structure — Newsshooter](https://www.newsshooter.com/2025/02/23/sigma-bf-6k-l-log-unibody-structure/)
- [Sigma is finally making progress with its full-frame Foveon sensor — PetaPixel](https://petapixel.com/2026/03/11/sigma-is-finally-making-progress-with-its-full-frame-foveon-sensor/)
