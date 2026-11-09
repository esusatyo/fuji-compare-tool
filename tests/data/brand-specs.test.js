// Tier 1 — the "at a glance" spec table on every brand page (generator-owned,
// inside the seo:body block). The page's specs otherwise render only in the
// browser, so this is the text a crawler without JavaScript can read: it must
// match the data exactly, list each current camera once, and link only to
// vs-pages Google may index.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { loadBrand, brandDirs, ROOT } = require('../helpers/load-brand');
const { brandGlanceHTML, GLANCE_COLS } = require('../../scripts/generate-seo');

const EM_DASH = '—';

function pageOf(brand) {
  const html = fs.readFileSync(path.join(ROOT, brand, 'index.html'), 'utf8');
  return new JSDOM(html).window.document;
}

// A minimal brand dataset for the unit tests below (no files involved).
function fakeData(cameras, order = Object.keys(cameras)) {
  return {
    BRAND_CONFIG: { name: 'Acme' },
    CAMERAS: cameras,
    CAMERA_ORDER: order,
    LENSES: { l1: { manufacturer: 'Acme' }, l2: { manufacturer: 'Zed' }, l3: { manufacturer: 'Zed' } },
  };
}
const cam = (name, extra = {}) => ({
  name, year: 2024, sensorMP: 24, sensorType: 'APS-C', ibis: false, maxVideoRes: '4K',
  weight: 500, width: 100, height: 70, depth: 50, prices: { USD: 999 }, ...extra,
});
const docOf = html => new JSDOM(`<body>${html}</body>`).window.document;

for (const brand of brandDirs()) {
  const { data } = loadBrand(brand);
  const order = data.CAMERA_ORDER.filter(id => data.CAMERAS[id]);
  const current = order.filter(id => !data.CAMERAS[id].discontinued);
  const older = order.filter(id => data.CAMERAS[id].discontinued);

  test(`[brand-specs] ${brand}: one row per current camera, in CAMERA_ORDER`, () => {
    const rows = [...pageOf(brand).querySelectorAll('.seo-glance tbody tr')];
    assert.equal(rows.length, current.length);
    assert.deepEqual(
      rows.map(r => r.querySelector('th').textContent),
      current.map(id => data.CAMERAS[id].name));
  });

  test(`[brand-specs] ${brand}: every cell matches the data (— for a missing value)`, () => {
    const rows = [...pageOf(brand).querySelectorAll('.seo-glance tbody tr')];
    rows.forEach((row, i) => {
      const c = data.CAMERAS[current[i]];
      const cells = [...row.querySelectorAll('td')].map(td => td.textContent);
      assert.equal(cells.length, GLANCE_COLS.length, `${c.name}: column count`);
      GLANCE_COLS.forEach(([header, fmt], j) => {
        const want = fmt(c);
        assert.equal(cells[j], want == null || want === '' ? EM_DASH : String(want), `${c.name} / ${header}`);
      });
    });
  });

  test(`[brand-specs] ${brand}: older cameras are the discontinued ones, in order`, () => {
    const line = [...pageOf(brand).querySelectorAll('.seo-glance > p')]
      .find(p => p.textContent.startsWith('Older '));
    if (!older.length) return assert.equal(line, undefined);
    assert.ok(line, 'older-cameras line is present');
    const listed = line.textContent.replace(/^[^:]*:\s*/, '').replace(/\.$/, '');
    assert.equal(listed, older.map(id => data.CAMERAS[id].name).join(', '));
  });

  test(`[brand-specs] ${brand}: lens line total and per-maker counts add up`, () => {
    const line = [...pageOf(brand).querySelectorAll('.seo-glance > p')]
      .find(p => p.textContent.startsWith('Lenses: '));
    assert.ok(line, 'lens line is present');
    const total = Object.keys(data.LENSES).length;
    assert.match(line.textContent, new RegExp(`^Lenses: ${total} for `));
    const counts = [...line.textContent.replace(/^[^:]*:[^:]*:\s*/, '').replace(/\.$/, '').matchAll(/(.+?) (\d+)(?:, |$)/g)];
    assert.equal(counts.reduce((sum, m) => sum + Number(m[2]), 0), total);
    const makers = counts.map(m => m[1]);
    if (makers.includes(data.BRAND_CONFIG.name)) {
      assert.equal(makers[0], data.BRAND_CONFIG.name, 'the brand\'s own lenses come first');
    }
    const rest = counts.filter(m => m[1] !== data.BRAND_CONFIG.name).map(m => Number(m[2]));
    assert.deepEqual(rest, [...rest].sort((x, y) => y - x), 'other makers run from most to fewest lenses');
  });

  test(`[brand-specs] ${brand}: camera links are extensionless and reach an indexable vs-page`, () => {
    for (const a of pageOf(brand).querySelectorAll('.seo-glance a')) {
      const href = a.getAttribute('href');
      assert.doesNotMatch(href, /\.html/, `${href} must be extensionless`);
      assert.match(href, /^vs\/[^/]+-vs-[^/]+$/);
      const file = path.join(ROOT, brand, `${href}.html`);
      assert.ok(fs.existsSync(file), `${href} resolves to a generated page`);
      assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /<meta name="robots" content="noindex/, `${href} must be indexable`);
    }
  });
}

test('[brand-specs] Sony A7 IV row, checked against the raw data.js values', () => {
  const row = [...pageOf('sony').querySelectorAll('.seo-glance tbody tr')]
    .find(r => r.querySelector('th').textContent === 'A7 IV');
  assert.ok(row, 'A7 IV row exists');
  const cells = [...row.querySelectorAll('td')].map(td => td.textContent);
  assert.equal(cells[0], '2021');
  assert.equal(cells[4], '658 g');
  assert.equal(cells[5], '131.3 × 96.4 × 79.8 mm');
  assert.equal(cells[6], '$2,499');
});

test('[brand-specs] a brand with no current cameras renders no table, but keeps the other lines', () => {
  const doc = docOf(brandGlanceHTML('acme', fakeData({ old: cam('Old', { discontinued: true }) })));
  assert.equal(doc.querySelector('table'), null);
  assert.match(doc.body.textContent, /Older Acme cameras in this comparison: Old\./);
  assert.match(doc.body.textContent, /Lenses: 3 for Acme cameras: Acme 1, Zed 2\./);
});

test('[brand-specs] exactly one current camera uses singular wording', () => {
  const text = docOf(brandGlanceHTML('acme', fakeData({ one: cam('One') }))).body.textContent;
  assert.match(text, /The current Acme camera in this comparison\. Use the tool above to compare it side by side\./);
});

test('[brand-specs] camera names are escaped', () => {
  const html = brandGlanceHTML('acme', fakeData({ x: cam('<b>Tom & "Jerry"</b>') }));
  assert.doesNotMatch(html, /<b>Tom/);
  assert.equal(docOf(html).querySelector('tbody th').textContent, '<b>Tom & "Jerry"</b>');
});

test('[brand-specs] a camera missing a dimension shows — for size, other cells intact', () => {
  const doc = docOf(brandGlanceHTML('acme', fakeData({ x: cam('X', { depth: null }) })));
  const cells = [...doc.querySelectorAll('tbody td')].map(td => td.textContent);
  assert.equal(cells[GLANCE_COLS.findIndex(c => c[0].startsWith('Size'))], EM_DASH);
  assert.equal(cells[GLANCE_COLS.findIndex(c => c[0] === 'Weight')], '500 g');
});

test('[brand-specs] names link only when a vs-page is indexable', () => {
  const data = fakeData({ a: cam('A'), b: cam('B'), c: cam('C') });
  const pairs = [['a', 'b'], ['b', 'c']];
  const doc = docOf(brandGlanceHTML('acme', data, (x, y) => x === 'a' && y === 'b', pairs));
  const hrefs = id => [...doc.querySelectorAll('tbody tr')]
    .find(r => r.querySelector('th').textContent === id).querySelectorAll('a');
  assert.equal(hrefs('A')[0].getAttribute('href'), 'vs/a-vs-b');
  assert.equal(hrefs('B')[0].getAttribute('href'), 'vs/a-vs-b');
  assert.equal(hrefs('C').length, 0, 'C is only in a noindexed pair, so plain text');
  assert.equal(docOf(brandGlanceHTML('acme', data, undefined, pairs)).querySelectorAll('a').length, 0,
    'by default nothing is linked');
});

test('[brand-specs] discontinuing a camera moves it from the table to the older line', () => {
  const before = docOf(brandGlanceHTML('acme', fakeData({ a: cam('A'), b: cam('B') })));
  assert.equal(before.querySelectorAll('tbody tr').length, 2);
  assert.doesNotMatch(before.body.textContent, /Older Acme/);
  const after = docOf(brandGlanceHTML('acme', fakeData({ a: cam('A'), b: cam('B', { discontinued: true }) })));
  assert.deepEqual([...after.querySelectorAll('tbody th')].map(th => th.textContent), ['A']);
  assert.match(after.body.textContent, /Older Acme cameras in this comparison: B\./);
});
