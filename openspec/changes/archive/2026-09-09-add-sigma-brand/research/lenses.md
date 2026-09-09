# Research — Sigma first-party lens enumeration (L-Mount only)

Source of truth: the live catalogue on
[sigma-global.com/en/lenses](https://www.sigma-global.com/en/lenses/), read
2026-09-06. That page lists **46 current mirrorless lenses** across Art (17),
Contemporary (23) and Sports (6).

Two caveats that shape the task breakdown:

- **The catalogue is mount-agnostic.** It does not say which lenses ship in
  L-Mount. Most `DG` (full-frame mirrorless) lenses are L + E; the `DC` (APS-C)
  ones vary and several are E/X only. **Every lens below needs its L-Mount
  availability confirmed on its own product page before entry.**
- **Sigma dropped the `DN` suffix** in its newer naming (`35mm F1.4 DG II`,
  `300–600mm F4 DG OS`). Older entries in our data use the full `DG DN` name.
  Keep each entry's `name` as the maker currently writes it; don't retro-rename
  the ported ones.

---

## A. Already in `panasonic/data.js` — port verbatim (22)

Same mount, same physical product, so specs/`asin`/`imageUrl`/`productUrl`
carry over (design §5). They flip from third-party to first-party.

**Art (9):** `sigma-20mm-f14-dg`, `sigma-24mm-f14-dg`, `sigma-35mm-f14-dg`,
`sigma-35mm-f14-dg-ii`, `sigma-50mm-f14-dg`, `sigma-85mm-f14-dg`,
`sigma-135mm-f14-dg`, `sigma-24-70mm-f28-dg-ii`, `sigma-28-45mm-f18-dg`

**Contemporary (11):** `sigma-17mm-f4-dg`, `sigma-20mm-f2-dg`,
`sigma-24mm-f2-dg`, `sigma-35mm-f2-dg`, `sigma-45mm-f28-dg`,
`sigma-50mm-f2-dg`, `sigma-65mm-f2-dg`, `sigma-90mm-f28-dg`,
`sigma-16-28mm-f28-dg`, `sigma-28-70mm-f28-dg`, `sigma-100-400mm-f5-63-dg`

**Sports (2):** `sigma-70-200mm-f28-dg`, `sigma-150-600mm-f5-63-dg`

> **Verify on port, don't trust.** Cross-check each of the 22 against the live
> catalogue. This repo has twice shipped fabricated third-party entries
> (a Nikon Tamron 11-20mm, the Panasonic Voigtländer L-Mount pair), and a port
> is exactly where such an entry would get laundered into first-party data. A
> lens that is no longer in the catalogue is a discontinuation to record, not a
> silent drop.
>
> All 22 are currently `priceIncomplete: true` with USD only — see design §5 for
> the `--recompute` path to fill regional prices.

---

## B. New full-frame `DG` — ALL 13 CONFIRMED L-MOUNT (2026-09-07)

Every one ships in L-Mount + Sony E only. Figures below are the **L-Mount**
column of each lens's own sigma-global.com spec table (authoritative per
CLAUDE.md). Product URL = `https://www.sigma-global.com/en/lenses/<slug>/`.

| # | Name | sigma slug | line | type | year | wt g | len mm | dia mm | filter | el/gr | blades | MFD cm | mag | minAp | AF | sealed | OIS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 14mm F1.4 DG Art | `a023_14_14_re` | Art | Prime | 2023 | 1170 | 149.9 | 101.4 | — | 19/15 | 11 | 30 | 1:11.9 | F16 | HLA | yes | no |
| 2 | 15mm F1.4 DG DN Diagonal Fisheye Art | `a024_15_14` | Art | Prime | 2024 | 1360 | 157.9 | 104.0 | — | 21/15 | 11 | 38.5 | 1:16 | F16 | HLA | yes | no |
| 3 | 35mm F1.2 DG II Art | `a025_35_12` | Art | Prime | 2025 | 755 | 111.4 | 81.0 | 72 | 17/13 | 11 | 28 | 1:5.3 | F16 | Dual HLA | yes | no |
| 4 | 50mm F1.2 DG DN Art | `a024_50_12` | Art | Prime | 2024 | 745 | 108.8 | 81.0 | 72 | 17/12 | 13 | 40 | 1:6.2 | F16 | Dual HLA | yes | no |
| 5 | 105mm F2.8 DG DN Macro Art | `a020_105_28` | Art | Prime | 2020 | 715 | 133.6 | 74.0 | 62 | 17/12 | 9 | 29.5 | 1:1 | F22 | HSM | yes | no |
| 6 | 14-24mm F2.8 DG DN Art | `a019_14_24_28` | Art | Zoom | 2019 | 795 | 131.0 | 85.0 | — | 18/13 | 11 | 28 | 1:7.3 | F22 | Stepping | yes | no |
| 7 | 28-105mm F2.8 DG DN Art | `a024_28_105_28` | Art | Zoom | 2024 | 995 | 157.9 | 87.8 | 82 | 18/13 | 12 | 40 | 1:3.1 | F22 | HLA | yes | no |
| 8 | 24mm F3.5 DG Contemporary | `c021_24_35_re` | Contemporary | Prime | 2021 | 225 | 48.8 | 64.0 | 55 | 10/8 | 7 | 10.8 | 1:2 | F22 | Stepping | ⚠ | no |
| 9 | 20-200mm F3.5-6.3 DG Contemporary | `c025_20_200_35_63` | Contemporary | Zoom | 2025 | 550 | 115.5 | 77.2 | 72 | 18/14 | 9 | 16.5 | 1:2 | F22-40 | HLA | yes | no |
| 10 | 200mm F2 DG OS Sports | `s025_200_2` | Sports | Prime | 2025 | 1820 | 201.0 | 118.9 | 105 | 19/14 | 11 | 170 | 1:7.6 | F22 | HLA | yes | 6.5 |
| 11 | 500mm F5.6 DG DN OS Sports | `s024_500_56` | Sports | Prime | 2024 | 1370 | 234.6 | 107.6 | 95 | 20/14 | 11 | 320 | 1:6 | F32 | HLA | yes | 5.0 |
| 12 | 60-600mm F4.5-6.3 DG DN OS Sports | `s023_60_600_45_63` | Sports | Zoom | 2023 | 2495 | 279.2 | 119.4 | 105 | 27/19 | 9 | 45 | 1:2.4 | F22 | HLA | yes | 7.0 |
| 13 | 300-600mm F4 DG OS Sports | `s025_300_600_4` | Sports | Zoom | 2025 | 3985 | 467.9 | 167.0 | 40.5 rear | 28/21 | 13 | 280 | 1:6 | F22 | HLA | yes | 5.5 |

**Open items to settle at entry time:**

- **⚠ #8 (24mm F3.5)** — the page did not state weather sealing. The I-series
  Contemporary primes have a dust/splash-resistant *mount*; match whatever the
  sibling I-series entries already in `panasonic/data.js` use, don't guess.
- **#2 and #7 both report length 157.9mm.** Plausible but a suspicious
  coincidence; re-read both spec tables before entry.
- **#13 filter "40.5mm rear drop-in"** is not a front filter thread. Decide
  whether `filterThread` means front thread (then `null`) — putting 40.5 in a
  column next to 95mm fronts would misread as "takes cheap small filters".
- **`minAperture` for variable-aperture zooms** (#9 F22-40, #12 F22-32): follow
  whatever the existing `sigma-100-400mm-f5-63-dg` / `sigma-150-600mm-f5-63-dg`
  entries do.
- **USD prices are not on sigma-global.com** and MUST be sourced separately
  before entry — a positive USD price is required by the schema. Do not guess.

## C. APS-C `DC` (10) — OUT OF SCOPE (deferred 2026-09-07)

**Skipped for this change.** No Sigma body is APS-C L-Mount, so these would only
serve a Leica CL/TL owner. Deferred rather than rejected — kept here so a future
change doesn't have to re-derive the list. Their L-Mount availability was never
confirmed.

| Line | Lens |
|---|---|
| Art | 17–40mm F1.8 DC |
| Contemporary | 12mm F1.4 DC |
| Contemporary | 15mm F1.4 DC |
| Contemporary | 16mm F1.4 DC DN |
| Contemporary | 23mm F1.4 DC DN |
| Contemporary | 30mm F1.4 DC DN |
| Contemporary | 56mm F1.4 DC DN |
| Contemporary | 10–18mm F2.8 DC DN |
| Contemporary | 16–300mm F3.5–6.7 DC OS |
| Contemporary | 18–50mm F2.8 DC DN |

If this group is ever picked up:

- The 16 / 30 / 56mm f/1.4 DC DN trio already exists in `panasonic/data.js` as
  **MFT** entries (`sigma-16mm-f14-mft` etc.). An L-Mount copy would be a
  **separate entry with a distinct slug** (e.g. `sigma-16mm-f14-dc`) — same
  optical design, different mount, different weight/price. Do not reuse the MFT
  slugs.
- They would need a **1.5× crop** for `focalLengthEquiv` (Leica L APS-C), and
  CLAUDE.md's crop table would need an L-Mount row.

## D. Discontinued predecessors — enumerate at entry time

The catalogue only shows current products. Superseded L-Mount versions still
belong in the dataset as `discontinued: true` entries (the "lens revisions
coexist" rule — a II never overwrites its predecessor). Known/likely:

- 24–70mm F2.8 DG DN Art (original, superseded by II — the II is already ported)
- 35mm F1.4 DG DN Art is already carried alongside the II ✓
- Check for others: 100–400mm, 14–24mm, and the early I-series revisions.

---

## Working estimate

| Group | Count |
|---|---|
| A — ported from Panasonic | 22 |
| B — new full-frame DG | ~14 |
| C — APS-C DC | **0 (deferred)** |
| D — discontinued predecessors | ~3–6 |
| **Total** | **~39–42** |

## Sources

- [SIGMA — Our Lenses (full current catalogue)](https://www.sigma-global.com/en/lenses/our-lenses/)
- [SIGMA lens index](https://www.sigma-global.com/en/lenses/)
- [All L-mount lenses in 2026 — the complete list](https://lesdeuxpiedsdehors.com/en/lenses-for-l-mount/) (403s to automated fetch; open manually)
- [SIGMA nomenclature: acronyms explained — Adorama](https://www.adorama.com/alc/sigma-nomenclature-acronyms)
