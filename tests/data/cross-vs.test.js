// Tier 1 — Cross-brand vs-pages: the curated matchup list resolves
// against real brand data (typos fail generation, not production), the
// generated pages carry well-formed compare CTAs, and every page is in
// the sitemap and reachable from the compare page's crawlable block.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { buildAll, resolveMatchups, CROSS_BRAND_MATCHUPS } = require('../../scripts/generate-seo');

const brandData = {};
for (const b of brandDirs()) brandData[b] = loadBrand(b).data;
const matchups = resolveMatchups(brandData);
const files = buildAll();

test('every curated matchup resolves; both sides are different brands', () => {
  assert.equal(matchups.length, CROSS_BRAND_MATCHUPS.length);
  assert.ok(matchups.length >= 60, `curated set should stay substantial (got ${matchups.length})`);
  for (const m of matchups) {
    assert.notEqual(m.a.brand, m.b.brand, m.file);
    assert.ok(m.a.cam && m.b.cam, m.file);
  }
});

test('canonical pair order puts the newer (then pricier) camera first', () => {
  for (const m of matchups) {
    const usd = s => (s.cam.prices && s.cam.prices.USD) || 0;
    assert.ok(
      m.a.cam.year > m.b.cam.year ||
      (m.a.cam.year === m.b.cam.year && usd(m.a) >= usd(m.b)),
      `${m.file}: expected newer-first ordering`);
  }
});

test('an unknown camera in the list fails generation loudly', () => {
  assert.throws(
    () => resolveMatchups(brandData, [[['sony', 'a7-xix'], ['canon', 'eos-r1']]]),
    /unknown camera 'sony:a7-xix'/);
  assert.throws(
    () => resolveMatchups(brandData, [[['kodak', 'dc290'], ['canon', 'eos-r1']]]),
    /unknown brand 'kodak'/);
  assert.throws(
    () => resolveMatchups(brandData, [[['canon', 'eos-r1'], ['canon', 'eos-r3']]]),
    /same-brand pair/);
  assert.throws(
    () => resolveMatchups(brandData, [
      [['sony', 'a9-iii'], ['canon', 'eos-r1']],
      [['canon', 'eos-r1'], ['sony', 'a9-iii']],
    ]),
    /duplicate pair/);
});

test('one generated page per matchup, with brand names and a valid CTA', () => {
  for (const m of matchups) {
    const html = files.get(m.file);
    assert.ok(html, `missing generated page ${m.file}`);
    assert.match(html, new RegExp(`<title>.*${m.a.brandName}.*vs.*${m.b.brandName}`),
      `${m.file}: title should carry both brand names`);
    const cta = `../compare/#cameras=${m.a.brand}:${m.a.slug},${m.b.brand}:${m.b.slug}`;
    assert.ok(html.includes(`href="${cta}"`), `${m.file}: interactive CTA should be ${cta}`);
    assert.ok(html.includes('application/ld+json'), `${m.file}: structured data present`);
  }
});

test('sitemap lists the compare page and every cross-brand page (clean URLs, no .html)', () => {
  const sitemap = files.get('sitemap.xml');
  assert.ok(sitemap.includes('/compare/</loc>'));
  for (const m of matchups) {
    // The host 307-redirects .html to the extensionless URL, so the
    // sitemap must carry the clean form.
    assert.ok(sitemap.includes(`/${m.file.replace(/\.html$/, '')}</loc>`), `sitemap missing ${m.file}`);
    assert.ok(!sitemap.includes(`/${m.file}</loc>`), `sitemap must not list the .html form of ${m.file}`);
  }
});

test('no orphans: the compare page links every cross-brand vs-page', () => {
  const compare = files.get('compare/index.html');
  for (const m of matchups) {
    assert.ok(compare.includes(`href="../${m.file}"`), `compare page missing link to ${m.file}`);
  }
});

test('landing page links the compare page and a cross-brand sample', () => {
  const root = files.get('index.html');
  assert.ok(root.includes('href="./compare/"'), 'All Brands card missing');
  const linked = matchups.filter(m => root.includes(`href="./${m.file}"`));
  assert.ok(linked.length >= 3, 'landing cluster should sample cross-brand pages');
});

test('cross-brand related links resolve to generated sibling pages', () => {
  for (const m of matchups) {
    const html = files.get(m.file);
    for (const [, target] of html.matchAll(/<a href="([a-z0-9-]+\.html)">/g)) {
      assert.ok(files.has(`vs/${target}`), `${m.file}: related link ${target} is not generated`);
    }
  }
});
