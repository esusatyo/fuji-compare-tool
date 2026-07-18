// Tier 2 — Engine renders into #app and preserves static content outside it.
// Guards the SEO-crawlability invariant: generator-owned static blocks placed
// outside the render container must survive engine rendering.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

const ONE_BRAND = brandDirs()[0];

test('[render] engine renders the UI inside #app', () => {
  const { window } = loadBrand(ONE_BRAND, {
    engine: true,
    html: '<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>',
  });
  const app = window.document.getElementById('app');
  assert.ok(app.querySelector('#site-header'), 'header should render inside #app');
  assert.ok(app.querySelector('#compare-table'), 'compare table should render inside #app');
});

test('[render] static content outside #app survives rendering', () => {
  const { window } = loadBrand(ONE_BRAND, {
    engine: true,
    html: '<!DOCTYPE html><html><head></head><body>'
        + '<div id="app"></div>'
        + '<section id="seo-static"><h2>Popular comparisons</h2>'
        + '<a href="vs/a-vs-b.html">A vs B</a></section>'
        + '</body></html>',
  });
  const stat = window.document.getElementById('seo-static');
  assert.ok(stat, 'static block must still exist after render');
  assert.equal(stat.querySelector('h2').textContent, 'Popular comparisons');
  assert.ok(stat.querySelector('a[href="vs/a-vs-b.html"]'), 'static link must survive');
  // And the UI still rendered into #app, not over the static block.
  assert.ok(window.document.getElementById('app').querySelector('#site-header'));
});

test('[render] falls back to document.body when no #app is present', () => {
  const { window } = loadBrand(ONE_BRAND, {
    engine: true,
    html: '<!DOCTYPE html><html><head></head><body></body></html>',
  });
  assert.ok(window.document.getElementById('site-header'), 'UI should render into body as fallback');
});

test('[render] section-toggle handlers still work when rendered into #app', () => {
  const { window } = loadBrand(ONE_BRAND, { engine: true });
  const header = window.document.querySelector('.section-header');
  assert.ok(header, 'a section header should exist after render into #app');
  const body = window.document.getElementById(`body-${header.dataset.section}`);
  const before = body.classList.contains('collapsed');
  header.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.notEqual(body.classList.contains('collapsed'), before, 'clicking a header should toggle its section body');
});
