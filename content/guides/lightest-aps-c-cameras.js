// Guide: the lightest APS-C cameras. Prose approved by the owner 2026-11-17.
'use strict';

const BRAND_SERIES = { fujifilm: 1, canon: 2, sony: 3, nikon: 4 };
// Each ranked camera links to an indexable comparison (pinned in
// scripts/generate-seo.js where needed). A camera without one falls back to
// the cross-brand tool.
const LINK = {
  'fujifilm:x-m5': 'vs/sony-zv-e10-ii-vs-fujifilm-x-m5',
  'canon:eos-r100': 'canon/vs/eos-r50-vs-eos-r100',
  'canon:eos-r50v': 'canon/vs/eos-r50v-vs-eos-r50',
  'canon:eos-r50': 'vs/fujifilm-x-m5-vs-canon-eos-r50',
  'sony:zv-e10-ii': 'vs/sony-zv-e10-ii-vs-fujifilm-x-m5',
  'fujifilm:x-t30iii': 'fujifilm/vs/x-t30iii-vs-x-t30ii',
};
const FIRST_YEAR = 2016;
const LAST_YEAR = 2025;

const isApsc = c => /APS-C|X-Trans|Bayer CMOS/.test(c.sensorType) && !/Full-frame|APS-H/.test(c.sensorType);
const pick = (b, brandName, id, c) => ({
  b, id, brand: brandName, name: c.name, weight: c.weight, year: c.year,
  width: c.width, height: c.height, depth: c.depth, usd: c.prices.USD, ibis: !!c.ibis,
});

module.exports = {
  slug: 'lightest-aps-c-cameras',
  title: 'Lightest APS-C Cameras in 2026, Ranked by Weight',
  headline: 'The lightest APS-C cameras, ranked',
  dek: 'Ten years of camera launches, one remarkably stubborn number.',
  published: '2026-11-17',
  query: {
    text: 'lightest APS-C camera',
    evidence: 'Size and weight queries lead Bing and Search Console (Nov 2026): "camera size comparison", "compare cameras size"; only the homepage earns them.',
  },

  snapshot(brandData) {
    const all = [];
    for (const [b, data] of Object.entries(brandData)) {
      for (const [id, c] of Object.entries(data.CAMERAS)) {
        if (isApsc(c)) all.push({ ...pick(b, data.BRAND_CONFIG.name, id, c), current: !c.discontinued && !c.preRelease });
      }
    }
    all.sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name));
    const years = [];
    for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) {
      const w = all.filter(c => c.year === y)[0];
      if (w) years.push({ year: y, ...w });
    }
    const cam = (b, id) => pick(b, brandData[b].BRAND_CONFIG.name, id, brandData[b].CAMERAS[id]);
    return {
      count: all.length,
      current: all.filter(c => c.current).slice(0, 6),
      years,
      lightestEver: all[0],
      launches2026: all.filter(c => c.year === 2026).length,
      xm5: cam('fujifilm', 'x-m5'),
      r100: cam('canon', 'eos-r100'),
      xs20: cam('fujifilm', 'x-s20'),
    };
  },

  description(s) {
    const [first] = s.current;
    return `The lightest APS-C cameras you can buy, weighed with battery and card. The ${first.brand} ${first.name} leads at ${first.weight} g, plus 10 years of the lightest launches.`;
  },

  claims(s) {
    const wins = winsBy(s.years);
    const [first, second] = s.current;
    const y = yr => s.years.find(v => v.year === yr) || {};
    return [
      ['The X-M5 is the lightest APS-C camera on sale', first.id === 'x-m5'],
      ['The EOS R100 is second, 1 g behind', second.id === 'eos-r100' && second.weight - first.weight === 1],
      ['Ten years in the chart, 2016 to 2025', s.years.length === 10],
      ['Fujifilm had the lightest launch in 6 of 10 years', wins.fujifilm === 6],
      ['Fujifilm won five years in a row, 2016 to 2020', [2016, 2017, 2018, 2019, 2020].every(v => y(v).b === 'fujifilm') && y(2021).b !== 'fujifilm'],
      ['Sony took 2021 (ZV-E10), Nikon 2022 (Z30), Canon 2023 (EOS R100) and 2025 (EOS R50 V), Fujifilm 2024 (X-M5)',
        y(2021).id === 'zv-e10' && y(2022).id === 'z30' && y(2023).id === 'eos-r100' && y(2024).id === 'x-m5' && y(2025).id === 'eos-r50v'],
      ['Both Canon winners cost under $800', [y(2023), y(2025)].every(c => c.usd < 800)],
      ['The lightest of the decade has not been beaten since', s.years.every(v => v.year <= decadeBest(s).year || v.weight > decadeBest(s).weight)],
      ['The lightest APS-C camera ever is lighter than any in the chart', s.lightestEver.weight < Math.min(...s.years.map(v => v.weight))],
      ['The X-M5 and EOS R100 weigh almost the same', Math.abs(s.xm5.weight - s.r100.weight) <= 5],
      ['The X-S20 is far heavier than the list and has IBIS', s.xs20.weight > s.current[s.current.length - 1].weight + 50 && s.xs20.ibis],
      ['No APS-C camera has launched in 2026 yet', s.launches2026 === 0],
    ];
  },

  render(s, k) {
    const full = c => `${c.brand} ${c.name}`;
    const link = c => LINK[`${c.b}:${c.id}`] || `compare/#cameras=${c.b}:${c.id}`;
    const [first, second] = s.current;
    const last = s.current[s.current.length - 1];
    const wins = winsBy(s.years);
    const best = decadeBest(s);
    const minW = Math.min(...s.years.map(v => v.weight));
    const maxW = Math.max(...s.years.map(v => v.weight));
    const ranked = k.table(
      ['#', 'Camera', 'Weight', 'Size (W × H × D)', 'Launched', 'Price (USD)'],
      s.current.map((c, i) => [i + 1, k.a(link(c), k.esc(full(c))), `${c.weight} g`, `${c.width} × ${c.height} × ${c.depth} mm`, c.year, k.usd(c.usd)]),
      { rowHeader: 1 },
    );
    const chart = k.bars({
      caption: 'Lightest new APS-C camera launched each year, weight with battery and card. Bars start at zero.',
      max: 500,
      bars: s.years.map(v => ({ label: String(v.year), sub: `${v.brand} ${v.name}`, value: v.weight, series: BRAND_SERIES[v.b] || 1 })),
      legend: [['Fujifilm', 1], ['Canon', 2], ['Sony', 3], ['Nikon', 4]],
      table: { head: ['Year', 'Lightest new APS-C camera', 'Weight'], rows: s.years.map(v => [v.year, k.esc(full(v)), `${v.weight} g`]) },
    });
    return `
<p class="guide-answer">The lightest APS-C camera you can buy new is the <strong>${k.esc(full(first))}</strong>, at <strong>${first.weight} g</strong> with battery and card. The ${k.esc(full(second))} is ${second.weight - first.weight} g behind. That's a paperclip.</p>

<h2>The lightest APS-C cameras on sale now</h2>
<p>Here are the six lightest you can still buy new. Tap a name to see how it stacks up against its closest rival.</p>
${ranked}
<p>All six weigh within ${last.weight - first.weight} g of each other. If one feels lighter in your hand, it's the lens.</p>

<h2>Have APS-C cameras got lighter in 10 years?</h2>
<p>Not really. Here's the lightest new APS-C camera from each year since ${FIRST_YEAR}, colored by brand.</p>
${chart}
<p>Every winner lands between ${minW} and ${maxW} g. That's roughly a full can of soda, every single year.</p>
<p>The lightest of the decade is the ${k.esc(full(best))} from ${best.year}, at ${best.weight} g. Nothing since has beaten it.</p>
<p>And the ${k.esc(full(s.lightestEver))} from ${s.lightestEver.year} weighed just ${s.lightestEver.weight} g. Progress, it turns out, went into autofocus and video, not the scales.</p>

<h2>Which brand makes the lightest APS-C cameras?</h2>
<p><strong>Fujifilm</strong>, mostly. It had the lightest launch in ${wins.fujifilm} of the last 10 years, including five in a row from 2016 to 2020.</p>
<p>Then the others noticed. Sony took 2021 with the ZV-E10, Nikon took 2022 with the Z30, and Canon took 2023 and 2025 with the EOS R100 and EOS R50 V.</p>
<p>Fujifilm grabbed the title back in 2024 with the X-M5. Canon is the one to watch: two wins in three years, both on cameras under $800.</p>
<p>Full disclosure: I shoot with a Fujifilm X-S20, and I really enjoy it. At ${s.xs20.weight} g it's nowhere near this list. A proper grip and in-body stabilization weigh something.</p>

<h2>Light isn't the same as small</h2>
<p>The X-M5 and EOS R100 weigh almost exactly the same. But the R100 is ${(s.r100.depth / s.xm5.depth).toFixed(1)}× as deep, thanks to its chunky grip.</p>
<p>If it has to slip into a jacket pocket, check the size, not just the weight. Here's the ${k.a('size/fujifilm-x-m5-vs-canon-eos-r50', 'X-M5 vs EOS R50 size comparison')}, drawn to scale. Or browse ${k.a('size/', 'every camera drawn to scale')}.</p>

<h2>Compare the lightweights</h2>
<ul class="guide-links">
<li>${k.a('vs/sony-zv-e10-ii-vs-fujifilm-x-m5', 'Fujifilm X-M5 vs Sony ZV-E10 II')}, and the ${k.a('size/sony-zv-e10-ii-vs-fujifilm-x-m5', 'X-M5 vs ZV-E10 II size comparison')}</li>
<li>${k.a('vs/fujifilm-x-m5-vs-canon-eos-r50', 'Fujifilm X-M5 vs Canon EOS R50')}</li>
<li>${k.a('canon/vs/eos-r50-vs-eos-r100', 'Canon EOS R50 vs EOS R100')}</li>
<li>${k.a('canon/vs/eos-r50v-vs-eos-r50', 'Canon EOS R50 V vs EOS R50')}</li>
<li>${k.a('fujifilm/vs/x-t30iii-vs-x-t30ii', 'Fujifilm X-T30 III vs X-T30 II')}</li>
<li>${k.a('compare/#cameras=' + s.current.slice(0, 4).map(c => `${c.b}:${c.id}`).join(','), 'The four lightest, side by side')}</li>
<li>Next: ${k.a('guides/lightest-zoom-lenses', 'the lightest zoom lenses for every mount')}</li>
</ul>

<h2>How we weighed them</h2>
<p>Weights are each maker's published figure with battery and memory card. We count every APS-C mirrorless camera in our database from Canon, Fujifilm, Leica, Nikon, Sigma and Sony, ${s.count} in all.</p>
<p>Canon's retired EOS M cameras aren't in the database, so they aren't in the chart. ${s.launches2026 ? '' : 'No new APS-C cameras have launched in 2026 so far.'}</p>`;
  },
};

function winsBy(years) {
  const wins = {};
  for (const v of years) wins[v.b] = (wins[v.b] || 0) + 1;
  return wins;
}

function decadeBest(s) {
  return [...s.years].sort((a, b) => a.weight - b.weight)[0];
}
