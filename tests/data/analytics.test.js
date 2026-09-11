// Tier 1 — Analytics wiring. Every page that loads GoatCounter's count.js also
// loads analytics.js, deferred and directly after it (defer preserves order,
// so window.goatcounter exists when analytics.js runs). Static links that carry
// events — vs-page Buy/CTA, landing brand cards — declare them for count.js.
//
// The analytics tag lives in hand-written heads AND in the generate-seo.js
// templates; a page that misses one silently reports no events, which is what
// this file exists to catch.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('../helpers/load-brand');

const SKIP = new Set(['node_modules', 'openspec', 'tests', 'assets', 'scripts']);

function htmlFiles(dir) {
  const out = [];
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (d.name.startsWith('.') || SKIP.has(d.name)) continue;
    const abs = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...htmlFiles(abs));
    else if (d.name.endsWith('.html')) out.push(abs);
  }
  return out;
}

const pages = htmlFiles(ROOT)
  .map(abs => ({ rel: path.relative(ROOT, abs), html: fs.readFileSync(abs, 'utf8') }))
  .filter(p => p.html.includes('gc.zgo.at/count.js'));

const TAG = /gc\.zgo\.at\/count\.js"><\/script>\s*<script defer src="((?:\.\.\/)+|\.\/)analytics\.js"><\/script>/;

test('analytics.js exists and defines window.trackEvent', () => {
  const src = fs.readFileSync(path.join(ROOT, 'analytics.js'), 'utf8');
  assert.match(src, /window\.trackEvent\s*=/);
});

test('GoatCounter is on the pages this suite expects (sanity: the scan found them)', () => {
  const rels = pages.map(p => p.rel);
  for (const must of ['index.html', 'about.html', 'privacy.html', 'compare/index.html', 'fujifilm/index.html']) {
    assert.ok(rels.includes(must), `expected ${must} to load GoatCounter`);
  }
  assert.ok(rels.some(r => /^[a-z]+\/vs\//.test(r)), 'expected brand vs-pages');
  assert.ok(rels.some(r => r.startsWith('vs/')), 'expected cross-brand vs-pages');
});

test('every page with count.js loads analytics.js, deferred, right after it, at the right depth', () => {
  const bad = [];
  for (const { rel, html } of pages) {
    const m = html.match(TAG);
    if (!m) { bad.push(`${rel}: no deferred analytics.js directly after count.js`); continue; }
    const resolved = path.normalize(path.join(path.dirname(rel), m[1], 'analytics.js'));
    if (resolved !== 'analytics.js') bad.push(`${rel}: src "${m[1]}analytics.js" resolves to ${resolved}`);
  }
  assert.deepEqual(bad, []);
});

test('vs-page Buy and "Compare interactively" links declare their GoatCounter events', () => {
  const bad = [];
  for (const { rel, html } of pages.filter(p => /(^|\/)vs\//.test(p.rel))) {
    const buys = html.match(/<a class="vs-buy"[^>]*>/g) || [];
    const ctas = html.match(/<a class="vs-cta"[^>]*>/g) || [];
    if (buys.length !== 2) bad.push(`${rel}: expected 2 Buy links, found ${buys.length}`);
    if (ctas.length !== 1) bad.push(`${rel}: expected 1 CTA, found ${ctas.length}`);
    for (const a of buys) {
      if (!/data-goatcounter-click="buy-click:vs:[a-z]+:[^":]+"/.test(a)) bad.push(`${rel}: ${a}`);
    }
    for (const a of ctas) {
      if (!/data-goatcounter-click="vs-to-interactive:[a-z]+:[^":]+-vs-[^":]+"/.test(a)) bad.push(`${rel}: ${a}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('landing brand cards declare brand-pick events', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const cards = html.match(/<li class="brand-card"[^>]*>\s*<a [^>]*>/g) || [];
  assert.ok(cards.length >= 2, 'expected brand cards on the landing page');
  for (const c of cards) {
    assert.match(c, /data-goatcounter-click="brand-pick:[a-z]+"/, c);
  }
});
