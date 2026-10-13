// Tier 2 — the Share button on the interactive tool, rendered in jsdom.
//
// It hands the current URL (selection hash included) to the native share
// sheet where one exists, else the clipboard, else a selected read-only
// field — never a browser dialog. share-link events count completed
// hand-offs only. navigator.share / navigator.clipboard are stubbed per test
// (jsdom has neither); the handler reads them at click time.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');

function setup(window, { share, clipboard } = {}) {
  const calls = [];
  window.trackEvent = p => calls.push(p);
  const nav = window.navigator;
  Object.defineProperty(nav, 'share', { value: share, configurable: true });
  Object.defineProperty(nav, 'clipboard', { value: clipboard, configurable: true });
  const dialogs = [];
  for (const fn of ['alert', 'confirm', 'prompt']) window[fn] = () => dialogs.push(fn);
  return { calls, dialogs };
}

// The handler is async; let its awaited promise settle.
const settle = () => new Promise(r => setTimeout(r, 0));
const click = window => window.document.getElementById('share-btn').click();

test('[fujifilm] copy: clipboard gets the URL with the selection hash, button confirms, event sent', async () => {
  const window = loadBrand('fujifilm', { engine: true, hash: '#cameras=x-t5,x-s20' }).window;
  let copied = null;
  const { calls, dialogs } = setup(window, { clipboard: { writeText: async t => { copied = t; } } });
  click(window);
  await settle();
  assert.match(copied, /#cameras=x-t5,x-s20$/);
  assert.equal(window.document.getElementById('share-btn-label').textContent, 'Link copied');
  assert.deepEqual(calls, ['share-link:fujifilm:cameras:copy']);
  assert.deepEqual(dialogs, []);
});

test('[sony] native: navigator.share gets the URL and title, event sent', async () => {
  const window = loadBrand('sony', { engine: true, hash: '#lenses' }).window;
  let shared = null;
  const { calls } = setup(window, { share: async d => { shared = d; }, clipboard: { writeText: async () => assert.fail('should not copy') } });
  click(window);
  await settle();
  assert.equal(shared.url, window.location.href);
  assert.equal(shared.title, window.document.title);
  assert.deepEqual(calls, ['share-link:sony:lenses:native']);
});

test('[canon] cancelled share sheet sends no event and does not fall back to copying', async () => {
  const window = loadBrand('canon', { engine: true }).window;
  let copied = false;
  const abort = Object.assign(new Error('cancelled'), { name: 'AbortError' });
  const { calls } = setup(window, {
    share: async () => { throw abort; },
    clipboard: { writeText: async () => { copied = true; } },
  });
  click(window);
  await settle();
  assert.deepEqual(calls, []);
  assert.equal(copied, false);
});

test('[nikon] share refused for another reason falls back to copying', async () => {
  const window = loadBrand('nikon', { engine: true }).window;
  const refused = Object.assign(new Error('not allowed'), { name: 'NotAllowedError' });
  const { calls } = setup(window, {
    share: async () => { throw refused; },
    clipboard: { writeText: async () => {} },
  });
  click(window);
  await settle();
  assert.deepEqual(calls, ['share-link:nikon:cameras:copy']);
});

test('[panasonic] no share or clipboard API: URL shown in a selected field, no dialog, no event', async () => {
  const window = loadBrand('panasonic', { engine: true, hash: '#cameras=s5-ii,s5' }).window;
  const { calls, dialogs } = setup(window, {});
  click(window);
  await settle();
  const field = window.document.getElementById('share-url');
  assert.equal(field.hidden, false);
  assert.equal(field.value, window.location.href);
  assert.equal(window.document.activeElement, field);
  assert.deepEqual(calls, []);
  assert.deepEqual(dialogs, []);
});

test('compare page: copy reports share-link:compare', async () => {
  const window = loadCompare({ hash: '#cameras=fujifilm:x-t5,sony:a7-iv' }).window;
  let copied = null;
  const { calls } = setup(window, { clipboard: { writeText: async t => { copied = t; } } });
  click(window);
  await settle();
  assert.match(copied, /#cameras=fujifilm:x-t5,sony:a7-iv$/);
  assert.deepEqual(calls, ['share-link:compare:cameras:copy']);
});
