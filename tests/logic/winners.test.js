// Tier 2 — Winner highlighting logic (computeWinners), driven through the engine.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { setSlot } = require('../helpers/dom');

function findSpec(sections, key) {
  for (const s of sections) {
    const spec = s.specs.find(sp => sp.key === key);
    if (spec) return spec;
  }
  throw new Error(`spec "${key}" not found`);
}

for (const brand of brandDirs()) {
  test(`[${brand}] higherBetter picks the max (sensorMP)`, () => {
    const { window, engine, data } = loadBrand(brand, { engine: true });
    const ids = Object.keys(data.CAMERAS).slice(0, 3);
    ids.forEach((id, i) => setSlot(window, i, id));

    const spec = findSpec(engine.SPEC_SECTIONS, 'sensorMP');
    const vals = ids.map(id => data.CAMERAS[id].sensorMP);
    const max = Math.max(...vals);
    // A dead heat across all three has no winner.
    const expected = vals.every(v => v === max) ? vals.map(() => false) : vals.map(v => v === max);

    assert.deepEqual(Array.from(window.computeWinners(spec)), expected);
  });

  test(`[${brand}] lowerBetter picks the min (weight)`, () => {
    const { window, engine, data } = loadBrand(brand, { engine: true });
    const ids = Object.keys(data.CAMERAS).slice(0, 3);
    ids.forEach((id, i) => setSlot(window, i, id));

    const spec = findSpec(engine.SPEC_SECTIONS, 'weight');
    const vals = ids.map(id => data.CAMERAS[id].weight);
    const min = Math.min(...vals);
    const expected = vals.every(v => v === min) ? vals.map(() => false) : vals.map(v => v === min);

    assert.deepEqual(Array.from(window.computeWinners(spec)), expected);
  });

  test(`[${brand}] text/boolean specs have no winners`, () => {
    const { window, engine, data } = loadBrand(brand, { engine: true });
    const ids = Object.keys(data.CAMERAS).slice(0, 3);
    ids.forEach((id, i) => setSlot(window, i, id));

    const textSpec = findSpec(engine.SPEC_SECTIONS, 'series');
    const boolSpec = findSpec(engine.SPEC_SECTIONS, 'weatherSealed');
    assert.deepEqual(Array.from(window.computeWinners(textSpec)), [false, false, false]);
    assert.deepEqual(Array.from(window.computeWinners(boolSpec)), [false, false, false]);
  });

  test(`[${brand}] a tie for best highlights each of the tied; a dead heat highlights none`, () => {
    const { window, engine, data } = loadBrand(brand, { engine: true });
    const spec = findSpec(engine.SPEC_SECTIONS, 'sensorMP');
    const ids = Object.keys(data.CAMERAS);
    const mp = id => data.CAMERAS[id].sensorMP;
    // The same camera in slots 0 and 1 is a guaranteed tie; slot 2 holds one
    // with fewer megapixels, so the tied pair is strictly ahead of something.
    const top = ids.reduce((a, b) => (mp(b) > mp(a) ? b : a));
    const lower = ids.find(id => mp(id) < mp(top));
    assert.ok(lower, 'fixture: the brand needs two different sensor resolutions');
    setSlot(window, 0, top);
    setSlot(window, 1, top);
    setSlot(window, 2, lower);
    assert.deepEqual(Array.from(window.computeWinners(spec)), [true, true, false]);

    // All three the same: nobody is ahead, so nothing is highlighted.
    setSlot(window, 2, top);
    assert.deepEqual(Array.from(window.computeWinners(spec)), [false, false, false]);
    const row = [...window.document.querySelectorAll('.spec-row')]
      .find(r => r.querySelector('.spec-label').textContent === spec.label);
    assert.equal(row.querySelectorAll('.winner').length, 0);
  });

  test(`[${brand}] winner classes render in the table`, () => {
    const { window } = loadBrand(brand, { engine: true });
    // At least one winner cell should exist for the default selection.
    const winnerCells = window.document.querySelectorAll('.spec-value.winner');
    assert.ok(winnerCells.length > 0, 'expected at least one .winner cell in rendered table');
  });
}
