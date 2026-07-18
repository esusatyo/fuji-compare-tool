// ─────────────────────────────────────────────
// BRAND LOADER
//
// The brand `data.js` files and the shared `engine.js` are plain
// browser scripts that declare top-level `const` globals (CAMERAS,
// BRAND_CONFIG, …). Top-level `const`/`let` live in the script's
// lexical environment, NOT on `window`, so we can't read them from
// Node after the fact. To bridge that, each loaded source is followed
// by a small shim (in the SAME script, so it can see the consts) that
// copies the globals onto `window.__BRAND__` / `window.__ENGINE__`.
//
// This keeps the source files 100% browser-compatible (no exports,
// no test-only hooks) while still being testable from node:test.
// ─────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');

const DATA_GLOBALS = [
  'BRAND_CONFIG', 'SERIES_COLORS', 'CAMERAS', 'CAMERA_ORDER',
  'DROPDOWN_GROUPS', 'LENSES', 'LENS_DROPDOWN_GROUPS', 'REGISTERED_BRANDS',
];
const ENGINE_GLOBALS = [
  'CURRENCY', 'MANUFACTURER_COLORS', 'SPEC_SECTIONS',
  'LENS_SPEC_SECTIONS', 'MODE_CONFIG',
];

// A jsdom navigation attempt (location.href = …) reports this; it is
// expected when exercising the brand switcher and must not fail a load.
const NAV_NOT_IMPLEMENTED = /Not implemented: navigation/;

/** Discover every brand directory (one containing a `data.js`). */
function brandDirs() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, 'data.js')))
    .map(d => d.name)
    .sort();
}

function shimFor(varName, names) {
  return `\n;window.${varName} = { ${names.join(', ')} };`;
}

/**
 * Load a brand into a jsdom window.
 * @param {string} brand      directory name, e.g. 'fujifilm'
 * @param {object} [opts]
 * @param {boolean} [opts.engine=false]      also evaluate engine.js (runs init/render)
 * @param {string}  [opts.hash='']           initial location hash (e.g. '#lenses')
 * @param {boolean} [opts.siteConfig=true]   also evaluate site-config.js (as the real pages do)
 * @param {string}  [opts.html]              boot document; defaults to a body with an #app mount (as real brand pages have)
 * @returns {{ window, data, engine, errors, dom }}
 */
function loadBrand(brand, opts = {}) {
  const {
    engine = false,
    hash = '',
    siteConfig = true,
    html = '<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>',
  } = opts;
  const dataSrc = fs.readFileSync(path.join(ROOT, brand, 'data.js'), 'utf8');

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e));

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: `https://example.test/${brand}/${hash}`,
    virtualConsole: vc,
    pretendToBeVisual: true,
  });
  const { window } = dom;

  if (siteConfig) {
    const siteSrc = fs.readFileSync(path.join(ROOT, 'site-config.js'), 'utf8');
    run(window, siteSrc + shimFor('__SITE__', ['SITE_CONFIG']));
  }
  run(window, dataSrc + shimFor('__BRAND__', DATA_GLOBALS));
  if (engine) {
    const engineSrc = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');
    run(window, engineSrc + shimFor('__ENGINE__', ENGINE_GLOBALS));
  }

  const realErrors = errors.filter(e => !NAV_NOT_IMPLEMENTED.test(String(e && e.message)));
  if (realErrors.length) {
    throw new Error(`Script error loading "${brand}":\n${realErrors.map(e => e.stack || e).join('\n')}`);
  }

  // `data` is pure JSON, so clone it into the Node realm. Without this,
  // arrays/objects keep jsdom's prototypes and `assert.deepEqual` rejects
  // structurally-equal values as not reference-equal. `engine` stays live
  // (it holds spec `fn` closures that must run inside jsdom).
  const data = JSON.parse(JSON.stringify(window.__BRAND__));
  return { window, data, engine: window.__ENGINE__, errors, dom };
}

function run(window, code) {
  const s = window.document.createElement('script');
  s.textContent = code;
  window.document.body.appendChild(s);
}

module.exports = { loadBrand, brandDirs, ROOT };
