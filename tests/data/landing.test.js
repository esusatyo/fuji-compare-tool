// Tier 1 — Landing page brand cards (root index.html, generated).
//
// Two deliberate design choices are pinned here so an unrelated change (a new
// brand, a re-sorted brand list, a missing showcase photo) can't quietly undo
// them: the card ORDER is explicit rather than alphabetical (Leica sits
// directly after Panasonic), and the "All Brands" tile is a photo mosaic drawn
// from several brands' showcase cameras rather than the logo.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildAll, orderLandingBrands, allBrandsPhotoHTML, LANDING_CARD_ORDER, ALL_BRANDS_MOSAIC } =
  require('../../scripts/generate-seo');
const { brandDirs } = require('../helpers/load-brand');

const root = buildAll().get('index.html');
const cards = (root.match(/<li class="brand-card"[\s\S]*?<\/li>/g) || []);
const slugOf = card => (card.match(/href="\.\/([a-z0-9-]+)\/"/) || [])[1];

test('landing: "All Brands" leads, then brands in the explicit LANDING_CARD_ORDER', () => {
  const slugs = cards.map(slugOf);
  assert.equal(slugs[0], 'compare', 'the All Brands card is first');
  const ordered = slugs.slice(1);
  const expected = [
    ...LANDING_CARD_ORDER.filter(s => brandDirs().includes(s)),
    ...brandDirs().filter(s => !LANDING_CARD_ORDER.includes(s)).sort(),
  ];
  assert.deepEqual(ordered, expected);
});

test('landing: Leica comes directly after Panasonic', () => {
  const slugs = cards.map(slugOf);
  assert.equal(slugs[slugs.indexOf('panasonic') + 1], 'leica');
});

test('landing: every registered brand has exactly one card', () => {
  const slugs = cards.map(slugOf).filter(s => s !== 'compare');
  assert.deepEqual([...slugs].sort(), [...brandDirs()].sort());
});

test('orderLandingBrands: an unlisted brand is appended alphabetically, never dropped', () => {
  const out = orderLandingBrands([{ slug: 'zeta' }, { slug: 'sony' }, { slug: 'alpha' }, { slug: 'canon' }]);
  assert.deepEqual(out.map(b => b.slug), ['canon', 'sony', 'alpha', 'zeta']);
});

test('landing: the "All Brands" tile is a mosaic of photos from several different brands', () => {
  const tile = cards[0];
  const imgs = [...tile.matchAll(/<img src="([^"]+)" alt=""/g)].map(m => m[1]);
  assert.ok(imgs.length >= 2, 'at least two photos (fewer falls back to the logo)');
  assert.equal(new Set(imgs).size, imgs.length, 'no photo repeated');
  assert.ok(!/<svg/.test(tile.split('<div class="brand-card-body">')[0]), 'photos replace the logo mark');
  // each mosaic photo must be a real brand card's own showcase photo
  const brandPhotos = new Set(cards.slice(1).flatMap(c => [...c.matchAll(/<img src="([^"]+)" alt="[^"]+"/g)].map(m => m[1])));
  for (const src of imgs) assert.ok(brandPhotos.has(src), `mosaic photo is not any brand's showcase photo: ${src}`);
  // and they come from the brands ALL_BRANDS_MOSAIC names
  assert.ok(imgs.length <= ALL_BRANDS_MOSAIC.length);
});

test('landing: mosaic photos are decorative (alt="") and hide themselves if they fail to load', () => {
  const html = allBrandsPhotoHTML([
    { slug: 'canon', heroCamera: { imageUrl: 'https://example.com/a.jpg' } },
    { slug: 'sony', heroCamera: { imageUrl: 'https://example.com/b.jpg' } },
  ]);
  assert.equal((html.match(/<img /g) || []).length, 2);
  assert.ok((html.match(/alt=""/g) || []).length === 2);
  assert.ok((html.match(/onerror="this\.classList\.add\('img-broken'\)"/g) || []).length === 2);
});

test('landing: with fewer than two photos the tile falls back to the logo mark, not a lone photo', () => {
  const none = allBrandsPhotoHTML([{ slug: 'canon', heroCamera: { imageUrl: null } }]);
  assert.ok(/<svg/.test(none) && !/<img/.test(none));
  const one = allBrandsPhotoHTML([
    { slug: 'canon', heroCamera: { imageUrl: 'https://example.com/a.jpg' } },
    { slug: 'sony', heroCamera: { imageUrl: null } },
  ]);
  assert.ok(/<svg/.test(one) && !/<img/.test(one));
});
