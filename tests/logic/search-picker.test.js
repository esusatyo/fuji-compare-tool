// Tier 2 — the type-to-search picker: how names are matched and ranked, and
// how the popover behaves under mouse and keyboard. Runs against real pages
// and real data, so a renamed camera that breaks an expectation here is a
// real change in what a visitor's query finds.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');
const {
  setSlot, slotPicker, slotValue, openPicker, closePicker,
  typeInPicker, pressInPicker, listedOptions, listedGroups,
} = require('../helpers/dom');

// One compare-page window for the pure search tests: nothing here mutates it.
const compare = loadCompare().window;
const cameras = compare.pickerEntries();
// Array.from: results come from jsdom's realm, and deepEqual compares prototypes.
const find = q => Array.from(compare.searchItems(cameras, q), e => e.label);

// ── matching ────────────────────────────────────────────────────────
test('search ignores punctuation and case', () => {
  for (const q of ['xt5', 'x-t5', 'X T5', 'XT-5']) {
    assert.equal(find(q)[0], 'Fujifilm X-T5', `"${q}" should find the X-T5 first`);
  }
  assert.deepEqual(find('om1').slice(0, 2), ['Olympus OM-1', 'Olympus OM-1 Mark II']);
});

test('an exact name outranks a longer name that merely starts with it', () => {
  assert.deepEqual(find('xt5'), ['Fujifilm X-T5', 'Fujifilm X-T50']);
  assert.deepEqual(find('x100v'), ['Fujifilm X100V', 'Fujifilm X100VI']);
  assert.deepEqual(find('x100vi'), ['Fujifilm X100VI']);
});

test('roman and arabic generation numbers are the same camera', () => {
  for (const q of ['a7 iv', 'a7 4', 'a7iv', 'A7 IV', 'sony a7 4']) {
    assert.equal(find(q)[0], 'Sony A7 IV', `"${q}" should find the A7 IV first`);
  }
  assert.deepEqual(find('z6iii'), ['Nikon Z6 III']);
  assert.deepEqual(find('sony a7r5'), ['Sony A7R V']);
});

test('"Mark" is optional', () => {
  assert.deepEqual(find('r6 2'), ['Canon EOS R6 Mark II']);
  assert.equal(find('r6 mark ii')[0], 'Canon EOS R6 Mark II');
  assert.equal(find('om-1 ii')[0], 'Olympus OM-1 Mark II');
});

test('a brand word — even a prefix — narrows without needing to be in the model name', () => {
  assert.deepEqual(find('fuji xt5'), ['Fujifilm X-T5', 'Fujifilm X-T50']);
  const nikon = find('nikon');
  assert.equal(nikon.length, Object.keys(compare.BRAND_DATA.nikon.CAMERAS).length);
  assert.ok(nikon.every(l => l.startsWith('Nikon ')));
  // …and a brand that doesn't own the model finds nothing.
  assert.deepEqual(find('canon xt5'), []);
});

test('ties go to current models, then newer ones', () => {
  const r5 = compare.searchItems(cameras, 'canon r5');
  // Whole-word matches (the R5 family) come before the R50s that only start with it.
  const firstR50 = r5.findIndex(e => /R50/.test(e.name));
  assert.ok(firstR50 > 0 && r5.slice(0, firstR50).every(e => /\bR5\b/.test(e.name)),
    `R5 bodies should lead: ${r5.map(e => e.name).join(', ')}`);
  for (const [a, b] of [[0, 1], [1, 2]]) {
    if (b >= firstR50) break;
    assert.ok(r5[a].discontinued <= r5[b].discontinued, 'current before discontinued');
    if (r5[a].discontinued === r5[b].discontinued) assert.ok(r5[a].year >= r5[b].year, 'newer first');
  }
});

test('nothing typed returns everything, in list order; nonsense returns nothing', () => {
  assert.equal(find('').length, cameras.length);
  assert.equal(find('   ').length, cameras.length);
  assert.deepEqual(find(''), Array.from(cameras, e => e.label));
  assert.deepEqual(find('zzzz'), []);
});

test('every camera is findable by its own full name, as the top result', () => {
  for (const e of cameras) {
    const top = compare.searchItems(cameras, e.label)[0];
    assert.ok(top, `"${e.label}" finds nothing`);
    // Two brands can share a model name's wording; the name itself must match.
    assert.equal(top.name, e.name, `"${e.label}" should come first, got "${top.label}"`);
  }
});

test('[fujifilm] lens shorthand: focal length and aperture without the units', () => {
  const win = loadBrand('fujifilm', { engine: true, hash: '#lenses' }).window;
  const lenses = win.pickerEntries();
  const names = q => Array.from(win.searchItems(lenses, q), e => e.name);
  assert.ok(names('56 1.2').length >= 3 && names('56 1.2').every(n => /56mm f\/1\.2/.test(n)));
  assert.deepEqual(names('56mm f1.4'), names('56 1.4'));
  assert.equal(names('xf 23 f2')[0], 'XF 23mm f/2 R WR');
  assert.deepEqual(names('18-55'), ['XF 18-55mm f/2.8-4 R LM OIS']);
  // The maker is the "brand" for a lens: it narrows, and nothing else leaks in.
  assert.deepEqual(names('sigma 56'), ['Sigma 56mm f/1.4 DC DN']);
});

// ── the popover ─────────────────────────────────────────────────────
test('a slot shows its item on a button; the list exists only while open', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const doc = window.document;
  const btn = slotPicker(window, 0);
  assert.equal(btn.tagName, 'BUTTON');
  assert.equal(doc.querySelector('select.slot-select'), null, 'the old <select> is gone');
  const cam = window.BRAND_DATA.fujifilm.CAMERAS[slotValue(window, 0)];
  assert.equal(btn.textContent.trim(), `${cam.name} (${cam.year})`);
  assert.equal(btn.getAttribute('aria-expanded'), 'false');
  assert.equal(doc.getElementById('picker-pop'), null, 'no popover until a slot is opened');

  const pop = openPicker(window, 0);
  assert.equal(pop.hidden, false);
  assert.equal(slotPicker(window, 0).getAttribute('aria-expanded'), 'true');
  assert.equal(doc.activeElement, doc.getElementById('picker-input'), 'typing can start at once');
  assert.equal(doc.querySelectorAll('.picker-pop').length, 1);

  closePicker(window);
  assert.equal(pop.hidden, true);
  assert.equal(slotPicker(window, 0).getAttribute('aria-expanded'), 'false');
  assert.equal(doc.activeElement, slotPicker(window, 0), 'Escape hands focus back to the slot');
});

test('with nothing typed the list is the whole catalogue under its group headings', () => {
  const { window, data } = loadBrand('fujifilm', { engine: true });
  openPicker(window, 0);
  assert.deepEqual(listedOptions(window).map(o => o.value), data.DROPDOWN_GROUPS.flatMap(g => g.ids));
  // Headings drop the "── … ──" rules the <optgroup> labels carried.
  assert.deepEqual(listedGroups(window), data.DROPDOWN_GROUPS.map(g => g.label.replace(/^[─\s]+|[─\s]+$/g, '')));
  assert.ok(listedGroups(window).every(g => !g.includes('─')));
  // The slot's own item is marked, and is where the keyboard starts.
  const mine = listedOptions(window).filter(o => o.selected);
  assert.deepEqual(mine.map(o => o.value), [slotValue(window, 0)]);
  assert.ok(mine[0].active);
});

test('typing filters the list, drops the headings, and Enter takes the top match', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  openPicker(window, 2);
  typeInPicker(window, 'gfx100 ii');
  const shown = listedOptions(window);
  assert.equal(shown[0].value, 'gfx100-ii');
  assert.ok(shown[0].active, 'the best match is highlighted');
  assert.deepEqual(listedGroups(window), []);
  assert.equal(window.document.getElementById('picker-input').getAttribute('aria-activedescendant'), shown[0].el.id);

  pressInPicker(window, 'Enter');
  assert.equal(slotValue(window, 2), 'gfx100-ii');
  assert.equal(window.document.getElementById('picker-pop').hidden, true);
  assert.equal(window.document.activeElement, slotPicker(window, 2), 'focus returns to the slot that changed');
  assert.match(window.location.hash, /gfx100-ii/);
});

test('arrow keys move the highlight, wrap, and skip items other slots hold', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const taken = slotValue(window, 1);
  openPicker(window, 0);
  typeInPicker(window, 'x-t');
  const opts = () => listedOptions(window);
  const active = () => opts().findIndex(o => o.active);
  assert.ok(opts().length > 3);
  const start = active();
  pressInPicker(window, 'ArrowDown');
  assert.notEqual(active(), start);
  pressInPicker(window, 'ArrowUp');
  assert.equal(active(), start);
  // All the way round: never rests on a disabled option, and comes back.
  const seen = new Set();
  const laps = opts().filter(o => !o.disabled).length;
  assert.ok(laps < opts().length, 'fixture: the query must list an item another slot holds');
  for (let i = 0; i < laps; i++) {
    pressInPicker(window, 'ArrowDown');
    const o = opts()[active()];
    assert.ok(!o.disabled, `${o.value} is held by another slot and must be skipped`);
    seen.add(o.value);
  }
  assert.equal(active(), start, 'a full lap returns to the start');
  assert.ok(!seen.has(taken));
  closePicker(window);
});

test('an item another visible slot holds is listed as added and cannot be picked', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const before = slotValue(window, 0);
  const taken = slotValue(window, 1);
  openPicker(window, 0);
  const opt = listedOptions(window).find(o => o.value === taken);
  assert.ok(opt.disabled);
  assert.equal(opt.el.querySelector('.picker-option-meta').textContent, 'Added');
  opt.el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(slotValue(window, 0), before, 'clicking it changes nothing');
  assert.equal(window.document.getElementById('picker-pop').hidden, false, '…and leaves the picker open');
  closePicker(window);
});

test('picking the slot\'s own item just closes; no event, no URL change', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const calls = [];
  window.trackEvent = p => calls.push(p);
  const mine = slotValue(window, 0);
  openPicker(window, 0);
  listedOptions(window).find(o => o.value === mine).el
    .dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(window.document.getElementById('picker-pop').hidden, true);
  assert.deepEqual(calls, []);
  assert.equal(window.location.hash, '');
});

test('a query with no match says so, and Enter does nothing', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const before = slotValue(window, 0);
  openPicker(window, 0);
  typeInPicker(window, '<b>zzz</b>');
  assert.deepEqual(listedOptions(window), []);
  const none = window.document.querySelector('#picker-list .picker-none');
  assert.equal(none.textContent, 'No cameras match “<b>zzz</b>”.');
  assert.equal(none.querySelector('b'), null, 'the typed text is shown, never parsed as HTML');
  pressInPicker(window, 'Enter');
  assert.equal(slotValue(window, 0), before);
  closePicker(window);
});

test('a press outside closes the picker; a press inside does not', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const doc = window.document;
  const press = el => el.dispatchEvent(new window.Event('pointerdown', { bubbles: true }));
  const pop = openPicker(window, 0);
  press(doc.getElementById('picker-list'));
  assert.equal(pop.hidden, false);
  press(doc.getElementById('compare-table'));
  assert.equal(pop.hidden, true);
});

test('pressing a slot\'s button again closes its picker; another slot\'s button moves it', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const pop = openPicker(window, 0);
  slotPicker(window, 1).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(pop.hidden, false);
  assert.equal(slotPicker(window, 0).getAttribute('aria-expanded'), 'false');
  assert.equal(slotPicker(window, 1).getAttribute('aria-expanded'), 'true');
  slotPicker(window, 1).dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(pop.hidden, true);
});

test('the picker follows the mode and the mount filter', () => {
  const { window, data } = loadBrand('panasonic', { engine: true, hash: '#lenses' });
  const doc = window.document;
  openPicker(window, 0);
  assert.equal(doc.getElementById('picker-input').placeholder, 'Search lenses…');
  typeInPicker(window, 'zzzz');
  assert.match(doc.querySelector('.picker-none').textContent, /^No lenses match/);
  closePicker(window);

  doc.querySelector('.mount-chip[data-mount="mft"]').click();
  openPicker(window, 0);
  typeInPicker(window, 'sigma');
  const shown = listedOptions(window);
  assert.ok(shown.length > 0);
  assert.ok(shown.every(o => data.LENSES[o.value].mount === 'mft'), 'search never reaches past the active mount');
  closePicker(window);
});

test('[compare] search spans every brand and the button names the brand', () => {
  const { window } = loadCompare();
  openPicker(window, 0);
  typeInPicker(window, 'z6iii');
  assert.deepEqual(listedOptions(window).map(o => [o.value, o.text]), [['nikon:z6-iii', 'Nikon Z6 III']]);
  pressInPicker(window, 'Enter');
  assert.equal(slotValue(window, 0), 'nikon:z6-iii');
  assert.equal(slotPicker(window, 0).textContent.trim(), 'Nikon Z6 III (2024)');
});

test('analytics: a pick reports whether it was typed or browsed to — never the text', () => {
  const { window } = loadCompare();
  const calls = [];
  window.trackEvent = p => calls.push(p);
  openPicker(window, 0);
  typeInPicker(window, 'secret query gh7');
  typeInPicker(window, 'gh7');
  pressInPicker(window, 'Enter');
  setSlot(window, 1, 'sony:a6700'); // helper clicks the option with nothing typed
  assert.deepEqual(calls, [
    'camera-swap:panasonic:gh7', 'picker-pick:compare:search',
    'camera-swap:sony:a6700', 'picker-pick:compare:browse',
  ]);
  assert.ok(calls.every(c => !/secret|query/.test(c)));
});
