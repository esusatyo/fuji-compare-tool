// Tier 2 — Root index.html redirector.
//
// The root page is a standalone redirector (no data.js / engine.js). It reads
// localStorage['brand'], falls back to Canon, and location.replace()s to the
// brand directory, preserving the hash. We exercise the *shipped* inline
// script by extracting it and running it against mock `localStorage`/`location`
// globals, so the test tracks the real source.
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

/** Run the redirect script with the given stored brand + hash; return the replace() target. */
function runRedirect({ stored = null, hash = '' } = {}) {
  let target = null;
  const localStorage = { getItem: key => (key === 'brand' ? stored : null) };
  const location = { hash, replace: url => { target = url; } };
  // The script is an IIFE referencing free `localStorage`/`location`; inject them as params.
  new Function('localStorage', 'location', redirectScript())(localStorage, location);
  return target;
}

test('[root] first-time visitor (no stored brand) redirects to Canon', () => {
  assert.equal(runRedirect({ stored: null }), './canon/');
});

test('[root] invalid stored brand falls back to Canon', () => {
  assert.equal(runRedirect({ stored: 'nikon' }), './canon/');
});

test('[root] valid stored brand is honored', () => {
  assert.equal(runRedirect({ stored: 'fujifilm' }), './fujifilm/');
});

test('[root] valid stored brand "sony" is honored', () => {
  assert.equal(runRedirect({ stored: 'sony' }), './sony/');
  assert.equal(runRedirect({ stored: 'sony', hash: '#lenses' }), './sony/#lenses');
});

test('[root] hash fragment is preserved through the redirect', () => {
  assert.equal(runRedirect({ stored: null, hash: '#lenses' }), './canon/#lenses');
  assert.equal(runRedirect({ stored: 'fujifilm', hash: '#lenses' }), './fujifilm/#lenses');
});
