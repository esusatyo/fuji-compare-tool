// Fill non-USD launch prices for CURRENT Canon cameras.
//
// Official per-region RRP isn't retrievable in bulk (Wikipedia lists USD only;
// retailer search returns current street prices). So, per the agreed approach,
// these are APPROXIMATE launch RRPs derived from the known USD RRP using
// regional ratios, anchored to the few real figures we could confirm
// (overrides below). USD is exact. Refine individual cells as real RRP surfaces.
//
//   node scripts/compute-prices.js
const fs = require('fs');
const path = require('path');
const { loadBrand } = require('../tests/helpers/load-brand');

// Ratio of regional RRP to USD (incl. local VAT/GST for GB/EU/AU/SG).
const RATIO = { GBP: 0.90, EUR: 1.15, AUD: 1.56, CAD: 1.30, SGD: 1.45 };
// JPY/USD varies by launch era, so key it by year.
const JPY_BY_YEAR = { 2018: 113, 2019: 113, 2020: 120, 2021: 128, 2022: 140, 2023: 147, 2024: 151, 2025: 154 };

// Real, sourced figures that override the derived value.
const OVERRIDES = {
  'eos-r7': { GBP: 1349, AUD: 2349 },
  'eos-r5-ii': { AUD: 6699, JPY: 648000 },
};

const round99 = v => Math.round(v / 100) * 100 - 1;      // -> ...99
const roundJpy = v => Math.round(v / 1000) * 1000;       // -> nearest 1000

function computePrices(id, usd, year) {
  const o = OVERRIDES[id] || {};
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
  const file = path.resolve(__dirname, '..', 'canon', 'data.js');
  let src = fs.readFileSync(file, 'utf8');
  const { data } = loadBrand('canon');

  let n = 0;
  for (const [id, c] of Object.entries(data.CAMERAS)) {
    if (c.discontinued) continue;            // discontinued bodies keep USD-only
    if (c.prices.AUD != null) continue;       // already has regional prices
    const prices = computePrices(id, c.prices.USD, c.year);
    src = patchPrices(src, id, prices);
    n++;
    console.error(`✓ ${id} ${JSON.stringify(prices)}`);
  }
  fs.writeFileSync(file, src);
  console.log(`\nFilled prices for ${n} current camera(s).`);
}

main();
