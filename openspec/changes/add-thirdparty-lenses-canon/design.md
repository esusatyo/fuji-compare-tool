## Context

`canon/data.js` defines `LENSES` and `LENS_DROPDOWN_GROUPS`. The shared
`engine.js` renders any lens with a `manufacturer` field, colours the card from
`MANUFACTURER_COLORS`, and builds per-currency Amazon Buy links from `asin` or a
search fallback. Tests auto-discover brands and validate against
`tests/helpers/schema.js`.

Canon is the special case: RF was **closed to third-party AF until 2024**, when
Canon licensed **RF-S (APS-C)** to Sigma and Tamron. Full-frame RF third-party AF
is only beginning to appear. So the honest comprehensive set is meaningfully
smaller than Sony/Nikon/Panasonic — the goal is "everything currently shipping
for RF/RF-S," not a padded list. The mechanism is identical to the sibling
third-party changes.

## Goals / Non-Goals

**Goals:**
- Add the currently-shipping third-party RF/RF-S lenses: Sigma & Tamron RF-S
  APS-C AF (+ any FF RF), Viltrox RF AF, Samyang/Yongnuo AF where available, and
  notable TTArtisan/7Artisans/Laowa/Meike AF + MF RF primes.
- Every entry **RF-mount-specific and reference-verified** (≥2 sources): specs,
  RRP (7 currencies or `priceIncomplete`), `productUrl`, `asin`/search fallback,
  `imageUrl`. RF-S APS-C lenses carry `focalLengthEquiv` = 1.6× crop.
- Keep the suite green; every manufacturer has a card colour.
- Resumable in small per-manufacturer batches with test checkpoints.

**Non-Goals:**
- No shared cross-mount catalogue, `mount` field, or cross-mount UI.
- No changes to Canon cameras or first-party RF lenses; no engine/currency
  changes.
- **No padding** — do not list lenses that aren't actually available in RF/RF-S,
  and don't invent full-frame RF third-party AF that hasn't shipped. Verify RF
  availability per lens at entry (D6/D7).

## Decisions

### D1: Denormalized, per-brand storage (no shared catalogue, no `mount` field)
Same rationale as the sibling changes: store the **RF/RF-S instance** as an
independent entry; same-design copies for E/X/Z live in their own brand files.
Alternatives (shared catalogue, `mount` field) rejected. Cross-mount overlap
recorded in `research/lenses.md` only.

### D2: Slug and naming conventions
`<maker>-<focal>-<aperture>[-variant]`, lowercase, aperture without decimal:
`sigma-18-50mm-f28`, `tamron-17-70mm-f28`, `viltrox-27mm-f12`. `manufacturer`
matches `MANUFACTURER_COLORS` casing; `line` records sub-brand (Art/Contemporary/
Di III/Air). RF-S vs RF is conveyed by `focalLengthEquiv` (1.6× crop for RF-S)
and by the item's focal/aperture, not a schema field.

### D3: Dropdown grouping by manufacturer
Existing Canon groups first, then Sigma, Tamron, Viltrox, then `── Other ──`
(Samyang/Yongnuo/TTArtisan/7Artisans/Laowa/Meike). Mirrors the sibling layout.

### D4: Manufacturer colours (shared, one-time)
Add `Laowa`, `Meike`, `Yongnuo` to `MANUFACTURER_COLORS` if not already added by
a sibling change. Present: Sigma, Tamron, Viltrox, Samyang, TTArtisan, 7Artisans.
Shared coverage test asserts no lens manufacturer is uncoloured.

### D5: Pricing, ASIN, images
Current lenses: 7 currencies; derived regional → `priceIncomplete: true`. ASIN =
verified plain product, else search fallback. `imageUrl` from manufacturer page;
placeholder gaps recorded (KNOWN_IMAGE_GAPS.canon).

### D6: Reference verification (≥2 sources) + RF-availability check
Every RRP, key spec, `productUrl`, `asin`, `imageUrl` cross-checked against ≥2 of
manufacturer page / DPReview-spec sheet / major retailer / Amazon. **Additionally
confirm the lens actually ships in RF/RF-S mount** (Canon licensing is recent and
still expanding) — a lens available only in E/X/Z is out of scope here.
Unconfirmable data left `null`.

### D7: Scope boundary for "comprehensive" (honest, un-padded)
In: all currently-shipping third-party RF/RF-S AF (Sigma RF-S, Tamron RF-S, any
FF RF from these makers, Viltrox RF, Samyang/Yongnuo RF AF) + notable RF manual
primes (TTArtisan/7Artisans/Laowa/Meike). Out: lenses not offered in RF/RF-S,
cine/anamorphic, teleconverters, EF lenses used via adapter (those are a
different, adapter-based story), retired clones.

### D8: Tests & verification
No schema change. Coverage: `schema`, `referential` (new groups resolve; no
orphans/dupes), `config`, `completeness`, plus the manufacturer-colour coverage
assertion. Ad-hoc liveness check over new `productUrl`/`imageUrl`. `npm test`
green at every checkpoint.
