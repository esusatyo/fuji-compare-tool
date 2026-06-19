// Tier 1 — Per-item schema validation for every camera and lens, every brand.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { validateCamera, validateLens } = require('../helpers/schema');

for (const brand of brandDirs()) {
  const { data } = loadBrand(brand);
  const brandSections = data.BRAND_CONFIG.brandSections || [];

  test(`[${brand}] cameras conform to schema`, () => {
    const problems = [];
    for (const [id, cam] of Object.entries(data.CAMERAS)) {
      problems.push(...validateCamera(id, cam, brandSections));
    }
    assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  });

  test(`[${brand}] lenses conform to schema`, () => {
    const problems = [];
    for (const [id, lens] of Object.entries(data.LENSES)) {
      problems.push(...validateLens(id, lens));
    }
    assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  });
}
