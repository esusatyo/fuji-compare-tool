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
    const expected = vals.map(v => v === max);

    assert.deepEqual(Array.from(window.computeWinners(spec)), expected);
  });

  test(`[${brand}] lowerBetter picks the min (weight)`, () => {
    const { window, engine, data } = loadBrand(brand, { engine: true });
    const ids = Object.keys(data.CAMERAS).slice(0, 3);
    ids.forEach((id, i) => setSlot(window, i, id));

    const spec = findSpec(engine.SPEC_SECTIONS, 'weight');
    const vals = ids.map(id => data.CAMERAS[id].weight);
    const min = Math.min(...vals);
    const expected = vals.map(v => v === min);

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

  test(`[${brand}] ties produce multiple winners`, () => {
    const { window, engine, data } = loadBrand(brand, { engine: true });
    const ids = Object.keys(data.CAMERAS);
    // Same camera in slots 0 and 1 → identical sensorMP → both win.
    setSlot(window, 0, ids[0]);
    setSlot(window, 1, ids[0]);
    setSlot(window, 2, ids[1]);

    const spec = findSpec(engine.SPEC_SECTIONS, 'sensorMP');
    const winners = Array.from(window.computeWinners(spec));
    const sameMP = data.CAMERAS[ids[0]].sensorMP >= data.CAMERAS[ids[1]].sensorMP;
    if (sameMP) {
      assert.equal(winners[0], true);
      assert.equal(winners[1], true);
    }
    // The two identical slots must always agree.
    assert.equal(winners[0], winners[1]);
  });

  test(`[${brand}] winner classes render in the table`, () => {
    const { window } = loadBrand(brand, { engine: true });
    // At least one winner cell should exist for the default selection.
    const winnerCells = window.document.querySelectorAll('.spec-value.winner');
    assert.ok(winnerCells.length > 0, 'expected at least one .winner cell in rendered table');
  });
}
