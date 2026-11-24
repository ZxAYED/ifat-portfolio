import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createScenes } from "./scenes.js";
import { createInteractions } from "./interactions.js";
import { createScrollManager } from "./scroll.js";

gsap.registerPlugin(ScrollTrigger);

export function initMotion({ root = document, reducedMotion = false, initialLoad = true } = {}) {
  const html = document.documentElement;
  const controller = new AbortController();
  let disposed = false;
  let frame = 0;
  let scenes;
  let interactions;
  let scrolling;
  const reportFailure = (engine, error) => console.warn(`Portfolio ${engine} unavailable; remaining motion stays active.`, error);
  const refresh = () => {
    if (disposed) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (disposed) return;
      scrolling?.refresh();
      scenes?.refresh();
    });
  };
  function destroy() {
    if (disposed) return;
    disposed = true;
    controller.abort();
    cancelAnimationFrame(frame);
    interactions?.destroy();
    scenes?.destroy();
    scrolling?.destroy();
    html.classList.remove("motion-enhanced");
    delete html.dataset.sceneEngine;
    delete html.dataset.interactionEngine;
    delete html.dataset.motionScenes;
  }
  try {
    html.classList.add("motion-enhanced");
    // One library failing should not disable the other motion systems.
    try { scrolling = createScrollManager({ gsap, ScrollTrigger, root, reducedMotion }); }
    catch (error) { html.dataset.scrollEngine = "native"; reportFailure("Lenis", error); }
    try { scenes = createScenes({ root, reducedMotion, initialLoad }); }
    catch (error) { reportFailure("GSAP scenes", error); }
    html.dataset.sceneEngine = scenes?.triggerCount > 0 && !reducedMotion ? "gsap" : "native";
    try { interactions = createInteractions({ root, reducedMotion, requestRefresh: refresh }); }
    catch (error) { reportFailure("Motion interactions", error); }
    html.dataset.interactionEngine = interactions ? "motion" : "native";
    window.addEventListener("load", refresh, { once: true, signal: controller.signal });
    window.addEventListener("resize", refresh, { passive: true, signal: controller.signal });
    refresh();
    return {
      hasScenes: scenes?.triggerCount > 0 && !reducedMotion,
      menu: open => interactions?.menu(open),
      dialogOpen: () => interactions?.dialogOpen(),
      dialogClose: commit => interactions ? interactions.dialogClose(commit) : commit(),
      setModalOpen: open => scrolling?.setBlocked(open),
      scrollTo: (top, options) => scrolling?.scrollTo(top, options) ?? false,
      refresh,
      destroy
    };
  } catch (error) {
    destroy();
    throw error;
  }
}

