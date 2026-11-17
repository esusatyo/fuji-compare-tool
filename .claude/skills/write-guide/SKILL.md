---
name: write-guide
description: Write a data-led guide (/guides/<slug>, an evergreen ranking that updates with the data) or a dated article (/articles/<slug>, a frozen snapshot of one period) for the comparison site, following the site's article structure — one search question, the answer first, a ranked table, an honest chart, short witty paragraphs, numbers only from the data, declared claims, links only to live indexable pages. Drafts for the owner's approval; never publishes unreviewed. Use when the user wants a new guide, article, blog post, ranking or data story, or wants an existing one refreshed or edited.
metadata:
  author: fuji-compare-tool
  version: "1.0"
---

Write one guide or article as a content module that the generator turns into a page.

The engine and the full rule set live in the repo; read them before writing:
- `scripts/articles.js` — the module contract (header comment) and the `kit` helpers.
- `content/guides/lightest-aps-c-cameras.js`, `content/guides/lightest-zoom-lenses.js` —
  worked examples. Copy their shape.
- `openspec/changes/add-data-guides/design.md` (or its archived copy under
  `openspec/changes/archive/` / `openspec/specs/data-guides/`) — guideline G1–G9 and the
  owner's decisions.

**What this skill does NOT do**: change camera or lens data (hand off to `verify-specs` or
`refresh-camera-data`, and note it in the draft), publish without the owner's approval, or
write generic posts that don't use our data (beginner tips, news rewrites).

---

## Step 0 — Guide or article?

| | Guide | Article |
|---|---|---|
| For | A question people ask every year: "lightest APS-C camera", "smallest full-frame camera" | One period: "cameras released in 2026", "camera prices, November 2026" |
| File | `content/guides/<slug>.js` | `content/articles/<slug>.js` + `<slug>.snapshot.json` |
| URL | `/guides/<slug>`, **no date in the slug** | `/articles/<slug>`, **the period in the slug** |
| Data | Live: re-rendered on every generator run | Frozen: `node scripts/snapshot-article.js <slug>` once |
| Date at top | "Updated" = the page's sitemap `<lastmod>` (automatic) | "Published" = the module's `published` |
| Later edits | Refresh when a claim test fails or yearly | Never, except a link to the newer edition |

If the user's topic fits the other kind better, say so in one line and recommend it.

## Step 1 — The question and its evidence

One page answers one question. Before writing:
1. Name the query in the plain words people type ("lightest zoom lens").
2. Find evidence that people ask it: Bing Webmaster query stats, Search Console queries, or a
   close variant of a query we already rank for (see the `seo-usage-log` and
   `bing-webmaster-api` memories). Record it in the module's `query.evidence`. **No evidence,
   no page** — tell the owner and suggest a question that has some.
3. Check the page would say something a table alone can't (a ranking, a trend, a verdict). If it
   would only repeat a vs-page, size page or mount page, don't write it.
4. Check no existing guide already answers it (`ls content/guides content/articles`). Two pages
   on one question compete with each other in search.

## Step 2 — Pull the numbers

Explore the data with a throwaway script (scratchpad, not the repo) using
`tests/helpers/load-brand` until the story is clear: the winner, the runner-up, the trend, the
brand that keeps winning, the surprise. Conventions to respect:
- Camera `weight` is the maker's figure with battery and card; lens `weight` is the maker's figure.
- Skip `discontinued` and `preRelease` items for "on sale now" rankings; say so in the method note.
- A third-party lens appears once per brand file of its mount — fold copies by
  maker + name + mount (see `lightest-zoom-lenses.js`). Never key by slug alone.
- Sensor format: `sensorType` for cameras; for lenses, the crop in `focalLengthEquiv` (≈1.0 =
  full-frame), with `mft` and `g` known by mount.
- Fixed-lens and DSLR-era gaps: the site is mirrorless-only (e.g. Canon EOS M isn't in the
  data). State scope gaps in the method note rather than overclaiming.

## Step 3 — Write the module

Copy an example and keep its order. Exports:
- `slug` — short, lowercase, hyphenated, the plain words of the question; must match the file
  name. Guides: no year. Articles: the period (`camera-prices-november-2026`).
- `title` — **≤ 60 characters**, main phrase first, then the year:
  "Lightest APS-C Cameras in 2026, Ranked by Weight".
- `headline` — the H1, plain words: "The lightest APS-C cameras, ranked".
- `dek` — one witty line under the H1.
- `published` — `YYYY-MM-DD` of first publication.
- `query` — `{ text, evidence }` from Step 1.
- `snapshot(brandData)` — every number the page uses, as plain JSON. Nothing else reads data.
- `description(snap)` — **140–160 characters**: the answer with its number, plus a reason to click.
- `claims(snap)` — `[[sentence, boolean]]` for every statement that can stop being true
  ("Fujifilm had the lightest launch in 6 of 10 years", "three of the five lightest are power
  zooms", "under $800"). If the prose says it, a claim checks it.
- `render(snap, kit)` — the body after the H1, dek and byline (the shell adds those, the date
  and the closing "Updated … the comparison tool shows today's numbers" note).

Body order (design G4):
1. `<p class="guide-answer">` — the answer with its number in one or two sentences. This is what
   snippets and AI answers quote.
2. H2 + **a one-line lead-in** + `kit.table(...)` — the ranked table; every name links to a page.
3. H2 phrased as a question + **a one-line lead-in** + `kit.bars(...)` when there's a trend or
   comparison worth seeing.
4. Two or three more H2s phrased the way people ask ("Which brand makes the lightest…?").
5. A short list of internal links ("Compare the lightweights", "Browse every lens by mount").
6. "How we weighed them" — source of the numbers, what's in and out of scope.

### Voice
- Short, plain, a bit witty. **Paragraphs of one to three sentences.** 400–800 words; no minimum.
- A short lead-in sentence before **every** table and chart.
- First person is the owner's voice. The owner shoots a **Fujifilm X-S20** and enjoys it; a brief,
  honest aside about it is welcome where relevant (never invent other gear, trips or opinions).
  The byline is the site name, added by the shell.
- US spelling, matching the site ("stabilization", "colored").
- Words people search with, varied naturally. No keyword stuffing, no "click here".
- **Every number comes from `snap`** through `${...}`. Never type a weight, price, count or year
  that came from the data. Fixed editorial facts (a soda can, a paperclip) need no claim but must
  be true.

### Links (design G6)
- Write internal links with `kit.a('path/from/root', 'Descriptive anchor')` — no leading slash.
  `kit.a` adds the `../` prefix and the GoatCounter `guide-link`/`article-link` event.
- 3–8 links to vs-pages, size pages, mount pages, brand pages or tools, with descriptive anchors.
- **Only to pages that exist and are indexable** (in `sitemap.xml`). If the right vs-page is
  noindexed, pin it in `PINNED_VS_PAIRS` in `scripts/generate-seo.js` with the comment
  `// linked from guides/<slug>` (cross-brand pairs must already be in `CROSS_BRAND_MATCHUPS`;
  ask the owner before adding a new matchup). Pinning also generates the pair's size page.
- Deep links (`compare/#cameras=brand:slug,…`, `<brand>/#lenses=a,b`, `kit/#kit=body,lens`) are fine
  for readers; the slugs must resolve. They don't count as SEO links (crawlers drop the hash).
- Link the new page from a related guide's link list where it fits.

### Charts (design G7, dataviz rules)
- `kit.bars({ caption, bars: [{ label, sub, value, series }], max, legend, table })` — horizontal
  bars from zero, a visible value on every bar, a legend when colour carries meaning, and the same
  numbers as a table. Series 1–4 map to the validated `--chart-1..4` tokens; assign them by a
  fixed meaning (brand, sensor format), never by rank, and never more than four.
- Keep `sub` labels short (strip apertures: `LUMIX G Vario 12-32mm`) so rows don't wrap on phones.
- If a new chart type is needed, add it to `makeKit` in `scripts/articles.js` with tokens only,
  and validate any new colours with the dataviz skill's palette validator in both themes.

## Step 4 — Build and check

```bash
node scripts/generate-seo.js            # renders guides/ (or articles/), index, sitemap
node scripts/snapshot-article.js <slug>  # articles only, once; refuses to overwrite
node scripts/render-share-images.js      # the page's share card (needs Chrome)
node --test tests/data/guides.test.js    # claims, links, head, dates, snapshots
npm test                                 # the gate
```
`guides.test.js` fails on a claim the data doesn't support, a link to a missing or noindexed
page, an unresolved deep-link slug, a title over 60 or description outside 140–160 characters,
a wrong date or byline, or `undefined`/`NaN` in the output. Fix the module, not the test.

Then look at it: `python3 scripts/preview.py 3456` → `/guides/<slug>` in dark and light themes and
at 375px wide (an iframe at that width works in the hidden automation tab). Check: no sideways page
scroll, chart labels readable, tables scroll inside themselves, the date at the top.

## Step 5 — Owner review, then commit

- Show the owner the URL to preview, the answer sentence, the title and description, the claims
  list and every pin you added. Wait for approval of the text; apply edits they ask for.
- Commit with the generated files (`guides/`, `sitemap.xml`, `sitemap-lastmod.json`, `og/`); the
  pre-commit hook regenerates on `content/` changes and runs `npm test`.
- After merge: verify the page live, **ask the owner before requesting indexing** in Search
  Console, and note the page in the SEO log for a 4–8 week review.

Pace: two or three pages at launch, then about one every one to two weeks, each checked against
Bing and Search Console before the next batch. Stop adding guides if the first three earn nothing
after eight weeks (design G9).

## Refreshing a guide

When `guides.test.js` names a failed claim, the data changed under a sentence. Re-read the page,
rewrite the sentence and its claim together, show the owner, commit. The Updated date moves by
itself. An **article** is never refreshed: write the next edition and add a link to it.
