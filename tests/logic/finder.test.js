// Tier 2 — finder.js, the pure parts: derived categories over the real data,
// each filter, sorting, the price rule per currency, the URL grammar, and
// preset validation. The generated pages are tested in tests/data/finder-pages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const Finder = require('../../finder.js');
const KitBuilder = require('../../kit.js');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

const registry = Object.fromEntries(brandDirs().map(b => [b, loadBrand(b).data]));
const cat = KitBuilder.catalogue(registry);
const ctx = (id, item) => ({ id, brand: id.split(':')[0], name: item.name, href: '#' });
const cameras = Object.entries(cat.cameras).map(([id, c]) => Object.assign(Finder.record('cameras', c, ctx(id, c)), { name: c.name }));
const lenses = Object.entries(cat.lenses).map(([id, l]) => Object.assign(Finder.record('lenses', l, ctx(id, l)), { name: l.name }));
const S = (kind, hash) => Finder.parseState(kind, hash);

test('every camera has a sensor format', () => {
  const missing = Object.entries(cat.cameras).filter(([, c]) => !Finder.sensorFormat(c)).map(([id, c]) => `${id} (${c.sensorType})`);
  assert.deepEqual(missing, [], 'add a SENSOR_FORMATS rule for these');
});

test('sensor formats land where the wording says', () => {
  const f = t => Finder.sensorFormat({ sensorType: t });
  assert.equal(f('Full-frame Stacked BSI CMOS'), 'full-frame');
  assert.equal(f('43.8×32.9mm GFX CMOS II'), 'medium-format');
  assert.equal(f('Foveon X3 Quattro (APS-H, 3-layer)'), 'aps-h');
  assert.equal(f('Foveon X3 Quattro (APS-C, 3-layer)'), 'aps-c');
  assert.equal(f('X-Trans CMOS 5 HR'), 'aps-c');
  assert.equal(f('Bayer CMOS EXR'), 'aps-c');
  assert.equal(f('Micro Four Thirds Live MOS'), 'four-thirds');
  assert.equal(f('4/3" Live MOS'), 'four-thirds');
  assert.equal(f('1" Primary Color CMOS'), '1-inch');
  assert.equal(f('1-inch BSI CMOS'), '1-inch');
  assert.equal(f('1/2.3" BSI CMOS'), 'small');
});

test('every lens has a focal range and a focus kind', () => {
  for (const l of lenses) {
    assert.ok(l.fmin > 0 && l.fmax >= l.fmin, `${l.id}: focal range ${l.fmin}-${l.fmax}`);
    assert.ok(['af', 'manual'].includes(l.focus), l.id);
    assert.ok(['prime', 'zoom'].includes(l.type), `${l.id}: type ${l.type}`);
  }
});

test('a teleconverter reading is not part of the focal range', () => {
  assert.deepEqual(Finder.focalRange({ focalLengthEquiv: '150–600mm (210–840mm w/ TC)' }), [150, 600]);
  assert.deepEqual(Finder.focalRange({ focalLengthEquiv: '35mm' }), [35, 35]);
});

test('row attributes round-trip through a dataset', () => {
  const { JSDOM } = require('jsdom');
  for (const [kind, recs] of [['cameras', cameras], ['lenses', lenses]]) {
    for (const rec of recs.slice(0, 40)) {
      const d = new JSDOM(`<table><tr${Finder.rowAttrs(kind, rec)}><th>x</th></tr></table>`).window.document;
      const back = Finder.readRow(kind, d.querySelector('tr').dataset);
      assert.equal(back.id, rec.id);
      for (const key of Object.keys(Finder.FIELDS[kind])) {
        const want = rec[key] === undefined ? null : rec[key];
        if (Finder.FIELDS[kind][key] === 'bool') assert.equal(back[key], !!want, `${rec.id}.${key}`);
        else assert.deepEqual(back[key], want, `${rec.id}.${key}`);
      }
    }
  }
});

test('discontinued items are hidden until asked for', () => {
  const off = Finder.run('cameras', cameras, S('cameras', '')).items;
  assert.ok(off.length > 0 && off.every(r => !r.disc));
  const on = Finder.run('cameras', cameras, S('cameras', '#disc=1')).items;
  assert.equal(on.length, cameras.length);
});

test('combined camera filters: full-frame and at most 500 g', () => {
  const { items } = Finder.run('cameras', cameras, S('cameras', '#sensor=full-frame&maxweight=500&disc=1'));
  assert.ok(items.length > 0);
  assert.ok(items.every(r => r.sensor === 'full-frame' && r.weight <= 500));
  const expected = cameras.filter(r => r.sensor === 'full-frame' && r.weight <= 500).length;
  assert.equal(items.length, expected);
});

test('a mount choice matches interchangeable bodies only', () => {
  const { items } = Finder.run('cameras', cameras, S('cameras', '#mount=x&disc=1'));
  assert.ok(items.length > 0);
  assert.ok(items.every(r => r.mount === 'x' && r.lens === 'interchangeable'), 'an X100 is not an X-mount body');
});

test('yes filters and minimums', () => {
  const { items } = Finder.run('cameras', cameras, S('cameras', '#ibis=1&sealed=1&evf=1&minmp=40&since=2023&disc=1'));
  assert.ok(items.length > 0);
  assert.ok(items.every(r => r.ibis && r.sealed && r.evf && r.mp >= 40 && r.year >= 2023));
});

test('zoom overlap: 30–40mm matches a 24–70mm zoom and a 35mm prime, not an 85mm', () => {
  const st = S('lenses', '#focal=30-40&disc=1');
  const def = { fmin: 24, fmax: 70, disc: false, prices: {} };
  const pass = rec => Finder.matches('lenses', Object.assign({}, def, rec), st);
  assert.ok(pass({ fmin: 24, fmax: 70 }));
  assert.ok(pass({ fmin: 35, fmax: 35 }));
  assert.ok(!pass({ fmin: 85, fmax: 85 }));
  assert.ok(pass({ fmin: 40, fmax: 40 }), 'edges are inclusive');
  // Open-ended ranges.
  assert.ok(Finder.matches('lenses', Object.assign({}, def, { fmin: 400, fmax: 600 }), S('lenses', '#focal=300-')));
  assert.ok(!Finder.matches('lenses', Object.assign({}, def, { fmin: 14, fmax: 14 }), S('lenses', '#focal=300-')));
});

test('lens filters over the real data', () => {
  const { items } = Finder.run('lenses', lenses, S('lenses', '#mount=e&type=prime&maxaperture=1.8&focus=af'));
  assert.ok(items.length > 10);
  assert.ok(items.every(r => r.mount === 'e' && r.type === 'prime' && r.aperture <= 1.8 && r.focus === 'af'));
  const f67 = Finder.run('lenses', lenses, S('lenses', '#filter=67&disc=1')).items;
  assert.ok(f67.length > 0 && f67.every(r => r.filter === 67));
});

test('price rule: no price in the currency hides the item only while price is used, and is counted', () => {
  const a = { id: 'a', name: 'A', year: 2024, weight: 1, disc: false, prices: { USD: 900, AUD: 1500 } };
  const b = { id: 'b', name: 'B', year: 2024, weight: 1, disc: false, prices: { USD: 800 } };
  const recs = [a, b];
  // No price filter or sort: both listed.
  assert.equal(Finder.run('cameras', recs, S('cameras', '#cur=AUD')).items.length, 2);
  // Price filter in AUD: B has no AUD price → hidden and counted.
  let r = Finder.run('cameras', recs, S('cameras', '#cur=AUD&maxprice=2000'));
  assert.deepEqual(r.items.map(x => x.id), ['a']);
  assert.equal(r.noPrice, 1);
  // Price sort alone also hides it.
  r = Finder.run('cameras', recs, S('cameras', '#cur=AUD&sort=price'));
  assert.deepEqual(r.items.map(x => x.id), ['a']);
  assert.equal(r.noPrice, 1);
  // In USD both have prices.
  r = Finder.run('cameras', recs, S('cameras', '#sort=price'));
  assert.deepEqual(r.items.map(x => x.id), ['b', 'a']);
  assert.equal(r.noPrice, 0);
  // An item over the limit is filtered, not counted as missing a price.
  r = Finder.run('cameras', recs, S('cameras', '#maxprice=850'));
  assert.deepEqual(r.items.map(x => x.id), ['b']);
  assert.equal(r.noPrice, 0);
  // Never converted.
  assert.equal(Finder.priceText(b, 'AUD'), '—');
  assert.equal(Finder.priceText(a, 'AUD'), 'A$1,500');
  assert.equal(Finder.priceText({ prices: { JPY: 300000 } }, 'JPY'), '¥300,000');
  assert.equal(Finder.priceText({ pre: true, prices: {} }, 'USD'), 'Not announced');
});

test('the hidden-price note names the currency', () => {
  assert.equal(Finder.summary('cameras', 3, 10, 2, 'AUD').note, '2 cameras hidden: no AUD price. Switch to USD to see more.');
  assert.equal(Finder.summary('lenses', 1, 10, 1, 'USD').note, '1 lens hidden: no USD price.');
  assert.equal(Finder.summary('lenses', 10, 10, 0, 'USD').head, 'Showing all 10 lenses');
  assert.equal(Finder.summary('cameras', 98, 232, 0, 'USD').head, 'Showing 98 of 232 cameras');
});

test('sorting: natural direction, missing values last, stable ties', () => {
  const recs = [
    { id: 'a', name: 'A', year: 2020, weight: 500, mp: 24, prices: {} },
    { id: 'b', name: 'B', year: 2024, weight: 400, mp: 61, prices: {} },
    { id: 'c', name: 'C', year: 2022, weight: null, mp: 33, prices: {} },
  ];
  const ids = st => Finder.sortItems('cameras', recs, S('cameras', st)).map(r => r.id);
  assert.deepEqual(ids(''), ['b', 'c', 'a'], 'default: newest first');
  assert.deepEqual(ids('#sort=weight'), ['b', 'a', 'c'], 'missing weight last');
  assert.deepEqual(ids('#sort=mp'), ['b', 'c', 'a']);
  assert.deepEqual(ids('#sort=name'), ['a', 'b', 'c']);
});

test('URL grammar round-trips and drops bad input', () => {
  const hash = '#brand=sony,nikon&sensor=full-frame&maxprice=2000&maxweight=500&ibis=1&sort=weight&cur=AUD&disc=1';
  assert.equal(Finder.formatState('cameras', S('cameras', hash)), hash);
  const lensHash = '#mount=e&type=prime&focal=24-35&maxaperture=1.8&focus=af&filter=67&sort=price';
  assert.equal(Finder.formatState('lenses', S('lenses', lensHash)), lensHash);
  assert.equal(Finder.formatState('cameras', S('cameras', '')), '');
  // Unknown keys, bad numbers, unknown sort/currency: ignored.
  const st = S('cameras', '#bogus=1&maxweight=heavy&sort=nope&cur=XYZ&minmp=-5');
  assert.deepEqual(st, Finder.emptyState());
  // A reversed range is put right; a single number means exactly that length.
  assert.deepEqual(S('lenses', '#focal=70-24').filters.focal, [24, 70]);
  assert.deepEqual(S('lenses', '#focal=50').filters.focal, [50, 50]);
  assert.deepEqual(S('lenses', '#focal=-35').filters.focal, [null, 35]);
  // Percent-encoding is tolerated.
  assert.deepEqual(S('lenses', '#maker=Voigtl%C3%A4nder').filters.maker, ['Voigtländer']);
});

test('presets: valid ones become states; misconfigured ones throw naming the fault', () => {
  const st = Finder.presetState('cameras', { slug: 'lightest-full-frame', title: 'T', filters: { sensor: 'full-frame' }, sort: 'weight', limit: 25 });
  assert.deepEqual(st.filters, { sensor: ['full-frame'] });
  assert.equal(st.sort, 'weight');
  assert.deepEqual(Finder.presetState('cameras', { slug: 'x', title: 'T', filters: { brand: ['sony', 'nikon'], maxprice: 1500 } }).filters,
    { brand: ['sony', 'nikon'], maxprice: 1500 });
  assert.throws(() => Finder.presetState('cameras', { slug: 'x', title: 'T', filters: { colour: 'red' } }), /"x".*unknown filter "colour"/);
  assert.throws(() => Finder.presetState('cameras', { slug: 'x', title: 'T', sort: 'fastest' }), /unknown sort "fastest"/);
  assert.throws(() => Finder.presetState('cameras', { slug: 'x', title: 'T', filters: { maxweight: 'light' } }), /invalid value for "maxweight"/);
  assert.throws(() => Finder.presetState('cameras', { slug: 'Bad Slug', title: 'T' }), /slug/);
  assert.throws(() => Finder.presetState('cameras', { slug: 'index', title: 'T' }), /reserved/);
  assert.throws(() => Finder.presetState('cameras', { slug: 'x' }), /no title/);
  assert.throws(() => Finder.presetState('cameras', { slug: 'x', title: 'T', limit: 0 }), /limit/);
});
