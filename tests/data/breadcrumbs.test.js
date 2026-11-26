// Tier 1 — BreadcrumbList JSON-LD on vs-pages, size pages, mount pages,
// guides and articles: Home → section → page, where the section is the page's
// visible back link and the last item is its canonical URL.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { buildAll, siteConfig, breadcrumbLd } = require('../../scripts/generate-seo');

const files = buildAll();
const site = siteConfig();

// The page kinds that carry a trail (index pages and tool pages don't).
const KINDS = [
  ['same-brand vs-page', /^[^/]+\/vs\/[^/]+\.html$/],
  ['cross-brand vs-page', /^vs\/[^/]+\.html$/],
  ['same-brand size page', /^[^/]+\/size\/[^/]+\.html$/],
  ['cross-brand size page', /^size\/(?!index\.html$)[^/]+\.html$/],
  ['mount page', /^mount\/(?!index\.html$)[^/]+\.html$/],
  ['guide or article', /^(guides|articles)\/(?!index\.html$)[^/]+\.html$/],
];
const kindOf = rel => (KINDS.find(([, re]) => re.test(rel)) || [])[0];

function crumbsOf(document) {
  return [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(s => JSON.parse(s.textContent)).filter(j => j['@type'] === 'BreadcrumbList');
}

test('every content page carries one breadcrumb trail that matches its own links', () => {
  const seen = {};
  for (const [rel, html] of files) {
    const kind = kindOf(rel);
    if (!kind) continue;
    seen[kind] = (seen[kind] || 0) + 1;
    const d = new JSDOM(html).window.document;
    const lists = crumbsOf(d);
    assert.equal(lists.length, 1, `${rel}: ${lists.length} BreadcrumbList blocks`);
    const items = lists[0].itemListElement;
    assert.equal(items.length, 3, `${rel}: Home → section → page`);
    items.forEach((it, i) => {
      assert.equal(it['@type'], 'ListItem', rel);
      assert.equal(it.position, i + 1, rel);
      assert.ok(it.name && it.name.trim(), `${rel}: item ${i + 1} has no name`);
      assert.ok(it.item.startsWith(`${site.baseUrl}/`), `${rel}: item ${i + 1} is not an absolute site URL`);
    });
    const canonical = d.querySelector('link[rel="canonical"]').href;
    assert.equal(items[0].item, `${site.baseUrl}/`, `${rel}: first item is Home`);
    assert.equal(items[2].item, canonical, `${rel}: last item is the canonical URL`);
    const back = d.querySelector('.header-back');
    assert.ok(back, `${rel}: no visible back link to match`);
    assert.equal(items[1].item, new URL(back.getAttribute('href'), canonical).href,
      `${rel}: the middle item must be the page's back link (${back.textContent})`);
  }
  for (const [kind] of KINDS) assert.ok(seen[kind] > 0, `no ${kind} found to check`);
});

test('pages outside those kinds carry no breadcrumb trail', () => {
  for (const [rel, html] of files) {
    if (!rel.endsWith('.html') || kindOf(rel)) continue;
    assert.ok(!html.includes('"BreadcrumbList"'), `${rel}: unexpected BreadcrumbList`);
  }
});

test('breadcrumbLd numbers the trail from Home', () => {
  const ld = breadcrumbLd(site, [{ name: 'Guides', url: `${site.baseUrl}/guides/` }]);
  assert.deepEqual(ld.itemListElement.map(i => [i.position, i.name]), [[1, site.siteName], [2, 'Guides']]);
});
