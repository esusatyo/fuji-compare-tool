// Tier 2 — the comparison tool embedded in the homepage: empty slots, the
// generated name index, brand data fetched on first use, and the table that
// appears with the first pick. Boots the real index.html (see load-home.js).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadHome } = require('../helpers/load-home');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const {
  setSlot, setCurrency, slotPicker, slotValue, openPicker, closePicker,
  typeInPicker, pressInPicker, listedOptions, listedGroups,
} = require('../helpers/dom');

const visibleSlots = doc => [...doc.querySelectorAll('.compare-slot')].filter(s => s.style.display !== 'none');
const rows = doc => [...doc.querySelectorAll('#compare-table .spec-row')];
const chip = (doc, n) => doc.querySelector(`.count-chip[data-count="${n}"]`);
const press = el => el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent('click', { bubbles: true }));
function record(window) {
  const calls = [];
  window.trackEvent = p => calls.push(p);
  return calls;
}

// ── the generated index ─────────────────────────────────────────────
test('the name index lists exactly the cameras in the brand files, in their order', () => {
  const { window } = loadHome();
  const index = JSON.parse(JSON.stringify(window.COMPARE_CONFIG.index));
  assert.deepEqual(index.map(b => b.slug).sort(), brandDirs());
  for (const b of index) {
    const { data } = loadBrand(b.slug);
    assert.equal(b.name, data.BRAND_CONFIG.name);
    assert.deepEqual(b.cameras, data.CAMERA_ORDER.map(id => {
      const c = data.CAMERAS[id];
      return [id, c.name, c.year, c.discontinued ? 1 : 0];
    }), `${b.slug}: index out of step with data.js — run node scripts/generate-seo.js`);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(window.COMPARE_CONFIG.dataScripts)).sort(),
    brandDirs().map(b => `./${b}/data.js`));
});

// ── before anything is picked ───────────────────────────────────────
test('opens with two empty slots, no table, a clean URL and nothing fetched', () => {
  const home = loadHome();
  const doc = home.window.document;
  assert.equal(visibleSlots(doc).length, 2);
  for (const i of [0, 1]) {
    assert.equal(slotValue(home.window, i), '');
    assert.equal(slotPicker(home.window, i).textContent.trim(), 'Search cameras…');
    assert.ok(slotPicker(home.window, i).classList.contains('slot-picker--empty'));
  }
  assert.equal(doc.getElementById('compare-table').innerHTML, '');
  assert.equal(doc.getElementById('embed-tools').hidden, true, 'no currency or share with nothing to price');
  assert.ok(doc.getElementById('compare-header').classList.contains('is-idle'));
  assert.equal(home.window.location.hash, '');
  assert.equal(home.pendingData().length, 0);
});

test('renders inside the page: one h1, one header, one footer, no second <main>', () => {
  const { window } = loadHome();
  const doc = window.document;
  for (const sel of ['h1', '#site-header', 'footer', 'main', '.theme-toggle']) {
    assert.equal(doc.querySelectorAll(sel).length, 1, `expected exactly one ${sel}`);
  }
  assert.equal(doc.getElementById('compare-table').tagName, 'DIV');
  assert.equal(doc.getElementById('brand-switcher'), null);
  assert.equal(doc.querySelector('.mode-toggle'), null, 'cameras only, like the compare page');
  assert.equal(doc.title, 'Compare Camera & Lens Specs, Size & Weight Side by Side', 'the static title is left alone');
});

test('the slot count is three visible buttons, defaulting to 2', () => {
  const { window } = loadHome();
  const doc = window.document;
  assert.deepEqual([...doc.querySelectorAll('.count-chip')].map(c => c.textContent), ['2', '3', '4']);
  assert.equal(doc.getElementById('slot-count-select'), null, 'the homepage has buttons, not the dropdown');
  assert.equal(chip(doc, 2).getAttribute('aria-pressed'), 'true');
  press(chip(doc, 4));
  assert.equal(visibleSlots(doc).length, 4);
  assert.equal(chip(doc, 4).getAttribute('aria-pressed'), 'true');
  assert.equal(chip(doc, 2).getAttribute('aria-pressed'), 'false');
  assert.ok([0, 1, 2, 3].every(i => slotValue(window, i) === ''), 'more slots, still empty — nothing is filled in');
  assert.equal(window.location.hash, '', 'an empty comparison has no link');
  press(chip(doc, 3));
  assert.equal(visibleSlots(doc).length, 3);
});

test('below the mobile breakpoint two slots show whatever was chosen', () => {
  const { window } = loadHome({ width: 390, hash: '#cameras=fujifilm:x-t5,sony:a7-iv,canon:eos-r5' });
  assert.equal(visibleSlots(window.document).length, 2);
  assert.equal(window.location.hash, '#cameras=fujifilm:x-t5,sony:a7-iv', 'the link names what is on screen');
});

// ── searching before the data exists ────────────────────────────────
test('the picker searches the index straight away, and opening it starts the fetch', () => {
  const home = loadHome();
  const { window } = home;
  openPicker(window, 0);
  assert.ok(listedOptions(window).length > 200, 'every camera of every brand');
  assert.deepEqual(listedGroups(window), ['Fujifilm', 'Canon', 'Sony', 'Nikon', 'Panasonic', 'Sigma', 'Olympus', 'Leica']);
  assert.equal(home.pendingData().length, brandDirs().length, 'one request per brand file');
  typeInPicker(window, 'a7 4');
  assert.equal(listedOptions(window)[0].text, 'Sony A7 IV');
  closePicker(window);
  openPicker(window, 1);
  assert.equal(home.pendingData().length, brandDirs().length, 'opening again does not fetch again');
});

test('the list is the same before and after the data arrives', () => {
  const home = loadHome();
  const { window } = home;
  openPicker(window, 0);
  const before = listedOptions(window).map(o => `${o.value}|${o.text}`);
  home.deliverData();
  assert.equal(window.document.getElementById('picker-pop').hidden, false, 'data arriving leaves an open picker open');
  assert.deepEqual(listedOptions(window).map(o => `${o.value}|${o.text}`), before);
});

// ── the first pick ──────────────────────────────────────────────────
test('picking before the data lands names the slot, says it is loading, then shows the table', () => {
  const home = loadHome();
  const { window } = home;
  const doc = window.document;
  openPicker(window, 0);
  typeInPicker(window, 'xt5');
  pressInPicker(window, 'Enter');

  assert.equal(slotValue(window, 0), 'fujifilm:x-t5');
  assert.equal(slotPicker(window, 0).textContent.trim(), 'Fujifilm X-T5 (2022)');
  assert.match(doc.getElementById('slot-0').textContent, /Loading specs…/);
  assert.equal(window.location.hash, '#cameras=fujifilm:x-t5');
  assert.equal(rows(doc).length, 0, 'no table without specs');
  assert.equal(doc.getElementById('embed-tools').hidden, false);

  home.deliverData();
  assert.ok(rows(doc).length > 20, 'the table appears');
  assert.doesNotMatch(doc.getElementById('slot-0').textContent, /Loading/);
  assert.ok(doc.querySelector('#slot-0 .slot-buy'), 'the slot is a full slot now: price and links');
  assert.equal(doc.getElementById('compare-header').classList.contains('is-idle'), false);
  assert.equal(slotValue(window, 1), '', 'the other slot is still empty');
});

test('one camera is a spec sheet: its values, a blank column, and no winners', () => {
  const home = loadHome();
  const { window } = home;
  const doc = window.document;
  setSlot(window, 0, 'fujifilm:x-t5');
  home.deliverData();
  for (const row of rows(doc)) {
    const cells = row.querySelectorAll('.spec-value');
    assert.equal(cells.length, 2);
    assert.ok(cells[1].classList.contains('spec-value--empty'));
    assert.equal(cells[1].textContent, '', 'an empty slot is blank, not a dash');
  }
  assert.equal(doc.querySelectorAll('.winner').length, 0);
  const weight = rows(doc).find(r => r.querySelector('.spec-label').textContent === 'Weight');
  assert.equal(weight.querySelectorAll('.spec-value')[0].textContent, '557 g');
});

test('the second pick makes it a comparison: winners, both brands\' sections, a two-item link', () => {
  const home = loadHome();
  const { window } = home;
  const doc = window.document;
  setSlot(window, 0, 'fujifilm:x-t5');
  home.deliverData();
  setSlot(window, 1, 'canon:eos-r6-iii');
  assert.equal(window.location.hash, '#cameras=fujifilm:x-t5,canon:eos-r6-iii');
  assert.ok(doc.querySelectorAll('.winner').length > 0);
  const titles = [...doc.querySelectorAll('.section-title')].map(e => e.textContent);
  assert.ok(titles.includes('Film Simulations') && titles.includes('Dual Pixel AF'));
  assert.equal(doc.querySelectorAll('.spec-value--empty').length, 0);
  // Mount labels come from brand files that loaded after the engine did.
  const mount = rows(doc).find(r => r.querySelector('.spec-label').textContent === 'Lens Mount');
  assert.deepEqual([...mount.querySelectorAll('.spec-value')].map(c => c.textContent), ['X-Mount', 'RF-Mount']);
});

test('a camera in a later slot does not need the earlier ones filled', () => {
  const home = loadHome();
  const { window } = home;
  setSlot(window, 1, 'nikon:zf');
  home.deliverData();
  assert.equal(slotValue(window, 0), '');
  assert.equal(slotValue(window, 1), 'nikon:zf');
  const row = rows(window.document)[0].querySelectorAll('.spec-value');
  assert.ok(row[0].classList.contains('spec-value--empty') && !row[1].classList.contains('spec-value--empty'));
  assert.equal(window.location.hash, '#cameras=nikon:zf');
});

test('a picked camera cannot be picked again in another slot', () => {
  const home = loadHome();
  const { window } = home;
  setSlot(window, 0, 'fujifilm:x-t5');
  openPicker(window, 1);
  typeInPicker(window, 'xt5');
  const opt = listedOptions(window).find(o => o.value === 'fujifilm:x-t5');
  assert.ok(opt.disabled);
  // Enter takes the best match that *can* be taken.
  pressInPicker(window, 'Enter');
  assert.equal(slotValue(window, 1), 'fujifilm:x-t50');
});

test('currency and buy links work once a camera is in', () => {
  const home = loadHome();
  const { window } = home;
  setSlot(window, 0, 'fujifilm:x-t5');
  home.deliverData();
  setCurrency(window, 'USD');
  const slot = window.document.getElementById('slot-0');
  assert.match(slot.querySelector('.slot-price').textContent, /\$/);
  assert.match(slot.querySelector('.slot-buy').href, /^https:\/\/www\.amazon\.com\//);
});

// ── shared links ────────────────────────────────────────────────────
test('a shared link names its cameras at once and fills in when the data lands', () => {
  const home = loadHome({ hash: '#cameras=fujifilm:x-t5,sony:a7-iv,canon:eos-r6-iii' });
  const { window } = home;
  const doc = window.document;
  assert.equal(visibleSlots(doc).length, 3, 'three items in the link, three slots');
  assert.deepEqual([0, 1, 2].map(i => slotValue(window, i)), ['fujifilm:x-t5', 'sony:a7-iv', 'canon:eos-r6-iii']);
  assert.equal(slotPicker(window, 1).textContent.trim(), 'Sony A7 IV (2021)');
  assert.equal(home.pendingData().length, brandDirs().length, 'the fetch starts without a click');
  home.deliverData();
  assert.equal(rows(doc)[0].querySelectorAll('.spec-value').length, 3);
  assert.equal(window.location.hash, '#cameras=fujifilm:x-t5,sony:a7-iv,canon:eos-r6-iii', 'a link that fits is left as it arrived');
});

test('a link with one camera opens two slots; unknown and repeated ids are dropped', () => {
  const one = loadHome({ hash: '#cameras=nikon:zf' });
  assert.equal(visibleSlots(one.window.document).length, 2);
  assert.deepEqual([0, 1].map(i => slotValue(one.window, i)), ['nikon:zf', '']);

  const messy = loadHome({ hash: '#cameras=nope:x,nikon:zf,nikon:zf,x-t5,sony:a7-iv' });
  assert.deepEqual([0, 1].map(i => slotValue(messy.window, i)), ['nikon:zf', 'sony:a7-iv']);
  assert.equal(messy.window.location.hash, '#cameras=nikon:zf,sony:a7-iv');

  const junk = loadHome({ hash: '#cameras=nope:x' });
  assert.equal(slotValue(junk.window, 0), '');
  assert.equal(junk.pendingData().length, 0, 'nothing valid to load specs for');

  const lenses = loadHome({ hash: '#lenses' });
  assert.equal(slotValue(lenses.window, 0), '', 'the homepage has no lens mode');
});

// ── failure ─────────────────────────────────────────────────────────
test('a failed fetch says so in the slot and can be retried', () => {
  const home = loadHome();
  const { window } = home;
  const doc = window.document;
  setSlot(window, 0, 'fujifilm:x-t5');
  home.failData();
  assert.match(doc.getElementById('slot-0').textContent, /Couldn’t load the specs/);
  assert.equal(rows(doc).length, 0);
  assert.equal(slotValue(window, 0), 'fujifilm:x-t5', 'the pick is kept');

  press(doc.querySelector('#slot-0 .slot-retry'));
  assert.match(doc.getElementById('slot-0').textContent, /Loading specs…/);
  assert.equal(home.pendingData().length, brandDirs().length);
  home.deliverData();
  assert.ok(rows(doc).length > 20);
});

// ── analytics ───────────────────────────────────────────────────────
test('analytics: the first camera and the first pair are each reported once', () => {
  const home = loadHome();
  const { window } = home;
  const calls = record(window);
  openPicker(window, 0);
  typeInPicker(window, 'xt5');
  pressInPicker(window, 'Enter');
  home.deliverData();
  setSlot(window, 1, 'sony:a7-iv');
  setSlot(window, 0, 'nikon:zf');
  assert.deepEqual(calls, [
    'camera-swap:fujifilm:x-t5', 'picker-pick:home:search', 'quick-compare:first',
    'camera-swap:sony:a7-iv', 'picker-pick:home:browse', 'quick-compare:pair',
    'camera-swap:nikon:zf', 'picker-pick:home:browse',
  ]);
});

test('analytics: a blocked counter (no trackEvent) breaks nothing', () => {
  const home = loadHome();
  delete home.window.trackEvent;
  setSlot(home.window, 0, 'fujifilm:x-t5');
  home.deliverData();
  assert.ok(rows(home.window.document).length > 20);
});
