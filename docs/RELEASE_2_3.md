# Release 2.3.0 — portfolio controls

- The first visit defaults to light regardless of the OS color scheme. An explicit visitor-selected dark preference persists across reloads.
- The header uses one 44×44 CSS-pixel button instead of the full-width light/dark segmented switch. It exposes the state with `aria-pressed`, has a keyboard focus indicator and remains touch-friendly.
- The footer animation toggle and stored motion override are removed. GSAP, Motion and Lenis are enabled for normal motion preferences, with the OS reduced-motion accessibility setting respected.
- Original artwork, portrait, section order, API, responsive breakpoints and animation choreography are unchanged. Only the old toggle's interactions and styles were removed.
- 19 local automated tests passed (15 contact tests and 4 control regression tests). Asset and syntax checks passed. Production build is checked separately via Vercel.
