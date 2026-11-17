// Guide: the lightest zoom lenses, by mount. Prose approved by the owner 2026-11-17.
'use strict';

const MAKER_BRAND = { Panasonic: 'panasonic', 'OM System': 'olympus', Sony: 'sony', Fujifilm: 'fujifilm', Canon: 'canon', Nikon: 'nikon', Leica: 'leica', Sigma: 'sigma' };
const MOUNT = { rf: 'Canon RF', x: 'Fujifilm X', g: 'Fujifilm GFX', l: 'L-Mount', z: 'Nikon Z', mft: 'Micro Four Thirds', e: 'Sony E', m: 'Leica M' };
const TABLE_MOUNTS = ['mft', 'e', 'x', 'rf', 'z', 'l', 'g'];
const FF_MOUNTS = ['l', 'e', 'z', 'rf'];
const FORMAT_SERIES = { 'APS-C': 1, 'Full-frame': 2, MFT: 3, 'Medium format': 4 };

// Sensor format from the stored full-frame-equivalent focal length: a crop of
// about 1.0 is full-frame; Micro Four Thirds and GFX are known by mount.
function format(l) {
  if (l.mount === 'mft') return 'MFT';
  if (l.mount === 'g') return 'Medium format';
  const crop = parseFloat(String(l.focalLengthEquiv)) / (l.focalLengthMin || l.focalLength);
  return crop < 1.2 ? 'Full-frame' : 'APS-C';
}

const fullName = l => (l.name.startsWith(l.manufacturer) ? l.name : `${l.manufacturer} ${l.name}`);
const shortName = l => l.name.replace(/^(OM System|Sigma|Tamron|Laowa|Samyang|Viltrox)\s+/, '');

module.exports = {
  slug: 'lightest-zoom-lenses',
  title: 'Lightest Zoom Lenses in 2026, Ranked by Mount',
  headline: 'The lightest zoom lenses, ranked by mount',
  dek: "A zoom you forget is in the bag. Here's who makes one.",
  published: '2026-11-17',
  query: {
    text: 'lightest zoom lens',
    evidence: 'Weight and size queries lead Bing and Search Console (Nov 2026); the kit builder and mount pages have no text answering "which zoom is lightest".',
  },

  snapshot(brandData) {
    // One entry per lens per mount (a design sold through several brand files
    // of one mount is folded), preferring the maker's own brand file for links.
    const byKey = new Map();
    for (const [b, data] of Object.entries(brandData)) {
      for (const [id, l] of Object.entries(data.LENSES)) {
        if (l.type !== 'Zoom' || l.discontinued || l.preRelease) continue;
        const key = `${l.manufacturer}|${l.name}|${l.mount}`;
        const entry = {
          b, id, name: l.name, manufacturer: l.manufacturer, mount: l.mount, fmt: format(l),
          weight: l.weight, length: l.length, equiv: String(l.focalLengthEquiv).replace(/–/g, '-'),
          maxAperture: l.maxAperture, tele: l.focalLengthMax, usd: l.prices.USD,
        };
        const prev = byKey.get(key);
        if (!prev || (MAKER_BRAND[l.manufacturer] === b && MAKER_BRAND[prev.manufacturer] !== prev.b)) byKey.set(key, entry);
      }
    }
    const zooms = [...byKey.values()].sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name));
    // The next-lightest zoom of the same mount in the same brand file, for the
    // brand page deep link.
    const withMate = z => {
      const mate = zooms.find(o => o !== z && o.b === z.b && o.mount === z.mount);
      return { ...z, mate: mate ? mate.id : null };
    };
    const groups = new Map();
    for (const z of zooms) {
      if (z.mount === 'm') continue;
      const key = `${z.mount}|${z.fmt}`;
      if (!groups.has(key)) groups.set(key, z);
    }
    const xs20 = brandData.fujifilm.CAMERAS['x-s20'];
    return {
      count: zooms.length,
      mounts: new Set(zooms.map(z => z.mount)).size,
      perMount: TABLE_MOUNTS.map(m => zooms.find(z => z.mount === m)).filter(Boolean).sort((a, b) => a.weight - b.weight).map(withMate),
      fullFrame: FF_MOUNTS.map(m => zooms.find(z => z.mount === m && z.fmt === 'Full-frame')).filter(Boolean).sort((a, b) => a.weight - b.weight).map(withMate),
      chart: [...groups.values()].sort((a, b) => a.weight - b.weight),
      top5: zooms.slice(0, 5),
      f28: zooms.find(z => z.maxAperture === 2.8 && /f\/?2\.8(?![\d.]*-)/i.test(z.name) && z.fmt !== 'Medium format') || null,
      mZooms: zooms.filter(z => z.mount === 'm').map(z => z.manufacturer),
      xs20: { weight: xs20.weight },
    };
  },

  description(s) {
    return `The lightest zoom lens you can buy is Panasonic's 12-32mm, at just ${s.top5[0].weight} g. Here's the lightest zoom for every mount, full-frame included, ranked.`;
  },

  claims(s) {
    const [lightest] = s.top5;
    const ffLightest = s.fullFrame[0];
    const apsc = s.perMount.filter(z => z.fmt === 'APS-C');
    const heaviestApsc = apsc[apsc.length - 1];
    const xMount = s.perMount.find(z => z.mount === 'x');
    const nikonDx = s.perMount.find(z => z.mount === 'z');
    return [
      ["The lightest zoom is Panasonic's 12-32mm, under half the weight of a ~170 g phone", lightest.id === 'lumix-g-12-32mm-f3-5-5-6' && lightest.weight < 85],
      ['The lightest full-frame zoom is the Panasonic LUMIX S 18-40mm', ffLightest.id === 'lumix-s-18-40mm-f4-5-6-3'],
      ['Three of the five lightest zooms are power zooms (PZ or EZ)', s.top5.filter(z => /\b(PZ|EZ)\b/.test(z.name)).length === 3],
      ['Every per-mount winner starts at f/3.5 or slower', s.perMount.every(z => z.maxAperture >= 3.5)],
      ['Every per-mount winner is a variable-aperture zoom', s.perMount.every(z => /\d-\d/.test(z.name.replace(/^.*?(f\/|F)(?=\d)/, '')))],
      ['Sony, Nikon and Canon each make a full-frame zoom under 250 g that stops at 50 or 60mm',
        ['e', 'z', 'rf'].every(m => { const z = s.fullFrame.find(o => o.mount === m); return z && z.weight < 250 && [50, 60].includes(z.tele); })],
      ['The lightest full-frame zooms stop at 40 to 60mm', s.fullFrame.every(z => z.tele >= 40 && z.tele <= 60)],
      ["The LUMIX S 18-40mm is 20 g heavier than Nikon's DX 16-50mm, the heaviest APS-C winner",
        heaviestApsc === nikonDx && nikonDx.id === 'z-dx-16-50mm-vr' && ffLightest.weight - nikonDx.weight === 20],
      ["Micro Four Thirds has the lightest winner and Fujifilm's GF35-70mm the heaviest",
        s.chart[0].mount === 'mft' && s.chart[s.chart.length - 1].id === 'gf35-70mm-f45-56'],
      ['The lightest X-mount zoom is the new XC 13-33mm', xMount.id === 'xc-13-33mm-f35-63'],
      ['Leica M has exactly one zoom, a Laowa', s.mZooms.length === 1 && s.mZooms[0] === 'Laowa'],
      ['The lightest constant f/2.8 zoom weighs more than three times the 12-32mm', s.f28 && s.f28.weight > 3 * lightest.weight],
    ];
  },

  render(s, k) {
    const [lightest] = s.top5;
    const ff = s.fullFrame[0];
    const heaviest = s.chart[s.chart.length - 1];
    const nikonDx = s.perMount.find(z => z.mount === 'z');
    const xMount = s.perMount.find(z => z.mount === 'x');
    const deep = z => `${z.b}/#lenses=${z.id}${z.mate ? ',' + z.mate : ''}`;
    const head = ['Mount', 'Lens', 'Weight', 'Length', 'Range (full-frame equiv.)', 'Price (USD)'];
    const row = z => [k.esc(MOUNT[z.mount]), k.a(deep(z), k.esc(fullName(z))), `${z.weight} g`, `${z.length} mm`, k.esc(z.equiv), k.usd(z.usd)];
    const label = z => (['mft', 'x', 'g'].includes(z.mount) ? MOUNT[z.mount] : `${MOUNT[z.mount]} (${z.fmt === 'APS-C' ? 'APS-C' : 'full-frame'})`);
    const usedFormats = Object.keys(FORMAT_SERIES).filter(f => s.chart.some(z => z.fmt === f));
    const chart = k.bars({
      caption: "Lightest current zoom lens for each mount and sensor size, maker's published weight. Bars start at zero.",
      bars: s.chart.map(z => ({ label: label(z), sub: shortName(z).replace(/(\d)mm\b.*$/, '$1mm'), value: z.weight, series: FORMAT_SERIES[z.fmt] })),
      legend: usedFormats.map(f => [f, FORMAT_SERIES[f]]),
      table: { head: ['Mount', 'Lightest zoom', 'Weight'], rows: s.chart.map(z => [k.esc(label(z)), k.esc(fullName(z)), `${z.weight} g`]) },
    });
    return `
<p class="guide-answer">The lightest zoom lens you can buy new is the <strong>${k.esc(fullName(lightest))}</strong>, at <strong>${lightest.weight} g</strong>. That's less than half the weight of most phones. For full-frame, the lightest is the <strong>${k.esc(fullName(ff))}</strong>, at <strong>${ff.weight} g</strong>.</p>

<h2>The lightest zoom for every mount</h2>
<p>One winner per mount, current lenses only. Tap a name to put it next to that mount's runner-up.</p>
${k.table(head, s.perMount.map(row), { rowHeader: 1 })}
<p>Of the five lightest zooms on sale, three are power zooms, with PZ or EZ in the name. A motor does the zooming, so the barrel can tuck away when the camera's off.</p>

<h2>Does sensor size decide how heavy a zoom is?</h2>
<p>Mostly, yes. Here's the lightest zoom for each mount, split by sensor size where a mount takes two.</p>
${chart}
<p>Smaller sensor, smaller glass. Micro Four Thirds wins at ${lightest.weight} g, while Fujifilm's medium-format ${k.esc(heaviest.name.replace(/mm *F[\d.].*$/, 'mm'))} needs ${heaviest.weight} g.</p>
<p>But full-frame is closer than you'd think. Panasonic's LUMIX S 18-40mm is only ${ff.weight - nikonDx.weight} g heavier than Nikon's DX 16-50mm, a lens made for a smaller sensor.</p>

<h2>The lightest full-frame zooms</h2>
<p>If you shoot full-frame, these are the featherweights. One per mount.</p>
${k.table(head, s.fullFrame.map(row), { rowHeader: 1 })}
<p>Sony, Nikon and Canon each make one under 250 g. Every one of them is a short zoom that stops at 50 or 60mm.</p>

<h2>What do you give up for a light zoom?</h2>
<p>Speed, mostly. Every lens in the first table starts at f/3.5 or slower, and gets darker as you zoom in.</p>
<p>And reach. The lightest full-frame zooms stop at 40 to 60mm, so think of them as a standard prime that can stretch a little.</p>
<p>Want f/2.8 all the way through? The lightest we list is the ${k.esc(fullName(s.f28))} for ${k.esc(MOUNT[s.f28.mount])}, at ${s.f28.weight} g. That's more than three times the 12-32mm.</p>

<h2>What I'd put on my X-S20</h2>
<p>Full disclosure: I shoot with a Fujifilm X-S20, and I really enjoy it. The lightest zoom it takes is Fujifilm's new ${k.esc(shortName(xMount))}, at ${xMount.weight} g.</p>
<p>That brings the whole kit to ${s.xs20.weight + xMount.weight} g. ${k.a(`kit/#kit=fujifilm:x-s20,fujifilm:${xMount.id}`, 'Weigh it in the kit builder')}, then swap in your own lenses.</p>

<h2>Browse every lens by mount</h2>
<ul class="guide-links">
<li>${k.a('mount/micro-four-thirds-mount', 'Every Micro Four Thirds lens')}</li>
<li>${k.a('mount/e-mount', 'Every Sony E-mount lens')}</li>
<li>${k.a('mount/x-mount', 'Every Fujifilm X-mount lens')}</li>
<li>${k.a('mount/rf-mount', 'Every Canon RF-mount lens')}</li>
<li>${k.a('mount/z-mount', 'Every Nikon Z-mount lens')}</li>
<li>${k.a('mount/l-mount', 'Every L-Mount lens')}</li>
<li>Pair one with a light body: ${k.a('guides/lightest-aps-c-cameras', 'the lightest APS-C cameras, ranked')}</li>
</ul>

<h2>How we weighed them</h2>
<p>Weights are each maker's published figure for the lens. We count every zoom on sale in our database, ${s.count} in all across ${s.mounts} mounts, from first-party and third-party makers. A lens made for two mounts counts once for each.</p>
<p>Discontinued lenses and lenses that are announced but not on sale yet are left out. Leica M has one zoom in our list, a manual Laowa, so it sits this one out.</p>`;
  },
};
