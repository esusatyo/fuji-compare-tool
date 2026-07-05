# Fix Lens Comparison Issues

## Context
The lens comparison mode was recently added but has three issues: lenses show only SVG placeholder icons instead of real product images, the currency selector disappears in lens mode (and lens prices always show bare `$`), and several product URLs are inaccurate.

## File to Modify
`/Users/enricosusatyo/Projects/fuji-compare-tool/index.html`

---

## Fix 1: Lens Product Images

**Problem:** Lenses have no `imageUrl` field — they always show colored SVG placeholders. Cameras do have `imageUrl` and show real photos.

**Changes:**

### A. Refactor `buildPlaceholder()` (line 1913-1927)
Move the `imageUrl` check **outside** the camera/lens branches so it works for both:

```js
function buildPlaceholder(item) {
  let svgHtml;
  if (currentMode === 'lenses') {
    // ...existing lens SVG logic...
    svgHtml = `<div class="cam-placeholder" ...>...</div>`;
  } else {
    // ...existing camera SVG logic...
    svgHtml = `<div class="cam-placeholder" ...>...</div>`;
  }
  // Unified: if item has imageUrl, use <img> with SVG fallback
  if (item.imageUrl) {
    const fallback = svgHtml.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    return `<img src="${item.imageUrl}" alt="${item.name}" class="cam-photo" onerror="this.outerHTML='${fallback}'">`;
  }
  return svgHtml;
}
```

### B. Add `imageUrl` to all 47 lens entries (lines 1181-1670)
- **Fujifilm lenses (24):** Source from `fujifilm-x.b-cdn.net` or `fujifilm-x.com` product pages
- **Sigma (7):** Source from `sigma-global.com`
- **Tamron (4):** Source from `tamron.com`
- **Viltrox (6):** Source from `viltrox.com`
- **TTArtisan (2), 7Artisans (1), Samyang (1), Voigtlander (2):** Source from respective sites

Web search each lens to find a direct image URL. If a reliable URL cannot be found, omit `imageUrl` — the SVG fallback will still work.

---

## Fix 2: Currency Selector Always Visible + Multi-Currency Lens Prices

**Problem:** Currency selector is hidden in lens mode. Lens prices show `$899` instead of `A$899`.

**Changes (6 locations):**

### A. `MODE_CONFIG.lenses.supportsCurrency` (line 1892)
Change `false` → `true`

### B. Remove hardcoded `display: 'none'` in init (line 2130)
Delete `document.querySelector('.header-controls').style.display = 'none';`

### C. Remove currency hiding in mode toggle handler (line 2105)
Delete `document.querySelector('.header-controls').style.display = cfg().supportsCurrency ? '' : 'none';`
(No longer needed since both modes support currency)

### D. Add `prices` object to all 47 lens entries
Replace/supplement `priceUSD` with `prices: {USD, AUD, EUR, GBP, JPY, CAD, SGD}`. Use web searches for actual regional retail prices where available. For currencies without known prices, use approximate conversions with sensible rounding (AUD ≈ USD×1.55, EUR ≈ USD×0.93, etc.).

### E. Update `renderSlot()` lens branch (line 1962-1966)
Use the same currency-aware rendering as cameras:
```js
if (currentMode === 'lenses') {
  const price = item.prices[currentCurrency];
  const sym = CURRENCY[currentCurrency].symbol;
  priceHTML = price
    ? `<div class="slot-price">${sym}${price.toLocaleString()}</div>`
    : `<div class="slot-price">$${item.prices.USD.toLocaleString()}</div>`;
  // ...link logic unchanged...
}
```

### F. Update `LENS_SPEC_SECTIONS` price spec (line 1847)
Change from hardcoded USD to currency-aware:
```js
{ key: 'price', label: 'Price', type: 'number', lowerBetter: true,
  fn: l => l.prices[currentCurrency] || l.prices.USD,
  fmt: v => CURRENCY[currentCurrency].symbol + v.toLocaleString() },
```

### G. Update currency change handler (line 2090-2093)
Change to `renderAll()` instead of just re-rendering slots, since the lens spec table also has a price row:
```js
document.getElementById('currency-select').addEventListener('change', e => {
  currentCurrency = e.target.value;
  renderAll();
});
```

---

## Fix 3: Inaccurate Product URLs

Web search and fix these 4 URLs:

| Item | Current URL | Line |
|------|------------|------|
| X-Half camera | `https://www.fujifilm-x.com/global/products/cameras/x-half/` | 524 |
| Sigma 10-18mm f/2.8 | `https://www.sigma-global.com/en/lenses/c022_10-18_28/` | ~1478 |
| TTArtisan AF 27mm f/2.8 | `https://ttartisan.com/` (generic) | ~1614 |
| TTArtisan AF 35mm f/1.8 | `https://ttartisan.com/` (generic) | ~1624 |

---

## Implementation Order
1. Fix 3 (product URLs) — smallest, quick web searches
2. Fix 2 (currency) — update config, pricing data, render logic
3. Fix 1 (lens images) — most labor-intensive, requires 47 web searches for image URLs

## Verification
1. `preview_start "Fuji Compare"` → screenshot camera mode (should be unchanged)
2. Switch currency to AUD → verify camera prices still show correctly
3. Click "Lenses" → verify currency selector stays visible
4. Verify lens prices show "A$" prefix (AUD) not bare "$"
5. Verify lens product images appear (not just SVG placeholders)
6. Switch currency while in lens mode → verify both slot prices and spec table price row update
7. Click "View Product" links for X-Half, Sigma 10-18mm, TTArtisan lenses → verify they go to correct pages
8. Switch back to "Cameras" → verify state preserved
