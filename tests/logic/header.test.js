// Tier 2 — design-system header: the logo lockup renders on every
// engine page, links back to the brand picker with the redirect
// suppression param, and the engine applies no per-brand page colors.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');

function assertLockup(document) {
  const home = document.querySelector('#site-header .brand-home');
  assert.ok(home, 'header should contain the .brand-home lockup link');
  assert.equal(home.getAttribute('href'), '../?brands',
    'lockup must link to the root picker with the ?brands suppression param');
  assert.ok(home.querySelector('svg'), 'lockup must contain the inline logo mark');
  const wordmark = home.querySelector('.brand-wordmark');
  assert.ok(wordmark, 'lockup must contain the wordmark');
  assert.equal(wordmark.textContent, 'Compare Camera Specs');
  // Framed Duo geometry: two accent circles inside the viewfinder frame.
  const circles = home.querySelectorAll('svg circle');
  assert.equal(circles.length, 2, 'mark must show the two compared-subject circles');
}

for (const brand of brandDirs()) {
  test(`[${brand}] header renders the shared lockup linking home`, () => {
    const { window } = loadBrand(brand, { engine: true });
    assertLockup(window.document);
  });

  test(`[${brand}] engine applies no per-brand page colors`, () => {
    const { window } = loadBrand(brand, { engine: true });
    assert.equal(window.document.documentElement.style.getPropertyValue('--accent-color'), '',
      'engine must not set --accent-color (design tokens own page colors)');
    assert.equal(window.document.documentElement.style.getPropertyValue('--hero-dark'), '',
      'engine must not set --hero-dark');
  });
}

test('compare page renders the same lockup', () => {
  const { window } = loadCompare();
  assertLockup(window.document);
});
