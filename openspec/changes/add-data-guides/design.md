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

### G2. URL
- `/guides/<slug>`: short, lowercase, hyphenated, the plain words of the question
  (`/guides/lightest-aps-c-cameras`). Extensionless, like every URL on the site.
- No year in the URL. The year goes in the title, so the URL survives updates.

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
- Link only to indexable pages. If a guide needs a pair that is currently noindexed, add it to
  the pinned pairs so it becomes indexable in the same change.
- Tool deep links (`/compare/#cameras=…`) are fine for readers, but don't count them as SEO links:
  crawlers ignore the hash.
- Link back to each guide from where readers already are: the homepage, `/size/` and the relevant
  brand pages.

### G7. Charts
- Bars start at zero, so a small change looks small. Honest charts get cited; distorted ones get mocked.
- Colour follows the brand, and the colours must pass the dataviz palette validator in both themes.
  Every bar carries a visible label, so colour is never the only cue.
- A table of the same numbers sits under every chart for screen readers and copy-paste.

### G8. Freshness and scope
- Guides regenerate with the data, like every other generated page, and the sitemap `<lastmod>`
  hash covers them.
- The method note states the scope plainly. For example: the database covers current mirrorless
  mounts, so Canon's retired EF-M cameras aren't included.

### G9. Measuring
- A GoatCounter event for links out of a guide (`guide-link:<slug>:<target>`), added to
  `privacy.html`'s list of what's counted.
- Bing and Search Console impressions per guide URL, reviewed 4–8 weeks after publishing.
- Stop writing new guides if the first three earn nothing after eight weeks.

## Decisions to confirm with the owner
- D1. Section name and URL: `/guides/` (recommended) vs `/articles/` or `/blog/`.
- D2. Byline: the owner's name (recommended, for trust) or the site name.
- D3. Launch set after the first article: smallest full-frame, lightest Micro Four Thirds, lightest
  travel kit per mount (from the kit builder).
- D4. Whether to pin `fujifilm-x-m5-vs-canon-eos-r50` (currently noindexed) as indexable, since the
  first article links to it.

## First article: data used (pulled 2026-11-17 from main 793d532)
- APS-C = `sensorType` containing APS-C, X-Trans or Bayer CMOS, excluding full-frame and APS-H.
  65 cameras. Weight = the maker's figure with battery and card (verify-specs convention).
- Lightest new APS-C camera by launch year: 2016 X-E2S 350 g, 2017 X-E3 337 g, 2018 X-T100 394 g,
  2019 X-T30 383 g, 2020 X-T200 370 g, 2021 ZV-E10 343 g, 2022 Z30 405 g, 2023 EOS R100 356 g,
  2024 X-M5 355 g, 2025 EOS R50 V 370 g. No APS-C launches in the data for 2026 yet.
- By brand: Fujifilm 6 of 10 years, Canon 2, Sony 1, Nikon 1.
- Lightest ever in the data: Fujifilm X-M1 (2013), 280 g.
