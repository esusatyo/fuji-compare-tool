// Tier 2 — split burst rows (maxBurstMech / maxBurstElec) and hideWhenEmpty.
// Cameras that carry the split fields show "Burst (Mechanical)" and
// "Burst (Electronic)"; cameras that don't yet keep the legacy "Max Burst
// Speed" row. Each row exists only when a selected camera has a value for it.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand } = require('../helpers/load-brand');
const { setSlot } = require('../helpers/dom');

function rows(window) {
  // Row labels currently rendered, as an object so `'label' in r` reads naturally.
  const out = {};
  for (const el of window.document.querySelectorAll('.spec-row .spec-label')) out[el.textContent.trim()] = true;
  return out;
}

function pickCameras(data) {
  const cams = Object.entries(data.CAMERAS);
  const split = cams.filter(([, c]) => 'maxBurstMech' in c && c.maxBurstMech != null && c.maxBurstElecCrop);
  const legacy = cams.filter(([, c]) => !('maxBurstMech' in c) && c.maxBurst);
  return { split: split.map(([id]) => id), legacy: legacy.map(([id]) => id) };
}

test('split cameras only: two burst rows, no legacy row', () => {
  const { window, data } = loadBrand('fujifilm', { engine: true });
  const { split } = pickCameras(data);
  assert.ok(split.length >= 3, 'need 3 split Fujifilm cameras');
  split.slice(0, 3).forEach((id, i) => setSlot(window, i, id));
  const r = rows(window);
  assert.ok('Burst (Mechanical)' in r, 'mechanical row present');
  assert.ok('Burst (Electronic)' in r, 'electronic row present');
  assert.ok(!('Max Burst Speed' in r), 'legacy row hidden when no selected camera needs it');
  const elec = window.document.body.innerHTML;
  const c = data.CAMERAS[split[0]];
  assert.ok(elec.includes(`${c.maxBurstElec} fps (${c.maxBurstElecCrop}× crop)`), 'crop factor rendered with the electronic rate');
});

test('mixed selection: split rows and legacy row side by side', () => {
  const { window, data } = loadBrand('fujifilm', { engine: true });
  const { split, legacy } = pickCameras(data);
  assert.ok(legacy.length >= 1, 'need a legacy Fujifilm camera');
  [split[0], split[1], legacy[0]].forEach((id, i) => setSlot(window, i, id));
  const r = rows(window);
  assert.ok('Burst (Mechanical)' in r && 'Burst (Electronic)' in r && 'Max Burst Speed' in r);
});

test('legacy cameras only: just the single row', () => {
  const { window, data } = loadBrand('fujifilm', { engine: true });
  const { legacy } = pickCameras(data);
  legacy.slice(0, 3).forEach((id, i) => setSlot(window, i, id));
  const r = rows(window);
  assert.ok('Max Burst Speed' in r);
  assert.ok(!('Burst (Mechanical)' in r) && !('Burst (Electronic)' in r));
});

test('winner on the electronic row compares the numbers, ignoring the crop note', () => {
  const { window, engine, data } = loadBrand('fujifilm', { engine: true });
  const ids = ['x-t5', 'x-h2s', 'x-t50'].filter(id => data.CAMERAS[id]);
  assert.equal(ids.length, 3);
  ids.forEach((id, i) => setSlot(window, i, id));
  const spec = engine.SPEC_SECTIONS.flatMap(s => s.specs).find(s => s.key === 'burstElec');
  const vals = ids.map(id => data.CAMERAS[id].maxBurstElec);
  const max = Math.max(...vals);
  assert.deepEqual(Array.from(window.computeWinners(spec)), vals.map(v => v === max));
});

// ── Split battery (batteryLifeLcd / batteryLifeEvf) — same mechanism ──
test('battery: split cameras show screen + viewfinder rows; legacy row only when needed', () => {
  const { window, data } = loadBrand('canon', { engine: true });
  const cams = Object.entries(data.CAMERAS);
  const split = cams.filter(([, c]) => 'batteryLifeLcd' in c && c.batteryLifeEvf != null).map(([id]) => id);
  const legacy = cams.filter(([, c]) => !('batteryLifeLcd' in c) && c.batteryLife != null).map(([id]) => id);
  assert.ok(split.length >= 3 && legacy.length >= 1);

  split.slice(0, 3).forEach((id, i) => setSlot(window, i, id));
  let r = rows(window);
  assert.ok('Battery (Screen, CIPA)' in r && 'Battery (Viewfinder, CIPA)' in r);
  assert.ok(!('Battery Life (CIPA)' in r));

  [split[0], split[1], legacy[0]].forEach((id, i) => setSlot(window, i, id));
  r = rows(window);
  assert.ok('Battery (Screen, CIPA)' in r && 'Battery Life (CIPA)' in r);
});

test('battery: hybrid-finder bodies add an optical-viewfinder row', () => {
  const { window, data } = loadBrand('fujifilm', { engine: true });
  const cams = Object.entries(data.CAMERAS);
  const hybrid = cams.filter(([, c]) => c.batteryLifeOvf != null).map(([id]) => id);
  const legacy = cams.filter(([, c]) => !('batteryLifeLcd' in c) && !('batteryLifeOvf' in c) && c.batteryLife != null).map(([id]) => id);
  assert.ok(hybrid.length >= 2 && legacy.length >= 1);

  [hybrid[0], legacy[0]].forEach((id, i) => setSlot(window, i, id));
  const r = rows(window);
  assert.ok('Battery (Optical VF, CIPA)' in r && 'Battery (Viewfinder, CIPA)' in r && 'Battery Life (CIPA)' in r);
});
