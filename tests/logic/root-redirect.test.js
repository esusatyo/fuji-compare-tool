// Tier 2 — Root index.html conditional redirector.
//
// The root page is a real landing page that redirects ONLY when a valid brand
// preference is stored. Visitors with no (or an invalid) preference — including
// crawlers, which have no localStorage — fall through and see the landing page,
// so the redirect must NOT fire (target stays null). We exercise the *shipped*
// inline script by extracting it and running it against mock globals, so the
// test tracks the real source.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

/** Pull the inline redirect script (the one calling location.replace) from index.html. */
function redirectScript() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const inline = blocks.find(m => !/\bsrc=/.test(m[1]) && m[2].includes('location.replace'));
  assert.ok(inline, 'no inline redirect <script> found in index.html');
  return inline[2];
}

/** Run the redirect script with the given stored brand + hash + query; return the replace() target. */
function runRedirect({ stored = null, hash = '', search = '' } = {}) {
  let target = null;
  const localStorage = { getItem: key => (key === 'brand' ? stored : null) };
  const location = { hash, search, replace: url => { target = url; } };
  // The script is an IIFE referencing free `localStorage`/`location`; inject them as params.
  new Function('localStorage', 'location', redirectScript())(localStorage, location);
  return target;
}

test('[root] first-time visitor (no stored brand) is NOT redirected — landing page shows', () => {
  assert.equal(runRedirect({ stored: null }), null);
});

test('[root] invalid stored brand is NOT redirected — landing page shows', () => {
  assert.equal(runRedirect({ stored: 'pentax' }), null);
});

test('[root] a crawler (no localStorage at all) is NOT redirected', () => {
  assert.equal(runRedirect({ stored: undefined }), null);
});

test('[root] valid stored brand is honored', () => {
  assert.equal(runRedirect({ stored: 'fujifilm' }), './fujifilm/');
});

test('[root] valid stored brand "sony" is honored', () => {
  assert.equal(runRedirect({ stored: 'sony' }), './sony/');
  assert.equal(runRedirect({ stored: 'sony', hash: '#lenses' }), './sony/#lenses');
});

test('[root] valid stored brand "nikon" is honored', () => {
  assert.equal(runRedirect({ stored: 'nikon' }), './nikon/');
  assert.equal(runRedirect({ stored: 'nikon', hash: '#lenses' }), './nikon/#lenses');
});

test('[root] valid stored brand "panasonic" is honored', () => {
  assert.equal(runRedirect({ stored: 'panasonic' }), './panasonic/');
  assert.equal(runRedirect({ stored: 'panasonic', hash: '#lenses' }), './panasonic/#lenses');
});

test('[root] hash fragment is preserved through the redirect (returning visitor only)', () => {
  assert.equal(runRedirect({ stored: 'fujifilm', hash: '#lenses' }), './fujifilm/#lenses');
  // No stored preference → no redirect, so nothing to preserve.
  assert.equal(runRedirect({ stored: null, hash: '#lenses' }), null);
});

test('[root] ?brands suppresses the redirect despite a stored brand (logo home link)', () => {
  assert.equal(runRedirect({ stored: 'fujifilm', search: '?brands' }), null);
  assert.equal(runRedirect({ stored: 'canon', search: '?brands=1' }), null);
  // Other params don't suppress; the shortcut still fires.
  assert.equal(runRedirect({ stored: 'fujifilm', search: '?utm_source=x' }), './fujifilm/');
});

test('[root] suppression leaves the stored preference untouched', () => {
  let removed = false;
  const localStorage = {
    getItem: key => (key === 'brand' ? 'sony' : null),
    removeItem: () => { removed = true; },
    setItem: () => { removed = true; },
  };
  const location = { hash: '', search: '?brands', replace: () => {} };
  new Function('localStorage', 'location', redirectScript())(localStorage, location);
  assert.equal(removed, false, 'suppression must not clear or rewrite localStorage["brand"]');
});

test('[root] served HTML contains crawlable landing content (present without JS)', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.match(html, /<h1[^>]*>[^<]*Compare Camera Specs[^<]*<\/h1>/, 'landing h1 missing');
  // One brand card link per registered brand.
  for (const brand of ['canon', 'fujifilm', 'nikon', 'panasonic', 'sony']) {
    assert.match(html, new RegExp(`href="\\./${brand}/"`), `landing missing link to ${brand}`);
  }
  // At least one link into the comparison cluster.
  assert.match(html, /href="\.\/[a-z]+\/vs\/[^"]+\.html"/, 'landing missing any vs-page link');
});
