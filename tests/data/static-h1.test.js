// Tier 1 — every generated HTML page has exactly one <h1> in its served HTML.
// Brand pages, /compare/, /size/ and /kit/ render their hero in the browser,
// so their <h1> is written statically into the generator-owned body block
// (engine.js then adopts it as the hero; tests/logic/static-h1.test.js).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { brandDirs, loadBrand, ROOT } = require('../helpers/load-brand');
const { buildAll, heroText, inlineHeroTitle } = require('../../scripts/generate-seo');

const files = buildAll();
const pages = [...files.keys()].filter(rel => rel.endsWith('.html'));
const h1s = rel => [...new JSDOM(files.get(rel)).window.document.querySelectorAll('h1')];

test('every generated HTML page has exactly one <h1> in its static HTML', () => {
  assert.ok(pages.length > 300, `expected every generated page (got ${pages.length})`);
  const wrong = pages.map(rel => [rel, h1s(rel).length]).filter(([, n]) => n !== 1);
  assert.deepEqual(wrong, [], `pages without exactly one <h1>: ${wrong.map(([r, n]) => `${r} (${n})`).join(', ')}`);
});

test('a tool page\'s static <h1> is its hero title, inside the generated body block', () => {
  const tools = [
    ...brandDirs().map(b => [`${b}/index.html`, loadBrand(b).data.BRAND_CONFIG.cameras.heroTitle]),
    ...['compare', 'size', 'kit'].map(p => [`${p}/index.html`, inlineHeroTitle(files.get(`${p}/index.html`), p)]),
  ];
  for (const [rel, heroTitle] of tools) {
    const [h1] = h1s(rel);
    assert.ok(h1.hasAttribute('data-static-hero'), `${rel}: <h1> is not the static hero`);
    assert.equal(h1.textContent, heroText(heroTitle), rel);
    const html = files.get(rel);
    const at = html.indexOf('<h1');
    assert.ok(at > html.indexOf('<!-- seo:body:begin') && at < html.indexOf('<!-- seo:body:end'),
      `${rel}: the <h1> must sit inside the generator-owned body block`);
  }
});

test('heroText strips markup; inlineHeroTitle fails loudly without a config', () => {
  assert.equal(heroText('<span>Fujifilm</span> Camera Comparison'), 'Fujifilm Camera Comparison');
  assert.throws(() => inlineHeroTitle('<html></html>', 'x/index.html'), /no heroTitle/);
  assert.equal(inlineHeroTitle(fs.readFileSync(path.join(ROOT, 'kit', 'index.html'), 'utf8'), 'kit'), 'Camera <span>Kit</span> Builder');
});
