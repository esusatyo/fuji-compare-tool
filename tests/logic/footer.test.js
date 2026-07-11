// Tier 2 — Footer trust elements: config-driven verification date,
// About/Privacy links, inert affiliate-disclosure slot, and graceful
// degradation when site-config.js is absent.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadBrand, brandDirs } = require('../helpers/load-brand');

for (const brand of brandDirs()) {
  test(`[${brand}] footer shows the config-driven verification date`, () => {
    const { window } = loadBrand(brand, { engine: true });
    const cfg = window.__SITE__.SITE_CONFIG;
    const footer = window.document.querySelector('footer');
    assert.ok(footer.textContent.includes(`last verified: ${cfg.dataVerified}`),
      'footer must state the dataVerified date from SITE_CONFIG');
    assert.ok(!footer.textContent.includes('April 2026'), 'stale hardcoded date must be gone');
  });

  test(`[${brand}] footer links to About and Privacy`, () => {
    const { window } = loadBrand(brand, { engine: true });
    const hrefs = [...window.document.querySelectorAll('footer a')].map(a => a.getAttribute('href'));
    assert.ok(hrefs.includes('../about.html'), 'missing About link');
    assert.ok(hrefs.includes('../privacy.html'), 'missing Privacy link');
  });

  test(`[${brand}] affiliate-disclosure slot exists and is empty pre-launch`, () => {
    const { window } = loadBrand(brand, { engine: true });
    const slot = window.document.getElementById('affiliate-disclosure');
    assert.ok(slot, 'disclosure slot missing');
    assert.equal(slot.textContent.trim(), '', 'disclosure slot must be empty until activated');
  });

  test(`[${brand}] engine works without site-config (date line omitted, no errors)`, () => {
    const { window } = loadBrand(brand, { engine: true, siteConfig: false });
    const footer = window.document.querySelector('footer');
    assert.ok(footer, 'footer must still render');
    assert.ok(!footer.textContent.includes('last verified'),
      'verified line must be omitted when SITE_CONFIG is absent');
  });
}
