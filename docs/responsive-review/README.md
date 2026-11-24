# Version 2.2.0 — Responsive release

## Changes
- Shared final `src/styles/responsive.css` for the homepage and case study.
- Compact navigation through 1200px; CSS, native menu controller, interaction adapter and no-script navigation use the same breakpoint.
- Flexible header height with an actual-height measurement for anchor offsets and scrollable menus.
- 44px minimum theme controls, mobile link hit areas and 16px minimum form text to avoid unintended iOS zoom.
- Two-column gallery on portrait tablets from 680–800px, preserved original desktop compositions, and a single-column layout on narrow devices.
- Landscape viewports up to 700px high use four individual Process diagrams instead of an oversized sticky scene. The GSAP height condition matches the CSS. Desktop Process artwork fits within the available viewport height.
- Wrap long content in the skills, footer, header and study facts. Keep original photos, artwork, theme tokens, form and animation modules.

## Verification
136 Chromium layout cases = 34 viewport/text-size combinations × 2 routes × 2 themes. Widths 320–2560 CSS px, portrait and landscape, including 200% root text size. All cases passed the tested document overflow, selected content bounds, header containment and image decode checks. Intentional decorative artboard overflow is recorded separately; this is not a pixel-perfect clipping audit. The fixtures render the original TSX component markup and actual route styles with initial client-control state, using local assets. They are not a running Next.js application. Animations were disabled for stable layout measurements; full React hydration, real touch input, GSAP/Lenis execution, Safari/Firefox and actual email delivery are not newly verified. 15 existing dependency-free tests and 17 local asset references passed. No dependencies were changed. The registry and original live URL were unreachable here. The existing live site has not been updated or deleted.

## Deployment
Deploy this Next.js project from `ifat-portfolio/frontend/` to a Node.js-capable host, not as a static HTML export. Use Node 22+, `npm ci`, `npm run check`, `npm run build`, and `npm start`. Set `SITE_URL` to the new public URL and set the private SMTP environment variables from `.env.example`. Keep `SITE_INDEXING=false` until approved. Test the real form and theme/navigation/animation runtime after publication. Do not remove an existing working deployment until the replacement URL has passed those checks.
