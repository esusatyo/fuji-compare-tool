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

// ── Preset list pages ──
const { finderModel, finderPresets, presetPageHTML, mountModel } = require('../../scripts/generate-seo');
const model = finderModel(brands, mountModel(brands));

for (const kind of ['cameras', 'lenses']) {
  for (const preset of (site.finderPresets || {})[kind] || []) {
    const rel = `${kind}/${preset.slug}.html`;
    test(`${rel}: exactly the finder's own answer to the saved search`, () => {
      assert.ok(files.has(rel), `${rel} not generated`);
      // Recompute from the finder page's rows, not from the generator's model.
      const recs = rowsOf(`${kind}/index.html`).map(tr => Object.assign(Finder.readRow(kind, tr.dataset), { name: tr.querySelector('th a').textContent }));
      let want = Finder.run(kind, recs, Finder.presetState(kind, preset)).items.map(r => r.id);
      if (preset.limit) want = want.slice(0, preset.limit);
      const got = [...doc(rel).querySelectorAll('tbody tr')].map(tr => tr.dataset.id);
      assert.deepEqual(got, want);
      assert.ok(got.length > 0);
      // Ranks 1..n, and the price cells in the preset's currency.
      const cur = preset.currency || 'USD';
      [...doc(rel).querySelectorAll('tbody tr')].forEach((tr, i) => {
        assert.equal(tr.querySelector('.finder-rank').textContent, String(i + 1));
        assert.equal(tr.querySelector('.finder-price').textContent, Finder.priceText(Finder.readRow(kind, tr.dataset), cur));
      });
    });

    test(`${rel}: linked from the finder, indexable, in the sitemap, and links back to the same search`, () => {
      const html = files.get(rel);
      assert.ok(doc(`${kind}/index.html`).querySelector(`.finder-presets a[href="${preset.slug}"]`), 'not linked from the finder');
      assert.ok(html.includes(`<link rel="canonical" href="${site.baseUrl}/${kind}/${preset.slug}">`));
      assert.ok(!html.includes('noindex'));
      assert.ok(html.includes(`<title>${preset.title.replace(/&/g, '&amp;')}</title>`));
      assert.ok(sitemap.includes(`<loc>${site.baseUrl}/${kind}/${preset.slug}</loc>`));
      const edit = doc(rel).querySelector('main .mount-links a');
      assert.ok(edit, 'no link back to the finder');
      assert.equal(edit.getAttribute('href'), `./${Finder.formatState(kind, Finder.presetState(kind, preset))}`);
      assert.ok(!html.includes('finder.js'), 'preset pages are static');
    });
  }
}

test('a preset added to the config produces a page; removing it removes the page', () => {
  const fixture = { ...site, finderPresets: { cameras: [{ slug: 'sony-under-1000g', title: 'Sony Cameras Under 1 kg', filters: { brand: 'sony', maxweight: 1000 }, sort: 'weight' }], lenses: [{ slug: 'fast-e-primes', title: 'Fast E-Mount Primes', filters: { mount: 'e', type: 'prime', maxaperture: 1.4 }, sort: 'aperture', limit: 10 }] } };
  const presets = finderPresets(fixture, model);
  assert.equal(presets.cameras.length, 1);
  assert.ok(presets.cameras[0].rows.every(r => r.rec.brand === 'sony' && r.rec.weight <= 1000 && !r.rec.disc));
  assert.equal(presets.lenses[0].rows.length, 10);
  assert.ok(presets.lenses[0].rows.every(r => r.rec.mount === 'e' && r.rec.aperture <= 1.4));
  const html = presetPageHTML(fixture, presets.lenses[0], presets.lenses);
  assert.match(html, /<title>Fast E-Mount Primes<\/title>/);
  assert.equal(new JSDOM(html).window.document.querySelectorAll('tbody tr').length, 10);
  assert.deepEqual(finderPresets({ ...site, finderPresets: {} }, model), { cameras: [], lenses: [] });
});

test('a misconfigured preset stops the build with a message naming it', () => {
  const run = cameras => () => finderPresets({ ...site, finderPresets: { cameras } }, model);
  assert.throws(run([{ slug: 'x', title: 'X', filters: { colour: 'red' } }]), /"x".*unknown filter "colour"/);
  assert.throws(run([{ slug: 'x', title: 'X', sort: 'fastest' }]), /"x".*unknown sort/);
  assert.throws(run([{ slug: 'x', title: 'X' }, { slug: 'x', title: 'Y' }]), /"x" is used twice/);
  assert.throws(run([{ slug: 'x', title: 'X', filters: { maxweight: 1 } }]), /"x": matches nothing/);
  assert.throws(() => finderPresets({ ...site, finderPresets: { bodies: [] } }, model), /unknown kind "bodies"/);
});

// ── Links to the finders ──
test('the homepage links both finders, after the mount links and before the size card', () => {
  const html = files.get('index.html');
  const pos = ['Browse by lens mount', 'href="./cameras/"', 'href="./lenses/"', 'class="size-hub-card" href="./size/"'].map(n => html.indexOf(n));
  assert.ok(pos.every(i => i !== -1), 'a section is missing');
  assert.deepEqual(pos, [...pos].sort((a, b) => a - b));
  const d = doc('index.html');
  assert.equal(d.querySelector('a[href="./cameras/"]').dataset.goatcounterClick, 'finder-hub:home:cameras');
  assert.equal(d.querySelector('a[href="./lenses/"]').dataset.goatcounterClick, 'finder-hub:home:lenses');
});

test('every generated page and the engine footer link both finders', () => {
  const fs = require('fs');
  const path = require('path');
  const { ROOT } = require('../helpers/load-brand');
  for (const [rel, html] of files) {
    if (!rel.endsWith('.html')) continue;
    const footer = (html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
    if (!footer) continue; // the engine renders this page's footer (checked below)
    const prefix = '../'.repeat(rel.split('/').length - 1) || './';
    assert.ok(footer.includes(`href="${prefix}cameras/"`), `${rel}: footer has no camera finder link`);
    assert.ok(footer.includes(`href="${prefix}lenses/"`), `${rel}: footer has no lens finder link`);
  }
  const engine = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');
  assert.ok(engine.includes('<a href="../cameras/">Camera finder</a>') && engine.includes('<a href="../lenses/">Lens finder</a>'));
});
