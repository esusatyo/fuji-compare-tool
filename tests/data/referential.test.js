// Tier 1 — Cross-reference integrity: the checks that catch the silent
// drift you can't see by eyeballing a single object.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

function idsFromGroups(groups) {
  return groups.flatMap(g => g.ids);
}

for (const brand of brandDirs()) {
  // engine:true so we can reach MANUFACTURER_COLORS + SPEC_SECTIONS.
  const { data, engine } = loadBrand(brand, { engine: true });
  const cameraIds = Object.keys(data.CAMERAS);
  const lensIds = Object.keys(data.LENSES);

  test(`[${brand}] every dropdown camera id exists in CAMERAS (no orphans)`, () => {
    const dropdownIds = idsFromGroups(data.DROPDOWN_GROUPS);
    const missing = dropdownIds.filter(id => !data.CAMERAS[id]);
    assert.deepEqual(missing, [], `dropdown ids not in CAMERAS: ${missing.join(', ')}`);

    const dupes = dropdownIds.filter((id, i) => dropdownIds.indexOf(id) !== i);
    assert.deepEqual(dupes, [], `camera ids appear in multiple dropdown groups: ${dupes.join(', ')}`);

    const unlisted = cameraIds.filter(id => !dropdownIds.includes(id));
    assert.deepEqual(unlisted, [], `cameras missing from dropdown groups: ${unlisted.join(', ')}`);
  });

  test(`[${brand}] CAMERA_ORDER matches CAMERAS exactly`, () => {
    const missing = data.CAMERA_ORDER.filter(id => !data.CAMERAS[id]);
    assert.deepEqual(missing, [], `CAMERA_ORDER ids not in CAMERAS: ${missing.join(', ')}`);
    const unordered = cameraIds.filter(id => !data.CAMERA_ORDER.includes(id));
    assert.deepEqual(unordered, [], `cameras missing from CAMERA_ORDER: ${unordered.join(', ')}`);
    assert.equal(new Set(data.CAMERA_ORDER).size, data.CAMERA_ORDER.length, 'CAMERA_ORDER has duplicates');
  });

  test(`[${brand}] every dropdown lens id exists in LENSES (no orphans)`, () => {
    const dropdownIds = idsFromGroups(data.LENS_DROPDOWN_GROUPS);
    const missing = dropdownIds.filter(id => !data.LENSES[id]);
    assert.deepEqual(missing, [], `lens dropdown ids not in LENSES: ${missing.join(', ')}`);

    const dupes = dropdownIds.filter((id, i) => dropdownIds.indexOf(id) !== i);
    assert.deepEqual(dupes, [], `lens ids appear in multiple dropdown groups: ${dupes.join(', ')}`);

    const unlisted = lensIds.filter(id => !dropdownIds.includes(id));
    assert.deepEqual(unlisted, [], `lenses missing from dropdown groups: ${unlisted.join(', ')}`);
  });

  test(`[${brand}] defaultSelected ids all resolve`, () => {
    for (const id of data.BRAND_CONFIG.cameras.defaultSelected) {
      assert.ok(data.CAMERAS[id], `default camera "${id}" not in CAMERAS`);
    }
    for (const id of data.BRAND_CONFIG.lenses.defaultSelected) {
      assert.ok(data.LENSES[id], `default lens "${id}" not in LENSES`);
    }
  });

  test(`[${brand}] every camera series has a SERIES_COLORS entry`, () => {
    const seriesSet = new Set(Object.values(data.CAMERAS).map(c => c.series));
    const missing = [...seriesSet].filter(s => !data.SERIES_COLORS[s]);
    assert.deepEqual(missing, [], `series without a SERIES_COLORS entry: ${missing.join(', ')}`);
  });

  test(`[${brand}] every lens manufacturer has a MANUFACTURER_COLORS entry`, () => {
    const makers = new Set(Object.values(data.LENSES).map(l => l.manufacturer));
    const missing = [...makers].filter(m => !engine.MANUFACTURER_COLORS[m]);
    assert.deepEqual(missing, [], `manufacturers without a colour entry: ${missing.join(', ')}`);
  });

  test(`[${brand}] brandSections map to real spec sections`, () => {
    const sectionBrands = new Set(engine.SPEC_SECTIONS.filter(s => s.brand).map(s => s.brand));
    for (const bs of data.BRAND_CONFIG.brandSections) {
      assert.ok(sectionBrands.has(bs), `brandSection "${bs}" has no matching SPEC_SECTIONS entry`);
    }
  });
}
