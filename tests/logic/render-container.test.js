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

const STATIC_SECTIONS = '<section class="seo-links" id="glance"><h2>Glance</h2><p>specs</p></section>'
  + '<section class="seo-links" id="popular"><h2>Popular</h2><a href="vs/a-vs-b">A vs B</a></section>';

test('[render] the footer moves below the generator-owned static sections', () => {
  const { window } = loadBrand(ONE_BRAND, {
    engine: true,
    html: `<!DOCTYPE html><html><head></head><body><div id="app"></div>${STATIC_SECTIONS}</body></html>`,
  });
  const doc = window.document;
  const kids = [...doc.body.children].filter(el => el.matches('#app, .seo-links, footer')).map(el => el.id || el.tagName.toLowerCase());
  assert.deepEqual(kids, ['app', 'glance', 'popular', 'footer'], 'footer is last, static order unchanged');
  assert.equal(doc.getElementById('glance').querySelector('p').textContent, 'specs');
  assert.ok(doc.getElementById('popular').querySelector('a[href="vs/a-vs-b"]'), 'static link intact');
  assert.equal(doc.querySelectorAll('footer').length, 1, 'footer moved, not duplicated');
});

test('[render] with no static sections the footer stays inside #app', () => {
  const { window } = loadBrand(ONE_BRAND, { engine: true });
  assert.ok(window.document.getElementById('app').querySelector('footer'));
});

test('[render] the moved footer keeps its theme toggle and affiliate slot', () => {
  const { window } = loadBrand(ONE_BRAND, {
    engine: true,
    html: `<!DOCTYPE html><html><head></head><body><div id="app"></div>${STATIC_SECTIONS}</body></html>`,
  });
  const footer = window.document.querySelector('footer');
  assert.equal(footer.parentElement, window.document.body);
  assert.deepEqual([...footer.querySelectorAll('.theme-toggle .theme-btn')].map(b => b.dataset.themePref),
    ['light', 'dark', 'system']);
  assert.ok(footer.querySelector('#affiliate-disclosure'));
});
