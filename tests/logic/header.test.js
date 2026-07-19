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

// ─── Header context label: brand name in cameras mode, "Lens Compare"
// in lenses mode — never "Camera Compare". ───
for (const brand of brandDirs()) {
  test(`[${brand}] header context label is the brand name, then "Lens Compare" after toggling`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const title = window.document.getElementById('header-title');
    assert.equal(title.textContent, data.BRAND_CONFIG.name);
    window.document.querySelector('.mode-btn[data-mode="lenses"]').click();
    assert.equal(title.textContent, 'Lens Compare');
  });
}

test('compare page header context label reads "All Brands"', () => {
  const { window } = loadCompare();
  assert.equal(window.document.getElementById('header-title').textContent, 'All Brands');
});

test('"Camera Compare" no longer appears in any page source', () => {
  const fs = require('fs');
  const path = require('path');
  const ROOT = path.resolve(__dirname, '..', '..');
  const files = [
    'engine.js', 'compare/index.html',
    ...brandDirs().map(b => `${b}/data.js`),
  ];
  for (const f of files) {
    assert.ok(!fs.readFileSync(path.join(ROOT, f), 'utf8').includes('Camera Compare'),
      `${f} still contains the retired "Camera Compare" label`);
  }
});

// ─── One label at a time in the compare label cell. jsdom doesn't apply
// stylesheets, so the markup is checked here and the visibility rules are
// asserted against engine.css text. ───
test('compare label cell carries both labels in markup, CSS shows exactly one', () => {
  const fs = require('fs');
  const path = require('path');
  const css = fs.readFileSync(path.resolve(__dirname, '..', '..', 'engine.css'), 'utf8');
  const { window } = loadBrand(brandDirs()[0], { engine: true });
  const cell = window.document.querySelector('.compare-label-cell--compare');
  assert.ok(cell, 'label cell should carry the --compare modifier when a slot-count field renders');
  assert.ok(cell.querySelector('.compare-label-text'), 'Compare label present in markup');
  assert.ok(cell.querySelector('.slot-count-field'), 'slot-count field present in markup');
  // Desktop: "Compare" hidden while the field shows.
  assert.match(css, /\.compare-label-cell--compare \.compare-label-text \{ display: none; \}/,
    'engine.css must hide .compare-label-text when the slot-count field is visible');
  // Mobile breakpoint: field hidden, "Compare" re-shown.
  const mobile = css.slice(css.indexOf('@media (max-width: 599px)'));
  assert.match(mobile, /\.slot-count-field \{ display: none; \}/,
    'mobile breakpoint must hide the slot-count field');
  assert.match(mobile, /\.compare-label-cell--compare \.compare-label-text \{ display: inline; \}/,
    'mobile breakpoint must re-show the Compare label');
});
