// Tier 2 — after the engine renders a tool page, it still has exactly one
// <h1>: the engine adopts the generator's static <h1 data-static-hero> as its
// hero title instead of rendering a second one (tests/data/static-h1.test.js
// covers the static HTML).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadBrand, brandDirs, ROOT } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');
const dom = require('../helpers/dom');

// The real brand page's body, without its <script src> tags (loadBrand runs
// data.js and engine.js itself).
function brandPageHTML(brand) {
  const html = fs.readFileSync(path.join(ROOT, brand, 'index.html'), 'utf8');
  const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>')).replace(/<script\b[^>]*><\/script>/g, '');
  return `<!DOCTYPE html><html><head></head><body>${body}</body></html>`;
}

function assertOneHeroH1(document, label, expected) {
  const h1s = [...document.querySelectorAll('h1')];
  assert.equal(h1s.length, 1, `${label}: ${h1s.length} <h1> after render`);
  const [h1] = h1s;
  assert.equal(h1.id, 'hero-title', label);
  assert.ok(h1.closest('.page-hero'), `${label}: the <h1> must be in the hero`);
  assert.ok(!h1.hasAttribute('data-static-hero'), label);
  assert.equal(h1.textContent, expected, label);
}

for (const brand of brandDirs()) {
  test(`[${brand}] the rendered brand page has exactly one <h1>, the hero`, () => {
    const html = brandPageHTML(brand);
    assert.match(html, /<h1 class="seo-h1" data-static-hero>/, `${brand}: static <h1> missing from the page`);
    const { window, data } = loadBrand(brand, { engine: true, html });
    assertOneHeroH1(window.document, brand, data.BRAND_CONFIG.cameras.heroTitle.replace(/<[^>]*>/g, ''));
  });
}

test('switching to lenses retitles the adopted <h1> (still one)', () => {
  const { window, data } = loadBrand('fujifilm', { engine: true, html: brandPageHTML('fujifilm') });
  dom.click(window, window.document.querySelector('.mode-btn[data-mode="lenses"]'));
  assertOneHeroH1(window.document, 'fujifilm lenses', data.BRAND_CONFIG.lenses.heroTitle.replace(/<[^>]*>/g, ''));
});

for (const page of ['compare', 'size', 'kit']) {
  test(`[${page}] the rendered page has exactly one <h1>, the hero`, () => {
    const { window } = loadCompare({ page });
    assertOneHeroH1(window.document, page, window.COMPARE_CONFIG.heroTitle.replace(/<[^>]*>/g, ''));
  });
}
