// Tier 1 — the /kit/ page as generated: its head, what it loads, where it is
// linked from (sitemap, homepage card, every footer). Reads the generator's
// output (the freshness test in seo.test.js proves the committed files match).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { brandDirs, ROOT } = require('../helpers/load-brand');
const { buildSite, siteConfig, KIT_TITLE } = require('../../scripts/generate-seo');

const { files } = buildSite();
const site = siteConfig();
const kit = files.get('kit/index.html');

test('/kit/ is the cross-brand engine in kit mode, with its own title and canonical', () => {
  assert.ok(kit, 'kit/index.html is not generated');
  assert.ok(kit.includes(`<title>${KIT_TITLE}</title>`));
  assert.match(kit, /kit:\s*true/);
  assert.ok(kit.includes(`<link rel="canonical" href="${site.baseUrl}/kit/">`));
  assert.ok(!kit.includes('noindex'));
  assert.ok(!kit.includes(`${site.baseUrl}/size/`), 'a leftover from the page it was copied from');
});

test('/kit/ loads every brand\'s data and kit.js before the engine', () => {
  const srcs = [...kit.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]);
  for (const b of brandDirs()) assert.ok(srcs.includes(`../${b}/data.js`), `/kit/ must load ${b}/data.js`);
  const at = s => srcs.indexOf(s);
  assert.ok(at('../kit.js') !== -1 && at('../kit.js') < at('../engine.js'), 'kit.js must load before engine.js');
  assert.ok(at('../analytics.js') !== -1, '/kit/ must load analytics.js');
});

test('/kit/ says what it does in crawlable text and links every brand page', () => {
  assert.match(kit, /How the kit builder works/);
  for (const b of brandDirs()) assert.ok(kit.includes(`href="../${b}/"`), `no link to ${b}/`);
});

test('/kit/ is in the sitemap', () => {
  assert.ok(files.get('sitemap.xml').includes(`<loc>${site.baseUrl}/kit/</loc>`));
});

test('homepage: the kit card sits after the size card and before the intro', () => {
  const html = files.get('index.html');
  const pos = ['class="brand-grid"', 'href="./size/"', 'class="size-hub-card" href="./kit/"', 'class="landing-intro"'].map(n => {
    const i = html.indexOf(n);
    assert.ok(i !== -1, `missing: ${n}`);
    return i;
  });
  assert.deepEqual(pos, [...pos].sort((a, b) => a - b));
  assert.match(html, /data-goatcounter-click="kit-hub"/);
});

test('every page\'s footer links the kit builder', () => {
  // Generated pages (vs, size, homepage, About, Privacy)…
  for (const [rel, html] of files) {
    if (!rel.endsWith('.html')) continue;
    const footer = /<footer[\s\S]*<\/footer>/.exec(html);
    if (!footer) continue; // engine pages build their footer at runtime (next assertion)
    const depth = rel.split('/').length - 1;
    const href = `${depth ? '../'.repeat(depth) : './'}kit/`;
    assert.ok(footer[0].includes(`href="${href}"`), `${rel}: footer has no link to ${href}`);
  }
  // …and the footer engine.js renders on brand pages, /compare/, /size/ and /kit/.
  const engine = fs.readFileSync(path.join(ROOT, 'engine.js'), 'utf8');
  assert.match(/<footer>[\s\S]*?<\/footer>/.exec(engine)[0], /href="\.\.\/kit\/"/);
});
