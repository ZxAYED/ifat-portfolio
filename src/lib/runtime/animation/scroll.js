import Lenis from "lenis";

export function createScrollManager({ gsap, ScrollTrigger, root = document, reducedMotion = false }) {
  const html = document.documentElement;
  const controller = new AbortController();
  const { signal } = controller;
  let lenis = null;
  let ticker = null;
  let removeScroll = null;
  let frame = 0;
  let blocked = false;
  let destroyed = false;

  const cancelInertia = () => {
    if (lenis && !blocked && lenis.isScrolling === "smooth") {
      lenis.stop();
      lenis.start();
    }
  };

  const synchronize = () => {
    cancelInertia();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (destroyed || !lenis) return;
      lenis.resize();
      ScrollTrigger.update();
    });
  };

  function removeInstance() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (ticker) {
      gsap.ticker.remove(ticker);
      gsap.ticker.lagSmoothing(500, 33);
    }
    removeScroll?.();
    lenis?.destroy();
    lenis = null;
    ticker = null;
    removeScroll = null;
    html.dataset.scrollEngine = "native";
  }

  function reconcile() {
    removeInstance();
    if (destroyed) return;
    if (reducedMotion) {
      html.dataset.scrollEligibility = "reduced-motion";
      html.dataset.scrollEngine = "native";
      return;
    }
    html.dataset.scrollEligibility = "smooth-active";

    lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.09,
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      anchors: false,
      stopInertiaOnNavigate: true,
      respectReducedMotion: false,
      prevent: node => node instanceof Element && node.matches("dialog, [data-lenis-prevent]"),
      virtualScroll: ({ event }) => !event.ctrlKey && !event.metaKey
    });

    removeScroll = lenis.on("scroll", ScrollTrigger.update);
    ticker = time => lenis?.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    html.dataset.scrollEngine = "lenis";
    if (blocked) lenis.stop();
  }

  window.addEventListener("hashchange", synchronize, { signal });
  window.addEventListener("popstate", synchronize, { signal });
  window.addEventListener("keydown", event => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) cancelInertia();
  }, { signal, capture: true });

  try { reconcile(); } catch (error) { controller.abort(); removeInstance(); throw error; }

  return {
    refresh() { lenis?.resize(); },
    scrollTo(top, { duration = 1.2 } = {}) {
      if (destroyed || !Number.isFinite(top)) return false;
      if (blocked) return true;
      const destination = Math.max(0, top);
      cancelInertia();
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(destination, {
          duration,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          lock: false,
          force: true,
        });
      } else {
        window.scrollTo({ top: destination, left: window.scrollX, behavior: reducedMotion ? "instant" : "smooth" });
      }
      return true;
    },
    setBlocked(value) {
      blocked = value;
      if (blocked) lenis?.stop();
      else if (lenis) {
        lenis.start();
        synchronize();
      }
    },
    destroy() {
      destroyed = true;
      controller.abort();
      removeInstance();
      delete html.dataset.scrollEligibility;
    }
  };
}
