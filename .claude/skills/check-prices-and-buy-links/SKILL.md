---
name: check-prices-and-buy-links
description: Periodically verify the camera/lens dataset's Buy links and prices. Confirms the currency-aware Amazon buy-link wiring is intact, fills in missing per-item Amazon ASINs so Buy buttons hit the product page (not search), and checks current real-world prices for every live camera and lens — proposing/applying updates plus test runs. Use when the user wants to re-check prices and buy links, fill in ASINs, refresh pricing, or run the periodic price/link audit.
metadata:
  author: fuji-compare-tool
  version: "1.1"
---

Verify the **Buy links** and **prices** in the brand data files against current
real-world data, then apply approved updates and run the tests.

This is a maintenance audit meant to be run periodically. It has two parts:
**(A) buy-link integrity** (cheap, mostly a sanity check) and
**(B) price refresh** (the real work — web research, brand by brand).

> Related: [`refresh-camera-data`](../refresh-camera-data/SKILL.md) is the broader
> skill that also handles new releases, product/image URLs, and full spec fields.
> This skill is the narrower, faster "prices + buy links only" pass.

---

## Background: how Buy links work now

Buy links are **generated per-currency at render time**, not stored as full URLs.
`engine.js` → `amazonBuyUrl(item, cur)`:

- **With an `asin`** → links straight to the product page on the selected
  marketplace: `https://<host>/dp/<asin>`. This is preferred — the shopper lands
  on the real listing with live pricing.
- **Without an `asin`** → falls back to a product *search*:
  `https://<host>/s?k=<Brand> <Model>`, which always resolves. So links never
  break while ASINs are being filled in.
- `AMAZON_MARKETPLACE` maps each currency to its regional Amazon host:
  `USD→amazon.com`, `AUD→amazon.com.au`, `EUR→amazon.de`, `GBP→amazon.co.uk`,
  `JPY→amazon.co.jp`, `CAD→amazon.ca`, `SGD→amazon.sg` (unknown → amazon.com).

The single `asin` (sourced from amazon.com) is domain-swapped across
marketplaces. For most major-brand camera gear the same ASIN resolves on the
other Amazon sites; when it doesn't, that marketplace shows the item as
unavailable — acceptable, and the search fallback covers items with no ASIN yet.
There are **no `buyUrl` fields** — don't reintroduce them.

---

## Scope (defaults)

- **Brands**: ALL registered brands (`REGISTERED_BRANDS` in each `*/data.js`;
  currently `fujifilm`, `canon`). Each brand's data is `<slug>/data.js`.
- **Currencies**: the keys of any `prices:` object — `USD, AUD, EUR, GBP, JPY, CAD, SGD`.
- **Categories**: both `CAMERAS` and `LENSES`.
- **Items**: only `discontinued:false` items have live prices worth checking.
  Discontinued items keep their historical launch RRP — leave them.

If the user narrows scope ("just Fujifilm", "only cameras", "USD only"), respect it.

---

## Part A — Buy-link integrity & ASIN coverage

1. Confirm `AMAZON_MARKETPLACE` and `amazonBuyUrl` still exist in `engine.js` and
   that both Buy-button render sites in `renderSlot` use `amazonBuyUrl(item)`
   (grep for `amazonBuyUrl`). If someone reintroduced a static `buyUrl` field,
   flag it — it would break currency-awareness.
2. Run the buy-link test (pins the marketplace map, the `/dp` product-page path,
   the search fallback, and the rendered button):
   ```bash
   node --test tests/logic/buy-links.test.js
   ```
3. **Fill in missing ASINs** so more items get product-page links instead of the
   search fallback. List items lacking an `asin`:
   ```bash
   node -e '
   const {JSDOM}=require("jsdom");const fs=require("fs");
   for(const b of ["fujifilm","canon"]){
     const dom=new JSDOM("<!doctype html>",{runScripts:"dangerously"});
     const s=dom.window.document.createElement("script");
     s.textContent=fs.readFileSync(b+"/data.js","utf8")+";window.C=CAMERAS;window.L=LENSES;";
     dom.window.document.body.appendChild(s);
     const d=(c,t)=>{for(const[id,it]of Object.entries(c)){if(it.discontinued)continue;
       if(!it.asin)console.log(b,t,id,"--",it.name);}};
     d(dom.window.C,"cam");d(dom.window.L,"lens");
   }'
   ```
   For each, find the amazon.com ASIN via **WebSearch** (query
   `amazon.com <Brand> <exact model> dp`); the result URLs contain
   `/dp/<ASIN>`. Pick the **plain product** listing (body-only / lens-only),
   **not** a bundle, "Renewed", or "International Version". Add `asin:'<ASIN>'`
   to the item (a new line after its `imageUrl`). ASINs are 10-char uppercase
   alphanumeric; the schema validates the format. **Only add an ASIN you're
   confident matches the exact product** — a wrong ASIN sends shoppers to the
   wrong page (worse than the search fallback), so when unsure, leave it blank.

If the marketplace set or the map changes, update **both** `AMAZON_MARKETPLACE`
in `engine.js` and the `MARKETPLACE` constant in `tests/logic/buy-links.test.js`
so they stay in lockstep.

---

## Part B — Price refresh

### Pricing convention (important)

- **USD = the current US list price** (RRP/MSRP). This dataset tracks the *list*
  price, **not** transient street/sale prices. Use the official store or B&H
  "list price", not Canon Price Watch / CamelCamelCamel street figures.
- **Non-USD** values are approximate, derived from USD by regional ratios
  (see `scripts/compute-prices.js`) **unless a real local RRP is confirmed**.
- US tariff-driven price changes are **US-only** — change `USD` and leave the
  other currencies unless you confirm a matching local change.

### Steps

1. **Load baseline.** Read each in-scope `*/data.js` and list every
   `discontinued:false` camera and lens with its current `prices`. A quick dump:
   ```bash
   node -e '
   const {JSDOM}=require("jsdom");const fs=require("fs");
   for(const b of ["fujifilm","canon"]){
     const dom=new JSDOM("<!doctype html>",{runScripts:"dangerously"});
     const s=dom.window.document.createElement("script");
     s.textContent=fs.readFileSync(b+"/data.js","utf8")+";window.C=CAMERAS;window.L=LENSES;";
     dom.window.document.body.appendChild(s);
     const d=(c,t)=>{for(const[id,it]of Object.entries(c)){if(it.discontinued)continue;
       console.log([b,t,id,it.name,it.year,it.prices&&it.prices.USD].join("\t"));}};
     d(dom.window.C,"cam");d(dom.window.L,"lens");
   }'
   ```

2. **Research current US list prices** with WebSearch / WebFetch, brand by brand.
   - Anchor on the **official brand store** and **B&H** product pages.
   - Watch for **broad price changes**: e.g. Fujifilm's 2025 US tariff hikes
     raised most X-series list prices (X100VI $1599→$1799, X-T5 →$1999, etc.);
     Fujifilm also *cut* the X half list price ($849→$649). Search
     "<Brand> US price increase <year>" to catch lineup-wide moves.
   - Many price sources are bot-blocked from `WebFetch` (DPReview, FujiRumors,
     cameradecision, B&H, Adorama, camelcamelcamel often return 403/402), and
     official product pages frequently render the price client-side so it isn't
     in the fetched HTML. Expect to confirm prices from WebSearch snippets, the
     few fetchable retailers, or press tables — and accept that some current
     **list** prices simply aren't retrievable. When you can't confirm a current
     figure, **leave the existing value and flag it** (don't guess).
   - **Distinguish list price from street price.** A model "dropping to $X" in a
     deal post is usually a sale, not a new RRP — don't update on that alone.
   - Remember the Buy button links to the live product page (when the item has an
     `asin`), so the shopper always sees Amazon's real-time price regardless of
     the stored `prices` figure. Filling ASINs (Part A) is often higher-value
     than chasing an unconfirmable list price.

3. **Present findings BEFORE editing**, grouped per brand:
   ```
   ## Fujifilm — price changes (N)
   - X100VI  USD 1599 → 1799   src: <official/B&H url>   (US tariff hike; non-USD unchanged)
   - (no confirmed AUD/EUR/… changes)
   ## Fujifilm — no change (verified)
   - X-E5 1699, X-M5 899, …
   ## Needs confirmation
   - <model> — saw $X in a deal post; couldn't confirm as new list price
   ```
   Cite a source URL for every proposed change.

4. **Get approval, then apply.** Edit the `prices:{…}` object for each slug.
   - Change only the currencies you confirmed (usually just `USD`).
   - Each `prices:{…}` line is unique, so a targeted Edit is safe.
   - For a brand-new model where only USD is known, you may run
     `node scripts/compute-prices.js` (Canon) or hand-fill ratio-derived
     non-USD figures following neighbouring magnitudes. Note what's derived.

5. **Update tests if needed.** The data tests assert *shape*, not specific price
   values, so routine price edits don't require test changes. Add/adjust a test
   only if you change pricing **rules** (e.g. a new currency, or the marketplace
   map). The currency format test lives in `tests/logic/currency.test.js`.

6. **Verify.**
   ```bash
   npm test
   ```
   Fix any malformed entry rather than loosening a test. (`npm run test:links`
   is optional and network-bound; buy links are generated so it only checks
   product/image URLs.)

7. **Summarize**: counts of price updates per brand, the test result, and any
   items left under "Needs confirmation".

---

## Guardrails

- **Never invent prices or ASINs.** Unknown / unconfirmed price → leave the
  existing value and flag it (use `null` only for a genuinely unavailable non-USD
  figure). Unsure of an ASIN → leave it blank and let the search fallback handle
  it; a wrong ASIN is worse than no ASIN.
- **ASINs point at the plain product**, not bundles / Renewed / International
  variants. Sourced from amazon.com; 10-char uppercase alphanumeric.
- **List price, not street price.** Don't bake sales/discounts into the data.
- **US-only changes stay US-only** — don't ripple a US tariff hike into AUD/EUR/etc.
- **Don't reintroduce `buyUrl` fields** — buy links are generated; adding static
  ones would silently break currency-awareness.
- **Don't reformat** unrelated parts of `data.js`; touch only the fields that change.
- **Always cite a source URL** for every applied price change.
- Run manually; don't schedule, commit, or push unless the user asks.
