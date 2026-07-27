#!/usr/bin/env node
// ─────────────────────────────────────────────
// TOUCH-ICON RENDERER
//
// Renders apple-touch-icon.png (180×180, the Framed Duo mark centered
// on a solid --bg-deep background) from the canonical identity sources:
// assets/logo.svg and the engine.css tokens. Run after any rebrand:
//
//   node scripts/render-touch-icon.js
//
// Requires a Chrome binary (headless screenshot). qlmanage is NOT a
// substitute — it letterboxes SVGs with white padding.
// tests/data/touch-icon.test.js pixel-verifies the committed PNG, so a
// rebrand that skips this script fails the suite.
// ─────────────────────────────────────────────
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { identityToken, logoMark } = require('./generate-seo');

const ROOT = path.resolve(__dirname, '..');

const chrome = process.env.CHROME_BIN
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!fs.existsSync(chrome)) {
  console.error(
    `render-touch-icon: no Chrome binary at "${chrome}".\n` +
    'Set CHROME_BIN to a Chrome/Chromium executable and rerun.');
  process.exit(1);
}

// Re-house the mark's elements (64-unit coordinate space) inside an
// 80-unit padded canvas: 8 units of margin on every side.
const markInner = logoMark().replace(/<svg[^>]*>/, '').replace('</svg>', '');
const bg = identityToken('bg-deep');
const html = `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="180" height="180" style="display:block">
  <rect width="80" height="80" fill="${bg}"/>
  <g transform="translate(8 8)">${markInner}</g>
</svg>
</body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'touch-icon-'));
const src = path.join(tmp, 'icon.html');
const shot = path.join(tmp, 'icon.png');
fs.writeFileSync(src, html);
execFileSync(chrome, [
  '--headless', '--disable-gpu', '--hide-scrollbars',
  `--screenshot=${shot}`, '--window-size=180,180', `file://${src}`,
], { stdio: 'pipe' });

const out = path.join(ROOT, 'apple-touch-icon.png');
fs.copyFileSync(shot, out);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`render-touch-icon: wrote ${path.relative(ROOT, out)} (bg ${bg})`);
