// Guide: the lightest APS-C zoom lenses, by mount, with full-frame as an
// extension. Prose approved by the owner 2026-11-17.
'use strict';

const MAKER_BRAND = { Panasonic: 'panasonic', 'OM System': 'olympus', Sony: 'sony', Fujifilm: 'fujifilm', Canon: 'canon', Nikon: 'nikon', Leica: 'leica', Sigma: 'sigma' };
const MOUNT = { rf: 'Canon RF-S', x: 'Fujifilm X', z: 'Nikon Z DX', e: 'Sony E', l: 'L-Mount' };
const FF_MOUNT = { rf: 'Canon RF', z: 'Nikon Z', e: 'Sony E', l: 'L-Mount' };
const APSC_MOUNTS = ['e', 'x', 'rf', 'z'];
const FF_MOUNTS = ['l', 'e', 'z', 'rf'];
// Colour follows the brand, as in the lightest APS-C cameras guide.
const MOUNT_SERIES = { x: 1, rf: 2, e: 3, z: 4 };
const MOUNT_BRAND = { x: 'Fujifilm', rf: 'Canon', e: 'Sony', z: 'Nikon' };
const CHART_SIZE = 10;

// Sensor format from the stored full-frame-equivalent focal length (a crop of
// about 1.0 is full-frame). Micro Four Thirds and GFX lenses are out of scope.
function format(l) {
  if (l.mount === 'mft' || l.mount === 'g' || l.mount === 'm') return null;
  const crop = parseFloat(String(l.focalLengthEquiv)) / (l.focalLengthMin || l.focalLength);
  return crop < 1.2 ? 'Full-frame' : 'APS-C';
}

const fullName = l => (l.name.startsWith(l.manufacturer) ? l.name : `${l.manufacturer} ${l.name}`);
const shortName = l => l.name.replace(/^(Sigma|Tamron|Laowa|Samyang|Viltrox)\s+/, '');

module.exports = {
  slug: 'lightest-aps-c-zoom-lenses',
  title: 'Lightest APS-C Zoom Lenses in 2026, Ranked by Mount',
  headline: 'The lightest APS-C zoom lenses, ranked',
  dek: "A zoom you forget is in the bag. Here's who makes one.",
  published: '2026-11-17',
  query: {
    text: 'lightest APS-C zoom lens',
    evidence: 'Weight and size queries lead Bing and Search Console (Nov 2026); the kit builder and mount pages have no text answering "which zoom is lightest".',
  },

  snapshot(brandData) {
    // One entry per lens per mount (a design sold through several brand files
    // of one mount is folded), preferring the maker's own brand file for links.
    const byKey = new Map();
    for (const [b, data] of Object.entries(brandData)) {
      for (const [id, l] of Object.entries(data.LENSES)) {
        if (l.type !== 'Zoom' || l.discontinued || l.preRelease) continue;
        const fmt = format(l);
        if (!fmt) continue;
        const key = `${l.manufacturer}|${l.name}|${l.mount}`;
        const entry = {
          b, id, name: l.name, manufacturer: l.manufacturer, mount: l.mount, fmt,
          weight: l.weight, length: l.length, equiv: String(l.focalLengthEquiv).replace(/–/g, '-'),
          maxAperture: l.maxAperture, tele: l.focalLengthMax, usd: l.prices.USD,
        };
        const prev = byKey.get(key);
        if (!prev || (MAKER_BRAND[l.manufacturer] === b && MAKER_BRAND[prev.manufacturer] !== prev.b)) byKey.set(key, entry);
      }
    }
    const zooms = [...byKey.values()].sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name));
    const apsc = zooms.filter(z => z.fmt === 'APS-C');
    // The next-lightest zoom of the same mount and format in the same brand
    // file, for the brand page deep link.
    const withMate = z => {
      const mate = zooms.find(o => o !== z && o.b === z.b && o.mount === z.mount && o.fmt === z.fmt);
      return { ...z, mate: mate ? mate.id : null };
    };
    const xs20 = brandData.fujifilm.CAMERAS['x-s20'];
    const x1545 = apsc.find(z => z.mount === 'x' && z.id === 'xc-15-45mm-f35-56');
    return {
      count: apsc.length,
      apscMounts: [...new Set(apsc.map(z => z.mount))].sort(),
      perMount: APSC_MOUNTS.map(m => apsc.find(z => z.mount === m)).filter(Boolean).sort((a, b) => a.weight - b.weight).map(withMate),
      top: apsc.slice(0, CHART_SIZE),
      xTop3: apsc.filter(z => z.mount === 'x' && z.b === 'fujifilm').slice(0, 3).map(z => z.id),
      fullFrame: FF_MOUNTS.map(m => zooms.find(z => z.mount === m && z.fmt === 'Full-frame')).filter(Boolean).sort((a, b) => a.weight - b.weight).map(withMate),
      f28: apsc.find(z => z.maxAperture === 2.8 && /f\/?2\.8(?![\d.]*-)/i.test(z.name)) || null,
      x1545: x1545 ? { id: x1545.id, name: x1545.name, weight: x1545.weight } : null,
      xs20: { weight: xs20.weight },
    };
  },

  description(s) {
    const [first] = s.perMount;
    return `The lightest APS-C zoom lens you can buy is Sony's E 16-50mm PZ II, at just ${first.weight} g. Here's the lightest zoom for Sony, Fujifilm, Canon and Nikon.`;
  },

  claims(s) {
    const [first, second] = s.perMount;
    const spread = s.perMount[s.perMount.length - 1].weight - first.weight;
    const ff = s.fullFrame[0];
    const heaviestWinner = s.perMount[s.perMount.length - 1];
    const xMount = s.perMount.find(z => z.mount === 'x');
    const countBy = m => s.top.filter(z => z.mount === m).length;
    return [
      ['APS-C zooms come in four mounts here: Sony E, Fujifilm X, Canon RF-S, Nikon Z DX', s.apscMounts.join() === 'e,rf,x,z'],
      ["The lightest APS-C zoom is Sony's E 16-50mm PZ II, lighter than most phones (~170 g)", first.id === 'e-16-50mm-f35-56-pz-oss-ii' && first.weight < 150],
      ["Fujifilm's XC 13-33mm is second", second.id === 'xc-13-33mm-f35-63'],
      ['All four mounts\' winners sit within 30 g of each other', spread <= 30],
      ['Half of the ten lightest APS-C zooms are power zooms (PZ in the name)', s.top.length === 10 && s.top.filter(z => /\bPZ\b/.test(z.name)).length === 5],
      ['Fujifilm and Canon each have three of the ten lightest', countBy('x') === 3 && countBy('rf') === 3],
      ['Every mount winner starts at f/3.5 or slower', s.perMount.every(z => z.maxAperture >= 3.5)],
      ['Every mount winner is a variable-aperture zoom', s.perMount.every(z => /\d-\d/.test(z.name.replace(/^.*?(f\/|F)(?=\d)/, '')))],
      ['The lightest constant f/2.8 APS-C zoom weighs more than twice the lightest zoom', s.f28 && s.f28.weight > 2 * first.weight],
      ['The lightest full-frame zoom is the Panasonic LUMIX S 18-40mm', ff.id === 'lumix-s-18-40mm-f4-5-6-3'],
      ["The LUMIX S 18-40mm is 20 g heavier than Nikon's DX 16-50mm, the heaviest mount winner",
        heaviestWinner.id === 'z-dx-16-50mm-vr' && ff.weight - heaviestWinner.weight === 20],
      ['Sony, Nikon and Canon each make a full-frame zoom under 250 g that stops at 50 or 60mm',
        ['e', 'z', 'rf'].every(m => { const z = s.fullFrame.find(o => o.mount === m); return z && z.weight < 250 && [50, 60].includes(z.tele); })],
      ['The lightest X-mount zoom is the XC 13-33mm, 10 g lighter than the XC 15-45mm',
        xMount.id === 'xc-13-33mm-f35-63' && s.x1545 && s.x1545.weight - xMount.weight === 10],
      ['The three lightest X-mount zooms start with the XC 13-33mm and XC 15-45mm',
        s.xTop3.length === 3 && s.xTop3[0] === 'xc-13-33mm-f35-63' && s.xTop3[1] === 'xc-15-45mm-f35-56'],
    ];
  },

  render(s, k) {
    const [first] = s.perMount;
    const last = s.perMount[s.perMount.length - 1];
    const ff = s.fullFrame[0];
    const xMount = s.perMount.find(z => z.mount === 'x');
    const deep = z => `${z.b}/#lenses=${z.id}${z.mate ? ',' + z.mate : ''}`;
    const head = ['Mount', 'Lens', 'Weight', 'Length', 'Range (full-frame equiv.)', 'Price (USD)'];
    const row = names => z => [k.esc(names[z.mount]), k.a(deep(z), k.esc(fullName(z))), `${z.weight} g`, `${z.length} mm`, k.esc(z.equiv), k.usd(z.usd)];
    const chart = k.bars({
      caption: "The ten lightest APS-C zoom lenses on sale, maker's published weight. Bars start at zero.",
      bars: s.top.map(z => ({ label: shortName(z).replace(/(\d)mm\b.*$/, '$1mm'), sub: z.manufacturer === MOUNT_BRAND[z.mount] ? MOUNT[z.mount] : `${z.manufacturer}, ${MOUNT[z.mount]}`, value: z.weight, series: MOUNT_SERIES[z.mount] })),
      legend: [['Fujifilm X', 1], ['Canon RF-S', 2], ['Sony E', 3], ['Nikon Z DX', 4]],
      table: { head: ['Lens', 'Mount', 'Weight'], rows: s.top.map(z => [k.esc(fullName(z)), k.esc(MOUNT[z.mount]), `${z.weight} g`]) },
    });
    const xs20Kit = `kit/#kit=fujifilm:x-s20,fujifilm:${s.x1545.id}`;
    return `
<p class="guide-answer">The lightest APS-C zoom lens you can buy new is the <strong>${k.esc(fullName(first))}</strong>, at <strong>${first.weight} g</strong>. That's lighter than most phones. Fujifilm, Canon and Nikon are all within ${last.weight - first.weight} g of it.</p>

<h2>The lightest APS-C zoom for every mount</h2>
<p>One winner per mount, current lenses only. Tap a name to put it next to that mount's runner-up.</p>
${k.table(head, s.perMount.map(row(MOUNT)), { rowHeader: 1 })}
<p>Four brands, ${last.weight - first.weight} g between them. When it comes to the lightest kit zoom, everyone has been to the same gym.</p>

<h2>Which APS-C zooms are lightest overall?</h2>
<p>Here are the ten lightest APS-C zooms on sale, colored by mount.</p>
${chart}
<p>Fujifilm and Canon each place three. Half of the ten are power zooms, with PZ in the name: a motor does the zooming, so the barrel can tuck away when the camera's off.</p>

<h2>What do you give up for a light zoom?</h2>
<p>Speed, mostly. Every mount's winner starts at f/3.5 or slower, and gets darker as you zoom in.</p>
<p>Want f/2.8 all the way through? The lightest APS-C option we list is the ${k.esc(fullName(s.f28))} for ${k.esc(MOUNT[s.f28.mount])}, at ${s.f28.weight} g. That's more than twice the weight of the ${k.esc(shortName(first).replace(/ F[\d.].*$/, ''))}.</p>

<h2>What I'd put on my X-S20</h2>
<p>Full disclosure: I shoot with a Fujifilm X-S20, and I really enjoy it. My zoom of choice on it is the ${k.esc(shortName(s.x1545).replace(/ f\/.*$/, ''))}, at ${s.x1545.weight} g.</p>
<p>Fujifilm's new ${k.esc(shortName(xMount).replace(/ f\/.*$/, ''))} is ${s.x1545.weight - xMount.weight} g lighter, if you're counting. ${k.a(`fujifilm/#lenses=${s.xTop3.join(',')}`, 'Compare the three lightest X-mount zooms')}, or ${k.a(xs20Kit, 'weigh my X-S20 and XC 15-45mm kit')} (${s.xs20.weight + s.x1545.weight} g all in).</p>

<h2>Going full-frame?</h2>
<p>Full-frame zooms are bigger, but not by as much as you'd think. These are the lightest, one per mount.</p>
${k.table(head, s.fullFrame.map(row(FF_MOUNT)), { rowHeader: 1 })}
<p>Panasonic's LUMIX S 18-40mm is only ${ff.weight - last.weight} g heavier than Nikon's DX 16-50mm. Sony, Nikon and Canon each make one under 250 g, all short zooms that stop at 50 or 60mm.</p>

<h2>Browse every lens by mount</h2>
<ul class="guide-links">
<li>${k.a('mount/e-mount', 'Every Sony E-mount lens')}</li>
<li>${k.a('mount/x-mount', 'Every Fujifilm X-mount lens')}</li>
<li>${k.a('mount/rf-mount', 'Every Canon RF-mount lens')}</li>
<li>${k.a('mount/z-mount', 'Every Nikon Z-mount lens')}</li>
<li>${k.a('mount/l-mount', 'Every L-Mount lens')}</li>
<li>Pair one with a light body: ${k.a('guides/lightest-aps-c-cameras', 'the lightest APS-C cameras, ranked')}</li>
</ul>

<h2>How we weighed them</h2>
<p>Weights are each maker's published figure for the lens. We count every APS-C zoom on sale in our database, ${s.count} in all, from first-party and third-party makers. A lens made for two mounts counts once for each.</p>
<p>Full-frame lenses also fit Sony E, Canon RF and Nikon Z APS-C bodies, with a crop, but this ranking covers lenses made for APS-C. Discontinued lenses and lenses that are announced but not on sale yet are left out.</p>`;
  },
};
