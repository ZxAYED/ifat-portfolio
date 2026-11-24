import { setupProjectViewer } from "./project-viewer.js";
import { createFallbackMotion } from "./animation/fallback.js";

/** @param {{ root?: Document | HTMLElement, initialLoad?: boolean }} [options] */
export function startPage({ root = document, initialLoad = true } = {}) {
  const $ = (selector, within = root) => within.querySelector(selector);
  const $$ = (selector, within = root) => [...within.querySelectorAll(selector)];
  const controller = new AbortController();
  const signal = controller.signal;
  const listen = (target, event, callback, options = {}) => target?.addEventListener(event, callback, { ...options, signal });
  const compactNav = window.matchMedia("(max-width: 1200px)");
  const header = $(".site-header");
  const menuToggle = $(".menu-toggle");
  const nav = $(".main-nav");
  const dialog = $(".study-dialog");
  let motion = null;
  let fallback = null;
  let fallbackTimer = 0;
  let destroyed = false;
  let generation = 0;
  let enhancedOnce = !initialLoad;
  let scrollFrame = 0;
  const projectViewer = setupProjectViewer({ root, getMotion: () => motion });
  // A measured header offset also handles enlarged text and narrow landscape.
  const html = document.documentElement;
  const syncHeaderHeight = () => {
    if (header) html.style.setProperty("--actual-header-height", `${Math.ceil(header.getBoundingClientRect().height)}px`);
  };
  const headerObserver = header && typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncHeaderHeight) : null;
  if (headerObserver) headerObserver.observe(header);
  syncHeaderHeight();
  // Motion stays enabled; the OS accessibility setting selects gentler fades.
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  function effectiveReduced() {
    return motionPreference.matches;
  }
  function updateMotionMode() {
    document.documentElement.dataset.motionMode = effectiveReduced() ? "reduced" : "full";
  }
  updateMotionMode();

  function stopFallback() {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = 0;
    fallback?.destroy();
    fallback = null;
  }
  function startFallback() {
    if (destroyed || fallback) return;
    fallback = createFallbackMotion({ root, reducedMotion: effectiveReduced(), initialLoad: !enhancedOnce });
  }
  async function enhance() {
    const ticket = ++generation;
    stopFallback();
    motion?.destroy();
    motion = null;
    updateMotionMode();
    document.documentElement.dataset.motionState = "loading";
    // A delayed or failed JS chunk must not leave the whole site static.
    fallbackTimer = window.setTimeout(() => { if (ticket === generation) startFallback(); }, 900);
    try {
      const { initMotion } = await import("./animation/index.js");
      if (destroyed || ticket !== generation) return;
      const heroAlreadyAnimated = Boolean(fallback);
      stopFallback();
      motion = initMotion({ root, reducedMotion: effectiveReduced(), initialLoad: !heroAlreadyAnimated && !enhancedOnce && window.scrollY < 80 });
      if (effectiveReduced() || !motion.hasScenes) startFallback();
      enhancedOnce = true;
      document.documentElement.dataset.motionState = effectiveReduced() ? "reduced" : motion.hasScenes ? "enhanced" : "fallback";
      motion.setModalOpen(Boolean(dialog?.open));
      updateScrollState();
    } catch (error) {
      if (destroyed || ticket !== generation) return;
      motion?.destroy();
      motion = null;
      stopFallback();
      startFallback();
      document.documentElement.dataset.motionState = "fallback";
      document.documentElement.dataset.scrollEngine = "native";
      document.documentElement.removeAttribute("data-process-managed");
      document.documentElement.removeAttribute("data-scenes-managed");
      document.documentElement.removeAttribute("data-hero-managed");
      document.documentElement.classList.remove("motion-enhanced");
      console.warn("Animation enhancement unavailable; the portfolio remains usable.", error);
      updateScrollState();
    }
  }
  listen(motionPreference, "change", () => enhance());
  // Theme changes must not tear down Lenis or reset scroll scenes. Process
  // colors are now CSS-driven, so the live scene position is retained.
  listen(window, "themestatuschange", requestScrollUpdate);

  function setMenu(open, restoreFocus = false) {
    if (!menuToggle || !nav) return;
    const changed = menuToggle.getAttribute("aria-expanded") !== String(open);
    menuToggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (changed) motion?.menu(open);
    if (restoreFocus) menuToggle.focus({ preventScroll: true });
  }
  listen(menuToggle, "click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  if (nav) $$("a", nav).forEach(link => listen(link, "click", () => setMenu(false)));
  listen(document, "click", event => {
    if (!header?.contains(event.target)) setMenu(false);
  });
  listen(document, "focusin", event => {
    if (compactNav.matches && !header?.contains(event.target)) setMenu(false);
  });
  listen(document, "keydown", event => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") setMenu(false, true);
  });
  listen(compactNav, "change", () => setMenu(false));

  function focusHashTarget(hash = location.hash) {
    if (!hash || hash === "#") return;
    // #top remains a document-start link without adding an id to the body.
    // Focus the home control without initiating a second scroll.
    if (hash.toLowerCase() === "#top") {
      $(".brand")?.focus({ preventScroll: true });
      return;
    }
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target) return;
    const temporary = !target.hasAttribute("tabindex");
    if (temporary) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (temporary) listen(target, "blur", () => target.removeAttribute("tabindex"), { once: true });
  }
  // Same-document anchors share the existing scroll controller. History and
  // focus are updated here; preventDefault avoids a competing native jump.
  // Cross-page gallery links and modified clicks retain their native behavior.
  listen(root, "click", event => {
    const link = event.target.closest?.("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || link.hasAttribute("download")) return;
    const browsingTarget = link.getAttribute("target")?.toLowerCase();
    if (browsingTarget && browsingTarget !== "_self") return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let fragment;
    try { fragment = decodeURIComponent(url.hash.slice(1)); } catch { return; }
    const topLink = fragment.toLowerCase() === "top";
    const target = document.getElementById(fragment);
    if (!topLink && !target) return;
    const scrollPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const scrollMargin = target ? Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0 : 0;
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const clearance = Math.max(scrollPadding, headerHeight ? headerHeight + 16 : 0);
    const destination = topLink ? 0 : Math.max(0, window.scrollY + target.getBoundingClientRect().top - clearance - scrollMargin);
    // pushState changes the URL without fragment scrolling. Repeating a link
    // still moves to its destination but does not create duplicate history.
    try {
      if (location.hash !== url.hash) history.pushState(history.state, "", url);
    } catch { return; }
    event.preventDefault();
    focusHashTarget(url.hash);
    if (!motion?.scrollTo?.(destination, { duration: 1.3 })) {
      window.scrollTo({ top: destination, left: window.scrollX, behavior: effectiveReduced() ? "instant" : "smooth" });
    }
  });
  listen(window, "hashchange", () => focusHashTarget());

  // Type Lab state and controls are owned by TypeLab.tsx. Do not bind a second
  // imperative click handler or animate its composition/grid here.

  const processVisual = $(".process-visual");
  const processStages = $$(".process-stage");
  const processLabels = {
    understand: "Understanding the brief",
    explore: "Exploring visual directions",
    refine: "Refining the details",
    deliver: "Ready for the real world"
  };
  const navSections = $$(".main-nav a[href^='#']").map(link => ({ link, section: $(link.getAttribute("href")) })).filter(item => item.section);
  let activeStage = "";
  function updateScrollState() {
    scrollFrame = 0;
    if (destroyed) return;
    header?.classList.toggle("is-scrolled", window.scrollY > 25);
    if (!motion?.hasScenes || effectiveReduced()) {
      const progress = $(".scroll-progress");
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.transform = `scaleX(${Math.max(0, Math.min(1, window.scrollY / max))})`;
    }
    if (processVisual && document.documentElement.dataset.processManaged !== "true") {
      let selectedStage = processStages[0];
      const targetY = window.innerHeight * 0.68;
      for (const stage of processStages) if (stage.getBoundingClientRect().top < targetY) selectedStage = stage;
      if (selectedStage) {
        activeStage = selectedStage.dataset.stage;
        processVisual.dataset.stage = activeStage;
        const label = $(".process-visual-label");
        if (label) label.textContent = processLabels[activeStage];
        processStages.forEach(stage => stage.classList.toggle("is-active", stage === selectedStage));
      }
    }
    let activeNav = null;
    navSections.forEach(item => {
      const bounds = item.section.getBoundingClientRect();
      if (bounds.top <= 180 && bounds.bottom > 180) activeNav = item.link;
    });
    navSections.forEach(({ link }) => {
      if (link === activeNav) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
  }
  listen(window, "scroll", requestScrollUpdate, { passive: true });
  listen(window, "resize", requestScrollUpdate, { passive: true });
  $$(".expertise-row").forEach(row => listen(row, "toggle", () => {
    motion?.refresh();
    requestScrollUpdate();
  }));
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
  updateScrollState();
  enhance();

  return {
    destroy() {
      destroyed = true;
      generation++;
      controller.abort();
      headerObserver?.disconnect();
      html.style.removeProperty("--actual-header-height");
      cancelAnimationFrame(scrollFrame);
      projectViewer.destroy();
      stopFallback();
      motion?.destroy();
      motion = null;
      if (dialog?.open) dialog.close();
      document.body.classList.remove("modal-open");
      setMenu(false);
    }
  };
}
