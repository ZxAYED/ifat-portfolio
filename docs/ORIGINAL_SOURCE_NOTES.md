# Original deployed source: provenance and scope

Verified against https://ifat-ibrahim-graphic-design.flowy-bun-1694.chatgpt.site/ on **2026-11-24T12:03:42.806113+00:00**.

## What was recovered

The original source is available from the Site's source repository. The export named `ifat-original-static-source` is an unmodified `git archive` of:

- Site version: **7**.
- Source commit: `09d6bde0f218adb9020b994a28ddbe100175c586`.
- Commit timestamp: `2026-11-22T13:02:07+06:00`.
- Source files exported: **70**.
- Architecture: authored static HTML/CSS/JavaScript in `dist/`, with editable animation modules in `src/animation/` and build scripts in `scripts/`.
- Original dependency pins: GSAP 3.15.1, Motion 14.14.0, Lenis 1.3.27 and esbuild 0.28.2.

The published original **was not a Next.js application**. The accompanying `ifat-portfolio/frontend` implementation is the Next.js port. The original export and port should be kept distinct so framework changes cannot be mistaken for the untouched deployed source.

## Exact byte verification

**23 of 23** public resources returned HTTP 200 and matched the repository's bytes exactly. Requests were anonymous: no credentials, cookies or private APIs were used.

Verified resources include:

- Homepage and `/work/visual-language-study/` HTML.
- Homepage CSS, study CSS and no-script fallback CSS.
- Main JavaScript and its versioned dynamic animation bundle.
- All three locally served font files.
- Both responsive portrait WebP files.
- All four complete artwork SVGs and both identity detail SVGs.
- Favicon, apple-touch icon and social-sharing PNG.
- Robots file and sitemap.

The homepage SHA-256 is:

```text
0fe0b2f6aa9e1432abc11c388e36449a879fafa45c87951249ca475568d8b0c3
```

`SOURCE_PROVENANCE.json` records each exact fetched URL, source path, HTTP status, byte count and SHA-256. It also records a manifest for every file in the original export. The separate initial homepage capture matched too.

All 70 exported files were compared with their Git blobs at the recorded commit. The export contains no `.git` directory. A filename check for environment/key/credential files and a text scan for common private-key/token/password signatures found no secrets. Public Site IDs and the `.openai/hosting.json` deployment configuration are part of the original source, not authentication credentials.

This verification establishes the source baseline. It does not certify the new Next.js port's browser behavior, delivery configuration, or performance; consult its separate verification report for those results.

## What changed between the earlier local copy and the live version

The earlier local source was commit `151c7697b19628764459359a7db435dfe94b7cf4`. Using that older copy as the migration baseline would miss these v7 changes:

| Area | Earlier copy | Exact live v7 |
| --- | --- | --- |
| Footer controls | Animations On/Off on both routes | Controls removed |
| Stored motion preference | Reads a saved manual opt-out | Retires both prior storage keys |
| Motion startup | Resolves manual preference | Explicitly initializes full motion |
| Same-document anchors | Native fragment movement with focus update | One numeric scroll path using the existing Lenis/native adapter, plus history and focus |
| Top links | Native special `#top` destination | Explicit destination zero, still with native fallback |
| Section spacing | `clamp(72px,8vw,124px)` | `clamp(96px,11vw,176px)` |
| Heading spacing | Mostly fixed gaps | `clamp(40px,4.7vw,72px)` |
| Hero spacing | 72px/88px desktop, 38px/68px mobile | 88px/112px desktop, 56px/96px mobile |
| Gallery spacing | 48px default row gap | 80px desktop, 60px medium, 52px compact |
| About spacing | 56px desktop row gap | 72px desktop, 48px tablet, 44px mobile |
| Process and Contact spacing | More compact individual padding | Shared expanded section spacing |
| Metadata | Preview noindex; shorter title | `index, follow, max-image-preview:large`; title includes Bangladesh |
| Error route | No explicit static 404 page | New 404 document and hosting `404-page` behavior |

The v7 source keeps the same actual portrait, artwork, typefaces and four-study structure. Its GSAP scene timing values were not retuned by this release.

## Original behavior and remaining differences to understand

The original export intentionally preserves what was deployed. It has:

- No contact form and no Nodemailer backend. Its Contact panel links to Behance.
- A second Behance action below Work.
- Textual Ai/Ps/F/Pr tool badges rather than the later supplied icon files.
- An always-full animation launcher, including when the device asks for reduced motion. Reduced-mode branches exist inside modules but are not selected by that launcher.
- Clearly attributed ChatGPT-created layout studies, not verified Ifat-authored or commissioned projects.
- The verified Carrydel role, but no Carrydel project artwork or employment dates.

The Next.js port may include separately documented requested corrections such as a real contact form, supplied icons and reduced-motion support. Such changes should be listed explicitly; they are not part of the byte-identical original export.

## Original source layout

- `dist/index.html`: original homepage markup.
- `dist/styles.css`, `polish.css`, `scene-polish.css`, `project-viewer.css`, `portrait.css`: authored homepage styling.
- `dist/main.js`, `project-viewer.js`, `content.js`: navigation, core state, native viewer and study copy.
- `src/animation/`: editable GSAP, Motion and Lenis implementation.
- `dist/assets/`: local fonts, artwork, responsive portrait and sharing assets.
- `src/assets/ifat-ibrahim.png`: supplied source portrait.
- `scripts/build.mjs`: original production build.
- `scripts/build-study.mjs`: static case-study generator and exact-artwork detail crops.
- `package-lock.json`: the original static application's lockfile.

The original homepage cascade is `styles.css` → `animation.css` → `polish.css` → `scene-polish.css` → `project-viewer.css` → `portrait.css`. The study deliberately uses its own cascade: `styles.css` → `study.css` → `animation.css` → `scene-polish.css`. Preserving this distinction is necessary for visual fidelity.

The original source's README and historical verification documents are preserved unchanged in its export. Their statements describe their identified releases; they are not a replacement for testing the current Next.js package.
