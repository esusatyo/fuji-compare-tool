// Tier 2 — Shareable comparison URLs: hash ↔ selection round-trip,
// per-slot fallback for unknown slugs, legacy bare-mode hashes, and
// brand-switch hash normalization.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { setSlot, clickMode, slotSelect } = require('../helpers/dom');

function slotValues(window) {
  return [0, 1, 2].map(i => slotSelect(window, i).value);
}

/** Three item ids that are not in the mode's default selection. */
function nonDefaultIds(data, mode) {
  const pool = mode === 'cameras' ? data.CAMERA_ORDER : Object.keys(data.LENSES);
  const defaults = data.BRAND_CONFIG[mode].defaultSelected;
  return pool.filter(id => !defaults.includes(id)).slice(0, 3);
}

for (const brand of brandDirs()) {
  test(`[${brand}] loading a full camera hash restores that selection`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const ids = nonDefaultIds(data, 'cameras');
    const hash = `#cameras=${ids.join(',')}`;
    const loaded = loadBrand(brand, { engine: true, hash });
    assert.deepEqual(slotValues(loaded.window), ids);
    // Init must not rewrite the hash.
    assert.equal(loaded.window.location.hash, hash);
  });

  test(`[${brand}] loading a lens hash restores lenses mode and selection`, () => {
    const { data } = loadBrand(brand, { engine: true });
    const ids = nonDefaultIds(data, 'lenses');
    const { window } = loadBrand(brand, { engine: true, hash: `#lenses=${ids.join(',')}` });
    assert.equal(window.document.getElementById('header-title').textContent,
      data.BRAND_CONFIG.lenses.headerTitle);
    assert.deepEqual(slotValues(window), ids);
  });

  test(`[${brand}] unknown slug falls back per slot, not whole hash`, () => {
    const { data } = loadBrand(brand, { engine: true });
    const ids = nonDefaultIds(data, 'cameras');
    const defaults = data.BRAND_CONFIG.cameras.defaultSelected;
    const { window } = loadBrand(brand, {
      engine: true, hash: `#cameras=${ids[0]},not-a-camera,${ids[2]}`,
    });
    assert.deepEqual(slotValues(window), [ids[0], defaults[1], ids[2]]);
  });

  test(`[${brand}] partial hash fills remaining slots with defaults`, () => {
    const { data } = loadBrand(brand, { engine: true });
    const ids = nonDefaultIds(data, 'cameras');
    const defaults = data.BRAND_CONFIG.cameras.defaultSelected;
    const { window } = loadBrand(brand, { engine: true, hash: `#cameras=${ids[0]}` });
    assert.deepEqual(slotValues(window), [ids[0], defaults[1], defaults[2]]);
  });

  test(`[${brand}] legacy bare #lenses keeps mode-only meaning`, () => {
    const { window, data } = loadBrand(brand, { engine: true, hash: '#lenses' });
    assert.equal(window.document.getElementById('header-title').textContent,
      data.BRAND_CONFIG.lenses.headerTitle);
    assert.deepEqual(slotValues(window), data.BRAND_CONFIG.lenses.defaultSelected);
    assert.equal(window.location.hash, '#lenses');
  });

  test(`[${brand}] clean visit leaves the URL clean`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    assert.equal(window.location.hash, '');
    assert.deepEqual(slotValues(window), data.BRAND_CONFIG.cameras.defaultSelected);
  });

  test(`[${brand}] changing a slot writes all three slugs to the hash`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const fresh = nonDefaultIds(data, 'cameras')[0];
    const defaults = data.BRAND_CONFIG.cameras.defaultSelected;
    setSlot(window, 0, fresh);
    assert.equal(window.location.hash,
      `#cameras=${[fresh, defaults[1], defaults[2]].join(',')}`);
    // replaceState must not grow the session history.
    assert.equal(window.history.length, 1);
  });

  test(`[${brand}] mode switch writes the new mode's selection`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    clickMode(window, 'lenses');
    assert.equal(window.location.hash,
      `#lenses=${data.BRAND_CONFIG.lenses.defaultSelected.join(',')}`);
  });

  test(`[${brand}] brand switch forwards mode only, never selection slugs`, () => {
    const { data } = loadBrand(brand, { engine: true });
    const ids = nonDefaultIds(data, 'lenses');
    const { window } = loadBrand(brand, { engine: true, hash: `#lenses=${ids.join(',')}` });
    assert.equal(window.brandSwitchHash(), '#lenses');
    // A hash-less visit forwards no hash at all (legacy behaviour).
    const clean = loadBrand(brand, { engine: true });
    assert.equal(clean.window.brandSwitchHash(), '');
  });
}
