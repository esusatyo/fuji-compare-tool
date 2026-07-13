## Context

Brand pages are thin loaders (`engine.css` → `data.js` → `engine.js`) rendered entirely client-side; crawlers see empty bodies. The engine footer hardcodes "Data last updated: April 2026" (stale — data last changed 2026-07-03). The repo invariant is zero runtime dependencies and no build step; `scripts/` already holds dev-time data tools, and `tests/helpers/load-brand.js` can evaluate brand data in Node via jsdom. Shareable hash URLs (`#cameras=a,b,c`, per-slot default fallback, partial hashes allowed) shipped in the same PR.

## Goals / Non-Goals

**Goals:**
- Crawlable, indexable content for high-intent "X vs Y" queries; correct meta/canonical/OG on every page; sitemap + robots.
- One-file domain swap at launch (`site-config.js` → rerun generator).
- Accurate, config-driven data-freshness statement; About/Privacy pages; disclosure slot ready for post-launch activation.
- Committed generated output that cannot silently go stale.

**Non-Goals:**
- Affiliate tags, ads, or the Amazon Associates disclosure text (post-launch, once traffic exists).
- Lens vs-pages (cameras only; lenses can follow post-launch if camera pages earn traffic).
- Prerendering the interactive brand pages themselves; cross-brand pages.

## Decisions

**1. `site-config.js` as a plain browser global script, evaluated by Node with the same trick the test loader uses.**
Brand pages add `<script src="../site-config.js">` before `data.js`; top-level `const SITE_CONFIG` lives in the shared global lexical environment, so `engine.js` reads it (with a `typeof` guard so pages/tests without it still work). The generator and tests evaluate the same file. Alternatives: JSON file (runtime `fetch` breaks `file://`), duplicating values (defeats the one-file swap).

**2. Placeholder domain `https://camera-compare.example`.**
`.example` is an IANA-reserved TLD — unambiguously fake, cannot leak traffic, and search engines discard cross-domain canonicals to invalid hosts, so accidental pre-launch deploys are harmless. A `TODO(launch)` comment marks the swap.

**3. Generator owns every artifact containing the base URL.**
`scripts/generate-seo.js` (re)writes: marker-delimited `<!-- seo:begin/end -->` head blocks in each brand `index.html` and root, all vs-pages, `sitemap.xml`, `robots.txt`. Hand-edited absolute URLs never exist outside `site-config.js`, so the launch swap is mechanical. Meta descriptions embed live counts from brand data (e.g. "35 cameras and 86 lenses").

**4. Curated pairings, rule-based and deterministic.**
Per brand: (a) *successors* — the data's `series` field is a broad family (Sony's "Alpha (Full-frame)" spans a7/a7R/a9/a1; Fujifilm's "X-T" spans three tiers), so model lines are derived from slug structure instead: roman-numeral generations (`a7r-v`→a7r, `x100vi`→x100, `eos-r5-ii`→eos-r5) and numbered lines split by digit count (`x-t5` flagship ≠ `x-t50` mid ≠ `x-t200` entry) with a ±40% USD price gate to reject tier-crossing false positives (Z9 vs Z5); consecutive generations pair where the newer body is current. (b) *rivals* — non-discontinued cameras sorted by USD price, each paired with its next two price neighbours. Deduped; slug `<newer>-vs-<other>.html` under `<brand>/vs/`. Yields ~20–40 pages/brand (143 site-wide at time of writing). All-pairs (Fujifilm alone: 595) was rejected as thin content. Rules live in the generator; the committed output makes the actual list reviewable in the PR diff.

**5. vs-pages read raw data fields, not engine spec functions.**
The table is built from a fixed list of schema-guaranteed fields (price USD, sensor, MP, IBIS, burst, video, weight, battery, card slots, weather sealing, year). Engine `SPEC_SECTIONS` closures depend on live engine state (currency, mode) and would couple the generator to render internals. Schema tests already pin these field shapes. Each page links into the interactive tool via `../index.html#cameras=<a>,<b>` (partial hash fills slot 3 with the brand default) and carries `Product` JSON-LD in an `ItemList`.

**6. Staleness enforcement in Tier 1.**
`tests/data/seo.test.js` re-runs the generator's pure builders in memory and asserts byte-equality with committed files (vs-pages, sitemap, robots, head blocks). Data edits that change any generated artifact fail `npm test` until the script is rerun — same "documented exception, no silent drift" philosophy as `KNOWN_IMAGE_GAPS`.

**7. Footer date from `SITE_CONFIG.dataVerified`, not `Date.now()`.**
A verification date must state when a human/audit last confirmed the data — rendering "today" would be a false claim. The `check-prices-and-buy-links` skill updates the field when it runs. Initial value 2026-07-03 (last data.js change). Disclosure slot is an empty `<div id="affiliate-disclosure">` — present in the DOM for post-launch activation, invisible while empty.

## Risks / Trade-offs

- [Generated pages bloat the repo] → ~150 small HTML files site-wide, text-only, reviewable; acceptable for a static-host workflow.
- [Marker-comment rewriting corrupts hand-edited index.html] → generator only touches content strictly between `<!-- seo:begin -->` and `<!-- seo:end -->` and fails loudly if markers are missing.
- [Pairing rules produce a page the user dislikes] → list is visible in the PR diff; rules are pure functions, easy to adjust and regenerate.
- [Placeholder canonicals ship to a live host pre-launch] → reserved TLD makes them inert (decision 2); Phase F swap is a tracked roadmap task.

## Migration Plan

Additive. Launch swap (Phase F): edit `site-config.js` → `node scripts/generate-seo.js` → commit. Rollback = revert PR.

## Open Questions

None.
