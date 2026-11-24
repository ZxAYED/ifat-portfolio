# Verification — responsive release 2.2.0

See [responsive-review/README.md](responsive-review/README.md) and [layout-matrix.json](responsive-review/layout-matrix.json) for the current checks and limitations.

---

## Historical verification — 2.1.0 UI revision

## Passed in this environment
- Inspected and extracted the user-uploaded ZIP.
- Ran the original 15 Node contact/rate-limit/mail-intent tests: all passed.
- Ran `node scripts/check-assets.mjs`: all 17 local asset references and required application files passed.
- Rendered the actual TSX components with a TypeScript-based static preview renderer and their exact CSS cascade, using Chromium and original local assets. Confirmed all 11 home images and six case-study images decode successfully. No horizontal overflow at the tested desktop, tablet and phone widths (320, 390, 900 and 1440 CSS px across the checks). Both themes reviewed; screenshots included.
- Executed the revised native JS page controller, GSAP scenes, Motion interaction adapter and Lenis controller in Chromium using the corresponding recovered dependency bundle (GSAP 3.15.1, Motion 14.14.0, Lenis 1.3.27). Full enhancement and Lenis observed on desktop and compact layouts; reduced-motion OS preference resulted in native scroll. Native gallery dialog open/Escape close, expertise expansion, compact navigation open/Escape close all exercised. The desktop Process completed to rgb(37, 163, 111) with dark foreground in both themes; changing themes while on the completed stage retained the green. Case study enhancement initialized in both tested widths.
- The isolated preview originally generated an invalid URL error on anchor events because its document was about:blank (not a Next.js server). Added a defensive URL parsing guard. Real-origin hash/history behavior still needs normal app testing.

## Not verified in this environment
The dependency registry could not resolve, and npm's offline cache did not contain the dependencies. Thus `npm ci`, Next.js hydration, React-owned controls and full production build could not be executed for this revision. The browser preview is a static render of the source plus the actual native animation runtime, not a running Next.js dev server; screenshots reflect that scope. The existing package and lockfile dependency versions are retained. The updated theme/animation React components were syntax-checked but not hydrated here. Actual SMTP delivery still requires credentials and a networked test. The previous public deployment was not modified.

## Local verification
From `ifat-portfolio/frontend/`, run `npm ci`, `npm run check`, `npm run build` and `npm start` on a machine with registry access. Use the theme switch on both routes and check persistence on refresh; turn Animations Off/On and verify the Type Lab and Process, nav focus and contact form. All historical production checks apply only to the previous release and are preserved in `previous-release/`.
