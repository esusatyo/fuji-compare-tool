# Canon RF / RF-S — third-party citation ledger (v1.1)

Every lens gets **two independent source lineages** before it is entered:
tier 1 = the maker's own product page for the RF mount; tier 2 = an independent
review/measurement. Retailers (tier 3) are price/ASIN corroboration only and
never count as the second lineage.

Carried forward from `archive/2026-07-05-add-thirdparty-lenses-canon/research/`:
the RF-availability findings (Canon licensed RF-S AF to Sigma/Tamron in 2024;
Viltrox had its APS-C RF AF primes pulled by a 2022 cease-and-desist; Meike
routes around Canon with EF-mount AF → out of scope; no native RF Samyang or
Zeiss). **Those are scope facts, not spec sources** — every spec below is
re-sourced.

## Ledger

| slug | name | maker | line | type | year | disc | src1 (tier 1) | src2 (tier) | notes / conflicts |
|---|---|---|---|---|---|---|---|---|---|
| sigma-12mm-f14 | Sigma 12mm F1.4 DC \| Contemporary | Sigma | Contemporary | Prime | 2025 | no | https://www.sigma-global.com/en/lenses/c025_12_14/?tab=specifications | https://dustinabbott.net/2025/08/sigma-12mm-f1-4-dc-contemporary-review/ (2) | **RF-specific**: 250 g, φ69.0 × 67.4 mm. Abbott independently confirms "Canon version 25g more" than the 225 g E-mount copy he tested. Do **not** take the 225 g / 68.0 × 69.4 mm figures — those are Sony E. |
| sigma-15mm-f14 | Sigma 15mm F1.4 DC \| Contemporary | Sigma | Contemporary | Prime | 2026 | no | https://www.sigma-global.com/en/lenses/c026_15_14/?tab=specifications | https://dustinabbott.net/2026/02/sigma-15mm-f1-4-dc-contemporary-review/ (2) | **RF-specific**: 240 g, φ69.0 × 62.8 mm — Abbott lists the identical per-mount split. Released 12 Mar 2026 → `year: 2026`. |
| sigma-17-40mm-f18 | Sigma 17-40mm F1.8 DC \| Art | Sigma | Art | Zoom | 2025 | no | https://www.sigma-global.com/en/lenses/a025_17_40_18/ | https://dustinabbott.net/2025/06/sigma-17-40mm-f1-8-dc-art-review/ (2) | **Conflict, resolved:** Abbott lists 528 g and $829; Sigma's per-mount table gives RF = 560 g and Sigma US lists $919. Abbott reviewed a pre-RF (E/L) sample at announcement. Tier 1 wins on both: 560 g, $919. RF version launched Aug 2025. |
| tamron-17-70mm-f28 | Tamron 17-70mm F/2.8 Di III-A VC RXD (B070) | Tamron | Di III-A | Zoom | 2026 | no | https://www.tamron.com/global/consumer/lenses/b070/spec.html | https://www.tamron.eu/en/newsroom/newsroom/17-70mm-f-2-8-di-iii-a-vc-rxd-for-nikon-z-mount-and-canon-rf-mount (1, separate doc) | **New for RF** — the previous pass recorded "NOT on RF"; that changed. Announced 24 Jun 2026, shipping 2 Jul 2026, $749. RF length **117.3 mm** (tamron.com per-mount + Tamron Americas); the EU newsroom's 119.3 mm is the mount-generic figure. **tier 2 unavailable — shipped 2026-07-02; re-verify next pass.** |
| sigma-16-300mm-f35-67 | Sigma 16-300mm F3.5-6.7 DC OS \| Contemporary | Sigma | Contemporary | Zoom | 2025 | no | https://www.sigma-global.com/en/lenses/c025_16_300_35_67/?tab=specifications | https://www.ephotozine.com/article/sigma-16-300mm-f-3-5-6-7-dc-os-contemporary-lens-review-37216 (2) | **RF-specific**: 625 g (ePHOTOzine's 615 g is the L/X/E figure). `minAperture` F22-45 → store the wide end, 22. RF launched May 2025. |

## Rejected candidates (do not re-research)

| candidate | reason |
|---|---|
| ~~Tamron 17-70mm F2.8~~ | **no longer rejected** — shipped for RF 2 Jul 2026, now entered |
| Viltrox RF-S AF primes (23/33/56 f/1.4) | still only rumoured for 2026 — nothing shipping. Re-check next pass |
| Sigma full-frame DG DN (RF) | none released for RF as of this run |
| Meike AF primes | EF-mount workaround, not native RF |
| Samyang, Zeiss | no native RF |
| Viltrox 1.33× anamorphics | out of scope: cine/anamorphic |
| Viltrox 13/23/33/56 f/1.4 RF | withdrawn after Canon C&D — not shipping |
