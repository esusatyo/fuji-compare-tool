// Tier 1 — the vs-page "Lens mount" row names the mount. It used to print
// lensType, so a Nikon Z body against a Fujifilm X body read "Interchangeable"
// vs "Interchangeable" on the one row a cross-brand buyer most needs.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { buildAll, resolveMatchups, lensMountText } = require('../../scripts/generate-seo');

const brandData = {};
for (const b of brandDirs()) brandData[b] = loadBrand(b).data;
const files = buildAll();

// Every generated vs-page with its two cameras: [file, [{ brand, slug, cam }, …]].
function vsPages() {
  const out = [];
  for (const m of resolveMatchups(brandData)) out.push([m.file, [m.a, m.b]]);
  for (const rel of files.keys()) {
    const hit = rel.match(/^([^/]+)\/vs\/(.+)\.html$/);
    if (!hit) continue;
    const [brand, ids] = [hit[1], hit[2].split('-vs-')];
    assert.equal(ids.length, 2, `${rel}: cannot split into two camera slugs`);
    out.push([rel, ids.map(slug => ({ brand, slug, cam: brandData[brand].CAMERAS[slug] }))]);
  }
  return out;
}

function lensMountCells(html) {
  const d = new JSDOM(html).window.document;
  const row = [...d.querySelectorAll('.vs-card tr')].find(tr => {
    const th = tr.querySelector('th[scope="row"]');
    return th && th.textContent === 'Lens mount';
  });
  return row ? [...row.querySelectorAll('td')].map(td => td.textContent) : null;
}

// A camera's mount for this comparison: its mount id, or none for a fixed lens.
const mountKey = s => (s.cam.lensType === 'Fixed' ? null : `${s.cam.mount}`);

test('no vs-page shows the same lens-mount text for two cameras whose mounts differ', () => {
  const pages = vsPages();
  assert.ok(pages.length > 200, `expected every vs-page (got ${pages.length})`);
  for (const [rel, sides] of pages) {
    const cells = lensMountCells(files.get(rel));
    assert.ok(cells && cells.length === 2, `${rel}: no two-cell "Lens mount" row`);
    const [ka, kb] = sides.map(mountKey);
    if (ka === null && kb === null) continue; // two fixed lenses: no mount to compare
    if (ka !== kb) assert.notEqual(cells[0], cells[1], `${rel}: different mounts read "${cells[0]}" both`);
    else assert.equal(cells[0], cells[1], `${rel}: one mount, two wordings`);
  }
});

test('the cell names the mount label the brand declares, or the fixed lens', () => {
  for (const [rel, sides] of vsPages()) {
    const cells = lensMountCells(files.get(rel));
    sides.forEach((s, i) => {
      if (s.cam.lensType === 'Fixed') {
        assert.ok(cells[i].startsWith('Fixed lens'), `${rel}: ${s.cam.name} is fixed-lens, cell "${cells[i]}"`);
        return;
      }
      const m = brandData[s.brand].BRAND_CONFIG.mounts.find(x => x.id === s.cam.mount);
      assert.ok(cells[i].startsWith(m.label), `${rel}: ${s.cam.name} cell "${cells[i]}", mount label "${m.label}"`);
      assert.notEqual(cells[i], 'Interchangeable', rel);
    });
  }
});

test('lensMountText: label, system, fixed lens with and without lensSpec, unknown mount', () => {
  const fuji = brandData.fujifilm.BRAND_CONFIG;
  assert.equal(lensMountText({ name: 'X-T5', lensType: 'Interchangeable', mount: 'x' }, fuji), 'X-Mount');
  assert.equal(lensMountText({ name: 'GFX100 II', lensType: 'Interchangeable', mount: 'g' }, fuji), 'G-Mount (GFX)');
  assert.equal(lensMountText(brandData.fujifilm.CAMERAS.x100vi, fuji), 'Fixed lens: 23mm f/2 (35mm equiv.)');
  assert.equal(lensMountText({ name: 'Q', lensType: 'Fixed', mount: 'x' }, fuji), 'Fixed lens');
  assert.throws(() => lensMountText({ name: 'Odd', lensType: 'Interchangeable', mount: 'zz' }, fuji), /mount 'zz'/);
});

test('known cross-brand page: Nikon Zf vs Fujifilm X-T5 reads Z-Mount vs X-Mount', () => {
  assert.deepEqual(lensMountCells(files.get('vs/nikon-zf-vs-fujifilm-x-t5.html')), ['Z-Mount', 'X-Mount']);
});
