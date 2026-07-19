// ─────────────────────────────────────────────
// BRAND DATA REGISTRY
//
// Guards the multi-brand loading contract: every brand file registers
// its dataset under window.BRAND_DATA[<slug>] (exactly the eight
// dataset keys, slug matching its directory), leaks nothing into
// global scope, and any number of brand files can be evaluated in one
// page in any order. Also reserves ':' — the compare page's
// brand/slug separator — so namespaced ids can never be ambiguous.
// ─────────────────────────────────────────────
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { loadBrand, brandDirs, ROOT } = require('../helpers/load-brand');

const DATASET_KEYS = [
  'BRAND_CONFIG', 'SERIES_COLORS', 'CAMERAS', 'CAMERA_ORDER',
  'DROPDOWN_GROUPS', 'LENSES', 'LENS_DROPDOWN_GROUPS', 'REGISTERED_BRANDS',
];

function runScript(window, code) {
  const s = window.document.createElement('script');
  s.textContent = code;
  window.document.body.appendChild(s);
}

for (const brand of brandDirs()) {
  test(`[${brand}] registers exactly its own entry with the eight dataset keys`, () => {
    const { window } = loadBrand(brand);
    const registry = window.BRAND_DATA;
    assert.ok(registry, 'window.BRAND_DATA missing');
    assert.deepEqual(Object.keys(registry), [brand], 'registry should hold exactly this brand');
    const entry = registry[brand];
    assert.deepEqual(Object.keys(entry).sort(), [...DATASET_KEYS].sort(),
      'entry should expose exactly the eight dataset keys');
    assert.equal(entry.BRAND_CONFIG.slug, brand, 'registry key must match BRAND_CONFIG.slug');
  });

  test(`[${brand}] leaks no dataset globals outside the registry`, () => {
    const { window } = loadBrand(brand);
    // Top-level consts would be visible to a subsequent script; the IIFE
    // wrap must keep them out of both the global lexical scope and window.
    runScript(window, `window.__leaks = ${JSON.stringify(DATASET_KEYS)}
      .filter(k => { try { return eval('typeof ' + k) !== 'undefined'; } catch (e) { return true; } });`);
    assert.deepEqual(window.__leaks, [], 'dataset names must not be reachable as globals');
  });

  test(`[${brand}] no camera or lens slug contains the reserved ':' separator`, () => {
    const { data } = loadBrand(brand);
    const offenders = [...Object.keys(data.CAMERAS), ...Object.keys(data.LENSES)]
      .filter(slug => slug.includes(':'));
    assert.deepEqual(offenders, [], "':' is reserved for '<brand>:<slug>' compare ids");
  });
}

test('all brand files coexist in one page, evaluated in shuffled order', () => {
  const brands = brandDirs();
  // Deterministic non-sorted order: reversed with the middle element first.
  const order = [...brands].reverse();
  order.unshift(order.splice(Math.floor(order.length / 2), 1)[0]);

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { runScripts: 'dangerously' });
  const { window } = dom;
  for (const b of order) {
    runScript(window, fs.readFileSync(path.join(ROOT, b, 'data.js'), 'utf8'));
  }

  assert.deepEqual(Object.keys(window.BRAND_DATA).sort(), [...brands].sort(),
    'every brand should be registered');
  for (const b of brands) {
    const entry = window.BRAND_DATA[b];
    assert.deepEqual(Object.keys(entry).sort(), [...DATASET_KEYS].sort(), `[${b}] entry keys`);
    assert.equal(entry.CAMERA_ORDER.length, Object.keys(entry.CAMERAS).length,
      `[${b}] CAMERA_ORDER should cover CAMERAS`);
    assert.ok(Object.keys(entry.LENSES).length > 0, `[${b}] lenses intact`);
  }
});
