---
name: refresh-camera-data
description: Research live camera/lens data from the web and propose updates to brand data files — price changes, product/buy/image URL changes, and newly released cameras and lenses. Use when the user wants to refresh, update, or check for new camera data, prices, or releases across brands.
metadata:
  author: fuji-compare-tool
  version: "1.0"
---

Refresh the brand data files in this repo against current real-world data.

I research the web for **price changes, URL changes, and new releases**, diff them
against the committed data, present a review, and apply approved updates.

---

## Scope (defaults)

- **Brands**: ALL registered brands unless the user names one.
  Registered brands live in `REGISTERED_BRANDS` inside each `*/data.js`
  (currently `fujifilm`, `canon`). Each brand's data is `<slug>/data.js`.
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
  buyUrl:'https://...',       // retailer (usually B&H)
  imageUrl:'https://...',     // usually a Wikimedia Commons file
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
camera and lens slug with its current `name`, `year`, `prices`, `productUrl`, `buyUrl`,
and `imageUrl`. This is the baseline to diff against.

### 3. Research (web)
Use **WebSearch** and **WebFetch**. Work brand by brand. For each brand:

- **New releases** — search for cameras/lenses announced or released that are NOT
  already a slug in the data. Good queries: `"<Brand> camera announced 2026"`,
  `"<Brand> RF lens roadmap"`, the brand's official "new products" page, DPReview, and
  the rumor sites in `BRAND_CONFIG.footerLinks`. Capture: name, year, official product
  URL, and as many spec fields as you can source confidently.
- **Price changes** — for existing models still on sale (`discontinued:false`), check
  current RRP. Anchor on the official store / a major retailer. Flag any USD delta;
  for non-USD currencies in scope, update only where a confirmed local RRP exists,
  otherwise note that it stays ratio-derived.
- **URL changes** — verify `productUrl` still resolves to the right page and `buyUrl`
  still points at the live product. Note dead links and redirects. Don't churn
  `imageUrl` unless the current one is broken.

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
them under a "Needs confirmation" subsection rather than proposing a silent edit.

### 5. Get approval, then apply
Ask which changes to apply (default: all confirmed ones; uncertain ones excluded unless
the user opts in). Then edit the relevant `<slug>/data.js`:

- **Price update**: edit the `prices:{…}` object for that slug, in-scope currencies only.
- **URL update**: replace `productUrl` / `buyUrl` / `imageUrl` string.
- **New camera/lens**: add a full entry to `CAMERAS`/`LENSES` matching the exact field
  shape of neighbouring entries (same keys, same order, same formatting/indentation).
  Use `null` for any spec you can't source — do not invent values. New entries also need
  to be wired into ordering/grouping arrays if the brand uses them (e.g.
  `CAMERA_ORDER`, `DROPDOWN_GROUPS`, `LENS_ORDER`); grep the file for the slug pattern of
  a sibling to find every array it must be added to.

For non-USD launch prices on a new model where only USD is known, you may run
`node scripts/compute-prices.js` if it supports deriving the row, or fill the ratio-
derived figures by hand following the existing values' magnitude. Note which figures are
derived vs confirmed.

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
- **Always cite a source URL** for every applied change.
- This skill is run manually; do not schedule it or commit/push unless the user asks.
