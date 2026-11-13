// ─────────────────────────────────────────────
// HOMEPAGE LOADER
//
// Boots the REAL index.html in jsdom, like load-compare.js does for the
// compare page: its inline scripts (including the generated
// window.COMPARE_CONFIG with the camera name index) run as-is, then its local
// <script src> files are evaluated from disk in document order.
//
// The homepage does not ship brand data: the engine appends a
// <script src="./<brand>/data.js"> per brand when it first needs specs. jsdom
// fetches nothing, so those tags sit unresolved until a test settles them with
// deliverData() (or failData()) — which also lets a test look at the page
// *while* the specs are in flight.
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
 * @param {string|null} [opts.storedBrand]  a remembered brand in localStorage, set before any script runs
 * @returns {{ window, errors, dom, pendingData, deliverData, failData }}
 */
function loadHome(opts = {}) {
  const { hash = '', width, storedBrand = null } = opts;
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e));

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: `https://example.test/${hash}`,
    virtualConsole: vc,
    pretendToBeVisual: true,
    beforeParse(window) {
      if (width !== undefined) {
        Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true });
      }
      if (storedBrand) window.localStorage.setItem('brand', storedBrand);
    },
  });
  const { window } = dom;

  for (const tag of [...window.document.querySelectorAll('script[src]')]) {
    const src = tag.getAttribute('src');
    if (!src.startsWith('./')) continue; // external (analytics) — skipped
    const s = window.document.createElement('script');
    s.textContent = fs.readFileSync(path.join(ROOT, src), 'utf8');
    window.document.body.appendChild(s);
  }

  const check = () => {
    const real = errors.filter(e => !NAV_NOT_IMPLEMENTED.test(String(e && e.message)));
    if (real.length) throw new Error(`Script error on the homepage:\n${real.map(e => e.stack || e).join('\n')}`);
  };
  check();

  /** The brand-data <script> tags the engine has asked for and nobody has answered. */
  const pendingData = () => [...window.document.querySelectorAll('head script[src$="/data.js"]')]
    .filter(t => !t.dataset.settled);

  /** Answer every outstanding brand-data request with the real file. */
  function deliverData() {
    const tags = pendingData();
    for (const tag of tags) {
      tag.dataset.settled = '1';
      const s = window.document.createElement('script');
      s.textContent = fs.readFileSync(path.join(ROOT, tag.getAttribute('src')), 'utf8');
      window.document.body.appendChild(s);
      tag.onload();
    }
    check();
    return tags.length;
  }

  /** Answer every outstanding brand-data request with a network failure. */
  function failData() {
    const tags = pendingData();
    for (const tag of tags) { tag.dataset.settled = '1'; tag.onerror(); }
    check();
    return tags.length;
  }

  return { window, errors, dom, pendingData, deliverData, failData };
}

module.exports = { loadHome };
