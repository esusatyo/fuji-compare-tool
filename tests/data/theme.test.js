// Tier 1 — Light/Dark/System theme wiring: engine.css defines both palettes,
// theme.js is loaded on every page, and the root landing page no longer
// carries a hardcoded brand-list line above its title.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { brandDirs, ROOT } = require('../helpers/load-brand');

const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const css = read('engine.css');
const themeJs = read('theme.js');

test('theme.js exists and owns the theme-pref storage key', () => {
  assert.match(themeJs, /theme-pref/);
});

test('engine.css defines a light theme block with every core token', () => {
  const block = css.match(/:root\[data-theme="light"\]\s*\{([^}]*)\}/);
  assert.ok(block, ':root[data-theme="light"] block not found');
  for (const token of ['bg-deep', 'bg-surface', 'bg-surface-2', 'border',
    'text-primary', 'text-secondary', 'accent-primary', 'accent-secondary']) {
    assert.match(block[1], new RegExp(`--${token}:`), `light theme missing --${token}`);
  }
});

test('dark (default) :root sets color-scheme: dark; light override sets color-scheme: light', () => {
  assert.match(css, /:root\s*\{[^}]*color-scheme:\s*dark;/);
  const block = css.match(/:root\[data-theme="light"\]\s*\{([^}]*)\}/)[1];
  assert.match(block, /color-scheme:\s*light;/);
});

test('#site-header uses a --header-bg token, not flat --bg-surface (one shared tone, no per-brand colors)', () => {
  assert.match(css, /#site-header\s*\{[^}]*background:\s*var\(--header-bg\)/s);
  const darkBlock = css.match(/:root\s*\{([^}]*)\}/)[1];
  const lightBlock = css.match(/:root\[data-theme="light"\]\s*\{([^}]*)\}/)[1];
  assert.match(darkBlock, /--header-bg:/, 'dark theme missing --header-bg');
  assert.match(lightBlock, /--header-bg:/, 'light theme missing --header-bg');
  // Light gets an actual tint (derived from --accent-primary), not plain white.
  assert.match(lightBlock, /--header-bg:\s*color-mix\(in srgb,\s*var\(--accent-primary\)/);
});

const pagesWithTheme = [
  'index.html', 'about.html', 'privacy.html', 'compare/index.html',
  ...brandDirs().map(b => `${b}/index.html`),
];

for (const page of pagesWithTheme) {
  test(`[${page}] loads theme.js`, () => {
    const html = read(page);
    assert.match(html, /<script src="\.*\/?theme\.js"><\/script>/,
      `${page}: missing <script src="...theme.js">`);
  });
}

test('root landing page no longer hardcodes a brand-list line above the title', () => {
  const html = read('index.html');
  assert.ok(!html.includes('hero-eyebrow'), 'root page should no longer render a hero-eyebrow');
});
