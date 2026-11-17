## Why

Bing Webmaster Tools (checked 2026-10-24) shows that Bing is slow to notice changes here: it last read `sitemap.xml` on 2026-07-19, and still counts 222 URLs from before the noindex change cut the sitemap to 57. Its top recommendation for the site is "set up IndexNow" (High). Bing is now the site's largest outside source, mostly through Copilot citations (911 since mid-September). Cloudflare Crawler Hints is switched on for the zone but has never delivered a URL: Bing's IndexNow report is empty. The likely reason is that pages are served as Workers static assets rather than through the cache Crawler Hints watches. So the site has to ping IndexNow itself.

## What Changes

- Commit the Bing-issued IndexNow key file, `870b934a4865448e894273f3859a8725.txt`, at the site root, so it is served at `https://comparecameraspecs.com/<key>.txt`.
- New `scripts/indexnow.js` (zero-dependency): works out which indexable URLs a commit range changed and POSTs them to `https://api.indexnow.org/indexnow`. It has `--all` (submit every sitemap URL) and `--dry-run` modes.
- New GitHub Actions workflow `.github/workflows/indexnow.yml`: on every push to `main`, it waits for the Cloudflare Workers Builds check on that commit to succeed, then runs the script over the pushed range.
- A new Tier 1 test covers the key file (served, not asset-ignored, contents match) and the URL selection rules.

## Capabilities

### Modified Capabilities
- `seo-surface`: adds "Search engines are notified of changed pages".

## Impact

- **New files**: the key file, `scripts/indexnow.js`, `.github/workflows/indexnow.yml` (the repo's first workflow), `tests/data/indexnow.test.js`.
- **No runtime change**: there are no page, engine or Worker edits. The key file is one more static asset.
- **Google is unaffected.** It does not use IndexNow. Bing shares submissions with Yandex, Seznam, Naver and the other participating engines.
