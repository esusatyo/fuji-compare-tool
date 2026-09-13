# Research — current M.Zuiko lens catalogue (task 1.2)

Sourced live 2026-09-12 from explore.omsystem.com's PRO category page, the
general M.Zuiko catalogue page, and the "all lenses" listing (cross-checked:
the all-lenses total of 29 items = 27 unique lenses + 2 teleconverters,
matching the union of every page fetched — confidence this is complete).

**Total: 28 current M.Zuiko lenses** (16 PRO + 12 non-PRO), of which **11
already exist** in `panasonic/data.js` and port over, leaving **17 genuinely
new** to source in task 5.

Two accessories are explicitly **excluded, not lenses**: the MC-14 (1.4×) and
MC-20 (2×) teleconverters. No brand in this dataset models teleconverters as
`LENSES` entries (they have no independent focal length or maximum aperture
in the schema's sense) — consistent, not a new exception.

## This resolves the prior audit's PRO-count discrepancy (see tasks.md 1.2)

The August 2026 audit said "6 of 12 current PRO lenses present, 8 missing" —
6 + 8 = 14 ≠ 12, an internal contradiction. The real total is **16 PRO
lenses**, not 12. The audit's 8-item *missing list* was actually fully
correct; only its denominator was wrong. Live research also surfaced 2 more
PRO lenses the audit missed entirely (20mm F1.4 PRO, and the older/faster
40-150mm F2.8 PRO, which coexists with the newer, smaller 40-150mm F4.0 PRO
as a genuinely separate current product).

## PRO line — 16 total, 6 ported, 10 new

| Lens | Status |
|---|---|
| 17mm F1.2 PRO | ported (`omsystem-17mm-f12-pro`) |
| 25mm F1.2 PRO | ported (`omsystem-25mm-f12-pro`) |
| 45mm F1.2 PRO | ported (`omsystem-45mm-f12-pro`) |
| 12-40mm F2.8 PRO II | ported (`omsystem-12-40mm-f28-pro`) |
| 40-150mm F4.0 PRO | ported (`omsystem-40-150mm-f4-pro`) |
| 12-100mm F4.0 IS PRO | ported (`omsystem-12-100mm-f4-pro`) |
| **7-14mm F2.8 PRO** | new |
| **8mm F1.8 Fisheye PRO** | new |
| **8-25mm F4.0 PRO** | new |
| **12-45mm F4.0 PRO** | new |
| **20mm F1.4 PRO** | new (missed by the prior audit entirely) |
| **40-150mm F2.8 PRO** | new — the older, faster, larger sibling of the
  already-ported 40-150mm F4.0 PRO; both are current, separate products (also
  missed by the prior audit) |
| **90mm F3.5 Macro IS PRO** | new |
| **300mm F4.0 IS PRO** | new |
| **50-200mm F2.8 IS PRO** | new |
| **150-400mm F4.5 TC1.25X IS PRO** | new — flagship super-tele, $8,599.99 |

## Non-PRO (Premium / standard / macro / superzoom) — 12 total, 5 ported, 7 new

| Lens | Status |
|---|---|
| 17mm F1.8 II | ported (`omsystem-17mm-f18`) |
| 60mm F2.8 Macro | ported (`omsystem-60mm-f28-macro`) |
| 100-400mm F5.0-6.3 IS II | ported (`omsystem-100-400mm-f5-63-ii`) |
| 25mm F1.8 → **25mm F1.8 II** | ported as `omsystem-25mm-f18`, but this is
  the open redesign question from the prior audit, now **doubly confirmed**:
  the US store lists only the II (156g vs the stored 136g — a real mechanical
  change). Resolve in task 1.5/5.1 per the coexisting-revisions convention:
  new `omsystem-25mm-f18-ii` entry, original flipped to `discontinued: true`. |
| 45mm F1.8 | ported (`omsystem-45mm-f18`) — **not discontinued**, despite
  being absent from the "all-lenses" catalogue grid across all pages fetched.
  Both colorway product pages (`m-zuiko-45mm-f1-8-black`/`-silver`) are live
  on explore.omsystem.com. Treat the grid absence as a scrape/rendering gap,
  not a business signal — **re-confirm directly at entry time** (task 5)
  rather than trusting either signal alone. |
| **30mm F3.5 Macro** | new — a macro prime not previously known/ported |
| **14-42mm F3.5-5.6 III** | new — the kit zoom bundled with the new PEN body |
| **9-18mm F4.0-5.6 II** | new — wide zoom |
| **14-150mm F4.0-5.6 II** | new — travel superzoom |
| **75-300mm F4.8-6.7 II** | new — telephoto zoom |
| **12-200mm F3.5-6.3** | new — superzoom |
| **150-600mm F5.0-6.3 IS** | new — super-telephoto zoom, genuinely
  surprising find (didn't expect a first-party 600mm-equivalent reach lens) |

## What this means for task 5 (lens data entry)

17 new lenses to fully source (T1 specs from explore.omsystem.com, following
the same pattern already used for the 11 ported entries — dimension diagrams,
barrel text, official spec tables) plus the 25mm II redecision. That's a
larger new-research lens batch than the design doc's original "~30 current
catalogue" implied as mostly-ported — worth flagging plainly rather than
letting the batch run long silently.
