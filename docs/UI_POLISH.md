# Version 2.1.0 — UI polish

Source basis: the uploaded `ifat-portfolio.zip`, not an invented new layout. The application architecture, content, contact API, existing routes and supplied artwork remain. The visual changes are isolated primarily in the shared final stylesheet, `src/styles/dark-theme.css`.

| Issue observed | Change |
|---|---|
| Dark text/white panels mixed unpredictably | Theme tokens for paper, text, muted text, surfaces, borders and form states; featured work, experience, dialog and case study use them. |
| Type Lab inherited an inverted light background in dark mode | The lab is a deliberate deep-green editorial insert in both modes, with readable controls. Its green specimen and artwork stay constant. |
| Process animation blocked by `!important` dark background | Removed override, retained GSAP ownership, added contrasting intermediate dark-stage shapes and final green with dark lettering. |
| Crowded navigation and split mobile header | Stable 80px desktop / 72px phone header, compact menu below 1100px, matching JS media queries, mobile icon controls and accessible menu label. |
| Section gaps and oversized small-screen gallery | Balanced spacing, two-column tablet work gallery and compact phone process cards; original featured composition on wide screens. |
| Contact input borders and errors weak in dark mode | Separate theme-aware form surface, readable placeholders, clear focus and error styling, stable submit action. Original mail logic retained. |
| OS motion setting ignored; footer toggle not shared with Motion React | One preference resolved by all animation systems; default follows OS, explicit override saved; no animation replay on switching theme. |
| Saved theme changes root attributes before hydration | Root suppresses only expected attribute mismatch; stored theme validated. |

Design decisions: preserve #101010 for dark mode, warm near-white #f8f7f4 for light mode, keep original artwork/portrait/tool images and identity green #25a36f. The contact panel is muted green rather than solid bright green. No new client-project claims were introduced. No new package dependency was added.

## Editing
- `src/styles/dark-theme.css`: shared visual tokens, component polish, responsive header.
- `src/components/ThemeToggle.tsx`, `AnimationToggle.tsx`, `MotionProvider.tsx`: saved preferences and Motion React behavior.
- `src/lib/runtime/page.js`, `animation/interactions.js`, `animation/scenes.js`: shared menu breakpoint, theme-aware Process scene and reduced motion.
- `public/no-script.css`: usable native navigation without JS.

See `VERIFICATION.md` for test scope. Previous build metrics are historical, not evidence for this revision.
