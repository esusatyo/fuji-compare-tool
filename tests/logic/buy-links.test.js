// Tier 2 — Currency-aware Amazon buy links.
//
// Buy links are no longer stored per item; the engine generates an Amazon
// product-search URL on the currency's regional marketplace at render time
// (see amazonBuyUrl / AMAZON_MARKETPLACE in engine.js). These tests pin the
// marketplace mapping and the behaviour of the rendered Buy button.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { setCurrency, slotSelect } = require('../helpers/dom');

// currency -> expected Amazon host
const MARKETPLACE = {
  USD: 'www.amazon.com',
  AUD: 'www.amazon.com.au',
  EUR: 'www.amazon.de',
  GBP: 'www.amazon.co.uk',
  JPY: 'www.amazon.co.jp',
  CAD: 'www.amazon.ca',
  SGD: 'www.amazon.sg',
};

for (const brand of brandDirs()) {
  test(`[${brand}] amazonBuyUrl links to the product page per marketplace when an asin is set`, () => {
    const { window } = loadBrand(brand, { engine: true });
    const item = { name: 'Test Model 1', asin: 'B0FBXB6QLF' };

    for (const [cur, host] of Object.entries(MARKETPLACE)) {
      const u = new URL(window.amazonBuyUrl(item, cur));
      assert.equal(u.host, host, `${cur} should point at ${host}`);
      assert.equal(u.pathname, '/dp/B0FBXB6QLF', `${cur} should be a /dp product page`);
    }
  });

  test(`[${brand}] amazonBuyUrl falls back to a search URL when no asin`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const brandName = data.BRAND_CONFIG.name;

    for (const [cur, host] of Object.entries(MARKETPLACE)) {
      const u = new URL(window.amazonBuyUrl({ name: 'Test Model 1' }, cur));
      assert.equal(u.host, host, `${cur} should point at ${host}`);
      assert.equal(u.pathname, '/s', `${cur} should be a search URL`);
      assert.equal(u.searchParams.get('k'), `${brandName} Test Model 1`);
    }
  });

  test(`[${brand}] unknown currency falls back to amazon.com`, () => {
    const { window } = loadBrand(brand, { engine: true });
    assert.equal(new URL(window.amazonBuyUrl({ name: 'X', asin: 'B000000000' }, 'XYZ')).host, 'www.amazon.com');
    assert.equal(new URL(window.amazonBuyUrl({ name: 'X' }, 'XYZ')).host, 'www.amazon.com');
  });

  test(`[${brand}] rendered Buy button follows the active currency`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const id = slotSelect(window, 0).value;
    const cam = data.CAMERAS[id];

    for (const [cur, host] of Object.entries(MARKETPLACE)) {
      setCurrency(window, cur);
      const u = new URL(window.document.querySelector('#slot-0 .slot-buy').getAttribute('href'));
      assert.equal(u.host, host, `Buy button host for ${cur}`);
      // Product page when the default camera has an asin, else search fallback.
      if (cam.asin) assert.equal(u.pathname, `/dp/${cam.asin}`, `Buy /dp for ${cur}`);
      else assert.equal(u.searchParams.get('k'), `${data.BRAND_CONFIG.name} ${cam.name}`, `Buy query for ${cur}`);
    }
  });
}
