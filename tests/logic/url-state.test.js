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

function visibleCount(window) {
  return [...window.document.querySelectorAll('.compare-slot')]
    .filter(s => s.style.display !== 'none').length;
}

/**
 * Three item ids forming a selection that differs from the mode's default.
 *
 * Prefers ids outside `defaultSelected`, but tops up from the end of the pool
 * for brands whose catalogue is smaller than defaults+3 (Sigma ships five
 * cameras). The point of these tests is that a hash round-trips through the
 * engine — not that every brand has six of everything — so the helper adapts
 * rather than forcing thin brands to carry filler entries.
 */
function nonDefaultIds(data, mode) {
  const pool = mode === 'cameras' ? data.CAMERA_ORDER : Object.keys(data.LENSES);
  const defaults = data.BRAND_CONFIG[mode].defaultSelected;
  const picked = pool.filter(id => !defaults.includes(id));
  for (const id of [...pool].reverse()) {
    if (picked.length >= 3) break;
    if (!picked.includes(id)) picked.push(id);
  }
  return picked.slice(0, 3);
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

  test(`[${brand}] a one-entry hash shows two slots, the second at its default`, () => {
    const { data } = loadBrand(brand, { engine: true });
    const ids = nonDefaultIds(data, 'cameras');
    const defaults = data.BRAND_CONFIG.cameras.defaultSelected;
    const { window } = loadBrand(brand, { engine: true, hash: `#cameras=${ids[0]}` });
    assert.equal(visibleCount(window), 2);
    assert.deepEqual(slotValues(window).slice(0, 2), [ids[0], defaults[1]]);
    assert.equal(window.location.hash, `#cameras=${ids[0]},${defaults[1]}`,
      'rewritten to the two slots on screen');
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

  test(`[${brand}] changing a slot writes the three visible slugs to the hash`, () => {
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

// ── The hash follows the screen ──────────────
// A brand page's hash carries its slot count, the way compare/'s does, and
// only ever lists the items on screen — so a link shared from a phone opens
// as the two items its sender saw.
test('[fujifilm] a two- or four-entry hash restores that many slots', () => {
  const { data } = loadBrand('fujifilm');
  const ids = data.CAMERA_ORDER.slice(0, 4);
  for (const n of [2, 4]) {
    const hash = `#cameras=${ids.slice(0, n).join(',')}`;
    const { window } = loadBrand('fujifilm', { engine: true, hash });
    assert.equal(visibleCount(window), n);
    assert.deepEqual([...Array(n).keys()].map(i => slotSelect(window, i).value), ids.slice(0, n));
    assert.equal(window.location.hash, hash, 'a link that fits the screen is not rewritten');
  }
});

test('[fujifilm] on a phone the hash lists the two items shown, and widens back', () => {
  const { data } = loadBrand('fujifilm');
  const ids = nonDefaultIds(data, 'cameras');
  const { window } = loadBrand('fujifilm', { engine: true, width: 375, hash: `#cameras=${ids.join(',')}` });
  assert.equal(visibleCount(window), 2);
  assert.equal(window.location.hash, `#cameras=${ids.slice(0, 2).join(',')}`);
  Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true, writable: true });
  window.dispatchEvent(new window.Event('resize'));
  assert.equal(visibleCount(window), 3);
  assert.equal(window.location.hash, `#cameras=${ids.join(',')}`);
});

test('[fujifilm] a clean visit on a phone keeps a clean URL, even across a resize', () => {
  const { window } = loadBrand('fujifilm', { engine: true, width: 375 });
  Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true, writable: true });
  window.dispatchEvent(new window.Event('resize'));
  assert.equal(window.location.hash, '');
});
