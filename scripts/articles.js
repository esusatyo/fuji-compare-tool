// Guides and articles: data-led pages written as one module each under
// content/guides/ and content/articles/ (design: openspec add-data-guides).
//
//   guide   → /guides/<slug>    evergreen; rendered from live data on every
//                                generator run; "Updated" date at the top
//                                (the page's sitemap <lastmod>).
//   article → /articles/<slug>  dated; rendered from the snapshot committed
//                                next to it (<slug>.snapshot.json, written by
//                                scripts/snapshot-article.js), so a data change
//                                never moves it; "Published" date at the top.
//
// A content module exports:
//   slug, title (≤ 60 chars), headline (the H1), dek, published ('YYYY-MM-DD'),
//   query ({ text, evidence }: the search question it answers and why we
//   think people ask it), snapshot(brandData) → plain JSON,
//   description(snap) → 140–160 chars, render(snap, kit) → body HTML,
//   claims(snap) → [[text, boolean]], sentences that can stop being true.
//
// Pure: no generator imports, so generate-seo.js and tests can both use it.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const KINDS = {
  guide: { dir: 'guides', label: 'Guide', plural: 'Guides', dateLabel: 'Updated', event: 'guide-link' },
  article: { dir: 'articles', label: 'Article', plural: 'Articles', dateLabel: 'Published', event: 'article-link' },
};
const FIELDS = ['slug', 'title', 'headline', 'dek', 'published', 'query', 'snapshot', 'description', 'render', 'claims'];
// Replaced after the sitemap manifest is known, so a guide's own date never
// feeds the hash that decides whether its date moves.
const DATE_ISO = '{{page-date-iso}}';
const DATE_TEXT = '{{page-date-text}}';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function longDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) throw new Error(`not a YYYY-MM-DD date: ${iso}`);
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

function snapshotFile(slug, root = ROOT) {
  return path.join(root, 'content', KINDS.article.dir, `${slug}.snapshot.json`);
}

// Every content module, guides first, each sorted by slug.
function loadContent(root = ROOT) {
  const pages = [];
  for (const [kind, k] of Object.entries(KINDS)) {
    const dir = path.join(root, 'content', k.dir);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()) {
      const file = path.join(dir, f);
      const mod = require(file);
      for (const field of FIELDS) {
        if (mod[field] === undefined) throw new Error(`${path.relative(root, file)}: missing "${field}"`);
      }
      if (mod.slug !== path.basename(f, '.js')) throw new Error(`${path.relative(root, file)}: slug "${mod.slug}" must match the file name`);
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(mod.slug)) throw new Error(`${path.relative(root, file)}: slug must be lowercase words joined by hyphens`);
      longDate(mod.published);
      pages.push({ kind, ...KINDS[kind], mod, slug: mod.slug, url: `${k.dir}/${mod.slug}`, file });
    }
  }
  return pages;
}

// The data a page renders from: live for a guide, the committed snapshot for
// an article (a missing snapshot is an error, never a silent live render).
function pageSnapshot(page, brandData, root = ROOT) {
  if (page.kind === 'guide') return JSON.parse(JSON.stringify(page.mod.snapshot(brandData)));
  const file = snapshotFile(page.slug, root);
  if (!fs.existsSync(file)) throw new Error(`content/articles/${page.slug}.js has no snapshot: run node scripts/snapshot-article.js ${page.slug}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// The helpers a content module renders with. Links are written root-relative
// without the leading slash ('vs/a-vs-b', 'fujifilm/#lenses=x'); pages sit one
// directory deep, so they get a '../' prefix and a click event.
function makeKit(page) {
  const links = [];
  const kit = {
    esc,
    usd: n => '$' + Number(n).toLocaleString('en-US'),
    a(href, text) {
      if (/^(\/|https?:|\.)/.test(href)) throw new Error(`${page.url}: write internal links as 'path' from the site root, got "${href}"`);
      links.push(href);
      const target = href.split('#')[0] || href;
      return `<a href="../${href}" data-goatcounter-click="${page.event}:${page.slug}:${esc(target)}" data-goatcounter-title="${page.label} link: ${esc(text.replace(/<[^>]+>/g, ''))}">${text}</a>`;
    },
    // head: column labels; rows: arrays of cell HTML; the `rowHeader` column
    // becomes <th scope="row">.
    table(head, rows, { rowHeader = 0, caption = '' } = {}) {
      const cells = r => r.map((c, i) => (i === rowHeader ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join('');
      return `<div class="guide-table-wrap"><table class="guide-table">${caption ? `<caption>${caption}</caption>` : ''}
<thead><tr>${head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
<tbody>
${rows.map(r => `<tr>${cells(r)}</tr>`).join('\n')}
</tbody></table></div>`;
    },
    // Horizontal bars from zero, every bar labelled and valued, colour from the
    // validated --chart-1..4 tokens (`series` 1–4) and named in the legend,
    // plus the same numbers as a table. bars: [{ label, sub, value, series }].
    bars({ caption, bars, max, unit = 'g', legend = [], table }) {
      const top = max || Math.max(...bars.map(b => b.value));
      const rows = bars.map(b => {
        const pct = Math.max(0.5, (b.value / top) * 100).toFixed(1);
        return `<div class="gbar-row" title="${esc(`${b.label}${b.sub ? ': ' + b.sub : ''}, ${b.value} ${unit}`)}">
  <div class="gbar-label"><span>${esc(b.label)}</span>${b.sub ? `<small>${esc(b.sub)}</small>` : ''}</div>
  <div class="gbar-track"><span class="gbar gbar-c${b.series || 1}" style="width:${pct}%"></span><span class="gbar-val" style="left:${pct}%">${b.value} ${unit}</span></div>
</div>`;
      }).join('\n');
      const key = legend.length ? `<div class="gbar-legend">${legend.map(([label, s]) => `<span><i class="gbar-c${s}"></i>${esc(label)}</span>`).join('')}</div>` : '';
      return `<figure class="gbar-chart">
${key}
<div class="gbars">
${rows}
</div>
<figcaption>${caption}</figcaption>
${table ? `<details><summary>Show as a table</summary>${kit.table(table.head, table.rows, { rowHeader: table.rowHeader || 0 })}</details>` : ''}
</figure>`;
    },
  };
  return { kit, links };
}

// Render one page's body and evaluate its claims.
function renderContent(page, brandData, root = ROOT) {
  const snap = pageSnapshot(page, brandData, root);
  const { kit, links } = makeKit(page);
  const body = page.mod.render(snap, kit);
  const description = page.mod.description(snap);
  const claims = page.mod.claims(snap).map(([text, ok]) => ({ text, ok: !!ok }));
  return { snap, body, description, claims, links };
}

module.exports = { KINDS, DATE_ISO, DATE_TEXT, esc, longDate, loadContent, pageSnapshot, snapshotFile, makeKit, renderContent };
