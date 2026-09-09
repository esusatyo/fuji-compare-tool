// Tier 2 — A brand page takes its slot count from `defaultSelected`.
//
// Brand pages used to hardcode three slots. Any brand declaring fewer than
// three default ids rendered an empty slot, and the spec table dereferenced it:
// `TypeError: Cannot read properties of undefined (reading 'year')`, taking the
// whole page down. That produced an invisible four-camera minimum per brand,
// which is why Sigma had to carry two Foveon bodies it had otherwise deferred.
//
// No shipped brand declares two defaults yet, so these tests patch one that
// does — otherwise the two-slot path would go untested until the next thin
// brand hit the same wall.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

const twoCameraDefaults = src =>
  src.replace(/defaultSelected: \['bf', 'fp-l', 'fp'\]/, "defaultSelected: ['bf', 'fp-l']");

test('[sigma] a two-default brand renders two slots and does not throw', () => {
  const { window, data } = loadBrand('sigma', { engine: true, patchData: twoCameraDefaults });
  assert.equal(data.BRAND_CONFIG.cameras.defaultSelected.length, 2, 'patch applied');

  const row = window.document.querySelector('.spec-row');
  assert.ok(row, 'spec table rendered');
  assert.equal(row.querySelectorAll('.spec-value').length, 2,
    'two defaults should render exactly two value cells per row');
});

test('[sigma] two-slot layout still fills both slots with real items', () => {
  const { window } = loadBrand('sigma', { engine: true, patchData: twoCameraDefaults });
  const values = [...window.document.querySelector('.spec-row').querySelectorAll('.spec-value')];
  for (const [i, cell] of values.entries()) {
    assert.notEqual(cell.textContent.trim(), '',
      `slot ${i} should carry a value, not an empty cell`);
  }
});

test('every shipped brand declares enough defaults for its slot count', () => {
  // The engine clamps to a minimum of two slots, so a brand declaring a single
  // default would still leave slot 1 empty. Nothing ships that way today; this
  // keeps it that way.
  for (const brand of brandDirs()) {
    const { data } = loadBrand(brand);
    for (const mode of ['cameras', 'lenses']) {
      const n = data.BRAND_CONFIG[mode].defaultSelected.length;
      assert.ok(n >= 2,
        `[${brand}] ${mode}.defaultSelected has ${n} id(s); the engine renders at least 2 slots`);
    }
  }
});
