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
// Known copies enforced here:
//   logo mark     → engine.js, scripts/generate-seo.js, about.html, privacy.html, favicon.svg
//   accent hexes  → logo circles, favicon circles, about/privacy inline styles
//   accent rgba   → engine.css + generate-seo.js VS_CSS fallback tints (whitelist scan)
//   theme-color   → about.html, privacy.html, scripts/generate-seo.js (assetLinks)
//
// Not enforceable cheaply: apple-touch-icon.png pixels — re-render it
// (headless Chrome, see the design change tasks) when the mark changes.
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
const BG_DEEP = token('bg-deep');
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
const LOGO_COPIES = ['engine.js', 'scripts/generate-seo.js', 'about.html', 'privacy.html', 'favicon.svg'];

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

// ─── theme-color metas match --bg-deep ───────────────────────
for (const file of ['about.html', 'privacy.html', 'scripts/generate-seo.js']) {
  test(`[${file}] theme-color equals --bg-deep`, () => {
    const metas = [...read(file).matchAll(/name="theme-color" content="(#[0-9A-Fa-f]{6})"/g)];
    assert.ok(metas.length > 0, `${file}: no theme-color meta found`);
    for (const m of metas) {
      assert.equal(m[1].toUpperCase(), BG_DEEP,
        `${file}: theme-color ${m[1]} is stale — --bg-deep is ${BG_DEEP}`);
    }
  });
}

// ─── Self-contained token copies carry the current palette ───
for (const file of ['about.html', 'privacy.html']) {
  test(`[${file}] self-contained styles use the current tokens`, () => {
    const src = read(file).toUpperCase();
    for (const [name, hex] of [['bg-deep', BG_DEEP], ['accent-primary', ACCENT_PRIMARY]]) {
      assert.ok(src.includes(hex),
        `${file}: does not contain ${hex} (--${name}) — its inline token copy is stale`);
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
