// Tier 1 — every page's share card (og:image) exists, is fresh, and is
// declared correctly. Cards are built by buildSite() in
// scripts/generate-seo.js and rendered by scripts/render-share-images.js;
// freshness is checked against the card-HTML hash in og/manifest.json,
// never pixels (Chrome's font rasterisation differs between machines).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { buildSite, cardHash, vsCardHTML, siteConfig, CARD_W, CARD_H } = require('../../scripts/generate-seo');

const ROOT = path.resolve(__dirname, '..', '..');
const RENDER = 'node scripts/render-share-images.js';
// WhatsApp reportedly drops previews over ~300 KB; keep headroom.
const MAX_BYTES = 250 * 1024;

const { files, cards } = buildSite();
const site = siteConfig();
const manifest = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'og', 'manifest.json'), 'utf8')); } catch { return {}; }
})();

function pngSize(file) {
  const data = fs.readFileSync(file);
  assert.equal(data.readUInt32BE(0), 0x89504e47, `${file}: not a PNG`);
  assert.equal(data.toString('ascii', 12, 16), 'IHDR', `${file}: no IHDR chunk`);
  return { w: data.readUInt32BE(16), h: data.readUInt32BE(20), bytes: data.length };
}

function listPngs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) return listPngs(abs);
    return e.name.endsWith('.png') ? [path.relative(ROOT, abs).split(path.sep).join('/')] : [];
  });
}

test('every page\'s share image exists, is 1200×630 and under the size cap', () => {
  const problems = [];
  for (const p of cards.keys()) {
    const abs = path.join(ROOT, p);
    if (!fs.existsSync(abs)) { problems.push(`${p}: missing`); continue; }
    const { w, h, bytes } = pngSize(abs);
    if (w !== CARD_W || h !== CARD_H) problems.push(`${p}: ${w}×${h}, expected ${CARD_W}×${CARD_H}`);
    if (bytes > MAX_BYTES) problems.push(`${p}: ${Math.round(bytes / 1024)} KB, over ${MAX_BYTES / 1024} KB`);
  }
  assert.deepEqual(problems, [], `share images need rendering — run: ${RENDER}\n${problems.join('\n')}`);
});

test('every share image is fresh (manifest hash matches its current card)', () => {
  const stale = [...cards].filter(([p, c]) => manifest[p] !== cardHash(c.html)).map(([p]) => p);
  assert.deepEqual(stale, [], `stale share images — run: ${RENDER}\n${stale.join('\n')}`);
});

test('no orphan share images or manifest entries', () => {
  const orphanPngs = listPngs(path.join(ROOT, 'og')).filter(p => !cards.has(p));
  const orphanEntries = Object.keys(manifest).filter(p => !cards.has(p));
  assert.deepEqual([...orphanPngs, ...orphanEntries], [], `orphans under og/ — run: ${RENDER}`);
});

test('cards are photo-free, price-free and self-contained', () => {
  for (const [p, c] of cards) {
    assert.doesNotMatch(c.html, /<img\b/i, `${p}: card embeds an <img>`);
    assert.doesNotMatch(c.html, /\b(?:src|href)=|url\(/i, `${p}: card references an external resource`);
    assert.doesNotMatch(c.html, /[$€£¥]/, `${p}: card shows a price`);
  }
});

test('every generated page declares its own large share card', () => {
  const pages = [...files.keys()].filter(f => f.endsWith('.html'));
  assert.ok(pages.length > 300, `expected 300+ generated pages, got ${pages.length}`);
  const meta = (html, attr, key) =>
    (html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)">`)) || [])[1];
  for (const f of pages) {
    const html = files.get(f);
    const img = meta(html, 'property', 'og:image');
    assert.ok(img, `${f}: no og:image`);
    assert.ok(img.startsWith(`${site.baseUrl}/og/`) && img.endsWith('.png'), `${f}: og:image ${img} is not an absolute og/ PNG`);
    assert.ok(cards.has(img.slice(site.baseUrl.length + 1)), `${f}: og:image ${img} has no card`);
    assert.equal(meta(html, 'name', 'twitter:image'), img, `${f}: twitter:image differs from og:image`);
    assert.equal(meta(html, 'name', 'twitter:card'), 'summary_large_image', `${f}: twitter:card`);
    assert.equal(meta(html, 'property', 'og:image:width'), String(CARD_W), `${f}: og:image:width`);
    assert.equal(meta(html, 'property', 'og:image:height'), String(CARD_H), `${f}: og:image:height`);
    assert.ok((meta(html, 'property', 'og:image:alt') || '').trim(), `${f}: empty og:image:alt`);
  }
});

test('vs-pages get a card at their own path; About and Privacy reuse the home card', () => {
  const img = f => (files.get(f).match(/<meta property="og:image" content="([^"]*)">/) || [])[1];
  for (const f of files.keys()) {
    if (/(^|\/)vs\/[^/]+\.html$/.test(f)) assert.equal(img(f), `${site.baseUrl}/og/${f.replace(/\.html$/, '.png')}`);
  }
  assert.equal(img('about.html'), `${site.baseUrl}/og/home.png`);
  assert.equal(img('privacy.html'), `${site.baseUrl}/og/home.png`);
});

test('vs-card silhouettes share one scale, and a missing dimension omits only that outline', () => {
  const cam = (width, height) => ({ width, height, sensorMP: 24, ibis: false, weight: 500, year: 2024 });
  const widths = html => [...html.matchAll(/<svg width="(\d+)" height="\d+"/g)].map(m => +m[1]);

  const [wA, wB] = widths(vsCardHTML([{ name: 'A', cam: cam(130, 90) }, { name: 'B', cam: cam(104, 72) }]));
  assert.ok(Math.abs(wA / wB - 130 / 104) < 0.02, `drawn widths ${wA}:${wB} are not 130:104`);

  const oneMissing = widths(vsCardHTML([{ name: 'A', cam: cam(130, null) }, { name: 'B', cam: cam(104, 72) }]));
  assert.equal(oneMissing.length, 1, 'only the camera with both dimensions gets an outline');
});
