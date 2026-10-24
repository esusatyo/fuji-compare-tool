// Tier 1 — IndexNow: the key file is served from the site root and matches
// the key scripts/indexnow.js submits, and URL selection only ever pushes
// indexable (sitemap) pages plus pages that just left the sitemap.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { KEY, sitemapUrls, fileToUrl, selectUrls } = require('../../scripts/indexnow');
const { siteConfig } = require('../../scripts/generate-seo');

const ROOT = path.resolve(__dirname, '..', '..');
const BASE = siteConfig().baseUrl;
const sitemap = urls => urls.map(u => `<url><loc>${u}</loc></url>`).join('\n');

test('the IndexNow key file is at the root, matches the key, and is uploaded', () => {
  const file = path.join(ROOT, `${KEY}.txt`);
  assert.ok(fs.existsSync(file), `${KEY}.txt missing from the repo root`);
  assert.equal(fs.readFileSync(file, 'utf8').trim(), KEY);
  const ignored = fs.readFileSync(path.join(ROOT, '.assetsignore'), 'utf8')
    .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  assert.ok(!ignored.some(p => p === `${KEY}.txt` || p === '*.txt'), '.assetsignore excludes the key file');
});

test('every live sitemap URL maps back from a file on disk', () => {
  const urls = sitemapUrls(fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8'));
  assert.ok(urls.length > 0);
  const fromFile = u => {
    const rel = u.slice(BASE.length + 1);
    return rel === '' || rel.endsWith('/') ? `${rel}index.html` : `${rel}.html`;
  };
  for (const u of urls) {
    const f = fromFile(u);
    assert.ok(fs.existsSync(path.join(ROOT, f)), `${u}: no ${f}`);
    assert.equal(fileToUrl(f, BASE), u, `${f} maps to ${fileToUrl(f, BASE)}, sitemap says ${u}`);
  }
});

test('selects changed indexable pages, brand data, and dropped URLs only', () => {
  const urls = selectUrls({
    baseUrl: BASE,
    changedFiles: [
      'vs/sony-a7r-vi-vs-nikon-z8.html',     // indexable → in
      'fujifilm/vs/x-e4-vs-x-e3.html',       // noindexed (not in sitemap) → out
      'sony/data.js',                        // brand data → brand page
      'index.html',                          // root
      'engine.js', 'tests/data/x.test.js',   // not pages → out
    ],
    oldSitemap: sitemap([`${BASE}/`, `${BASE}/sony/`, `${BASE}/vs/sony-a7r-vi-vs-nikon-z8`, `${BASE}/canon/vs/gone`]),
    newSitemap: sitemap([`${BASE}/`, `${BASE}/sony/`, `${BASE}/vs/sony-a7r-vi-vs-nikon-z8`]),
  });
  assert.deepEqual(urls, [
    `${BASE}/`,
    `${BASE}/canon/vs/gone`,
    `${BASE}/sony/`,
    `${BASE}/vs/sony-a7r-vi-vs-nikon-z8`,
  ]);
});

test('nothing changed means nothing submitted', () => {
  const s = sitemap([`${BASE}/`]);
  assert.deepEqual(selectUrls({ baseUrl: BASE, changedFiles: ['README.md'], oldSitemap: s, newSitemap: s }), []);
});
