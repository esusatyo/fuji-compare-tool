// Tier 1 — the key specs as recorded (SITE_CONFIG.keySpecs in site-config.js)
// and as rendered: tiles above the spec table on every vs-page. Reads the
// generator's output (the freshness test in seo.test.js proves the committed
// files match it).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { buildSite, siteConfig } = require('../../scripts/generate-seo');
const KeySpecs = require('../../key-specs.js');

const { files } = buildSite();
const site = siteConfig();
const ids = KeySpecs.list(site, 'cameras');
const vsPages = [...files.keys()].filter(f => /(^|\/)vs\/[^/]+\.html$/.test(f));
const doc = rel => new JSDOM(files.get(rel)).window.document;
const brands = Object.fromEntries(brandDirs().map(b => [b, loadBrand(b).data]));
const allCameras = Object.values(brands).flatMap(d => Object.values(d.CAMERAS));

test('site-config.js records the key specs for cameras: a non-empty list of distinct, defined ids', () => {
  assert.ok(Array.isArray(site.keySpecs && site.keySpecs.cameras), 'SITE_CONFIG.keySpecs.cameras missing');
  assert.ok(ids.length > 0);
  assert.equal(new Set(ids).size, ids.length, 'an id is listed twice');
  for (const id of ids) assert.ok(KeySpecs.has('cameras', id), `"${id}" has no definition in key-specs.js`);
});

test('every definition reads fields the camera data really has', () => {
  // A renamed field would make a definition return "no value" for everything.
  for (const [id, def] of Object.entries(KeySpecs.DEFS.cameras)) {
    const opts = { currency: 'USD', money: n => `$${n}` };
    const withValue = allCameras.filter(c => def.value(c, opts) != null).length;
    assert.ok(withValue > allCameras.length * 0.9, `"${id}" has a value for only ${withValue} of ${allCameras.length} cameras`);
    if (def.rank) {
      assert.ok(allCameras.some(c => typeof def.rank(c, opts) === 'number'), `"${id}" ranks no camera`);
    }
  }
});

test('every vs-page shows the recorded key specs as tiles, between the CTA and the spec table', () => {
  assert.ok(vsPages.length > 100);
  for (const rel of vsPages) {
    const html = files.get(rel);
    const pos = ['class="vs-cta"', '<section class="key-specs"', '<div class="vs-card">'].map(n => html.indexOf(n));
    assert.ok(pos.every(i => i !== -1), `${rel}: CTA, key specs or table missing`);
    assert.deepEqual(pos, [...pos].sort((a, b) => a - b), `${rel}: key specs are not between the CTA and the table`);
    assert.equal(html.split('<section class="key-specs"').length, 2, `${rel}: more than one key-specs section`);
    const shown = [...html.matchAll(/data-key-spec="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(shown, ids, `${rel}: tiles do not match the recorded list`);
  }
});

test('a same-brand vs-page: tile values and verdicts come from the two cameras\' data', () => {
  const rel = vsPages.find(f => f.startsWith('fujifilm/vs/'));
  const [aId, bId] = rel.replace('fujifilm/vs/', '').replace('.html', '').split('-vs-');
  const cams = brands.fujifilm.CAMERAS;
  const expected = KeySpecs.tiles('cameras', ids, [
    { name: cams[aId].name, item: cams[aId] },
    { name: cams[bId].name, item: cams[bId] },
  ]);
  const d = doc(rel);
  for (const t of expected) {
    const tile = d.querySelector(`.key-tile[data-key-spec="${t.id}"]`);
    assert.equal(tile.querySelector('h3').textContent, t.label);
    const rows = [...tile.querySelectorAll('.key-row')];
    assert.equal(rows.length, 2);
    rows.forEach((row, i) => {
      assert.equal(row.querySelector('dt').textContent, t.rows[i].name);
      assert.ok(row.querySelector('dd').textContent.startsWith(t.rows[i].value == null ? '—' : t.rows[i].value), `${t.id} row ${i}`);
      assert.equal(row.classList.contains('key-better'), t.rows[i].better, `${t.id} row ${i} verdict`);
    });
  }
});

test('a cross-brand vs-page names each camera with its brand', () => {
  const rel = vsPages.find(f => f.startsWith('vs/'));
  const names = [...doc(rel).querySelectorAll('.key-tile[data-key-spec="sensor"] dt')].map(n => n.textContent);
  assert.equal(names.length, 2);
  const brandNames = Object.values(brands).map(b => b.BRAND_CONFIG.name);
  for (const n of names) assert.ok(brandNames.some(b => n.startsWith(`${b} `)), `"${n}" has no brand`);
});

test('the verdict is never colour alone: a marked value carries "(better)" for screen readers', () => {
  let marked = 0;
  for (const rel of vsPages.slice(0, 40)) {
    for (const row of doc(rel).querySelectorAll('.key-row.key-better')) {
      marked++;
      assert.ok(row.querySelector('.key-sr'), `${rel}: a better value has no text equivalent`);
    }
  }
  assert.ok(marked > 0, 'no verdicts found at all');
});

test('size pages and other generated pages carry no key-spec tiles', () => {
  for (const [rel, html] of files) {
    if (vsPages.includes(rel) || !rel.endsWith('.html')) continue;
    assert.ok(!html.includes('class="key-specs"'), `${rel} has key-spec tiles`);
  }
});
