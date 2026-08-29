# Canon RF third-party lens candidate ledger (round 2)

One row per candidate, filled during research before any data entry. Rejected
candidates stay in the table with a reason so a later pass doesn't
re-research them. See `openspec/changes/archive/2026-08-05-expand-thirdparty-lenses-canon/research/lenses.md`
for round 1's ledger (34 rows including TTArtisan/7Artisans dimension tables)
— don't duplicate its confirmed facts, only its still-open items.

| slug | name | maker | line | type | year | disc | src1 (tier 1) | src2 (tier) | notes / conflicts |
|---|---|---|---|---|---|---|---|---|---|
| tamron-17-70mm-f28 | Tamron 17-70mm f/2.8 Di III-A VC RXD | Tamron | Di III-A | Zoom | 2026 | no | https://tamron-americas.com/canon/ (re-confirms RF-specific 117.3 mm / 530 g) | none found — see notes | **Re-verification, no new candidate.** Round 1 entered this on tier-1 alone (shipped 2026-07-02, no tier-2 existed yet). Re-checked 2026-08-29, ~2 months post-ship: **still no tier-2 hands-on review of the RF copy exists.** rfshooters.com's Canon-RF forum (thread "In-depth review of Tamron's 17-70 f2.8 for RF since it's release?") confirms this directly — as of the thread, "a few on YT" but no written measured review. dustinabbott.net, lenstip, ephotozine, the-digital-picture.com all only have reviews of the original 2021 Sony E-mount / 2023 Fujifilm X-mount copy (the-digital-picture.com's page is an archive.org-dated March-2026 snapshot, i.e. pre-dates the 2026-07-02 RF ship date, so it is not RF-specific either). All stored figures (530 g, 117.3 mm, 67 mm filter, $749 USD) re-confirmed unchanged against tamron-americas.com's Canon RF mount page. photographytalk.com's "review" independently states the same per-mount breakdown (RF 530 g/117.3 mm vs Sony E 525 g/119.3 mm vs Fuji X 530 g/119.6 mm vs Nikon Z 540 g/121.3 mm) but reads as a spec-comparison piece with no hands-on testing claims — logged as T4 corroboration only, not counted as the tier-2 lineage. No figure needed correcting. `specSources` added to the entry recording this. |

## No new Sigma or Tamron candidates found

Both makers' current Canon RF-S lineups were enumerated directly against their
own sites and matched the 10 Sigma + 3 Tamron entries already in `canon/data.js`
exactly — nothing new to enter this round.

**Sigma (10/10, unchanged):** `sigma-global.com/en/special/sigma_rfmount_lenses/`
(Sigma's own dedicated Canon RF mount lens landing page, T1) lists exactly:
12mm f/1.4 DC, 15mm f/1.4 DC, 16mm f/1.4 DC DN, 23mm f/1.4 DC DN, 30mm f/1.4 DC DN,
56mm f/1.4 DC DN, 10-18mm f/2.8 DC DN, 16-300mm f/3.5-6.7 DC OS, 17-40mm f/1.8 DC,
18-50mm f/2.8 DC DN — all 10 already in `canon/data.js`. Cross-checked against a
general web search for any Sigma RF announcement after the 15mm f/1.4 (Mar 2026,
the most recent addition already entered) through 2026-08-29: none found.

**Tamron (3/3, unchanged):** `tamron.com/global/consumer/lenses/canon_rf/` and
`tamron-americas.com/canon/` (both T1) list exactly: 11-20mm f/2.8 Di III-A RXD
(B060), 17-70mm f/2.8 Di III-A VC RXD (B070), 18-300mm f/3.5-6.3 Di III-A VC VXD
(B061) — all 3 already in `canon/data.js`. Cross-checked against a general web
search for any Tamron RF announcement after the 17-70mm (Jun 2026) through
2026-08-29: none found (a Digital Camera World piece on Tamron's 2026 roadmap
mentions plans to expand across "four mounts" generically but names no specific
new Canon RF SKU).

**No rejected candidates this round** — there was nothing new to consider for
either maker; both lineups were fully accounted for already.
