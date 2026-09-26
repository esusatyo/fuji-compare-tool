// ─────────────────────────────────────────────
// Tier "Worker" — _worker.js's /img-cache/ edge proxy, in isolation.
//
// _worker.js is a Cloudflare Worker module (`export default { fetch }`),
// not a jsdom page, so this doesn't use tests/helpers/load-brand. Instead
// it imports the real file directly (Node's module-syntax auto-detection
// parses its `export default` fine — see the warning suppressed below)
// and stubs the platform pieces it relies on that Node doesn't provide:
// `caches.default` (Cache API), and — for the timeout test only —
// `AbortSignal.timeout`. `fetch` itself is always stubbed so these tests
// never depend on the real, sometimes-hanging fujifilm-x.b-cdn.net.
//
// Why fake the timeout instead of asserting the real ~8s wait: the 8000ms
// value is just how long a real AbortSignal.timeout(ms) takes to fire —
// standard platform behavior, already confirmed manually against the real
// Worker (wrangler dev + curl: exactly ~8.0s). What this suite guards is
// the surrounding logic (allowlist, caching, error mapping), so the one
// timeout test monkey-patches AbortSignal.timeout to fire in ~20ms and
// proves the abort really does preempt a slow mock fetch and map to a 504
// — without a multi-second test.
// ─────────────────────────────────────────────
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

async function loadWorker() {
  const mod = await import(path.join('..', '..', '_worker.js'));
  return mod.default;
}

function makeMockCache() {
  const store = new Map();
  return {
    async match(request) {
      return store.has(request.url) ? store.get(request.url).clone() : undefined;
    },
    async put(request, response) {
      store.set(request.url, response);
    },
    store,
  };
}

function makeEnv(assetsFetch) {
  return {
    ASSETS: {
      fetch: assetsFetch || (async (request) => new Response(`asset:${request.url}`, { status: 200 })),
    },
  };
}

function makeCtx() {
  const waited = [];
  return {
    waitUntil(p) { waited.push(p); },
    async flush() { await Promise.all(waited); },
  };
}

/** Run `fn` with globalThis.fetch/caches (and optionally AbortSignal.timeout)
 *  swapped out, then always restore them — even on failure. */
async function withMocks({ fetchImpl, cache = makeMockCache(), fakeTimeout }, fn) {
  const realFetch = globalThis.fetch;
  const realCaches = globalThis.caches;
  const realTimeout = AbortSignal.timeout;
  globalThis.fetch = fetchImpl;
  globalThis.caches = { default: cache };
  if (fakeTimeout) AbortSignal.timeout = (/* ms */) => realTimeout(fakeTimeout);
  try {
    return await fn(cache);
  } finally {
    globalThis.fetch = realFetch;
    globalThis.caches = realCaches;
    AbortSignal.timeout = realTimeout;
  }
}

test('non-/img-cache/ requests pass straight through to env.ASSETS.fetch', async () => {
  const worker = await loadWorker();
  const env = makeEnv(async (request) => new Response(`asset:${request.url}`, { status: 200 }));
  const req = new Request('https://example.test/fujifilm/');
  const res = await worker.fetch(req, env, makeCtx());
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'asset:https://example.test/fujifilm/');
});

test('rejects a host not on the allowlist with 404, without touching fetch', async () => {
  const worker = await loadWorker();
  let fetchCalled = false;
  await withMocks({ fetchImpl: async () => { fetchCalled = true; throw new Error('should not be called'); } }, async () => {
    const req = new Request('https://example.test/img-cache/evil.example.com/foo.jpg');
    const res = await worker.fetch(req, makeEnv(), makeCtx());
    assert.equal(res.status, 404);
  });
  assert.equal(fetchCalled, false, 'origin fetch must not be attempted for a disallowed host');
});

test('rejects a malformed /img-cache/ path with no host/path separator', async () => {
  const worker = await loadWorker();
  const req = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net');
  const res = await worker.fetch(req, makeEnv(), makeCtx());
  assert.equal(res.status, 404);
});

test('rejects non-GET/HEAD methods on the img-cache route', async () => {
  const worker = await loadWorker();
  const req = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net/x.jpg', { method: 'POST' });
  const res = await worker.fetch(req, makeEnv(), makeCtx());
  assert.equal(res.status, 405);
});

test('proxies an allowed host: fetches the reconstructed origin URL (host + path + query preserved)', async () => {
  const worker = await loadWorker();
  let calledWith;
  await withMocks({
    fetchImpl: async (url) => {
      calledWith = String(url);
      return new Response('img-bytes', { status: 200, headers: { 'content-type': 'image/jpeg' } });
    },
  }, async () => {
    const req = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net/wp-content/uploads/x-t5.jpg?width=400');
    const res = await worker.fetch(req, makeEnv(), makeCtx());
    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'img-bytes');
    assert.equal(res.headers.get('content-type'), 'image/jpeg');
  });
  assert.equal(calledWith, 'https://fujifilm-x.b-cdn.net/wp-content/uploads/x-t5.jpg?width=400');
});

test('sets a long-lived, immutable Cache-Control on a fresh origin fetch and strips set-cookie', async () => {
  const worker = await loadWorker();
  await withMocks({
    fetchImpl: async () => new Response('img-bytes', {
      status: 200,
      headers: { 'content-type': 'image/jpeg', 'set-cookie': 'session=abc' },
    }),
  }, async () => {
    const req = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net/a.jpg');
    const res = await worker.fetch(req, makeEnv(), makeCtx());
    assert.match(res.headers.get('cache-control') || '', /public/);
    assert.match(res.headers.get('cache-control') || '', /max-age=\d+/);
    assert.equal(res.headers.get('set-cookie'), null);
  });
});

test('a cached response is served without calling fetch again', async () => {
  const worker = await loadWorker();
  const cache = makeMockCache();
  let fetchCount = 0;
  await withMocks({
    cache,
    fetchImpl: async () => { fetchCount++; return new Response('img-bytes', { status: 200 }); },
  }, async () => {
    const req1 = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net/a.jpg');
    const ctx1 = makeCtx();
    const res1 = await worker.fetch(req1, makeEnv(), ctx1);
    assert.equal(res1.status, 200);
    await ctx1.flush(); // let the background cache.put() land

    const req2 = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net/a.jpg');
    const res2 = await worker.fetch(req2, makeEnv(), makeCtx());
    assert.equal(res2.status, 200);
    assert.equal(await res2.text(), 'img-bytes');
  });
  assert.equal(fetchCount, 1, 'second request should be served from cache, not re-fetched');
});

test('a successful fetch is written to the edge cache via ctx.waitUntil (not blocking the response)', async () => {
  const worker = await loadWorker();
  const cache = makeMockCache();
  await withMocks({
    cache,
    fetchImpl: async () => new Response('img-bytes', { status: 200 }),
  }, async () => {
    const req = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net/a.jpg');
    const ctx = makeCtx();
    await worker.fetch(req, makeEnv(), ctx);
    await ctx.flush();
    assert.ok(cache.store.has('https://example.test/img-cache/fujifilm-x.b-cdn.net/a.jpg'));
  });
});

test('returns 502 when the origin responds but not ok', async () => {
  const worker = await loadWorker();
  await withMocks({
    fetchImpl: async () => new Response('not found upstream', { status: 404 }),
  }, async () => {
    const req = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net/missing.jpg');
    const res = await worker.fetch(req, makeEnv(), makeCtx());
    assert.equal(res.status, 502);
  });
});

test('a hung/rejecting origin fetch is mapped to a fast 504, not left to hang', async () => {
  const worker = await loadWorker();
  // Simulates fujifilm-x.b-cdn.net: connects but never resolves, until the
  // (faked, ~20ms) AbortSignal.timeout fires and aborts it.
  const slowFetch = (url, opts) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(new Response('too-late', { status: 200 })), 2000);
    opts?.signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
    });
  });
  await withMocks({ fetchImpl: slowFetch, fakeTimeout: 20 }, async () => {
    const req = new Request('https://example.test/img-cache/fujifilm-x.b-cdn.net/hangs.jpg');
    const start = Date.now();
    const res = await worker.fetch(req, makeEnv(), makeCtx());
    const elapsed = Date.now() - start;
    assert.equal(res.status, 504);
    assert.ok(elapsed < 1000, `expected the fake ~20ms timeout to preempt the 2s mock fetch, took ${elapsed}ms`);
  });
});
