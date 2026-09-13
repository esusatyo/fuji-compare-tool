// Tier 2 — Interaction events, rendered in jsdom.
//
// engine.js and theme.js report through window.trackEvent (analytics.js). The
// tests swap in a recorder after load, then drive the real controls: what
// matters is that a genuine change reports exactly one correctly-named event,
// and a no-op (re-clicking the active chip/mode/theme) reports none.
//
// analytics.js owns the page-level signals (visible-time tiers, specs-seen);
// those are driven directly, with setTimeout and IntersectionObserver stubbed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { loadBrand, ROOT } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');

function record(window) {
  const calls = [];
  window.trackEvent = p => calls.push(p);
  return calls;
}

const brandPage = (brand, opts = {}) => loadBrand(brand, { engine: true, ...opts }).window;

function pickOther(doc, slotIdx = 0) {
  const sel = doc.querySelectorAll('.slot-select')[slotIdx];
  const opt = [...sel.options].find(o => !o.disabled && !o.selected);
  sel.value = opt.value;
  sel.dispatchEvent(new doc.defaultView.Event('change', { bubbles: true }));
  return opt.value;
}

// ── engine.js: pickers, modes, filters ──────────────────────────────
test('[fujifilm] Cameras/Lenses toggle reports mode-switch, once per real change', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const btn = mode => window.document.querySelector(`.mode-btn[data-mode="${mode}"]`);
  btn('lenses').click();
  btn('lenses').click(); // already active
  btn('cameras').click();
  assert.deepEqual(calls, ['mode-switch:fujifilm:lenses', 'mode-switch:fujifilm:cameras']);
});

test('[fujifilm] changing a camera picker reports camera-swap with the picked model', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const picked = pickOther(window.document);
  assert.deepEqual(calls, [`camera-swap:fujifilm:${picked}`]);
});

test('[sony] changing a lens picker reports lens-swap with the picked model', () => {
  const window = brandPage('sony', { hash: '#lenses' });
  const calls = record(window);
  const picked = pickOther(window.document, 1);
  assert.deepEqual(calls, [`lens-swap:sony:${picked}`]);
});

test('[fujifilm] mount chips report mount-filter, including "All", but not the active chip', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const chip = id => window.document.querySelector(`.mount-chip[data-mount="${id}"]`);
  chip('').click(); // "All" is already active on load
  chip('g').click();
  chip('g').click();
  chip('').click();
  assert.deepEqual(calls, ['mount-filter:fujifilm:g', 'mount-filter:fujifilm:all']);
});

test('[fujifilm] the currency dropdown reports the chosen currency', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const sel = window.document.getElementById('currency-select');
  sel.value = 'JPY';
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.deepEqual(calls, ['currency:JPY']);
});

test('[fujifilm] expanding/collapsing a spec section reports its id and resulting state', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const hdr = window.document.querySelector('.section-header');
  const id = hdr.dataset.section;
  hdr.click(); // sections start open, so the first click collapses
  hdr.click();
  assert.deepEqual(calls, [`spec-section:${id}:close`, `spec-section:${id}:open`]);
});

// ── engine.js: outbound links ───────────────────────────────────────
test('[fujifilm] a Buy click reports buy-click:tool for the item in that slot', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const id = window.cfg().selectedIds()[1];
  window.document.querySelector('#slot-1 .slot-buy').click();
  assert.deepEqual(calls, [`buy-click:tool:fujifilm:${id}`]);
});

test('[fujifilm] a View Product click reports view-product:tool; the "na" placeholder reports nothing', () => {
  const window = brandPage('fujifilm');
  const doc = window.document;
  const slot = [...doc.querySelectorAll('.compare-slot')].find(s => s.querySelector('a.slot-link'));
  assert.ok(slot, 'expected at least one slot with a live View Product link');
  const id = window.cfg().selectedIds()[Number(slot.id.replace('slot-', ''))];
  const calls = record(window);
  slot.querySelector('a.slot-link').click();
  doc.querySelector('span.slot-link.na')?.click();
  assert.deepEqual(calls, [`view-product:tool:fujifilm:${id}`]);
});

test('[fujifilm] a middle-click on Buy counts; a right-click does not', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const buy = window.document.querySelector('#slot-0 .slot-buy');
  buy.dispatchEvent(new window.MouseEvent('auxclick', { bubbles: true, button: 2 }));
  buy.dispatchEvent(new window.MouseEvent('auxclick', { bubbles: true, button: 1 }));
  assert.deepEqual(calls, [`buy-click:tool:fujifilm:${window.cfg().selectedIds()[0]}`]);
});

test('[fujifilm] a reference link click reports reference-click:<kind>:<hostname>', () => {
  const window = brandPage('fujifilm');
  const id = window.cfg().selectedIds()[0];
  // productUrl cleared so this specSources entry can't collide with it and
  // get deduplicated away (see the Spec-source/Product-page dedup rule).
  window.__BRAND__.CAMERAS[id].productUrl = null;
  window.__BRAND__.CAMERAS[id].specSources = [
    { url: 'https://www.fujifilm-x.com/global/products/cameras/x-t5/', tier: 'T1', title: 'Official product page' },
  ];
  window.renderAll();
  const calls = record(window);
  window.document.querySelector('a.ref-link[data-ref-kind="spec"]').click();
  assert.deepEqual(calls, ['reference-click:spec:fujifilm-x.com']);
});

test('[fujifilm] brand switcher reports brand-switch to a brand and to All brands', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const sw = window.document.getElementById('brand-switcher');
  for (const value of ['fujifilm', 'sony', '__compare']) {
    sw.value = value;
    sw.dispatchEvent(new window.Event('change', { bubbles: true }));
  }
  assert.deepEqual(calls, ['brand-switch:fujifilm:sony', 'brand-switch:fujifilm:compare']);
});

test('[compare] events use the page\'s brand-qualified ids and "compare" as the page', () => {
  const { window } = loadCompare();
  const calls = record(window);
  const picked = pickOther(window.document);
  const id = window.cfg().selectedIds()[1];
  window.document.querySelector('#slot-1 .slot-buy').click();
  const sw = window.document.getElementById('brand-switcher');
  sw.value = 'canon';
  sw.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.match(picked, /^[a-z]+:/);
  assert.deepEqual(calls, [`camera-swap:${picked}`, `buy-click:tool:${id}`, 'brand-switch:compare:canon']);
});

test('[fujifilm] no trackEvent on the page (blocked counter) breaks nothing', () => {
  const window = brandPage('fujifilm');
  delete window.trackEvent;
  assert.doesNotThrow(() => {
    pickOther(window.document);
    window.document.querySelector('.mode-btn[data-mode="lenses"]').click();
    window.document.querySelector('.section-header').click();
    window.document.querySelector('#slot-0 .slot-buy').click();
  });
});

// ── theme.js ────────────────────────────────────────────────────────
test('[theme] the footer toggle reports theme changes, not re-clicks', () => {
  const window = brandPage('canon');
  const s = window.document.createElement('script');
  s.textContent = fs.readFileSync(path.join(ROOT, 'theme.js'), 'utf8');
  window.document.body.appendChild(s);
  const calls = record(window);
  const btn = pref => window.document.querySelector(`.theme-btn[data-theme-pref="${pref}"]`);
  btn('system').click(); // the default pref
  btn('light').click();
  btn('light').click();
  btn('dark').click();
  assert.deepEqual(calls, ['theme:light', 'theme:dark']);
});

// ── analytics.js ────────────────────────────────────────────────────
function loadAnalytics({ goatcounter = true, specTable = true } = {}) {
  const body = specTable ? '<main id="compare-table"></main>' : '';
  const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body>${body}</body></html>`, {
    runScripts: 'dangerously', url: 'https://example.test/fujifilm/', pretendToBeVisual: true,
  });
  const { window } = dom;
  const sent = [];
  const timers = [];
  const observers = [];
  if (goatcounter) window.goatcounter = { count: v => sent.push({ path: v.path, title: v.title, event: v.event }) };
  window.setTimeout = (fn, ms) => { timers.push({ fn, ms }); return timers.length; };
  window.clearTimeout = () => {};
  window.IntersectionObserver = function (cb) {
    this.cb = cb; this.disconnected = false;
    this.observe = node => { this.node = node; };
    this.disconnect = () => { this.disconnected = true; };
    observers.push(this);
  };
  const s = window.document.createElement('script');
  s.textContent = fs.readFileSync(path.join(ROOT, 'analytics.js'), 'utf8');
  window.document.body.appendChild(s);
  return { window, sent, timers, observers };
}

test('[analytics.js] trackEvent sends a GoatCounter event', () => {
  const { window, sent } = loadAnalytics();
  window.trackEvent('theme:light', 'Theme: light');
  window.trackEvent('currency:AUD');
  assert.deepEqual(sent, [
    { path: 'theme:light', title: 'Theme: light', event: true },
    { path: 'currency:AUD', title: 'currency:AUD', event: true },
  ]);
});

test('[analytics.js] visible-time tiers fire at 30s then 90s later, each once, then stop', () => {
  const { sent, timers } = loadAnalytics();
  assert.equal(timers.length, 1);
  assert.equal(timers[0].ms, 30000);
  timers[0].fn();
  assert.equal(timers.length, 2, 'the 120s tier should be armed after the first fires');
  assert.equal(timers[1].ms, 90000, 'armed for the gap, so tiers measure cumulative visible time');
  timers[1].fn();
  assert.equal(timers.length, 2, 'no third tier');
  assert.deepEqual(sent.map(e => e.path),
    ['engaged-30s:/fujifilm/', 'engaged-120s:/fujifilm/']);
});

test('[analytics.js] specs-seen fires once when the spec table enters the viewport', () => {
  const { sent, observers } = loadAnalytics();
  assert.equal(observers.length, 1, 'expected the spec table to be observed');
  assert.equal(observers[0].node.id, 'compare-table');
  observers[0].cb([{ isIntersecting: false }]);
  assert.deepEqual(sent, [], 'not reported until it actually intersects');
  observers[0].cb([{ isIntersecting: true }]);
  assert.deepEqual(sent.map(e => e.path), ['specs-seen:/fujifilm/']);
  assert.ok(observers[0].disconnected, 'observer disconnects so it cannot fire twice');
});

test('[analytics.js] a page with no spec table observes nothing', () => {
  const { observers } = loadAnalytics({ specTable: false });
  assert.deepEqual(observers, []);
});

test('[analytics.js] without GoatCounter: trackEvent is a no-op, no timer, no observer', () => {
  const { window, timers, observers } = loadAnalytics({ goatcounter: false });
  assert.doesNotThrow(() => window.trackEvent('theme:dark'));
  assert.equal(timers.length, 0);
  assert.equal(observers.length, 0);
});
