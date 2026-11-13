// Tier 2 — the size drawing (size.js) and the tool's "Size" section.
//
// size.js is one module for the browser and the generator, so the first half
// requires it directly in Node; the second half checks what the engine does
// with it on real pages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { loadBrand } = require('../helpers/load-brand');
const { loadCompare } = require('../helpers/load-compare');
const { loadHome } = require('../helpers/load-home');
const { setSlot, clickMode } = require('../helpers/dom');
const SizeDiagram = require('../../size.js');

const fuji = loadBrand('fujifilm').data;
const xt5 = fuji.CAMERAS['x-t5'];           // 129.5 × 91 × 63.8 mm, 557 g
const x100vi = fuji.CAMERAS['x100vi'];
const x100v = fuji.CAMERAS['x100v'];
const sony = loadBrand('sony').data;
const a7iv = sony.CAMERAS['a7-iv'];         // 131.3 × 96.4 × 79.8 mm, 658 g
const entry = (name, item, color = 'var(--accent-primary)') => ({ name, item, color });
const parse = html => new JSDOM(`<body>${html}</body>`).window.document;
const figs = (doc, layout) => [...doc.querySelectorAll(`.size-views--${layout} .size-fig`)];

// ── the module ──────────────────────────────────────────────────────
test('box: a camera is width × height × depth; a lens is a cylinder', () => {
  assert.deepEqual(SizeDiagram.box(xt5, 'camera'), { w: 129.5, h: 91, d: 63.8, weight: 557 });
  const lens = Object.values(fuji.LENSES)[0];
  assert.deepEqual(SizeDiagram.box(lens, 'lens'),
    { w: lens.diameter, h: lens.diameter, d: lens.length, weight: lens.weight });
});

test('box: a missing dimension means no box (never a guessed one); weight alone may be unknown', () => {
  assert.equal(SizeDiagram.box({ width: 100, height: 60 }, 'camera'), null);
  assert.equal(SizeDiagram.box({ width: 100, height: 60, depth: 0 }, 'camera'), null);
  assert.equal(SizeDiagram.box(null, 'camera'), null);
  assert.deepEqual(SizeDiagram.box({ width: 100, height: 60, depth: 40 }, 'camera'), { w: 100, h: 60, d: 40, weight: null });
});

test('every camera and lens in the catalogue has a box', () => {
  for (const brand of require('../helpers/load-brand').brandDirs()) {
    const d = loadBrand(brand).data;
    for (const [id, c] of Object.entries(d.CAMERAS)) assert.ok(SizeDiagram.box(c, 'camera'), `${brand}:${id}`);
    for (const [id, l] of Object.entries(d.LENSES)) assert.ok(SizeDiagram.box(l, 'lens'), `${brand}:${id}`);
  }
});

test('facts: one sentence, each dimension worded from the first item\'s side', () => {
  const s = SizeDiagram.facts('Fujifilm X-T5', SizeDiagram.box(xt5, 'camera'), 'Sony A7 IV', SizeDiagram.box(a7iv, 'camera'), 'camera');
  assert.equal(s, 'The Fujifilm X-T5 is 1.8 mm narrower, 5.4 mm shorter, 16 mm slimmer and 101 g lighter than the Sony A7 IV.');
  const r = SizeDiagram.facts('Sony A7 IV', SizeDiagram.box(a7iv, 'camera'), 'Fujifilm X-T5', SizeDiagram.box(xt5, 'camera'), 'camera');
  assert.equal(r, 'The Sony A7 IV is 1.8 mm wider, 5.4 mm taller, 16 mm deeper and 101 g heavier than the Fujifilm X-T5.');
});

test('facts: equal dimensions are said to be equal; identical items say so; unknown weight is left out', () => {
  const b = (w, h, d, weight = null) => ({ w, h, d, weight });
  assert.equal(SizeDiagram.facts('A', b(128, 75, 55, 500), 'B', b(128, 75, 53, 480), 'camera'),
    'The A is 2 mm deeper and 20 g heavier than the B, and the same width and height.');
  assert.equal(SizeDiagram.facts('A', b(128, 75, 55, 500), 'B', b(128, 75, 55, 500), 'camera'),
    'The A and the B are the same size and weight.');
  assert.equal(SizeDiagram.facts('A', b(128, 75, 55), 'B', b(128, 75, 55, 500), 'camera'),
    'The A and the B are the same size.');
  assert.equal(SizeDiagram.facts('A', b(120, 75, 55), 'B', b(128, 75, 55, 500), 'camera'),
    'The A is 8 mm narrower than the B, and the same height and depth.');
  assert.equal(SizeDiagram.facts('A', null, 'B', b(1, 1, 1), 'camera'), '');
  // Real pair: the X100VI is the X100V's body, 2 mm deeper.
  assert.match(SizeDiagram.facts('X100VI', SizeDiagram.box(x100vi, 'camera'), 'X100V', SizeDiagram.box(x100v, 'camera'), 'camera'),
    /^The X100VI is 2 mm deeper and \d+ g heavier than the X100V, and the same width and height\.$/);
});

test('facts: lenses talk about diameter and length', () => {
  const l = (diameter, length, weight) => SizeDiagram.box({ diameter, length, weight }, 'lens');
  assert.equal(SizeDiagram.facts('A', l(70, 90, 400), 'B', l(80, 120, 700), 'lens'),
    'The A is 10 mm narrower, 30 mm shorter and 300 g lighter than the B.');
});

test('rows: values per entry, and a signed difference only for exactly two measured items', () => {
  const two = SizeDiagram.rows([entry('X-T5', xt5), entry('A7 IV', a7iv)], 'camera');
  assert.deepEqual(two.map(r => [r.label, r.values, r.diff]), [
    ['Width', [129.5, 131.3], '−1.8 mm'],
    ['Height', [91, 96.4], '−5.4 mm'],
    ['Depth', [63.8, 79.8], '−16 mm'],
    ['Weight', [557, 658], '−101 g'],
  ]);
  const three = SizeDiagram.rows([entry('a', xt5), entry('b', a7iv), entry('c', x100v)], 'camera');
  assert.ok(three.every(r => r.diff === null && r.values.length === 3));
  const same = SizeDiagram.rows([entry('a', x100vi), entry('b', x100v)], 'camera');
  assert.equal(same[0].diff, 'Same');
  assert.deepEqual(SizeDiagram.rows([entry('a', { diameter: 70, length: 90, weight: 400 })], 'lens').map(r => r.label),
    ['Diameter', 'Length', 'Weight']);
});

test('valueHTML: millimetres and grams, imperial in small print', () => {
  assert.equal(SizeDiagram.valueHTML(129.5, 'mm'), '129.5 mm <small>5.10 in</small>');
  assert.equal(SizeDiagram.valueHTML(557, 'g'), '557 g <small>19.6 oz</small>');
  assert.equal(SizeDiagram.valueHTML(null, 'mm'), '—');
});

test('drawing: every outline is its item\'s millimetres, and one total scales them all', () => {
  const doc = parse(SizeDiagram.block({ entries: [entry('X-T5', xt5), entry('A7 IV', a7iv, 'var(--accent-secondary)')] }));
  // Side by side: one figure per item per view, plus the card.
  const side = figs(doc, 'side').map(f => [Number(f.dataset.mmW), Number(f.dataset.mmH)]);
  assert.deepEqual(side, [
    [129.5, 91], [131.3, 96.4], [85.6, 53.98],   // front, front, credit card
    [129.5, 63.8], [131.3, 79.8],                // top
    [63.8, 91], [79.8, 96.4],                    // side
  ]);
  // Overlay: one figure per view, as big as the bigger item, plus the card.
  assert.deepEqual(figs(doc, 'overlay').map(f => [Number(f.dataset.mmW), Number(f.dataset.mmH)]),
    [[131.3, 96.4], [131.3, 79.8], [79.8, 96.4], [85.6, 53.98]]);

  for (const layout of ['overlay', 'side']) {
    const views = doc.querySelector(`.size-views--${layout}`);
    assert.match(views.getAttribute('style'), /--size-total-wide:[\d.]+;--size-total-narrow:[\d.]+/);
    for (const f of figs(doc, layout)) {
      // Width share = its mm (the CSS divides by the one shared total), and
      // the viewBox is the same mm, so height follows at the same scale.
      assert.equal(f.style.getPropertyValue('--mm'), f.dataset.mmW);
      assert.equal(f.querySelector('svg').getAttribute('viewBox'), `0 0 ${f.dataset.mmW} ${f.dataset.mmH}`);
    }
  }
  // Inside an overlay svg each rect is the item's true size, bottom-aligned and centred.
  const front = figs(doc, 'overlay')[0].querySelectorAll('rect');
  const dims = [...front].map(r => ['width', 'height', 'x', 'y'].map(a => Number(r.getAttribute(a))));
  assert.deepEqual(dims, [[131.3, 96.4, 0, 0], [129.5, 91, 0.9, 5.4]]);
});

test('drawing: lenses are a circle and a side outline; no top view', () => {
  const lens = { diameter: 70, length: 90, weight: 400 };
  const doc = parse(SizeDiagram.block({ entries: [entry('L', lens)], kind: 'lens' }));
  const overlay = figs(doc, 'overlay');
  assert.deepEqual(overlay.map(f => f.querySelector('figcaption').textContent), ['Front', 'Side', 'Credit card']);
  const circle = overlay[0].querySelector('ellipse');
  assert.deepEqual(['rx', 'ry'].map(a => Number(circle.getAttribute(a))), [35, 35]);
  assert.deepEqual([Number(overlay[1].dataset.mmW), Number(overlay[1].dataset.mmH)], [90, 70]);
});

test('block: the credit card is ISO ID-1, drawn in every layout', () => {
  assert.deepEqual(SizeDiagram.CARD, { w: 85.6, h: 53.98 });
  const doc = parse(SizeDiagram.block({ entries: [entry('X-T5', xt5)] }));
  assert.equal(doc.querySelectorAll('.size-fig--card').length, 2);
});

test('block: an accessible summary, a legend, and names escaped', () => {
  const doc = parse(SizeDiagram.block({ entries: [entry('X-T5 <b>', xt5), entry('A7 IV', a7iv)] }));
  const stage = doc.querySelector('.size-stage');
  assert.equal(stage.getAttribute('role'), 'img');
  assert.match(stage.getAttribute('aria-label'), /X-T5 <b> 129\.5 × 91 × 63\.8 mm and A7 IV 131\.3 × 96\.4 × 79\.8 mm, with a credit card/);
  assert.deepEqual([...doc.querySelectorAll('.size-legend li')].map(li => li.textContent), ['X-T5 <b>', 'A7 IV']);
  assert.equal(doc.querySelector('.size-legend b'), null);
  assert.ok([...doc.querySelectorAll('svg')].every(s => s.getAttribute('aria-hidden') === 'true'));
});

test('block variants: tool/page carry the switch, table and the references note; compact does not', () => {
  const entries = [entry('X-T5', xt5), entry('A7 IV', a7iv)];
  const full = parse(SizeDiagram.block({ entries, variant: 'page' }));
  assert.deepEqual([...full.querySelectorAll('.size-layout-btn')].map(b => b.dataset.layout), ['overlay', 'side']);
  assert.deepEqual([...full.querySelectorAll('.size-table thead th')].map(th => th.textContent), ['', 'X-T5', 'A7 IV', 'Difference']);
  assert.match(full.querySelector('.size-note').textContent, /maker’s stated outer dimensions.*rounded boxes.*under References/);
  assert.ok(full.querySelector('.size-sentence'));

  const compact = parse(SizeDiagram.block({ entries, variant: 'compact', moreHref: '../size/x-vs-y' }));
  assert.equal(compact.querySelector('.size-layout'), null);
  assert.equal(compact.querySelector('.size-table'), null);
  assert.ok(compact.querySelector('.size-sentence'));
  assert.match(compact.querySelector('.size-note').textContent, /References/);
  assert.equal(compact.querySelector('.size-more a').getAttribute('href'), '../size/x-vs-y');
  assert.equal(parse(SizeDiagram.block({ entries, variant: 'compact' })).querySelector('.size-more'), null);
});

test('block: an item without dimensions is listed in the table and not drawn; none drawable → nothing', () => {
  const doc = parse(SizeDiagram.block({ entries: [entry('X-T5', xt5), entry('Mystery', { name: 'Mystery' })] }));
  assert.equal(figs(doc, 'side').length, 4, 'three views of one camera, plus the card');
  assert.equal(doc.querySelector('.size-sentence'), null);
  const cells = [...doc.querySelectorAll('.size-table tbody tr')].map(tr => tr.querySelectorAll('td')[1].textContent);
  assert.deepEqual(cells, ['—', '—', '—', '—']);
  assert.equal(SizeDiagram.block({ entries: [entry('Mystery', {})] }), '');
});

// ── in the tool ─────────────────────────────────────────────────────
const sizeSection = doc => doc.querySelector('#compare-table .size-section');
const sectionOrder = doc => [...doc.querySelectorAll('#compare-table > .spec-section')]
  .map(s => (s.classList.contains('refs-section') ? 'References' : s.querySelector('.section-title').textContent));

test('[brand] the Size section is the last section before References', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const order = sectionOrder(window.document);
  assert.deepEqual(order.slice(-2), ['Size', 'References']);
  assert.equal(order[0], 'Overview');
  assert.equal(sizeSection(window.document).nextElementSibling.classList.contains('refs-section'), true);
});

test('[brand] it draws the cameras on screen, in column colours, and redraws on a pick', () => {
  const { window, data } = loadBrand('fujifilm', { engine: true });
  const doc = window.document;
  const names = () => [...sizeSection(doc).querySelectorAll('.size-legend li')].map(li => li.textContent);
  const shown = () => Array.from(window.cfg().selectedIds().slice(0, 3), id => data.CAMERAS[id].name);
  assert.deepEqual(names(), shown());
  const swatches = [...sizeSection(doc).querySelectorAll('.size-swatch')];
  // A colour of its own per column — the third is not a repeat of the first.
  assert.deepEqual(swatches.map(s => s.style.color), ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--size-c3)']);
  assert.equal(sizeSection(doc).querySelector('[stroke-dasharray]:not(.size-fig--card *)'), null, 'no dashed outlines for items');

  setSlot(window, 0, 'gfx100-ii');
  assert.deepEqual(names(), shown());
  assert.equal(names()[0], 'GFX100 II');
  const firstFront = sizeSection(doc).querySelector('.size-views--side .size-fig');
  assert.equal(Number(firstFront.dataset.mmW), data.CAMERAS['gfx100-ii'].width);
  // Three cameras: no pairwise sentence, no difference column.
  assert.equal(sizeSection(doc).querySelector('.size-sentence'), null);
  assert.equal(sizeSection(doc).querySelectorAll('.size-table thead th').length, 4);
});

test('[brand] two slots get the sentence and the difference column', () => {
  const { window } = loadBrand('fujifilm', { engine: true, hash: '#cameras=x-t5,x100vi' });
  const sec = sizeSection(window.document);
  assert.match(sec.querySelector('.size-sentence').textContent, /^The X-T5 is .* than the X100VI/);
  assert.equal(sec.querySelector('.size-table thead th:last-child').textContent, 'Difference');
});

test('[brand] lens mode draws lenses', () => {
  const { window, data } = loadBrand('sony', { engine: true });
  clickMode(window, 'lenses');
  const sec = sizeSection(window.document);
  assert.equal(sec.querySelector('.size-diagram').dataset.kind, 'lens');
  assert.deepEqual([...sec.querySelectorAll('.size-table tbody th')].map(th => th.textContent), ['Diameter', 'Length', 'Weight']);
  const first = data.LENSES[window.cfg().selectedIds()[0]];
  assert.equal(Number(sec.querySelector('.size-views--side .size-fig').dataset.mmW), first.diameter);
  clickMode(window, 'cameras');
  assert.equal(sizeSection(window.document).querySelector('.size-diagram').dataset.kind, 'camera');
});

test('[brand] the section collapses like any other and reports it', () => {
  const { window } = loadBrand('fujifilm', { engine: true });
  const calls = [];
  window.trackEvent = p => calls.push(p);
  sizeSection(window.document).querySelector('.section-header').click();
  assert.ok(window.document.getElementById('body-size').classList.contains('collapsed'));
  assert.deepEqual(calls, ['spec-section:size:close']);
});

test('[compare] names carry the brand; the layout switch flips an attribute, survives a re-render, and is counted', () => {
  const { window } = loadCompare();
  const doc = window.document;
  const calls = [];
  window.trackEvent = p => calls.push(p);
  const diagram = () => sizeSection(doc).querySelector('.size-diagram');
  assert.equal(sizeSection(doc).querySelector('.size-legend li').textContent, 'Fujifilm X-T5');
  assert.equal(diagram().dataset.layout, 'auto', 'until chosen, the viewport decides (CSS)');
  assert.equal(diagram().dataset.page, 'compare');

  const side = () => diagram().querySelector('.size-layout-btn[data-layout="side"]');
  side().click();
  assert.equal(diagram().dataset.layout, 'side');
  side().click();
  assert.deepEqual(calls, ['size-view:compare:side'], 'pressing the active layout again is not a change');

  setSlot(window, 0, 'nikon:zf'); // re-renders the table, and the drawing with it
  assert.equal(diagram().dataset.layout, 'side', 'the choice outlives the re-render');
  diagram().querySelector('.size-layout-btn[data-layout="overlay"]').click();
  assert.equal(diagram().dataset.layout, 'overlay');
  assert.deepEqual(calls.filter(c => c.startsWith('size-view')), ['size-view:compare:side', 'size-view:compare:overlay']);
});

test('[home] nothing to draw until a camera is picked; one camera draws alone; empty slots are skipped', () => {
  const home = loadHome();
  const { window } = home;
  const doc = window.document;
  assert.equal(sizeSection(doc), null);
  setSlot(window, 1, 'nikon:zf');
  home.deliverData();
  const sec = sizeSection(doc);
  assert.deepEqual([...sec.querySelectorAll('.size-legend li')].map(li => li.textContent), ['Nikon Zf']);
  // Slot 1 is the second column: it keeps that column's colour.
  assert.equal(sec.querySelector('.size-swatch').style.color, 'var(--accent-secondary)');
  assert.equal(sec.querySelector('.size-sentence'), null);
  assert.equal(sec.querySelector('.size-diagram').dataset.page, 'home');
  assert.deepEqual(sectionOrder(doc).slice(-2), ['Size', 'References']);

  setSlot(window, 0, 'fujifilm:x-t5');
  assert.match(sizeSection(doc).querySelector('.size-sentence').textContent, /^The Fujifilm X-T5 is .* than the Nikon Zf\.$/);
});

test('[/size/] the Size section comes first, and events name the page "size"', () => {
  const { window } = loadCompare({ page: 'size' });
  const doc = window.document;
  const order = sectionOrder(doc);
  assert.equal(order[0], 'Size');
  assert.equal(order[1], 'Overview');
  assert.equal(order[order.length - 1], 'References');
  assert.equal(order.filter(o => o === 'Size').length, 1);
  assert.equal(sizeSection(doc).querySelector('.size-diagram').dataset.page, 'size');
  assert.equal(doc.querySelectorAll('.compare-slot').length, 4);
  assert.equal(window.localStorage.getItem('brand'), null, 'not a brand page');
  // Two cameras by default: the sentence shows at once.
  assert.match(sizeSection(doc).querySelector('.size-sentence').textContent, /^The Fujifilm X-T5 is .* than the Sony A7 IV\.$/);
});

test('[/size/] a shared link restores the pair', () => {
  const { window } = loadCompare({ page: 'size', hash: '#cameras=nikon:zf,fujifilm:x-t5' });
  assert.deepEqual([...sizeSection(window.document).querySelectorAll('.size-legend li')].map(li => li.textContent),
    ['Nikon Zf', 'Fujifilm X-T5']);
});

// ── colours and the legend switches ─────────────────────────────────
test('four items get four different colours, each defined for both themes', () => {
  assert.equal(new Set(SizeDiagram.COLORS).size, 4);
  const css = require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'engine.css'), 'utf8');
  for (const token of ['--size-c3', '--size-c4']) {
    assert.equal((css.match(new RegExp(`^\\s*${token}:\\s*#[0-9A-Fa-f]{6};`, 'gm')) || []).length, 2, `${token}: one per theme block`);
  }
  const { window } = loadCompare({ config: { defaultSlots: 4 } });
  const sec = sizeSection(window.document);
  assert.deepEqual([...sec.querySelectorAll('.size-swatch')].map(s => s.style.color), SizeDiagram.COLORS);
  // Every outline carries its item's colour and index.
  const frontRow = [...sec.querySelectorAll('.size-views--side .size-row')][0];
  assert.deepEqual([...frontRow.querySelectorAll('.size-fig:not(.size-fig--card) rect')].map(r => [r.getAttribute('stroke'), r.dataset.item]),
    SizeDiagram.COLORS.map((c, i) => [c, String(i)]));
});

test('legend names are switches: pressing one hides that item everywhere in the drawing, and again shows it', () => {
  const { window } = loadCompare();
  const doc = window.document;
  const calls = [];
  window.trackEvent = p => calls.push(p);
  const diagram = () => sizeSection(doc).querySelector('.size-diagram');
  const btn = i => diagram().querySelectorAll('.size-legend-btn')[i];
  assert.equal(diagram().querySelectorAll('.size-legend-btn').length, 3);
  assert.ok([0, 1, 2].every(i => btn(i).getAttribute('aria-pressed') === 'true'));
  assert.equal(diagram().dataset.hidden, '');
  // Every drawn outline of item 1 is addressable by the attribute the CSS hides on.
  assert.equal(diagram().querySelectorAll('.size-stage [data-item="1"]').length, 3 + 3 + 3,
    '3 overlay rects, plus 3 side-by-side figures and the rect inside each');

  btn(1).click();
  assert.equal(btn(1).getAttribute('aria-pressed'), 'false');
  assert.equal(diagram().dataset.hidden, '1');
  btn(2).click();
  assert.equal(diagram().dataset.hidden, '1 2');
  // The last one showing stays: an empty drawing helps nobody.
  btn(0).click();
  assert.equal(btn(0).getAttribute('aria-pressed'), 'true');
  assert.equal(diagram().dataset.hidden, '1 2');

  btn(1).click();
  assert.equal(diagram().dataset.hidden, '2');
  assert.deepEqual(calls, ['size-toggle:compare:hide', 'size-toggle:compare:hide', 'size-toggle:compare:show']);
  // The table and the names are untouched — only the drawing changes.
  assert.equal(diagram().querySelectorAll('.size-table thead th').length, 4);
});

test('a hidden item stays hidden through a re-render, and the choice lapses when that item leaves', () => {
  const { window } = loadCompare();
  const doc = window.document;
  const diagram = () => sizeSection(doc).querySelector('.size-diagram');
  const pressed = () => [...diagram().querySelectorAll('.size-legend-btn')].map(b => b.getAttribute('aria-pressed'));
  diagram().querySelectorAll('.size-legend-btn')[1].click(); // hide the Sony A7 IV
  setSlot(window, 0, 'nikon:zf');                            // re-render; the A7 IV is still slot 1
  assert.deepEqual(pressed(), ['true', 'false', 'true']);
  assert.equal(diagram().dataset.hidden, '1');
  setSlot(window, 1, 'nikon:z8');                            // the hidden camera is replaced
  assert.deepEqual(pressed(), ['true', 'true', 'true']);
  assert.equal(diagram().dataset.hidden, '');
});

test('the CSS hides exactly what the attribute names, for all four positions', () => {
  const css = require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'engine.css'), 'utf8');
  for (const i of [0, 1, 2, 3]) {
    assert.ok(css.includes(`.size-diagram[data-hidden~="${i}"] .size-stage [data-item="${i}"]`), `no hide rule for item ${i}`);
  }
});

test('no switches where they would do nothing: a single item, and the script-less vs-page section', () => {
  const one = parse(SizeDiagram.block({ entries: [entry('X-T5', xt5)] }));
  assert.equal(one.querySelector('.size-legend-btn'), null);
  const compact = parse(SizeDiagram.block({ entries: [entry('X-T5', xt5), entry('A7 IV', a7iv)], variant: 'compact' }));
  assert.equal(compact.querySelector('.size-legend-btn'), null);
  assert.equal(compact.querySelectorAll('.size-legend li').length, 2);
  const page = parse(SizeDiagram.block({ entries: [entry('X-T5', xt5), entry('A7 IV', a7iv)], variant: 'page' }));
  assert.equal(page.querySelectorAll('.size-legend-btn').length, 2, 'size pages load size.js, so the legend works there');
});
