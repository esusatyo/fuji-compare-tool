# Handoff: Logo & Color Theme System — Compare Camera Specs

## Overview
A single logo mark ("Framed Duo") and a unified color token system to replace the per-camera-brand color themes currently used across the site. One dark neutral theme is the primary/default; three lighter theme variants are alternates if a light mode is wanted.

## About the Design Files
The files in this bundle are **design references built in HTML** — they show intended look, layout, and color usage, not production code to copy directly. Recreate these designs in the target codebase's existing environment (its component library / CSS approach) using its established patterns. `design_reference.dc.html` is a single scrollable reference canvas; open it in a browser to see every option live, side by side.

## Fidelity
**High-fidelity.** Colors, the logo geometry, and component treatments (nav, buttons, badges, table) are final — implement pixel-accurately. Copy/microcopy shown ("Compare now", "Best value", etc.) is illustrative placeholder, not final content.

## Logo
**Chosen mark: "Framed Duo"** (labeled 1c in the reference file). A viewfinder frame (four corner brackets, no full border) containing two overlapping circles.
- Meaning: the corner brackets read as a camera viewfinder; the two circles read as two subjects/products being compared.
- Construction (64×64 viewBox): corner brackets are 4 open L-shaped paths, `stroke-width: 3`, `stroke-linecap: round`, no fill. Two circles, radius 10, centered at (24,32) and (40,32), each filled solid with one of the two accent colors (no stroke).
- Minimum size: legible down to ~20px (nav-bar scale). Do not add a wordmark inside the mark itself — pair mark + separate text lockup (mark + "Compare Camera Specs" in Inter 700) as shown in the nav example.
- SVG files provided in `/assets`:
  - `logo-dark-theme.svg` — for use on dark backgrounds (light gray brackets, purple + teal circles)
  - `logo-light-lavender.svg` — for use on light backgrounds (Lavender & Sand theme colors)
  - `logo-monochrome.svg` — single-color version (#3A3A3A) for contexts needing a flat/one-color mark (favicon fallback, print, watermark)
- For a favicon/app icon, crop tightly to the mark (drop surrounding padding) and keep both circles at equal visual weight.

## Color Themes
Four themes total: one dark (default) + three light alternates. All replace the current per-brand color theming — the same tokens apply site-wide regardless of which cameras are being viewed.

### Theme A — Dark Neutral (default/primary)
| Token | Value | Use |
|---|---|---|
| `bg-deep` | `oklch(0.12 0.015 255)` (~#131722) | page background |
| `bg-surface` | `oklch(0.16–0.19 0.015 255)` (~#20242F–#262B38) | cards, nav bar |
| `border` | `oklch(0.26–0.28 0.015 255)` (~#3C4150) | card/table borders |
| `text-primary` | `oklch(0.95 0.005 255)` (~#ECEDF1) | headings |
| `text-secondary` | `oklch(0.65–0.75 0.02 255)` (~#9CA3B5–#B7BCC9) | body/labels |
| `accent-primary` | `oklch(0.68 0.17 300)` (~#B48CE0, purple) | "camera A" / primary CTA |
| `accent-secondary` | `oklch(0.68 0.17 170)` (~#4FC7B0, teal) | "camera B" / secondary state |

### Theme B — Sage & Clay (light)
- Background `oklch(0.98 0.005 90)` (~#FAF9F6), border `oklch(0.9 0.01 90)`
- Accent primary (sage) `oklch(0.62–0.7 0.08–0.09 150)` (~#7FAE8E)
- Accent secondary (clay) `oklch(0.65–0.72 0.09 50)` (~#C08A5F)

### Theme C — Sky & Coral (light)
- Background `oklch(0.98 0.005 250)` (~#FAFBFD), border `oklch(0.94 0.006 250)` (softened)
- Accent primary (sky) `oklch(0.65–0.72 0.09 235)` (~#7FA8D6)
- Accent secondary (coral) `oklch(0.68–0.75 0.09 20)` (~#D68F6E)

### Theme D — Lavender & Sand (light)
- Background `oklch(0.97 0.006 320)` (~#F8F5F7), border `oklch(0.94 0.007 320)` (softened)
- Accent primary (lavender) `oklch(0.65 0.09 300)` (~#A67FC9)
- Accent secondary (sand) `oklch(0.7 0.07 80)` (~#C9A870)

Accent color usage convention across all themes:
- **Primary accent** = leading/highlighted option, primary CTA button, "Camera A" column in comparisons
- **Secondary accent** = alternate option, secondary state, "Camera B" column
- Both accents also drive badges at ~16–20% opacity fill with the full-strength color as text (e.g. `accent-primary/0.18` background + `accent-primary` text)

## Components Shown
- **Nav bar**: logo mark (24px) + wordmark (15px/700) + nav links (13px, text-secondary) + primary CTA button on the right, on `bg-surface`.
- **Spec comparison table**: header row labels each compared camera in its accent color (700 weight); the winning cell per row gets a subtle accent-tinted background (accent/0.15) and bold text; non-winning cells are plain text-secondary.
- **Buttons**: primary (filled accent-primary, dark text on it for contrast), secondary (filled accent-secondary), tertiary/outline (transparent, 1px border, text-primary).
- **Badges**: pill shape, accent/0.18 background, accent-colored text, 700 weight, ~12px.
- **Camera cards**: image area placeholder, badge, title (700), one-line meta in text-secondary.

## Design Tokens Summary
- **Typography**: Inter (400/500/600/700/800) for all UI text; JetBrains Mono used only for small numeric/spec labels if a technical accent is wanted (optional, not required).
- **Radius**: 9px buttons, 12–16px cards, 20px large panels, 20px pill badges/tags.
- **Spacing**: 8px increments (8/10/12/14/16/18/20/24) for padding and gaps.

## Assets
- `assets/logo-dark-theme.svg`, `assets/logo-light-lavender.svg`, `assets/logo-monochrome.svg` — logo mark only (no wordmark), ready to drop in.
- No photography/icons included — camera product images and any additional icons are still needed from the user's own asset library.

## Files
- `design_reference.dc.html` — full interactive reference: three original logo directions, the four color themes, and mock nav/table/buttons/badges/cards for each. Open directly in a browser.
