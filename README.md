> **Current release: 2.4.0.** See [release notes](docs/RELEASE_2_4.md) and [responsive/browser test report](docs/RELEASE_2_4_BROWSER.json). Earlier review screenshots in `docs/` document previous releases.

> **Release 2.3.0:** Light mode is the initial default; the theme switch is one accessible 44px icon button. The animation toggle and stored motion override have been removed. Device reduced-motion accessibility preferences are still honored. See `docs/RELEASE_2_3.md`.

# Ifat — The Living Design Studio

A Next.js App Router port of the **verified original published portfolio**, including its real local fonts, supplied portrait, artwork, layout, GSAP scenes, Motion interactions and Lenis adapter.

## Version 2.1 — light/dark UI polish

Light mode is the initial default, with the visitor’s explicit theme choice saved. Both routes share the final theme layer in `src/styles/dark-theme.css`. Artwork keeps its original color palette. The contact section now uses a muted green background, and the header uses a compact menu at 1200px and below. See `docs/UI_POLISH.md` and `docs/ui-review/` for details and screenshots.

## Run the portfolio

Use Node.js 22 or newer. The previous source was built with Node.js 24.22.3; this UI revision was reviewed with Node.js 22.16.0. The npm registry was unavailable for a fresh production build.

```bash
npm ci
npm run dev
```

Open **http://localhost:3000**. Run the commands from this `frontend` directory. The lockfile is included; `npm ci` installs its exact dependency resolution.

For production:

```bash
npm run check
npm run build
npm start
```

Do not run the old v1.x packages in the same terminal or reuse their `.next` directories. Extract this ZIP into a fresh folder. All application files and assets are present; there is no recovery script or dependence on the deployed site at runtime.

## Which source is which?

- `frontend/` is the main, runnable Next.js source.
- The original static source is not duplicated in this archive; the previous verified source package retains it. Historical provenance records are included.

The published website was static HTML/CSS/JavaScript. The original framework was not Next.js. This project faithfully ports that source into React components instead of serving the old HTML through rewrites or an iframe.

Verified original revision: `09d6bde0f218adb9020b994a28ddbe100175c586`, published version 7. The live homepage, study page, CSS, JavaScript, fonts, portrait, artwork and metadata assets were compared by SHA-256; all 23 checked resources matched. The full record is in `docs/SOURCE_PROVENANCE.json`.

## Deliberate changes from the public version

These are the requested corrections retained in the port:

1. A visible inline contact form and real Nodemailer endpoint, addressed to `ifatibrahim20@gmail.com`, plus a direct email fallback.
2. The supplied Illustrator, Photoshop, Figma and Premiere Pro images replace the text badges.
3. The simple duplicate Behance row beneath the gallery is removed. The existing contact Behance action remains. Project dialogs retain contextual external portfolio links.
4. Hero whitespace is slightly tighter; the original artboard sizes, typography and composition are retained. The original expanded Expertise/About section spacing is retained.
5. Process reaches its completed color when its final chapter reaches 50% of viewport height, slightly earlier than the original 35% point. Other scene durations are retained.
6. The Type Lab uses React state and Motion React while preserving its original wording, palette, controls and three treatments.
7. The OS reduced-motion preference is respected. There is no portfolio animation switch or stored motion override. GSAP, Lenis and Motion React remain active for standard motion preferences.
8. Lenis and native smooth scrolling no longer compete during rapid focus/anchor navigation. The header logo, footer wordmark and Back to top resolve to document zero.
9. Local/preview indexing is explicitly off. Enable it for your chosen production URL when ready.

The green/paper identity, original portrait, case-study route, truthful artwork disclosures, service expanders, project dialog and complete section sequence remain.

## Editing map

| File or directory | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Server-rendered homepage and chapter order |
| `src/components/PortfolioSections.tsx` | Hero, discipline strip, Expertise, About, Process and Contact content |
| `src/components/WorkGallery.tsx` | Original featured and supporting study cards |
| `src/components/StudyContent.tsx` | Complete original case-study content |
| `src/app/work/[slug]/page.tsx` | Shareable study route and metadata |
| `src/components/SiteHeader.tsx`, `SiteFooter.tsx` | Native navigation and wordmark |
| `src/components/TypeLab.tsx` | React-owned specimen/grid state and Motion feedback |
| `src/components/ExperienceRuntime.tsx` | Scoped client enhancement lifecycle |
| `src/lib/runtime/` | Original page/viewer behavior and adapted GSAP/Motion/Lenis source |
| `src/components/ContactForm.tsx` | Form UI, validation, pending/success/error and draft preservation |
| `src/app/api/contact/route.ts` | Server-only Nodemailer endpoint |
| `src/lib/contact-rules.mjs`, `mail-intent.mjs` | Shared input rules and server submission/delivery handling |
| `src/content/profile.ts` | Verified profile, contact and metadata identity |
| `src/styles/` | Original authored styles, route-specific cascades and requested corrections |
| `public/assets/` | All local artwork, portrait variants, fonts, software icons and brand assets |
| `docs/` | Source provenance, validation and Gmail setup |

The original homepage and case study intentionally use different stylesheet cascades. `home.css` preserves the home cascade; `case-study.css` preserves the study cascade. Tailwind utilities remain available in `src/app/globals.css`; Tailwind preflight is intentionally not imported because it would reset the original composition.

Native `<a>` links preserve ordinary cross-page navigation, new tabs and browser history. The same-document controller handles the existing Lenis scroll action and focus. There is no `id="top"` on a sticky header.

## Animation ownership

- **GSAP:** original hero assembly, scroll-linked sections, authored heading masks, portrait and Process geometry.
- **Motion:** original control gestures, disclosure/viewer interactions and the React Type Lab.
- **Lenis:** wheel smoothing driven by the existing GSAP ticker; touch scrolling stays native.
- **CSS:** composition, responsive breakpoints and simple non-conflicting feedback.

Only the enhancement runtime, Type Lab and form are client components. The essential page content is server-rendered and visible before enhancement. Reduced motion uses the static state; the no-script stylesheet exposes native navigation and a static specimen. Listeners, observers, animation contexts, timers and ticker callbacks are cleaned up. Delayed imports and image setup are invalidated after teardown.

## Contact configuration

The included `.env` is a non-secret starter. Prefer adding your own values in `.env.local`, which is ignored by Git:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=ifatibrahim20@gmail.com
SMTP_PASS=your_new_gmail_app_password
SITE_URL=http://localhost:3000
SITE_INDEXING=false
```

Use a **Gmail App Password**, not the normal Gmail password. Never prefix SMTP variables with `NEXT_PUBLIC_`. Restart the app after changing environment values. `docs/GMAIL_SETUP.md` explains how to generate a replacement App Password and configure deployment.

The form reports success only after SMTP accepts the configured recipient. Missing credentials return HTTP503; delivery errors return HTTP502. Inputs remain on every failure. The sender is the authenticated SMTP account; the visitor address is `Reply-To`. The recipient cannot be changed by a form submission.

The built-in rate limiter is bounded but per-process. A larger/multi-instance public deployment may need an edge or shared rate limit. This project does not add an unnecessary database or service.

Nodemailer needs a Node.js server with outbound SMTP access. A static-only host does not run `/api/contact`; a Cloudflare Workers runtime does not provide this Node SMTP execution environment. The visual site can run immediately without credentials, with direct email as a working fallback.

## Production URL and indexing

Set your final deployment origin and explicitly enable indexing:

```dotenv
SITE_URL=https://your-own-domain.example
SITE_INDEXING=true
```

Then rebuild. Metadata, canonical URLs, robots and sitemap derive from this configuration. Local and preview builds remain noindex by default; localhost cannot be indexed by this configuration. The original public snapshot's indexing setting is retained untouched in the reference source.

## Content status

The gallery and case study are explicitly identified as **ChatGPT-created illustrative layout studies**, not Ifat-authored client projects. Carrydel's Product Label Designer role is retained without invented dates, metrics or project outcomes. Replacing the studies with authentic projects requires approved artwork and facts about contribution, brief, status and publication permission.

## Checks and evidence

`npm run check` runs TypeScript, the contact tests and local asset-reference checks. `npm run build` creates the production build. See `docs/VERIFICATION.md` for the precise checks performed and remaining limits. The UI revision was reviewed from the uploaded source. See the current verification report for the browser-preview method and npm registry limitation.
