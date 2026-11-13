// Tier 1 — generated size pages, the size section in vs-pages, the /size/
// page and the homepage card. Reads the committed files (the freshness test
// in seo.test.js already proves they equal the generator's output).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { loadBrand, brandDirs, ROOT } = require('../helpers/load-brand');
const { buildSite, siteConfig, SIZE_HUB_TITLE } = require('../../scripts/generate-seo');
const SizeDiagram = require('../../size.js');

const { files } = buildSite();
const site = siteConfig();
const NOINDEX = '<meta name="robots" content="noindex, follow">';
const all = [...files.keys()];
const vsPages = all.filter(f => /(^|\/)vs\/[^/]+\.html$/.test(f));
const sizePages = all.filter(f => /(^|\/)size\/[^/]+\.html$/.test(f) && f !== 'size/index.html');
const indexableVs = vsPages.filter(f => !files.get(f).includes(NOINDEX));
const toSize = f => f.replace(/(^|\/)vs\//, '$1size/');
const doc = rel => new JSDOM(files.get(rel)).window.document;
const sitemap = files.get('sitemap.xml');
const inSitemap = rel => sitemap.includes(`<loc>${site.baseUrl}/${rel.replace(/\.html$/, '')}</loc>`);

test('a size page exists for exactly the indexable vs-pages, at the same path under size/', () => {
  assert.ok(indexableVs.length >= 40, 'fixture: expected dozens of indexable vs-pages');
  assert.deepEqual([...sizePages].sort(), indexableVs.map(toSize).sort());
});

test('no stray size pages on disk beyond the generated set', () => {
  for (const dir of [...brandDirs().map(b => `${b}/size`), 'size']) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      assert.ok(files.has(`${dir}/${f}`), `${dir}/${f} is not generated — run: node scripts/generate-seo.js`);
    }
  }
});

test('every size page and /size/ are in the sitemap; none is noindexed', () => {
  assert.ok(inSitemap('size/'), '/size/ missing from the sitemap');
  for (const rel of sizePages) {
    assert.ok(inSitemap(rel), `${rel} missing from the sitemap`);
    assert.ok(!files.get(rel).includes(NOINDEX), `${rel} must be indexable`);
  }
});

test('a same-brand size page: title, canonical, drawing in both layouts, table from the data, references, links', () => {
  const rel = sizePages.find(f => f.startsWith('fujifilm/size/'));
  const [, aId, bId] = rel.match(/size\/(.+)-vs-(.+)\.html$/);
  const { data } = loadBrand('fujifilm');
  const [a, b] = [data.CAMERAS[aId], data.CAMERAS[bId]];
  assert.ok(a && b, `${rel}: slugs must resolve`);
  const d = doc(rel);

  assert.equal(d.title, `Fujifilm ${a.name} vs ${b.name} Size Comparison`);
  assert.equal(d.querySelector('link[rel=canonical]').href, `${site.baseUrl}/${rel.replace(/\.html$/, '')}`);
  assert.equal(d.querySelector('h1').textContent, `${a.name} vs ${b.name} size comparison`);
  assert.ok(d.querySelector('meta[property="og:image"]'), 'reuses the pair\'s share card');
  assert.ok(d.querySelector('meta[name=description]').content.startsWith(
    SizeDiagram.facts(`Fujifilm ${a.name}`, SizeDiagram.box(a, 'camera'), b.name, SizeDiagram.box(b, 'camera'), 'camera')));

  // Complete without JavaScript: both layouts and the table are in the HTML.
  assert.ok(d.querySelector('.size-views--overlay .size-fig') && d.querySelector('.size-views--side .size-fig'));
  const firstFront = d.querySelector('.size-views--side .size-fig');
  assert.deepEqual([Number(firstFront.dataset.mmW), Number(firstFront.dataset.mmH)], [a.width, a.height]);
  const cell = (row, col) => d.querySelectorAll('.size-table tbody tr')[row].querySelectorAll('td')[col].textContent;
  assert.ok(cell(0, 0).startsWith(`${a.width} mm`) && cell(0, 1).startsWith(`${b.width} mm`));
  assert.ok(cell(3, 0).startsWith(`${a.weight} g`) && cell(3, 1).startsWith(`${b.weight} g`));
  assert.match(d.querySelector('.size-note').textContent, /stated outer dimensions.*References, below/);

  // References on the page the note points to.
  assert.equal(d.querySelector('.vs-refs-heading').textContent, 'References');
  assert.equal(d.querySelectorAll('tbody.vs-refs tr').length, 5);

  const hrefs = [...d.querySelectorAll('main a')].map(x => x.getAttribute('href'));
  assert.ok(hrefs.includes(`../vs/${aId}-vs-${bId}`), 'links the pair\'s vs-page');
  assert.ok(hrefs.includes(`../#cameras=${aId},${bId}`), 'links the interactive tool with the pair selected');
  // The layout switch needs size.js; analytics follows count.js as everywhere.
  const srcs = [...d.querySelectorAll('script[src]')].map(s => s.getAttribute('src'));
  assert.ok(srcs.includes('../../size.js') && srcs.includes('../../analytics.js'));
});

test('a cross-brand size page names both brands and links the cross-brand tool', () => {
  const rel = sizePages.find(f => f.startsWith('size/'));
  const d = doc(rel);
  const base = path.basename(rel, '.html');
  assert.match(d.title, / vs .* Size Comparison$/);
  assert.match(d.querySelector('.size-sentence').textContent, /^The \w+ .* than the \w+ /);
  const hrefs = [...d.querySelectorAll('main a')].map(x => x.getAttribute('href'));
  assert.ok(hrefs.includes(`../vs/${base}`));
  assert.ok(hrefs.some(h => /^\.\/#cameras=[a-z]+:[a-z0-9-]+,[a-z]+:[a-z0-9-]+$/.test(h)), 'opens /size/ with the pair');
});

test('related size links point only at size pages that exist', () => {
  for (const rel of sizePages) {
    for (const a of doc(rel).querySelectorAll('.vs-related a')) {
      const target = path.posix.join(path.posix.dirname(rel), `${a.getAttribute('href')}.html`);
      assert.ok(files.has(target), `${rel} → ${a.getAttribute('href')} has no size page`);
    }
  }
});

test('every vs-page has a compact size section after its spec table; it links the size page iff one exists', () => {
  for (const rel of vsPages) {
    const d = doc(rel);
    const sec = d.querySelector('section.vs-size#size');
    assert.ok(sec, `${rel}: no size section`);
    assert.ok(sec.previousElementSibling.classList.contains('vs-card'), `${rel}: size section must follow the spec table`);
    assert.ok(sec.querySelector('.size-sentence') && sec.querySelector('.size-fig'), `${rel}: drawing or sentence missing`);
    assert.equal(sec.querySelector('.size-table'), null, `${rel}: the compact section has no table`);
    assert.equal(sec.querySelector('.size-layout'), null);
    const more = sec.querySelector('.size-more a');
    if (files.has(toSize(rel))) {
      assert.equal(more && more.getAttribute('href'), `../size/${path.basename(rel, '.html')}`, `${rel}: wrong size link`);
    } else {
      assert.equal(more, null, `${rel}: links a size page that does not exist`);
    }
  }
});

test('/size/ is the cross-brand tool, size first, loading every brand and size.js before the engine', () => {
  const html = files.get('size/index.html');
  assert.ok(html.includes(`<title>${SIZE_HUB_TITLE}</title>`));
  assert.match(html, /sizeFirst:\s*true/);
  assert.ok(html.includes(`<link rel="canonical" href="${site.baseUrl}/size/">`));
  const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]);
  for (const b of brandDirs()) assert.ok(srcs.includes(`../${b}/data.js`), `/size/ must load ${b}/data.js`);
  assert.ok(srcs.indexOf('../size.js') !== -1 && srcs.indexOf('../size.js') < srcs.indexOf('../engine.js'));
});

test('/size/ links every size page (so none is an orphan)', () => {
  const hrefs = new Set([...doc('size/index.html').querySelectorAll('.seo-links a')].map(a => a.getAttribute('href')));
  for (const rel of sizePages) {
    const clean = rel.replace(/\.html$/, '');
    const href = clean.startsWith('size/') ? clean.slice('size/'.length) : `../${clean}`;
    assert.ok(hrefs.has(href), `/size/ does not link ${clean}`);
  }
});

test('every page that loads engine.js loads size.js first', () => {
  for (const rel of ['index.html', 'compare/index.html', 'size/index.html', ...brandDirs().map(b => `${b}/index.html`)]) {
    const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]);
    const engine = srcs.findIndex(s => /(^|\/)engine\.js$/.test(s));
    const size = srcs.findIndex(s => /(^|\/)size\.js$/.test(s));
    assert.ok(engine !== -1, `${rel}: expected engine.js`);
    assert.ok(size !== -1 && size < engine, `${rel}: size.js must load before engine.js`);
  }
});

test('homepage: the size card sits after the brand cards and before the intro', () => {
  const html = files.get('index.html');
  const pos = ['class="brand-grid"', 'class="size-hub-card" href="./size/"', 'class="landing-intro"'].map(n => {
    const i = html.indexOf(n);
    assert.ok(i !== -1, `missing: ${n}`);
    return i;
  });
  assert.deepEqual(pos, [...pos].sort((a, b) => a - b));
});
