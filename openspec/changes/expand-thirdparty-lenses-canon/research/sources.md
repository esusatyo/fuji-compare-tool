# Canon RF third-party lens sources (round 2)

Per-source ledger — every URL read during this round, what it was used for,
and its reliability class. T1 maker's own site (incl. regional) · T2
independent measurement/review · T3 retailer (price/availability only) · T4
aggregator (tables only, never mount attribution) · NEWS dated announcement
(`year` only).

Record sources for rejected facts too, with the reason — that's what stops a
later pass "correcting" a right value to a wrong one.

## Batch: Sigma + Tamron re-check (2026-08-29)

| URL | Tier | Used for | Notes |
|---|---|---|---|
| https://www.sigma-global.com/en/special/sigma_rfmount_lenses/ | T1 | Enumerate Sigma's full current Canon RF lineup | Sigma's own dedicated RF-mount landing page. Lists exactly the 10 lenses already in `canon/data.js`: 12mm/15mm/16mm/23mm/30mm/56mm f/1.4 DC(DN), 10-18mm f/2.8, 18-50mm f/2.8, 17-40mm f/1.8, 16-300mm f/3.5-6.7. No new SKU. |
| https://www.tamron.com/global/consumer/lenses/canon_rf/ | T1 | Enumerate Tamron's full current Canon RF lineup | Lists exactly the 3 already entered: B060 (11-20mm f/2.8), B070 (17-70mm f/2.8), B061 (18-300mm f/3.5-6.3). No new SKU. |
| https://tamron-americas.com/canon/ | T1 | Cross-check + re-confirm `tamron-17-70mm-f28` RF-specific dims | Tamron's US regional site, same 3-lens list; restates B070's RF-specific 117.3 mm / 530 g, matching the stored entry exactly. |
| https://rfshooters.com/threads/in-depth-review-of-tamron%E2%80%99s-17-70-f2-8-for-rf-since-it%E2%80%99s-release.6322/ | — (forum, not a spec source) | Confirm whether a tier-2 review of the RF B070 exists yet | Canon-RF-focused forum thread explicitly asking for an in-depth review; replies note only YouTube coverage exists, no written measured review. Used as evidence of *absence* of a tier-2 source, not as a spec source itself. |
| https://www.the-digital-picture.com/Reviews/Tamron-17-70mm-F2-8-Di-III-A-VC-RXD-Lens.aspx | rejected as tier-2 for RF | Checked as a candidate tier-2 review | 403s to direct fetch; archive.org's closest snapshot is dated 2026-03-22, which pre-dates the RF ship date (2026-07-02) — so even if reachable, this page covers the original E/X-mount lens, not the RF copy. Not usable as RF-specific corroboration. |
| https://dustinabbott.net/2021/01/tamron-17-70mm-f2-8-di-iii-a-vc-rxd-b070-review/ + https://dustinabbott.net/2023/07/tamron-17-70mm-f2-8-vc-rxd-x-mount-review/ | rejected as tier-2 for RF | Checked as a candidate tier-2 review | Both are reviews of the 2021 Sony E-mount and 2023 Fujifilm X-mount copies respectively — no RF-mount review found on the site as of 2026-08-29. |
| https://www.photographytalk.com/tamron-17-70mm-f-2-8-review-the-aps-c-zoom-lands-on-canon-rf-and-nikon-z/ | T4 | Corroborate `tamron-17-70mm-f28`'s RF dims | Independently states the same per-mount breakdown as Tamron's own site (RF 530 g/117.3 mm) but the piece is a spec-comparison writeup, not a hands-on test — no first-person measurement claims, reads consistent with the "LLM-generated aggregator prose" pattern flagged in round 1's ledger. Logged as corroboration only; not counted as the tier-2 lineage. |
| https://www.dpreview.com/news/6760897095/tamron-17-70mm-f2p8-rf-z-mount-canon-nikon | blocked | Attempted as a possible tier-2/news source | DPReview 403s WebFetch (known blocker, per skill notes) and Bash `curl` was not attempted given the other sources already answered the question. |
