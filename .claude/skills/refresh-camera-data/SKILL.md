---
name: refresh-camera-data
description: Research live camera/lens data from the web and propose updates to brand data files — price changes, product/image URL changes, and newly released cameras and lenses. Use when the user wants to refresh, update, or check for new camera data, prices, or releases across brands.
metadata:
  author: fuji-compare-tool
  version: "1.4"
---

Refresh the brand data files in this repo against current real-world data.

I research the web for **price changes, URL changes, and new releases**, diff them
against the committed data, present a review, and apply approved updates.

---

## Scope (defaults)

- **Brands**: ALL registered brands unless the user names one. Don't hardcode
  the list — every top-level directory containing a `data.js` is a brand
  (`REGISTERED_BRANDS` inside any of them lists the same set). Each brand's
  data is `<slug>/data.js`.
- **Currencies**: ALL of them unless the user names one.
  The currency set is the keys of any `prices:` object: `USD, AUD, EUR, GBP, JPY, CAD, SGD`.
- **Categories**: both `CAMERAS` and `LENSES` unless the user narrows it.

If the user said e.g. "just Fujifilm" or "only USD", restrict accordingly. Otherwise do everything.

---

## What each entry looks like

Both `CAMERAS` and `LENSES` are objects keyed by kebab-case slug. The fields this
skill touches:

```js
'eos-r5-ii': {
  name:'EOS R5 Mark II', year:2024, discontinued:false,
  productUrl:'https://...',   // official brand product page
  imageUrl:'https://...',     // usually a Wikimedia Commons file
  asin:'B0D3J1XYZ1',          // 10-char Amazon id (or null → search fallback)
  prices:{USD:4299,AUD:6699,EUR:4899,GBP:3899,JPY:648000,CAD:5599,SGD:6199},
  // ...many spec fields...
}
```

Pricing convention (see also `scripts/compute-prices.js` and the
[`check-prices-and-buy-links`](../check-prices-and-buy-links/SKILL.md) skill):
**USD tracks the current US list price (RRP/MSRP)** — not transient street/sale prices;
non-USD figures are approximate, derived from USD by regional ratios unless a real local
RRP is confirmed. US-only changes (e.g. tariff hikes) change USD only. Only overwrite a
non-USD figure when you have a confirmed local RRP, and note it.

**When sources disagree, fall back to the official manufacturer RRP.** Retailer
"was/now" pairs are the usual culprit: a retailer's struck-through figure is *that
retailer's own regular price*, not the manufacturer MSRP, and it drifts in both
directions. Verified 2026-07-26 — B&H showed "$4,399 → $3,899" for the Canon EOS R5
Mark II and "$2,299 → $1,999" for the R6 Mark II while Canon's MSRPs were still $4,299
and $2,499, which would have produced a batch of false-positive "price changes". Anchor
on the manufacturer's own store/press release; use a reputable reseller's **list**
price (not the sale price) only when the official RRP can't be reached, and say which
one you used.

**One reputable data point is enough for a routine price.** "Ground it in more than one
source" applies to *new entries and disputed figures* — it is not a bar every price must
clear before it can be edited. A current list price from a major authorised dealer (B&H,
the manufacturer's own store) is sufficient on its own; take it, cite it, move on.
Decided 2026-07-26 for the Sony a6700 ($1,498) and a7R V ($3,798), both from B&H's list
price. Don't stall a whole refresh hunting for corroboration on individually low-stakes
numbers.

**Don't escalate cosmetic deltas — just pick one.** Differences of a few dollars from
rounding or the $X,499.99-vs-$X,498 convention (e.g. Sony press releases quote
`$4,499.99` where the actual shelf price is `$4,498`) are not findings and are not worth
a question. Pick the retail figure, apply it, and mention it in the summary at most.
Reserve "Needs confirmation" for deltas that would change a buyer's decision or where
sources genuinely conflict on the real price.

Buy links are **generated per-currency** by the engine (`amazonBuyUrl`) — there are no
`buyUrl` fields to maintain; don't reintroduce them.

---

## Steps

### 1. Resolve scope
Read the user's request. Determine the brand list, currency list, and category list
(falling back to the all-defaults above). Read `REGISTERED_BRANDS` from one `data.js`
to confirm the brand slugs and file paths. State the resolved scope back to the user in
one line before doing heavy research.

### 2. Load current data
For each in-scope brand, read `<slug>/data.js`. Build an in-memory list of every
camera and lens slug with its current `name`, `year`, `prices`, `productUrl`, `asin`,
and `imageUrl`. This is the baseline to diff against.

### 3. Research (web)
Use **WebSearch** and **WebFetch**. Work brand by brand. For each brand:

- **New releases** — search for cameras/lenses announced or released that are NOT
  already a slug in the data. Good queries: `"<Brand> camera announced 2026"`,
  `"<Brand> RF lens roadmap"`, the brand's official "new products" page, DPReview, and
  the rumor sites in `BRAND_CONFIG.footerLinks`. Capture: name, year, official product
  URL, and as many spec fields as you can source confidently.

  **Don't rely on news searches alone — enumerate what's actually on sale.** Walk a
  retailer's brand listing (B&H's mirrorless category reads well via the browser; use
  `find` rather than `get_page_text` to keep output small) and diff every SKU against
  the data's slugs. News queries are anchored on the current year and silently miss
  anything released in the *previous* year but after the data was last authored —
  exactly how the Fujifilm X-T30 III (announced Oct 2025) stayed missing until
  2026-07-26. Two cheap cross-checks that would each have caught it:
  - **Kit-lens orphans**: `xc-13-33mm-f35-63`, the X-T30 III's kit lens announced the
    same day, was already in the data. A lens whose companion body is absent is a
    strong signal. Sweep for lenses with no matching body generation.
  - **Successor gaps — cameras AND lenses.** For every `<line> II` in the data, search
    `<line> III`. Roman numeral bumps read as "already covered" and are easy to
    pattern-match past. **This applies just as much to lenses as bodies** — a maker
    revising an existing lens (a new "S II" / "Mark II" / "Version II") keeps a
    familiar-looking name, so "we already have a lens called X" reads as "covered" even
    though the new one has different specs and a different price. Confirmed 2026-08-08
    on Nikon: NIKKOR Z 24-70mm f/2.8 S gained an S II in Aug 2025 and 70-200mm f/2.8 VR
    S gained a VR S II in Feb 2026 — both with different weight/elements/AF motor/price
    from the original, both missed by every prior refresh because "24-70mm f/2.8 S"
    already existed in the data. Whenever a maker announces a "II"/Mark 2/updated
    version of a lens already in the data, research it as its own product with its own
    specs and price — never assume it's the same entry under a new label. (Whether it
    becomes a new coexisting entry or an in-place update to the existing one is a
    separate call — see step 5.)

  Never infer "this brand is current" from the newest `year` in the data — a brand can
  hold a recent *lens* year while missing a *body*.

- **Full-lineup completeness diff (do this every run, for lenses too).** The checks
  above all hunt for things that are *new*. They cannot find a product that was never
  entered, because it isn't new and no search surfaces it. On 2026-08-05 that blind
  spot was measured on Canon: **34 of ~55 first-party RF lenses present, 21 missing**
  — including the RF 600mm f/11 while its sibling RF 800mm f/11 was in the data, the
  entire super-telephoto L line, and the RF 28-70mm f/2 L. None were new; all had been
  missing for months.

  So: for each in-scope brand, enumerate the maker's **complete current lens and body
  lineup** and diff it against the dataset. Report everything present upstream and
  absent locally, whatever its age. Good enumeration sources, in order — the maker's
  own "all lenses" listing, then a retailer's full brand listing, then the lineup
  tables inside the relevant Wikipedia *article*.

  ⚠️ Wikipedia **categories** are a trap for this: `Category:Canon RF lenses` has 2
  members and reads as authoritative while listing almost nothing. Use the article's
  tables (`action=parse&prop=wikitext` via the MediaWiki API parses cleanly), and treat
  Wikipedia as an enumeration aid only — **never** as a spec source.

- **Record every source as you read it** (see Guardrails). A refreshed price with no
  recorded source is a number nobody can re-check next run.
- **Price changes** — for existing models still on sale (`discontinued:false`), check
  current RRP. Anchor on the official store / a major retailer. Flag any USD delta;
  for non-USD currencies in scope, update only where a confirmed local RRP exists,
  otherwise note that it stays ratio-derived.
- **URL changes** — verify `productUrl` still resolves to the right page. Note dead
  links and redirects. Don't churn `imageUrl` unless the current one is broken.
  (Buy links are generated from `asin` — missing/wrong ASINs are the
  [`check-prices-and-buy-links`](../check-prices-and-buy-links/SKILL.md) skill's job.)

  **If the US manufacturer domain is blocked, try the brand's other regional sites
  before giving up.** `electronics.sony.com` and `usa.canon.com` block both WebFetch and
  the Chrome extension, and US slugs are inconsistent (`ilmefx3-b` vs `ilmefx30b`), so
  guessing risks a 404. Regional domains — `sony.com.au`, `canon.com.au`,
  `fujifilm-x.com/global/` — are usually reachable and use cleaner slugs
  (`sony.com.au/electronics/interchangeable-lens-cameras/ilme-fx5`). A working regional
  official page beats `productUrl: null`; the user supplied exactly that URL for the FX5
  on 2026-07-26 after this skill left it null. Only fall back to `null` when no regional
  page can be verified — never invent a slug.
  Note `tests/links/links.test.js` treats 403 as a *warning*, so bot-blocking is not
  evidence a URL is dead — and equally not evidence it's alive. Confirm before relying
  on it. The block on `usa.canon.com` is most likely **geo-blocking of non-US
  traffic**, not a bot/rate-limit flag — confirmed 2026-08-08 by re-testing after a
  3-hour wait (no change), via the Chrome extension i.e. a real browser (no change),
  and by the owner testing from their phone on a different network entirely (still
  blocked). It's a fast, clean 403 with an Akamai reference number, not a timeout —
  that's the signature of a deliberate edge rule, not an outage. Waiting, switching
  client, or switching network doesn't clear it; use a regional domain
  (`canon.com.au` etc.) instead. Note `canon.com` is a dead end for this purpose —
  it redirects to `global.canon`, Canon's corporate site, which has no shop/spec
  pages.

  **`canon.com.au`'s "Dimensions (mm — retracted)" field is templated and
  unreliable — confirmed by direct collision, 2026-08-08.** Two different
  supertelephotos (RF 800mm f/5.6L, RF 1200mm f/8L) both showed the identical,
  physically-implausible `69 x 92.9mm`; three VCM primes (24/35/50mm f/1.4L)
  showed the same two numbers recycled and reordered; RF 400mm f/2.8L and
  RF 600mm f/4L both showed `168 x 472mm` even though Canon USA's own page gives
  the 400mm as a genuinely different `163 x 367mm`. Every *other* field on these
  same pages (elements/groups, blades, weight, MFD, magnification, IS stops,
  focus drive, AUD RRP) is correctly product-specific and — where cross-checked —
  matches Canon USA exactly. Treat AU's dimensions row as unverified for any
  lens without an independent second figure; don't enter `diameter`/`length`
  from it alone, and don't assume other fields share the bug just because
  dimensions does.

  Also: `canon.com.au` slugs are inconsistent even against Canon's own pattern —
  `rf-24mm-f1.4l-vcm` vs `rf-35mm-f1-4-l-vcm` for two lenses in the same VCM
  family. Confirm via `canon.com.au/search?q=<name>` rather than constructing a
  slug; a guess 404s about as often as it hits.

Cite the source URL for every proposed change. Prefer official/manufacturer sources,
then major retailers (B&H), then reputable press; treat rumor sites as leads to verify,
not as confirmation.

### 4. Present findings BEFORE editing
Produce a per-brand review grouped into three sections. Keep it scannable:

```
## Fujifilm

### New releases (N)
- X-T6 (2026) — $1799 USD — https://fujifilm-x.com/...  [proposed slug: x-t6]
  prices: USD 1799 / AUD … / EUR … (others ratio-derived)

### Price changes (N)
- X100VI  USD 1599 → 1699   src: https://...
- (AUD/EUR/… unchanged — ratio-derived)

### URL changes (N)
- X-T5 productUrl 404s → https://...(new)   src: …
```

If nothing changed for a section, say "no changes". For genuinely uncertain items, put
them under a "Needs confirmation" subsection rather than proposing a silent edit. Keep
that subsection for real ambiguity — see the cosmetic-delta rule above; a $1 rounding
difference belongs in the summary line, not in a question to the user.

**Re-flag unconfirmed values already in the data, every run.** Some schema fields are
non-nullable (`maxBurst`, `weight`, `sensorMP`), so a new entry occasionally has to ship
a placeholder inherited from a sibling model. Those do not become facts by surviving a
cycle — carry them forward into "Needs confirmation" on each subsequent run until a real
source lands or the user resolves them. The standing list lives in the
`open-data-questions` memory; read it during step 2 and fold its entries into the step-4
review. Current example: **Sony FX5 `maxBurst: 10`**, inherited from the FX3/FX30 entries
and unverified — the user asked on 2026-07-26 to be shown it again next run.

### 5. Get approval, then apply
Ask which changes to apply (default: all confirmed ones; uncertain ones excluded unless
the user opts in). Then edit the relevant `<slug>/data.js`:

- **Price update**: edit the `prices:{…}` object for that slug, in-scope currencies only.
- **URL update**: replace the `productUrl` / `imageUrl` string.
- **Revision handling — new coexisting entry vs. update in place.** A "II"/Mark 2/
  Version 2 needs a judgment call, not a default: did the optical formula, AF system,
  or mechanical design actually change, or is this a barrel/cosmetic refresh of the
  same optics?
  - **Real redesign → new coexisting entry**, old one gets `discontinued: true` (never
    overwritten) — see the `lens-revisions-are-coexisting-entries` memory. Example:
    NIKKOR Z 24-70mm f/2.8 S II (Aug 2025) has different elements/groups/AF motor/
    weight from the original S — genuinely a new product to compare against.
  - **Cosmetic-only refresh → update the existing entry in place**, don't duplicate it.
    Example, confirmed 2026-08-08: Voigtländer's APO-Lanthar 50mm f/2 "Version II"
    (Nov 2024) has the *identical* optical formula to the original per Cosina's own
    materials — only the barrel design, hood, and 17g of weight changed. Adding it as
    a second entry would just be near-duplicate noise in a comparison table; instead
    update `asin`/`productUrl`/`year`/`weight` on the existing entry.
  - When unsure which case applies, check the maker's own "what's new" copy for the
    revision — it usually says outright whether the optics changed.
- **New camera/lens**: add a full entry to `CAMERAS`/`LENSES` matching the exact field
  shape of neighbouring entries (same keys, same order, same formatting/indentation).
  Use `null` for any spec you can't source — do not invent values. New entries also need
  to be wired into ordering/grouping arrays if the brand uses them (e.g.
  `CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENS_ORDER`); grep the file for the slug pattern of
  a sibling to find every array it must be added to.

For non-USD prices, `scripts/compute-prices.js` has two modes:
- **Fill mode** (default) — for a brand-new entry where only USD is known, derives
  every non-USD currency from scratch via regional ratios.
- **Recompute mode** (`--recompute`, optionally `--ids=slug1,slug2` to target specific
  entries) — for an EXISTING entry whose USD you just refreshed, re-derives every
  currency field that's already a number, leaving nulls as nulls (so a
  `priceIncomplete` lens that only has AUD/CAD populated gets just those two
  refreshed, and a USD-only third-party entry is untouched beyond USD). A single
  credible source for the new USD figure is enough before running this — see the "one
  source is enough for a routine price" rule above; the script's job is just the
  arithmetic, not sourcing.

Note which figures are derived vs confirmed either way.

### 6. Verify
After edits, run the data tests so a malformed entry is caught:

```bash
npm test
```

(Optionally `npm run test:links` to validate any new/changed URLs — note it hits the
network and is slower.) Report pass/fail. If a new entry breaks a completeness or schema
test, fix the entry rather than the test.

### 7. Summarize
End with a short summary: counts of new entries / price updates / URL fixes per brand,
the test result, and any items left under "Needs confirmation" for the user to decide.

---

## Guardrails

- **Never invent prices or specs.** Unknown → `null` (or leave existing value and flag it).
- **Don't reformat** unrelated parts of `data.js`; touch only the fields/entries that change.
- **Preserve the USD-anchored pricing convention.**
- **Always cite a source URL** for every applied change — and record it durably, not
  just in the chat summary. The owner intends to surface sources on the site so
  readers can cross-check, so a citation that lives only in a transcript is lost work.
  Write each one into the change's `research/sources.md` **as you read it**, with what
  it was used for and its reliability class (T1 maker's own site incl. official
  regional sites · T2 independent review/measurement · T3 retailer, price and
  availability only · T4 aggregator, tables only · NEWS dated announcement, `year`
  only). Populate `specSources` on the entry where the field exists.
- **Keep sources for facts you rejected**, with the reason. "This page says 638 g and
  we didn't use it because that's the DSLR row" is what stops the next run
  "correcting" a right value to a wrong one.
- **A source's classes don't travel together.** An aggregator whose spec tables check
  out can still be badly wrong about which mounts a lens ships in — lensfinder.org was
  ~30% wrong on mount attribution while its tables matched tier 1 exactly. Verify
  availability against the maker, always.
- **A third-party entry surviving several refreshes unchallenged is not evidence it's
  real — verify the mount exists, not just the specs.** Confirmed 2026-08-08: Nikon's
  `tamron-11-20mm-f28` entry had a plausible name, specs, and price, and had been in
  the dataset since the brand was authored — but no Nikon Z version of that lens has
  ever existed. Tamron's 11-20mm f/2.8 Di III-A RXD (Model B060) only ever shipped for
  Sony E, Fujifilm X, and Canon RF; B&H's SKU list and Tamron's own mount-selector
  dropdown both confirm there's no Z-mount SKU. This is a sharper version of the
  "source classes don't travel together" trap above: it's not that a source was wrong
  about the mount, it's that the *dataset entry itself* had never been mount-checked
  against anything, because every refresh since authoring checked its price/specs and
  moved on without questioning whether the product existed at all. When doing a
  third-party lens pass, periodically re-verify mount existence via the maker's own
  mount selector or a major retailer's SKU list — independent of whether the price or
  specs still look right — especially for entries a recent refresh hasn't touched.
- This skill is run manually; do not schedule it or commit/push unless the user asks.
