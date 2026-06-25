// Fill non-USD launch prices for CURRENT items of any brand.
//
// Official per-region RRP isn't retrievable in bulk (Wikipedia lists USD only;
// retailer search returns current street prices). So, per the agreed approach,
// these are APPROXIMATE launch RRPs derived from the known USD RRP using
// regional ratios, anchored to any confirmed figures in an optional per-brand
// overrides file. USD is exact. Refine individual cells as real RRP surfaces.
//
//   node scripts/compute-prices.js [brand] [cameras|lenses]
//   node scripts/compute-prices.js canon cameras      (default)
//   node scripts/compute-prices.js fujifilm lenses
//
// Optional confirmed overrides: scripts/price-overrides/<brand>.json
//   { "<id>": { "AUD": 2349, "JPY": 648000 }, ... }
const fs = require('fs');
const path = require('path');
const { loadBrand } = require('../tests/helpers/load-brand');

// Ratio of regional RRP to USD (incl. local VAT/GST for GB/EU/AU/SG).
const RATIO = { GBP: 0.90, EUR: 1.15, AUD: 1.56, CAD: 1.30, SGD: 1.45 };
// JPY/USD varies by launch era, so key it by year.
const JPY_BY_YEAR = { 2018: 113, 2019: 113, 2020: 120, 2021: 128, 2022: 140, 2023: 147, 2024: 151, 2025: 154, 2026: 156 };

const round99 = v => Math.round(v / 100) * 100 - 1;      // -> ...99
const roundJpy = v => Math.round(v / 1000) * 1000;       // -> nearest 1000

function loadOverrides(brand) {
  const f = path.resolve(__dirname, 'price-overrides', `${brand}.json`);
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return {}; }
}

function computePrices(id, usd, year, overrides) {
  const o = overrides[id] || {};
  const p = { USD: usd };
  for (const cur of ['AUD', 'EUR', 'GBP', 'CAD', 'SGD']) {
    p[cur] = o[cur] != null ? o[cur] : round99(usd * RATIO[cur]);
  }
  const jpyRate = JPY_BY_YEAR[year] || 150;
  p.JPY = o.JPY != null ? o.JPY : roundJpy(usd * jpyRate);
  return p;
}

function patchPrices(src, id, prices) {
  const idIdx = src.indexOf(`'${id}':`);
  if (idIdx === -1) throw new Error(`id ${id} not found`);
  const start = src.indexOf('prices:{', idIdx);
  const end = src.indexOf('}', start);
  if (start === -1 || end === -1) throw new Error(`prices block not found for ${id}`);
  const body = ['USD', 'AUD', 'EUR', 'GBP', 'JPY', 'CAD', 'SGD'].map(c => `${c}:${prices[c]}`).join(',');
  return src.slice(0, start) + `prices:{${body}}` + src.slice(end + 1);
}

function main() {
  const brand = process.argv[2] || 'canon';
  const category = (process.argv[3] || 'cameras').toLowerCase();
  const key = category === 'lenses' ? 'LENSES' : 'CAMERAS';

  const file = path.resolve(__dirname, '..', brand, 'data.js');
  let src = fs.readFileSync(file, 'utf8');
  const { data } = loadBrand(brand);
  const overrides = loadOverrides(brand);

  let n = 0;
  for (const [id, it] of Object.entries(data[key])) {
    if (it.discontinued) continue;          // discontinued items keep USD-only
    if (it.priceIncomplete) continue;        // explicit "no regional RRP" flag — leave it
    if (it.prices.AUD != null) continue;     // already has regional prices
    if (typeof it.prices.USD !== 'number') continue;
    const prices = computePrices(id, it.prices.USD, it.year, overrides);
    src = patchPrices(src, id, prices);
    n++;
    console.error(`✓ ${id} ${JSON.stringify(prices)}`);
  }
  fs.writeFileSync(file, src);
  console.log(`\nFilled prices for ${n} current ${category} in ${brand}/data.js.`);
}

main();
