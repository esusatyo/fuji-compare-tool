// Tier 1 — the generated lens-mount pages (/mount/<slug>), their index, and
// the links to them from the homepage and brand pages. Reads the generator's
// output (the freshness test in seo.test.js proves the committed files match).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { buildSite, siteConfig, mountSlug, MOUNT_INDEX_TITLE } = require('../../scripts/generate-seo');

const { files } = buildSite();
const site = siteConfig();
const brands = Object.fromEntries(brandDirs().map(b => [b, loadBrand(b).data]));
const doc = rel => new JSDOM(files.get(rel)).window.document;
const sitemap = files.get('sitemap.xml');

// Every mount any brand declares, with its label.
const declared = new Map();
for (const data of Object.values(brands)) {
  for (const m of data.BRAND_CONFIG.mounts || []) declared.set(m.id, m);
}
const lensesOf = id => {
  const names = new Set();
  for (const data of Object.values(brands)) for (const l of Object.values(data.LENSES)) if (l.mount === id) names.add(l.name);
  return names;
};
const bodiesOf = id => Object.entries(brands).flatMap(([b, data]) =>
  Object.entries(data.CAMERAS).filter(([, c]) => c.mount === id && c.lensType !== 'Fixed').map(([s, c]) => ({ b, s, c })));
const withMount = [...declared.values()].filter(m => lensesOf(m.id).size);
const pageOf = m => `mount/${mountSlug(m.label)}.html`;

test('slugs name the mount, never the sensor format', () => {
  assert.equal(mountSlug('L-Mount'), 'l-mount');
  assert.equal(mountSlug('E-Mount'), 'e-mount');
  assert.equal(mountSlug('Micro Four Thirds'), 'micro-four-thirds-mount');
  for (const m of declared.values()) assert.match(mountSlug(m.label), /^[a-z0-9-]+-mount$/, m.label);
});

test('a page exists for exactly the mounts that have lenses', () => {
  const pages = [...files.keys()].filter(f => /^mount\/[^/]+\.html$/.test(f) && f !== 'mount/index.html').sort();
  assert.deepEqual(pages, withMount.map(pageOf).sort());
  assert.ok(files.has('mount/micro-four-thirds-mount.html'));
  assert.ok(!files.has('mount/sa-mount.html'), 'Sigma SA has no lenses and gets no page');
});

for (const m of withMount) {
  const rel = pageOf(m);
  test(`${rel}: every body and every lens of the mount, each lens once`, () => {
    const d = doc(rel);
    const [camTable, ...lensTables] = d.querySelectorAll('main table');
    const camRows = [...camTable.querySelectorAll('tbody tr')];
    const bodies = bodiesOf(m.id);
    assert.equal(camRows.length, bodies.length, 'camera count');
    for (const { b, s } of bodies) {
      assert.ok(camTable.querySelector(`a[href="../${b}/#cameras=${s}"]`), `${b}:${s} missing`);
    }
    const lensNames = lensTables.flatMap(t => [...t.querySelectorAll('tbody th')].map(th => th.textContent.replace(/Discontinued$/, '').trim()));
    const expected = lensesOf(m.id);
    assert.equal(lensNames.length, expected.size, 'lens count');
    assert.equal(new Set(lensNames).size, lensNames.length, 'a lens is listed twice');
    for (const name of expected) {
      assert.ok(lensNames.some(n => n === name || n.endsWith(` ${name}`)), `${name} missing`);
    }
  });

  test(`${rel}: discontinued items marked, fixed-lens cameras absent, jump list resolves`, () => {
    const d = doc(rel);
    const html = files.get(rel);
    for (const data of Object.values(brands)) {
      for (const [s, c] of Object.entries(data.CAMERAS)) {
        if (c.mount === m.id && c.lensType === 'Fixed') assert.ok(!html.includes(`#cameras=${s}"`), `fixed-lens ${s} listed`);
      }
    }
    const camRows = [...d.querySelectorAll('main table')[0].querySelectorAll('tbody tr')];
    const nDisc = bodiesOf(m.id).filter(x => x.c.discontinued).length;
    assert.equal(camRows.filter(r => r.querySelector('.mount-disc')).length, nDisc);
    // Current bodies come before discontinued ones.
    const firstDisc = camRows.findIndex(r => r.querySelector('.mount-disc'));
    if (firstDisc !== -1) assert.ok(camRows.slice(firstDisc).every(r => r.querySelector('.mount-disc')));
    for (const a of d.querySelectorAll('.mount-jump a')) {
      assert.ok(d.getElementById(a.getAttribute('href').slice(1)), `jump target ${a.getAttribute('href')} missing`);
    }
  });

  test(`${rel}: every lens name opens a brand page's lens tool on that lens`, () => {
    const links = [...doc(rel).querySelectorAll('main table')].slice(1).flatMap(t => [...t.querySelectorAll('tbody th a')]);
    assert.equal(links.length, lensesOf(m.id).size, 'every lens row has a link');
    for (const a of links) {
      const match = /^\.\.\/([a-z]+)\/#lenses=([a-z0-9-]+)$/.exec(a.getAttribute('href'));
      assert.ok(match, `unexpected lens link ${a.getAttribute('href')}`);
      const lens = brands[match[1]] && brands[match[1]].LENSES[match[2]];
      assert.ok(lens, `${match[1]}:${match[2]} is not a lens in that brand file`);
      assert.equal(lens.mount, m.id);
      assert.ok(a.textContent.endsWith(lens.name), `link text "${a.textContent}" is not ${lens.name}`);
      assert.match(a.dataset.goatcounterClick, /^mount-lens:/);
      const row = a.closest('tr');
      const col = [...row.closest('table').querySelectorAll('thead th')].findIndex(th => th.textContent === 'Announced');
      assert.ok(col > 0, 'lens table has an Announced column');
      assert.equal(row.children[col].textContent, String(lens.year), `${lens.name}: Announced is not its year`);
    }
  });

  test(`${rel}: head, canonical and sitemap entry`, () => {
    const html = files.get(rel);
    const url = `${site.baseUrl}/mount/${mountSlug(m.label)}`;
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    assert.ok(!html.includes('noindex'));
    assert.match(html, /<title>[^<]+Cameras and Lenses/);
    assert.ok(sitemap.includes(`<loc>${url}</loc>`));
  });
}

test('/mount/ links every mount page, and nothing else under /mount/', () => {
  const html = files.get('mount/index.html');
  assert.ok(html.includes(`<title>${MOUNT_INDEX_TITLE}</title>`));
  assert.ok(sitemap.includes(`<loc>${site.baseUrl}/mount/</loc>`));
  const hrefs = [...doc('mount/index.html').querySelectorAll('.mount-grid a')].map(a => a.getAttribute('href')).sort();
  assert.deepEqual(hrefs, withMount.map(m => mountSlug(m.label)).sort());
});

test('homepage: the mount links sit after the brand cards and before the size card', () => {
  const html = files.get('index.html');
  const pos = ['class="brand-grid"', 'Browse by lens mount', 'class="size-hub-card" href="./size/"'].map(n => html.indexOf(n));
  assert.ok(pos.every(i => i !== -1), 'a section is missing');
  assert.deepEqual(pos, [...pos].sort((a, b) => a - b));
  const hrefs = [...doc('index.html').querySelectorAll('.mount-grid a')].map(a => a.getAttribute('href')).sort();
  assert.deepEqual(hrefs, withMount.map(m => `./mount/${mountSlug(m.label)}`).sort());
  for (const a of doc('index.html').querySelectorAll('.mount-grid a')) assert.match(a.dataset.goatcounterClick, /^mount-pick:home:/);
});

test('each brand page links the pages of the mounts it declares', () => {
  for (const [b, data] of Object.entries(brands)) {
    const html = files.get(`${b}/index.html`);
    for (const m of data.BRAND_CONFIG.mounts || []) {
      const href = `href="../mount/${mountSlug(m.label)}"`;
      if (lensesOf(m.id).size) assert.ok(html.includes(href), `${b} does not link ${m.label}`);
      else assert.ok(!html.includes(href), `${b} links ${m.label}, which has no page`);
    }
  }
});
