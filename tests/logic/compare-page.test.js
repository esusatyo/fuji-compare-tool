// Tier 2 — Cross-brand compare page (compare/index.html + engine
// cross-brand mode): brand-grouped pickers with namespaced ids, 2–4
// adjustable slots with the mobile clamp, brand-tagged sections with
// "—" for foreign cameras, cross-brand winners, per-brand prices and
// buy links, and the compare-page hash grammar.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadCompare } = require('../helpers/load-compare');
const { setSlot, setCurrency, slotSelect } = require('../helpers/dom');

const DEFAULTS = ['fujifilm:x-t5', 'sony:a7-iv', 'canon:eos-r6-iii', 'nikon:z6-iii'];

function visibleSlots(window) {
  return [...window.document.querySelectorAll('.compare-slot')]
    .filter(el => el.style.display !== 'none');
}

function clickSlotCount(window, n) {
  const sel = window.document.getElementById('slot-count-select');
  sel.value = String(n);
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
}

function resizeTo(window, width) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true });
  window.dispatchEvent(new window.Event('resize'));
}

function sectionByTitle(window, title) {
  return [...window.document.querySelectorAll('.spec-section')]
    .find(s => s.querySelector('.section-title').textContent === title) || null;
}

function rowByLabel(window, label) {
  return [...window.document.querySelectorAll('.spec-row')]
    .find(r => r.querySelector('.spec-label').textContent === label) || null;
}

// ── Rendering ────────────────────────────────

test('default render: 3 visible slots, 4th hidden, defaults selected', () => {
  const { window } = loadCompare();
  assert.equal(visibleSlots(window).length, 3);
  assert.equal(window.document.querySelectorAll('.compare-slot').length, 4);
  assert.deepEqual([0, 1, 2].map(i => slotSelect(window, i).value), DEFAULTS.slice(0, 3));
});

test('cameras only: no mode toggle, slot-count dropdown instead', () => {
  const { window } = loadCompare();
  assert.equal(window.document.getElementById('mode-toggle'), null);
  const sel = window.document.getElementById('slot-count-select');
  const opts = [...sel.querySelectorAll('option')];
  assert.deepEqual(opts.map(o => o.value), ['2', '3', '4']);
  assert.equal(sel.value, '3', 'default choice 3 is selected');
  const label = window.document.querySelector(`label[for="slot-count-select"]`);
  assert.equal(label.textContent, 'Cameras to compare');
  assert.ok(
    window.document.querySelector('.compare-label-cell').contains(sel),
    'slot-count control lives inside the Compare label cell');
});

test('dropdowns group by brand and every option id is namespaced', () => {
  const { window } = loadCompare();
  const groups = [...slotSelect(window, 0).querySelectorAll('optgroup')];
  assert.deepEqual(groups.map(g => g.label), ['Fujifilm', 'Canon', 'Sony', 'Nikon', 'Panasonic']);
  const opts = [...slotSelect(window, 0).querySelectorAll('option')];
  assert.ok(opts.length > 100, 'all brands\' cameras offered');
  for (const o of opts) {
    const [brand] = o.value.split(':');
    assert.ok(window.BRAND_DATA[brand], `option ${o.value} is '<brand>:<slug>'-namespaced`);
  }
});

test('duplicate prevention works across brands', () => {
  const { window } = loadCompare();
  setSlot(window, 1, 'sony:a6700');
  const inSlot0 = [...slotSelect(window, 0).querySelectorAll('option')]
    .find(o => o.value === 'sony:a6700');
  assert.ok(inSlot0.disabled, 'camera selected in slot 1 is disabled in slot 0');
});

// ── Slot count & mobile clamp ────────────────

test('effectiveSlots is a pure clamp on the mobile breakpoint', () => {
  const { engine } = loadCompare();
  assert.equal(engine.effectiveSlots(3, 1024), 3);
  assert.equal(engine.effectiveSlots(4, 600), 4);
  assert.equal(engine.effectiveSlots(4, 599), 2);
  assert.equal(engine.effectiveSlots(2, 1400), 2);
});

test('choosing 4 slots renders 4 columns in header and table', () => {
  const { window } = loadCompare();
  clickSlotCount(window, 4);
  assert.equal(visibleSlots(window).length, 4);
  assert.equal(slotSelect(window, 3).value, DEFAULTS[3]);
  const row = rowByLabel(window, 'Resolution');
  assert.equal(row.querySelectorAll('.spec-value').length, 4);
});

test('mobile clamps to 2 and widening restores the choice', () => {
  const { window } = loadCompare({ width: 1200 });
  clickSlotCount(window, 4);
  assert.equal(visibleSlots(window).length, 4);
  resizeTo(window, 500);
  assert.equal(visibleSlots(window).length, 2, 'narrow viewport shows exactly 2');
  resizeTo(window, 1200);
  assert.equal(visibleSlots(window).length, 4, 'choice restored on widening');
});

test('viewport below breakpoint starts at 2 slots', () => {
  const { window } = loadCompare({ width: 500 });
  assert.equal(visibleSlots(window).length, 2);
});

// ── Brand-tagged sections ────────────────────

test('brand section appears/disappears with its last matching camera', () => {
  const { window } = loadCompare();
  assert.ok(sectionByTitle(window, 'Film Simulations'), 'Fujifilm camera selected → section shown');
  setSlot(window, 0, 'canon:eos-r5-ii');
  assert.equal(sectionByTitle(window, 'Film Simulations'), null,
    'last Fujifilm camera replaced → section gone');
  assert.ok(sectionByTitle(window, 'Dual Pixel AF'), 'Canon section still shown');
});

test('foreign cameras show "—" in brand-tagged rows', () => {
  const { window } = loadCompare();
  const row = rowByLabel(window, 'Film Simulation Modes');
  const cells = [...row.querySelectorAll('.spec-value')].map(c => c.textContent.trim());
  assert.match(cells[0], /modes$/, 'Fujifilm column has a real value');
  assert.equal(cells[1], '—', 'Sony column dashes out');
  assert.equal(cells[2], '—', 'Canon column dashes out');
});

test('one camera from each brand renders every brand section without throwing', () => {
  const { window } = loadCompare();
  clickSlotCount(window, 4);
  // 4 slots can hold 4 of the 5 brands; swap slot 0 through the fifth
  // (Panasonic) as well so every brand-tagged spec fn sees foreigners.
  setSlot(window, 3, 'panasonic:s5-ii');
  for (const title of ['Film Simulations', 'Color Science & AI AF', 'Dual Pixel AF', 'C-Log', 'Panasonic Video']) {
    assert.ok(sectionByTitle(window, title), `${title} section rendered`);
  }
  setSlot(window, 0, 'nikon:z8');
  assert.ok(sectionByTitle(window, 'Nikon Imaging'), 'Nikon section rendered');
  assert.equal(sectionByTitle(window, 'Film Simulations'), null, 'Fujifilm section gone with its camera');
});

test('brand-tagged winner ignores foreign cameras', () => {
  const { window } = loadCompare();
  // Film Simulation Modes is higherBetter; only the Fujifilm camera has
  // it, so its cell wins and no foreign dash cell is marked.
  const row = rowByLabel(window, 'Film Simulation Modes');
  const cells = [...row.querySelectorAll('.spec-value')];
  assert.ok(cells[0].classList.contains('winner'), 'sole real value wins');
  assert.ok(!cells[1].classList.contains('winner') && !cells[2].classList.contains('winner'));
});

// ── Winners, prices, buy links ───────────────

test('cross-brand winner highlighting on a universal numeric spec', () => {
  const { window } = loadCompare();
  // Defaults: X-T5 40.2 MP vs A7 IV 33 MP vs R6 III 32.5 MP.
  const cells = [...rowByLabel(window, 'Resolution').querySelectorAll('.spec-value')];
  assert.ok(cells[0].classList.contains('winner'));
  assert.ok(!cells[1].classList.contains('winner'));
});

test('discontinued and current cameras from different brands price independently', () => {
  const { window } = loadCompare();
  setCurrency(window, 'EUR');
  setSlot(window, 0, 'canon:eos-r6');       // discontinued, USD launch price only
  setSlot(window, 1, 'fujifilm:x-t5');      // current, full currency set
  const slot0 = window.document.getElementById('slot-0');
  const slot1 = window.document.getElementById('slot-1');
  assert.match(slot0.textContent, /Discontinued/, 'discontinued label shown');
  assert.match(slot0.textContent, /Launch: \$/, 'launch price tagged as USD');
  assert.match(slot1.querySelector('.slot-price').textContent, /€/, 'current camera shows local price');
  assert.doesNotMatch(slot1.querySelector('.slot-price').textContent, /\$/, 'no mismatched symbol');
});

test('ASIN-less camera buys via a search on its own brand name', () => {
  const { window } = loadCompare();
  setSlot(window, 1, 'canon:eos-r6'); // no asin in data
  const href = window.document.querySelector('#slot-1 .slot-buy').href;
  assert.match(href, /\/s\?k=Canon(%20|\+)/, 'search query starts with the owning brand');
  assert.doesNotMatch(href, /All(%20|\+)Brands/, 'synthetic page identity never leaks into links');
});

test('camera with an ASIN deep-links to the marketplace product page', () => {
  const { window } = loadCompare();
  const cam = window.BRAND_DATA.sony.CAMERAS['a7-iv'];
  assert.ok(cam.asin, 'test premise: a7-iv has an asin');
  const href = window.document.querySelector('#slot-1 .slot-buy').href;
  assert.equal(href, `https://www.amazon.com.au/dp/${cam.asin}`, 'AUD default → .com.au product page');
});

// ── Hash grammar ─────────────────────────────

test('selection change writes a namespaced hash without history entries', () => {
  const { window } = loadCompare();
  const before = window.history.length;
  setSlot(window, 0, 'nikon:zf');
  assert.equal(window.location.hash, `#cameras=nikon:zf,${DEFAULTS[1]},${DEFAULTS[2]}`);
  assert.equal(window.history.length, before);
});

test('slot-count change is reflected in the hash', () => {
  const { window } = loadCompare();
  clickSlotCount(window, 2);
  assert.equal(window.location.hash, `#cameras=${DEFAULTS[0]},${DEFAULTS[1]}`);
  clickSlotCount(window, 4);
  assert.equal(window.location.hash, `#cameras=${DEFAULTS.join(',')}`);
});

test('mobile clamp does not truncate the written hash', () => {
  const { window } = loadCompare({ width: 500, hash: `#cameras=${DEFAULTS.join(',')}` });
  assert.equal(visibleSlots(window).length, 2);
  setSlot(window, 0, 'panasonic:s5-ii');
  const written = window.location.hash.split('=')[1].split(',');
  assert.equal(written.length, 4, 'all four chosen ids written while only 2 visible');
});

test('deep link restores selection and slot count without rewriting the hash', () => {
  const hash = '#cameras=fujifilm:x100vi,sony:a6700';
  const { window } = loadCompare({ hash });
  assert.equal(visibleSlots(window).length, 2, 'two entries → two slots');
  assert.deepEqual([0, 1].map(i => slotSelect(window, i).value), ['fujifilm:x100vi', 'sony:a6700']);
  assert.equal(window.location.hash, hash, 'init never rewrites the hash');
});

test('four-camera deep link renders four slots', () => {
  const ids = ['canon:eos-r5-ii', 'nikon:z8', 'sony:a7r-v', 'panasonic:s1r-ii'];
  const { window } = loadCompare({ hash: `#cameras=${ids.join(',')}` });
  assert.equal(visibleSlots(window).length, 4);
  assert.deepEqual([0, 1, 2, 3].map(i => slotSelect(window, i).value), ids);
});

test('bad slug and bad brand prefix fall back per slot', () => {
  const { window } = loadCompare({ hash: '#cameras=kodak:dc290,sony:not-a-camera,canon:eos-r7' });
  assert.deepEqual([0, 1, 2].map(i => slotSelect(window, i).value),
    [DEFAULTS[0], DEFAULTS[1], 'canon:eos-r7']);
});

test('entry counts outside 2–4 are clamped', () => {
  const five = ['fujifilm:x-t5', 'sony:a7-iv', 'canon:eos-r6-iii', 'nikon:z6-iii', 'panasonic:s5-ii'];
  const many = loadCompare({ hash: `#cameras=${five.join(',')}` });
  assert.equal(visibleSlots(many.window).length, 4, '5 entries clamp to 4 slots');
  const one = loadCompare({ hash: '#cameras=sony:a6700' });
  assert.equal(visibleSlots(one.window).length, 2, '1 entry clamps to 2 slots');
  assert.equal(slotSelect(one.window, 1).value, DEFAULTS[1], 'second slot falls back to default');
});

test('clean visit leaves the URL clean', () => {
  const { window } = loadCompare();
  assert.equal(window.location.hash, '');
});

// ── Page identity ────────────────────────────

test('compare page never writes a brand preference', () => {
  const { window } = loadCompare();
  assert.equal(window.localStorage.getItem('brand'), null);
});

test('brand switcher shows All brands selected and lists every brand', () => {
  const { window } = loadCompare();
  const sel = window.document.getElementById('brand-switcher');
  assert.equal(sel.value, '__compare');
  const slugs = [...sel.options].map(o => o.value);
  for (const b of Object.keys(window.BRAND_DATA)) assert.ok(slugs.includes(b));
});

test('placeholder colors come from the owning brand series palette', () => {
  const { window, engine } = loadCompare();
  const fuji = engine.seriesColor('fujifilm:x-t5', 'X-T');
  assert.equal(fuji.bg, window.BRAND_DATA.fujifilm.SERIES_COLORS['X-T'].bg);
  const foreign = engine.seriesColor('sony:a7-iv', 'X-T');
  assert.notEqual(foreign.bg, fuji.bg, 'series names resolve within the owning brand only');
});
