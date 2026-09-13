# Research — Olympus/OM System camera enumeration (task 1.1)

Sourced live 2026-09-12 (Wikipedia, DPReview, official OM System store, news
coverage) rather than from model memory — training data predates most of the
OM System era and would have missed the two newest releases entirely (see
"Surprises" below). Launch USD prices marked **TBD** need a second source at
data-entry time (task 4); everything else here is enumeration-grade, not
entry-grade — full specs and 2-source price verification happen per CLAUDE.md
in the batch tasks, not here.

**Total: 42 confirmed bodies** (35 mirrorless MFT + 7 fixed-lens Tough/TG),
after task 1.4's owner verdicts: **Olympus Air A01 excluded**, **Tough/TG
included** (against the recommendation — see decisions.md §6 for the mount-
tagging consequence this creates).

## PEN (E-P) — 5

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| e-p1 | PEN E-P1 | 2009 | true | $899.99 |
| e-p2 | PEN E-P2 | 2009 | true | $1,199.99 |
| e-p3 | PEN E-P3 | 2011 | true | TBD |
| e-p5 | PEN E-P5 | 2013 | true | TBD |
| e-p7 | PEN E-P7 | 2021 | true | TBD (€799 at EU launch; no USD figure found) |

## PEN-F — 1

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| pen-f | PEN-F | 2016 | true | $1,199.99 |

## PEN Lite (E-PL) — 9

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| e-pl1 | PEN E-PL1 | 2010 | true | $499.99 |
| e-pl2 | PEN E-PL2 | 2011 | true | $599.99 |
| e-pl3 | PEN E-PL3 | 2011 | true | TBD |
| e-pl5 | PEN E-PL5 | 2012 | true | TBD |
| e-pl6 | PEN E-PL6 | 2013 | true | TBD |
| e-pl7 | PEN E-PL7 | 2014 | true | TBD |
| e-pl8 | PEN E-PL8 | 2016 | true | TBD |
| e-pl9 | PEN E-PL9 | 2018 | true | TBD |
| e-pl10 | PEN E-PL10 | 2019 | true | TBD |

**Excluded: E-PL1s** (Nov 2010) — a mid-cycle running change to the E-PL1
(different kit lens/color options), not a distinct generation. See decisions.md.

## PEN Mini (E-PM) — 2

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| e-pm1 | PEN E-PM1 | 2011 | true | TBD |
| e-pm2 | PEN E-PM2 | 2013 | true | TBD |

## OM-D E-M1 (professional) — 4

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| e-m1 | OM-D E-M1 | 2013 | true | $1,399 |
| e-m1-ii | OM-D E-M1 Mark II | 2016 | true | $1,999.99 |
| e-m1x | OM-D E-M1X | 2019 | true | $2,999 |
| e-m1-iii | OM-D E-M1 Mark III | 2020 | true | $1,799.99 |

## OM-D E-M5 (enthusiast) — 3

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| e-m5 | OM-D E-M5 | 2012 | true | $999.99 |
| e-m5-ii | OM-D E-M5 Mark II | 2015 | true | $1,099.99 |
| e-m5-iii | OM-D E-M5 Mark III | 2019 | true | $1,199.99 |

## OM-D E-M10 (entry) — 4

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| e-m10 | OM-D E-M10 | 2014 | true | $699 |
| e-m10-ii | OM-D E-M10 Mark II | 2015 | true | $649.99 |
| e-m10-iii | OM-D E-M10 Mark III | 2017 | true | TBD (£629.99 at UK launch) |
| e-m10-iv | OM-D E-M10 Mark IV | 2020 | true (see decisions.md) | $699 |

**Excluded: E-M10 Mark III s** — a lightly-updated running change (C4K video
added), not a distinct generation. Same reasoning as E-PL1s.

## OM System (current brand identity) — 7

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| om-1 | OM-1 | 2022 | true | $2,199.99 |
| om-1-ii | OM-1 Mark II | 2024 | false | $2,399.99 |
| om-3 | OM-3 | 2025 | false | $1,999.99 |
| om-3-astro | OM-3 ASTRO | 2026 | false | $2,499.99 |
| om-5 | OM-5 | 2022 | true | $1,199.99 |
| om-5-ii | OM-5 Mark II | 2025 | false | $1,199.99 |
| pen-om | PEN (2026) | 2026 | false | $999.99 |

Current-body prices above are OM System's list/MSRP (the pre-sale
strikethrough figure on explore.omsystem.com), not the active promotional sale
price — same convention as every other brand's `priceSource` (Sony's
Original/list-vs-sale precedent). `pen-om` is used as the slug (not bare `pen`)
because "PEN" collides with the `PEN` line's own colloquial name and is
unambiguous once the site groups it under "OM System" in `SERIES_COLORS`.

## Tough (TG) — 7 (owner-approved addition, task 1.4)

Fixed-lens, waterproof/rugged 1/2.3" compacts. `lensType: 'Fixed'`,
`mount: 'mft'` per the mount-tagging convention in decisions.md §6 — the
sensor is genuinely not MFT-sized, but the field is a brand/system tag, not a
literal compatibility claim, and Olympus has only one mount to tag anything
with.

| slug | name | year | discontinued | launch USD |
|---|---|---|---|---|
| tg-1 | Tough TG-1 iHS | 2012 | true | TBD |
| tg-2 | Tough TG-2 iHS | 2013 | true | $379.99 |
| tg-3 | Tough TG-3 | 2014 | true | TBD |
| tg-4 | Tough TG-4 | 2015 | true | TBD |
| tg-5 | Tough TG-5 | 2017 | true | TBD |
| tg-6 | Tough TG-6 | 2019 | true | $449 |
| tg-7 | Tough TG-7 | 2023 | false | $549 |

**Scope interpretation applied**: the numbered TG-1…TG-7 line only. The earlier
"Stylus Tough" naming (pre-2012 models like the Tough 6000/8000, non-numbered
or differently-numbered) is treated as a separate, older product generation
and excluded — the same reasoning that excludes the Four Thirds DSLRs from the
interchangeable-lens side. Flagged explicitly rather than silently drawn; open
to revisiting if that reads as too narrow.

TG-6 was formally discontinued (Aug 2023, per OM System's Japan store) when
TG-7 launched a month later — the only Tough body still current is TG-7.

## Surprises this research turned up (would have been missed from memory alone)

1. **A brand-new interchangeable-lens "PEN" launched 2026-09-09** — 4 days ago,
   under the OM System brand, reviving the PEN name with an EVF and weather
   sealing for the first time in that line. Full T1 spec sheet already pulled
   from explore.omsystem.com (20.4MP sensor shared with OM-3, 121-pt PDAF,
   5.5-stop IBIS, IPX1 sealing, vari-angle touchscreen, OLED EVF). USD price
   confirmed; **regional prices and ASIN are not yet findable — expected for a
   4-day-old product, defer to task 8 rather than guess.**
2. **OM-3 ASTRO is a genuinely distinct product**, not a color variant: same
   sensor/IBIS/body as the OM-3, but a modified IR-cut filter tuned for
   Hα (656nm) transmission, astro-specific color profiles (COLOR1/COLOR2) and
   dedicated stacking modes (C1/C2/C3). Has its own explore.omsystem.com
   product page and its own price. Precedented by Canon's EOS Ra (a similarly
   IR-modified sibling that shipped as its own SKU) — included as a full
   separate camera entry, not a flag on `om-3`.
