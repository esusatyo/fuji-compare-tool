## Why

Three brands on the site span two physically incompatible lens mounts — Fujifilm (X / G), Panasonic (L-Mount / Micro Four Thirds) and Sigma (L-Mount / SA-Mount) — but their pages present one flat list. A Panasonic shopper comparing L-Mount bodies scrolls past twelve Micro Four Thirds cameras to reach them, and the lens picker offers 46 MFT lenses that will never mount on the camera in the slot beside it. The mount is currently visible only as prose inside dropdown group labels (`── Sigma (MFT) ──`), so neither the UI nor the tests can act on it.

## What Changes

- Every camera and every lens, in **all six brands**, gains a `mount` field (`'x'`, `'g'`, `'l'`, `'mft'`, `'sa'`, `'rf'`, `'z'`, `'e'`). This **reverses the documented "no `mount` field" decision** in CLAUDE.md, which assumed one brand meant one mount. The field is unconditional so the schema rule, the research-skill instruction and any future per-item filter all have one thing to rely on.
- `BRAND_CONFIG` gains a `mounts` array — the ordered list of mounts the brand spans, each `{ id, label, short }`. Single-mount brands declare a one-entry array and show no filter.
- `BRAND_CONFIG.mount` is **kept** as the hand-written landing-tile display label, sitting alongside `mounts[]`. Deriving it was considered and rejected: it is visible copy, and two brands deliberately advertise only their headline mount (Fujifilm's tile reads `X-Mount`, not `X-Mount / G-Mount`; Sigma's reads `L-Mount`, not `L-Mount / SA-Mount`). Generated output stays byte-identical.
- The engine renders a filter chip row above the comparison table — `Mount: All · L-Mount · Micro Four Thirds` — on both the Cameras and Lenses tabs, restricting the slot dropdowns to the chosen mount.
- Selecting a mount auto-swaps any slot holding an out-of-mount item, so the visible table never contradicts the active chip. `All` continues to allow deliberate cross-mount comparisons.
- A mount earns a chip in a mode when it has **at least one** item in that mode. Honouring that requires the engine to render a **single-slot table**, which it cannot do today (`MIN_SLOTS = 2`): slot count clamps to the number of items the active filter yields, and winner highlighting is suppressed at one slot.
- Fixed-lens bodies (X100VI, GFX100RF, Lumix L10, X Half) are assigned to the mount of the lineup they belong to, not excluded — a shopper browsing "the X system" expects the X100VI in that list.
- Panasonic's `── Lumix Box (cinema / live event) ──` dropdown group splits in two: BS1H is L-Mount, BGH1 is MFT, and it is the only group on the site that straddles a mount boundary.
- The research skills (`add-camera-brand`, `add-thirdparty-lenses`, `refresh-camera-data`) instruct that every new camera or lens records its mount at entry time.
- New Tier 1 tests: every item declares a mount declared by its brand; every dropdown group's members agree on their mount; camera mounts agree with what `sensorType` implies.

Deliberately **not** in this change:

- The Full-frame / APS-C facet for Canon, Nikon and Sony. Their APS-C lenses (RF-S / DX / E) share one mount with the full-frame ones and physically fit those bodies, cropping rather than failing — so they are correctly `mount: 'rf' | 'z' | 'e'` here. That facet ships as a separate change adding a separate `format` field, reusing this change's chip row.
- URL-hash or `localStorage` persistence of the active chip. The filter resets to `All` on load; the selected slugs already travel in the hash, so a shared link still reproduces the table it was copied from.
- The cross-brand `compare/` page, whose synthesized config declares a single mount list and so shows no chip row.

## Capabilities

### New Capabilities
- `mount-filter`: the `mount` data field, the `BRAND_CONFIG.mounts` declaration, the chip-row UI, the auto-swap selection rule, and single-slot rendering.

### Modified Capabilities
- `brand-engine`: the `BRAND_CONFIG` contract gains a required `mounts` array beside the existing `mount` display string, and the engine must render identically for brands declaring one mount.

## Impact

- **Data** — all six `<brand>/data.js`: a `mount` token on 137 cameras and 673 lenses, a `mounts` array per brand, and one dropdown-group split in Panasonic. Script-seeded, not hand-typed.
- **Engine** — `engine.js`: chip-row markup in `injectBody()`, a mount filter in `buildSelectHTML()`, the auto-swap rule, single-slot support in `getNumSlots()` / `renderTable()` / `computeWinners()`, and a new event listener. `engine.css`: chip styling plus a one-column grid case, reusing the existing `.mode-toggle` button idiom.
- **Generator** — untouched. `BRAND_CONFIG.mount` keeps feeding the landing tiles unchanged.
- **Tests** — new `tests/data/mounts.test.js`; `tests/helpers/schema.js` gains `mount` validation; `tests/data/config.test.js` gains a `mounts` array check beside the existing `mount` string check; Tier 2 jsdom tests for filtering, auto-swap and single-slot rendering.
- **Docs** — CLAUDE.md's "no `mount` field" paragraph rewritten; the three research skills updated to record the mount.
- **Unaffected** — generated page content; the URL hash grammar; `compare/`'s behaviour.
