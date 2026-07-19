// ─────────────────────────────────────────────
// COMPARE-PAGE LOADER
//
// Boots the REAL compare/index.html in jsdom: the page's own HTML
// (including its inline window.COMPARE_CONFIG script) is evaluated
// as-is, then the scripts its <script src> tags reference are run in
// document order from disk (jsdom doesn't fetch external resources).
// This keeps the tests pinned to the actual page, not a replica.
// ─────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { ROOT } = require('./load-brand');

const NAV_NOT_IMPLEMENTED = /Not implemented: navigation/;

/**
 * @param {object} [opts]
 * @param {string} [opts.hash='']   initial location hash
 * @param {number} [opts.width]     viewport width (default jsdom's 1024)
 * @param {object} [opts.config]    override window.COMPARE_CONFIG fields
 * @returns {{ window, engine, errors, dom }}
 */
function loadCompare(opts = {}) {
  const { hash = '', width, config } = opts;
  const html = fs.readFileSync(path.join(ROOT, 'compare', 'index.html'), 'utf8');

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e));

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: `https://example.test/compare/${hash}`,
    virtualConsole: vc,
    pretendToBeVisual: true,
  });
  const { window } = dom;
  if (width !== undefined) {
    Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true });
  }
  if (config) Object.assign(window.COMPARE_CONFIG, config);

  // Execute the page's local <script src> files in document order.
  for (const tag of window.document.querySelectorAll('script[src]')) {
    const src = tag.getAttribute('src');
    if (!src.startsWith('../')) continue; // external (analytics) — skipped
    const abs = path.join(ROOT, 'compare', src);
    const code = fs.readFileSync(abs, 'utf8');
    const isEngine = src.endsWith('engine.js') && !src.includes('data');
    const shim = isEngine
      ? `\n;window.__ENGINE__ = { CURRENCY, MANUFACTURER_COLORS, SPEC_SECTIONS, LENS_SPEC_SECTIONS, MODE_CONFIG,
           effectiveSlots, parseHash, amazonBuyUrl, brandNameOf, brandOf, seriesColor, sectionVisible };`
      : '';
    const s = window.document.createElement('script');
    s.textContent = code + shim;
    window.document.body.appendChild(s);
  }

  const realErrors = errors.filter(e => !NAV_NOT_IMPLEMENTED.test(String(e && e.message)));
  if (realErrors.length) {
    throw new Error(`Script error loading compare page:\n${realErrors.map(e => e.stack || e).join('\n')}`);
  }
  return { window, engine: window.__ENGINE__, errors, dom };
}

module.exports = { loadCompare };
