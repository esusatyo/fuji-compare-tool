// Tier 2 — Price formatting and currency switching.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { setCurrency, setSlot, clickMode, slotSelect } = require('../helpers/dom');

for (const brand of brandDirs()) {
  test(`[${brand}] formatPrice formats per currency`, () => {
    const { window } = loadBrand(brand, { engine: true });
    assert.equal(window.formatPrice(1000, 'USD'), '$1,000');
    assert.equal(window.formatPrice(2499, 'AUD'), 'A$2,499');
    assert.equal(window.formatPrice(89900, 'JPY'), '¥89,900');
    assert.equal(window.formatPrice(0, 'USD'), null, 'falsy amount returns null');
    assert.equal(window.formatPrice(null, 'USD'), null);
  });

  test(`[${brand}] switching currency updates the rendered camera price`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    setCurrency(window, 'USD');
    const id = slotSelect(window, 0).value;
    const usd = data.CAMERAS[id].prices.USD;
    const priceText = window.document.querySelector('#slot-0 .slot-price').textContent;
    assert.ok(priceText.includes(usd.toLocaleString()),
      `slot price "${priceText}" should contain USD ${usd.toLocaleString()}`);
  });

  test(`[${brand}] lens price falls back to USD when currency missing`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    clickMode(window, 'lenses');

    // Find a lens that lacks a non-USD currency to exercise the `?? USD` path.
    const entry = Object.entries(data.LENSES).find(([, l]) => l.prices && l.prices.EUR == null);
    setCurrency(window, 'EUR');

    if (entry) {
      const [id, lens] = entry;
      setSlot(window, 0, id);
      const priceText = window.document.querySelector('#slot-0 .slot-price').textContent;
      assert.ok(priceText.includes(lens.prices.USD.toLocaleString()),
        `lens "${id}" should fall back to USD ${lens.prices.USD}`);
    } else {
      // Otherwise just confirm EUR price renders for the default lens.
      const id = slotSelect(window, 0).value;
      const lens = data.LENSES[id];
      const expected = (lens.prices[ 'EUR'] ?? lens.prices.USD).toLocaleString();
      const priceText = window.document.querySelector('#slot-0 .slot-price').textContent;
      assert.ok(priceText.includes(expected), `expected ${expected} in "${priceText}"`);
    }
  });
}

// The table's price row, as a reader sees it: one text + winner flag per slot.
function priceRow(window) {
  const row = [...window.document.querySelectorAll('.spec-row')]
    .find(r => r.querySelector('.spec-label')?.textContent === 'RRP (list price)');
  return [...row.querySelectorAll('.spec-value')].map(c => ({ text: c.textContent.replace(/\s+/g, ' ').trim(), winner: c.classList.contains('winner') }));
}

test('price row: a lens with no local price shows its USD price tagged USD, and nothing wins', () => {
  const { window, data } = loadBrand('sony', { engine: true });
  clickMode(window, 'lenses');
  const live = Object.entries(data.LENSES).filter(([, l]) => !l.discontinued);
  const [usdOnly, u] = live.find(([, l]) => l.prices.EUR == null);
  const [local] = live.find(([id, l]) => l.prices.EUR != null && id !== usdOnly);
  setCurrency(window, 'EUR');
  setSlot(window, 0, usdOnly);
  setSlot(window, 1, local);
  const [a, b] = priceRow(window);
  assert.equal(a.text, `USD $${u.prices.USD.toLocaleString()}`, 'tagged USD, never "—" or €');
  assert.match(b.text, /^€/);
  assert.ok(!a.winner && !b.winner, 'a local price and a USD fallback are not compared');
  const slot = window.document.querySelector('#slot-0 .slot-price').textContent.replace(/\s+/g, ' ');
  assert.match(slot, /USD \$/);
  assert.doesNotMatch(slot, /€/);
});

test('price row: the cheapest still wins when every slot has a local price', () => {
  const { window, data } = loadBrand('sony', { engine: true });
  clickMode(window, 'lenses');
  const priced = Object.entries(data.LENSES).filter(([, l]) => !l.discontinued && l.prices.EUR != null);
  const [cheap] = priced.reduce((m, e) => (e[1].prices.EUR < m[1].prices.EUR ? e : m));
  const cheapEur = priced.find(([id]) => id === cheap)[1].prices.EUR;
  const dear = priced.filter(([, l]) => l.prices.EUR > cheapEur).map(([id]) => id);
  setCurrency(window, 'EUR');
  // Every visible slot needs a local price, or nothing is highlighted.
  const slots = window.document.querySelectorAll('.slot-select').length || 3;
  setSlot(window, 0, dear[0]);
  setSlot(window, 1, cheap);
  for (let i = 2; i < slots; i++) setSlot(window, i, dear[i - 1]);
  const cells = priceRow(window);
  assert.ok(cells.every(c => /^€/.test(c.text)), `all slots priced in EUR: ${JSON.stringify(cells)}`);
  assert.ok(!cells[0].winner && cells[1].winner, 'the lower EUR price is highlighted');
});

test('discontinued item in a non-USD currency labels its launch price USD', () => {
  const { window, data } = loadBrand('fujifilm', { engine: true });
  const [id, cam] = Object.entries(data.CAMERAS).find(([, c]) => c.discontinued && c.prices.EUR == null && c.prices.USD != null);
  setCurrency(window, 'EUR');
  setSlot(window, 0, id);
  const text = window.document.querySelector('#slot-0 .slot-price').textContent.replace(/\s+/g, ' ');
  assert.match(text, /Discontinued/);
  assert.ok(text.includes(`Launch: USD $${cam.prices.USD.toLocaleString()}`), `got "${text}"`);
});
