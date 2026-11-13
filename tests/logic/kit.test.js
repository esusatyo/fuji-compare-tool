// ─────────────────────────────────────────────
// KIT BUILDER MATHS (kit.js) — pure functions, run against the real brand
// data: which lenses fit a body, shared-mount de-duplication, totals, the
// one-currency price rule, focal range, filter sizes, the verdict sentence
// and the URL grammar.
// ─────────────────────────────────────────────
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { brandDirs, ROOT } = require('../helpers/load-brand');
const Kit = require('../../kit.js');

// The registry exactly as the page sees it: every brand's data.js run against
// one window.
function registry() {
  const win = { BRAND_DATA: {} };
  for (const b of brandDirs()) {
    new Function('window', fs.readFileSync(path.join(ROOT, b, 'data.js'), 'utf8'))(win);
  }
  return win.BRAND_DATA;
}
const REG = registry();
const CAT = Kit.catalogue(REG);

const item = (name, weight, prices, extra = {}) => ({ name, weight, prices, ...extra });
const usd = n => `$${n.toLocaleString('en-US')}`;

test('catalogue: every camera is keyed <brand>:<slug>', () => {
  const total = Object.values(REG).reduce((n, d) => n + Object.keys(d.CAMERAS).length, 0);
  assert.equal(Object.keys(CAT.cameras).length, total);
  assert.equal(CAT.cameras['fujifilm:x-t5'].name, 'X-T5');
});

test('catalogue: a lens stored in several brand files is kept once', () => {
  const seen = new Map();
  for (const [id, lens] of Object.entries(CAT.lenses)) {
    const key = `${lens.mount}|${lens.name}`;
    assert.ok(!seen.has(key), `${lens.name} (${lens.mount}) kept twice: ${seen.get(key)} and ${id}`);
    seen.set(key, id);
  }
  // …and every copy still resolves to the kept entry.
  for (const [slug, data] of Object.entries(REG)) {
    for (const [id, lens] of Object.entries(data.LENSES)) {
      const kept = CAT.canonical[`${slug}:${id}`];
      assert.ok(CAT.lenses[kept], `${slug}:${id} has no kept entry`);
      assert.equal(CAT.lenses[kept].name, lens.name);
      assert.equal(CAT.lenses[kept].mount, lens.mount);
    }
  }
});

test('catalogue: the kept copy is the one in the maker\'s own brand file when there is one', () => {
  for (const [id, lens] of Object.entries(CAT.lenses)) {
    const own = Object.keys(REG).find(slug => REG[slug].BRAND_CONFIG.name === lens.manufacturer
      && Object.values(REG[slug].LENSES).some(l => l.name === lens.name && l.mount === lens.mount));
    if (own) assert.equal(id.split(':')[0], own, `${lens.name} should resolve to ${own}:`);
  }
});

test('lensGroups: only the body\'s mount, the body\'s brand first', () => {
  const groups = Kit.lensGroups(CAT, 'x', 'fujifilm');
  const ids = groups.flatMap(g => g.ids);
  assert.ok(ids.length > 100);
  for (const id of ids) assert.equal(CAT.lenses[id].mount, 'x');
  assert.ok(!ids.some(id => CAT.lenses[id].mount === 'g'));
  assert.equal(new Set(ids).size, ids.length, 'no lens listed twice');
  assert.equal(ids[0].split(':')[0], 'fujifilm');
  for (const g of groups) assert.ok(!/─/.test(g.label), `label not stripped: ${g.label}`);
});

test('lensGroups: a Leica L-Mount body is offered Sigma and Panasonic lenses, each once', () => {
  const ids = Kit.lensGroups(CAT, 'l', 'leica').flatMap(g => g.ids);
  const makers = new Set(ids.map(id => CAT.lenses[id].manufacturer));
  for (const maker of ['Leica', 'Sigma', 'Panasonic']) assert.ok(makers.has(maker), `${maker} missing`);
  const names = ids.map(id => CAT.lenses[id].name);
  assert.equal(new Set(names).size, names.length);
  // Every L-Mount lens on the site is reachable from any L-Mount body.
  const allL = Object.values(CAT.lenses).filter(l => l.mount === 'l').length;
  assert.equal(ids.length, allL);
  assert.equal(Kit.lensGroups(CAT, 'l', 'panasonic').flatMap(g => g.ids).length, allL);
});

test('lensGroups: a mount with no lenses yields nothing', () => {
  assert.deepEqual(Kit.lensGroups(CAT, 'sa', 'sigma'), []);
});

test('takesLenses: fixed-lens bodies do not', () => {
  assert.equal(Kit.takesLenses(CAT.cameras['fujifilm:x100vi']), false);
  assert.equal(Kit.takesLenses(CAT.cameras['fujifilm:x-t5']), true);
  assert.equal(Kit.takesLenses(undefined), false);
});

test('sanitize: drops what cannot be in the kit', () => {
  const xLenses = Kit.lensGroups(CAT, 'x', 'fujifilm').flatMap(g => g.ids);
  const gLens = Kit.lensGroups(CAT, 'g', 'fujifilm')[0].ids[0];
  const [a, b] = xLenses;
  assert.deepEqual(
    Kit.sanitize({ body: 'fujifilm:x-t5', lenses: [a, 'fujifilm:nope', gLens, a, b] }, CAT),
    { body: 'fujifilm:x-t5', lenses: [a, b] });
  assert.deepEqual(Kit.sanitize({ body: 'fujifilm:nope', lenses: [a] }, CAT), { body: null, lenses: [] });
  assert.deepEqual(Kit.sanitize({ body: 'fujifilm:x100vi', lenses: [a] }, CAT), { body: 'fujifilm:x100vi', lenses: [] });
  assert.equal(Kit.sanitize({ body: 'fujifilm:x-t5', lenses: xLenses.slice(0, 20) }, CAT).lenses.length, Kit.MAX_LENSES);
});

test('sanitize: any brand file\'s copy of a shared lens resolves to the kept one', () => {
  const dup = Object.entries(CAT.canonical).find(([id, kept]) => id !== kept && CAT.lenses[kept].mount === 'l');
  assert.ok(dup, 'expected a duplicated L-Mount lens');
  const [copy, kept] = dup;
  assert.deepEqual(Kit.sanitize({ body: 'leica:sl3', lenses: [copy, kept] }, CAT).lenses, [kept]);
});

test('priceView: the chosen currency when every priced item has it', () => {
  const items = [item('A', 1, { USD: 100, AUD: 150 }), item('B', 1, { USD: 50, AUD: 80 })];
  assert.deepEqual(Kit.priceView(items, 'AUD'), { currency: 'AUD', fallback: false, missing: [] });
});

test('priceView: US dollars for everything when one item lacks it, and it is named', () => {
  const items = [item('A', 1, { USD: 100, AUD: 150 }), item('B', 1, { USD: 50, AUD: null })];
  assert.deepEqual(Kit.priceView(items, 'AUD'), { currency: 'USD', fallback: true, missing: ['B'] });
});

test('priceView: an unpriced item does not force the fallback', () => {
  const items = [item('A', 1, { USD: 100, AUD: 150 }), item('Soon', 1, { USD: null, AUD: null })];
  assert.equal(Kit.priceView(items, 'AUD').currency, 'AUD');
  assert.equal(Kit.priceView(items, 'USD').fallback, false);
});

test('totals: weight and price are the sums of the rows', () => {
  const items = [item('Body', 557, { USD: 1999 }), item('L1', 180, { USD: 449 }), item('L2', 655, { USD: 1199 })];
  const t = Kit.totals(items, 'USD');
  assert.equal(t.weight, 1392);
  assert.equal(t.price, 3647);
  assert.equal(t.count, 3);
  assert.deepEqual(t.unpriced, []);
});

test('totals: an unpriced item is left out of the price and named; discontinued ones are named', () => {
  const items = [
    item('Body', 500, { USD: 1000 }, { discontinued: true }),
    item('Soon', 300, { USD: null }),
  ];
  const t = Kit.totals(items, 'USD');
  assert.equal(t.weight, 800);
  assert.equal(t.price, 1000);
  assert.deepEqual(t.unpriced, ['Soon']);
  assert.deepEqual(t.discontinued, ['Body']);
  assert.equal(Kit.totals([item('Soon', 300, { USD: null })], 'USD').price, null);
});

test('totals: real data — an X-T5 kit adds up', () => {
  const body = CAT.cameras['fujifilm:x-t5'];
  const lenses = Kit.lensGroups(CAT, 'x', 'fujifilm')[0].ids.slice(0, 2).map(id => CAT.lenses[id]);
  const t = Kit.totals([body, ...lenses], 'USD');
  assert.equal(t.weight, body.weight + lenses[0].weight + lenses[1].weight);
  assert.equal(t.price, body.prices.USD + lenses[0].prices.USD + lenses[1].prices.USD);
});

test('focalRange: spans primes and zooms, ignores a teleconverter reading', () => {
  assert.equal(Kit.focalRange([]), null);
  assert.deepEqual(Kit.focalRange([{ focalLengthEquiv: '35mm' }]), { min: 35, max: 35 });
  assert.deepEqual(Kit.focalRange([
    { focalLengthEquiv: '24-105mm' }, { focalLengthEquiv: '150–600mm (210–840mm w/ TC)' }, { focalLengthEquiv: '12mm' },
  ]), { min: 12, max: 600 });
});

test('focalRange: every lens on the site parses', () => {
  for (const [id, lens] of Object.entries(CAT.lenses)) {
    const r = Kit.focalRange([lens]);
    assert.ok(r && r.min > 0 && r.max >= r.min, `${id}: ${lens.focalLengthEquiv}`);
  }
});

test('filterSizes: distinct, sorted, nulls dropped', () => {
  assert.deepEqual(Kit.filterSizes([{ filterThread: 77 }, { filterThread: 62 }, { filterThread: null }, { filterThread: 77 }]), [62, 77]);
});

test('ounces', () => {
  assert.equal(Kit.ounces(1000), '35.3');
});

test('verdict: lighter and cheaper', () => {
  const a = { weight: 1500, price: 5000, unpriced: [] };
  const b = { weight: 1180, price: 3800, unpriced: [] };
  const v = Kit.verdict(a, b, usd);
  assert.equal(v.text, 'Kit 2 is 320 g lighter and $1,200 cheaper than Kit 1.');
  assert.equal(v.weightWinner, 1);
  assert.equal(v.priceWinner, 1);
});

test('verdict: lighter but more expensive', () => {
  const v = Kit.verdict({ weight: 1000, price: 3000, unpriced: [] }, { weight: 1400, price: 2500, unpriced: [] }, usd);
  assert.equal(v.text, 'Kit 1 is 400 g lighter but $500 more expensive than Kit 2.');
  assert.equal(v.weightWinner, 0);
  assert.equal(v.priceWinner, 1);
});

test('verdict: ties name no winner', () => {
  const same = { weight: 1000, price: 3000, unpriced: [] };
  const v = Kit.verdict(same, { ...same }, usd);
  assert.equal(v.text, 'Both kits weigh the same and cost the same.');
  assert.equal(v.weightWinner, null);
  assert.equal(v.priceWinner, null);
  assert.equal(Kit.verdict(same, { ...same, price: 2000 }, usd).text, 'Kit 2 is $1,000 cheaper than Kit 1; they weigh the same.');
  assert.equal(Kit.verdict(same, { ...same, weight: 900 }, usd).text, 'Kit 2 is 100 g lighter than Kit 1 and costs the same.');
});

test('verdict: price is not compared when a kit left an item out of its total', () => {
  const v = Kit.verdict({ weight: 1000, price: 3000, unpriced: ['Soon'] }, { weight: 1200, price: 9000, unpriced: [] }, usd);
  assert.equal(v.text, 'Kit 1 is 200 g lighter than Kit 2.');
  assert.equal(v.priceWinner, null);
  assert.equal(v.comparable, false);
});

test('hash: round trip', () => {
  const kits = [
    { body: 'fujifilm:x-t5', lenses: ['fujifilm:xf23mm-f2', 'sigma:x'] },
    { body: 'sony:a7-iv', lenses: [] },
  ];
  const hash = Kit.formatHash(kits);
  assert.equal(hash, '#kit=fujifilm:x-t5,fujifilm:xf23mm-f2,sigma:x;sony:a7-iv');
  assert.deepEqual(Kit.parseHash(hash), kits);
});

test('hash: one kit, an empty first kit, and nothing at all', () => {
  const empty = { body: null, lenses: [] };
  assert.equal(Kit.formatHash([{ body: 'sony:a7-iv', lenses: [] }, empty]), '#kit=sony:a7-iv');
  assert.equal(Kit.formatHash([empty, { body: 'sony:a7-iv', lenses: [] }]), '#kit=;sony:a7-iv');
  assert.equal(Kit.formatHash([empty, empty]), '');
  assert.deepEqual(Kit.parseHash('#kit=;sony:a7-iv'), [empty, { body: 'sony:a7-iv', lenses: [] }]);
  assert.deepEqual(Kit.parseHash(''), [empty, empty]);
  assert.deepEqual(Kit.parseHash('#cameras=fujifilm:x-t5'), [empty, empty]);
  assert.equal(Kit.parseHash('#kit=a:b;c:d;e:f').length, 2);
});
