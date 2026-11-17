// Article (dated, frozen): what checking every spec against the maker found,
// Nov 2026. Findings from docs/spec-verification/2026-11-14 … 2026-11-17 and
// the Aug 2026 Sigma L-Mount fix. Draft for the owner, 2026-11-18.
'use strict';

// What we used to store: history, not data, so it lives here. Each "now"
// value comes from the snapshot and a claim checks it.
const BEFORE = {
  r1Weight: 1570,
  xt100Weight: 394,
  summiluxLength: 81, // with the hood on
  xf55200Length: 175, // zoomed out
  epl5Weight: 279, // body only
  gm2Length: 121.6, // the first GM's length
  sigmaWrong: 19, sigmaChecked: 22, // L-Mount lenses carrying Sony E figures (Aug 2026)
  fujiBatch1Mismatches: 19, fujiBatch1Cameras: 13, // Fujifilm's first batch, 2026-11-14
  xs20Height: 84.5, // stored; Fujifilm says 85.1 mm (and UHS-II, not UHS-I)
};

const pick = (brandData, brand, kind, id, fields) => {
  const item = brandData[brand][kind][id];
  if (!item) throw new Error(`${brand}:${id} not found`);
  const out = { name: item.name, source: (item.specSources || [])[0]?.url || null };
  for (const f of fields) out[f] = item[f] ?? null;
  return out;
};

module.exports = {
  slug: 'camera-specs-we-got-wrong-2026',
  title: 'Camera Specs We Got Wrong in 2026, and Why',
  headline: 'The camera specs we got wrong (and why it happens)',
  dek: 'We checked every spec against the maker. The maker won. Often.',
  published: '2026-11-18',
  query: {
    text: 'camera specs wrong / which camera spec sites are accurate',
    evidence: 'Owner decision 2026-11-18: a trust and outreach piece, not chasing search volume. Built from the November 2026 verify-specs runs against makers’ own spec pages.',
  },

  snapshot(brandData) {
    const cited = new Set();
    for (const [b, data] of Object.entries(brandData)) {
      // Tier T1 = the maker's own published figures (verify-specs source tiers).
      const maker = x => (x.specSources || []).some(src => src.tier === 'T1');
      for (const [id, c] of Object.entries(data.CAMERAS)) if (maker(c)) cited.add(`camera|${b}|${id}`);
      for (const l of Object.values(data.LENSES)) if (maker(l)) cited.add(`lens|${l.mount}|${l.manufacturer}|${l.name}`);
    }
    return {
      cited: cited.size,
      r1: pick(brandData, 'canon', 'CAMERAS', 'eos-r1', ['weight']),
      r50v: pick(brandData, 'canon', 'CAMERAS', 'eos-r50v', ['width', 'height', 'depth']),
      r50: pick(brandData, 'canon', 'CAMERAS', 'eos-r50', ['width', 'height', 'depth', 'evfType']),
      r100: pick(brandData, 'canon', 'CAMERAS', 'eos-r100', ['evfType']),
      xt100: pick(brandData, 'fujifilm', 'CAMERAS', 'x-t100', ['weight', 'evfType']),
      xt200: pick(brandData, 'fujifilm', 'CAMERAS', 'x-t200', ['evfType']),
      xt50: pick(brandData, 'fujifilm', 'CAMERAS', 'x-t50', ['weatherSealed']),
      xs20: pick(brandData, 'fujifilm', 'CAMERAS', 'x-s20', ['height', 'cardSlots']),
      r8: pick(brandData, 'canon', 'CAMERAS', 'eos-r8', ['weatherSealed']),
      om5ii: pick(brandData, 'olympus', 'CAMERAS', 'om-5-ii', ['depth']),
      summilux: pick(brandData, 'leica', 'LENSES', 'summilux-m-28mm-f14-asph', ['length']),
      xf55200: pick(brandData, 'fujifilm', 'LENSES', 'xf-55-200mm-f35-48', ['length']),
      epl5: pick(brandData, 'olympus', 'CAMERAS', 'e-pl5', ['weight']),
      gm2: pick(brandData, 'sony', 'LENSES', 'fe-16-35mm-f28-gm-ii', ['length']),
      gm1: pick(brandData, 'sony', 'LENSES', 'fe-16-35mm-f28-gm', ['length']),
      sigma: pick(brandData, 'sigma', 'LENSES', 'sigma-24-70mm-f28-dg-ii', ['length']),
    };
  },

  description(s) {
    return `A Canon EOS R1 listed ${BEFORE.r1Weight - s.r1.weight} g too heavy, cameras missing their viewfinders, a body wearing its sibling's size: what checking specs against makers found.`;
  },

  claims(s) {
    return [
      ['The EOS R1 weighs 1,115 g, 455 g less than we listed', s.r1.weight === 1115 && BEFORE.r1Weight - s.r1.weight === 455],
      ['The EOS R50 V is much thinner than the EOS R50 whose figures it carried', s.r50.depth - s.r50v.depth > 20],
      ['The EOS R50, EOS R100, X-T100 and X-T200 all have an EVF', [s.r50, s.r100, s.xt100, s.xt200].every(c => c.evfType === 'EVF')],
      ['The X-T100 weighs 448 g, 54 g more than we listed', s.xt100.weight === 448 && s.xt100.weight - BEFORE.xt100Weight === 54],
      ['The X-T50 is not weather-sealed; the EOS R8 is weather-resistant', s.xt50.weatherSealed === false && s.r8.weatherSealed === true],
      ['The Summilux-M 28mm is 67 mm long without its hood', s.summilux.length === 67],
      ['The XF 55-200mm is 118 mm long at rest', s.xf55200.length === 118],
      ['The E-PL5 weighs 325 g with battery and card', s.epl5.weight === 325],
      ['The FE 16-35mm GM II is shorter than the GM it replaced', s.gm2.length === 111.5 && s.gm1.length === BEFORE.gm2Length],
      ['Every finding links its maker source', ['r1', 'r50v', 'r100', 'xt100', 'xt200', 'xt50', 'xs20', 'r8', 'summilux', 'xf55200', 'epl5', 'gm2', 'sigma'].every(k => /^https:/.test(s[k].source || ''))],
      ['More than 800 cameras and lenses cite the maker\u2019s own figures', s.cited > 800],
      ['The X-S20 is 85.1 mm tall (0.6 mm more than we had) and takes UHS-II cards', s.xs20.height === 85.1 && /UHS-II/.test(s.xs20.cardSlots || '')],
    ];
  },

  render(s, k) {
    const mm = n => `${n} mm`;
    return `
<p class="guide-answer">We checked ${s.cited.toLocaleString('en-US')} cameras and lenses against their makers' own spec pages. Among the misses: a Canon EOS R1 listed <strong>${BEFORE.r1Weight - s.r1.weight} g</strong> too heavy, four cameras listed without the viewfinder they actually have, and a camera wearing its sibling's dimensions.</p>

<p>Spec sites copy from each other. So did we. Here's what turned up when we went back to the source, and the patterns behind it, so you can spot them elsewhere.</p>

<h2>1. The phantom 455 grams</h2>
<p>We had Canon's flagship EOS R1 at ${BEFORE.r1Weight.toLocaleString('en-US')} g. ${k.src(s.r1.source, 'Canon says')} ${s.r1.weight.toLocaleString('en-US')} g with battery and card. That's a whole prime lens of difference.</p>
<p>See the corrected numbers in the ${k.a('canon/vs/eos-r1-vs-eos-r3', 'EOS R1 vs EOS R3 comparison')}.</p>

<h2>2. Hand-me-down specs</h2>
<p>The classic: a new model inheriting its older sibling's numbers. The EOS R50 V carried the EOS R50's dimensions. ${k.src(s.r50v.source, 'In reality')} it's ${mm(s.r50v.depth)} deep, not ${mm(s.r50.depth)}.</p>
<p>Same story for the OM-5 II (it had the OM-5's depth) and Sony's FE 16-35mm GM II, which carried the first GM's length of ${mm(s.gm1.length)}. ${k.src(s.gm2.source, 'Sony lists')} ${mm(s.gm2.length)}.</p>
<p>See how different the R50 V really is in the ${k.a('canon/size/eos-r50v-vs-eos-r50', 'EOS R50 V vs EOS R50 size comparison')}.</p>

<h2>3. The viewfinders that vanished</h2>
<p>Four cameras were listed with no viewfinder at all: Canon's EOS R50 and EOS R100, and Fujifilm's X-T100 and X-T200. All four have an electronic viewfinder, as ${k.src(s.r100.source, 'Canon')} and ${k.src(s.xt200.source, 'Fujifilm')} list.</p>
<p>The X-T100 was also ${s.xt100.weight - BEFORE.xt100Weight} g light: ${k.src(s.xt100.source, 'Fujifilm says')} ${s.xt100.weight} g, not ${BEFORE.xt100Weight}. Compare the ${k.a('canon/vs/eos-r50-vs-eos-r100', 'EOS R50 and EOS R100')}, or the ${k.a('fujifilm/#cameras=x-t100,x-t200', 'X-T100 and X-T200')}.</p>

<h2>4. Weather sealing, both ways</h2>
<p>We had the Fujifilm X-T50 down as weather-sealed. ${k.src(s.xt50.source, 'Fujifilm never says so')}, and it isn't.</p>
<p>The Canon EOS R8 went the other way: we had it unsealed, but ${k.src(s.r8.source, 'Canon lists')} "weather-resistant construction". See the ${k.a('fujifilm/vs/x-t50-vs-x100v', 'X-T50 vs X100V')} and ${k.a('canon/vs/eos-r8-vs-eos-r10', 'EOS R8 vs EOS R10')} comparisons.</p>

<h2>5. Hood on, zoomed out, battery out</h2>
<p>Some numbers aren't wrong, just measured differently. Leica's Summilux-M 28mm f/1.4 was ${mm(BEFORE.summiluxLength)} long with its hood on; ${k.src(s.summilux.source, 'without it')} it's ${mm(s.summilux.length)}.</p>
<p>Fujifilm's XF 55-200mm was listed at ${mm(BEFORE.xf55200Length)}, its length zoomed all the way out. ${k.src(s.xf55200.source, 'At rest')} it's ${mm(s.xf55200.length)}. And the Olympus E-PL5 was ${BEFORE.epl5Weight} g body only; ${k.src(s.epl5.source, 'with battery and card')} it's ${s.epl5.weight} g, the way we list every camera.</p>

<h2>6. Right lens, wrong mount</h2>
<p>Third-party lenses are made for several mounts, and the sizes differ. ${BEFORE.sigmaWrong} of the ${BEFORE.sigmaChecked} Sigma L-Mount lenses we checked were carrying their Sony E-mount dimensions.</p>
<p>${k.src(s.sigma.source, 'Sigma’s spec tables')} list each mount separately, and the L-Mount versions are usually a couple of millimeters shorter. Browse the corrected ${k.a('mount/l-mount', 'L-Mount lenses')}.</p>

<h2>How to spot a bad spec</h2>
<ul class="guide-links">
<li><strong>Two models, same numbers?</strong> Suspicious. New bodies rarely match old ones to the millimeter.</li>
<li><strong>Check what's included.</strong> Battery and card? Hood? Zoomed in or out?</li>
<li><strong>Go to the maker.</strong> If the maker doesn't claim it (weather sealing, especially), don't believe it.</li>
</ul>
<p>Nobody's safe. Fujifilm, the brand I shoot with, had ${BEFORE.fujiBatch1Mismatches} mismatches across its first ${BEFORE.fujiBatch1Cameras} cameras. Even my own X-S20 was ${(s.xs20.height - BEFORE.xs20Height).toFixed(1)} mm too short and missing its ${k.src(s.xs20.source, 'UHS-II card support')}.</p>

<h2>What we do now</h2>
<p>Every camera and lens we've checked now links to its maker's own spec page, shown under References in the ${k.a('compare/', 'comparison tool')}. That's ${s.cited.toLocaleString('en-US')} so far, and counting. ${k.a('about', 'How we source our data')}.</p>`;
  },
};
