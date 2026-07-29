// Tier 1 — Internal-link integrity of the generated site.
// Two guarantees, both built from buildAll() output (no network, no server):
//   1. No generated page (except the root) is orphaned — every one is the
//      target of an <a href> from some other page. A sitemap entry does NOT
//      count; only real links do.
//   2. Every internal <a href> resolves to a page that actually exists.
// This class of bug (143 vs-pages reachable only via the sitemap) shipped once
// silently; this test is what makes it fail loudly next time.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const posix = path.posix;
const { buildAll } = require('../../scripts/generate-seo');
const { ROOT } = require('../helpers/load-brand');

const generated = buildAll();

// Repo-relative target of an href found in `fromFile`, or null if the href is
// external / non-navigational. This mirrors the host's URL→file mapping, so
// the test resolves links exactly as Cloudflare Pages serves them:
//   - directory links (`../`, `./canon/`) resolve to their index.html
//   - internal links are published extensionless (see cleanHref in
//     scripts/generate-seo.js), and the host serves `<target>.html`
function resolveHref(fromFile, href) {
  if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return null;
  let h = href.split('#')[0].split('?')[0];
  if (!h) return null;
  let target = posix.normalize(posix.join(posix.dirname(fromFile), h));
  if (target.endsWith('/')) return target + 'index.html';
  if (!target.endsWith('.html')) target += '.html';
  return target;
}

function hrefsIn(html) {
  const out = [];
  const re = /<a\b[^>]*\bhref="([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}

const htmlPages = [...generated.keys()].filter(k => k.endsWith('.html'));

// A path "exists" if the generator emits it, or it's a committed static file.
function pathExists(rel) {
  if (generated.has(rel)) return true;
  return fs.existsSync(path.join(ROOT, rel));
}

// Build the set of every internal link target across the whole site.
const linkedTargets = new Set();
const brokenLinks = [];
const dotHtmlLinks = [];
for (const file of htmlPages) {
  for (const href of hrefsIn(generated.get(file))) {
    const target = resolveHref(file, href);
    if (target === null) continue;
    linkedTargets.add(target);
    if (!pathExists(target)) brokenLinks.push(`${file} → ${href} (resolved ${target})`);
    if (/\.html(\?|#|$)/.test(href)) dotHtmlLinks.push(`${file} → ${href}`);
  }
}

test('no generated page is orphaned (linked from at least one other page)', () => {
  const orphans = htmlPages.filter(p => p !== 'index.html' && !linkedTargets.has(p));
  assert.deepEqual(orphans, [], `orphaned generated pages (no inbound <a>): \n${orphans.join('\n')}`);
});

test('every internal link resolves to a real page', () => {
  assert.deepEqual(brokenLinks, [], `internal links pointing at nonexistent pages:\n${brokenLinks.join('\n')}`);
});

// The host 307-redirects /page.html → /page. A .html href therefore puts a
// *temporary* redirect on a crawl path and contradicts the clean canonical
// the destination declares, so every internal link must be published clean.
test('internal links use clean URLs (no .html), matching canonicals and the sitemap', () => {
  assert.deepEqual(dotHtmlLinks, [],
    `internal links must drop .html (see cleanHref in scripts/generate-seo.js):\n${dotHtmlLinks.join('\n')}`);
});

test('vs-pages are reached by real links, not only the sitemap', () => {
  const vsPages = htmlPages.filter(p => /\/vs\//.test(p));
  assert.ok(vsPages.length > 100, `expected many vs-pages, found ${vsPages.length}`);
  const unlinked = vsPages.filter(p => !linkedTargets.has(p));
  assert.deepEqual(unlinked, [], `vs-pages present but linked by nothing:\n${unlinked.join('\n')}`);
});
