// Tier 1 — apple-touch-icon.png is pixel-verified against the identity
// tokens: 180×180 with --bg-deep corners. A rebrand that changes
// --bg-deep (or the mark) without rerunning scripts/render-touch-icon.js
// fails here. The PNG is decoded with node's zlib only — no new deps.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..', '..');
const TOLERANCE = 3; // per-channel; absorbs renderer sRGB rounding

function decodePng(file) {
  const data = fs.readFileSync(file);
  assert.equal(data.readUInt32BE(0), 0x89504e47, `${file}: not a PNG`);
  let pos = 8, idat = [], w, h, bitDepth, colorType;
  while (pos < data.length) {
    const len = data.readUInt32BE(pos);
    const type = data.toString('ascii', pos + 4, pos + 8);
    const chunk = data.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      w = chunk.readUInt32BE(0); h = chunk.readUInt32BE(4);
      bitDepth = chunk[8]; colorType = chunk[9];
      assert.equal(bitDepth, 8, 'expected 8-bit channels');
      assert.equal(chunk[12], 0, 'interlaced PNGs not supported');
      assert.ok(colorType === 2 || colorType === 6, `unsupported color type ${colorType}`);
    }
    if (type === 'IDAT') idat.push(chunk);
    pos += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  let prev = Buffer.alloc(stride);
  for (let y = 0, p = 0; y < h; y++) {
    const filter = raw[p++];
    const row = Buffer.from(raw.subarray(p, p + stride)); p += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? row[x - bpp] : 0;   // left
      const b = prev[x];                        // up
      const c = x >= bpp ? prev[x - bpp] : 0;   // up-left
      if (filter === 1) row[x] = (row[x] + a) & 255;
      else if (filter === 2) row[x] = (row[x] + b) & 255;
      else if (filter === 3) row[x] = (row[x] + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        row[x] = (row[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    row.copy(out, y * stride);
    prev = row;
  }
  const px = (x, y) => {
    const i = y * stride + x * bpp;
    return [out[i], out[i + 1], out[i + 2]];
  };
  return { w, h, px };
}

function tokenRgb(name) {
  const css = fs.readFileSync(path.join(ROOT, 'engine.css'), 'utf8');
  const m = css.match(new RegExp(`--${name}:\\s*#([0-9A-Fa-f]{6})`));
  assert.ok(m, `engine.css must define --${name}`);
  return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16));
}

test('apple-touch-icon.png is 180×180 with --bg-deep corners (rerun scripts/render-touch-icon.js)', () => {
  const icon = decodePng(path.join(ROOT, 'apple-touch-icon.png'));
  assert.equal(icon.w, 180, 'width must be 180');
  assert.equal(icon.h, 180, 'height must be 180');
  const bg = tokenRgb('bg-deep');
  for (const [x, y] of [[2, 2], [177, 2], [2, 177], [177, 177]]) {
    const p = icon.px(x, y);
    for (let ch = 0; ch < 3; ch++) {
      assert.ok(Math.abs(p[ch] - bg[ch]) <= TOLERANCE,
        `corner (${x},${y}) is rgb(${p.join(',')}) but --bg-deep is rgb(${bg.join(',')}) — icon is stale, run: node scripts/render-touch-icon.js`);
    }
  }
});
