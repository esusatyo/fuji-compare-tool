// Tier 2 — the finder pages in jsdom: the real generated /cameras/ and
// /lenses/ HTML with finder.js run against it. Filtering, sorting, the
// discontinued switch, URL state, currency and the hidden-price note, the
// compare bar, and the events reported.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { ROOT } = require('../helpers/load-brand');
const Finder = require('../../finder.js');

const FINDER_JS = fs.readFileSync(path.join(ROOT, 'finder.js'), 'utf8');

async function load(kind, { hash = '', width } = {}) {
  const html = fs.readFileSync(path.join(ROOT, kind, 'index.html'), 'utf8');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e));
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: `https://example.test/${kind}/${hash}`, virtualConsole: vc, pretendToBeVisual: true });
  const { window } = dom;
  if (width !== undefined) Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
  const events = [];
  window.trackEvent = (p, t) => events.push(p);
  window.eval(FINDER_JS);
  const doc = window.document;
  // finder.js boots on DOMContentLoaded, which jsdom fires after construction.
  if (doc.readyState === 'loading') await new Promise(r => doc.addEventListener('DOMContentLoaded', r));
  const rows = () => [...doc.querySelectorAll('#finder-rows tr')];
  const visible = () => rows().filter(r => !r.hidden);
  const rec = tr => Object.assign(Finder.readRow(kind, tr.dataset), { name: tr.querySelector('th a').textContent });
  const form = doc.getElementById('finder-form');
  const fire = el => el.dispatchEvent(new window.Event('change', { bubbles: true }));
  const check = (name, value, on = true) => {
    const el = form.querySelector(`[name="${name}"][value="${value}"]`);
    assert.ok(el, `no ${name}=${value} control`);
    el.checked = on;
    fire(el);
  };
  const set = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    assert.ok(el, `no ${name} control`);
    el.value = value;
    fire(el);
  };
  return { window, doc, rows, visible, rec, form, check, set, fire, events, errors };
}

test('the script reveals the form and hides discontinued items by default', async () => {
  const p = await load('cameras');
  assert.equal(p.form.hidden, false);
  assert.ok(p.visible().length > 0);
  assert.ok(p.visible().every(tr => !p.rec(tr).disc));
  const total = p.rows().length;
  assert.equal(p.doc.getElementById('finder-count').textContent, `Showing ${p.visible().length} of ${total} cameras`);
  assert.deepEqual(p.errors, []);
});

test('filters narrow the list and write the URL', async () => {
  const p = await load('cameras');
  p.check('sensor', 'full-frame');
  p.set('maxweight', '500');
  const shown = p.visible().map(p.rec);
  assert.ok(shown.length > 0);
  assert.ok(shown.every(r => r.sensor === 'full-frame' && r.weight <= 500 && !r.disc));
  assert.equal(p.window.location.hash, '#sensor=full-frame&maxweight=500');
  assert.ok(p.events.includes('finder-filter:cameras:sensor'));
  assert.ok(p.events.includes('finder-filter:cameras:maxweight'));
});

test('the discontinued switch shows every camera', async () => {
  const p = await load('cameras');
  p.check('disc', '1');
  assert.equal(p.visible().length, p.rows().length);
  assert.equal(p.doc.getElementById('finder-count').textContent, `Showing all ${p.rows().length} cameras`);
  assert.ok(p.events.includes('finder-disc:cameras:on'));
});

test('a shared link restores filters, sort and currency into the controls', async () => {
  const p = await load('cameras', { hash: '#brand=sony,nikon&ibis=1&sort=weight&cur=AUD&disc=1' });
  assert.ok(p.form.querySelector('[name="brand"][value="sony"]').checked);
  assert.ok(p.form.querySelector('[name="brand"][value="nikon"]').checked);
  assert.ok(!p.form.querySelector('[name="brand"][value="canon"]').checked);
  assert.ok(p.form.querySelector('[name="ibis"]').checked);
  assert.equal(p.form.querySelector('[name="sort"]').value, 'weight');
  assert.equal(p.form.querySelector('[name="cur"]').value, 'AUD');
  assert.ok(p.form.querySelector('[name="disc"]').checked);
  const shown = p.visible().map(p.rec);
  assert.ok(shown.every(r => ['sony', 'nikon'].includes(r.brand) && r.ibis));
  const w = shown.map(r => r.weight);
  assert.deepEqual(w, [...w].sort((a, b) => a - b), 'sorted lightest first');
});

test('sorting reorders the visible rows', async () => {
  const p = await load('cameras');
  p.set('sort', 'mp');
  const mp = p.visible().map(tr => p.rec(tr).mp);
  assert.deepEqual(mp, [...mp].sort((a, b) => b - a));
  assert.ok(p.events.includes('finder-sort:cameras:mp'));
});

test('currency: prices follow it, never converted; a price filter hides and counts items without a price there', async () => {
  const p = await load('cameras', { hash: '#disc=1' });
  p.set('cur', 'AUD');
  assert.equal(p.doc.getElementById('finder-price-head').textContent, 'Price (AUD)');
  for (const tr of p.visible()) {
    const r = p.rec(tr);
    assert.equal(tr.querySelector('.finder-price').textContent, r.prices.AUD != null ? Finder.money(r.prices.AUD, 'AUD') : '—');
  }
  const withoutAud = p.visible().filter(tr => p.rec(tr).prices.AUD == null).length;
  assert.ok(withoutAud > 0, 'some cameras have no AUD price');
  // No price filter: still listed with "—".
  assert.equal(p.doc.getElementById('finder-note').hidden, true);
  p.set('maxprice', '1000000');
  assert.ok(p.visible().every(tr => p.rec(tr).prices.AUD != null));
  const note = p.doc.getElementById('finder-note');
  assert.equal(note.hidden, false);
  assert.equal(note.textContent, `${withoutAud} ${withoutAud === 1 ? 'camera' : 'cameras'} hidden: no AUD price. Switch to USD to see more.`);
  assert.match(p.window.location.hash, /cur=AUD/);
});

test('nothing matching shows the empty state, and Clear filters brings everything back', async () => {
  const p = await load('cameras');
  p.set('maxweight', '1');
  assert.equal(p.visible().length, 0);
  assert.equal(p.doc.getElementById('finder-empty').hidden, false);
  p.doc.querySelector('[data-finder-clear]').click();
  assert.ok(p.visible().length > 0);
  assert.equal(p.doc.getElementById('finder-empty').hidden, true);
  assert.equal(p.form.querySelector('[name="maxweight"]').value, '');
  assert.equal(p.window.location.hash, '');
});

test('a hash change (back/forward, edited URL) re-applies the state', async () => {
  const p = await load('cameras');
  p.window.location.hash = '#sensor=aps-c';
  p.window.dispatchEvent(new p.window.HashChangeEvent('hashchange'));
  assert.ok(p.visible().length > 0 && p.visible().every(tr => p.rec(tr).sensor === 'aps-c'));
  assert.ok(p.form.querySelector('[name="sensor"][value="aps-c"]').checked);
});

test('compare: two to four ticked cameras open the cross-brand comparison', async () => {
  const p = await load('cameras');
  const boxes = p.visible().slice(0, 5).map(tr => tr.querySelector('input[name="pick"]'));
  assert.ok(boxes.every(Boolean), 'the script adds a checkbox per row');
  const bar = p.doc.getElementById('finder-compare');
  const link = p.doc.getElementById('finder-compare-link');
  assert.equal(bar.hidden, true);
  const tick = box => { box.checked = true; box.dispatchEvent(new p.window.Event('change', { bubbles: true })); };
  tick(boxes[0]);
  assert.equal(bar.hidden, false);
  assert.equal(link.getAttribute('aria-disabled'), 'true');
  tick(boxes[1]);
  tick(boxes[2]);
  const ids = boxes.slice(0, 3).map(b => b.value);
  assert.equal(link.getAttribute('href'), `../compare/#cameras=${ids.join(',')}`);
  assert.equal(link.getAttribute('aria-disabled'), 'false');
  tick(boxes[3]);
  assert.ok(boxes[4].disabled, 'a fifth camera cannot be ticked');
  link.click();
  assert.ok(p.events.includes('finder-compare:4'));
});

test('lens finder: focal range, aperture and mount, written to the URL', async () => {
  const p = await load('lenses');
  p.check('mount', 'e');
  p.set('focal-from', '30');
  p.set('focal-to', '40');
  p.set('maxaperture', '1.8');
  const shown = p.visible().map(p.rec);
  assert.ok(shown.length > 0);
  assert.ok(shown.every(r => r.mount === 'e' && r.fmax >= 30 && r.fmin <= 40 && r.aperture <= 1.8));
  assert.equal(p.window.location.hash, '#mount=e&focal=30-40&maxaperture=1.8');
  assert.ok(p.events.includes('finder-filter:lenses:focal'));
  assert.ok(!p.doc.querySelector('input[name="pick"]'), 'no compare boxes for lenses');
});

test('on a phone the filter panel starts folded', async () => {
  assert.equal((await load('cameras', { width: 390 })).doc.getElementById('finder-panel').open, false);
  assert.equal((await load('cameras', { width: 1200 })).doc.getElementById('finder-panel').open, true);
});

test('the compare link opens the comparison page on exactly the ticked cameras', async () => {
  const { loadCompare } = require('../helpers/load-compare');
  const { slotValue } = require('../helpers/dom');
  const p = await load('cameras', { hash: '#disc=1' });
  // Cameras from three brands, including a discontinued one.
  const pickIds = ['fujifilm:x-t5', 'sony:a7-iii', 'leica:m11'];
  for (const id of pickIds) {
    const box = p.rows().find(tr => tr.dataset.id === id).querySelector('input[name="pick"]');
    box.checked = true;
    box.dispatchEvent(new p.window.Event('change', { bubbles: true }));
  }
  const href = p.doc.getElementById('finder-compare-link').getAttribute('href');
  const { window } = loadCompare({ hash: href.slice(href.indexOf('#')) });
  assert.deepEqual([0, 1, 2].map(i => slotValue(window, i)), pickIds);
});
