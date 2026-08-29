# Canon RF third-party lens candidate ledger (round 2)

One row per candidate, filled during research before any data entry. Rejected
candidates stay in the table with a reason so a later pass doesn't
re-research them. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/research/lenses.md`
for round 1's ledger (34 rows including TTArtisan/7Artisans dimension tables)
— don't duplicate its confirmed facts, only its still-open items.

| slug | name | maker | line | type | year | disc | src1 (tier 1) | src2 (tier) | notes / conflicts |
|---|---|---|---|---|---|---|---|---|---|

## 7Artisans deferred batch (2026-08-29) — no new lenses entered

**Re-pulled the current catalogue.** `7artisans.store/products.json?limit=250`
(121 products total, single page) filtered to genuine Canon RF-capable mount
tokens (`Canon RF`, `Canon RF-S`, `Canon EOS-R`, `Canon EOS-RF`, `Canon R`,
`EOS-R mount` — explicitly excluding `Canon EOS-M`, which is the discontinued
EF-M mount and not RF) yields **30 RF-capable products**, of which:
- 3 are already entered (`7artisans-9mm-f56`, `7artisans-10mm-f28-ii`,
  `7artisans-35mm-f14-iii`)
- ~13 are cine/T-stop lenses (title contains "Cine" or a T-stop aperture like
  T1.5/T1.05/T2.0/T2.1/T2.9) — **out of scope** per the skill's boundary
- 1 is an accessory (PL lens adapter kit) — not a lens, excluded
- **14 are non-cine MF primes not yet entered** (the actual candidate pool,
  smaller than round 1's ~39-remaining estimate because that count included
  the cine lenses this pass explicitly excludes):

  6mm f/2.0 APS-C fisheye · 12mm f/2.8 Mark II APS-C · 14mm f/2.8 full-frame ·
  75mm f/1.4 full-frame · original 10mm f/2.8 fisheye (full-frame, pre-Mark-II) ·
  original 35mm f/1.4 APS-C (pre-Mark-III) · 25mm f/0.95 APS-C ·
  50mm f/0.95 APS-C · 60mm f/2.8 full-frame 2X ultra-macro ·
  60mm f/2.8 Mark II APS-C macro · 55mm f/1.4 Mark II APS-C ·
  50mm f/1.05 full-frame · 35mm f/5.6 full-frame · 35mm f/0.95 APS-C ·
  7.5mm f/2.8 Mark II APS-C fisheye

**The `.store` unlock (confirmed real, but narrower than hoped).** Round 1's
premise was right for a minority of the catalogue: `7artisans.store` product
pages *can* render a `Φ<diameter>mm` / `<length>mm` dimension diagram plus a
plain-text spec grid (Focal length/Frame/Weight/Aperture blade/Filter
size/Closest Focus/Optical structure/etc.) below the marketing images —
confirmed by re-reading the **already-entered** `7artisans-9mm-f56` product
page (`9mm-f-5-6-full-frame-wide-angle-lens-for-e-l-r-z`), whose diagram reads
**Φ70mm × 86mm** — an exact match to the entered `diameter:70, length:86`.
This proves the technique is real and was the actual source for the existing
3 entries.

**But it does not generalise to the rest of the catalogue.** Checked 5 of the
14 remaining candidates for the same template:

| candidate | spec grid present? | dimension diagram present? | outcome |
|---|---|---|---|
| 35mm f/0.95 APS-C (`35mm-0-95`) | full grid (weight 369g, 11/8, 12 blades, Φ52mm filter, MFD 0.37m, f/0.95-16, 43.9° AOV) | page ends at footer, no diagram | **no length/diameter — deferred** |
| 50mm f/1.05 full-frame (`50mm-f1-05`) | older template (mount-compat chart only, no numeric grid) | none | **deferred, minimal specs available** |
| 55mm f/1.4 Mark II APS-C | older template | none | **deferred** |
| 60mm f/2.8 full-frame 2X ultra-macro (`60mm-f-2-8-full-frame-2x-ultra-macro-lens-for-e-rf-z`) | partial — marketing copy states weight "≈550g", shown mounted on a Canon EOS R body | no diagram section on this page | **deferred — weight sourced, no length/diameter** |
| 14mm f/2.8 full-frame (new release, on sale $209.30 from $299 RRP) | full grid: F2.8-F22, Φ77mm filter, 13 elements/9 groups, 116° AOV, 10 blades, **weight ≈504g marked "(E)" — Sony E only, not confirmed for RF**, manual focus, metal body | "Product Parameters" heading present but the rounded-corner canvas/video element beneath it never renders — confirmed blank via 6s wait, re-navigate, and a `zoom` capture of the exact region (solid near-black, no content at any resolution) | **deferred — likely a broken/unloaded video component on 7artisans.store, not a lazy-load timing issue** |

**Conclusion for this pass:** the browser-automation unlock is confirmed to
still work (validated the existing 3 entries' provenance), but of the 5
untried candidates checked, **0 had both a length and a diameter available**.
The 35mm f/0.95 page has everything except the diagram; the 14mm f/2.8 page
has the diagram *section* but its content element renders empty; the other
three pages simply don't ship the richer template at all. This is a
**narrower version of round 1's same blocker** ("no published dimensions"),
not a new one — the technique that worked for the 3 already-entered lenses
does not reliably extend to the rest of the catalogue as currently built.

**All 14 remaining candidates are deferred, none entered.** No lens was added
to `canon/data.js` in this batch — see `PROGRESS.md` for the per-candidate
status and what a future pass should try next (Amazon/AliExpress box-dimension
corroboration, or re-checking the 14mm f/2.8 page after 7Artisans' storefront
possibly fixes the broken diagram component).
