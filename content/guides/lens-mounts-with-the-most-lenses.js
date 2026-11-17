// Guide: which lens mount has the most lenses? Draft for the owner, 2026-11-18.
'use strict';

const MOUNT = { e: 'Sony E', z: 'Nikon Z', x: 'Fujifilm X', rf: 'Canon RF', l: 'L-Mount', mft: 'Micro Four Thirds', m: 'Leica M', g: 'Fujifilm GFX' };
const MOUNT_PAGE = { e: 'e-mount', z: 'z-mount', x: 'x-mount', rf: 'rf-mount', l: 'l-mount', mft: 'micro-four-thirds-mount', m: 'm-mount', g: 'g-mount' };
// "From the camera maker": made by a company that builds cameras for that mount.
const CAMERA_MAKERS = {
  e: ['Sony'], z: ['Nikon'], x: ['Fujifilm'], g: ['Fujifilm'], rf: ['Canon'],
  l: ['Panasonic', 'Leica', 'Sigma'], mft: ['Panasonic', 'OM System', 'Olympus'], m: ['Leica'],
};
const SOURCES = {
  sonyEmount: 'https://www.sony.com/en/SonyInfo/News/Press/201102/11-018E/',
  sigmaRF: 'https://www.sigma-global.com/en/news/2024/04/23/010362/',
  lMount: 'https://l-mount.com/',
};
// Our afType vocabulary: anything but Manual (or missing) is an autofocus motor.
const isAF = l => l.afType != null && !/^manual$/i.test(String(l.afType).trim());
const pct = (a, b) => Math.round((100 * a) / b);

module.exports = {
  slug: 'lens-mounts-with-the-most-lenses',
  title: 'Which Lens Mount Has the Most Lenses? 2026 Ranking',
  headline: 'Which lens mount has the most lenses?',
  dek: 'Every mirrorless mount, counted. One of them is suspiciously popular.',
  published: '2026-11-18',
  query: {
    text: 'which lens mount has the most lenses',
    evidence: 'Owner decision 2026-11-18: written for outreach and AI-answer citation rather than search volume (Bing volume for this site is small either way). Uses the full lens catalogue, which nobody else publishes in one place.',
  },

  snapshot(brandData) {
    // One entry per lens per mount; copies of a lens in several brand files of
    // one mount are folded.
    const lenses = new Map();
    for (const data of Object.values(brandData)) {
      for (const l of Object.values(data.LENSES)) {
        if (l.discontinued || l.preRelease) continue;
        lenses.set(`${l.mount}|${l.manufacturer}|${l.name}`, l);
      }
    }
    const mounts = {};
    const rfOtherAF = [];
    for (const l of lenses.values()) {
      const m = (mounts[l.mount] ??= { mount: l.mount, total: 0, own: 0, other: 0, otherAF: 0, makers: {} });
      m.total++;
      if ((CAMERA_MAKERS[l.mount] || []).includes(l.manufacturer)) m.own++;
      else {
        m.other++;
        if (isAF(l)) {
          m.otherAF++;
          if (l.mount === 'rf') rfOtherAF.push({ maker: l.manufacturer, year: l.year, apsc: parseFloat(String(l.focalLengthEquiv)) / (l.focalLengthMin || l.focalLength) > 1.2 });
        }
        m.makers[l.manufacturer] = (m.makers[l.manufacturer] || 0) + 1;
      }
    }
    const rows = Object.values(mounts)
      .filter(m => MOUNT[m.mount])
      .map(m => ({
        mount: m.mount, total: m.total, own: m.own, other: m.other, otherAF: m.otherAF,
        otherMakers: Object.keys(m.makers).length,
        topMakers: Object.entries(m.makers).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4),
      }))
      .sort((a, b) => b.total - a.total);
    return {
      rows, count: lenses.size,
      rfAF: { first: Math.min(...rfOtherAF.map(l => l.year)), allApsc: rfOtherAF.every(l => l.apsc), makers: [...new Set(rfOtherAF.map(l => l.maker))].sort() },
    };
  },

  description(s) {
    const [e] = s.rows;
    return `Sony E-mount has the most lenses: ${e.total} on sale, ${pct(e.other, e.total)}% of them from other makers. Here's every mirrorless mount ranked, and why Canon RF trails.`;
  },

  claims(s) {
    const by = Object.fromEntries(s.rows.map(r => [r.mount, r]));
    const [first, second] = s.rows;
    return [
      ['Sony E has the most lenses', first.mount === 'e'],
      ['Nikon Z is second', second.mount === 'z'],
      ['Over 80% of Sony E lenses come from other makers', pct(by.e.other, by.e.total) > 80],
      ['Sigma is the biggest third-party maker on Sony E', by.e.topMakers[0][0] === 'Sigma'],
      ['Canon RF has fewer third-party autofocus lenses than Sony E, Nikon Z or Fujifilm X', ['e', 'z', 'x'].every(m => by[m].otherAF > by.rf.otherAF)],
      ['Sony E has more than ten times Canon RF\'s third-party autofocus lenses', by.e.otherAF > 10 * by.rf.otherAF],
      ['Laowa is the biggest third-party maker on Canon RF, with no autofocus RF lens', by.rf.topMakers[0][0] === 'Laowa' && !s.rfAF.makers.includes('Laowa')],
      ['Most L-Mount lenses come from its camera makers', by.l.own > by.l.other],
      ['Every Fujifilm GFX lens is made by Fujifilm', by.g.other === 0 && by.g.total > 0],
      ['No third-party Leica M lens autofocuses', by.m.otherAF === 0 && by.m.other > 0],
      ['Voigtländer is the biggest third-party maker on Leica M', by.m.topMakers[0][0] === 'Voigtländer'],
      ['About three in four Fujifilm X lenses come from other makers', Math.abs(pct(by.x.other, by.x.total) - 75) <= 3],
      ['Other makers outnumber the camera maker about three to five to one on Sony E, Nikon Z and Fujifilm X',
        ['e', 'z', 'x'].every(m => by[m].other / by[m].own >= 2.5 && by[m].other / by[m].own <= 5)],
      ['L-Mount and Micro Four Thirds are close to even', ['l', 'mft'].every(m => by[m].other / by[m].own > 0.6 && by[m].other / by[m].own < 1.4)],
      ['Sony E has the most third-party autofocus lenses', s.rows.every(r => r.mount === 'e' || r.otherAF < by.e.otherAF)],
      ['Every third-party autofocus RF lens arrived in 2024 or later, and all are APS-C', s.rfAF.first >= 2024 && s.rfAF.allApsc],
      ['GFX has the fewest lenses', s.rows[s.rows.length - 1].mount === 'g'],
    ];
  },

  render(s, k) {
    const by = Object.fromEntries(s.rows.map(r => [r.mount, r]));
    const [e, z] = s.rows;
    const mountLink = r => k.a(`mount/${MOUNT_PAGE[r.mount]}`, k.esc(MOUNT[r.mount]));
    const table = k.table(
      ['#', 'Mount', 'Lenses', 'By other makers', 'Of those, autofocus'],
      s.rows.map((r, i) => [i + 1, mountLink(r), r.total, `${r.other} (${pct(r.other, r.total)}%)`, r.otherAF]),
      { rowHeader: 1 },
    );
    const chart = k.stacked({
      caption: 'Current lenses for each mirrorless mount in our database, split by who makes them. Bars start at zero.',
      rows: s.rows.map(r => ({ label: MOUNT[r.mount], parts: [{ value: r.own, series: 1 }, { value: r.other, series: 2 }] })),
      legend: [['From the camera maker', 1], ['From other makers', 2]],
      table: { head: ['Mount', 'From the camera maker', 'From other makers', 'Total'], rows: s.rows.map(r => [k.esc(MOUNT[r.mount]), r.own, r.other, r.total]) },
    });
    const makers = r => r.topMakers.map(([name, n]) => `${k.esc(name)} (${n})`).join(', ');
    return `
<p class="guide-answer"><strong>Sony E-mount</strong> has the most lenses: <strong>${e.total}</strong> on sale, and ${e.other} of them (${pct(e.other, e.total)}%) come from makers other than Sony. ${k.esc(MOUNT[z.mount])} is a surprise second with ${z.total}.</p>

<h2>Every mirrorless mount, ranked by lens count</h2>
<p>Here's the full count, current lenses only. Tap a mount to browse every lens for it.</p>
${table}

<h2>Who makes all those lenses?</h2>
<p>The camera makers build the backbone. Everyone else builds the crowd.</p>
${chart}
<p>On Sony E, Nikon Z and Fujifilm X, other makers outnumber the camera maker by roughly three to five to one. On L-Mount and Micro Four Thirds, it's closer to even, because several camera makers share each mount.</p>

<h2>Why does Sony E have so many?</h2>
<p>A fifteen-year head start. Sony ${k.src(SOURCES.sonyEmount, 'opened the E-mount specifications to other lens makers in 2011')}, free of charge, back when the mount was only on its tiny NEX cameras.</p>
<p>The crowd showed up: ${makers(e)}. Sony E now has ${e.otherAF} third-party autofocus lenses, more than any other mount.</p>

<h2>Why does Canon RF trail?</h2>
<p>Canon RF has ${by.rf.other} lenses from other makers, but only ${by.rf.otherAF} of them autofocus. Sony E has ${by.e.otherAF}.</p>
<p>Every one of those ${by.rf.otherAF} arrived in ${s.rfAF.first} or later, starting with Sigma lenses ${k.src(SOURCES.sigmaRF, 'made under license from Canon')}, and all of them are for Canon's APS-C bodies. The other ${by.rf.other - by.rf.otherAF} are manual focus. The biggest third-party maker on RF is Laowa, with ${by.rf.topMakers[0][1]} lenses, and not one of them autofocuses.</p>

<h2>Is more always better?</h2>
<p>Not really. L-Mount has ${by.l.total} lenses, and ${by.l.own} come from Leica, Panasonic and Sigma, three camera makers who share the mount through the ${k.src(SOURCES.lMount, 'L-Mount Alliance')}.</p>
<p>Fujifilm GFX has just ${by.g.total} lenses, every one by Fujifilm. Leica M has ${by.m.total}, ${by.m.other} of them from other makers, led by Voigtländer with ${by.m.topMakers[0][1]}, and none of those autofocus. It's a rangefinder mount; that's rather the point.</p>
<p>My own X-S20 sits on Fujifilm X: ${by.x.total} lenses, about three in four from other makers. My favorite is still Fujifilm's own XC 15-45mm.</p>

<h2>Browse the lenses</h2>
<ul class="guide-links">
<li>${k.a('mount/', 'Every lens mount, with every camera and lens that fits it')}</li>
<li>${k.a('mount/e-mount', 'All Sony E-mount lenses')} and ${k.a('mount/rf-mount', 'all Canon RF lenses')}</li>
<li>${k.a('kit/', 'Build a kit')}: a body plus up to six lenses, total weight and price</li>
<li>${k.a('guides/lightest-aps-c-zoom-lenses', 'The lightest APS-C zoom lenses, ranked')}</li>
<li>How we check every lens spec: ${k.a('articles/camera-specs-we-got-wrong-2026', 'the camera specs we got wrong')}</li>
</ul>

<h2>How we counted</h2>
<p>We count every current lens in our database for each mirrorless mount, ${s.count} in all. A lens sold for several mounts counts once for each. "From the camera maker" means a company that builds cameras for that mount.</p>
<p>Discontinued lenses, lenses announced but not on sale yet, and adapted lenses (Canon EF on RF, for example) aren't counted. Our list of budget manual-focus lenses is broad but may not be complete.</p>`;
  },
};
