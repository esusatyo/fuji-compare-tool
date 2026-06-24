// Tier 1 — Data completeness rules (distinct from structural schema validity).
// These enforce business expectations: every product has an image, and every
// current camera/lens is priced in all supported currencies.
//
// `priceIncomplete: true` on a lens item is an explicit acknowledgement that
// a regional RRP is genuinely unavailable (e.g. no official distribution).
// Items with this flag skip the currency-completeness check but still require
// a valid USD price. Remove the flag once the price is filled in.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { CURRENCIES } = require('../helpers/schema');

// Items with no freely-licensed product image available yet. Each entry is a
// documented exception, not a silent skip — the test below fails if an
// allowlisted item later gains an image (so this list self-cleans over time).
const KNOWN_IMAGE_GAPS = {
  canon: new Set([
    'eos-r50v',          // 2025 vlogging body — no Wikimedia/Commons image yet
    'rf-85mm-f14-l-vcm', // RF 85mm f/1.4 L VCM — no Commons image yet
    // 2025–2026 RF/RF-S lenses — no freely-licensed Commons image yet
    'rf-14mm-f14-l-vcm',
    'rf-20mm-f14-l-vcm',
    'rf-45mm-f12-stm',
    'rf-20-50mm-f4-l-is-usm-pz',
    'rf-7-14mm-f28-35-l-fisheye-stm',
    'rf-16-28mm-f28-is-stm',
    'rf-75-300mm-f4-56',
    'rfs-14-30mm-f4-63-is-stm-pz',
  ]),
  fujifilm: new Set([
    'xc-16-50mm-f35-56', // no freely-licensed product image found
  ]),
  sony: new Set([
    // Images sourced in the dedicated image batch (Group 9). a7-iv already has one.
    'a1-ii',
    'a9-iii',
    'a7-v',
    'a7r-v',
    'a7cr',
    'a7c-ii',
    'a7s-iii',
    'a1',
    'a7c',
    'a9-ii', 'a7r-iv', 'a7-iii', 'a9', 'a7r-iii',
    'a7r-ii', 'a7s-ii', 'a7-ii', 'a7r', 'a7', 'a7s',
    'a6700', 'a6400', 'a6600', 'a6500', 'a6300', 'a6100', 'a6000',
    'fx3', 'fx30',
    'zv-e1', 'zv-e10-ii', 'zv-e10',
    'fe-14mm-f18-gm', 'fe-24mm-f14-gm', 'fe-35mm-f14-gm', 'fe-50mm-f12-gm',
    'fe-85mm-f14-gm-ii', 'fe-85mm-f14-gm', 'fe-100mm-f28-stf-gm', 'fe-135mm-f18-gm',
    'fe-300mm-f28-gm', 'fe-400mm-f28-gm', 'fe-600mm-f4-gm',
    'fe-50mm-f14-gm',
    'fe-24-70mm-f28-gm-ii',
    'fe-70-200mm-f28-gm-oss-ii',
  ]),
};

for (const brand of brandDirs()) {
  const { data } = loadBrand(brand);
  const gaps = KNOWN_IMAGE_GAPS[brand] || new Set();

  test(`[${brand}] every camera and lens has a product image`, () => {
    const missing = [];
    const staleAllow = [];
    const sweep = (collection, kind) => {
      for (const [id, item] of Object.entries(collection)) {
        if (!item.imageUrl) { if (!gaps.has(id)) missing.push(`${kind} ${id}`); }
        else if (gaps.has(id)) staleAllow.push(id);
      }
    };
    sweep(data.CAMERAS, 'camera');
    sweep(data.LENSES, 'lens');
    assert.deepEqual(missing, [], `\n${missing.length} item(s) missing imageUrl:\n${missing.join('\n')}`);
    assert.deepEqual(staleAllow, [],
      `\nThese now have an image — remove them from KNOWN_IMAGE_GAPS[${brand}]:\n${staleAllow.join('\n')}`);
  });

  test(`[${brand}] every current camera is priced in all currencies`, () => {
    const gaps = [];
    for (const [id, c] of Object.entries(data.CAMERAS)) {
      if (c.discontinued) continue; // discontinued bodies legitimately show USD only
      for (const cur of CURRENCIES) {
        if (c.prices[cur] == null) gaps.push(`${id}: missing ${cur}`);
      }
    }
    assert.deepEqual(gaps, [], `\n${gaps.length} current-camera price gap(s):\n${gaps.join('\n')}`);
  });

  test(`[${brand}] every current lens is priced in all currencies`, () => {
    const gaps = [];
    for (const [id, l] of Object.entries(data.LENSES)) {
      if (l.discontinued) continue;   // discontinued lenses show USD only
      if (l.priceIncomplete) continue; // explicit acknowledgement — no regional RRP available
      for (const cur of CURRENCIES) {
        if (l.prices[cur] == null) gaps.push(`${id}: missing ${cur}`);
      }
    }
    assert.deepEqual(gaps, [], `\n${gaps.length} current-lens price gap(s):\n${gaps.join('\n')}`);
  });
}
