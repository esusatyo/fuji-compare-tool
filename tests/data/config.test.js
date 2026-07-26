// Tier 1 — BRAND_CONFIG and REGISTERED_BRANDS integrity, per brand.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');
const { HTTPS_URL } = require('../helpers/schema');

const allBrands = brandDirs();

for (const brand of allBrands) {
  const { data } = loadBrand(brand);
  const cfg = data.BRAND_CONFIG;

  test(`[${brand}] BRAND_CONFIG has required top-level fields`, () => {
    assert.equal(typeof cfg.name, 'string');
    assert.ok(cfg.name.trim(), 'name is empty');
    assert.equal(cfg.slug, brand, 'slug must match directory name');
    assert.ok(Array.isArray(cfg.families) && cfg.families.length, 'families must be a non-empty array');
    assert.ok(Array.isArray(cfg.brandSections), 'brandSections must be an array');
    assert.equal(typeof cfg.mount, 'string', 'mount must be a string');
    assert.ok(cfg.mount.trim(), 'mount is empty');
  });

  test(`[${brand}] flagship resolves to a real, current camera`, () => {
    assert.equal(typeof cfg.flagship, 'string', 'flagship must be a camera slug string');
    const cam = data.CAMERAS[cfg.flagship];
    assert.ok(cam, `flagship "${cfg.flagship}" is not a camera in CAMERAS`);
    assert.ok(!cam.discontinued, `flagship "${cfg.flagship}" should be a current camera`);
  });

  test(`[${brand}] BRAND_CONFIG has no per-brand theming fields (design system owns page colors)`, () => {
    for (const field of ['accentColor', 'heroDark', 'logoText', 'logoAccent']) {
      assert.ok(!(field in cfg), `${field} is no longer part of the BRAND_CONFIG contract`);
    }
  });

  test(`[${brand}] cameras/lenses sub-config is well-formed`, () => {
    for (const mode of ['cameras', 'lenses']) {
      const m = cfg[mode];
      assert.ok(m, `${mode} config missing`);
      for (const key of ['heroEyebrow', 'heroTitle', 'heroSubtitle', 'headerTitle']) {
        assert.equal(typeof m[key], 'string', `${mode}.${key} must be a string`);
        assert.ok(m[key].trim(), `${mode}.${key} is empty`);
      }
      assert.ok(Array.isArray(m.defaultSelected), `${mode}.defaultSelected must be an array`);
      assert.ok(m.defaultSelected.length >= 1 && m.defaultSelected.length <= 3,
        `${mode}.defaultSelected must hold 1–3 ids`);
      assert.equal(new Set(m.defaultSelected).size, m.defaultSelected.length,
        `${mode}.defaultSelected has duplicates`);
    }
  });

  test(`[${brand}] footerLinks are valid`, () => {
    assert.ok(Array.isArray(cfg.footerLinks), 'footerLinks must be an array');
    for (const link of cfg.footerLinks) {
      assert.ok(link.label && typeof link.label === 'string', 'footer link missing label');
      assert.match(link.url, HTTPS_URL, `footer link url invalid: ${link.url}`);
    }
  });

  test(`[${brand}] REGISTERED_BRANDS includes this brand and only real brands`, () => {
    const slugs = data.REGISTERED_BRANDS.map(b => b.slug);
    assert.ok(slugs.includes(brand), `REGISTERED_BRANDS must include "${brand}"`);
    for (const b of data.REGISTERED_BRANDS) {
      assert.ok(b.slug && b.name, 'registered brand needs slug + name');
      assert.ok(allBrands.includes(b.slug), `registered brand "${b.slug}" has no directory`);
    }
  });
}

test('all brands register the same brand list (consistent switcher)', () => {
  const lists = allBrands.map(b => {
    const { data } = loadBrand(b);
    return data.REGISTERED_BRANDS.map(x => x.slug).sort().join(',');
  });
  assert.equal(new Set(lists).size, 1, `REGISTERED_BRANDS differ between brands: ${lists.join(' | ')}`);
});
