// Tier 2 — Dropdown pickers, mode toggle, and brand switcher behaviour.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { loadBrand, brandDirs, ROOT } = require('../helpers/load-brand');
const { setSlot, clickMode, selectBrand, slotSelect } = require('../helpers/dom');

function optionsOf(select) {
  return [...select.querySelectorAll('option')];
}

// jsdom doesn't apply external stylesheets during render, so the mobile-hide
// rule can't be exercised by loading a real page — this parses engine.css
// with jsdom's own CSSOM (real CSS parsing, not text matching) and checks
// the rule directly. Below the mobile breakpoint the viewport already
// clamps to 2 slots regardless of slotChoice (see effectiveSlots in
// engine.js), so the dropdown has nothing left to offer there and should
// be hidden — along with the whole label cell that holds it — on every page.
test('Compare label cell (and its slot-count dropdown) is hidden below the mobile breakpoint', () => {
  const css = fs.readFileSync(path.join(ROOT, 'engine.css'), 'utf8');
  const dom = new JSDOM('<style></style>');
  const styleEl = dom.window.document.querySelector('style');
  styleEl.textContent = css;
  const mediaRule = [...styleEl.sheet.cssRules]
    .find(r => r.media && r.conditionText && r.conditionText.includes('599px'));
  assert.ok(mediaRule, 'mobile breakpoint media query not found in engine.css');
  const rule = [...mediaRule.cssRules].find(r => r.selectorText === '.compare-label-cell');
  assert.ok(rule, '.compare-label-cell has no rule inside the mobile media query');
  assert.equal(rule.style.display, 'none');
  // With the label column gone from the header, the spec rows must drop it
  // too or the value columns stop lining up under the slots.
  const grid = [...mediaRule.cssRules].find(r => r.selectorText === '.compare-grid, .spec-row');
  assert.ok(grid, 'header grid and spec rows must share one mobile column template');
  // jsdom's CSSOM has no gridTemplateColumns accessor, so read the text.
  assert.match(grid.style.cssText, /grid-template-columns/);
  assert.doesNotMatch(grid.style.cssText, /label-w/);
});

for (const brand of brandDirs()) {
  test(`[${brand}] renders four slot pickers in cameras mode, three visible by default`, () => {
    const { window } = loadBrand(brand, { engine: true });
    assert.equal(window.document.querySelectorAll('.slot-select').length, 4);
    const visible = [...window.document.querySelectorAll('.compare-slot')]
      .filter(s => s.style.display !== 'none');
    assert.equal(visible.length, 3);
  });

  test(`[${brand}] selected camera in a slot is disabled in the other slots`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const defaults = data.BRAND_CONFIG.cameras.defaultSelected;
    // slot-0's selection should be disabled as an option in slot-1.
    const slot0Id = slotSelect(window, 0).value;
    const slot1Options = optionsOf(slotSelect(window, 1));
    const opt = slot1Options.find(o => o.value === slot0Id);
    assert.ok(opt, `slot-1 has no option for ${slot0Id}`);
    assert.ok(opt.disabled, `slot-0's selection (${slot0Id}) should be disabled in slot-1`);
    assert.ok(defaults.includes(slot0Id));
  });

  test(`[${brand}] changing a slot updates dedup in siblings`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const ids = Object.keys(data.CAMERAS);
    const fresh = ids.find(id => !data.BRAND_CONFIG.cameras.defaultSelected.includes(id));
    setSlot(window, 0, fresh);
    // Now `fresh` should be disabled in slot-1 and slot-2.
    for (const i of [1, 2]) {
      const opt = optionsOf(slotSelect(window, i)).find(o => o.value === fresh);
      assert.ok(opt.disabled, `${fresh} should be disabled in slot-${i} after selecting it in slot-0`);
    }
  });

  test(`[${brand}] every dropdown option maps to a real item`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    for (const opt of optionsOf(slotSelect(window, 0))) {
      assert.ok(data.CAMERAS[opt.value], `option "${opt.value}" not in CAMERAS`);
    }
  });

  test(`[${brand}] mode toggle switches cameras <-> lenses`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    clickMode(window, 'lenses');

    assert.equal(window.document.getElementById('header-title').textContent,
      data.BRAND_CONFIG.lenses.headerTitle);
    // Slot options are now lenses.
    const optVals = optionsOf(slotSelect(window, 0)).map(o => o.value);
    assert.ok(optVals.every(v => data.LENSES[v]), 'lens-mode options should be lenses');
    // A lens-only section label should now be present.
    const labels = [...window.document.querySelectorAll('.section-title')].map(e => e.textContent);
    assert.ok(labels.includes('Optical Design'), 'expected lens spec section "Optical Design"');

    clickMode(window, 'cameras');
    const back = optionsOf(slotSelect(window, 0)).map(o => o.value);
    assert.ok(back.every(v => data.CAMERAS[v]), 'switching back should restore cameras');
  });

  test(`[${brand}] only this brand's spec sections render`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const labels = [...window.document.querySelectorAll('.section-title')].map(e => e.textContent);
    if (data.BRAND_CONFIG.brandSections.includes('fujifilm')) {
      assert.ok(labels.includes('Film Simulations'));
    } else {
      assert.ok(!labels.includes('Film Simulations'), 'non-Fuji brand should not show Film Simulations');
    }
    if (data.BRAND_CONFIG.brandSections.includes('canon')) {
      assert.ok(labels.includes('Dual Pixel AF'));
    } else {
      assert.ok(!labels.includes('Dual Pixel AF'), 'non-Canon brand should not show Dual Pixel AF');
    }
  });

  test(`[${brand}] brand switcher is a dropdown listing every registered brand`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const sel = window.document.getElementById('brand-switcher');
    if (data.REGISTERED_BRANDS.length <= 1) {
      assert.equal(sel, null, 'single-brand build should not render a switcher');
      return;
    }
    assert.ok(sel, 'brand-switcher dropdown missing');
    assert.equal(sel.tagName, 'SELECT');
    const optVals = optionsOf(sel).map(o => o.value).sort();
    // '__compare' is the cross-brand entry point, listed above the brands.
    const expected = ['__compare', ...data.REGISTERED_BRANDS.map(b => b.slug)].sort();
    assert.deepEqual(optVals, expected, 'dropdown should list every registered brand plus All brands');
    assert.equal(sel.value, brand, 'current brand should be pre-selected');
  });

  test(`[${brand}] brand switcher persists choice and targets the right path`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const other = data.REGISTERED_BRANDS.map(b => b.slug).find(s => s !== brand);
    if (!other) return; // single-brand build, nothing to switch to

    // Selecting sets localStorage before attempting navigation (which jsdom
    // can't perform — that error is filtered by the loader).
    selectBrand(window, other);
    assert.equal(window.localStorage.getItem('brand'), other);
  });

  test(`[${brand}] "Compare" dropdown offers 2–4, defaults to 3`, () => {
    const { window } = loadBrand(brand, { engine: true });
    const sel = window.document.getElementById('slot-count-select');
    assert.ok(sel, 'slot-count-select missing on a brand page');
    assert.deepEqual(optionsOf(sel).map(o => o.value), ['2', '3', '4'],
      'brand pages offer up to 4 slots, like the compare page');
    assert.equal(sel.value, '3', 'brand pages default to 3 visible slots');
    const label = window.document.querySelector('label[for="slot-count-select"]');
    assert.equal(label.textContent, 'Compare');
  });

  test(`[${brand}] choosing 2 in the dropdown hides the third slot`, () => {
    const { window } = loadBrand(brand, { engine: true });
    const sel = window.document.getElementById('slot-count-select');
    sel.value = '2';
    sel.dispatchEvent(new window.Event('change', { bubbles: true }));
    const slot2 = window.document.getElementById('slot-2');
    assert.equal(slot2.style.display, 'none');
    const row = window.document.querySelector('.spec-row');
    assert.equal(row.querySelectorAll('.spec-value').length, 2,
      'table should only render 2 value columns once 2 is chosen');
  });

  // Brands declare three defaults, so the fourth slot is filled by the engine.
  test(`[${brand}] choosing 4 shows a fourth, distinct item`, () => {
    const { window, data } = loadBrand(brand, { engine: true });
    const sel = window.document.getElementById('slot-count-select');
    sel.value = '4';
    sel.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(window.document.getElementById('slot-3').style.display, '');
    const row = window.document.querySelector('.spec-row');
    assert.equal(row.querySelectorAll('.spec-value').length, 4);
    const ids = [0, 1, 2, 3].map(i => slotSelect(window, i).value);
    assert.equal(new Set(ids).size, 4, `expected four distinct items, got ${ids.join(', ')}`);
    assert.equal(window.location.hash, `#cameras=${ids.join(',')}`);
    // The engine-filled fourth stays in slot 0's mount whenever that mount has
    // a free item (Sigma's L-Mount doesn't: three bodies, all defaults).
    const mountOf = id => data.CAMERAS[id].mount;
    const inFirstMount = Object.keys(data.CAMERAS).filter(id => mountOf(id) === mountOf(ids[0]));
    if (inFirstMount.length >= 4) {
      assert.equal(mountOf(ids[3]), mountOf(ids[0]), `${ids[3]} should share ${ids[0]}'s mount`);
    }
  });

  // Visible pickers don't disable the hidden fourth slot's item, so it can be
  // picked — and revealing that slot must not then show it twice.
  test(`[${brand}] picking the hidden slot's item, then showing 4, has no duplicate`, () => {
    const { window } = loadBrand(brand, { engine: true });
    const hiddenItem = slotSelect(window, 3).value;
    setSlot(window, 0, hiddenItem);
    const sel = window.document.getElementById('slot-count-select');
    sel.value = '4';
    sel.dispatchEvent(new window.Event('change', { bubbles: true }));
    const ids = [0, 1, 2, 3].map(i => slotSelect(window, i).value);
    assert.equal(ids[0], hiddenItem);
    assert.equal(new Set(ids).size, 4, `expected four distinct items, got ${ids.join(', ')}`);
  });
}
