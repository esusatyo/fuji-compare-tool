// Tier 1 — brand-identity sync. The design system's sources of truth are:
//
//   assets/logo.svg          — canonical Framed Duo mark geometry + colors
//   engine.css :root tokens  — --bg-deep / --accent-primary / --accent-secondary
//
// but for good reasons (file:// support, self-contained pages, rgba
// fallbacks for color-mix) several files carry literal copies. This test
// pins every copy to the source of truth so a rebrand is mechanical:
// change assets/logo.svg and the engine.css tokens, run npm test, and
// the failures list every file still carrying the old identity.
//
// Known copies enforced here (everything else is generated from the
// canonical sources and covered by the seo regeneration freshness gate):
//   logo mark     → engine.js (runtime code can't read files), favicon.svg
//   accent hexes  → logo circles, favicon circles
//   accent rgba   → engine.css + generate-seo.js VS_CSS fallback tints (whitelist scan)
//
// apple-touch-icon.png pixels are enforced by tests/data/touch-icon.test.js;
// re-render via scripts/render-touch-icon.js when the identity changes.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// ─── Sources of truth ────────────────────────
const logo = read('assets/logo.svg');
const css = read('engine.css');

const token = name => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(m, `engine.css must define --${name} as a 6-digit hex token`);
  return m[1].toUpperCase();
};
const ACCENT_PRIMARY = token('accent-primary');
const ACCENT_SECONDARY = token('accent-secondary');

const pathD = (() => {
  const m = logo.match(/\bd="([^"]+)"/);
  assert.ok(m, 'assets/logo.svg must contain the bracket path');
  return m[1];
})();

const circles = [...logo.matchAll(/<circle cx="(\d+)" cy="(\d+)" r="(\d+)" fill="(#[0-9A-Fa-f]{6})"/g)]
  .map(m => ({ cx: m[1], cy: m[2], r: m[3], fill: m[4].toUpperCase() }));

test('canonical logo has two circles filled with the accent tokens', () => {
  assert.equal(circles.length, 2, 'assets/logo.svg must contain exactly two circles');
  assert.deepEqual(circles.map(c => c.fill), [ACCENT_PRIMARY, ACCENT_SECONDARY],
    'logo circle fills must be --accent-primary then --accent-secondary');
});

// ─── Inline logo copies match the canonical mark ─────────────
// Only genuine duplicates are listed: everything else (vs pages,
// landing, about/privacy identity blocks) is generated from
// assets/logo.svg at build time and covered by the regeneration
// freshness gate. engine.js stays inline because runtime code cannot
// read files; favicon.svg is a distinct artifact by nature.
const LOGO_COPIES = ['engine.js', 'favicon.svg'];

for (const file of LOGO_COPIES) {
  test(`[${file}] inline logo matches assets/logo.svg`, () => {
    const src = read(file);
    assert.ok(src.includes(`d="${pathD}"`),
      `${file}: bracket path differs from assets/logo.svg — sync the mark`);
    for (const c of circles) {
      const frag = `cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${c.fill}"`;
      assert.ok(src.toUpperCase().includes(frag.toUpperCase()),
        `${file}: missing circle ${frag} — sync the mark from assets/logo.svg`);
    }
  });
}

// ─── rgba fallbacks derive from the accent tokens ────────────
// engine.css and the generator's VS_CSS carry rgba() fallbacks (for the
// color-mix winner tint and the pill fills). Every rgba triplet in those
// files must be one of: an accent token, the neutral text-secondary, or
// plain black/white — anything else is a stale color from a past palette.
const hexTriplet = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',');
const NEUTRAL = token('text-secondary');
const ALLOWED = new Set([
  hexTriplet(ACCENT_PRIMARY), hexTriplet(ACCENT_SECONDARY), hexTriplet(NEUTRAL),
  '0,0,0', '255,255,255',
]);

for (const file of ['engine.css', 'scripts/generate-seo.js']) {
  test(`[${file}] every rgba() triplet is a current token (no stale palette)`, () => {
    const triplets = [...read(file).matchAll(/rgba\((\d+),\s*(\d+),\s*(\d+)/g)]
      .map(m => `${+m[1]},${+m[2]},${+m[3]}`);
    assert.ok(triplets.length > 0, `${file}: expected rgba() fallbacks`);
    for (const t of triplets) {
      assert.ok(ALLOWED.has(t),
        `${file}: rgba(${t},…) matches no current token — allowed: ${[...ALLOWED].join(' | ')}`);
    }
  });

  test(`[${file}] accent rgba fallbacks are present`, () => {
    const src = read(file);
    for (const hex of [ACCENT_PRIMARY, ACCENT_SECONDARY]) {
      assert.ok(src.includes(`rgba(${hexTriplet(hex)}`),
        `${file}: no rgba fallback derived from ${hex}`);
    }
  });
}
