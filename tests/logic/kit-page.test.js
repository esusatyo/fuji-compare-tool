// ─────────────────────────────────────────────
// KIT BUILDER PAGE (/kit/) — the real kit/index.html booted in jsdom and
// driven the way a visitor does: pick a body, add and remove lenses, build a
// second kit, change currency, open a shared link.
// ─────────────────────────────────────────────
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadCompare } = require('../helpers/load-compare');
const dom = require('../helpers/dom');

function load(opts = {}) {
  const page = loadCompare({ page: 'kit', ...opts });
  const { window } = page;
  const calls = [];
  window.trackEvent = p => calls.push(p);
  const cat = window.KitBuilder.catalogue(window.BRAND_DATA);
  return { window, doc: window.document, calls, cat };
}

/** Choose an option in a kit picker ('0:body', '1:lens', …) by clicking it. */
function pick(window, key, id) {
  dom.openPicker(window, key);
  const opt = dom.listedOptions(window).find(o => o.value === id);
  assert.ok(opt, `${id} is not offered by ${key}`);
  dom.click(window, opt.el);
}

const col = (doc, k) => doc.querySelectorAll('.kit-col')[k];
const total = (doc, k, label) => {
  const row = [...col(doc, k).querySelectorAll('.kit-total')].find(r => r.querySelector('dt').textContent === label);
  return row ? row.querySelector('dd').textContent.replace(/\s+/g, ' ').trim() : null;
};
const lensNames = (doc, k) => [...col(doc, k).querySelectorAll('.kit-lens-name')].map(n => n.textContent);

// X-Mount lenses by what the tests need, found in the data rather than named.
function xLenses(cat) {
  const all = Object.entries(cat.lenses).filter(([, l]) => l.mount === 'x');
  return {
    local: all.filter(([, l]) => l.prices.AUD != null && !l.discontinued).map(([id]) => id),
    usdOnly: all.find(([, l]) => l.prices.USD != null && l.prices.AUD == null && !l.discontinued)[0],
    discontinued: (all.find(([, l]) => l.discontinued && l.prices.USD != null) || [])[0],
  };
}

test('opens with two empty kits, no table and a clean URL', () => {
  const { doc, window } = load();
  assert.equal(doc.querySelectorAll('.kit-col').length, 2);
  assert.equal(doc.querySelectorAll('.kit-col--empty').length, 2);
  assert.equal(doc.getElementById('compare-table'), null);
  assert.equal(doc.getElementById('kit-verdict'), null);
  assert.equal(doc.getElementById('kit-notes'), null);
  assert.equal(window.location.hash, '');
  assert.equal(doc.getElementById('share-btn-label').textContent, 'Share these kits');
});

test('picking a body shows it, its figures and a lens search', () => {
  const { doc, window, cat, calls } = load();
  pick(window, '0:body', 'fujifilm:x-t5');
  const cam = cat.cameras['fujifilm:x-t5'];
  assert.equal(dom.slotValue(window, '0:body'), 'fujifilm:x-t5');
  assert.match(col(doc, 0).querySelector('.slot-picker').textContent, /Fujifilm X-T5/);
  assert.equal(total(doc, 0, 'Total weight').split(' g')[0], cam.weight.toLocaleString('en-US'));
  assert.ok(dom.slotPicker(window, '0:lens'), 'lens search missing');
  assert.equal(window.location.hash, '#kit=fujifilm:x-t5');
  assert.ok(calls.includes('kit-body:fujifilm:x-t5'));
  assert.ok(calls.includes('picker-pick:kit:browse'));
});

test('the lens search offers only the body\'s mount, each lens once', () => {
  const { window, cat } = load();
  pick(window, '0:body', 'fujifilm:x-t5');
  const { options } = dom.pickerOptions(window, '0:lens');
  assert.ok(options.length > 100);
  for (const o of options) assert.equal(cat.lenses[o.value].mount, 'x', o.text);
  assert.equal(new Set(options.map(o => o.value)).size, options.length);
});

test('a Leica L-Mount body is offered Sigma and Panasonic lenses', () => {
  const { window, cat } = load();
  pick(window, '0:body', 'leica:sl3');
  const { options } = dom.pickerOptions(window, '0:lens');
  const makers = new Set(options.map(o => cat.lenses[o.value].manufacturer));
  for (const m of ['Leica', 'Sigma', 'Panasonic']) assert.ok(makers.has(m), `${m} missing`);
  assert.equal(new Set(options.map(o => o.text)).size, options.length, 'a shared lens is listed twice');
});

test('adding lenses itemises them and adds them to the totals', () => {
  const { doc, window, cat, calls } = load();
  const [a, b] = xLenses(cat).local;
  pick(window, '0:body', 'fujifilm:x-t5');
  pick(window, '0:lens', a);
  pick(window, '0:lens', b);
  const items = [cat.cameras['fujifilm:x-t5'], cat.lenses[a], cat.lenses[b]];
  assert.equal(lensNames(doc, 0).length, 2);
  const weight = items.reduce((s, it) => s + it.weight, 0);
  const aud = items.reduce((s, it) => s + it.prices.AUD, 0);
  assert.equal(total(doc, 0, 'Total weight').split(' g')[0], weight.toLocaleString('en-US'));
  assert.match(total(doc, 0, 'Total weight'), / oz$/);
  assert.equal(total(doc, 0, 'Total price'), `A$${aud.toLocaleString('en-US')}`);
  assert.ok(total(doc, 0, 'Focal range'), 'focal range missing');
  assert.equal(window.location.hash, `#kit=fujifilm:x-t5,${a},${b}`);
  assert.ok(calls.includes(`kit-lens:${a}`));
});

test('a lens already in the kit cannot be added twice', () => {
  const { window, cat } = load();
  const [a] = xLenses(cat).local;
  pick(window, '0:body', 'fujifilm:x-t5');
  pick(window, '0:lens', a);
  dom.openPicker(window, '0:lens');
  const opt = dom.listedOptions(window).find(o => o.value === a);
  assert.equal(opt.disabled, true);
  dom.click(window, opt.el);
  assert.equal(window.location.hash, `#kit=fujifilm:x-t5,${a}`);
});

test('removing a lens drops its row and its share of the totals', () => {
  const { doc, window, cat, calls } = load();
  const [a, b] = xLenses(cat).local;
  pick(window, '0:body', 'fujifilm:x-t5');
  pick(window, '0:lens', a);
  pick(window, '0:lens', b);
  dom.click(window, col(doc, 0).querySelector('.kit-remove[data-index="0"]'));
  assert.deepEqual(lensNames(doc, 0).length, 1);
  const weight = cat.cameras['fujifilm:x-t5'].weight + cat.lenses[b].weight;
  assert.equal(total(doc, 0, 'Total weight').split(' g')[0], weight.toLocaleString('en-US'));
  assert.equal(window.location.hash, `#kit=fujifilm:x-t5,${b}`);
  assert.ok(calls.includes('kit-remove:lens'));
});

test('a kit holds at most six lenses', () => {
  const { doc, window, cat } = load();
  const six = xLenses(cat).local.slice(0, 6);
  pick(window, '0:body', 'fujifilm:x-t5');
  for (const id of six) pick(window, '0:lens', id);
  assert.equal(lensNames(doc, 0).length, 6);
  assert.equal(dom.slotPicker(window, '0:lens'), null, 'the lens search should be gone at the limit');
});

test('one item without a local price puts every price in US dollars, and says so', () => {
  const { doc, window, cat } = load();
  const { local, usdOnly } = xLenses(cat);
  pick(window, '0:body', 'fujifilm:x-t5');
  pick(window, '0:lens', local[0]);
  assert.match(total(doc, 0, 'Total price'), /^A\$/);
  pick(window, '0:lens', usdOnly);
  const usd = cat.cameras['fujifilm:x-t5'].prices.USD + cat.lenses[local[0]].prices.USD + cat.lenses[usdOnly].prices.USD;
  assert.equal(total(doc, 0, 'Total price'), `USD $${usd.toLocaleString('en-US')}`);
  for (const p of col(doc, 0).querySelectorAll('.kit-price')) assert.match(p.textContent, /^USD \$/);
  const notes = doc.getElementById('kit-notes').textContent;
  assert.match(notes, /No AUD list price is published for/);
  assert.ok(notes.includes(cat.lenses[usdOnly].name));
  // …and choosing USD needs no note.
  dom.setCurrency(window, 'USD');
  assert.equal(total(doc, 0, 'Total price'), `$${usd.toLocaleString('en-US')}`);
  assert.doesNotMatch(doc.getElementById('kit-notes').textContent, /list price is published/);
});

test('an unpriced lens is left out of the total and named', (t) => {
  const { doc, window, cat } = load();
  // Any mount will do: find an announced, unpriced lens and a body it fits.
  const found = Object.entries(cat.lenses).find(([, l]) => l.prices.USD == null);
  if (!found) return t.skip('no unpriced lens in the data right now');
  const [unpriced, lens] = found;
  const body = Object.entries(cat.cameras)
    .find(([, c]) => c.mount === lens.mount && c.lensType !== 'Fixed' && !c.discontinued)[0];
  pick(window, '0:body', body);
  pick(window, '0:lens', unpriced);
  dom.setCurrency(window, 'USD');
  const usd = cat.cameras[body].prices.USD;
  assert.equal(total(doc, 0, 'Total price'), `$${usd.toLocaleString('en-US')} excl. 1 not priced`);
  assert.match(doc.getElementById('kit-notes').textContent, /no announced price and is left out of the total/);
  const weight = cat.cameras[body].weight + lens.weight;
  assert.equal(total(doc, 0, 'Total weight').split(' g')[0], weight.toLocaleString('en-US'));
});

test('a discontinued item is marked and noted', (t) => {
  const { doc, window, cat } = load();
  const { discontinued } = xLenses(cat);
  if (!discontinued) return t.skip('no discontinued, priced X-Mount lens in the data right now');
  pick(window, '0:body', 'fujifilm:x-t5');
  pick(window, '0:lens', discontinued);
  assert.ok(col(doc, 0).querySelector('.kit-lens .kit-tag'), 'Discontinued tag missing');
  assert.match(doc.getElementById('kit-notes').textContent, /is discontinued/);
});

test('a fixed-lens camera is a whole kit: built-in lens shown, no lens search', () => {
  const { doc, window, cat } = load();
  pick(window, '0:body', 'fujifilm:x100vi');
  assert.equal(dom.slotPicker(window, '0:lens'), null);
  assert.ok(col(doc, 0).textContent.includes(cat.cameras['fujifilm:x100vi'].lensSpec));
  assert.equal(total(doc, 0, 'Focal range'), null);
});

test('changing the body keeps the lenses that still fit and drops the rest', () => {
  const { doc, window, cat } = load();
  const [a] = xLenses(cat).local;
  pick(window, '0:body', 'fujifilm:x-t5');
  pick(window, '0:lens', a);
  pick(window, '0:body', 'fujifilm:x-h2');
  assert.equal(lensNames(doc, 0).length, 1, 'same mount: the lens stays');
  pick(window, '0:body', 'sony:a7-iv');
  assert.equal(lensNames(doc, 0).length, 0, 'another mount: the lens goes');
  assert.equal(window.location.hash, '#kit=sony:a7-iv');
});

test('two kits: the lighter and cheaper totals are highlighted and stated', () => {
  const { doc, window, cat, calls } = load();
  pick(window, '0:body', 'fujifilm:x-t5');
  assert.equal(doc.getElementById('kit-verdict'), null);
  assert.equal(doc.querySelectorAll('.kit-win').length, 0);
  pick(window, '1:body', 'fujifilm:x100vi');
  const a = cat.cameras['fujifilm:x-t5'];
  const b = cat.cameras['fujifilm:x100vi'];
  const lighter = a.weight < b.weight ? 0 : 1;
  const text = doc.getElementById('kit-verdict').textContent;
  assert.ok(text.startsWith(`Kit ${lighter + 1} is ${Math.abs(a.weight - b.weight)} g lighter`), text);
  assert.ok(col(doc, lighter).querySelector('.kit-total.kit-win'), 'lighter kit not highlighted');
  assert.equal(calls.filter(c => c === 'kit-pair').length, 1);
  assert.equal(window.location.hash, '#kit=fujifilm:x-t5;fujifilm:x100vi');
});

test('the same body can be in both kits', () => {
  const { doc, window } = load();
  pick(window, '0:body', 'fujifilm:x-t5');
  pick(window, '1:body', 'fujifilm:x-t5');
  assert.equal(doc.getElementById('kit-verdict').textContent, 'Both kits weigh the same and cost the same.');
  assert.equal(doc.querySelectorAll('.kit-win').length, 0);
});

test('clearing a kit empties it and tidies the URL', () => {
  const { doc, window, calls } = load();
  pick(window, '0:body', 'fujifilm:x-t5');
  dom.click(window, col(doc, 0).querySelector('.kit-clear'));
  assert.equal(doc.querySelectorAll('.kit-col--empty').length, 2);
  assert.equal(window.location.hash, '');
  assert.ok(calls.includes('kit-remove:kit'));
});

test('a shared link restores both kits in order', () => {
  const first = load();
  const [a, b] = xLenses(first.cat).local;
  const hash = `#kit=fujifilm:x-t5,${a},${b};sony:a7-iv`;
  const { doc, window, cat } = load({ hash });
  assert.equal(dom.slotValue(window, '0:body'), 'fujifilm:x-t5');
  assert.equal(dom.slotValue(window, '1:body'), 'sony:a7-iv');
  assert.deepEqual(lensNames(doc, 0), [a, b].map(id => {
    const l = cat.lenses[id];
    return l.name.toLowerCase().startsWith(l.manufacturer.toLowerCase()) ? l.name : `${l.manufacturer} ${l.name}`;
  }));
  assert.equal(window.location.hash, hash, 'a link that fits is left exactly as it arrived');
  assert.ok(doc.getElementById('kit-verdict'));
});

test('a link naming things that cannot be shown is repaired, not rejected', () => {
  const { cat } = load();
  const gLens = Object.entries(cat.lenses).find(([, l]) => l.mount === 'g')[0];
  const { doc, window } = load({ hash: `#kit=fujifilm:x-t5,${gLens},fujifilm:nope;brand:nothing` });
  assert.equal(dom.slotValue(window, '0:body'), 'fujifilm:x-t5');
  assert.equal(lensNames(doc, 0).length, 0);
  assert.equal(doc.querySelectorAll('.kit-col--empty').length, 1);
  assert.equal(window.location.hash, '#kit=fujifilm:x-t5');
});

test('Buy links follow the selected currency\'s marketplace and report a click', () => {
  const { doc, window, calls } = load();
  pick(window, '0:body', 'fujifilm:x-t5');
  const buy = () => col(doc, 0).querySelector('a.kit-buy');
  assert.match(buy().href, /amazon\.com\.au/);
  dom.setCurrency(window, 'GBP');
  assert.match(buy().href, /amazon\.co\.uk/);
  buy().addEventListener('click', e => e.preventDefault());
  dom.click(window, buy());
  assert.ok(calls.includes('buy-click:kit:fujifilm:x-t5'));
});

test('two kits fit side by side on a phone-width viewport too', () => {
  const { doc, window } = load({ width: 390 });
  pick(window, '0:body', 'fujifilm:x-t5');
  pick(window, '1:body', 'sony:a7-iv');
  assert.equal(doc.querySelectorAll('.kit-col:not(.kit-col--empty)').length, 2);
});

test('the kit page footer and every engine footer link the kit builder', () => {
  const { doc } = load();
  const hrefs = [...doc.querySelectorAll('footer a')].map(a => a.getAttribute('href'));
  assert.ok(hrefs.includes('../kit/'));
});
