# Verification — 24 November 2026

## Source provenance

The exact original deployed static source was recovered through the existing Site repository. Commit `09d6bde0f218adb9020b994a28ddbe100175c586` corresponds to published version 7.

Anonymous HTTP retrieval of 23 public resources returned 200 and matched the Git bytes by SHA-256. This included the homepage and direct case-study HTML, both route stylesheets, core and animation JavaScript, all three fonts, both portrait variants, four study SVGs and two detail crops, favicon/apple icon, social image, robots and sitemap. The untouched 70-file source export is included separately. See `SOURCE_PROVENANCE.json`.

## Next.js checks actually performed

- Dependencies installed successfully from the included package manifest and lockfile.
- `npm run typecheck` passed.
- All 15 contact tests passed. They exercise validation, header-injection rejection, fixed recipient and authenticated sender, SMTP acceptance/rejection, configuration and delivery failures, origin/body-size checks, honeypot and bounded rate limiting. SMTP is mocked; these tests send no email.
- Local asset-reference checks passed.
- `npm run build` succeeded with Next 16.4.6 and React 19.3.1. Homepage and study are prerendered; the contact API uses the Node runtime.
- The browser preview used the production build (`next start`), not a static HTML mock or development-only approximation.
- Independent source review checked original vs converted server markup, route CSS separation, React/motion property ownership, teardown and the contact/API boundary.

## Browser results

| Journey | Observed result |
| --- | --- |
| Desktop hero/reference comparison | Original fonts, artboards, proportions and layout retained; intended hero height reduced 40px at the tested desktop viewport |
| Animation runtime | `motionState=enhanced`, `scrollEngine=lenis`, GSAP scenes and hero hooks active |
| Process progression | Observed Understand → Refine → Deliver, with progress transform changing and final background `rgb(37,163,111)` |
| Project title | Opened its correct native study dialog |
| Project plus | Opened its correct packaging study from its visible position |
| Dialog next | Updated artwork, title, caption and exact case-study destination together |
| Dialog Escape | Closed and returned focus to the original gallery link; page lock released |
| Direct case study | `/work/visual-language-study/#packaging` loaded with correct title, artwork, attribution and content |
| Browser Back | Returned to the gallery with enhancement restored and no open/locked dialog |
| Service expander | Packaging details opened and the adjacent artwork/label updated |
| Type Lab | Keyboard selected Quiet; Expressive changed the serif treatment; grid state and live status updated |
| Header home | Settled at scrollY 0 with hero visible |
| Footer wordmark | Settled at scrollY 0 with hero visible |
| Back to top | Pointer and keyboard activations settled at scrollY 0; rapid offscreen keyboard activation retested after the Lenis/native-scroll correction |
| Contact form | Exactly one form exists inside Contact; server-rendered fields and enabled submit visible |
| Missing SMTP configuration | Genuine pending state, then error; name and message remained entered and submit became available again |
| Narrow layout | 340 CSS-pixel viewport, no horizontal overflow; single-column fields 293px wide, portrait 293px wide, per-stage Process mini-artwork displayed |
| Mobile navigation | Expanded with 156px visible height and 361px scroll content; overflow-y auto retained all destinations |
| Enlarged browser zoom | 200% browser zoom / 681 CSS-pixel width reflowed without horizontal overflow |
| Footer at narrow width | Immediate keyboard Back to top retested at 340 CSS pixels; final scrollY 0 |
| Public animation toggle | None present |
| Local assets | No failed loaded image with a source URL observed; the closed viewer's intentionally empty image has no source until opened |

The tested desktop browser viewport was 1363×936 CSS pixels. Narrow reflow was tested using ordinary browser zoom, including a 340×234 CSS-pixel low-height viewport. Developer-device emulation is blocked by this browser's organization policy. No bypass was attempted.

The browser log contained extension-origin metadata errors, separate from the application. No application-origin hydration/runtime error was observed during the checked journeys. The deliberate contact 503 is expected until credentials are supplied.

## Correction found during verification

Native `scroll-behavior:smooth` could continue an offscreen focus scroll while Lenis received an immediate Back to top activation. `html.lenis { scroll-behavior:auto }` now gives enhanced scrolling one owner; the anchor adapter also cancels pending native movement before starting its existing Lenis transition. No global timing retune was made. Both desktop and narrow keyboard cases were retested successfully.

## Precise limits

- No live SMTP delivery was attempted; the user's private App Password is still required. Mock transport success/rejection and the real missing-configuration browser path were verified.
- Physical iOS/Android touch, native OS reduced-motion switching and JavaScript-disabled browser execution were not separately exercised. Their native scrolling, media-query, lifecycle and server-rendered fallback code was reviewed. No claim of exhaustive device testing is made.
- No Lighthouse score, real-user LCP/INP/CLS, or production-traffic benchmark is claimed. Bundle/build measurements describe local artifacts only. LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 remain deployment targets requiring measurement on the chosen production host.
- The supplied public URL was inspected but not redeployed by this source-code delivery.

See `EXTRACTED_BUILD.json` for the final clean-extraction validation and `BUILD_METRICS.json` for local artifact measurements.
