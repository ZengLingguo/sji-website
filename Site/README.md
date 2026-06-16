# SJI Overseas Website Static Prototype

This folder contains the phase-one static prototype for the SJI overseas website.

## Preview

Local preview URL:

```text
http://localhost:5173
```

Start the preview server:

```powershell
cd D:\Projects\SJI网站搭建\Site
node .\server.mjs
```

## Current Scope

- Dark industrial visual style with deep black and wine red
- Home page with product, video, application, about, and contact sections
- Main barcode reader models: RS60, RS200, H620
- Product detail pages:
  - `products/barcode-readers.html`
  - `products/rs60.html`
  - `products/rs200.html`
  - `products/h620.html`
  - `products/lenses.html`
- Barcode reader lineup page for additional RS80-M, RS100-A / RS100-M, R170 / R172, R270-A / R275-A, C300, H920, D100, and ES100 options
- Product and application videos:
  - RS60 PCB QR code application
  - RS200 product introduction
  - H620 semiconductor QR code application
- Machine vision lens section and lens model matrix
- Company profile, address, email, and company photo
- Language selector reserved for EN, 简体中文, 繁體中文, 日本語, 한국어, ไทย, Tiếng Việt
- Responsive layout

## Notes

- The contact form currently uses `mailto:Sales@zhsji.com`.
- Product technical parameters should be checked against official datasheets before publishing.
- Some source videos may contain legacy supplier branding in the footage or subtitles. Review or edit them before public launch if needed.
- The current site is static. Backend inquiry storage, CMS, SEO metadata expansion, and downloadable documents can be added in phase two.
