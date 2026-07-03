## Context

`fujifilm/data.js` already defines third-party X-mount lenses in `LENSES` with a
`manufacturer` field, grouped in `LENS_DROPDOWN_GROUPS` under `── Sigma ──`,
`── Tamron ──`, `── Viltrox ──`, `── Other ──`. This was the pattern the sibling
third-party changes (Sony/Nikon/Panasonic/Canon) copied. The shared `engine.js`
renders each lens, colours the card from `MANUFACTURER_COLORS`, and builds
per-currency Amazon Buy links from `asin` or a search fallback. Tests
auto-discover brands and validate against `tests/helpers/schema.js`.

This change is an **expansion**, not a from-scratch add: complete the gaps in the
existing set and bring Fujifilm to the same comprehensive bar as the other
brands. The X mount is **APS-C only**, so full-frame-only third-party designs are
out of scope by construction.

## Goals / Non-Goals

**Goals:**
- Fill the gaps: complete the Sigma DC DN line, add Viltrox Air + missing AF,
  add the Zeiss Touit trio, add Laowa and Meike, expand TTArtisan/7Artisans.
- **Re-verify** the pre-existing 23 entries (price/`asin`/`productUrl`/`imageUrl`
  freshness) so the whole third-party set is current.
- Every new/updated entry **X-mount-specific and reference-verified** (≥2
  sources): specs, RRP (7 currencies or `priceIncomplete`), `productUrl`,
  `asin`/search fallback, `imageUrl`. APS-C `focalLengthEquiv` = 1.5× crop.
- Keep the suite green; every manufacturer has a card colour.
- Resumable in small per-manufacturer batches with test checkpoints.

**Non-Goals:**
- No shared cross-mount catalogue, `mount` field, or cross-mount UI.
- No changes to Fujifilm cameras or first-party XF/XC lenses; no engine/currency
  changes.
- **No full-frame-only designs** (Sigma DG DN Art, Viltrox LAB FF, etc.) — the X
  mount has no full-frame version of these.
- No re-slugging or removal of existing entries beyond correcting genuine errors
  found during re-verification.

## Decisions

### D1: Denormalized, per-brand storage (unchanged from existing pattern)
Continue the existing Fujifilm approach: per-brand entries, no shared catalogue,
no `mount` field. Same-design copies for E/Z/RF live in their own brand files.
Cross-mount overlap recorded in `research/lenses.md` only. (This is the pattern
this change set standardised across all brands.)

### D2: Slug and naming conventions (match existing Fujifilm entries)
Continue the existing convention — the current entries use `sigma-56mm-f14`,
`viltrox-75mm-f12`, `ttartisan-27mm-f28`, `voigtlander-nokton-35mm-f09`, etc. New
entries follow the same shape: `sigma-18mm-f14`, `viltrox-air-40mm-f25`,
`zeiss-touit-32mm-f18`, `laowa-9mm-f28`, `meike-35mm-f14`. `manufacturer` matches
`MANUFACTURER_COLORS` casing; `line` records sub-brand (Air / Touit / etc.).

### D3: Dropdown grouping by manufacturer
Grow the existing groups (Sigma, Viltrox, Other) and add `── Zeiss ──`,
`── Laowa ──`, `── Meike ──`. Keep the existing group order; append new groups
after the current ones. Ensure every existing + new lens sits in exactly one
group (referential test enforces this).

### D4: Manufacturer colours (shared, one-time)
Add `Zeiss`, `Laowa`, `Meike` to `MANUFACTURER_COLORS` (skip any already added by
a sibling change — these are the same three the Sony change adds). Present:
Sigma, Tamron, Viltrox, Samyang, Voigtländer, TTArtisan, 7Artisans. Shared
coverage test asserts no lens manufacturer is uncoloured.

### D5: Pricing, ASIN, images (incl. re-verification)
New current lenses: 7 currencies; discontinued (Zeiss Touit): USD-only; derived
→ `priceIncomplete: true`. ASIN = verified plain product, else search fallback.
`imageUrl` from manufacturer page; placeholder gaps recorded
(KNOWN_IMAGE_GAPS.fujifilm). **Re-verification pass:** re-check each existing
entry's price/`asin`/URLs against current sources; update stale values, note any
that went discontinued.

### D6: Reference verification (≥2 sources)
Every RRP, key spec, `productUrl`, `asin`, `imageUrl` (new and re-verified)
cross-checked against ≥2 of manufacturer page / DPReview-spec sheet / major
retailer / Amazon. Unconfirmable data left `null`, noted in
`research/lenses.md`.

### D7: Scope boundary for "comprehensive" (APS-C only)
In: complete Sigma DC DN; Viltrox Air + AF primes; Zeiss Touit (discontinued);
Laowa X specialty; Meike AF primes; representative comprehensive TTArtisan/
7Artisans; keep Samyang/Voigtländer/Tamron current. Out: full-frame-only designs
with no X version, cine/anamorphic, teleconverters, retired clones.

### D8: Tests & verification
No schema change. Coverage: `schema`, `referential` (grown + new groups resolve;
no orphans/dupes; existing entries still grouped), `config`, `completeness`, plus
the manufacturer-colour coverage assertion. Ad-hoc liveness check over new +
re-verified `productUrl`/`imageUrl`. `npm test` green at every checkpoint.
