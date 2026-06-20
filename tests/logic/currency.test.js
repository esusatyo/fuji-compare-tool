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
