# Progress — Nikon third-party lenses (round 2)

**Resume at:** Viltrox+Voigtländer batch is DONE (see below) — 32 new lenses
entered, `npm test` green, committed to its own branch
`nikon-viltrox-voigtlander-v2` (this batch's agent was told by the
orchestrator to use its own branch rather than the shared
`expand-thirdparty-lenses-canon` branch this round, and to let the
orchestrator handle the merge — see that batch's section below for why).
The other 3 batches (Laowa+Samyang, Yongnuo+Meike, TTArtisan+7Artisans) are
run by sibling parallel agents; check their own worktrees/branches for
status. Sigma+Tamron's "look for genuinely new lenses" half is still
outstanding (only the spec-correction pass landed, 2026-08-29).

**Branch:** expand-thirdparty-lenses-canon is the nominal shared branch, but
the Viltrox+Voigtländer batch (this round's re-run) landed on its own
branch `nikon-viltrox-voigtlander-v2` per explicit orchestrator instruction
for this parallel run — the orchestrator merges it in afterward.
**PR:** https://github.com/esusatyo/fuji-compare-tool/pull/41 (Canon + prior
Nikon work; the Viltrox+Voigtländer commit joins it via merge, not a direct
push)
**Last green commit:** (see git log on `nikon-viltrox-voigtlander-v2` for the
Viltrox+Voigtländer commit; see `expand-thirdparty-lenses-canon` for the
hand-merged Tamron correction commit)

## Baseline (before this round)

31 total: Sigma 3, Viltrox 11, Tamron 6, Laowa 3, Voigtländer 2, Yongnuo 2,
TTArtisan 1, 7Artisans 1, Meike 2, **Samyang 0**. See
`openspec/changes/archive/2026-07-05-add-thirdparty-lenses-nikon/` for round
1's research ledger (checklist of designs to look for — never a source of
specs) and the `refresh-nikon-run-aug-2026` memory for the PR #25
fabrication/year-fix history.

**Known trap for this brand specifically:** a previous `tamron-11-20mm-f28`
entry claimed Nikon Z availability that never existed and was removed in
PR #25. Every candidate this round must have its mount existence verified
directly against the maker (mount-selector dropdown or per-mount SKU list),
independent of specs — never inferred from "the maker makes this lens" or
from an aggregator.

## Batches

| Maker | Researched | Entered | Dropdown | Images | Prices | Committed |
|---|---|---|---|---|---|---|
| Sigma + Tamron re-check | 🟡 partial | n/a — corrections only | n/a | n/a | ✅ 1 price fix | hand-merged, see below |
| Viltrox + Voigtländer | ✅ 32/32 (21 Viltrox + 11 Voigtländer; 1 Viltrox teleconverter and 1 Voigtländer lens out-of-scope/deferred, see below) | ✅ 32 | ✅ | ✅ 32 (maker product photos) | ✅ Viltrox tier-1 USD; ⚠️ Voigtländer USD estimated, see Open questions | see `nikon-viltrox-voigtlander-v2` branch |
| Laowa + Samyang | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| Yongnuo + Meike | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |
| TTArtisan + 7Artisans | ⬜ not started (agent died before any tool use produced output) | ⬜ | ⬜ | ⬜ | ⬜ | — |

### Viltrox+Voigtländer batch — what landed (2026-08-30)

**Viltrox: 21 new lenses**, diffed against viltrox.com's own Z-mount
category page (32 products listed there; 11 already in the dataset, 1 is a
teleconverter — excluded, 20 wait no 21 are genuinely new). Round-1's ledger
flagged the LAB 135mm f/1.8 as a plausible gap — confirmed real and entered.
Also entered the flagship 35mm F1.2 LAB, three Pro-line primes (50mm f/1.4,
56mm f/1.2, 75mm f/1.2), a manual-focus 20mm f/1.8 (Viltrox's oldest Z-mount
lens, predating the 2023+ AF-licensing era since MF needs no license), a
brand-new July-2026 26mm F2.8 EVO pancake, and 14 more EVO/Air-line primes.
One genuine per-mount data trap found and resolved: the 26mm F2.8 EVO's
Z-mount weight (170g) initially looked wrong against several E-mount-sample
reviews citing 130g — confirmed as a real per-mount difference by loading
the E-mount sibling's own spec page directly (130g/Φ66×23.8mm vs Z-mount's
170g/Φ69.4×25.8mm). All 21 Viltrox USD prices are tier-1 (viltrox.com states
USD list price natively).

**Voigtländer: 11 new lenses**, enumerated from voigtlaender.de's own
Z-mount lens grid (16 native designs shown). The flagged remaining-tail lead
— **APO-Lanthar 35mm f/2 Aspherical II Z** — is confirmed real and entered
(own dedicated product page + photo, distinct from the existing 50mm
sibling). Also entered: Super Wide Heliar 15mm f/4.5, D23mm Nokton f/1.2
(APS-C), Nokton 28mm f/1.5, APO-Lanthar 28mm f/2, D35mm Nokton f/1.2
(APS-C), Macro APO-Ultron D35mm f/2 (APS-C), a brand-new August-2026 Septon
40mm f/2, Nokton 50mm f/1.0, Macro APO-Lanthar 65mm f/2, and Portrait Heliar
75mm f/1.8. One candidate rejected (Nokton 75mm f/1.5 — its tile on the
Z-mount overview grid links only to the E-mount product page, meaning it
doesn't actually ship in Z yet, despite being shown there — the maker's own
overview page running ahead of its actual SKU list). One deferred (Nokton
classic 35mm f/1.4 — genuinely brand-new, but the maker's own spec table
leaves the non-nullable `minAperture` field blank; every other field is
solid).

**Test results:** `npm test` 416/416 green after entry (was 384/384 before
this batch — the delta is exactly the 32 new lenses' logic-tier coverage).
`npm run test:data` also green (schema/referential/completeness/colour all
pass for the new entries). `node scripts/generate-seo.js` re-run (lens count
15→112 across all brands reflected). `node scripts/verify-images.js nikon`
run — see result in the commit; all 32 new `imageUrl`s are maker product
photos on stable CDN paths (`viltrox.com/cdn/shop/files/…`,
`voigtlaender.de/wp-content/uploads/…`), each independently `curl -I`
200-verified during research.

### Sigma+Tamron batch — what actually landed (2026-08-29, hand-merged after agent died)

The agent got through re-verifying Sigma (still exactly 3 DC DN primes on Z,
no DG DN full-frame — corroborated by a 2025-11-02 PetaPixel piece; USD
prices confirmed as RRP, not sigmaphoto.com's active Instant Savings promo)
and had started correcting 4 **existing** Tamron entries before dying mid-way
through that edit (it never reached the "look for genuinely new Tamron/Sigma
Z-mount lenses" part of the assignment). The correction it did make is real
and independently re-verified by the orchestrator before merging:

**Found:** `tamron-17-70mm-f28`, `tamron-35-150mm-f2-28`,
`tamron-50-400mm-f45-63`, and `tamron-70-300mm-f45-63` all had their
**weight/length figures stored from tamron.com's Sony E-mount column**, not
the Nikon-Z column on the same per-lens spec page (the page lists both mounts
inline, e.g. `"160.1mm / 6.3in (Nikon)"` vs a separate Sony figure) — despite
an existing code comment claiming these were "verified" Nikon-Z values.
Corrected all 4 to the genuine Nikon-Z figures, each with a `specSources`
citation. `tamron-70-300mm-f45-63`'s `maxMagnification` was also fixed
(0.11 → 0.20 — the stored figure had taken the zoom's WIDE-end figure instead
of the true TELE-end maximum). `tamron-35-150mm-f2-28`'s USD price was
corrected 1799 → 1999 (the stored figure matched no found source for this
lens; $1,999 is the confirmed Nikon-Z-mount MSRP, still B&H's current list
price — Best Buy's $1,599 is a discount, not a new RRP).

**Independently re-verified by the orchestrator (not just the agent's
self-report)** before merging: WebFetch confirmed tamron.com's own a058
spec page states `1,190g / 160.1mm (Nikon)`, matching the correction exactly;
WebSearch independently confirmed the $1,999 Nikon-Z MSRP via DPReview's
launch article title, corroborated by B&H's current list price still
showing $1,999.

A stray untracked `scripts/price-overrides/nikon.json` was also found in the
agent's worktree, listing CAD overrides for 4 slugs
(`tamron-12-20mm-f28`, `tamron-35-100mm-f28`, `tamron-70-180mm-f28-g2`,
`tamron-90mm-f28-macro`) that **do not exist anywhere in `nikon/data.js`** —
none of these lenses were ever entered by this agent. This looks like
speculative/premature content, possibly carried over from another brand's
work, not tied to any verified Nikon entry. **Discarded, not merged.**

**Still outstanding for this batch** (not started before the agent died):
enumerating genuinely new Sigma/Tamron Z-mount lenses beyond the existing
3+6. Needs a fresh run.

## Deferred / skipped (with reason)

- `voigtlander-nokton-classic-35mm-f14` (not entered) — genuinely brand-new
  Z-mount release (item no. 126307, page dated "as of August 2026"). The
  maker's own spec table leaves "Smallest Aperture (F)" blank with no value;
  `minAperture` is non-nullable in this project's schema even under the
  skill's ≤1-month new-release allowance. Every other field is published and
  solid (250g, 41.6mm, 67.6mm diameter, 58mm filter, 0.27m min focus).
  Re-check on the next Voigtländer pass — the page may fill the cell in once
  the SKU has been live longer.
- Voigtländer `Nokton 75mm f/1.5 Aspherical Z` (rejected, not deferred) —
  shown on voigtlaender.de's own Z-mount overview grid, but that tile links
  only to the E-mount product page (`/lenses/e-mount/nokton-75-mm-f1-5-aspherical/`);
  no dedicated Z-mount product page exists like every other design on that
  grid has. Doesn't actually ship in Z yet.
- Viltrox `TC-2.0X Teleconverter for Nikon` (out of scope) — teleconverter,
  not a lens, per the skill's scope boundary.

## Open questions for the user

- **11 new Voigtländer entries carry an ESTIMATED USD price**, not a
  retailer-confirmed one. voigtlaender.de states EUR-only RRPs; this
  session's B&H and Amazon access were both permission-blocked for the
  browser extension, `WebFetch` got HTTP 403 on both, Adorama's own site
  search returned no matching SKU for these (likely too new for US retail
  listings yet), and the session's WebSearch budget was exhausted (200/200)
  before a retail check could be attempted. Each USD figure is EUR × 1.169 —
  a ratio backed out from this file's own previously-verified
  `voigtlander-nokton-40mm-f12` entry (EUR 769 → USD 899, both genuinely
  tier-1-sourced). The real EUR RRP is also stored on each entry
  (`prices.EUR`, not null) so the estimate is transparent and correctable.
  **Recommend a follow-up `check-prices-and-buy-links` pass once B&H/Amazon
  access is available**, specifically for the 11
  `voigtlander-*` slugs added 2026-08-30 (see `research/lenses.md` for the
  full list) — either to confirm the estimate or replace it with a real
  US list price.
- The Viltrox `20mm F1.8 MF`'s `year:2020` is a rounded proxy (the Shopify
  store's own `created_at` timestamp reads 2019-12-16) rather than a
  confirmed public launch date — Viltrox doesn't publish an explicit launch
  date for this SKU anywhere else that this session found. Low-stakes (it's
  a `year` field only, all specs are solid) but worth a second look if a
  future pass has better search tooling.
- `node scripts/verify-images.js nikon` reports all 13 `voigtlander-*`
  entries' images as bad (`[0 rate-limited/error]`) — **including the 2
  pre-existing entries that predate this batch**, so this is not something
  introduced here. Node's `fetch()` in this environment appears unable to
  validate `voigtlaender.de`'s TLS certificate chain (the same
  `unable to verify the first certificate` error `WebFetch` hit on this
  domain during research). Every one of the 11 new image URLs was
  independently confirmed live and correctly typed via `curl -I` during
  research (`HTTP/2 200`, `content-type: image/*`), so the images
  themselves are fine — this looks like an environment-specific Node/TLS
  gap for this one domain, not a dead-link problem. Worth a second look with
  a different verification environment before treating it as real.
- Four Voigtländer entries' `year` came from the product photo's own
  upload-path date (`/wp-content/uploads/<year>/<month>/…`) rather than an
  explicit "as of" disclaimer, because their product pages carry no such
  disclaimer: `voigtlander-nokton-d35mm-f12` (2022-04),
  `voigtlander-macro-apo-ultron-d35mm-f2` (2022-12),
  `voigtlander-apo-lanthar-35mm-f2` (2025-01), and
  `voigtlander-macro-apo-lanthar-65mm-f2` (2022-12). Reasonable proxy (image
  uploads on this site appear to track launch closely — cross-checked
  against the D23mm Nokton, whose photo date exactly matched its own
  explicit "as of April 2022" disclaimer), but not as strong as the explicit
  date most other entries carry.
