// Tier 1 — relatedPairs() is deterministic and only points at real pages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { relatedPairs, curatedPairs } = require('../../scripts/generate-seo');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

for (const brand of brandDirs()) {
  test(`[${brand}] related links are deterministic across runs`, () => {
    const { data } = loadBrand(brand);
    const cams = data.CAMERAS;
    const pairs = curatedPairs(cams);
    for (const [a, b] of pairs) {
      const first = relatedPairs(pairs, cams, a, b);
      const second = relatedPairs(pairs, cams, a, b);
      assert.deepEqual(first, second, `related links for ${a} vs ${b} differ between runs`);
      assert.ok(first.length <= 6, `related links capped at 6, got ${first.length}`);
    }
  });

  test(`[${brand}] related links only target curated pairs (share a camera, not self)`, () => {
    const { data } = loadBrand(brand);
    const cams = data.CAMERAS;
    const pairs = curatedPairs(cams);
    const pairKeys = new Set(pairs.map(([a, b]) => `${a}|${b}`));
    for (const [a, b] of pairs) {
      for (const [x, y] of relatedPairs(pairs, cams, a, b)) {
        assert.ok(pairKeys.has(`${x}|${y}`), `related pair ${x}|${y} is not a generated page`);
        assert.notEqual(`${x}|${y}`, `${a}|${b}`, 'a page should not list itself as related');
        assert.ok(x === a || x === b || y === a || y === b, `${x}|${y} shares no camera with ${a}|${b}`);
      }
    }
  });
}
