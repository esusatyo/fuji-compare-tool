// Tier 2 — Interaction events, rendered in jsdom.
//
// engine.js and theme.js report through window.trackEvent (analytics.js). The
// tests swap in a recorder after load, then drive the real controls: what
// matters is that a genuine change reports exactly one correctly-named event,
// and a no-op (re-clicking the active chip/mode/theme) reports none.
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

// ── engine.js ───────────────────────────────────────────────────────
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

test('[fujifilm] a Buy click reports buy-click:tool for the item in that slot', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const id = window.cfg().selectedIds()[1];
  window.document.querySelector('#slot-1 .slot-buy').click();
  assert.deepEqual(calls, [`buy-click:tool:fujifilm:${id}`]);
});

test('[fujifilm] a middle-click on Buy counts; a right-click does not', () => {
  const window = brandPage('fujifilm');
  const calls = record(window);
  const buy = window.document.querySelector('#slot-0 .slot-buy');
  buy.dispatchEvent(new window.MouseEvent('auxclick', { bubbles: true, button: 2 }));
  buy.dispatchEvent(new window.MouseEvent('auxclick', { bubbles: true, button: 1 }));
  assert.deepEqual(calls, [`buy-click:tool:fujifilm:${window.cfg().selectedIds()[0]}`]);
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
function loadAnalytics({ goatcounter }) {
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
    runScripts: 'dangerously', url: 'https://example.test/fujifilm/', pretendToBeVisual: true,
  });
  const { window } = dom;
  const sent = [];
  const timers = [];
  if (goatcounter) window.goatcounter = { count: v => sent.push({ path: v.path, title: v.title, event: v.event }) };
  window.setTimeout = (fn, ms) => timers.push({ fn, ms });
  window.clearTimeout = () => {};
  const s = window.document.createElement('script');
  s.textContent = fs.readFileSync(path.join(ROOT, 'analytics.js'), 'utf8');
  window.document.body.appendChild(s);
  return { window, sent, timers };
}

test('[analytics.js] trackEvent sends a GoatCounter event', () => {
  const { window, sent } = loadAnalytics({ goatcounter: true });
  window.trackEvent('theme:light', 'Theme: light');
  window.trackEvent('mode-switch:sony:lenses');
  assert.deepEqual(sent, [
    { path: 'theme:light', title: 'Theme: light', event: true },
    { path: 'mode-switch:sony:lenses', title: 'mode-switch:sony:lenses', event: true },
  ]);
});

test('[analytics.js] engaged-30s is armed for 30s of visibility and fires once with the page path', () => {
  const { sent, timers } = loadAnalytics({ goatcounter: true });
  assert.equal(timers.length, 1);
  assert.equal(timers[0].ms, 30000);
  timers[0].fn();
  assert.deepEqual(sent.map(e => e.path), ['engaged-30s:/fujifilm/']);
});

test('[analytics.js] without GoatCounter: trackEvent is a no-op and no timer is left pending', () => {
  const { window, timers } = loadAnalytics({ goatcounter: false });
  assert.doesNotThrow(() => window.trackEvent('theme:dark'));
  assert.equal(timers.length, 0);
});
