// Tier 1 — the generated finder pages (/cameras/, /lenses/) and preset list
// pages: every item once in the served HTML, row attributes that agree with
// the data, links that resolve, head and sitemap. Reads the generator's
// output (seo.test.js proves the committed files match it).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const Finder = require('../../finder.js');
const KitBuilder = require('../../kit.js');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { buildSite, siteConfig, FINDER_TITLE } = require('../../scripts/generate-seo');

const { files } = buildSite();
const site = siteConfig();
const brands = Object.fromEntries(brandDirs().map(b => [b, loadBrand(b).data]));
const cat = KitBuilder.catalogue(brands);
const doc = rel => new JSDOM(files.get(rel)).window.document;
const sitemap = files.get('sitemap.xml');
const rowsOf = rel => [...doc(rel).querySelectorAll('#finder-rows tr')];

test('/cameras/: every camera exactly once, linked to its brand page', () => {
  const rows = rowsOf('cameras/index.html');
  const ids = rows.map(r => r.dataset.id);
  assert.equal(new Set(ids).size, ids.length, 'a camera is listed twice');
  assert.deepEqual([...ids].sort(), Object.keys(cat.cameras).sort());
  for (const tr of rows) {
    const [brand, slug] = tr.dataset.id.split(':');
    const a = tr.querySelector('th a');
    assert.equal(a.getAttribute('href'), `../${brand}/#cameras=${slug}`);
    assert.ok(a.textContent.endsWith(brands[brand].CAMERAS[slug].name), `${tr.dataset.id}: link text "${a.textContent}"`);
  }
});

test('/cameras/: row attributes agree with the data', () => {
  for (const tr of rowsOf('cameras/index.html')) {
    const [brand, slug] = tr.dataset.id.split(':');
    const cam = brands[brand].CAMERAS[slug];
    const rec = Finder.readRow('cameras', tr.dataset);
    assert.equal(rec.brand, brand);
    assert.equal(rec.year, cam.year);
    assert.equal(rec.weight, cam.weight);
    assert.equal(rec.mp, cam.sensorMP);
    assert.equal(rec.sensor, Finder.sensorFormat(cam));
    assert.equal(rec.disc, !!cam.discontinued);
    assert.equal(rec.ibis, !!cam.ibis);
    assert.equal(rec.sealed, !!cam.weatherSealed);
    assert.equal(rec.lens, cam.lensType === 'Fixed' ? 'fixed' : 'interchangeable');
    for (const c of Finder.CURRENCIES) {
      const want = typeof cam.prices[c] === 'number' && cam.prices[c] > 0 ? cam.prices[c] : undefined;
      assert.equal(rec.prices[c], want, `${tr.dataset.id} ${c}`);
    }
    // The static price cell is the USD price, never converted.
    assert.equal(tr.querySelector('.finder-price').textContent, Finder.priceText(rec, 'USD'));
    assert.equal(!!tr.querySelector('.mount-disc'), !!cam.discontinued);
  }
});

test('/cameras/: a Leica M rangefinder counts as having a viewfinder; a rear-screen-only body does not', () => {
  const rec = id => Finder.readRow('cameras', rowsOf('cameras/index.html').find(r => r.dataset.id === id).dataset);
  assert.equal(rec('leica:m11').evf, true);
  assert.equal(rec('fujifilm:x-m5').evf, false);
  assert.equal(rec('sony:a7-iv').evf, true);
});

test('/cameras/: every filter choice offered is one the data has', () => {
  const d = doc('cameras/index.html');
  const recs = rowsOf('cameras/index.html').map(r => Finder.readRow('cameras', r.dataset));
  for (const box of d.querySelectorAll('#finder-form input[type="checkbox"]')) {
    const def = Finder.FILTERS.cameras.find(f => f.key === box.name);
    if (!def || def.type !== 'choice') continue;
    assert.ok(recs.some(r => String(r[def.field]) === box.value), `${box.name}=${box.value} matches nothing`);
  }
  // Every filter key has a control.
  for (const def of Finder.FILTERS.cameras) {
    assert.ok(d.querySelector(`#finder-form [name="${def.key}"]`), `no control for ${def.key}`);
  }
  // The form waits for the script.
  assert.ok(d.getElementById('finder-form').hasAttribute('hidden'));
});

test('/cameras/: head, canonical and sitemap entry', () => {
  const html = files.get('cameras/index.html');
  assert.ok(html.includes(`<title>${FINDER_TITLE.cameras}</title>`));
  assert.ok(html.includes(`<link rel="canonical" href="${site.baseUrl}/cameras/">`));
  assert.ok(!html.includes('noindex'));
  assert.ok(sitemap.includes(`<loc>${site.baseUrl}/cameras/</loc>`));
  assert.match(html, /<script defer src="\.\.\/finder\.js"><\/script>/);
  // No engine and no brand data: the rows are the data.
  assert.ok(!/engine\.js|data\.js/.test(html));
});

test('/lenses/: every lens exactly once (shared-mount copies folded), linked to a brand page lens tool', () => {
  const rows = rowsOf('lenses/index.html');
  const ids = rows.map(r => r.dataset.id);
  assert.equal(new Set(ids).size, ids.length, 'a lens is listed twice');
  assert.equal(ids.length, Object.keys(cat.lenses).length, 'lens count');
  // Each row is one catalogue lens: its id is that lens or one of its copies.
  const kept = new Set(ids.map(id => cat.canonical[id]));
  assert.equal(kept.size, ids.length, 'two rows are copies of one lens');
  for (const tr of rows) {
    const [brand, slug] = tr.dataset.id.split(':');
    const lens = brands[brand].LENSES[slug];
    assert.ok(lens, `${tr.dataset.id} is not a lens`);
    const a = tr.querySelector('th a');
    assert.equal(a.getAttribute('href'), `../${brand}/#lenses=${slug}`);
    assert.ok(a.textContent.endsWith(lens.name), `${tr.dataset.id}: link text "${a.textContent}"`);
    const rec = Finder.readRow('lenses', tr.dataset);
    assert.equal(rec.mount, lens.mount);
    assert.equal(rec.maker, lens.manufacturer);
    assert.equal(rec.aperture, lens.maxAperture);
    assert.equal(rec.weight, lens.weight);
    assert.equal(rec.type, lens.type.toLowerCase());
    assert.equal(rec.focus, lens.afType === 'Manual' ? 'manual' : 'af');
    assert.equal(rec.filter, typeof lens.filterThread === 'number' ? lens.filterThread : null);
    assert.equal(rec.disc, !!lens.discontinued);
  }
});

test('/lenses/: a lens stored in several brand files is one row', () => {
  const rows = rowsOf('lenses/index.html').map(r => r.dataset.id);
  const shared = Object.values(cat.canonical).filter((v, i, a) => a.indexOf(v) !== i);
  assert.ok(shared.length > 0, 'the data has shared-mount lenses');
  for (const kept of new Set(shared)) {
    const allCopies = Object.keys(cat.canonical).filter(c => cat.canonical[c] === kept);
    assert.equal(allCopies.filter(c => rows.includes(c)).length, 1, `${kept}: not listed exactly once`);
  }
});

test('/lenses/: controls for every filter, head and sitemap', () => {
  const d = doc('lenses/index.html');
  for (const def of Finder.FILTERS.lenses) {
    const name = def.type === 'range' ? 'focal-from' : def.key;
    assert.ok(d.querySelector(`#finder-form [name="${name}"]`), `no control for ${def.key}`);
  }
  const html = files.get('lenses/index.html');
  assert.ok(html.includes(`<title>${FINDER_TITLE.lenses}</title>`));
  assert.ok(html.includes(`<link rel="canonical" href="${site.baseUrl}/lenses/">`));
  assert.ok(sitemap.includes(`<loc>${site.baseUrl}/lenses/</loc>`));
  assert.ok(!d.getElementById('finder-compare'), 'no compare bar for lenses');
});
