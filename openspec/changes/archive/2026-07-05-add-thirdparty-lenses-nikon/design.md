## Context

`nikon/data.js` defines `LENSES` (slug → lens) and `LENS_DROPDOWN_GROUPS`. The
shared `engine.js` renders any lens with a `manufacturer` field, colours its card
from `MANUFACTURER_COLORS`, and builds per-currency Amazon Buy links from `asin`
(product page) or a name-based search fallback. Tests auto-discover every brand
via `brandDirs()` and validate lenses against `tests/helpers/schema.js`.

Fujifilm (and, in this change set, Sony) already carry third-party lenses via
this exact mechanism. This change replicates the pattern for Nikon Z. Note the
Nikon-specific wrinkle: third-party AF on Z only opened up meaningfully in 2023
(Sigma licensing), so the catalogue is smaller than Sony's but growing fast —
scope is "everything currently shipping for Z," not a long historical tail.

## Goals / Non-Goals

**Goals:**
- Add the comprehensive set of currently-shipping third-party Z lenses: Sigma
  (DC DN + DG DN), Tamron (Di III Z), Viltrox (AF/LAB/Air), Samyang (AF),
  Voigtländer (native Z), Laowa, and representative TTArtisan/7Artisans/Meike/
  Yongnuo.
- Every entry **Z-mount-specific and reference-verified** (≥2 sources): specs,
  RRP (7 currencies or `priceIncomplete`), `productUrl`, `asin`/search fallback,
  `imageUrl`.
- Keep the suite green; ensure every manufacturer has a card colour.
- Resumable in small per-manufacturer batches with test checkpoints.

**Non-Goals:**
- No shared cross-mount catalogue, `mount` field, or cross-mount UI.
- No changes to Nikon cameras or first-party lenses; no engine/currency changes.
- No long tail of obscure clones (scope bounded in D7).
- Tamron lenses that Nikon rebadges and sells as **Nikkor** (first-party) are
  already/handled as first-party — the third-party entry is the Tamron-branded
  version only where Tamron sells it directly (avoid duplicates; see D7).

## Decisions

### D1: Denormalized, per-brand storage (no shared catalogue, no `mount` field)
Identical rationale to the Sony change: store the **Z-mount instance** as an
independent entry; same-design copies for E/X/RF live in their own brand files.
Alternatives (shared catalogue, `mount` field) rejected — engine change + mount
taxonomy + new tests for no rendering benefit, and per-mount weight/price/asin
differ anyway. Cross-mount overlap recorded in `research/lenses.md` only.

### D2: Slug and naming conventions
`<maker>-<focal>-<aperture>[-variant]`, lowercase, aperture without decimal:
`sigma-18-50mm-f28`, `tamron-28-75mm-f28-g2`, `viltrox-27mm-f12`,
`voigtlander-nokton-40mm-f12`, `laowa-15mm-f2`. `manufacturer` matches
`MANUFACTURER_COLORS` casing; `line` records the sub-brand.

### D3: Dropdown grouping by manufacturer
Existing Nikon groups first, then Sigma, Tamron, Viltrox, Samyang, Voigtländer,
Laowa, `── Other ──` (TTArtisan/7Artisans/Meike/Yongnuo).

### D4: Manufacturer colours (shared, one-time)
Add `Laowa`, `Meike`, `Yongnuo` to `MANUFACTURER_COLORS` if not already added by
a sibling change (`Zeiss` likely added by Sony). Sigma/Tamron/Viltrox/Samyang/
Voigtländer/TTArtisan/7Artisans already exist. The shared coverage test asserts
no lens manufacturer is uncoloured.

### D5: Pricing, ASIN, images
Current lenses: 7 currencies; derived regional → `priceIncomplete: true`. ASIN =
verified plain product, else search fallback. `imageUrl` from manufacturer page;
placeholder gaps recorded (KNOWN_IMAGE_GAPS.nikon).

### D6: Reference verification (≥2 sources)
Every RRP, key spec, `productUrl`, `asin`, `imageUrl` cross-checked against ≥2 of
manufacturer page / DPReview-spec sheet / major retailer / Amazon. Unconfirmable
data left `null`, noted in `research/lenses.md`.

### D7: Scope boundary for "comprehensive" + rebadge de-duplication
In: all currently-shipping third-party Z AF lenses (Sigma/Tamron/Viltrox/Samyang)
+ notable Voigtländer/Laowa + representative TTArtisan/7Artisans/Meike/Yongnuo.
Out: cine/rehoused, anamorphic, teleconverters, discontinued clones with no
retail presence. **De-dup:** where Nikon sells a Tamron design under the Nikkor
brand (first-party), that lens stays first-party; only add the Tamron-branded Z
version when Tamron itself sells it for Z. Avoid listing the same physical
product twice.

### D8: Tests & verification
No schema change. Coverage: `schema`, `referential` (new groups resolve; no
orphans/dupes), `config`, `completeness`, plus the manufacturer-colour coverage
assertion. Ad-hoc liveness check over new `productUrl`/`imageUrl`. `npm test`
green at every checkpoint.
