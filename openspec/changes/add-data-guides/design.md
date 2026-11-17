## Article structure guideline

Every guide follows this structure. It is written to Google's SEO Starter Guide (people-first,
unique, up to date, organized with headings, descriptive links) and to what our own search data
shows people want. Things the guide says don't matter (word counts, keyword repetition, meta
keywords, heading counts) are deliberately not rules here.

### G1. One question per article
- Each guide answers one search question that we can see in Bing or Search Console, or that a
  close variant of one does ("lightest APS-C camera", "smallest full-frame camera").
- Before writing, note the query and its impressions in the guide's front matter. No evidence,
  no guide.
- The article must say something a table alone can't: a ranking, a trend, a verdict. If it would
  only repeat a size page, don't write it.

### G2. URLs: guides and articles
Two kinds of page, one engine (owner decision 2026-11-17):
- **Guides** at `/guides/<slug>`: rankings and buying guides that answer a question people ask
  every year ("lightest APS-C cameras"). Evergreen URL, no date in it, so the links it earns keep
  counting. Rendered from live data; the **Updated** date sits at the top.
- **Articles** at `/articles/<slug>`: dated pieces about one period ("cameras released in 2026",
  "camera prices, November 2026"). The period goes in the slug. Rendered from a data snapshot
  committed with the article, so they never change after publishing; the **Published** date
  sits at the top. The only later edit is a link to the newer edition.
- Slugs are short, lowercase, hyphenated and extensionless, like every URL on the site.
- `/guides/` and `/articles/` index pages list their pages. An index is generated (and in the
  sitemap) only once it has at least one page: an empty listing is thin content.

### G3. Head tags (generator-owned, like every other page)
- **Title**, at most about 60 characters, the main phrase first, then the year:
  "Lightest APS-C Cameras in 2026, Ranked by Weight".
- **Meta description**, 140–160 characters: the answer with its number, plus one reason to click.
- Self-referencing canonical, `og:*`/Twitter tags and a share card (the existing `og/` system,
  photo-free and price-free).
- **Structured data**: `Article` JSON-LD with `headline`, `datePublished`, `dateModified`,
  `author` and `image`. **No `Product` markup** on a list page (it raises Merchant-listing warnings,
  as noted in add-static-brand-specs).

### G4. Body, top to bottom
1. **H1**: the question in plain words ("The lightest APS-C cameras, ranked"), one per page and
   in the static HTML (not added by script).
2. **Dek**: one line under the H1 that sets the tone.
3. **The short answer**: the first paragraph answers the question with the number, in one or two
   sentences. This is what search snippets and AI answers quote.
4. **The ranked table**: static HTML built from `data.js`. Every camera name links to a comparison
   page. Columns are only the ones that matter to the question.
5. **The chart** (when there is a trend): inline SVG in the static HTML, a `<figcaption>` saying
   what it shows, a visible label on every mark, and the same numbers as a table under it.
6. **Two or three H2 sections** phrased the way people ask ("Which brand makes the lightest
   APS-C camera?"). Short paragraphs: at most three sentences each.
7. **Compare them yourself**: a short list of internal links (see G6).
8. **How we measured**: where the numbers come from, what is in and out of scope, and the date.
9. **Updated date** visible on the page, matching `dateModified`.

### G5. Writing
- Short, plain and a bit witty. Paragraphs of one to three sentences. Aim for 400–800 words;
  there is no minimum.
- Write in the words people search with, varied naturally. Never repeat a phrase for the sake of it.
- Every number in the prose comes from the data through a placeholder (`{{lightest.weight}}`),
  never typed by hand, so a data refresh can't leave the text wrong.
- Claims that can stop being true ("Fujifilm won 6 of the last 10 years") are declared next to
  the prose as checks, and a test fails when the data no longer supports them. The owner then
  rewrites the sentence.
- The owner writes or approves every article before it ships. Claude drafts; nothing publishes
  unreviewed.

### G6. Internal links
- 3–8 links to comparison pages, size pages or the tool, with descriptive anchor text
  ("X-M5 vs ZV-E10 II size comparison", never "click here").
- Link only to indexable pages (in `sitemap.xml`) that exist. If an article needs a pair that is
  currently noindexed, pin it (`PINNED_VS_PAIRS`, commented "linked from articles/<slug>") in the
  same change; pinning also generates its size page. `drafts/build-drafts.js` checks this today,
  and test 3.2 will once the generator exists.
- Lens comparisons have no static pages yet, so lens articles link to the mount pages and use
  brand-page deep links (`/<brand>/#lenses=a,b`) for readers.
- Tool deep links (`/compare/#cameras=…`) are fine for readers, but don't count them as SEO links:
  crawlers ignore the hash.
- Link back to each guide from where readers already are: the homepage, `/size/` and the relevant
  brand pages.

### G7. Charts
- Bars start at zero, so a small change looks small. Honest charts get cited; distorted ones get mocked.
- Colour follows the brand, and the colours must pass the dataviz palette validator in both themes.
  Every bar carries a visible label, so colour is never the only cue.
- A table of the same numbers sits under every chart for screen readers and copy-paste.

### G8. Dates, freshness and scope
- **Guides** re-render with the data on every generator run. Their **Updated** date is the page's
  sitemap `<lastmod>`: it moves only when the rendered content changes (the hash ignores the date
  itself), so the date on the page is always the date its numbers last changed.
- **Articles** render from `content/articles/<slug>.snapshot.json`, written once by
  `node scripts/snapshot-article.js <slug>`. A data change never touches them. The **Published**
  date comes from the article's source.
- Both show the date at the top ("By Compare Camera Specs · Updated 17 November 2026") and in the
  closing note, which points readers to the tool for today's numbers. `dateModified` matches.
- The method note states the scope plainly. For example: the database covers current mirrorless
  mounts, so Canon's retired EF-M cameras aren't included.

### G9. Measuring
- A GoatCounter event for links out of a guide (`article-link:<slug>:<target>`), added to
  `privacy.html`'s list of what's counted.
- Bing and Search Console impressions per guide URL, reviewed 4–8 weeks after publishing.
- Stop writing new guides if the first three earn nothing after eight weeks.

## Owner decisions (2026-11-17)
- D1. Sections and URLs: **`/guides/`** for evergreen rankings (both first drafts) and
  **`/articles/`** for dated pieces, added later (see G2).
- D2. Byline: **the site name** ("Compare Camera Specs"), as an `Organization` in the JSON-LD.
  The prose may still speak in the owner's first person (the owner shoots a Fujifilm X-S20).
- D3. Next article: **the lightest zoom lenses across the brands**, narrowed by the owner to
  APS-C (`content/guides/lightest-aps-c-zoom-lenses.js`; no Micro Four Thirds or GFX; full-frame
  kept as an extension section). Later candidates: smallest full-frame camera, lightest
  Micro Four Thirds camera, lightest travel kit per mount.
- D4. Every link must reach an indexable, live page. Pinned for the first article:
  `canon/vs/eos-r50-vs-eos-r100` and `vs/fujifilm-x-m5-vs-canon-eos-r50` (which also generates
  `canon/size/eos-r50-vs-eos-r100` and `size/fujifilm-x-m5-vs-canon-eos-r50`).
- Writing: keep the short, witty style; add a short lead-in sentence before every table and chart.
- D5. Guides are live with an Updated date at the top; articles are frozen snapshots with a
  Published date (G8). Build the engine for both now; the first article comes later.
- Publishing pace: the first two articles together, then one about every one to two weeks, each
  reviewed against Bing and Search Console before the next batch (see G9).

## Article data

Both drafts are built from the brand data by `drafts/build-drafts.js`, which also checks every
link and every declared claim (a failed claim exits non-zero). Rerun it after any data change.

### First article: data used (pulled 2026-11-17 from main 793d532)
- APS-C = `sensorType` containing APS-C, X-Trans or Bayer CMOS, excluding full-frame and APS-H.
  65 cameras. Weight = the maker's figure with battery and card (verify-specs convention).
- Lightest new APS-C camera by launch year: 2016 X-E2S 350 g, 2017 X-E3 337 g, 2018 X-T100 394 g,
  2019 X-T30 383 g, 2020 X-T200 370 g, 2021 ZV-E10 343 g, 2022 Z30 405 g, 2023 EOS R100 356 g,
  2024 X-M5 355 g, 2025 EOS R50 V 370 g. No APS-C launches in the data for 2026 yet.
- By brand: Fujifilm 6 of 10 years, Canon 2, Sony 1, Nikon 1.
- Lightest ever in the data: Fujifilm X-M1 (2013), 280 g.

### Second article: lightest APS-C zoom lenses (pulled 2026-11-17)
- Zoom = lens `type: 'Zoom'`, current (not discontinued, not pre-release), one entry per lens per
  mount. APS-C from the crop in `focalLengthEquiv` (about 1.0 = full-frame); MFT, GFX and Leica M
  out of scope. 75 APS-C zooms across Sony E, Fujifilm X, Canon RF-S and Nikon Z DX.
- Lightest per mount: Sony E 16-50mm PZ II 107 g, Fujifilm XC 13-33mm 125 g, Canon RF-S 18-45mm
  130 g, Nikon Z DX 16-50mm 135 g (28 g spread). Half of the ten lightest are power zooms.
- Lightest full-frame per mount (extension): LUMIX S 18-40mm 155 g, Sony FE 28-60mm 167 g,
  Nikon Z 24-50mm 195 g, Canon RF 24-50mm 210 g.
- Lightest constant f/2.8 APS-C zoom: Sigma 10-18mm f/2.8 DC DN (X), 250 g.
- The owner's X-S20 zoom of choice: XC 15-45mm, 135 g.
