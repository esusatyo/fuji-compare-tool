// Article (dated, frozen): what checking every spec against the maker found,
// and why each kind of error happens, Nov 2026. Findings from
// docs/spec-verification/2026-11-14 … 2026-11-17, the Aug–Sep 2026 Sigma
// L-Mount fix and the Nov 2026 X-T50 / XF16-55 II fixes (#92). Draft for the
// owner, 2026-11-18.
'use strict';

// What we used to store: history, not data, so it lives here. Each "now"
// value comes from the snapshot and a claim checks it.
const BEFORE = {
  r1Weight: 1570, // arrived in the first Canon data (June 2026) with no source
  xt100Weight: 394,
  xf1655Weight: 655, // the 2015 XF16-55mm f/2.8's weight, carried by the II
  epl8Weight: 357, // "assumed similar to e-pl7" in the item's own note
  summiluxLength: 81, // with the hood on
  xf55200Length: 175, // zoomed out
  gm2Length: 121.6, // the first GM's length
  sigmaWrong: 19, sigmaChecked: 22, // L-Mount lenses carrying Sony E figures (Sep 2026)
  // Olympus figures our citations attributed to Wikipedia (Sep 2026)
  em5iiBattery: 580, penfWeight: 434, em10iiWeight: 390, epl5Weight: 279,
};
// Facts read from maker pages and our verification reports, Nov 2026.
const FOUND = {
  em5iiBatteryEco: 750, // Olympus's power-saving-mode figure for the E-M5 II
  sigma56Mounts: 7, // mounts on Sigma's own 56mm F1.4 DC DN page
  flangeL: 20, flangeE: 18, // mm, L-Mount and Sony E flange distances
  fujiGone: 10, // old Fujifilm spec pages that now redirect to the home page
  olyGone: 10, // older Olympus cameras with no maker spec source left
  leicaCameraPdfs: 12, leicaLensPdfs: 17, leicaLensPdfsChecked: 48,
};

const pick = (brandData, brand, kind, id, fields) => {
  const item = brandData[brand][kind][id];
  if (!item) throw new Error(`${brand}:${id} not found`);
  const t1 = (item.specSources || []).find(src => src.tier === 'T1');
  const out = { name: item.name, source: (t1 || (item.specSources || [])[0] || {}).url || null };
  for (const f of fields) out[f] = item[f] ?? null;
  return out;
};

module.exports = {
  slug: 'camera-specs-we-got-wrong-2026',
  title: 'Camera Specs We Got Wrong in 2026, and Why',
  headline: 'The camera specs we got wrong (and why it happens)',
  dek: 'We checked our specs against the makers. The makers won. Often.',
  published: '2026-11-18',
  query: {
    text: 'camera specs wrong / which camera spec sites are accurate',
    evidence: 'Owner decision 2026-11-18: a trust and outreach piece, not chasing search volume. Built from the November 2026 verify-specs runs against makers’ own spec pages.',
  },

  snapshot(brandData) {
    const cited = new Set();
    // Sigma designs sold for several mounts: one entry per lens name per mount.
    const sigma = new Map();
    for (const [b, data] of Object.entries(brandData)) {
      // Tier T1 = the maker's own published figures (verify-specs source tiers).
      const maker = x => (x.specSources || []).some(src => src.tier === 'T1');
      for (const [id, c] of Object.entries(data.CAMERAS)) if (maker(c)) cited.add(`camera|${b}|${id}`);
      for (const l of Object.values(data.LENSES)) {
        if (maker(l)) cited.add(`lens|${l.mount}|${l.manufacturer}|${l.name}`);
        if (l.manufacturer === 'Sigma' && !l.discontinued && !l.preRelease) {
          const m = sigma.get(l.name) || new Map();
          m.set(l.mount, l.weight);
          sigma.set(l.name, m);
        }
      }
    }
    const multi = [...sigma.values()].filter(m => m.size > 1);
    return {
      cited: cited.size,
      sigmaLenses: sigma.size,
      sigmaMulti: multi.length,
      sigmaMultiWeightDiffers: multi.filter(m => new Set(m.values()).size > 1).length,
      r1: pick(brandData, 'canon', 'CAMERAS', 'eos-r1', ['weight']),
      r50v: pick(brandData, 'canon', 'CAMERAS', 'eos-r50v', ['width', 'height', 'depth', 'weight', 'evfType']),
      r50: pick(brandData, 'canon', 'CAMERAS', 'eos-r50', ['width', 'height', 'depth', 'weight', 'evfType']),
      r100: pick(brandData, 'canon', 'CAMERAS', 'eos-r100', ['evfType']),
      xt100: pick(brandData, 'fujifilm', 'CAMERAS', 'x-t100', ['weight', 'evfType']),
      xt200: pick(brandData, 'fujifilm', 'CAMERAS', 'x-t200', ['evfType']),
      xt50: pick(brandData, 'fujifilm', 'CAMERAS', 'x-t50', ['weatherSealed']),
      xt5: { ...pick(brandData, 'fujifilm', 'CAMERAS', 'x-t5', ['weatherSealed']), source: 'https://www.fujifilm-x.com/global/products/cameras/x-t5/' },
      r8: pick(brandData, 'canon', 'CAMERAS', 'eos-r8', ['weatherSealed']),
      xf1655: pick(brandData, 'fujifilm', 'LENSES', 'xf-16-55mm-f28-ii', ['weight']),
      epl8: pick(brandData, 'olympus', 'CAMERAS', 'e-pl8', ['weight']),
      summilux: pick(brandData, 'leica', 'LENSES', 'summilux-m-28mm-f14-asph', ['length']),
      xf55200: pick(brandData, 'fujifilm', 'LENSES', 'xf-55-200mm-f35-48', ['length']),
      gm2: pick(brandData, 'sony', 'LENSES', 'fe-16-35mm-f28-gm-ii', ['length']),
      gm1: pick(brandData, 'sony', 'LENSES', 'fe-16-35mm-f28-gm', ['length']),
      sigma: pick(brandData, 'sigma', 'LENSES', 'sigma-24-70mm-f28-dg-ii', ['length']),
      sigma100400: pick(brandData, 'sigma', 'LENSES', 'sigma-100-400mm-f5-63-dg', ['weatherSealed']),
      sigma56mft: pick(brandData, 'panasonic', 'LENSES', 'sigma-56mm-f14-mft', ['weight']),
      sigma56z: pick(brandData, 'nikon', 'LENSES', 'sigma-56mm-f14', ['weight']),
      em5ii: pick(brandData, 'olympus', 'CAMERAS', 'e-m5-ii', ['batteryLife']),
      penf: pick(brandData, 'olympus', 'CAMERAS', 'pen-f', ['weight']),
      em10ii: pick(brandData, 'olympus', 'CAMERAS', 'e-m10-ii', ['weight']),
      epl5: pick(brandData, 'olympus', 'CAMERAS', 'e-pl5', ['weight']),
    };
  },

  description(s) {
    return `A Canon EOS R1 listed ${BEFORE.r1Weight - s.r1.weight} g too heavy, cameras missing their viewfinders, a body wearing its sibling's size: what checking specs against makers found.`;
  },

  claims(s) {
    return [
      ['The EOS R1 weighs 1,115 g, 455 g less than we listed', s.r1.weight === 1115 && BEFORE.r1Weight - s.r1.weight === 455],
      ['The 455 g gap is heavier than a whole EOS R50', BEFORE.r1Weight - s.r1.weight > s.r50.weight],
      ['The EOS R50 V is much thinner than the EOS R50 whose figures it carried', s.r50.depth - s.r50v.depth > 20],
      ['The XF 16-55mm f/2.8 II weighs 410 g, not the original’s 655 g', s.xf1655.weight === 410],
      ['The E-PL8 is not the weight we assumed from the E-PL7', s.epl8.weight !== BEFORE.epl8Weight],
      ['The EOS R50, EOS R100, X-T100 and X-T200 all have an EVF', [s.r50, s.r100, s.xt100, s.xt200].every(c => c.evfType === 'EVF')],
      ['The EOS R50 V has no viewfinder', s.r50v.evfType == null],
      ['The X-T100 weighs 448 g, 54 g more than we listed', s.xt100.weight === 448 && s.xt100.weight - BEFORE.xt100Weight === 54],
      ['The X-T50 is not weather-sealed; the X-T5 is; the EOS R8 is weather-resistant', s.xt50.weatherSealed === false && s.xt5.weatherSealed === true && s.r8.weatherSealed === true],
      ['A mount gasket alone does not count as sealed (Sigma 100-400mm)', s.sigma100400.weatherSealed === false],
      ['The Summilux-M 28mm is 67 mm long without its hood', s.summilux.length === 67],
      ['The XF 55-200mm is 118 mm long at rest', s.xf55200.length === 118],
      ['The FE 16-35mm GM II is shorter than the GM it replaced', s.gm2.length === 111.5 && s.gm1.length === BEFORE.gm2Length],
      ['Most current Sigma lenses are sold for more than one mount, and most of those weigh differently by mount',
        s.sigmaMulti > s.sigmaLenses / 2 && s.sigmaMultiWeightDiffers > s.sigmaMulti / 2],
      ['Sigma’s 56mm f/1.4 weighs 256 g on Micro Four Thirds and 295 g on Nikon Z', s.sigma56mft.weight === 256 && s.sigma56z.weight === 295],
      ['Olympus: E-M5 II battery 310 shots, PEN-F 427 g, E-M10 II 399 g, E-PL5 325 g',
        s.em5ii.batteryLife === 310 && s.penf.weight === 427 && s.em10ii.weight === 399 && s.epl5.weight === 325],
      ['Every finding links its maker source',
        ['r1', 'r50v', 'r100', 'xt100', 'xt200', 'xt50', 'xt5', 'r8', 'xf1655', 'epl8', 'summilux', 'xf55200', 'gm2', 'sigma', 'sigma100400', 'sigma56z', 'em5ii', 'penf', 'em10ii', 'epl5']
          .every(k => /^https:/.test(s[k].source || ''))],
      ['More than 800 cameras and lenses cite the maker’s own figures', s.cited > 800],
    ];
  },

  render(s, k) {
    const mm = n => `${n} mm`;
    const g = n => `${n.toLocaleString('en-US')} g`;
    return `
<p class="guide-answer">When we went back to the makers' own spec pages, we found a Canon EOS R1 listed <strong>${BEFORE.r1Weight - s.r1.weight} g</strong> too heavy, four cameras listed without the viewfinder they actually have, and a camera wearing its sibling's dimensions.</p>

<p>Most wrong specs aren't typos. They're numbers from the wrong place: an older model, a different mount, a secondhand source, or nowhere at all. Here's what we found, and why each one happened.</p>

<h2>1. The phantom 455 grams</h2>
<p>We had Canon's flagship EOS R1 at ${g(BEFORE.r1Weight)}. ${k.src(s.r1.source, 'Canon says')} ${g(s.r1.weight)} with battery and card. The gap alone weighs more than an entire EOS R50.</p>
<p>Where did ${g(BEFORE.r1Weight)} come from? Honestly, we don't know. It arrived with our first batch of Canon data in June 2026, put together with the help of an AI assistant, and no source was recorded. The rest of that entry was off too: the size, the megapixels and the screen.</p>
<p>That's the real lesson. A number without a source can't be checked, so nobody ever fixes it. See the corrected figures in the ${k.a('canon/vs/eos-r1-vs-eos-r3', 'EOS R1 vs EOS R3 comparison')}.</p>

<h2>2. Hand-me-down specs</h2>
<p>A classic: a new model carrying its predecessor's numbers. The EOS R50 V had the EOS R50's dimensions and weight. ${k.src(s.r50v.source, 'In reality')} it's ${mm(s.r50v.depth)} deep, not ${mm(s.r50.depth)}.</p>
<p>Fujifilm's XF 16-55mm f/2.8 II carried the 2015 original's specs: ${g(BEFORE.xf1655Weight)} instead of ${k.src(s.xf1655.source, `${g(s.xf1655.weight)}`)}. The OM-5 II had the OM-5's depth, and Sony's FE 16-35mm GM II had the first GM's length (${k.src(s.gm2.source, `${mm(s.gm2.length)}`)}, not ${mm(s.gm1.length)}).</p>
<p>Why? The quick way to add a new model is to start from the old one and change what the launch news mentions. Launch news is about sensors and autofocus, not millimeters, so the old size and weight ride along. Our own note on the Olympus E-PL8 said it outright: dimensions "assumed similar to e-pl7". ${k.src(s.epl8.source, "They weren't")}.</p>
<p>See how different the R50 V really is in the ${k.a('canon/size/eos-r50v-vs-eos-r50', 'EOS R50 V vs EOS R50 size comparison')}, or the ${k.a('olympus/vs/om-5-ii-vs-om-5', 'OM-5 II vs OM-5')}.</p>

<h2>3. The viewfinders that vanished</h2>
<p>Four cameras were listed with no viewfinder: Canon's EOS R50 and EOS R100, and Fujifilm's X-T100 and X-T200. All four have an electronic viewfinder, as ${k.src(s.r100.source, 'Canon')} and ${k.src(s.xt200.source, 'Fujifilm')} list.</p>
<p>Why? In a spec table, "we don't know" and "it doesn't have one" look exactly the same: an empty cell. All four are entry-level bodies, where a missing viewfinder sounds believable, so nobody questioned the blank.</p>
<p>The R50 also has a near-twin that really has no viewfinder: the EOS R50 V. Our R50 V had the R50's size, and our R50 had the R50 V's missing viewfinder. It looks like the two got muddled.</p>
<p>The X-T100 was also ${s.xt100.weight - BEFORE.xt100Weight} g light: ${k.src(s.xt100.source, 'Fujifilm says')} ${s.xt100.weight} g, not ${BEFORE.xt100Weight}. Compare the ${k.a('canon/vs/eos-r50-vs-eos-r100', 'EOS R50 and EOS R100')}, or the ${k.a('fujifilm/#cameras=x-t100,x-t200', 'X-T100 and X-T200')}.</p>

<h2>4. Weather sealing, both ways</h2>
<p>We had the Fujifilm X-T50 down as weather-sealed. ${k.src(s.xt50.source, 'Fujifilm never says so')}, and reviewers list the lack of sealing as a downside.</p>
<p>The likely culprit is its name. The X-T50 sounds like a smaller X-T5, and the X-T5 ${k.src(s.xt5.source, 'has 56 weather-sealed points')}. Family resemblance isn't a spec.</p>
<p>The Canon EOS R8 went the other way: we had it unsealed, but ${k.src(s.r8.source, 'Canon lists')} "weather-resistant construction".</p>
<p>Why is this so easy to get wrong? There's no standard. Canon says "weather-resistant", Sigma says "dust and splash resistant", and on its ${k.src(s.sigma100400.source, '100-400mm')} that means a seal at the mount only. Many makers just say nothing. Silence isn't a no, but it isn't a yes either. We now mark a camera or lens sealed only when its maker says so. See the ${k.a('fujifilm/vs/x-t50-vs-x100v', 'X-T50 vs X100V')} and ${k.a('canon/vs/eos-r8-vs-eos-r10', 'EOS R8 vs EOS R10')}.</p>

<h2>5. Hood on, zoomed out</h2>
<p>Some numbers aren't wrong, just measured differently. Leica's Summilux-M 28mm f/1.4 was ${mm(BEFORE.summiluxLength)} long with its hood on; ${k.src(s.summilux.source, 'without it')} it's ${mm(s.summilux.length)}.</p>
<p>Fujifilm's XF 55-200mm was listed at ${mm(BEFORE.xf55200Length)}, its length zoomed all the way out. ${k.src(s.xf55200.source, 'At rest')} it's ${mm(s.xf55200.length)}.</p>

<h2>6. Same lens, many mounts</h2>
<p>Sigma makes most of its lenses for several camera systems. Of the ${s.sigmaLenses} current Sigma lenses in our database, ${s.sigmaMulti} are sold for more than one mount, and ${s.sigmaMultiWeightDiffers} of those weigh differently from one mount to the next.</p>
<p>${k.src(s.sigma56z.source, "Sigma's page for the 56mm f/1.4")} lists ${FOUND.sigma56Mounts} mounts, from ${g(s.sigma56mft.weight)} on Micro Four Thirds to ${g(s.sigma56z.weight)} on Nikon Z. Each mount has its own diameter and sits a different distance from the sensor, so the barrel changes. Same glass, different lens.</p>
<p>That's what caught us. ${BEFORE.sigmaWrong} of the ${BEFORE.sigmaChecked} Sigma L-Mount lenses we checked were carrying their Sony E-mount dimensions, read from the wrong row of ${k.src(s.sigma.source, "Sigma's spec table")}. L-Mount sits ${FOUND.flangeL - FOUND.flangeE} mm further from the sensor than Sony E (${FOUND.flangeL} mm vs ${FOUND.flangeE} mm), so L-Mount barrels are usually about ${FOUND.flangeL - FOUND.flangeE} mm shorter. Browse the corrected ${k.a('mount/l-mount', 'L-Mount lenses')}, or ${k.a('mount/z-mount', 'every Nikon Z lens')}.</p>

<h2>7. Wikipedia isn't the maker</h2>
<p>When we first added ${k.a('olympus/', 'Olympus')}, most of its cameras cited Wikipedia. Then we checked them against Olympus's own spec sheets.</p>
<p>The E-M5 Mark II's battery life, as we'd taken it from Wikipedia, was ${BEFORE.em5iiBattery} shots. ${k.src(s.em5ii.source, 'Olympus says')} ${s.em5ii.batteryLife}, or ${FOUND.em5iiBatteryEco} in power-saving mode. ${BEFORE.em5iiBattery} matches neither. The PEN-F was ${BEFORE.penfWeight - s.penf.weight} g off and the E-M10 Mark II ${s.em10ii.weight - BEFORE.em10iiWeight} g.</p>
<p>And the E-PL5's ${BEFORE.epl5Weight} g wasn't wrong, just body only. ${k.src(s.epl5.source, 'With battery and card')}, the way we list every camera, it's ${s.epl5.weight} g. Wikipedia is only as good as the reviews and spec sites it cites, which brings us back to everyone copying everyone.</p>

<h2>8. When the maker's page disappears</h2>
<p>Makers quietly delete old spec pages. For ${FOUND.fujiGone} older Fujifilm cameras, including the original X100 and X-Pro1, the spec pages now redirect to Fujifilm's home page. Only the owner's manuals are left.</p>
<p>Olympus is worse: ${FOUND.olyGone} older cameras have no maker spec page left at all. For others, the archive is a picture of the old page, which we had to run through text recognition, in Japanese.</p>
<p>${k.a('leica/', 'Leica')}'s PDFs vanish too: ${FOUND.leicaCameraPdfs} of the camera spec sheets we'd cited, and ${FOUND.leicaLensPdfs} of ${FOUND.leicaLensPdfsChecked} lens sheets, now return errors. Once the maker's page is gone, the secondhand copies become the only record, mistakes and all.</p>

<h2>How to spot a bad spec</h2>
<ul class="guide-links">
<li><strong>Two models, same numbers?</strong> Suspicious. New bodies rarely match old ones to the millimeter.</li>
<li><strong>Check what's included.</strong> Battery and card? Hood? Zoomed in or out? Which mount?</li>
<li><strong>Go to the maker.</strong> If the maker doesn't claim it (weather sealing, especially), don't believe it.</li>
<li><strong>No source, no trust.</strong> A figure nobody can trace is a guess.</li>
</ul>

<h2>What we do now</h2>
<p>Every camera and lens we check now links to its maker's own spec page, shown under References in the ${k.a('compare/', 'comparison tool')}. That's ${s.cited.toLocaleString('en-US')} so far, and counting. ${k.a('about', 'How we source our data')}.</p>`;
  },
};
