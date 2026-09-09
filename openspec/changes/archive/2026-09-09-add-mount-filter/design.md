## Context

Six brand pages share one engine. Three of them span two physically incompatible mounts:

| Brand | Mounts | Cameras | Lenses |
|---|---|---|---|
| Fujifilm | X-Mount / G-Mount (GFX) | 36 / 4 | 128 / 18 |
| Panasonic | L-Mount / Micro Four Thirds | 11 / 13 | 50 / 46 |
| Sigma | L-Mount / SA-Mount (Foveon) | 3 / 2 | 36 / 0 |

The other three span one mount each — Canon RF, Nikon Z, Sony E. Their APS-C lenses (RF-S, DX, E) are *the same mount* with a smaller image circle: they bolt onto the full-frame bodies and crop. That is a coverage distinction, and it is explicitly not what this change filters on.

Today the mount exists only as prose inside dropdown group labels. CLAUDE.md states the absence of a `mount` field is deliberate — "the brand file implies the mount" — which was true when the site was one brand, one mount. It stopped being true when Panasonic (L + MFT) and Fujifilm's GFX line landed, and the label prose has been carrying the distinction ever since.

Constraints that shape the design:

- **Zero dependencies, no build step.** Each `data.js` is a standalone browser script inside a registration IIFE; the engine is one shared file. Nothing can be computed at build time.
- **Every item already lives in exactly one dropdown group** — a Tier 1 referential test enforces it.
- **A follow-up change** will add a Full-frame / APS-C facet to Canon, Nikon and Sony. Whatever is built here must extend to it without rework.

## Goals / Non-Goals

**Goals:**

- A shopper on a multi-mount brand page can restrict both the camera and lens pickers to one mount in a single click, and the comparison table follows.
- The mount becomes machine-readable on every item in every brand, so tests can assert it and future per-item filters can read it.
- Brands declaring one mount render byte-identically to today.

**Non-Goals:**

- Full-frame / APS-C coverage filtering — a separate change adding a separate `format` field.
- Modelling adapter compatibility (Sigma MC-21 SA→L, third-party G→X adapters). The filter answers "what mounts natively", which is what a spec-comparison shopper is asking.
- Persisting the active chip in the URL or `localStorage`.
- Any change to generated page *content*.

## Decisions

### 1. A per-item `mount` field on every item in every brand

**Chosen:** all 137 cameras and 673 lenses carry `mount: '<id>'`, including the three single-mount brands where it is redundant today.

**Alternative considered — tagging the dropdown groups** (`{ label: '── Sigma (MFT) ──', mount: 'mft', ids: [...] }`) and deriving each item's mount from its group. That is ~20 edited lines per brand instead of ~810 item edits, and the "exactly one group" invariant makes the derivation total.

Rejected on two counts. First, it does not survive the follow-up: for Canon/Nikon/Sony the groups are *not* partitioned by format — Sony's `── Tamron ──` group holds the APS-C 11-20mm f/2.8 next to the full-frame 28-75mm G2, `── Cinema Line ──` holds the full-frame FX3 next to the APS-C FX30, and Nikon's `── Sigma ──` group mixes DC DN and DG DN. Group tagging would work now and be torn out later. Second, the owner intends further per-item lens filters, which a group-derived value cannot serve.

**Alternative considered — tagging only the three multi-mount brands** (347 entries). Rejected because it makes every downstream rule conditional: the schema check, the research-skill instruction, and any future consumer would each need "…if the brand declares more than one mount". Tagging everything costs 463 more mechanical tokens and buys an unconditional invariant: *every item declares its mount*.

The cost is a large mechanical diff. It is script-seeded (decision 6), and tests pin it so it cannot silently rot.

### 2. The field is `mount`, and the follow-up facet gets its own field

An RF-S lens genuinely is RF mount, so `mount: 'rf'` on a Canon APS-C lens is true, not a compromise. The Full-frame / APS-C distinction is a *different property* of the same lens and gets a separate `format` field in the follow-up change.

The alternative — one general `system` field holding `'rf'` / `'rf-s'` — was considered and rejected: it would put a false statement in the data file (RF-S is not a separate mount) to save adding a second field later. Two true fields beat one overloaded one, and the chip row is written generic over "which facet am I filtering", so the follow-up reuses the UI without touching it.

### 3. `BRAND_CONFIG.mounts` sits beside the `mount` display string

`mounts` is the structured list the filter reads: `{ id, label }` per mount, ordered as the chips render. `BRAND_CONFIG.mount` stays exactly as it is.

Deriving the display string from `mounts` was the original plan and was rejected once its consumer was traced: `scripts/generate-seo.js:960` renders it as visible landing-page copy in each brand tile, and two brands deliberately advertise only their headline mount — Fujifilm's tile reads `X-Mount`, not `X-Mount / G-Mount`, and Sigma's reads `L-Mount`, not `L-Mount / SA-Mount`. A derived string would rewrite both, leading Sigma's tile with a discontinued Foveon mount. That is a copy decision for the owner, not something a data refactor should do silently.

So the two fields are deliberately different things and both are kept: `mount` is marketing copy for the tile, `mounts` is the machine-readable truth. Whether Fujifilm's tile *should* mention G-Mount is a separate question, worth asking on its own.

### 4. Fixed-lens bodies join their lineup's mount

X100VI, X Half, GFX100RF and the Lumix L10 mount nothing. Three options existed: assign them to their lineup, show them only under `All`, or show them under every chip.

Assigning them to their lineup wins because the chip answers "which system am I shopping?", not "what will bolt onto this?". A user who clicks *X-Mount* on the Fujifilm page and finds the X100VI missing reads that as a data bug, not as a compatibility statement. So X100VI and X Half → `x`, GFX100RF → `g`, Lumix L10 (MFT sensor, fixed lens) → `mft`.

This is a judgement call worth writing down, because a strict compatibility reading would say the opposite.

### 5. One item is enough to earn a chip — so the table must render one slot

A mount's chip renders in a mode when that mount has **at least one** item in that mode. A chip row renders only when at least two mounts qualify, since a lone chip beside `All` offers no choice — which is why Sigma's lens tab (36 L-Mount, 0 SA-Mount) shows no chip row at all while its camera tab shows both.

The threshold of one, rather than two, has a direct engine consequence: `MIN_SLOTS = 2` is currently a hard floor, so a mount holding a single item could be selected and then fail to fill the table. Honouring it means:

- the effective slot count clamps to the number of items the active filter yields, down to 1;
- `computeWinners()` returns no winners at one slot, since a single value trivially "wins" every row and highlighting it is noise;
- the "Cameras to compare" select and the responsive 2-slot mobile clamp both respect the same floor;
- returning to `All` restores the user's own slot choice.

No mount on the site hits this today — the smallest is Sigma's 2 SA-Mount bodies. It is future-proofing, and it is the riskiest part of the change because it touches the slot-count path that a previous fix (PR #51, the two-camera-brand bug) already found sharp edges in. It gets its own tasks and its own tests.

### 6. Seed the data with a script, verify it with tests

The values are derivable from data already present, and a one-off script is far more trustworthy than 810 hand edits:

- **Cameras** from `sensorType` — `43.8×32.9mm GFX…` → `g`, `Micro Four Thirds…` → `mft`, `Foveon X3 Quattro…` → `sa`; Fujifilm's `X-Trans…`, `Bayer CMOS` and X Half's `1" Primary Color CMOS` → `x`; everything else takes its brand's sole mount.
- **Lenses** from the dropdown group they sit in, which for the multi-mount brands is unambiguous — every group label already names the mount. Single-mount brands take their brand's sole mount.

The script is a scaffold, not a source of truth: it runs once from the scratchpad, its output is reviewed in the diff, and it is not committed. What *is* committed is a test that re-derives camera mounts from `sensorType` and fails on disagreement, so a future camera added with the wrong token is caught.

For the follow-up change the equivalent lens derivation is `focalLengthEquiv ÷ focalLength` against the brand crop factor. It was validated against the live data and classifies 394 of 395 Canon/Nikon/Sony lenses unambiguously — but it silently mis-derives Canon's RF-S 3.9mm Dual Fisheye, which deliberately carries no crop multiplier. A strong argument for storing the value and using the derivation as a *check* with a documented exception list, rather than deriving at runtime.

### 7. Split Panasonic's Box group

`── Lumix Box (cinema / live event) ──` holds BS1H (L-Mount, full-frame) and BGH1 (MFT). It is the only group on the site whose members disagree on their mount. Splitting it keeps "one group, one mount" true everywhere, which lets a test assert it as an invariant rather than as an exception list.

### 8. Chip row markup follows the existing toggle idiom

The row renders inside `#compare-header`, above the slot pickers, as `role="group"` with `aria-pressed` buttons — the same pattern as the theme toggle and mode toggle, so it inherits their styling tokens and keyboard behaviour rather than introducing a third control idiom. It is absent from the DOM entirely when fewer than two mounts qualify, so the existing layout is untouched for single-mount brands.

## Risks / Trade-offs

- **Single-slot rendering destabilising the slot-count path** → Its own task group and its own Tier 2 tests, covering the filter→1-slot transition, the return to `All`, the mobile clamp interaction and winner suppression. This is the part of the change to review hardest.
- **Large mechanical diff across six data files (810 entries)** → Script-seeded and reviewed as a diff of one added token per entry; `npm test` is the gate, and `shared-mount.test.js` already covers the Panasonic ↔ Sigma L-Mount overlap.
- **Removing `BRAND_CONFIG.mount` changes generator input** → `node scripts/generate-seo.js` must produce no diff; it is a checkpoint gate before that commit lands.
- **A future item added without a `mount`, or with the wrong one** → Three guards: schema requires the field, the per-group agreement test catches an MFT lens dropped into an L-Mount group, and the camera re-derivation test catches a mistyped body.
- **Auto-swap surprises a user mid-comparison** → The swap only fires on an explicit chip click, never on load, and `All` restores the full list without further swapping. `updateHash()` keeps the new selection shareable.
- **Reversing a documented architectural decision** → CLAUDE.md is updated in the same change, stating what replaced it and why the original reasoning no longer holds. Leaving the old paragraph standing would be the real risk.
- **Redundant `mount` on three brands** → Accepted deliberately, to keep the invariant unconditional.

## Migration Plan

Purely additive to the rendered page; no persisted state and no URL grammar change. The one non-additive step is removing `BRAND_CONFIG.mount`, gated on the generator producing no diff. Rollback is a revert.

Ship order: data + Tier 1 tests (green on their own, no UI), then the generator swap, then the engine and CSS, then single-slot support, then docs. One branch, one PR, a commit at each checkpoint.

## Open Questions

- Should the chip row show a per-mount item count (`Micro Four Thirds (46)`)? Useful on the lens tab, noisy on Sigma's 3-camera tab. Deferred — trivial to add later.
