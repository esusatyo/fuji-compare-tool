const { JSDOM } = require('jsdom');
const fs = require('fs');
const brands = fs.readdirSync('.').filter(d => fs.existsSync(d + '/data.js'));
for (const b of brands) {
  const dom = new JSDOM('<!doctype html>', { runScripts: 'dangerously' });
  dom.window.BRAND_DATA = {};
  const s = dom.window.document.createElement('script');
  s.textContent = fs.readFileSync(b + '/data.js', 'utf8');
  dom.window.document.body.appendChild(s);
  const key = Object.keys(dom.window.BRAND_DATA)[0];
  const data = dom.window.BRAND_DATA[key];
  const C = data.CAMERAS, L = data.LENSES;
  let camsLive = 0, camsNoAsin = 0, camsNoSpecSrc = 0, camsNoPriceSrc = 0;
  let lensLive = 0, lensNoAsin = 0, lensNoSpecSrc = 0, lensNoPriceSrc = 0;
  for (const [id, it] of Object.entries(C)) {
    if (it.discontinued) continue;
    camsLive++;
    if (!it.asin) camsNoAsin++;
    if (!it.specSources) camsNoSpecSrc++;
    if (!it.priceSource) camsNoPriceSrc++;
  }
  for (const [id, it] of Object.entries(L)) {
    if (it.discontinued) continue;
    lensLive++;
    if (!it.asin) lensNoAsin++;
    if (!it.specSources) lensNoSpecSrc++;
    if (!it.priceSource) lensNoPriceSrc++;
  }
  console.log(b, JSON.stringify({camsLive, camsNoAsin, camsNoSpecSrc, camsNoPriceSrc, lensLive, lensNoAsin, lensNoSpecSrc, lensNoPriceSrc}));
}
