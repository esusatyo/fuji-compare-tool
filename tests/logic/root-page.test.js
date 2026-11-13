// Tier 2 — Root index.html: a landing page for everyone, and no redirect.
//
// The page used to send returning visitors (a brand in localStorage) straight
// to their brand page. It now hosts the comparison tool itself, so everyone —
// first-timer, returning visitor, crawler — gets the same page. The remembered
// brand is still written by brand pages and simply isn't read here.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadHome } = require('../helpers/load-home');
const { brandDirs } = require('../helpers/load-brand');

const ROOT = path.resolve(__dirname, '..', '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

test('[root] no script redirects: nothing reads the stored brand or replaces the location', () => {
  assert.doesNotMatch(html, /location\.replace|location\.href\s*=|VALID_BRANDS/);
  assert.doesNotMatch(html, /localStorage\.getItem\(\s*['"]brand['"]/);
  assert.doesNotMatch(html, /http-equiv=["']refresh/i);
});

test('[root] a returning visitor with a stored brand stays on the homepage', () => {
  for (const hash of ['', '#lenses', '#cameras=fujifilm:x-t5']) {
    const { window } = loadHome({ storedBrand: 'fujifilm', hash });
    assert.equal(window.location.pathname, '/', `stored brand + "${hash}" must not navigate`);
    assert.equal(window.localStorage.getItem('brand'), 'fujifilm', 'the preference is left alone');
    assert.ok(window.document.querySelector('#app .compare-grid'), 'the tool renders');
  }
});

test('[root] the homepage never stores a brand of its own', () => {
  const { window } = loadHome();
  assert.equal(window.localStorage.getItem('brand'), null);
});

test('[root] served HTML contains crawlable landing content (present without JS)', () => {
  assert.match(html, /<h1[^>]*>[^<]*Compare Camera Specs[^<]*<\/h1>/, 'landing h1 missing');
  // One brand card link per brand directory.
  for (const brand of brandDirs()) {
    assert.match(html, new RegExp(`href="\\./${brand}/"`), `landing missing link to ${brand}`);
  }
  // At least one link into the comparison cluster, as a clean URL.
  assert.match(html, /href="\.\/[a-z]+\/vs\/[a-z0-9-]+"/, 'landing missing any vs-page link');
});

test('[root] the tool\'s container sits in the static HTML, with a no-JS note', () => {
  assert.match(html, /<section class="quick-compare"[^>]*>\s*<div id="app"><\/div>\s*<noscript>/);
});

test('[root] loads the engine after the generated block, and no brand data up front', () => {
  const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]);
  assert.ok(srcs.includes('./engine.js'));
  assert.ok(html.indexOf('window.COMPARE_CONFIG') < html.indexOf('src="./engine.js"'),
    'the config must be declared before the engine reads it');
  assert.deepEqual(srcs.filter(s => /data\.js$/.test(s)), [],
    'brand files are fetched on demand by the engine, never by a tag in the page');
});
