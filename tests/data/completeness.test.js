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
  nikon: new Set([
    // Images sourced in a later batch via scripts/fetch-images-commons.js;
    // allowlisted until then (test self-cleans once an image lands).
    'z9', 'z8', 'z6-iii', 'z5-ii', 'z7-ii', 'z7', 'z6-ii', 'z6', 'z5',
    'zf', 'zfc', 'z50-ii', 'z50', 'z30',
    'z-50mm-f1-8-s', 'z-24-70mm-f2-8-s', 'z-70-200mm-f2-8-vr-s',
  ]),
  sony: new Set([
    // 31 of 33 cameras now have curated product images (Wikipedia infobox +
    // Wikimedia Commons category/file lookups, each model-confirmed — a9-ii was
    // visually verified — and verify-images'd). Only a7-v (2025) and a6100 lack
    // any clean Commons product photo and stay on the placeholder card.
    'a7-v',
    'a6100',
    'fe-14mm-f18-gm', 'fe-24mm-f14-gm', 'fe-35mm-f14-gm', 'fe-50mm-f12-gm',
    'fe-85mm-f14-gm-ii', 'fe-85mm-f14-gm', 'fe-100mm-f28-stf-gm', 'fe-135mm-f18-gm',
    'fe-300mm-f28-gm', 'fe-400mm-f28-gm', 'fe-600mm-f4-gm',
    'fe-16mm-f18-g', 'fe-20mm-f18-g', 'fe-24mm-f28-g', 'fe-40mm-f25-g',
    'fe-50mm-f25-g', 'fe-90mm-f28-macro-g', 'fe-28mm-f2', 'fe-35mm-f18',
    'fe-50mm-f18', 'fe-50mm-f28-macro', 'fe-35mm-f14-za', 'fe-35mm-f28-za',
    'fe-50mm-f14-za', 'fe-55mm-f18-za',
    'e-11mm-f18', 'e-15mm-f14-g', 'e-16mm-f28', 'e-20mm-f28', 'e-24mm-f18-za',
    'e-30mm-f35-macro', 'e-35mm-f18-oss', 'e-50mm-f18-oss',
    'fe-50mm-f14-gm',
    'fe-24-70mm-f28-gm-ii',
    'fe-70-200mm-f28-gm-oss-ii',
    'fe-12-24mm-f28-gm', 'fe-12-24mm-f4-g', 'fe-16-25mm-f28-g', 'fe-16-35mm-f28-gm-ii',
    'fe-16-35mm-f28-gm', 'fe-16-35mm-f4-pz-g', 'fe-16-35mm-f4-za-oss', 'fe-20-70mm-f4-g',
    'fe-24-50mm-f28-g', 'fe-24-70mm-f4-za-oss', 'fe-24-105mm-f4-g-oss',
    'fe-24-240mm-f35-63-oss', 'fe-28-60mm-f4-56', 'fe-28-70mm-f2-gm',
    'fe-28-70mm-f35-56-oss-ii', 'fe-28-70mm-f35-56-oss', 'fe-50-150mm-f2-gm',
    'fe-70-200mm-f4-macro-g-oss-ii', 'fe-70-200mm-f4-g-oss',
    'fe-70-300mm-f45-56-g-oss', 'fe-100-400mm-f45-63-gm-oss', 'fe-200-600mm-f56-63-g-oss',
    'fe-400-800mm-f63-8-g-oss',
    'e-10-18mm-f4-oss', 'e-10-20mm-f4-pz-g', 'e-16-50mm-f35-56-pz-oss-ii',
    'e-16-50mm-f35-56-pz-oss', 'e-16-55mm-f28-g', 'e-16-70mm-f4-za-oss',
    'e-18-105mm-f4-g-oss-pz', 'e-18-135mm-f35-56-oss', 'e-55-210mm-f45-63-oss',
    'e-70-350mm-f45-63-g-oss',
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
