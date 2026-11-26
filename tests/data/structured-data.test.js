// Tier 1 — every JSON-LD block in generated HTML is valid and truthful:
// it parses, declares the schema.org @context, and every typed node carries
// the fields its type needs. A type with no rule here fails, so a new kind of
// structured data arrives with its checks. Ratings and reviews are rejected
// outright: the site has no hands-on reviews, and invented ones are exactly
// what Google's spam policies (and the owner) forbid.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { buildAll, siteConfig } = require('../../scripts/generate-seo');

const files = buildAll();
const site = siteConfig();

const isStr = v => typeof v === 'string' && v.trim() !== '';
const isAbs = v => isStr(v) && /^https:\/\/[^\s]+$/.test(v);
const isOurs = v => isStr(v) && v.startsWith(`${site.baseUrl}/`);
const isDate = v => isStr(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const named = v => v && typeof v === 'object' && isStr(v.name);

// Per type: a list of [field description, check(node, ctx)].
const RULES = {
  WebSite: [
    ['name', n => isStr(n.name)],
    ['url on this site', n => n.url === `${site.baseUrl}/`],
  ],
  Organization: [
    ['name', n => isStr(n.name)],
    ['url on this site', n => isOurs(n.url)],
    ['absolute logo URL', n => n.logo === undefined || isAbs(n.logo)],
  ],
  BreadcrumbList: [
    ['at least two items', n => Array.isArray(n.itemListElement) && n.itemListElement.length >= 2],
    ['positions 1..n', n => n.itemListElement.every((it, i) => it.position === i + 1)],
    ['every item names a page on this site', n => n.itemListElement.every(it => isStr(it.name) && isOurs(it.item))],
  ],
  ItemList: [
    ['non-empty itemListElement', n => Array.isArray(n.itemListElement) && n.itemListElement.length > 0],
    ['positions 1..n', n => n.itemListElement.every((it, i) => it.position === i + 1)],
  ],
  ListItem: [
    ['integer position', n => Number.isInteger(n.position) && n.position >= 1],
    ['an item', n => n.item !== undefined && (isOurs(n.item) || (typeof n.item === 'object' && n.item['@type']))],
  ],
  Product: [
    ['name', n => isStr(n.name)],
    ['brand', n => named(n.brand)],
    ['absolute image URL', n => n.image === undefined || isAbs(n.image)],
    // Google needs one of offers / review / aggregateRating; only offers is honest here.
    ['offers', n => n.offers && n.offers['@type'] === 'Offer'],
  ],
  Brand: [['name', n => isStr(n.name)]],
  Offer: [
    ['ISO currency', n => /^[A-Z]{3}$/.test(n.priceCurrency)],
    ['positive price', n => typeof n.price === 'number' && Number.isFinite(n.price) && n.price > 0],
  ],
  Article: [
    ['headline', n => isStr(n.headline)],
    ['datePublished', n => isDate(n.datePublished)],
    ['dateModified, not before datePublished', n => isDate(n.dateModified) && n.dateModified >= n.datePublished],
    ['author', n => named(n.author)],
    ['publisher', n => named(n.publisher)],
    ['mainEntityOfPage is the canonical URL', (n, ctx) => n.mainEntityOfPage === ctx.canonical],
    ['absolute image URL', n => n.image === undefined || isOurs(n.image)],
  ],
};

const FORBIDDEN = ['review', 'reviews', 'aggregateRating', 'reviewRating'];

// Every typed node, nested ones included (Product inside ListItem, Offer inside Product, …).
function* typedNodes(value, where) {
  if (Array.isArray(value)) { for (const [i, v] of value.entries()) yield* typedNodes(v, `${where}[${i}]`); return; }
  if (!value || typeof value !== 'object') return;
  if ('@type' in value) yield [value, where];
  for (const [k, v] of Object.entries(value)) if (k !== '@type') yield* typedNodes(v, `${where}.${k}`);
}

function* forbiddenKeys(value, where) {
  if (Array.isArray(value)) { for (const [i, v] of value.entries()) yield* forbiddenKeys(v, `${where}[${i}]`); return; }
  if (!value || typeof value !== 'object') return;
  for (const [k, v] of Object.entries(value)) {
    if (FORBIDDEN.includes(k)) yield `${where}.${k}`;
    yield* forbiddenKeys(v, `${where}.${k}`);
  }
}

const pages = [...files].filter(([rel]) => rel.endsWith('.html'));
const blocksOf = html => [...new JSDOM(html).window.document.querySelectorAll('script[type="application/ld+json"]')];

test('every JSON-LD block in generated HTML parses and declares the schema.org @context', () => {
  let n = 0;
  for (const [rel, html] of pages) {
    for (const [i, s] of blocksOf(html).entries()) {
      n++;
      let ld;
      assert.doesNotThrow(() => { ld = JSON.parse(s.textContent); }, `${rel}: JSON-LD block ${i + 1} is not valid JSON`);
      assert.equal(ld['@context'], 'https://schema.org', `${rel}: block ${i + 1} lacks @context https://schema.org`);
      assert.ok('@type' in ld || Array.isArray(ld['@graph']), `${rel}: block ${i + 1} has neither @type nor @graph`);
      assert.ok(!s.textContent.includes('{{'), `${rel}: block ${i + 1} carries an unreplaced template token`);
    }
  }
  assert.ok(n > 600, `expected the site's structured data (found ${n} blocks)`);
});

test('every typed node has a rule, and carries the fields its type needs', () => {
  const counts = {};
  for (const [rel, html] of pages) {
    const d = new JSDOM(html).window.document;
    const canonical = (d.querySelector('link[rel="canonical"]') || {}).href;
    for (const [i, s] of [...d.querySelectorAll('script[type="application/ld+json"]')].entries()) {
      for (const [node, where] of typedNodes(JSON.parse(s.textContent), `block${i + 1}`)) {
        const type = node['@type'];
        const rules = RULES[type];
        assert.ok(rules, `${rel}: ${where} uses @type "${type}", which this test has no rule for — add one`);
        counts[type] = (counts[type] || 0) + 1;
        for (const [field, ok] of rules) assert.ok(ok(node, { canonical }), `${rel}: ${where} (${type}) needs ${field}`);
      }
    }
  }
  // The types the site emits today, so a template that silently drops its block fails here.
  for (const type of ['WebSite', 'Organization', 'BreadcrumbList', 'ItemList', 'Product', 'Offer', 'Article']) {
    assert.ok(counts[type] > 0, `no ${type} found in generated HTML`);
  }
});

test('no structured data claims a review or a rating', () => {
  for (const [rel, html] of pages) {
    for (const [i, s] of blocksOf(html).entries()) {
      const hits = [...forbiddenKeys(JSON.parse(s.textContent), `block${i + 1}`)];
      assert.deepEqual(hits, [], `${rel}: ${hits.join(', ')} — the site publishes no reviews`);
    }
  }
});

test('the rules catch a broken block (sanity check of the checker itself)', () => {
  const bad = { '@type': 'Product', name: 'X', brand: { '@type': 'Brand', name: 'B' }, aggregateRating: { ratingValue: 5 } };
  assert.ok(!RULES.Product.every(([, ok]) => ok(bad, {})), 'a Product without offers must fail');
  assert.deepEqual([...forbiddenKeys(bad, 'b')], ['b.aggregateRating']);
  assert.ok(!RULES.Offer[1][1]({ price: '1,299' }), 'a string price must fail');
});
