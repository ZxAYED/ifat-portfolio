/** Native, dependency-free entrances. Never hides content permanently and
 * never competes with GSAP: the page controller disposes this fallback first.
 * Reduced-motion users get opacity-only feedback, not large translations.
 * @param {{ root?: Document | HTMLElement, reducedMotion?: boolean, initialLoad?: boolean }} [options] */
export function createFallbackMotion({ root = document, reducedMotion = false, initialLoad = true } = {}) {
  const doc = root.nodeType === 9 ? root : root.ownerDocument;
  const win = doc?.defaultView;
  if (!win) return { destroy() {}, refresh() {} };
  const html = doc.documentElement;
  const animations = new Map();
  const visible = new Set();
  const targets = [...root.querySelectorAll([
    '.hero-copy', '.hero-art', '.section-heading', 'article.work-card',
    '.expertise-row', '.expertise-preview', '.digital-note', '.playground-copy',
    '.playground-board', '.designer-portrait', '.about-intro', '.about-body',
    '.experience-block', '.process-stage', '.contact-layout', '.contact-form',
    '.footer-name', '.study-hero-heading', '.study-attribution', '.study-artboard',
    '.study-context-copy', '.study-application-heading', '.study-detail', '.study-reflection-copy'
  ].join(','))];
  let destroyed = false;
  let count = 0;
  html.dataset.nativeReveals = 'true';
  function play(element) {
    if (destroyed || typeof element.animate !== 'function') return;
    animations.get(element)?.cancel();
    const frames = reducedMotion
      ? [{ opacity: .82 }, { opacity: 1 }]
      : [{ opacity: .48, translate: '0 26px' }, { opacity: 1, translate: '0 0' }];
    const animation = element.animate(frames, {
      duration: reducedMotion ? 190 : 760,
      easing: 'cubic-bezier(.22,1,.36,1)', fill: 'none'
    });
    animations.set(element, animation);
    html.dataset.motionReveals = String(++count);
    animation.onfinish = () => { if (animations.get(element) === animation) animations.delete(element); };
  }
  function enter(element) {
    if (visible.has(element)) return;
    visible.add(element);
    if (!initialLoad && element.matches('.hero-copy,.hero-art') && count === 0) return;
    if (win.getComputedStyle(element).display !== 'none') play(element);
  }
  const observer = typeof win.IntersectionObserver === 'function'
    ? new win.IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) enter(entry.target);
        else visible.delete(entry.target);
      }
    }, { threshold: .04, rootMargin: '0px 0px -5% 0px' }) : null;
  targets.forEach(element => observer?.observe(element));
  let frame = 0;
  function refresh() {
    if (destroyed || observer || frame) return;
    frame = win.requestAnimationFrame(() => {
      frame = 0;
      targets.forEach(element => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < win.innerHeight * .95 && bounds.bottom > 0) enter(element);
        else visible.delete(element);
      });
    });
  }
  if (!observer) {
    win.addEventListener('scroll', refresh, { passive: true });
    win.addEventListener('resize', refresh, { passive: true });
    refresh();
  }
  return {
    refresh,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer?.disconnect();
      win.removeEventListener('scroll', refresh);
      win.removeEventListener('resize', refresh);
      win.cancelAnimationFrame(frame);
      animations.forEach(animation => animation.cancel());
      animations.clear();
      visible.clear();
      delete html.dataset.nativeReveals;
    }
  };
}
