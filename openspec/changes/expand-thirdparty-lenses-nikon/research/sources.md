# Nikon Z third-party lenses — round 2 source log

Per-source log, written as each URL is read. T1 maker's own site (incl.
official regional sites) · T2 independent measurement/review · T3 retailer
(price/availability only) · T4 aggregator (tables only, never mount
attribution) · NEWS dated announcement (year only).

Record sources for facts you *rejected* too, with the reason — that's what
stops a later pass "correcting" a right value to a wrong one.

## Sigma+Tamron batch (2026-08-29, hand-merged — see PROGRESS.md)

- **T1** `https://www.tamron.com/global/consumer/lenses/a058/spec.html` —
  Nikon-Z-specific weight/length for `tamron-35-150mm-f2-28` (1,190g /
  160.1mm). Independently re-fetched by the orchestrator, confirmed exact
  match.
- **T1** `https://www.tamron.com/global/consumer/lenses/b070/spec.html` —
  Nikon-Z-specific weight/length for `tamron-17-70mm-f28` (540g / 121.3mm).
- **T1** `https://www.tamron.com/global/consumer/lenses/a067/spec.html` —
  Nikon-Z-specific weight/length for `tamron-50-400mm-f45-63` (1,180g /
  185.8mm).
- **T1** `https://www.tamron.com/global/consumer/lenses/a047/spec.html` —
  Nikon-Z-specific weight/length + magnification for
  `tamron-70-300mm-f45-63` (580g / 150.3mm / 0.20× max).
- **NEWS** `https://www.dpreview.com/news/8584835899/...` — `tamron-35-150mm-f2-28`
  Nikon-Z launch price $1,999 (2023-09-21). Blocked for WebFetch (bot-block);
  corroborated instead via WebSearch, which independently surfaced the same
  $1,999 figure plus confirmation that B&H's current list price is still
  $1,999 (Best Buy's $1,599 is a discount, not a new RRP — not used).
- **Rejected**: an untracked `scripts/price-overrides/nikon.json` found in
  the dead agent's worktree, listing CAD figures for
  `tamron-12-20mm-f28`/`tamron-35-100mm-f28`/`tamron-70-180mm-f28-g2`/
  `tamron-90mm-f28-macro` — none of these slugs exist in `nikon/data.js`.
  No source trail, no corresponding entry. Discarded as premature/stray
  content, not used.
- **T1** `sigma-global.com`'s Nikon Z mount filter — re-confirmed only the
  existing 3 DC DN primes (16/30/56mm) list Z; 18-50/10-18/23mm DC DN and all
  DG DN (full-frame) checked individually, none list Nikon Z.
- **T4** PetaPixel (2025-11-02) — corroborating-only mention that Nikon
  still blocks Sigma full-frame AF lenses from Z-mount.

## Laowa + Samyang batch (2026-08-30)

### Samyang investigation (do this first — see PROGRESS.md for full narrative)

- **Git history**: `git log --all -p -- nikon/data.js | grep -n samyang` found
  the removal commit `9266255` ("Fix dead product links across
  Nikon/Panasonic/third-party lenses; remove 2 bad entries", 2026-07-13):
  round 1 had entered exactly one Samyang lens, `samyang-135mm-f18` (AF
  135mm F1.8), sourced from
  `https://samyangus.com/products/135mm-f1-8-af-full-frame-telephoto-nikon-z`.
  That commit removed it with the stated reason "Samyang's Nikon Z lineup
  doesn't include this lens (their AF 135mm F1.8 is Sony E-only)" — a
  deliberate mount-fabrication fix, the same class of error as the
  `tamron-11-20mm-f28` removal in PR #25, not an unrelated link-rot cleanup.
- **T1** `https://samyangus.com/collections/nikon-z` — Samyang's official US
  storefront's own Nikon-Z-mount collection filter. Independently re-verified
  from scratch (not trusting the removed entry or any old claim): the
  collection returns exactly **2 products**, both tagged "Manual Focus" in
  the left-rail facets — `14mm F2.8 Full Frame Ultra Wide Angle (Nikon Z)`
  and `85mm F1.4 Full Frame Telephoto (Nikon Z)`. No AF lens appears.
- **T2** `https://nikonrumors.com/2026/03/05/samyang-is-waiting-on-licensing-from-nikon-to-start-making-z-mount-lenses.aspx`
  and `https://www.digitalcameraworld.com` (2026-04-08 piece, "Will Samyang
  ever make AF Nikon Z lenses? Not until it becomes officially licensed") —
  both confirm, independently of the maker, that Nikon has **not** licensed
  Samyang for AF Z-mount lenses as of early-to-mid 2026. This resolves the
  apparent contradiction: the 135mm f/1.8 AF removal was correct (Samyang
  cannot ship AF Z lenses without Nikon's license), but Samyang's classic
  **manual-focus, no-electronic-contact** lenses don't need that license and
  have shipped in Z-mount since 2019 — they were simply never entered.
- **T1** `https://samyangus.com/products/14mm-f2-8-full-frame-ultra-wide-angle-nikon-z`
  (SKU SYZ14-N) — full Specifications accordion; page prose: "the first 14mm
  prime lens with precision manual focus control to be available in Nikon Z
  mount... As Samyang's first lens for Nikon Z mount". Customer reviews
  dated back to 2019-12-30, confirming a real, long-standing listing (not
  freshly staged for this check).
- **T1** `https://samyangus.com/products/85mm-f1-4-full-frame-telephoto-nikon-z`
  (SKU SYZ85-N) — full Specifications accordion; reviews dated back to
  2020-09-13.

### Laowa Nikon Z re-enumeration

- **T1** `https://www.venuslens.net/shop/?product_cat=camera-lenses&product_view=list&product_count=200` —
  full 72-product camera-lens shop listing, read end-to-end. Cross-referenced
  every product's mount-availability prose/dropdown against "Nikon Z". Found
  21 lenses genuinely shipping in Nikon Z beyond the 3 already entered
  (`laowa-10mm-f4-cookie`, `laowa-15mm-f2`, `laowa-90mm-f28-macro`) — see
  research/lenses.md for the full per-lens ledger with individual T1/T2
  citations. Excluded as out-of-scope: probe lenses (24mm T14 2X
  Probe/PeriProbe — waterproof macro-photography tools, not conventional
  stills lenses) and cine-only T-stop variants (12mm T2.9 Zero-D Cine, 15mm
  T2.1 Zero-D Cine, 7.5mm T2.9 MFT Cine) per the skill's cine/specialty
  exclusion.
- **Trap encountered and resolved**: `laowa-65mm-f-2-8-2x-ultra-macro-apo`'s
  own Specifications-tab "Mounts" row is stale (lists only Fuji X/Sony
  E/Canon EF-M), but the *live* Mount purchase dropdown on the same page and
  the page's own description prose ("The lens features Fujifilm X, Sony E,
  Nikon Z and Canon M，RF mount") both list Nikon Z — trusted the
  dropdown/prose (what a buyer can actually select and check out with) over
  the evidently-outdated static spec-table row, consistent with the skill's
  "always confirm mount against the maker" guidance applied at the
  most-current layer of the maker's own page.
- **T1 (regional)** `laowalenses.ca` (Laowa's official Canada storefront) used
  extensively as a fallback/corroboration source — several lenses' full
  numeric spec tables (elements/groups, min aperture, per-mount weight
  breakdowns) render cleanly there via WebFetch where venuslens.net's own
  React-driven "Specifications" tab required browser interaction (Cloudflare
  bot-check + client-side tab switching) to reveal.
- **T2** jonasraskphotography.com — used for 2 Argus-series lenses (33mm
  f/0.95, and general corroboration): a genuine hands-on reviewer who
  publishes full maker-style tech-spec blocks in every review, useful when
  venuslens.net's own Specifications tab is empty for a given SKU.
- **Conflict resolved, `laowa-argus-33mm-f-0-95-cf-apo` minimum aperture**:
  3 independent T2 hands-on reviews (jonasraskphotography.com,
  photorumors.com, digitalcameraworld.com) state f/16; one outlier
  (sonyalpha.blog, an AI-summarized aggregator page) claims f/11 with a
  "surprisingly" framing that reads as a misreading of the DOF-scale marking
  rather than a genuine physical-limit finding. Majority-independent T2 (f/16)
  used; both recorded in research/lenses.md.
