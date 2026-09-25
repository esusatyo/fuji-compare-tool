// Tier 2 — Image src resolution (engine.js's resolveImageSrc, used by
// buildPlaceholder for every <img src>).
//
// Hosts in PROXIED_IMAGE_HOSTS hang (not error) on a meaningful share of
// requests, which <img onerror> can't catch — see _worker.js's file header.
// The rendered <img src> for those hosts must go through the same-origin
// /img-cache/<host>/<path> proxy; every other host's imageUrl must render
// unchanged. `imageUrl` in brand data files is never rewritten — only the
// rendered src differs — so this is purely a rendering-layer test.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { setSlot, clickMode } = require('../helpers/dom');

function expectedProxiedSrc(imageUrl) {
  const u = new URL(imageUrl);
  return `/img-cache/${u.host}${u.pathname}${u.search}`;
}

for (const brand of brandDirs()) {
  test(`[${brand}] imageUrl on a proxied host renders through /img-cache/, unproxied hosts render unchanged`, () => {
    const { window, data, engine } = loadBrand(brand, { engine: true });
    const proxiedHosts = engine.PROXIED_IMAGE_HOSTS;

    const withImages = (collection) => Object.entries(collection).filter(([, item]) => item.imageUrl);
    const cameras = withImages(data.CAMERAS);
    const lenses = withImages(data.LENSES);

    let sawProxied = false;
    let sawUnproxied = false;

    const check = (id, item, mode) => {
      if (mode === 'lenses') clickMode(window, 'lenses'); else clickMode(window, 'cameras');
      setSlot(window, 0, id);
      const img = window.document.querySelector('#slot-0 img.cam-photo');
      assert.ok(img, `[${brand}/${id}] expected an <img class="cam-photo"> to render`);
      const src = img.getAttribute('src');
      const host = new URL(item.imageUrl).host;
      if (proxiedHosts.has(host)) {
        assert.equal(src, expectedProxiedSrc(item.imageUrl),
          `[${brand}/${id}] proxied-host imageUrl should render through /img-cache/`);
        sawProxied = true;
      } else {
        assert.equal(src, item.imageUrl,
          `[${brand}/${id}] non-proxied-host imageUrl should render unchanged`);
        sawUnproxied = true;
      }
    };

    for (const [id, item] of cameras) check(id, item, 'cameras');
    for (const [id, item] of lenses) check(id, item, 'lenses');

    // Only meaningful once a brand actually has items on both sides of the
    // split; Fujifilm does today (b-cdn.net cameras/lenses + Wikimedia GFX
    // bodies). A brand with only one side just skips the other assertion.
    if ([...proxiedHosts].some(h => [...cameras, ...lenses].some(([, i]) => new URL(i.imageUrl).host === h))) {
      assert.ok(sawProxied, `[${brand}] expected at least one proxied-host image to actually be exercised`);
    }
    if ([...cameras, ...lenses].some(([, i]) => !proxiedHosts.has(new URL(i.imageUrl).host))) {
      assert.ok(sawUnproxied, `[${brand}] expected at least one non-proxied-host image to actually be exercised`);
    }
  });
}

test('engine.js PROXIED_IMAGE_HOSTS stays in sync with _worker.js ALLOWED_ORIGIN_HOSTS', async () => {
  const { engine } = loadBrand('fujifilm', { engine: true });
  const workerMod = await import('../../_worker.js');
  assert.deepEqual(
    [...engine.PROXIED_IMAGE_HOSTS].sort(),
    [...workerMod.ALLOWED_ORIGIN_HOSTS].sort(),
    'engine.js and _worker.js must list the same proxied hosts — see both files\' comments on why this can\'t be a shared import',
  );
});
