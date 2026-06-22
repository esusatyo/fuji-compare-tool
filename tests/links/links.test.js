// ─────────────────────────────────────────────
// Tier 3 — Link & image liveness (STUB / opt-in).
//
// Slow and inherently flaky (retailers rate-limit and bot-block), so this
// suite is SKIPPED unless RUN_LINK_TESTS is set:
//
//     npm run test:links
//
// The URL collector below is real and shared with whatever checker we
// flesh out next. The actual network checks are stubbed with the intended
// status-handling policy documented inline.
// ─────────────────────────────────────────────
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

const ENABLED = !!process.env.RUN_LINK_TESTS;

/** Collect every external URL across all brands, deduped, tagged by kind. */
function collectUrls() {
  const urls = new Map(); // url -> { kind, refs: [] }
  const addUrl = (url, kind, ref) => {
    if (!url) return;
    if (!urls.has(url)) urls.set(url, { kind, refs: [] });
    urls.get(url).refs.push(ref);
  };
  for (const brand of brandDirs()) {
    const { data } = loadBrand(brand);
    // Buy links are generated per-currency at render time (Amazon search
    // URLs), not stored on items, so there's nothing to sweep for 'buy'.
    const sweep = (collection, type) => {
      for (const [id, item] of Object.entries(collection)) {
        addUrl(item.productUrl, 'product', `${brand}/${type}/${id}`);
        addUrl(item.imageUrl, 'image', `${brand}/${type}/${id}`);
      }
    };
    sweep(data.CAMERAS, 'camera');
    sweep(data.LENSES, 'lens');
  }
  return urls;
}

// Status policy (to implement when wiring real fetch):
//   200, 3xx            -> PASS
//   404, 410            -> FAIL (dead link)
//   403, 429, 503       -> WARN, not fail (anti-bot blocking, esp. Amazon)
//   images: must also return Content-Type image/*
const FAIL_STATUSES = new Set([404, 410]);
const WARN_STATUSES = new Set([403, 429, 503]);

async function checkUrl(/* url, kind */) {
  // TODO: implement with global fetch:
  //   - HEAD first, GET fallback; realistic User-Agent; ~5s timeout
  //   - concurrency limit (~5); cache results in fixtures/link-cache.json
  //   - classify via FAIL_STATUSES / WARN_STATUSES; verify image Content-Type
  throw new Error('link checker not yet implemented');
}

test('URL collector finds links across all brands', () => {
  const urls = collectUrls();
  assert.ok(urls.size > 0, 'expected to collect at least one URL');
  const kinds = new Set([...urls.values()].map(v => v.kind));
  assert.ok(kinds.has('buy') || kinds.has('image'), 'expected buy/image URLs');
});

// Skipped unless RUN_LINK_TESTS=1; marked `todo` until checkUrl() is wired,
// so enabling the suite reports it as pending rather than a hard failure.
test('all buy/product/image links are reachable', { skip: !ENABLED, todo: ENABLED }, async () => {
  const urls = collectUrls();
  const failures = [];
  const warnings = [];
  for (const [url, meta] of urls) {
    try {
      const { status, contentType } = await checkUrl(url, meta.kind);
      if (FAIL_STATUSES.has(status)) failures.push(`${status} ${url} (${meta.refs.join(', ')})`);
      else if (WARN_STATUSES.has(status)) warnings.push(`${status} ${url}`);
      else if (meta.kind === 'image' && !/^image\//.test(contentType || '')) {
        failures.push(`non-image content-type for ${url}`);
      }
    } catch (err) {
      failures.push(`error ${url}: ${err.message}`);
    }
  }
  if (warnings.length) console.warn(`Link warnings (bot-blocked, not failed):\n${warnings.join('\n')}`);
  assert.deepEqual(failures, [], `\nDead links:\n${failures.join('\n')}`);
});

module.exports = { collectUrls, FAIL_STATUSES, WARN_STATUSES };
