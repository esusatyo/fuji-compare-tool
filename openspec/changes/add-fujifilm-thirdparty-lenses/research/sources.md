# Sources read

Classes: **T1** maker (incl. official regional sites) · **T2** independent
measurement/review · **T3** retailer (price/availability only) · **T4**
aggregator (tables only, never mount attribution) · **NEWS** dated
announcement (`year` only).

| URL | class | used for | notes |
|---|---|---|---|
| https://www.sg-image.com/products.json | T1 | SG-image catalogue: every product, mount variants, USD prices | Shopify JSON; read 2026-10-13 |
| https://www.sg-image.com/products/aps-c-25mm-f1-8-%E8%87%AA%E5%8A%A8%E5%AF%B9%E7%84%A6%E9%95%9C%E5%A4%B4 | T1 | AF 25mm specs (spec image AF25.png), price, image | prose says 152 g/34 mm; rejected in favour of the spec table's 145 g/32 mm |
| https://www.sg-image.com/products/af-55mm-f1-8 | T1 | AF 55mm specs (spec image 55.png), price, image | one table for E/X/Z |
| https://www.sg-image.com/products/sg-image-af35mm-f1-4-aps-c-lens-for-mirrorless-cameras | T1 | AF 35mm f/1.4 availability (X/E) and price | no spec table → deferred |
| https://en.pronews.com/news/20241231152010126.html | NEWS | AF 55mm X release date (2024-12-27), ¥39,000 | calls it APS-C; figures match the maker's |
| https://photorumors.com/2025/06/30/sg-image-af-25mm-f-1-8-lens-officially-released-e-x/ | NEWS | AF 25mm X release year (2025) | |
| https://filmphotography.eu/en/review/sg-image-af-25mm-f-1-8/ | T4 | corroborates 145 g / 32 mm on the X version | quotes maker figures, nothing measured |
| https://www.ithome.com/1/005/275.htm | NEWS | AF 35mm f/1.4: 227 g, 7/6, 0.35 m, 52 mm | no dimensions/blades |
| https://www.fujirumors.com/sg-image-af-35mmf1-4-and-af-35mmf2-2-for-fujifilm-x-launched/ | NEWS | X launch (China) of AF 35mm f/1.4 and f/2.2 | 163 g = the f/2.2 |
| https://www.amazon.com/dp/B0GMBTGP47 | T3 | AF 25mm X black ASIN | title "…APS-C Lens for X Mount Black" |
| https://www.cosina.co.jp/voigtlander/en/x-mount/ | T1 | the complete X-mount lineup (7 designs + 2 silver variants); lineup thumbnails used as imageUrl | |
| https://www.cosina.co.jp/voigtlander/en/x-mount/<slug>/ (×7) | T1 | per-lens X-mount spec tables | used to correct the 27mm and 35mm f/0.9 entries |
| https://www.cosina.co.jp/voigtlander/x-mount/<slug>/ (×7) | T1 | release dates and JPY list prices (税別; the dataset stores tax-included → ×1.10) | |
| https://www.voigtlaender.de/objektive/x-anschluss/ (+5 lens pages) | T1 (regional) | EUR UVP: 18mm €599, 35/1.2 €649, Macro €699, 50/1.2 €749, 35/0.9 €1,749 | incomplete TLS chain; read with curl -k. No X pages for the 23mm or 27mm |
| https://www.bhphotovideo.com/c/search?q=voigtlander%20fujifilm%20x | T3 | USD regular prices for all 7 (read in Chrome, 2026-10-13) | blocks curl/WebFetch |
| amazon.com listings B0CYYJCZWZ, B0B1CL663K, B09F76L1LG, B0B8NL7BZF, B0CKM299B1 | T3 | ASINs, matched by listing title (lens + X mount) | Macro listing currently "unavailable" |
