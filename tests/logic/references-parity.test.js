// Tier 2 — Parity between the two independent collectReferences()
// implementations: engine.js (browser, used by interactive pages) and
// scripts/generate-seo.js (Node, used by static vs-pages). They can't share
// code (engine.js is a browser-only script with no module.exports), so this
// test is what keeps them from silently drifting apart.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand } = require('../helpers/load-brand');
const generator = require('../../scripts/generate-seo');

// One real engine.js load gives us window.collectReferences; the function
// only reads plain fields off its argument, so any fixture object works.
const { window } = loadBrand('fujifilm', { engine: true });

const FIXTURES = {
  'full coverage, all four rows populated': {
    productUrl: 'https://www.fujifilm-x.com/global/products/cameras/x-t5/',
    specSources: [{ url: 'https://www.dpreview.com/reviews/x-t5', tier: 'T2', title: 'DPReview review' }],
    priceSource: { url: 'https://www.adorama.com/fujifilm-x-t5', tier: 'T3' },
    imageSource: { url: 'https://www.fujifilm-x.com/global/products/cameras/x-t5/gallery/', tier: 'T1' },
  },
  'only a productUrl': {
    productUrl: 'https://www.fujifilm-x.com/global/products/cameras/x-t5/',
  },
  'Commons imageCredit fallback, no imageSource': {
    productUrl: null,
    imageCredit: {
      author: 'Someone', licence: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:X.jpg',
    },
  },
  'spec source identical to productUrl is deduplicated': {
    productUrl: 'https://www.fujifilm-x.com/global/products/cameras/x-t5/',
    specSources: [{ url: 'https://www.fujifilm-x.com/global/products/cameras/x-t5/', tier: 'T1' }],
  },
  'citation without a title falls back to a bare host+path': {
    productUrl: null,
    priceSource: { url: 'https://www.bhphotovideo.com/c/product/x', tier: 'T3' },
  },
  'generic /cameras/ index productUrl is skipped entirely': {
    productUrl: 'https://www.fujifilm-x.com/global/products/cameras/',
  },
  'multiple spec sources, in array order': {
    productUrl: null,
    specSources: [
      { url: 'https://a.example/1', tier: 'T1', title: 'First' },
      { url: 'https://b.example/2', tier: 'T2', title: 'Second' },
    ],
  },
};

for (const [name, item] of Object.entries(FIXTURES)) {
  test(`[parity] ${name}`, () => {
    // JSON round-trip: window.collectReferences() builds its result with
    // jsdom's own Object/Array constructors, which assert.deepEqual (strict)
    // treats as a different "species" from Node's plain objects even when
    // structurally identical (same reason loadBrand()'s `data` is cloned).
    const fromEngine = JSON.parse(JSON.stringify(window.collectReferences(item)));
    const fromGenerator = generator.collectReferences(item);
    assert.deepEqual(fromEngine, fromGenerator);
  });
}
