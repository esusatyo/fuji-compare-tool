// Tier 2 — References section: the Spec source/Price source/Image
// source/Product page citation block engine.js appends to the spec table
// (last section, always expanded), on both brand pages and the compare page.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');

const ROW_LABELS = ['Spec source', 'Price source', 'Image source', 'Product page'];

function sections(window) {
  return [...window.document.querySelectorAll('.spec-section')];
}

function referencesSection(window) {
  const all = sections(window);
  return all[all.length - 1];
}

function refRow(window, label) {
  const refs = referencesSection(window);
  return [...refs.querySelectorAll('.spec-row')]
    .find(r => r.querySelector('.spec-label').textContent === label);
}

function refCell(window, label, slotIdx) {
  return refRow(window, label).querySelectorAll('.spec-value')[slotIdx];
}

// ── Structure ────────────────────────────────────────────────────────

test('[fujifilm] References is the last section, with the four labelled rows in order', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const refs = referencesSection(window);
  assert.equal(refs.querySelector('.section-title').textContent, 'References');
  const labels = [...refs.querySelectorAll('.spec-label')].map(l => l.textContent);
  assert.deepEqual(labels, ROW_LABELS);
});

test('[fujifilm] References header has no collapse toggle and does not collapse on click', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const refs = referencesSection(window);
  const header = refs.querySelector('.section-header');
  assert.equal(header.querySelector('.section-toggle'), null);
  const body = refs.querySelector('.section-body');
  header.click();
  assert.equal(body.classList.contains('collapsed'), false, 'References body must never collapse');
});

// ── Fallback, dedup, empty state ────────────────────────────────────

test('[fujifilm] an item with only a productUrl shows "—" for Spec/Price/Image and a link for Product page', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const id = window.cfg().selectedIds()[0];
  const cam = window.__BRAND__.CAMERAS[id];
  delete cam.specSources;
  delete cam.priceSource;
  delete cam.imageSource;
  delete cam.imageCredit;
  cam.productUrl = 'https://www.fujifilm-x.com/global/products/cameras/x-t5/';
  window.renderAll();

  assert.equal(refCell(window, 'Spec source', 0).textContent.trim(), '—');
  assert.equal(refCell(window, 'Price source', 0).textContent.trim(), '—');
  assert.equal(refCell(window, 'Image source', 0).textContent.trim(), '—');
  const link = refCell(window, 'Product page', 0).querySelector('a.ref-link');
  assert.ok(link, 'expected a Product page link');
  assert.equal(link.href, cam.productUrl);
});

test('[fujifilm] a specSources entry identical to productUrl is shown only once, under Product page', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const id = window.cfg().selectedIds()[0];
  const cam = window.__BRAND__.CAMERAS[id];
  const url = 'https://www.fujifilm-x.com/global/products/cameras/x-t5/';
  cam.productUrl = url;
  cam.specSources = [{ url, tier: 'T1' }];
  window.renderAll();

  assert.equal(refCell(window, 'Spec source', 0).textContent.trim(), '—');
  assert.equal(refCell(window, 'Product page', 0).querySelectorAll('a.ref-link').length, 1);
});

test('[fujifilm] a spec source that differs from productUrl appears in both rows', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const id = window.cfg().selectedIds()[0];
  const cam = window.__BRAND__.CAMERAS[id];
  cam.productUrl = 'https://www.fujifilm-x.com/global/products/cameras/x-t5/';
  cam.specSources = [{ url: 'https://www.dpreview.com/reviews/x-t5', tier: 'T2' }];
  window.renderAll();

  assert.equal(refCell(window, 'Spec source', 0).querySelectorAll('a.ref-link').length, 1);
  assert.equal(refCell(window, 'Product page', 0).querySelectorAll('a.ref-link').length, 1);
});

test('[fujifilm] multiple spec sources stack as separate links, in array order', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const id = window.cfg().selectedIds()[0];
  const cam = window.__BRAND__.CAMERAS[id];
  cam.productUrl = null;
  cam.specSources = [
    { url: 'https://www.fujifilm-x.com/a', tier: 'T1', title: 'First' },
    { url: 'https://www.dpreview.com/b', tier: 'T2', title: 'Second' },
  ];
  window.renderAll();

  const links = refCell(window, 'Spec source', 0).querySelectorAll('a.ref-link');
  assert.equal(links.length, 2);
  assert.deepEqual([...links].map(l => l.textContent), ['First', 'Second']);
});

test('[fujifilm] a citation without a title falls back to a bare host+path label', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const id = window.cfg().selectedIds()[0];
  const cam = window.__BRAND__.CAMERAS[id];
  cam.productUrl = null;
  cam.priceSource = { url: 'https://www.adorama.com/fujifilm-x-t5', tier: 'T3' };
  window.renderAll();

  const link = refCell(window, 'Price source', 0).querySelector('a.ref-link');
  assert.equal(link.textContent, 'adorama.com/fujifilm-x-t5');
});

test('[fujifilm] a Commons imageCredit.source is used when imageSource is absent', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const id = window.cfg().selectedIds()[0];
  const cam = window.__BRAND__.CAMERAS[id];
  delete cam.imageSource;
  cam.imageCredit = {
    author: 'Someone', licence: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:X.jpg',
  };
  window.renderAll();

  const link = refCell(window, 'Image source', 0).querySelector('a.ref-link');
  assert.ok(link, 'expected an Image source link from imageCredit.source');
  assert.equal(link.href, cam.imageCredit.source);
});

test('[fujifilm] reference links open safely in a new tab and show the full URL as their tooltip', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const id = window.cfg().selectedIds()[0];
  const cam = window.__BRAND__.CAMERAS[id];
  cam.productUrl = 'https://www.fujifilm-x.com/global/products/cameras/x-t5/';
  window.renderAll();

  const link = refCell(window, 'Product page', 0).querySelector('a.ref-link');
  assert.equal(link.target, '_blank');
  assert.equal(link.rel, 'noopener nofollow');
  assert.equal(link.title, cam.productUrl);
});

test('[fujifilm] a citation\'s internal note is never rendered anywhere on the page', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const id = window.cfg().selectedIds()[0];
  const cam = window.__BRAND__.CAMERAS[id];
  const SENTINEL = 'INTERNAL-RESEARCH-NOTE-NEVER-SHOWN';
  cam.productUrl = null;
  cam.specSources = [{ url: 'https://a.example/spec', tier: 'T1', note: SENTINEL }];
  cam.priceSource = { url: 'https://b.example/price', tier: 'T3', note: SENTINEL };
  cam.imageSource = { url: 'https://c.example/image', tier: 'T2', note: SENTINEL };
  window.renderAll();

  assert.doesNotMatch(window.document.body.innerHTML, new RegExp(SENTINEL),
    'note text leaked into the rendered page');
});

// ── Lenses mode ──────────────────────────────────────────────────────

test('[fujifilm] References also renders for lens items, not just cameras', () => {
  const { window } = loadBrand('fujifilm', { engine: true, hash: '#lenses' });
  const refs = referencesSection(window);
  assert.equal(refs.querySelector('.section-title').textContent, 'References');
  const id = window.cfg().selectedIds()[0];
  const lens = window.__BRAND__.LENSES[id];
  lens.productUrl = 'https://www.fujifilm-x.com/global/products/lenses/example/';
  window.renderAll();
  const link = refCell(window, 'Product page', 0).querySelector('a.ref-link');
  assert.equal(link.href, lens.productUrl);
});

// ── Compare page: mixed brands ──────────────────────────────────────

test('[compare] each slot shows its own item\'s references, independent of the other slots', () => {
  const { window } = loadCompare();
  window.BRAND_DATA.fujifilm.CAMERAS['x-t5'].productUrl = null;
  window.BRAND_DATA.fujifilm.CAMERAS['x-t5'].specSources = [
    { url: 'https://www.fujifilm-x.com/a', tier: 'T1', title: 'Fuji spec source' },
  ];
  window.BRAND_DATA.sony.CAMERAS['a7-iv'].productUrl = null;
  delete window.BRAND_DATA.sony.CAMERAS['a7-iv'].specSources;
  window.renderAll();

  // DEFAULTS: slot 0 = fujifilm:x-t5, slot 1 = sony:a7-iv.
  const specCells = refRow(window, 'Spec source').querySelectorAll('.spec-value');
  assert.ok(specCells[0].querySelector('a.ref-link'), 'fujifilm slot should show its spec source');
  assert.equal(specCells[1].textContent.trim(), '—', 'sony slot has no spec source of its own');
});
