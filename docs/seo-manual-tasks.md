# SEO Manual Tasks — comparecameraspecs.com

Tasks that need **your** Google/Microsoft/Cloudflare accounts and can't be done from the repo.
Do them in order — task 1 is the single biggest lever for getting indexed and receiving traffic.

Code-side SEO fixes (favicon, og:image, homepage title, 404 page, sitemap `<lastmod>`,
vs-page unique summaries) are **not** in this file — they're handled in the repo.

---

## 1. Google Search Console (do this first)

Until this is done, Google doesn't know the site exists. A new domain typically takes
1–4 weeks after sitemap submission to start appearing in results — the clock starts here.

1. Go to <https://search.google.com/search-console> and sign in with your Google account.
2. Click **Add property** → choose **Domain** (not "URL prefix") and enter
   `comparecameraspecs.com`. Domain properties cover `http/https` and all subdomains at once.
3. Google shows a **TXT record** to prove ownership. Copy the value
   (looks like `google-site-verification=AbC123...`).
4. In another tab, open the **Cloudflare dashboard** → select the
   `comparecameraspecs.com` zone → **DNS** → **Records** → **Add record**:
   - Type: `TXT`
   - Name: `@`
   - Content: paste the `google-site-verification=...` value
   - TTL: Auto
5. Back in Search Console, click **Verify**. DNS can take a few minutes to propagate —
   if it fails, wait 5–10 minutes and retry. Don't delete the TXT record afterwards;
   Google re-checks it periodically.
6. Once verified: left sidebar → **Sitemaps** → enter `sitemap.xml` → **Submit**.
   Status should show "Success" with the URL count within a day or two.
7. Left sidebar → **URL Inspection** → paste each of these, then click
   **Request Indexing** (this jumps the queue for the most important pages;
   there's a daily quota of ~10, so spread over two days if needed):
   - `https://comparecameraspecs.com/`
   - `https://comparecameraspecs.com/fujifilm/`
   - `https://comparecameraspecs.com/sony/`
   - `https://comparecameraspecs.com/canon/`
   - `https://comparecameraspecs.com/nikon/`
   - `https://comparecameraspecs.com/panasonic/`
   - `https://comparecameraspecs.com/fujifilm/vs/x100vi-vs-x100v`
   - `https://comparecameraspecs.com/sony/vs/a7-v-vs-a7-iv`
   - `https://comparecameraspecs.com/nikon/vs/z6-iii-vs-z6-ii`
   - `https://comparecameraspecs.com/canon/vs/eos-r5-ii-vs-eos-r5`

## 2. Bing Webmaster Tools (5 minutes, do right after GSC)

Bing powers DuckDuckGo, Yahoo, and most AI search products (ChatGPT search, Copilot),
so this is cheap reach.

1. Go to <https://www.bing.com/webmasters> and sign in (Microsoft, Google, or Facebook login).
2. Choose **Import from Google Search Console** — it pulls the verified property and
   sitemap automatically, no separate DNS record needed.
3. Confirm under **Sitemaps** that `https://comparecameraspecs.com/sitemap.xml` is listed;
   if not, submit it manually there.

## 3. Re-submit after new pages ship

Whenever a batch of new pages is merged (e.g. the upcoming cross-brand `/vs/` pages),
`scripts/generate-seo.js` regenerates `sitemap.xml`. After deploying:

1. GSC → **Sitemaps** → the existing `sitemap.xml` entry re-processes automatically,
   but you can force it by re-submitting the same URL.
2. **Request Indexing** on 3–5 of the strongest new pages via URL Inspection.

## 4. Weekly monitoring (5 minutes/week)

- **GSC → Indexing → Pages**: watch "Indexed" climb toward the sitemap count.
  If many pages sit in **"Crawled – currently not indexed"** for 3+ weeks, that's the
  thin-content signal — tell Claude; the fix is strengthening per-page unique content.
- **GSC → Performance**: which queries get impressions. Rising impressions on a query
  with zero clicks = a page worth improving (title/summary).
- **GoatCounter** (<https://esusatyo.goatcounter.com>): referrer traffic from any
  community shares.

## 5. Community seeding (optional, but the fastest real traffic)

Search takes weeks; communities take hours. The tool is genuinely useful, so share it
where a comparison link answers someone's actual question:

- Subreddits: r/fujifilm, r/fujix, r/SonyAlpha, r/canon, r/Nikon, r/M43,
  r/AskPhotography, r/Cameras. **Read each sub's self-promo rules first** — the safe
  pattern is answering "should I buy X or Y?" threads with a direct link to that
  exact comparison page, not posting the site cold.
- Forums: FujiX-Forum, DPReview forums (still active), Fred Miranda.
- If you post the site itself, "Show off" / "I made this" threads (r/SideProject,
  Hacker News "Show HN") convert well for tools with clean UX.

## Done so far

- [x] GoatCounter analytics live on all pages
- [x] robots.txt + sitemap.xml served at the root
- [x] Canonical URLs, meta descriptions, OG tags, Product/ItemList structured data
      on all generated pages
- [ ] Google Search Console verified + sitemap submitted
- [ ] Bing Webmaster Tools imported
- [ ] First indexing requests sent
