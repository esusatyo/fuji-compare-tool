// Tier 2 — "Show differences only": which rows count as different, what the
// toggle hides, and where it does and doesn't appear.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadBrand, ROOT } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');
const { loadHome } = require('../helpers/load-home');
const { setSlot, clickMode } = require('../helpers/dom');

const rows = doc => [...doc.querySelectorAll('#compare-table .spec-section:not(.refs-section) .spec-row')];
const cellsOf = row => [...row.querySelectorAll('.spec-value')].map(c => c.innerHTML);
const differs = row => new Set(cellsOf(row)).size > 1;
const labels = doc => rows(doc).map(r => r.querySelector('.spec-label').textContent);
const count = doc => doc.querySelector('.diff-count').textContent;
function toggle(window, on) {
  const box = window.document.getElementById('diff-only');
  box.checked = on;
  box.dispatchEvent(new window.Event('change', { bubbles: true }));
}

test('the toggle sits above the table, off by default, with an honest count', () => {
  const { window } = loadCompare();
  const doc = window.document;
  const bar = doc.querySelector('.diff-bar');
  assert.equal(doc.getElementById('compare-table').firstElementChild, bar);
  assert.equal(doc.getElementById('diff-only').checked, false);
  assert.equal(bar.querySelector('label').textContent.trim(), 'Show differences only');
  const all = rows(doc);
  const n = all.filter(differs).length;
  assert.ok(n > 0 && n < all.length, 'fixture: the default comparison has both same and different rows');
  assert.equal(count(doc), `${n} of ${all.length} specs differ`);
});

test('switching it on leaves exactly the rows that differ, in order, winners intact', () => {
  const { window } = loadCompare();
  const doc = window.document;
  const before = rows(doc);
  const expected = before.filter(differs).map(r => r.querySelector('.spec-label').textContent);
  const winnersBefore = doc.querySelectorAll('.winner').length;
  const text = count(doc);

  toggle(window, true);
  assert.deepEqual(labels(doc), expected);
  assert.ok(rows(doc).every(differs));
  assert.equal(doc.getElementById('diff-only').checked, true);
  assert.equal(doc.activeElement, doc.getElementById('diff-only'), 'keyboard focus stays on the toggle');
  assert.equal(count(doc), text, 'the count describes the comparison, not the filter');
  assert.equal(doc.querySelectorAll('.winner').length, winnersBefore, 'a winning row always differs');

  toggle(window, false);
  assert.equal(rows(doc).length, before.length);
});

test('a section with nothing left is dropped; References always stays', () => {
  const { window } = loadCompare();
  const doc = window.document;
  toggle(window, true);
  for (const sec of doc.querySelectorAll('.spec-section:not(.refs-section)')) {
    assert.ok(sec.querySelectorAll('.spec-row').length > 0, `${sec.querySelector('.section-title').textContent} rendered empty`);
  }
  assert.ok(doc.querySelector('.refs-section .spec-row'), 'references are sources, not specs');
});

test('the choice survives picking another camera, the slot count and the currency', () => {
  const { window } = loadCompare();
  const doc = window.document;
  toggle(window, true);
  setSlot(window, 0, 'nikon:zf');
  assert.equal(doc.getElementById('diff-only').checked, true);
  assert.ok(rows(doc).length > 0 && rows(doc).every(differs));
  const sel = doc.getElementById('slot-count-select');
  sel.value = '2';
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.ok(rows(doc).every(r => r.querySelectorAll('.spec-value').length === 2 && differs(r)));
});

test('"the same" means the same as shown across the visible slots only', () => {
  // Three slots where slot 2 differs from an identical pair → rows differ;
  // drop to two slots and those rows are now identical, so they hide.
  const { window, data } = loadBrand('fujifilm', { engine: true });
  const doc = window.document;
  const [a, b] = Object.keys(data.CAMERAS);
  setSlot(window, 0, a);
  setSlot(window, 1, a); // forced duplicate, as the winners tests do
  setSlot(window, 2, b);
  toggle(window, true);
  assert.ok(rows(doc).length > 0);
  const sel = doc.getElementById('slot-count-select');
  sel.value = '2';
  sel.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.equal(rows(doc).length, 0);
  assert.equal(count(doc), `0 of ${count(doc).match(/of (\d+)/)[1]} specs differ`);
  assert.match(doc.querySelector('.diff-none').textContent, /^No differences: these cameras match/);
  assert.ok(doc.getElementById('diff-only'), 'the toggle is still there to switch back');
});

test('it works for lenses, with the lens spec rows', () => {
  const { window } = loadBrand('sony', { engine: true });
  const doc = window.document;
  toggle(window, true);
  clickMode(window, 'lenses');
  assert.equal(doc.getElementById('diff-only').checked, true);
  assert.ok(rows(doc).length > 0 && rows(doc).every(differs));
  assert.match(count(doc), /^\d+ of \d+ specs differ$/);
});

test('[home] no toggle with one camera; it appears with the second; Reset switches it off', () => {
  const home = loadHome();
  const { window } = home;
  const doc = window.document;
  setSlot(window, 0, 'fujifilm:x-t5');
  home.deliverData();
  assert.equal(doc.querySelector('.diff-bar'), null);
  const sheet = rows(doc).length;

  setSlot(window, 1, 'sony:a7-iv');
  assert.ok(doc.querySelector('.diff-bar'));
  toggle(window, true);
  assert.ok(rows(doc).length < sheet);
  // An empty third slot is not an item: it neither makes rows differ nor hides them.
  const before = labels(doc);
  doc.querySelector('.count-chip[data-count="3"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.deepEqual(labels(doc), before);

  doc.getElementById('reset-btn').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  setSlot(window, 0, 'nikon:zf');
  setSlot(window, 1, 'nikon:z8');
  assert.equal(doc.getElementById('diff-only').checked, false);
});

test('analytics: the toggle reports on/off with the page', () => {
  const { window } = loadCompare();
  const calls = [];
  window.trackEvent = p => calls.push(p);
  toggle(window, true);
  toggle(window, false);
  assert.deepEqual(calls, ['diff-only:compare:on', 'diff-only:compare:off']);
});

test('the state is not written to the URL', () => {
  const { window } = loadCompare();
  toggle(window, true);
  assert.equal(window.location.hash, '');
  assert.equal(window.location.search, '');
});

test('winning cells use one dedicated colour, defined for both themes', () => {
  const css = fs.readFileSync(path.join(ROOT, 'engine.css'), 'utf8');
  const rule = css.match(/\.spec-value\.winner\s*\{[^}]*\}/)[0];
  assert.match(rule, /color:\s*var\(--win\)/);
  assert.match(rule, /background:\s*var\(--win-tint\)/);
  assert.doesNotMatch(rule, /col-accent/, 'no longer the column\'s own accent');
  assert.equal((css.match(/^\s*--win:\s*#[0-9A-Fa-f]{6};/gm) || []).length, 2, 'one --win per theme block');
});
