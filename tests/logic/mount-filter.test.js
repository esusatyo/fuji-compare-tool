// Tier 2 — The mount filter, rendered in jsdom.
//
// Brands spanning two mounts get a chip row above the pickers. What matters is
// that the table never contradicts the active chip: filtering swaps
// out-of-mount slots, the mode toggle re-runs that swap for the mode it lands
// in, and a mount too small to fill the table shrinks the table rather than
// leaving a stale slot behind.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');

const page = (brand, opts = {}) => loadBrand(brand, { engine: true, ...opts }).window;
const chip = (doc, mount) => doc.querySelector(`.mount-chip[data-mount="${mount}"]`);
const selected = doc => [...doc.querySelectorAll('.slot-select')].map(s => s.value).filter(Boolean);
const options = doc => [...doc.querySelectorAll('.slot-select')[0].options].map(o => o.value);

// ── 1. who gets a row ───────────────────────────────────────────────
for (const brand of ['fujifilm', 'panasonic', 'sigma']) {
  test(`[${brand}] multi-mount brand renders a chip row`, () => {
    const doc = page(brand).document;
    const row = doc.getElementById('mount-filter');
    assert.ok(row, 'expected a chip row');
    const labels = [...row.querySelectorAll('.mount-chip')].map(c => c.textContent);
    assert.equal(labels[0], 'All', 'first chip is the unfiltered state');
    assert.equal(labels.length, 3, `expected All + 2 mounts, got ${labels.join(', ')}`);
    assert.equal(row.getAttribute('role'), 'group');
  });
}

for (const brand of ['canon', 'nikon', 'sony']) {
  test(`[${brand}] single-mount brand renders no chip row at all`, () => {
    const doc = page(brand).document;
    assert.equal(doc.getElementById('mount-filter'), null, 'no chip row');
    assert.equal(doc.getElementById('mount-filter-slot'), null,
      'not even the wrapper — a single-mount brand\'s DOM is untouched');
  });
}

test('[compare] the cross-brand page renders no chip row', () => {
  const { window } = loadCompare();
  assert.equal(window.document.getElementById('mount-filter'), null);
});

// ── 2. filtering the pickers ────────────────────────────────────────
test('[panasonic] a chip restricts every slot dropdown to that mount', () => {
  const { LENSES } = loadBrand('panasonic').data;
  const doc = page('panasonic', { hash: '#lenses' }).document;
  const all = options(doc).length;

  chip(doc, 'mft').click();
  const shown = options(doc);
  assert.ok(shown.length < all, 'the filter should remove options');
  assert.ok(shown.every(id => LENSES[id].mount === 'mft'),
    'every offered lens should be Micro Four Thirds');
  for (const sel of doc.querySelectorAll('.slot-select')) {
    for (const grp of sel.querySelectorAll('optgroup')) {
      assert.ok(grp.querySelectorAll('option').length > 0, 'no empty optgroup should render');
    }
  }
});

test('[fujifilm] fixed-lens bodies stay with their lineup', () => {
  const doc = page('fujifilm').document;
  chip(doc, 'x').click();
  const x = options(doc);
  assert.ok(x.includes('x100vi'), 'X100VI belongs to the X lineup');
  assert.ok(x.includes('x-half'), 'X Half belongs to the X lineup');
  assert.ok(!x.some(id => id.startsWith('gfx')), 'no GFX body under X-Mount');

  chip(doc, 'g').click();
  assert.ok(options(doc).includes('gfx100rf'), 'the fixed-lens GFX100RF belongs to the G lineup');
});

// ── 3. the swap ─────────────────────────────────────────────────────
test('[panasonic] activating a mount swaps only the out-of-mount slots', () => {
  const { CAMERAS } = loadBrand('panasonic').data;
  const window = page('panasonic');
  const doc = window.document;
  const before = selected(doc);
  const keeper = before.find(id => CAMERAS[id].mount === 'mft');
  assert.ok(keeper, 'fixture assumes one default is already MFT');

  chip(doc, 'mft').click();
  const after = selected(doc);
  assert.ok(after.every(id => CAMERAS[id].mount === 'mft'), 'every slot is now MFT');
  assert.ok(after.includes(keeper), 'the already-MFT slot was left alone');
  assert.equal(new Set(after).size, after.length, 'no camera appears twice');
  assert.equal(window.location.hash, `#cameras=${after.join(',')}`,
    'the swapped selection is shareable');
});

test('[panasonic] All changes no selection, so a cross-mount comparison survives', () => {
  const doc = page('panasonic').document;
  const before = selected(doc);
  chip(doc, '').click();
  assert.deepEqual(selected(doc), before);
});

// ── 4. a mount with no items in this mode ───────────────────────────
test('[sigma] SA-Mount has bodies but no lenses, so only the camera tab has a row', () => {
  const cameras = page('sigma').document;
  assert.ok(chip(cameras, 'sa'), 'SA-Mount is offered for cameras');
  assert.ok(chip(cameras, 'l'), 'L-Mount is offered for cameras');

  const lenses = page('sigma', { hash: '#lenses' }).document;
  assert.equal(lenses.getElementById('mount-filter'), null,
    'one qualifying mount is no choice at all — the row is dropped');
});

// ── 5. the mode toggle ──────────────────────────────────────────────
test('[panasonic] the active mount survives the mode toggle, and the new mode is swapped too', () => {
  const { LENSES } = loadBrand('panasonic').data;
  const doc = page('panasonic').document;
  chip(doc, 'mft').click();
  doc.querySelector('.mode-btn[data-mode="lenses"]').click();

  assert.equal(doc.querySelector('.mount-chip.active').textContent, 'Micro Four Thirds');
  const after = selected(doc);
  assert.ok(after.every(id => LENSES[id].mount === 'mft'),
    'the lens defaults are L-Mount; landing there filtered must swap them');
  assert.equal(new Set(after).size, after.length,
    'without the swap the pickers fall back to their first option, showing one lens twice');
});

test('[sigma] a mount with no chip in the destination mode falls back to All', () => {
  const { LENSES } = loadBrand('sigma').data;
  const doc = page('sigma').document;
  chip(doc, 'sa').click();
  doc.querySelector('.mode-btn[data-mode="lenses"]').click();

  assert.equal(doc.getElementById('mount-filter'), null, 'no row on the lens tab');
  assert.equal(options(doc).length, Object.keys(LENSES).length, 'every lens is offered again');
});

// ── 6. single-slot rendering ────────────────────────────────────────
// No shipped mount holds a single item, so patch one that does: move sd Quattro
// to L-Mount, leaving SA-Mount with only the sd Quattro H.
const oneItemSA = src =>
  src.replace("name:'sd Quattro', series:'sd Quattro', mount:'sa',",
              "name:'sd Quattro', series:'sd Quattro', mount:'l',");

test('[sigma] a mount offering one item renders a single slot', () => {
  const doc = page('sigma', { patchData: oneItemSA }).document;
  chip(doc, 'sa').click();

  assert.equal(doc.documentElement.style.getPropertyValue('--num-slots'), '1');
  assert.equal(doc.querySelector('.spec-row').querySelectorAll('.spec-value').length, 1);
  assert.equal(doc.getElementById('slot-1').style.display, 'none');
  assert.equal(selected(doc).join(','), 'sd-quattro-h');
});

test('[sigma] one slot means no winners — a lone column wins every row trivially', () => {
  const doc = page('sigma', { patchData: oneItemSA }).document;
  chip(doc, 'sa').click();
  assert.equal(doc.querySelectorAll('.spec-value.winner').length, 0);
});

test('[sigma] the slot-count control drops out, then returns intact on All', () => {
  const doc = page('sigma', { patchData: oneItemSA }).document;
  chip(doc, 'sa').click();
  assert.equal(doc.getElementById('slot-count-select'), null,
    'offering counts the filter cannot fill would be a lie');

  chip(doc, '').click();
  assert.equal(doc.getElementById('slot-count-select').value, '3',
    "the user's own choice is restored, not reset");
  assert.equal(doc.documentElement.style.getPropertyValue('--num-slots'), '3');
});

test('[panasonic] the mobile 2-slot clamp still applies under a filter', () => {
  const doc = loadBrand('panasonic', { engine: true, width: 375 }).window.document;
  chip(doc, 'mft').click();
  assert.equal(doc.documentElement.style.getPropertyValue('--num-slots'), '2');
});
