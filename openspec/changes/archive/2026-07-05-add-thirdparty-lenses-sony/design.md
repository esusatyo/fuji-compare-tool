## Context

`sony/data.js` defines a `LENSES` object (slug → lens object) and a
`LENS_DROPDOWN_GROUPS` array that groups slugs under labelled headers. The shared
`engine.js` renders any lens with a `manufacturer` field, colours its card from
`MANUFACTURER_COLORS`, and builds a per-currency Amazon Buy link from `asin`
(product page) or, when `asin` is null, a search link from
`${BRAND_CONFIG.name} ${lens.name}`. Tests auto-discover every brand via
`brandDirs()` and validate each lens against `tests/helpers/schema.js`.

Fujifilm already carries ~23 third-party X-mount lenses using this exact
mechanism (per-maker dropdown groups, `manufacturer` field, ASIN/search Buy
links). This change replicates that proven pattern for Sony E/FE at
**comprehensive** scale — Sony has by far the deepest third-party catalogue.

## Goals / Non-Goals

**Goals:**
- Add the comprehensive set of native-AF third-party E/FE lenses (Sigma, Tamron,
  Samyang, Viltrox) plus notable manual/specialty lenses (Zeiss, Voigtländer,
  Laowa) and representative budget makers (TTArtisan, 7Artisans, Meike).
- Every entry is **Sony-mount-specific and reference-verified**: specs, RRP (7
  currencies or `priceIncomplete`), `productUrl`, `asin` (or search fallback),
  and `imageUrl`, each cross-checked against ≥2 reputable sources.
- Keep the full suite green; add manufacturer-colour coverage so no lens renders
  on the default card by accident.
- Work is **resumable in small per-manufacturer batches**, each ending in a test
  checkpoint.

**Non-Goals:**
- No shared cross-mount lens catalogue and no `mount` field (see D1).
- No cross-mount "also available for Nikon Z / Canon RF…" UI.
- No changes to Sony cameras or first-party lenses (beyond possibly re-checking a
  neighbouring price); no engine layout/currency changes.
- No exhaustive coverage of every obscure AliExpress-tier manual lens — scope is
  bounded in D7.

## Decisions

### D1: Denormalized, per-brand storage (no shared catalogue, no `mount` field)
The same optical design (e.g. Sigma 18-50 f/2.8 DC DN) is sold for Sony E, Fuji
X, Canon RF-S, Nikon Z and L-mount. We store the **Sony-mount instance** as an
independent entry in `sony/data.js`, exactly as Fujifilm stores its Sony-absent
copies today. **Alternatives rejected:** (a) a shared `third-party-lenses.js`
catalogue merged at load — would require an engine change, a mount taxonomy, and
new tests, and breaks the "each brand is one standalone script" invariant; and
the per-mount weight/length/price/asin still differ, so a shared entry needs
override fields anyway. (b) a `mount` field — unused by the engine and redundant
because the brand file already implies the mount. Cross-mount overlap is captured
in `research/lenses.md` (to avoid re-researching optics) but not in the data.

### D2: Slug and naming conventions
Slug = `<maker>-<focal>-<aperture>[-variant]`, lowercase, hyphenated, aperture
without the decimal point: e.g. `sigma-18-50mm-f28`, `tamron-28-75mm-f28-g2`,
`viltrox-27mm-f12`, `zeiss-batis-25mm-f2`, `voigtlander-nokton-40mm-f12`,
`laowa-15mm-f2`. Where a maker ships two designs at the same focal/aperture, a
`-ii` / `-dg`/`-dc` / line suffix disambiguates. `manufacturer` is the exact
casing already used in `MANUFACTURER_COLORS` (`Sigma`, `Tamron`, `Samyang`,
`Viltrox`, `Zeiss`, `Voigtländer`, `Laowa`, `TTArtisan`, `7Artisans`, `Meike`).
`line` records the sub-brand (e.g. `Art`, `Contemporary`, `Di III`, `Batis`,
`Loxia`, `Nokton`, `APO-Lanthar`, `LAB`, `Air`).

### D3: Dropdown grouping by manufacturer
Append per-maker groups to `LENS_DROPDOWN_GROUPS` after the existing Sony groups,
in this order: Sigma, Tamron, Samyang, Viltrox, Zeiss, Voigtländer, Laowa, then a
single `── Other ──` for TTArtisan/7Artisans/Meike. Mirrors Fujifilm's layout.

### D4: Manufacturer colours (shared, one-time)
`MANUFACTURER_COLORS` already covers Sigma, Tamron, Viltrox, Samyang,
Voigtländer, TTArtisan, 7Artisans. Add `Zeiss`, `Laowa`, `Meike`. A new test
asserts every lens `manufacturer` across **all** brands has a colour entry, so
future additions can't silently fall back to the default card.

### D5: Pricing, ASIN, images
- **RRP:** current lenses carry all 7 currencies (USD, AUD, EUR, GBP, JPY, CAD,
  SGD). Where a regional price can't be confirmed, derive it and set
  `priceIncomplete: true` (per the fix-price-mislabeling-rrp convention).
  Discontinued lenses (e.g. Zeiss Batis/Loxia/Touit) may be USD-only.
- **ASIN → purchase link:** fill a verified **plain-product** Amazon ASIN
  (exclude bundles/Renewed/International). Missing ASIN → engine search fallback.
  Reuse the `check-prices-and-buy-links` skill for backfill.
- **Images:** prefer the manufacturer product-page image (`imageUrl`); allow the
  engine's manufacturer-coloured placeholder where no clean image exists, and
  record such gaps in the change (KNOWN_IMAGE_GAPS convention).

### D6: Reference verification (≥2 sources)
Every RRP, key spec (focal, aperture, weight, length, filter, elements/groups,
min-focus, OIS, AF motor, year), `productUrl`, `asin`, and `imageUrl` is
cross-checked against ≥2 of: manufacturer official page, DPReview / published
spec sheet, a major retailer (B&H / Adorama), and Amazon. Unconfirmable data is
left `null` (never guessed) and noted in `research/lenses.md`.

### D7: Scope boundary for "comprehensive"
Include: **all current native-AF** lenses from Sigma, Tamron, Samyang, Viltrox
for E/FE; **all notable manual/specialty** lenses from Zeiss (incl. discontinued
Batis/Loxia/Touit), Voigtländer, Laowa; and a **representative selection** of the
most popular TTArtisan/7Artisans/Meike AF lenses. Exclude: cine-only/rehoused
variants, anamorphic, teleconverters, lens caps, and long-tail clones with no
retailer presence. Discontinued-but-significant lenses are included and flagged
`discontinued: true`.

### D8: Tests & verification
No schema change (third-party lenses use the same lens schema). Coverage:
`schema` (field types/URLs), `referential` (every dropdown slug resolves; no
orphans/dupes; new groups consistent), `config` (RRP/currency rules),
`completeness` (counts). Add the manufacturer-colour coverage assertion (D4).
Run an ad-hoc liveness check over all new `productUrl`/`imageUrl` (the built-in
`test:links` is still an opt-in stub). `npm test` green at every batch checkpoint.
