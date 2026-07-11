// ─────────────────────────────────────────────
// Tier 3 — Link & image liveness (opt-in).
//
// Slow and inherently flaky (retailers rate-limit and bot-block), so this
// suite is SKIPPED unless RUN_LINK_TESTS is set:
//
//     npm run test:links
//
// Dead links (404/410, DNS failures) fail; anti-bot responses
// (403/429/503) and timeouts only warn, since they say nothing about
// whether the link works for a human.
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

// Status policy:
//   200, 3xx            -> PASS
//   404, 410            -> FAIL (dead link)
//   403, 429, 503       -> WARN, not fail (anti-bot blocking, esp. Amazon)
//   timeout             -> WARN (reported as 503)
//   images: must also return Content-Type image/*
const FAIL_STATUSES = new Set([404, 410]);
const WARN_STATUSES = new Set([403, 429, 503]);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function fetchStatus(url, method) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(url, {
      method, redirect: 'follow', signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: '*/*' },
    });
    const contentType = res.headers.get('content-type');
    // Drain/cancel the body so sockets are released promptly.
    if (res.body) await res.body.cancel().catch(() => {});
    return { status: res.status, contentType };
  } finally {
    clearTimeout(timer);
  }
}

async function checkUrl(url, kind) {
  try {
    let r = await fetchStatus(url, 'HEAD');
    // Many servers reject or mishandle HEAD — confirm any non-OK with GET.
    if (r.status >= 400 || (kind === 'image' && !/^image\//.test(r.contentType || ''))) {
      r = await fetchStatus(url, 'GET');
    }
    return r;
  } catch (err) {
    // Timeouts and resets say nothing about the link for a human: warn.
    if (err.name === 'AbortError' || err.name === 'TimeoutError') return { status: 503, contentType: null };
    throw err; // DNS failure, TLS error → genuine dead link, let it fail
  }
}

/** Run `worker` over items with a fixed concurrency limit. */
async function runPool(items, worker, limit = 5) {
  const queue = [...items];
  await Promise.all(Array.from({ length: limit }, async () => {
    while (queue.length) await worker(queue.shift());
  }));
}

test('URL collector finds links across all brands', () => {
  const urls = collectUrls();
  assert.ok(urls.size > 0, 'expected to collect at least one URL');
  const kinds = new Set([...urls.values()].map(v => v.kind));
  assert.ok(kinds.has('buy') || kinds.has('image'), 'expected buy/image URLs');
});

test('all product/image links are reachable', { skip: !ENABLED }, async () => {
  const urls = collectUrls();
  const failures = [];
  const warnings = [];
  await runPool([...urls.entries()], async ([url, meta]) => {
    try {
      const { status, contentType } = await checkUrl(url, meta.kind);
      if (FAIL_STATUSES.has(status)) failures.push(`${status} ${url} (${meta.refs.join(', ')})`);
      else if (WARN_STATUSES.has(status)) warnings.push(`${status} ${url}`);
      else if (meta.kind === 'image' && !/^image\//.test(contentType || '')) {
        failures.push(`non-image content-type (${contentType}) for ${url} (${meta.refs.join(', ')})`);
      }
    } catch (err) {
      failures.push(`error ${url}: ${err.cause ? err.cause.code || err.cause.message : err.message} (${meta.refs.join(', ')})`);
    }
  });
  if (warnings.length) console.warn(`Link warnings (bot-blocked/timeout, not failed):\n${warnings.join('\n')}`);
  assert.deepEqual(failures, [], `\nDead links:\n${failures.join('\n')}`);
});

module.exports = { collectUrls, FAIL_STATUSES, WARN_STATUSES };
