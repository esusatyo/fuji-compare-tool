#!/usr/bin/env node
// ─────────────────────────────────────────────
// SHARE-IMAGE RENDERER
//
// Screenshots every page's share card (built by buildSite() in
// generate-seo.js) to a 1200×630 PNG under og/, the og:image each page
// declares. Incremental: only cards whose HTML hash differs from
// og/manifest.json, or whose PNG is missing, are rendered; PNGs that
// belong to no page are deleted. Run after generate-seo.js whenever a
// card's inputs change (the pre-commit hook does this when Chrome is
// available):
//
//   node scripts/render-share-images.js           # stale/missing cards only
//   node scripts/render-share-images.js --force   # every card
//   node scripts/render-share-images.js --sheet [filter]
//       # also write a review page (outside the repo) showing each card,
//       # optionally only paths containing <filter>, at full size and in
//       # the crops Reddit, X and square-thumbnail platforms use
//
// Requires a Chrome binary (CHROME_BIN, or the default macOS path).
// tests/data/share-images.test.js checks hashes, sizes and orphans, so a
// card edit that skips this script fails the suite. Pixels are never
// compared: Chrome's font rasterisation differs between machines.
// ─────────────────────────────────────────────
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildSite, cardHash, CARD_W, CARD_H } = require('./generate-seo');

const ROOT = path.resolve(__dirname, '..');
const OG_DIR = path.join(ROOT, 'og');
const MANIFEST = path.join(OG_DIR, 'manifest.json');
const CONCURRENCY = 4;

function readManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch { return {}; }
}

function listPngs(dir = OG_DIR) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) return listPngs(abs);
    return e.name.endsWith('.png') ? [path.relative(ROOT, abs).split(path.sep).join('/')] : [];
  });
}

function findChrome() {
  const chrome = process.env.CHROME_BIN
    || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  return fs.existsSync(chrome) ? chrome : null;
}

function screenshot(chrome, htmlFile, pngFile, profileDir) {
  return new Promise((resolve, reject) => {
    execFile(chrome, [
      '--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      `--user-data-dir=${profileDir}`,
      `--screenshot=${pngFile}`, `--window-size=${CARD_W},${CARD_H}`, `file://${htmlFile}`,
    ], { timeout: 60000 }, err => (err ? reject(err) : resolve()));
  });
}

function writeSheet(cards, filter) {
  const shown = [...cards.keys()].filter(p => !filter || p.includes(filter)).sort();
  const dir = path.join(os.tmpdir(), 'share-card-sheet');
  fs.mkdirSync(dir, { recursive: true });
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const rows = shown.map(p => {
    const src = `file://${path.join(ROOT, p)}`;
    const crop = (cls, label) => `<figure><div class="f ${cls}"><img loading="lazy" src="${src}"></div><figcaption>${label}</figcaption></figure>`;
    return `<section><h2>${esc(p)}</h2><p class="alt">alt: ${esc(cards.get(p).alt)}</p><div class="row">
${crop('full', 'Full 1200×630 (Facebook, LinkedIn, Discord, Slack)')}
${crop('x', 'X large card, 2:1')}
${crop('r43', 'Reddit compact, 4:3 centre')}
${crop('sq', 'Square thumbnail (iMessage, WhatsApp)')}
</div></section>`;
  }).join('\n');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Share card review</title><style>
body{background:#e9eaee;font:14px -apple-system,sans-serif;margin:24px;color:#222}
h2{font-size:15px;margin:28px 0 2px}.alt{margin:0 0 8px;color:#555;font-size:12px}
.row{display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap}figure{margin:0}
figcaption{font-size:12px;color:#555;margin-top:4px}
.f{overflow:hidden;border-radius:8px;box-shadow:0 1px 4px #0003}.f img{width:100%;height:100%;object-fit:cover;display:block}
.full{width:600px;height:315px}.x{width:500px;height:250px}.r43{width:160px;height:120px}.sq{width:120px;height:120px}
</style></head><body><h1>Share card review (${shown.length} cards)</h1>
${rows}
</body></html>`;
  const out = path.join(dir, 'index.html');
  fs.writeFileSync(out, html);
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const sheetAt = args.indexOf('--sheet');
  const sheetFilter = sheetAt >= 0 && args[sheetAt + 1] && !args[sheetAt + 1].startsWith('--') ? args[sheetAt + 1] : '';

  const { cards } = buildSite();
  const old = readManifest();
  const manifest = {};
  const todo = [];
  for (const [p, card] of cards) {
    const h = cardHash(card.html);
    manifest[p] = h;
    if (force || old[p] !== h || !fs.existsSync(path.join(ROOT, p))) todo.push({ p, card });
  }

  let removed = 0;
  for (const p of listPngs()) {
    if (!cards.has(p)) { fs.unlinkSync(path.join(ROOT, p)); removed++; }
  }

  const failed = [];
  if (todo.length) {
    const chrome = findChrome();
    if (!chrome) {
      console.error(
        `render-share-images: ${todo.length} card(s) need rendering but there is no Chrome binary.\n` +
        'Set CHROME_BIN to a Chrome/Chromium executable and rerun.');
      process.exit(1);
    }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'share-cards-'));
    let next = 0, done = 0;
    const worker = async w => {
      const profile = path.join(tmp, `profile-${w}`);
      while (next < todo.length) {
        const i = next++;
        const { p, card } = todo[i];
        const src = path.join(tmp, `card-${i}.html`);
        const shot = path.join(tmp, `card-${i}.png`);
        fs.writeFileSync(src, card.html);
        try {
          await screenshot(chrome, src, shot, profile);
          const out = path.join(ROOT, p);
          fs.mkdirSync(path.dirname(out), { recursive: true });
          fs.copyFileSync(shot, out);
        } catch (e) {
          failed.push(p);
          delete manifest[p];
          console.error(`render-share-images: failed ${p}: ${e.message}`);
        }
        if (++done % 25 === 0) console.log(`  ${done}/${todo.length}`);
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, todo.length) }, (_, w) => worker(w)));
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  fs.mkdirSync(OG_DIR, { recursive: true });
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map(k => [k, manifest[k]]));
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`render-share-images: ${cards.size} cards (${todo.length - failed.length} rendered, ${removed} orphans removed${failed.length ? `, ${failed.length} FAILED` : ''})`);

  if (sheetAt >= 0) console.log(`render-share-images: review sheet at ${writeSheet(cards, sheetFilter)}`);
  if (failed.length) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
