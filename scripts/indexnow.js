#!/usr/bin/env node
// ─────────────────────────────────────────────
// INDEXNOW PING
//
// Tells IndexNow (Bing, and through it Yandex, Seznam, Naver…) which
// indexable pages changed in a commit range, so they are re-crawled within
// hours instead of whenever Bing next reads the sitemap. Google does not
// use IndexNow. Run by .github/workflows/indexnow.yml after each
// successful production deploy:
//
//   node scripts/indexnow.js --since <rev> [--until <rev>]   # changed pages
//   node scripts/indexnow.js --all                           # every sitemap URL
//   add --dry-run to print the URLs without submitting
//
// Which URLs (selectUrls): a changed *.html page, or a changed
// <brand>/data.js (brand pages render their data client-side), counts only
// if its clean URL is in the new sitemap — noindexed vs-pages are never
// pushed. URLs dropped from the sitemap in the range are submitted too, so
// engines see the 404/noindex sooner.
//
// The key is public by design: IndexNow verifies it by fetching
// <baseUrl>/<KEY>.txt, served from the repo root.
// tests/data/indexnow.test.js ties the constant to that file.
// ─────────────────────────────────────────────
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { siteConfig } = require('./generate-seo');

const ROOT = path.resolve(__dirname, '..');
const KEY = '870b934a4865448e894273f3859a8725';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function sitemapUrls(xml) {
  return [...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}

// Repo path → the clean URL the site publishes it at, or null for files that
// aren't pages. `index.html` → `/`, `x/index.html` → `/x/`, `x/y.html` → `/x/y`.
function fileToUrl(file, baseUrl) {
  const brandData = file.match(/^([^/]+)\/data\.js$/);
  if (brandData) return `${baseUrl}/${brandData[1]}/`;
  if (!file.endsWith('.html')) return null;
  const clean = file.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
  return `${baseUrl}/${clean}`;
}

function selectUrls({ changedFiles, oldSitemap, newSitemap, baseUrl }) {
  const now = new Set(sitemapUrls(newSitemap));
  const changed = changedFiles.map(f => fileToUrl(f, baseUrl)).filter(u => u && now.has(u));
  const dropped = sitemapUrls(oldSitemap).filter(u => !now.has(u));
  return [...new Set([...changed, ...dropped])].sort();
}

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function sitemapAt(rev) {
  try { return git('show', `${rev}:sitemap.xml`); } catch { return ''; }
}

async function submit(urls, baseUrl) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(baseUrl).host, key: KEY, urlList: urls }),
  });
  return res.status;
}

async function main() {
  const args = process.argv.slice(2);
  const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const { baseUrl } = siteConfig();

  let urls;
  if (args.includes('--all')) {
    urls = sitemapUrls(fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8'));
  } else if (opt('--since')) {
    const since = opt('--since');
    const until = opt('--until') || 'HEAD';
    urls = selectUrls({
      changedFiles: git('diff', '--name-only', since, until).split('\n').filter(Boolean),
      oldSitemap: sitemapAt(since),
      newSitemap: sitemapAt(until),
      baseUrl,
    });
  } else {
    console.error('usage: node scripts/indexnow.js (--since <rev> [--until <rev>] | --all) [--dry-run]');
    process.exit(2);
  }

  if (!urls.length) { console.log('indexnow: no indexable pages changed — nothing to submit'); return; }
  console.log(`indexnow: ${urls.length} URL(s)\n  ${urls.join('\n  ')}`);
  if (args.includes('--dry-run')) return;

  const status = await submit(urls, baseUrl);
  // 200 = accepted, 202 = accepted, key validation pending.
  if (status !== 200 && status !== 202) {
    console.error(`indexnow: submission failed with HTTP ${status}`);
    process.exit(1);
  }
  console.log(`indexnow: submitted (HTTP ${status})`);
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });

module.exports = { KEY, ENDPOINT, sitemapUrls, fileToUrl, selectUrls };
