// Tier 1 — guides (/guides/<slug>) and dated articles (/articles/<slug>),
// built from content/ by scripts/articles.js + generate-seo.js. Reads the
// generator's output (seo.test.js proves the committed files match it).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { JSDOM } = require('jsdom');
const { loadBrand, brandDirs, ROOT } = require('../helpers/load-brand');
const { buildSite, siteConfig } = require('../../scripts/generate-seo');
const Articles = require('../../scripts/articles');

const { files, content } = buildSite();
const site = siteConfig();
const brands = Object.fromEntries(brandDirs().map(b => [b, loadBrand(b).data]));
const sitemap = files.get('sitemap.xml');
const indexable = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].slice(site.baseUrl.length + 1)));
const lastmod = Object.fromEntries([...sitemap.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)</g)].map(m => [m[1].slice(site.baseUrl.length + 1), m[2]]));
const doc = rel => new JSDOM(files.get(rel)).window.document;

test('there is content, and every page is generated and in the sitemap', () => {
  assert.ok(content.length >= 1, 'no content modules found');
  for (const { page } of content) {
    assert.ok(files.has(`${page.url}.html`), `${page.url} not generated`);
    assert.ok(indexable.has(page.url), `${page.url} not in the sitemap`);
  }
});

test('every declared claim still holds for the data', () => {
  const broken = content.flatMap(({ page, claims }) => claims.filter(c => !c.ok).map(c => `${page.url}: "${c.text}"`));
  assert.deepEqual(broken, [], 'the data no longer supports these sentences; rewrite them (and the claim) in content/');
});

test('no unresolved placeholder or broken number in any page', () => {
  for (const { page } of content) {
    const html = files.get(`${page.url}.html`);
    for (const bad of ['undefined', 'NaN', '{{', '${', 'null g', '[object']) {
      assert.ok(!html.includes(bad), `${page.url} contains "${bad}"`);
    }
  }
});

// Internal links inside the article body: the page must exist and be
// indexable; every slug in a deep link (#cameras= / #lenses= / #kit=) must
// resolve to an item.
test('every link in a guide reaches an existing, indexable page', () => {
  const problems = [];
  for (const { page } of content) {
    for (const a of doc(`${page.url}.html`).querySelectorAll('article.guide a[href]')) {
      const href = a.getAttribute('href');
      if (/^https?:/.test(href)) continue;
      assert.ok(href.startsWith('../'), `${page.url}: internal link not relative to the root: ${href}`);
      const [p, hash] = href.slice(3).split('#');
      const file = p === '' || p.endsWith('/') ? `${p}index.html` : `${p}.html`;
      if (!files.has(file) && !fs.existsSync(path.join(ROOT, file))) problems.push(`${page.url}: ${href} has no page`);
      else if (!indexable.has(p)) problems.push(`${page.url}: ${href} is not indexable (not in the sitemap)`);
      if (!hash) continue;
      const m = /^(cameras|lenses|kit)=(.+)$/.exec(hash);
      if (!m) { problems.push(`${page.url}: ${href} has an unknown hash`); continue; }
      const brandPage = /^([a-z]+)\/$/.exec(p);
      for (const id of m[2].split(/[,;]/)) {
        const [b, slug] = id.includes(':') ? id.split(':') : [brandPage && brandPage[1], id];
        const data = brands[b];
        const pool = !data ? null : m[1] === 'lenses' ? data.LENSES : m[1] === 'cameras' ? data.CAMERAS : { ...data.CAMERAS, ...data.LENSES };
        if (!pool || !pool[slug]) problems.push(`${page.url}: ${href}: "${id}" does not resolve`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

test('head: one H1, short title, 140–160 character description, Article JSON-LD by the site', () => {
  for (const { page } of content) {
    const d = doc(`${page.url}.html`);
    assert.equal(d.querySelectorAll('h1').length, 1, `${page.url}: one H1`);
    assert.equal(d.querySelector('h1').textContent, page.mod.headline);
    assert.ok(d.title.length <= 60, `${page.url}: title is ${d.title.length} characters`);
    const desc = d.querySelector('meta[name="description"]').content;
    assert.ok(desc.length >= 140 && desc.length <= 160, `${page.url}: description is ${desc.length} characters`);
    assert.equal(d.querySelector('link[rel="canonical"]').href, `${site.baseUrl}/${page.url}`);
    const ld = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent);
    assert.equal(ld['@type'], 'Article');
    assert.equal(ld.headline, page.mod.headline);
    assert.deepEqual([ld.author['@type'], ld.author.name], ['Organization', site.siteName]);
    assert.equal(ld.datePublished, page.mod.published);
    assert.match(ld.image, /\/og\/(guides|articles)\/[a-z0-9-]+\.png$/);
  }
});

test('the date sits at the top: a guide shows its sitemap <lastmod>, an article its published date', () => {
  for (const { page } of content) {
    const d = doc(`${page.url}.html`);
    const ld = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent);
    const byline = d.querySelector('h1 + .guide-dek + .guide-byline');
    assert.ok(byline, `${page.url}: byline must follow the H1 and dek`);
    assert.ok(byline.textContent.startsWith(`By ${site.siteName}`), `${page.url}: byline names the site`);
    const time = byline.querySelector('time').getAttribute('datetime');
    const expected = page.kind === 'guide' ? lastmod[page.url] : page.mod.published;
    assert.equal(time, expected, `${page.url}: date at the top`);
    assert.equal(ld.dateModified, expected);
    assert.match(byline.textContent, new RegExp(`${page.dateLabel} ${Articles.longDate(expected)}$`));
  }
});

test("a guide's date does not move on a later build when nothing changed", () => {
  const later = buildSite({ today: '2099-12-31' }).files;
  for (const { page } of content.filter(c => c.page.kind === 'guide')) {
    assert.equal(later.get(`${page.url}.html`), files.get(`${page.url}.html`), page.url);
  }
});

test('an index exists for exactly the kinds that have pages, and the homepage links every guide', () => {
  for (const [kind, k] of Object.entries(Articles.KINDS)) {
    const n = content.filter(c => c.page.kind === kind).length;
    assert.equal(files.has(`${k.dir}/index.html`), n > 0, `${k.dir}/index.html`);
    assert.equal(indexable.has(`${k.dir}/`), n > 0, `${k.dir}/ in sitemap`);
  }
  const home = files.get('index.html');
  for (const { page } of content.filter(c => c.page.kind === 'guide')) {
    assert.ok(home.includes(`href="./guides/${page.slug}"`), `homepage links ${page.url}`);
  }
});

// Articles render from their committed snapshot, never from live data.
test('an article renders from its snapshot, and a missing snapshot is an error', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'articles-'));
  const dir = path.join(root, 'content', 'articles');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'sample-2026.js'), `module.exports = {
    slug: 'sample-2026', title: 't', headline: 'h', dek: 'd', published: '2026-11-01', query: { text: 'q', evidence: 'e' },
    snapshot: data => ({ n: Object.keys(data).length }),
    description: s => 'n=' + s.n,
    render: (s, k) => '<p>' + s.n + '</p>',
    claims: s => [['n is positive', s.n > 0]],
  };`);
  const [page] = Articles.loadContent(root);
  assert.equal(page.kind, 'article');
  assert.equal(page.url, 'articles/sample-2026');
  assert.throws(() => Articles.renderContent(page, brands, root), /snapshot-article\.js sample-2026/);
  fs.writeFileSync(Articles.snapshotFile('sample-2026', root), JSON.stringify({ n: 3 }));
  const a = Articles.renderContent(page, brands, root);
  const b = Articles.renderContent(page, { only: brands.fujifilm }, root);
  assert.equal(a.body, '<p>3</p>');
  assert.equal(b.body, a.body, 'live data must not reach an article');
  fs.rmSync(root, { recursive: true, force: true });
});

test('content links are written from the site root, without a leading slash', () => {
  const { kit } = Articles.makeKit({ url: 'guides/x', slug: 'x', event: 'guide-link', label: 'Guide' });
  assert.match(kit.a('vs/a-vs-b', 'A vs B'), /^<a href="\.\.\/vs\/a-vs-b" data-goatcounter-click="guide-link:x:vs\/a-vs-b"/);
  assert.throws(() => kit.a('/vs/a-vs-b', 'A vs B'), /from the site root/);
});
