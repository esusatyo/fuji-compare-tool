# Research: vs-page indexability data (pulled 2026-09-27)

_Data pulled 2026-09-27. Production = `origin/main` (637dd05)._

## Data used

- **Google Search Console, Performance → Pages, last 3 months** (Jul 16 – Sep 24): 89 URLs with impressions; site total 1.11K impressions, 6 clicks. `.html` and clean variants of the same page are merged.
- **Search Console, Page indexing:** 83 indexed; 194 "Discovered – currently not indexed" (157 on Sep 2); 54 page-with-redirect; **21 not found (404)** (3 on Sep 2).
- **GoatCounter, all-time vs-page pageviews:** 76 views across 37 pages. Treated as a weak signal only: most views came from Reddit, one reader's Canon session, or preview-branch testing, not from search.
- **Production vs-page set:** regenerated with the generator's own `curatedPairs` / `resolveMatchups` code. That gives **291 vs-pages**: 218 same-brand and 73 cross-brand.

## What the data says

1. **Three quarters of the vs-pages have never been shown in Google.** Only 71 of 291 have any signal. Leica, Olympus and Sigma (46 pages) have none at all.
2. **Pages differ a lot by how they are generated.** Share of pages with any signal:
   - successor pairs (e.g. "A7 V vs A7 IV"): **46%**
   - cross-brand pages: 25%
   - price-neighbour pairs (the two nearest-priced current bodies): **17%**
3. **The price-neighbour rule removes pages that Google already shows.** Price-neighbour pairs are recomputed whenever a price changes. 11 URLs that earned impressions now return 404, including `/panasonic/vs/s1-ii-vs-s1h` (1 click, 47 impressions, the site's third-best vs-page) and `/sony/vs/fx3-vs-a7s-iii` (13 impressions). That explains why 404s rose from 3 to 21 after the September price refreshes. It also means the set of pages is always changing, which works against Google building trust in them.
4. **Noindexing costs almost nothing.** Of the 202 pages proposed for noindex, 0 have a Search Console impression. They are essentially the "discovered – not indexed" backlog, so no existing search traffic is lost.

## Rules (in priority order)

1. **Keep if it earned any Search Console impression in 3 months** (50 pages, 13 of them also successor pairs). Google already shows these, so removing them is the only step that costs something.
2. **Keep every successor pair** (52 pages, 39 of them not already kept by rule 1), except four false matches from the successor rule (below). These are stable when prices change, match the most common "new vs old model" search, and have the best hit rate. This also keeps new-release pages indexed automatically, so they can appear in search from launch day.
3. **Noindex everything else** (202 pages): price-neighbour and cross-brand pages with no impressions. Pages stay live and linked for visitors (`noindex, follow`) and are removed from the sitemap.
4. **GoatCounter-only views don't earn a keep.** 8 noindex pages have 1–2 GoatCounter views and no Google impression; none of those views came from search.

**Successor-rule false matches, proposed for noindex.** They share a number stem but aren't one model line, and have 0 impressions:
- `canon/vs/eos-r8-vs-eos-r7`
- `canon/vs/eos-r7-vs-eos-r6`
- `canon/vs/eos-r3-vs-eos-r5`
- `canon/vs/eos-r50-vs-eos-r10`

**Result: 89 indexed / 202 noindex**, down from 291 in the sitemap.

## Fix the churn (do this in the same change)

Pages must stop disappearing when a price changes:

- **Add a pinned list to the generator,** for example `PINNED_VS_PAIRS` in `scripts/generate-seo.js`. A pinned pair is always generated and indexed, whatever the pairing rules say. Pin all 50 impression-earning pages listed in Appendix A.
- **Bring back the dropped pages with ≥5 impressions** by adding them to the pin list:
  - `/panasonic/vs/s1-ii-vs-s1h` (47)
  - `/sony/vs/fx3-vs-a7s-iii` (13)
  - `/fujifilm/vs/x-t50-vs-x100v` (7)
  - `/canon/vs/eos-r50v-vs-eos-r10` (5)
- **Redirect the reversed-order cross-brand URL** `/vs/canon-eos-r1-vs-sony-a9-iii` to `/vs/sony-a9-iii-vs-canon-eos-r1` with a 301 in `_redirects`.
- **Leave the other 6 dropped URLs as 404s.** They had 1–3 impressions each and will drop out of Search Console.

## Implementation outline

1. In `generate-seo.js`, compute an `indexable` flag per page: pinned, or a successor pair not on a small `SUCCESSOR_EXCLUDE` list. Non-indexable pages get `<meta name="robots" content="noindex, follow">` and are left out of `sitemapXML`.
2. Keep the canonical tag on noindexed pages (still self-referencing), and keep them in brand-page and related-comparison links so visitors can still reach them.
3. Tests:
   - every pinned pair resolves to a real camera;
   - pinned pages are always generated;
   - the sitemap contains exactly the indexable set;
   - no indexable page carries `noindex`;
   - the sitemap count changes 303 → about 101 (89 vs-pages + home, brand pages, compare, about, privacy).
4. Run `npm test` and `test:links`, deploy, then resubmit the sitemap in Search Console.
5. **Review about 8 weeks after deploy.** Promote any noindexed pair that shows up in Search Console queries by adding it to the pin list, and demote successor pairs for discontinued bodies that still have 0 impressions.

## Risks and caveats

- **The data is thin:** 1.1K impressions and 6 clicks in total. The rules are chosen so the only pages removed are ones with zero evidence, and noindex is fully reversible.
- **Google only sees `noindex` when it crawls a page,** and most of these pages have never been crawled. The main effect comes from removing them from the sitemap, not from the meta tag itself.
- **Written verdicts for the kept pages** (the recommended next step) are a separate change. This plan only narrows which pages Google is asked to judge.

## Appendix A — Keep indexed (89)

| Page | Type | GSC impr (3 mo) | GSC clicks | GoatCounter views |
|---|---|---|---|---|
| `/panasonic/vs/l10-vs-s9` | price-nbr | 62 | 2 | 26 |
| `/canon/vs/eos-r50v-vs-eos-r50` | successor | 51 | 0 | 1 |
| `/vs/nikon-zf-vs-fujifilm-x-t5` | cross | 33 | 0 | 0 |
| `/panasonic/vs/s1r-ii-vs-s1h` | price-nbr | 24 | 0 | 0 |
| `/vs/canon-eos-r5-ii-vs-sony-a7r-v` | cross | 19 | 0 | 0 |
| `/sony/vs/a7-v-vs-a7-iv` | successor | 15 | 0 | 0 |
| `/vs/fujifilm-x-t50-vs-nikon-zfc` | cross | 15 | 0 | 0 |
| `/nikon/vs/zr-vs-z5-ii` | price-nbr | 12 | 0 | 0 |
| `/panasonic/vs/s5-iix-vs-s5-ii` | price-nbr | 12 | 0 | 0 |
| `/vs/sony-zv-e10-ii-vs-fujifilm-x-m5` | cross | 12 | 0 | 0 |
| `/panasonic/vs/s9-vs-g9-ii` | price-nbr | 11 | 0 | 0 |
| `/canon/vs/eos-r5-ii-vs-eos-r5` | successor | 9 | 0 | 2 |
| `/canon/vs/eos-r6-iii-vs-eos-r5` | price-nbr | 9 | 0 | 0 |
| `/vs/sony-a1-ii-vs-canon-eos-r5-ii` | cross | 9 | 0 | 2 |
| `/panasonic/vs/s9-vs-s5` | successor | 8 | 0 | 0 |
| `/panasonic/vs/s9-vs-g100d` | price-nbr | 7 | 0 | 0 |
| `/vs/nikon-zr-vs-sony-zv-e1` | cross | 7 | 0 | 0 |
| `/vs/sony-a1-ii-vs-canon-eos-r1` | cross | 7 | 1 | 1 |
| `/panasonic/vs/s1r-ii-vs-s1-ii` | price-nbr | 6 | 0 | 0 |
| `/canon/vs/eos-r1-vs-eos-r3` | successor | 5 | 0 | 1 |
| `/canon/vs/eos-r6-iii-vs-eos-r5c` | price-nbr | 5 | 0 | 1 |
| `/canon/vs/eos-r8-vs-eos-r10` | price-nbr | 4 | 0 | 1 |
| `/fujifilm/vs/x-t50-vs-x-s20` | price-nbr | 4 | 0 | 0 |
| `/panasonic/vs/g9-ii-vs-g9` | successor | 4 | 0 | 0 |
| `/vs/canon-eos-r6-iii-vs-nikon-z6-iii` | cross | 4 | 0 | 0 |
| `/vs/sony-a1-ii-vs-nikon-z9` | cross | 4 | 0 | 1 |
| `/vs/sony-a7r-vi-vs-canon-eos-r5-ii` | cross | 4 | 0 | 4 |
| `/canon/vs/eos-r7-vs-eos-r10` | price-nbr | 3 | 0 | 0 |
| `/panasonic/vs/l10-vs-g9-ii` | price-nbr | 3 | 0 | 0 |
| `/panasonic/vs/s1-ii-vs-s1` | successor | 3 | 0 | 1 |
| `/sony/vs/a7r-v-vs-a7r-iv` | successor | 3 | 0 | 1 |
| `/sony/vs/zv-e1-vs-fx30` | price-nbr | 3 | 0 | 0 |
| `/vs/sony-a7s-iii-vs-panasonic-s1h` | cross | 3 | 0 | 0 |
| `/fujifilm/vs/x-e5-vs-x100vi` | price-nbr | 2 | 0 | 0 |
| `/fujifilm/vs/x-h2s-vs-x-h2` | price-nbr | 2 | 0 | 0 |
| `/nikon/vs/z5-ii-vs-z5` | successor | 2 | 0 | 0 |
| `/panasonic/vs/gh7-vs-gh6` | successor | 2 | 1 | 1 |
| `/panasonic/vs/s5-ii-vs-g9-ii` | price-nbr | 2 | 0 | 0 |
| `/vs/canon-eos-r10-vs-sony-a6400` | cross | 2 | 0 | 0 |
| `/vs/nikon-z8-vs-sony-a7r-v` | cross | 2 | 0 | 0 |
| `/nikon/vs/z50-ii-vs-z50` | successor | 1 | 0 | 0 |
| `/nikon/vs/z6-iii-vs-zf` | price-nbr | 1 | 0 | 0 |
| `/nikon/vs/zr-vs-zf` | price-nbr | 1 | 0 | 0 |
| `/panasonic/vs/gh6-vs-gh5` | successor | 1 | 0 | 0 |
| `/panasonic/vs/s1r-ii-vs-s1r` | successor | 1 | 0 | 0 |
| `/sony/vs/a7-v-vs-a7s-iii` | price-nbr | 1 | 0 | 0 |
| `/sony/vs/a7cr-vs-a7s-iii` | price-nbr | 1 | 0 | 0 |
| `/vs/nikon-z6-iii-vs-panasonic-s5-ii` | cross | 1 | 0 | 0 |
| `/vs/sony-a7-v-vs-nikon-z6-iii` | cross | 1 | 0 | 3 |
| `/vs/sony-a7c-ii-vs-canon-eos-r8` | cross | 1 | 0 | 0 |
| `/canon/vs/eos-r6-ii-vs-eos-r6` | successor | 0 | 0 | 2 |
| `/canon/vs/eos-r6-iii-vs-eos-r6-ii` | successor | 0 | 0 | 1 |
| `/canon/vs/eos-r6-v-vs-eos-r6-iii` | successor | 0 | 0 | 1 |
| `/canon/vs/eos-r8-ii-vs-eos-r8` | successor | 0 | 0 | 0 |
| `/fujifilm/vs/x-h2-vs-x-h1` | successor | 0 | 0 | 0 |
| `/fujifilm/vs/x-m5-vs-x-m1` | successor | 0 | 0 | 0 |
| `/fujifilm/vs/x-s20-vs-x-s10` | successor | 0 | 0 | 1 |
| `/fujifilm/vs/x-t30iii-vs-x-t30ii` | successor | 0 | 0 | 1 |
| `/fujifilm/vs/x-t5-vs-x-t4` | successor | 0 | 0 | 0 |
| `/fujifilm/vs/x100vi-vs-x100v` | successor | 0 | 0 | 1 |
| `/leica/vs/d-lux-8-vs-d-lux-7` | successor | 0 | 0 | 0 |
| `/leica/vs/m11-vs-m10` | successor | 0 | 0 | 0 |
| `/leica/vs/q3-vs-q2` | successor | 0 | 0 | 0 |
| `/leica/vs/sl3-vs-sl2` | successor | 0 | 0 | 0 |
| `/nikon/vs/z6-ii-vs-z6` | successor | 0 | 0 | 0 |
| `/nikon/vs/z6-iii-vs-z6-ii` | successor | 0 | 0 | 0 |
| `/nikon/vs/z7-ii-vs-z7` | successor | 0 | 0 | 0 |
| `/nikon/vs/z8-vs-z7` | successor | 0 | 0 | 0 |
| `/nikon/vs/z8-vs-z9` | successor | 0 | 0 | 0 |
| `/olympus/vs/om-1-ii-vs-om-1` | successor | 0 | 0 | 0 |
| `/olympus/vs/om-3-vs-om-1` | successor | 0 | 0 | 0 |
| `/olympus/vs/om-5-ii-vs-om-5` | successor | 0 | 0 | 0 |
| `/olympus/vs/tg-7-vs-tg-6` | successor | 0 | 0 | 0 |
| `/panasonic/vs/g97-vs-g95` | successor | 0 | 0 | 0 |
| `/panasonic/vs/s5-ii-vs-s5` | successor | 0 | 0 | 3 |
| `/sony/vs/a1-ii-vs-a1` | successor | 0 | 0 | 1 |
| `/sony/vs/a6400-vs-a6300` | successor | 0 | 0 | 0 |
| `/sony/vs/a6700-vs-a6600` | successor | 0 | 0 | 0 |
| `/sony/vs/a7-iii-vs-a7-ii` | successor | 0 | 0 | 0 |
| `/sony/vs/a7-iv-vs-a7-iii` | successor | 0 | 0 | 2 |
| `/sony/vs/a7c-ii-vs-a7c` | successor | 0 | 0 | 0 |
| `/sony/vs/a7r-iv-vs-a7r-iii` | successor | 0 | 0 | 0 |
| `/sony/vs/a7r-vi-vs-a7r-v` | successor | 0 | 0 | 0 |
| `/sony/vs/a7s-iii-vs-a7s-ii` | successor | 0 | 0 | 0 |
| `/sony/vs/a9-ii-vs-a9` | successor | 0 | 0 | 0 |
| `/sony/vs/a9-iii-vs-a9-ii` | successor | 0 | 0 | 0 |
| `/sony/vs/fx2-vs-fx3` | successor | 0 | 0 | 0 |
| `/sony/vs/fx5-vs-fx3` | successor | 0 | 0 | 0 |
| `/sony/vs/zv-e10-ii-vs-zv-e10` | successor | 0 | 0 | 0 |

## Appendix B — Noindex (202)

### canon (21)

- `/canon/vs/eos-r8-vs-eos-r7` _(successor-rule misfire)_ — 1 GoatCounter view(s), 0 GSC
- `/canon/vs/eos-r7-vs-eos-r6` _(successor-rule misfire)_ — 2 GoatCounter view(s), 0 GSC
- `/canon/vs/eos-r3-vs-eos-r5` _(successor-rule misfire)_ — 1 GoatCounter view(s), 0 GSC
- `/canon/vs/eos-r50-vs-eos-r10` _(successor-rule misfire)_ — 1 GoatCounter view(s), 0 GSC
- `/canon/vs/eos-r1-vs-eos-r5-ii`
- `/canon/vs/eos-r5-ii-vs-eos-r3` — 1 GoatCounter view(s), 0 GSC
- `/canon/vs/eos-r5c-vs-eos-r3`
- `/canon/vs/eos-r5-ii-vs-eos-r5c` — 1 GoatCounter view(s), 0 GSC
- `/canon/vs/eos-r5c-vs-eos-r5`
- `/canon/vs/eos-r6-v-vs-eos-r5`
- `/canon/vs/eos-r6-v-vs-eos-r6-ii` — 1 GoatCounter view(s), 0 GSC
- `/canon/vs/eos-r6-v-vs-eos-r8-ii`
- `/canon/vs/eos-r8-ii-vs-eos-r6-ii`
- `/canon/vs/eos-r6-ii-vs-eos-r7`
- `/canon/vs/eos-r8-ii-vs-eos-r7`
- `/canon/vs/eos-r8-vs-eos-rp`
- `/canon/vs/eos-r10-vs-eos-rp`
- `/canon/vs/eos-r50-vs-eos-rp` — 1 GoatCounter view(s), 0 GSC
- `/canon/vs/eos-r50v-vs-eos-rp`
- `/canon/vs/eos-r50-vs-eos-r100`
- `/canon/vs/eos-r50v-vs-eos-r100` — 1 GoatCounter view(s), 0 GSC

### fujifilm (20)

- `/fujifilm/vs/gfx100s-ii-vs-gfx100-ii`
- `/fujifilm/vs/gfx100rf-vs-gfx100-ii`
- `/fujifilm/vs/gfx100rf-vs-gfx100s-ii`
- `/fujifilm/vs/gfx100s-ii-vs-x-h2s`
- `/fujifilm/vs/gfx100rf-vs-x-h2s`
- `/fujifilm/vs/gfx100rf-vs-x-h2`
- `/fujifilm/vs/x-h2s-vs-x-t5`
- `/fujifilm/vs/x-h2-vs-x-t5`
- `/fujifilm/vs/x100vi-vs-x-h2`
- `/fujifilm/vs/x100vi-vs-x-t5`
- `/fujifilm/vs/x-e5-vs-x-t5`
- `/fujifilm/vs/x100vi-vs-x-t50`
- `/fujifilm/vs/x-e5-vs-x-t50`
- `/fujifilm/vs/x-e5-vs-x-s20`
- `/fujifilm/vs/x-t30iii-vs-x-t50`
- `/fujifilm/vs/x-t30iii-vs-x-s20`
- `/fujifilm/vs/x-m5-vs-x-s20`
- `/fujifilm/vs/x-t30iii-vs-x-m5`
- `/fujifilm/vs/x-t30iii-vs-x-half`
- `/fujifilm/vs/x-half-vs-x-m5`

### leica (21)

- `/leica/vs/m11-d-vs-m11-monochrom`
- `/leica/vs/m11-monochrom-vs-m11`
- `/leica/vs/m11-d-vs-m11`
- `/leica/vs/m11-d-vs-m11-p`
- `/leica/vs/m11-p-vs-m11`
- `/leica/vs/m-ev1-vs-m11`
- `/leica/vs/m-ev1-vs-m11-p`
- `/leica/vs/q3-43-vs-m11-p`
- `/leica/vs/m-ev1-vs-q3-43`
- `/leica/vs/m-ev1-vs-q3-monochrom`
- `/leica/vs/q3-monochrom-vs-q3-43`
- `/leica/vs/q3-43-vs-sl3`
- `/leica/vs/q3-monochrom-vs-sl3`
- `/leica/vs/q3-monochrom-vs-q3`
- `/leica/vs/sl3-vs-q3`
- `/leica/vs/sl3-p-vs-sl3`
- `/leica/vs/sl3-p-vs-q3`
- `/leica/vs/sl3-s-vs-q3`
- `/leica/vs/sl3-p-vs-sl3-s`
- `/leica/vs/sl3-p-vs-d-lux-8`
- `/leica/vs/sl3-s-vs-d-lux-8`

### nikon (16)

- `/nikon/vs/z9-vs-z7-ii`
- `/nikon/vs/z8-vs-z7-ii`
- `/nikon/vs/z6-iii-vs-z8`
- `/nikon/vs/z6-iii-vs-z7-ii`
- `/nikon/vs/zf-vs-z7-ii`
- `/nikon/vs/zr-vs-z6-iii`
- `/nikon/vs/z5-ii-vs-zf`
- `/nikon/vs/zr-vs-z6-ii`
- `/nikon/vs/z5-ii-vs-z6-ii`
- `/nikon/vs/z6-ii-vs-z5`
- `/nikon/vs/zfc-vs-z6-ii`
- `/nikon/vs/zfc-vs-z5`
- `/nikon/vs/z50-ii-vs-z5`
- `/nikon/vs/z50-ii-vs-zfc`
- `/nikon/vs/z30-vs-zfc`
- `/nikon/vs/z50-ii-vs-z30`

### olympus (9)

- `/olympus/vs/om-3-astro-vs-om-1-ii`
- `/olympus/vs/om-3-astro-vs-om-3`
- `/olympus/vs/om-3-vs-om-1-ii`
- `/olympus/vs/om-5-ii-vs-om-1-ii`
- `/olympus/vs/om-3-vs-om-5-ii`
- `/olympus/vs/pen-om-vs-om-3`
- `/olympus/vs/pen-om-vs-om-5-ii`
- `/olympus/vs/om-5-ii-vs-tg-7`
- `/olympus/vs/pen-om-vs-tg-7`

### panasonic (18)

- `/panasonic/vs/bs1h-vs-s1h`
- `/panasonic/vs/s1r-ii-vs-bs1h`
- `/panasonic/vs/s1-ii-vs-bs1h`
- `/panasonic/vs/s1r-ii-vs-s1iie`
- `/panasonic/vs/s1-ii-vs-s1iie`
- `/panasonic/vs/s1-ii-vs-gh6`
- `/panasonic/vs/s1iie-vs-gh6`
- `/panasonic/vs/s1iie-vs-gh7`
- `/panasonic/vs/s5-iix-vs-gh6`
- `/panasonic/vs/gh7-vs-s5-iix`
- `/panasonic/vs/gh7-vs-s5-ii`
- `/panasonic/vs/s5-iix-vs-bgh1`
- `/panasonic/vs/s5-ii-vs-bgh1`
- `/panasonic/vs/g9-ii-vs-bgh1`
- `/panasonic/vs/l10-vs-bgh1`
- `/panasonic/vs/l10-vs-g97`
- `/panasonic/vs/g97-vs-s9`
- `/panasonic/vs/g97-vs-g100d`

### sigma (7)

- `/sigma/vs/bf-vs-fp-l`
- `/sigma/vs/fp-l-vs-fp`
- `/sigma/vs/bf-vs-fp`
- `/sigma/vs/bf-vs-sd-quattro-h`
- `/sigma/vs/fp-vs-sd-quattro-h`
- `/sigma/vs/fp-vs-sd-quattro`
- `/sigma/vs/sd-quattro-h-vs-sd-quattro`

### sony (33)

- `/sony/vs/a1-ii-vs-a9-iii`
- `/sony/vs/a9-iii-vs-a1`
- `/sony/vs/fx5-vs-a9-iii`
- `/sony/vs/fx5-vs-a1`
- `/sony/vs/a7r-vi-vs-a1`
- `/sony/vs/fx5-vs-a7r-vi`
- `/sony/vs/fx5-vs-a9-ii`
- `/sony/vs/a7r-vi-vs-a9-ii`
- `/sony/vs/a7r-vi-vs-fx3`
- `/sony/vs/fx3-vs-a9-ii`
- `/sony/vs/a7r-v-vs-a9-ii`
- `/sony/vs/a7r-v-vs-fx3`
- `/sony/vs/fx3-vs-a7r-iv`
- `/sony/vs/a7r-v-vs-a7s-iii`
- `/sony/vs/a7s-iii-vs-a7r-iv`
- `/sony/vs/a7cr-vs-a7r-iv`
- `/sony/vs/a7-v-vs-a7cr`
- `/sony/vs/fx2-vs-a7cr`
- `/sony/vs/a7-v-vs-fx2`
- `/sony/vs/fx2-vs-a7-iv`
- `/sony/vs/fx2-vs-zv-e1`
- `/sony/vs/zv-e1-vs-a7-iv`
- `/sony/vs/a7c-ii-vs-a7-iv`
- `/sony/vs/zv-e1-vs-a7c-ii`
- `/sony/vs/a7c-ii-vs-fx30`
- `/sony/vs/a7c-ii-vs-a7-iii`
- `/sony/vs/fx30-vs-a7-iii`
- `/sony/vs/a6700-vs-fx30`
- `/sony/vs/a6700-vs-a7-iii`
- `/sony/vs/zv-e10-ii-vs-a7-iii`
- `/sony/vs/zv-e10-ii-vs-a6700`
- `/sony/vs/a6700-vs-a6400` — 1 GoatCounter view(s), 0 GSC
- `/sony/vs/zv-e10-ii-vs-a6400`

### Cross-brand (/vs/) (57)

- `/vs/sony-a9-iii-vs-canon-eos-r1` — 1 GoatCounter view(s), 0 GSC
- `/vs/canon-eos-r1-vs-nikon-z9` — 2 GoatCounter view(s), 0 GSC
- `/vs/sony-a7r-vi-vs-nikon-z8`
- `/vs/canon-eos-r5-ii-vs-nikon-z8`
- `/vs/panasonic-s1r-ii-vs-sony-a7r-v`
- `/vs/panasonic-s1r-ii-vs-nikon-z8`
- `/vs/panasonic-s1r-ii-vs-canon-eos-r5-ii`
- `/vs/panasonic-s1r-ii-vs-sony-a7cr`
- `/vs/canon-eos-r6-ii-vs-sony-a7-iv`
- `/vs/sony-a7-v-vs-canon-eos-r6-iii`
- `/vs/nikon-z6-iii-vs-sony-a7-iv`
- `/vs/panasonic-s5-ii-vs-sony-a7-iv`
- `/vs/panasonic-s5-ii-vs-canon-eos-r6-ii`
- `/vs/panasonic-s1-ii-vs-sony-a7-v`
- `/vs/canon-eos-r6-v-vs-sony-a7-v`
- `/vs/canon-eos-r6-v-vs-nikon-z6-iii`
- `/vs/nikon-z5-ii-vs-canon-eos-r8`
- `/vs/nikon-z5-ii-vs-sony-a7c-ii`
- `/vs/sony-a7c-ii-vs-panasonic-s5-ii`
- `/vs/panasonic-s9-vs-sony-a7c-ii`
- `/vs/panasonic-s9-vs-canon-eos-r8`
- `/vs/nikon-z5-ii-vs-panasonic-s5-ii`
- `/vs/sony-fx3-vs-panasonic-s1h`
- `/vs/canon-eos-r5c-vs-sony-fx3`
- `/vs/panasonic-s9-vs-sony-zv-e1`
- `/vs/nikon-zr-vs-panasonic-s5-iix`
- `/vs/panasonic-gh7-vs-sony-fx30`
- `/vs/fujifilm-x-h2s-vs-sony-fx30`
- `/vs/panasonic-gh7-vs-fujifilm-x-h2s`
- `/vs/fujifilm-x-t5-vs-sony-a7-iv`
- `/vs/sony-a6700-vs-fujifilm-x-t5`
- `/vs/fujifilm-x-t5-vs-canon-eos-r7`
- `/vs/fujifilm-x-h2-vs-canon-eos-r7`
- `/vs/fujifilm-x-h2-vs-sony-a7-iv`
- `/vs/fujifilm-x-h2s-vs-canon-eos-r7`
- `/vs/sony-a6700-vs-canon-eos-r7`
- `/vs/nikon-z50-ii-vs-sony-a6700`
- `/vs/nikon-z50-ii-vs-canon-eos-r7`
- `/vs/panasonic-g9-ii-vs-canon-eos-r7`
- `/vs/fujifilm-x-t50-vs-sony-a6700`
- `/vs/fujifilm-x-s20-vs-sony-a6700`
- `/vs/fujifilm-x-s20-vs-canon-eos-r10`
- `/vs/nikon-z50-ii-vs-canon-eos-r10`
- `/vs/fujifilm-x-t30ii-vs-sony-a6400`
- `/vs/fujifilm-x100vi-vs-nikon-zf`
- `/vs/fujifilm-x100vi-vs-sony-a6700`
- `/vs/fujifilm-x-e5-vs-nikon-zf`
- `/vs/panasonic-l10-vs-fujifilm-x100vi`
- `/vs/canon-eos-r50v-vs-sony-zv-e10-ii`
- `/vs/sony-zv-e10-ii-vs-nikon-z30`
- `/vs/canon-eos-r50v-vs-nikon-z30`
- `/vs/fujifilm-x-m5-vs-canon-eos-r50`
- `/vs/sony-zv-e10-ii-vs-panasonic-g100d`
- `/vs/panasonic-g100d-vs-nikon-z30`
- `/vs/olympus-om-1-ii-vs-panasonic-gh7`
- `/vs/olympus-om-3-vs-panasonic-g9-ii`
- `/vs/olympus-om-1-ii-vs-fujifilm-x-h2s`

