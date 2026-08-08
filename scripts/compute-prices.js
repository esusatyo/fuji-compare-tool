// Fill non-USD prices for CURRENT items of any brand, or recompute them after a
// USD price change.
//
// Official per-region RRP isn't retrievable in bulk (Wikipedia lists USD only;
// retailer search returns current street prices). So, per the agreed approach,
// these are APPROXIMATE RRPs derived from the known USD RRP using regional
// ratios, anchored to any confirmed figures in an optional per-brand overrides
// file. USD is exact — hand-edit it first, from a single credible source (the
// refresh-camera-data skill's "one source is enough for a routine price" rule
// applies here too). Refine individual cells as real RRP surfaces.
//
// Fill mode (default) — populate currencies for items that don't have them yet:
//   node scripts/compute-prices.js [brand] [cameras|lenses]
//   node scripts/compute-prices.js canon cameras      (default)
//   node scripts/compute-prices.js fujifilm lenses
//
// Recompute mode — after hand-editing USD on EXISTING entries during a refresh,
// re-derive every currency field that's already a number, using today's ratios;
// fields that are currently null stay null (so a priceIncomplete lens that only
// has AUD/CAD populated gets just those two refreshed — EUR/GBP/JPY/SGD stay
// null, exactly as before):
//   node scripts/compute-prices.js [brand] [cameras|lenses] --recompute
//   node scripts/compute-prices.js [brand] [cameras|lenses] --recompute --ids=z9,z8
//
// Optional confirmed overrides: scripts/price-overrides/<brand>.json
//   { "<id>": { "AUD": 2349, "JPY": 648000 }, ... }
const fs = require('fs');
const path = require('path');
const { loadBrand } = require('../tests/helpers/load-brand');

// Ratio of regional RRP to USD (incl. local VAT/GST for GB/EU/AU/SG).
const RATIO = { GBP: 0.90, EUR: 1.15, AUD: 1.56, CAD: 1.30, SGD: 1.45 };
// JPY/USD varies by year, so key it by year. Fill mode uses the item's launch
// year (an original RRP reflects that era's rate); recompute mode uses the
// current calendar year (a re-derived price should reflect today's rate).
const JPY_BY_YEAR = { 2018: 113, 2019: 113, 2020: 120, 2021: 128, 2022: 140, 2023: 147, 2024: 151, 2025: 154, 2026: 156 };
const LATEST_JPY_YEAR = Math.max(...Object.keys(JPY_BY_YEAR).map(Number));
const jpyRateForYear = year => JPY_BY_YEAR[year] || JPY_BY_YEAR[LATEST_JPY_YEAR];

const round99 = v => Math.round(v / 100) * 100 - 1;      // -> ...99
const roundJpy = v => Math.round(v / 1000) * 1000;       // -> nearest 1000

function loadOverrides(brand) {
  const f = path.resolve(__dirname, 'price-overrides', `${brand}.json`);
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return {}; }
}

// Fill mode: derive every non-USD currency from scratch.
function computePrices(id, usd, year, overrides) {
  const o = overrides[id] || {};
  const p = { USD: usd };
  for (const cur of ['AUD', 'EUR', 'GBP', 'CAD', 'SGD']) {
    p[cur] = o[cur] != null ? o[cur] : round99(usd * RATIO[cur]);
  }
  p.JPY = o.JPY != null ? o.JPY : roundJpy(usd * jpyRateForYear(year));
  return p;
}

// Recompute mode: only touch currency fields that are ALREADY a number — a
// null stays null, so a deliberately-incomplete item doesn't get currencies
// invented for it just because its USD changed.
function recomputePrices(id, usd, existing, overrides) {
  const o = overrides[id] || {};
  const p = { USD: usd };
  for (const cur of ['AUD', 'EUR', 'GBP', 'CAD', 'SGD']) {
    p[cur] = existing[cur] == null ? null : (o[cur] != null ? o[cur] : round99(usd * RATIO[cur]));
  }
  const currentYear = new Date().getFullYear();
  p.JPY = existing.JPY == null ? null : (o.JPY != null ? o.JPY : roundJpy(usd * jpyRateForYear(currentYear)));
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
  const rawArgs = process.argv.slice(2);
  const flags = rawArgs.filter(a => a.startsWith('--'));
  const positional = rawArgs.filter(a => !a.startsWith('--'));
  const brand = positional[0] || 'canon';
  const category = (positional[1] || 'cameras').toLowerCase();
  const key = category === 'lenses' ? 'LENSES' : 'CAMERAS';
  const recompute = flags.includes('--recompute');
  const idsFlag = flags.find(f => f.startsWith('--ids='));
  const onlyIds = idsFlag ? new Set(idsFlag.slice('--ids='.length).split(',')) : null;

  const file = path.resolve(__dirname, '..', brand, 'data.js');
  let src = fs.readFileSync(file, 'utf8');
  const { data } = loadBrand(brand);
  const overrides = loadOverrides(brand);

  let n = 0;
  for (const [id, it] of Object.entries(data[key])) {
    if (onlyIds && !onlyIds.has(id)) continue;
    if (it.discontinued) continue;           // discontinued items keep USD-only
    if (typeof it.prices.USD !== 'number') continue;

    let prices;
    if (recompute) {
      prices = recomputePrices(id, it.prices.USD, it.prices, overrides);
    } else {
      if (it.priceIncomplete) continue;       // explicit "no regional RRP" flag — leave it
      if (it.prices.AUD != null) continue;    // already has regional prices
      prices = computePrices(id, it.prices.USD, it.year, overrides);
    }
    src = patchPrices(src, id, prices);
    n++;
    console.error(`✓ ${id} ${JSON.stringify(prices)}`);
  }
  fs.writeFileSync(file, src);
  const verb = recompute ? 'Recomputed' : 'Filled';
  console.log(`\n${verb} prices for ${n} ${category} in ${brand}/data.js.`);
}

main();
