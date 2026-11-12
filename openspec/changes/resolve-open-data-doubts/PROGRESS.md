# Progress — resolve open data doubts (after #83)

**Branch:** cleanup-archive-nov2026 (from main 5a2f4b6)
**Resume at:** 2.1

**Owner (2026-11-08):** "Please do a cleanup, and also please start the
research on the new errors you have just found." The three errors found
during #83 (Samyang 14mm X price, 8mm Fisheye II name, TTArtisan TS 17 years)
were already fixed there, so this covers the items #83 could not settle plus
two noticed while checking.

## 1.1 Cleanup (done 2026-11-08)

- 13 OpenSpec changes archived (#78, #83, #77 and four older finished ones,
  plus the two stale Canon/Nikon third-party changes). Nine legacy main specs
  got `## Purpose` / `## Requirements` so the CLI could apply deltas;
  adopt-design-system's "Engine is brand-agnostic" delta now keeps the
  registry sentences from cross-brand-compare. Left open: add-indexnow,
  add-share-images, add-sitemap-lastmod, canon-firstparty-lens-gaps (owner
  checks pending), expand-correctness-tests, expand-panasonic-lineup.
- Worktrees removed (all merged, nothing uncommitted; symlinked node_modules
  unlinked first): fuji-compare-canon-sony, -laowa-fuji, -tool-cache-fujifilm-
  images, -tool-events, -tool-oct-followups, -tool-refresh-sigma-olympus and
  .claude/worktrees add-indexnow, add-share-images, noindex-thin-vs-pages,
  sitemap-lastmod. Kept: the main checkout (on archive-add-leica-brand, with
  untracked .tmp-review/ and openspec/changes/add-olympus-brand/),
  fuji-compare-tool-main, this worktree.
- 17 merged local branches and 13 merged GitHub branches deleted (GitHub now
  has only main + this branch).

## 2. Release years (done 2026-11-08)

- Samyang 8mm f/3.5 CS II: Sony E 2020 -> 2013 (B&H Rokinon HD8M-NEX listing
  archived 2013-11-26), MFT 2020 -> 2014 (B&H HD8M-MFT archived 2014-04-06).
  The Wayback CDX API stayed down; the availability API
  (archive.org/wayback/available?timestamp=1996&url=...) gives the earliest
  capture and works.
- SG-image 25mm f/1.8 MF 2025 -> 2024 (China price 298 CNY, Feb 2024, all
  seven mounts); 50mm f/1.8 Phantom 2025 -> 2024 (on sale in Japan
  2024-10-31, RF/E/Z/X/MFT/L); 35mm f/0.95 2025 confirmed (first sale
  2025-07-29; the April 2024 announcement had no price).
- 7Artisans M 28 f/1.4 2019 -> 2018 (in stock US/Canada/Europe 2018-11-23).

## 3. Specs (done 2026-11-08)

- Thypoch widest diameters from Phillip Reeve's measured specs (Thypoch and
  B&H give only the front diameter): Eureka 28 28.3 -> 52, Eureka 50 35.9 ->
  50, Ksana 21 42 -> 57, Ksana 35 42 -> 51 mm; measured magnifications filled.
- Motor labels: Sigma 105 DG DN Macro -> HSM on Sony, Sigma, Leica, Panasonic
  (Sigma's own release: "Hypersonic Motor"; the L entries' "Stepping Motor"
  was wrong too); Zeiss Touit x6 -> DC Motor (B&H, every listing); Tamron OSD
  x3 -> DC Motor (Tamron: "OSD ... DC motor"); Samyang AF 85 FE (gen 1) ->
  Dual Linear Sonic Motor (Optical Limits). **Left generic, maker silent:**
  Laowa 180 / 200 / ACRIS 35 / 12 Lite ("Focus Type: AF" is all Laowa
  publishes), 7Artisans AF 10 on X. Samyang AF 14 / 35 FE "STM" is Samyang's
  own table wording - kept.
- Samyang AF 75 FE: unsealed confirmed (FE spec table lists no sealing;
  reviews say absent); the later X version is sealed - genuine difference.

## 4. Prices (2026-11-08)

- 4.2 Fujifilm Samyang 8mm f/2.8 Fisheye II: USD 239 -> 249 (Samyang US
  selling price; B&H $249 holiday price from $279); unsourced regionals ->
  null.
- 4.1 **Canon EOS R100 CAD: owner decision needed.** Canon Canada sells only
  the RF-S18-45 kit (MSRP $899.99, 6052C012); photoprice.ca's body-only page
  lists US dealers only; Best Buy Canada's body listing blocks automated
  reads. No citable Canadian body-only price exists. A current camera needs
  all seven currencies, so CAD 599 stays (unsourced) unless the owner picks
  another rule.
