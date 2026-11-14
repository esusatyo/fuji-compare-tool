// ─────────────────────────────────────────────
// KEY SPECS (key-specs.js) — the shared definitions behind the key-spec
// tiles: how each value is worded, which one is marked better, and the
// markup. Pure functions, required directly.
// ─────────────────────────────────────────────
const test = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const KeySpecs = require('../../key-specs.js');

const ALL = ['sensor', 'video', 'stabilization', 'burst', 'price'];
const cam = (over = {}) => ({
  sensorMP: 40.2, sensorType: 'X-Trans CMOS 5 HR', maxVideoRes: '6.2K / 30P',
  ibis: true, ibisStops: 7, maxBurst: 15, prices: { USD: 1999, AUD: 2649 }, ...over,
});
const entries = (...cams) => cams.map((item, i) => ({ name: `Cam ${i + 1}`, item }));
const tile = (tiles, id) => tiles.find(t => t.id === id);
const better = t => t.rows.map(r => r.better);

test('list: reads the recorded ids from a SITE_CONFIG-shaped object, tolerating its absence', () => {
  assert.deepEqual(KeySpecs.list({ keySpecs: { cameras: ['price', 'sensor'] } }, 'cameras'), ['price', 'sensor']);
  assert.deepEqual(KeySpecs.list({ keySpecs: {} }, 'cameras'), []);
  assert.deepEqual(KeySpecs.list({}, 'cameras'), []);
  assert.deepEqual(KeySpecs.list(undefined, 'cameras'), []);
});

test('has: only defined ids', () => {
  for (const id of ALL) assert.equal(KeySpecs.has('cameras', id), true, id);
  assert.equal(KeySpecs.has('cameras', 'megazoom'), false);
  assert.equal(KeySpecs.has('lenses', 'sensor'), false);
});

test('tiles: one per id, in the order given, with each item\'s wording', () => {
  const tiles = KeySpecs.tiles('cameras', ALL, entries(cam(), cam({ sensorMP: 26.1, ibis: false, ibisStops: null, maxBurst: 8, prices: { USD: 1499 } })));
  assert.deepEqual(tiles.map(t => t.id), ALL);
  assert.deepEqual(tiles.map(t => t.label), ['Sensor', 'Max video', 'Stabilization', 'Burst', 'Price (USD)']);
  assert.deepEqual(tile(tiles, 'sensor').rows.map(r => r.value), ['40.2 MP', '26.1 MP']);
  assert.equal(tile(tiles, 'sensor').rows[0].note, 'X-Trans CMOS 5 HR');
  assert.deepEqual(tile(tiles, 'stabilization').rows.map(r => r.value), ['7 stops', 'None']);
  assert.deepEqual(tile(tiles, 'burst').rows.map(r => r.value), ['15 fps', '8 fps']);
  assert.deepEqual(tile(tiles, 'price').rows.map(r => r.value), ['$1,999', '$1,499']);
  assert.deepEqual(tile(tiles, 'sensor').rows.map(r => r.name), ['Cam 1', 'Cam 2']);
  const reordered = KeySpecs.tiles('cameras', ['price', 'sensor'], entries(cam(), cam()));
  assert.deepEqual(reordered.map(t => t.id), ['price', 'sensor']);
});

test('tiles: the better value is marked — higher for sensor, stops and burst; lower for price', () => {
  const tiles = KeySpecs.tiles('cameras', ALL, entries(cam(), cam({ sensorMP: 26.1, ibisStops: 5, maxBurst: 30, prices: { USD: 1499 } })));
  assert.deepEqual(better(tile(tiles, 'sensor')), [true, false]);
  assert.deepEqual(better(tile(tiles, 'stabilization')), [true, false]);
  assert.deepEqual(better(tile(tiles, 'burst')), [false, true]);
  assert.deepEqual(better(tile(tiles, 'price')), [false, true]);
});

test('tiles: video is shown and never ranked', () => {
  const tiles = KeySpecs.tiles('cameras', ['video'], entries(cam(), cam({ maxVideoRes: '8K / 60P RAW' })));
  assert.deepEqual(tile(tiles, 'video').rows.map(r => r.value), ['6.2K / 30P', '8K / 60P RAW']);
  assert.deepEqual(better(tile(tiles, 'video')), [false, false]);
});

test('tiles: a dead heat marks nobody', () => {
  const tiles = KeySpecs.tiles('cameras', ALL, entries(cam(), cam()));
  for (const t of tiles) assert.deepEqual(better(t), [false, false], t.id);
});

test('tiles: IBIS beats none; an unrated IBIS body is not ranked against a rated one', () => {
  const none = cam({ ibis: false, ibisStops: null });
  const unrated = cam({ ibis: true, ibisStops: null });
  assert.deepEqual(better(tile(KeySpecs.tiles('cameras', ['stabilization'], entries(cam(), none)), 'stabilization')), [true, false]);
  const t = tile(KeySpecs.tiles('cameras', ['stabilization'], entries(cam(), unrated)), 'stabilization');
  assert.deepEqual(t.rows.map(r => r.value), ['7 stops', 'In-body']);
  assert.deepEqual(better(t), [false, false]);
  assert.deepEqual(better(tile(KeySpecs.tiles('cameras', ['stabilization'], entries(none, { ...none })), 'stabilization')), [false, false]);
});

test('tiles: price is ranked only when every item has one', () => {
  const t = tile(KeySpecs.tiles('cameras', ['price'], entries(cam(), cam({ prices: { USD: null } }))), 'price');
  assert.deepEqual(t.rows.map(r => r.value), ['$1,999', null]);
  assert.deepEqual(better(t), [false, false]);
});

test('tiles: currency and formatter are options', () => {
  const t = tile(KeySpecs.tiles('cameras', ['price'], entries(cam(), cam({ prices: { USD: 1499, AUD: 2999 } })),
    { currency: 'AUD', money: n => `A$${n}` }), 'price');
  assert.equal(t.label, 'Price (AUD)');
  assert.deepEqual(t.rows.map(r => r.value), ['A$2649', 'A$2999']);
  assert.deepEqual(better(t), [true, false]);
});

test('tiles: a missing value shows as absent; a tile nobody has a value for is dropped; unknown ids are skipped', () => {
  const noBurst = cam({ maxBurst: null });
  const tiles = KeySpecs.tiles('cameras', ['burst', 'nope', 'sensor'], entries(cam(), noBurst));
  assert.deepEqual(tiles.map(t => t.id), ['burst', 'sensor']);
  assert.deepEqual(tile(tiles, 'burst').rows.map(r => r.value), ['15 fps', null]);
  assert.deepEqual(better(tile(tiles, 'burst')), [true, false], 'the only value there is wins, as in the spec table');
  assert.deepEqual(KeySpecs.tiles('cameras', ['burst'], entries(noBurst, { ...noBurst })), []);
});

test('tiles: one item gets values and no verdict; three items can tie for best', () => {
  const one = KeySpecs.tiles('cameras', ALL, entries(cam()));
  assert.equal(one.length, 5);
  for (const t of one) assert.deepEqual(better(t), [false], t.id);
  const three = KeySpecs.tiles('cameras', ['sensor'], entries(cam(), cam(), cam({ sensorMP: 24 })));
  assert.deepEqual(better(tile(three, 'sensor')), [true, true, false]);
});

test('html: a section of tiles, values escaped, the verdict readable without colour', () => {
  const tiles = KeySpecs.tiles('cameras', ALL, [
    { name: 'A <b>', item: cam() },
    { name: 'B', item: cam({ sensorMP: 26.1, maxBurst: null }) },
  ]);
  const html = KeySpecs.html(tiles);
  const doc = new JSDOM(html).window.document;
  const section = doc.querySelector('section.key-specs');
  assert.ok(section);
  assert.equal(section.querySelector('h2').textContent, 'Key specs');
  assert.deepEqual([...doc.querySelectorAll('.key-tile')].map(t => t.dataset.keySpec), ALL);
  const sensor = doc.querySelector('.key-tile[data-key-spec="sensor"]');
  assert.equal(sensor.querySelector('h3').textContent, 'Sensor');
  assert.deepEqual([...sensor.querySelectorAll('dt')].map(d => d.textContent), ['A <b>', 'B']);
  assert.ok(!html.includes('<b>'), 'names must be escaped');
  const rows = [...sensor.querySelectorAll('.key-row')];
  assert.ok(rows[0].classList.contains('key-better'));
  assert.ok(!rows[1].classList.contains('key-better'));
  assert.match(rows[0].querySelector('dd').textContent, /40\.2 MP \(better\)/);
  assert.doesNotMatch(rows[1].querySelector('dd').textContent, /better/);
  const burst = doc.querySelector('.key-tile[data-key-spec="burst"]');
  assert.equal(burst.querySelectorAll('dd')[1].textContent, '—');
  assert.equal(KeySpecs.html([]), '');
});
