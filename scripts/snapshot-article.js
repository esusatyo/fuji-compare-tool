#!/usr/bin/env node
// Freeze the data a dated article renders from:
//
//   node scripts/snapshot-article.js <slug>
//
// Runs content/articles/<slug>.js's snapshot() against today's brand data and
// writes content/articles/<slug>.snapshot.json. generate-seo.js renders the
// article from that file only, so later data changes never move it. Refuses to
// overwrite an existing snapshot: a published article stays as it was. Pass
// --force only to correct an article before it is published.
'use strict';
const fs = require('fs');
const path = require('path');
const { loadBrand, brandDirs } = require('../tests/helpers/load-brand');
const Articles = require('./articles.js');

const args = process.argv.slice(2);
const force = args.includes('--force');
const slug = args.find(a => !a.startsWith('--'));
if (!slug) {
  console.error('usage: node scripts/snapshot-article.js <slug> [--force]');
  process.exit(2);
}
const page = Articles.loadContent().find(p => p.kind === 'article' && p.slug === slug);
if (!page) {
  console.error(`no article content/articles/${slug}.js`);
  process.exit(2);
}
const out = Articles.snapshotFile(slug);
if (fs.existsSync(out) && !force) {
  console.error(`${path.relative(process.cwd(), out)} exists; an article's data is frozen once written (use --force only before it is published)`);
  process.exit(1);
}
const brandData = {};
for (const b of brandDirs()) brandData[b] = loadBrand(b).data;
fs.writeFileSync(out, `${JSON.stringify(page.mod.snapshot(brandData), null, 2)}\n`);
console.log(`wrote ${path.relative(process.cwd(), out)}`);
