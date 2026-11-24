import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STATES = [
  { name: "understand", label: "Understanding the brief", background: "#e5e9e1", rotation: -16, scale: 0.9, grid: 0.19, lines: 1, chips: 0,
    fills: ["transparent", "transparent", "transparent", "transparent"],
    offsets: [[-28, 22, -12], [-20, -25, 8], [25, -18, 12], [28, 25, -8]] },
  { name: "explore", label: "Exploring visual directions", background: "#dce9df", rotation: 10, scale: 1.02, grid: 0.13, lines: 0, chips: 1,
    fills: ["#25a36f", "#25a36f", "#10251e", "#10251e"],
    offsets: [[-24, 15, -17], [-31, -20, -8], [25, -14, 17], [19, 26, 8]] },
  { name: "refine", label: "Refining the details", background: "#e5e9e1", rotation: 0, scale: 1, grid: 0.37, lines: 0, chips: 1,
    fills: ["#25a36f", "#25a36f", "#10251e", "#10251e"],
    offsets: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] },
  { name: "deliver", label: "Ready for the real world", background: "#25a36f", rotation: -10, scale: 1.07, grid: 0, lines: 0, chips: 0,
    fills: ["#10251e", "#10251e", "#f2f0ef", "#f2f0ef"],
    offsets: [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] },
];

/**
 * Scroll scenes progressively enhance readable, normally flowing HTML.
 * GSAP owns section wrappers, work-card/article and artwork-frame transforms.
 * Motion exclusively owns interactive images, buttons and dialog content.
 * A scoped context restores inline styles; destroy also restores heading DOM.
 */
export function createScenes({ root = document, reducedMotion = false, initialLoad = true } = {}) {
  const doc = root.nodeType === 9 ? root : root.ownerDocument;
  const win = doc?.defaultView;
  if (!win || !doc.body) return { refresh() {}, destroy() {} };
  const html = doc.documentElement;
  const $ = (selector, within = root) => within.querySelector(selector);
  const $$ = (selector, within = root) => [...within.querySelectorAll(selector)];
  const hooks = ["data-scenes-managed", "data-hero-managed", "data-process-managed"];
  const previousHooks = new Map(hooks.map(name => [name, html.getAttribute(name)]));
  const ownedTriggers = new Set();
  const textRestorers = [];
  const headingLines = new Map();
  const hero = $(".hero");
  const visual = $(".process-visual");
  const stages = $$(".process-stage").filter(stage => PROCESS_STATES.some(state => state.name === stage.dataset.stage));
  const visualLabel = $(".process-visual-label");
  const originalStage = visual?.getAttribute("data-stage");
  const originalLabel = visualLabel?.textContent;
  const originalActive = stages.map(stage => stage.classList.contains("is-active"));
  let context;
  let media;
  let destroyed = false;
  let frame = 0;
  let heroAttempted = false;

  function restoreHook(name) {
    const value = previousHooks.get(name);
    if (value === null) html.removeAttribute(name);
    else html.setAttribute(name, value);
  }

  function restoreProcess() {
    if (visual) {
      if (originalStage === null) visual.removeAttribute("data-stage");
      else visual.setAttribute("data-stage", originalStage);
    }
    if (visualLabel) visualLabel.textContent = originalLabel;
    stages.forEach((stage, index) => stage.classList.toggle("is-active", originalActive[index]));
  }

  // Split only author-defined lines, never individual letters or inferred font
  // measurements. Move original nodes so emphasis and existing semantics survive.
  function prepareText(element) {
    const authoredLines = [...element.querySelectorAll(":scope > .scene-line-mask > .scene-line-inner")];
    if (authoredLines.length) {
      headingLines.set(element, authoredLines);
      return;
    }
    const nodes = [...element.childNodes];
    const originalAria = element.getAttribute("aria-label");
    const alreadyClassed = element.classList.contains("scene-text");
    let groups = [[]];
    if (element.querySelector(":scope > .headline-line")) {
      groups = nodes.filter(node => node.nodeType !== 3 || node.textContent.trim()).map(node => [node]);
    } else {
      nodes.forEach(node => {
        if (node.nodeName === "BR") groups.push([]);
        else groups.at(-1).push(node);
      });
    }
    const accessibleText = groups.map(group => group.map(node => node.textContent).join("")).join(" ").replace(/\s+/g, " ").trim();
    const fragment = doc.createDocumentFragment();
    const lines = [];
    groups.forEach(group => {
      if (!group.length) return;
      const mask = doc.createElement("span");
      const inner = doc.createElement("span");
      mask.className = "scene-line-mask";
      inner.className = "scene-line-inner";
      mask.setAttribute("aria-hidden", "true");
      group.forEach(node => inner.append(node));
      mask.append(inner);
      fragment.append(mask);
      lines.push(inner);
    });
    element.replaceChildren(fragment);
    element.classList.add("scene-text");
    if (originalAria === null) element.setAttribute("aria-label", accessibleText);
    headingLines.set(element, lines);
    textRestorers.push(() => {
      element.replaceChildren(...nodes);
      if (!alreadyClassed) element.classList.remove("scene-text");
      if (originalAria === null) element.removeAttribute("aria-label");
      else element.setAttribute("aria-label", originalAria);
    });
  }

  function refresh() {
    if (destroyed || frame) return;
    frame = win.requestAnimationFrame(() => {
      frame = 0;
      if (destroyed) return;
      ownedTriggers.forEach(trigger => { trigger.refresh(); trigger.update(); });
    });
  }

  function onAssetLoad(event) {
    if (event.target?.tagName === "IMG") refresh();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (frame) win.cancelAnimationFrame(frame);
    root.removeEventListener("load", onAssetLoad, true);
    media?.revert();
    context?.revert();
    ownedTriggers.forEach(trigger => trigger.kill());
    ownedTriggers.clear();
    textRestorers.reverse().forEach(restore => restore());
    restoreProcess();
    hooks.forEach(restoreHook);
  }

  try {
    $$("#hero-heading, .section-heading h2, #playground-heading, #about-heading, .experience-title h3, #contact-heading, .footer-name").forEach(prepareText);
    html.setAttribute("data-scenes-managed", "true");
    // Assign before running setup, allowing complete recovery from partial init.
    context = gsap.context(() => {}, root);
    context.add(() => {
      media = gsap.matchMedia(root);
      media.add({
        desktop: "(min-width: 801px)",
        mobile: "(max-width: 800px)",
        enoughHeight: "(min-height: 701px)",
      }, mediaContext => {
        const { desktop, enoughHeight } = mediaContext.conditions;
        // The page controller resolves prefers-reduced-motion. Responsive queries
        // adapt the composition without competing with that preference.
        const skipMotion = Boolean(reducedMotion);
        const distance = desktop ? 1 : 0.55;
        const heroEligible = Boolean(hero) && !heroAttempted && initialLoad && win.scrollY < 80;
        heroAttempted = true;
        const mediaTriggers = new Set();

        function ownTrigger(options) {
          const trigger = ScrollTrigger.create(options);
          ownedTriggers.add(trigger);
          html.dataset.motionScenes = String(ownedTriggers.size);
          mediaTriggers.add(trigger);
          return trigger;
        }

        function scrollTween(target, from, to, options = {}) {
          if (Array.isArray(target)) target = target.filter(element => element.getClientRects().length);
          if (!target || (Array.isArray(target) ? !target.length : !target.getClientRects().length)) return;
          // Shared route code must not silently use the document when an
          // optional scene's explicitly selected parent is absent.
          if ("trigger" in options && !options.trigger) return;
          const linked = options.scrub !== undefined;
          const animation = gsap.fromTo(target, from, {
            ease: linked ? "none" : "power3.out", duration: linked ? 1 : .85,
            ...to, paused: true
          });
          return ownTrigger({
            trigger: Array.isArray(target) ? target[0] : target,
            start: "clamp(top 94%)", end: "clamp(top 58%)",
            // Entry motion finishes even when the user stops scrolling. Only
            // purposeful parallax/Process scenes remain tied to the scroll.
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
            ...options, animation,
          });
        }

        function enterItems(selector, { y = 34, x = 0, opacity = 0.4, end = "clamp(top 67%)" } = {}) {
          $$(selector).forEach((element, index) => scrollTween(element,
            { x: (typeof x === "function" ? x(index) : x) * distance, y: y * distance, opacity },
            { x: 0, y: 0, opacity: 1 }, { end }));
        }

        function cleanup() {
          mediaTriggers.forEach(trigger => ownedTriggers.delete(trigger));
          html.dataset.motionScenes = String(ownedTriggers.size);
          restoreProcess();
          restoreHook("data-hero-managed");
          restoreHook("data-process-managed");
        }

        // Reduced-motion desktop retains the finished diagram. Narrow or short
        // viewports display four per-step examples; normal motion reveals them.
        if (visual) html.setAttribute("data-process-managed", "true");
        if (visual && (skipMotion || !desktop || !enoughHeight)) {
          visual.dataset.stage = "deliver";
          if (visualLabel) visualLabel.textContent = PROCESS_STATES[3].label;
          stages.forEach(stage => stage.classList.remove("is-active"));
          const staticProgress = $(".process-progress");
          if (staticProgress) gsap.set(staticProgress, { scaleX: 1 });
        }
        if (skipMotion) return cleanup;

        const progress = $(".scroll-progress");
        scrollTween(progress, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1 }, {
          trigger: html, start: 0, end: () => Math.max(1, ScrollTrigger.maxScroll(win)), scrub: true,
        });

        // One initial assembly; scroll drift belongs to its parent, so it never
        // competes with the sheet transforms or interactive descendants.
        if (heroEligible) {
          html.setAttribute("data-hero-managed", "true");
          const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
          const lines = headingLines.get($("#hero-heading")) || [];
          if (lines.length) entrance.fromTo(lines, { yPercent: 105, rotation: 2.5, opacity: 0.25 },
            { yPercent: 0, rotation: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.04);
          [[".hero-kicker", 0, 18], [".hero-description", 0.2, 28], [".hero-actions", 0.33, 26], [".hero-signoff", 0.46, 18]].forEach(([selector, at, y]) => {
            const target = $(selector);
            if (target) entrance.fromTo(target, { y: y * distance, opacity: 0.35 }, { y: 0, opacity: 1, duration: 0.7 }, at);
          });
          [[".art-sheet-main", -40, 64, -16, -7, 0], [".type-note", 54, 84, 16, 7, 0.16], [".swatch-card", -38, 58, -23, -11, 0.3]].forEach(([selector, x, y, rotation, endRotation, at]) => {
            const target = $(selector);
            if (target) entrance.fromTo(target,
              { x: x * distance, y: y * distance, rotation, scale: 0.92, opacity: 0.75 },
              { x: 0, y: 0, rotation: endRotation, scale: 1, opacity: 1, duration: 1.15 }, at);
          });
        }
        scrollTween($(".hero-art"), { y: 0, rotation: 0 }, { y: desktop ? -84 : -24, rotation: desktop ? 3 : 0 }, {
          trigger: hero, start: "top top", end: "bottom top", scrub: 0.7,
        });

        // Each authored headline line has a shallow mask. Copy never fades to
        // zero; jumps to sections immediately resolve to their scroll position.
        headingLines.forEach((lines, heading) => {
          if (heading.id === "hero-heading") return;
          scrollTween(lines, { yPercent: 72, rotation: desktop ? 1.8 : 0, opacity: 0.35 },
            { yPercent: 0, rotation: 0, opacity: 1, stagger: 0.12 }, {
              trigger: heading, start: "clamp(top 97%)", end: "clamp(top 68%)",
            });
        });
        enterItems(".section-heading .eyebrow, .about-intro > .eyebrow, .playground-copy > .eyebrow", { x: -24, y: 0, end: "clamp(top 79%)" });
        enterItems(".heading-aside", { y: 30 });

        const strip = $(".discipline-strip");
        if (strip) {
          const words = $$(":scope > span", strip);
          scrollTween(words, { x: index => (index % 2 ? 32 : -32) * distance, opacity: 0.4 },
            { x: 0, opacity: 1, stagger: 0.08 }, { trigger: strip, start: "clamp(top 99%)", end: "clamp(top 72%)" });
          scrollTween($$("i", strip), { scaleY: 0.25, rotation: -22 }, { scaleY: 1, rotation: 0 },
            { trigger: strip, start: "clamp(top 99%)", end: "clamp(top 72%)" });
        }

        $$("article.work-card").forEach((card, index) => {
          const options = { trigger: card, start: "clamp(top 96%)", end: "clamp(top 47%)" };
          scrollTween(card, { y: (index % 2 ? 94 : 68) * distance, opacity: 0.4 }, { y: 0, opacity: 1 }, options);
          scrollTween($(".artwork-frame", card), { clipPath: "inset(9% 0% 9% 0%)", scale: 0.96 },
            { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }, options);
        });
        enterItems(".work-note, .work-footer", { y: 32 });
        enterItems(".expertise-row", { x: index => index % 2 ? 32 : -32, y: 0, end: "clamp(top 73%)" });
        scrollTween($(".expertise-preview"), { y: 58 * distance, rotation: desktop ? 4 : 0, scale: 0.94 },
          { y: 0, rotation: 0, scale: 1 }, { end: "clamp(top 51%)" });
        enterItems(".digital-note", { y: 28 });

        scrollTween($(".playground-board"), { y: 78 * distance, rotation: desktop ? -5 : 0, scale: desktop ? 0.92 : 0.97 },
          { y: 0, rotation: 0, scale: 1 }, { end: "clamp(top 37%)" });
        scrollTween($(".lab-orbit"), { rotation: -75, y: 20 * distance }, { rotation: 20, y: -20 * distance },
          { trigger: $(".playground-section"), start: "top bottom", end: "bottom top", scrub: 0.8 });
        enterItems(".playground-copy > p:not(.eyebrow), .play-controls", { y: 30 });

        enterItems(".about-body > p", { y: 38 });
        enterItems(".tools-block > .eyebrow", { y: 18 });
        enterItems(".tool-list > li", { y: 25, x: index => index % 2 ? 16 : -16 });
        const portrait = $(".designer-portrait");
        if (portrait) {
          const portraitRange = { trigger: portrait, start: "clamp(top 95%)", end: "clamp(top 54%)" };
          scrollTween(portrait, { y: 32 * distance, opacity: 0.55 }, { y: 0, opacity: 1 }, portraitRange);
          // Scale up only to the authored size. No crop, clipping or zoom past
          // 100%: the face and the original portrait framing remain visible.
          scrollTween($(".portrait-image", portrait), { scale: 0.98 }, { scale: 1 }, portraitRange);
        }
        scrollTween($(".experience-block"), { clipPath: "inset(0% 4% 0% 4%)" },
          { clipPath: "inset(0% 0% 0% 0%)" }, { end: "clamp(top 59%)" });
        enterItems(".experience-title > .eyebrow, .role-line, .experience-details > p, .experience-details li", { y: 28 });

        const layout = $(".process-layout");
        const center = $(".process-center");
        const shapes = $$(".process-shape");
        if (desktop && enoughHeight && visual && layout && center && shapes.length && stages.length) {
          const sequence = gsap.timeline({ paused: true, defaults: { duration: 1, ease: "none" } });
          const grid = $(".process-visual-grid");
          const lines = $$(".process-lines span");
          const chips = $(".process-color-chips");
          const progressBar = $(".process-progress");
          // Keep the artwork geometry in GSAP; CSS state colors can change
          // theme without rebuilding the timeline or flashing the old theme.
          function properties(state) {
            return [
              [center, { rotation: state.rotation, scale: state.scale }],
              [grid, { opacity: state.grid }],
              [lines, { opacity: state.lines }],
              [chips, { opacity: state.chips, y: state.chips ? 0 : 12 }],
              ...shapes.map((shape, index) => [shape, {
                x: state.offsets[index][0], y: state.offsets[index][1], rotation: state.offsets[index][2],
              }]),
            ].filter(([target]) => target && (!Array.isArray(target) || target.length));
          }
          PROCESS_STATES.forEach((state, index) => {
            const current = properties(state);
            if (!index) current.forEach(([target, props]) => gsap.set(target, props));
            else {
              const prior = properties(PROCESS_STATES[index - 1]);
              current.forEach(([target, props], targetIndex) => sequence.fromTo(target, prior[targetIndex][1],
                { ...props, immediateRender: false }, index - 1));
            }
          });
          if (progressBar) sequence.fromTo(progressBar, { scaleX: 0 }, { scaleX: 1, duration: 3 }, 0);
          let selected = "";
          function updateActive() {
            let index = 0;
            stages.forEach((stage, stageIndex) => {
              if (stage.getBoundingClientRect().top <= win.innerHeight * 0.68) index = stageIndex;
            });
            const name = stages[index].dataset.stage;
            if (name === selected) return;
            selected = name;
            visual.dataset.stage = name;
            if (visualLabel) visualLabel.textContent = PROCESS_STATES.find(state => state.name === name).label;
            stages.forEach(stage => stage.classList.toggle("is-active", stage.dataset.stage === name));
          }
          ownTrigger({ trigger: layout,
            start: () => stages[0].getBoundingClientRect().top + win.scrollY - win.innerHeight * 0.65,
            end: () => stages.at(-1).getBoundingClientRect().top + win.scrollY - win.innerHeight * 0.68,
            animation: sequence, scrub: 0.65, onUpdate: updateActive, onRefresh: updateActive,
          });
          updateActive();
        }
        enterItems(".process-stage > h3, .process-stage > p", { y: 24, opacity: 0.5, end: "clamp(top 71%)" });
        // Mini diagrams remain static internally: their full narrative is visible
        // on touch screens without a sticky viewport or a timed sequence.
        enterItems(".process-mini", { y: 32, opacity: 0.5, end: "clamp(top 72%)" });
        enterItems(".contact-section > .section-shell > .eyebrow", { x: -24, y: 0 });
        enterItems(".contact-aside, .contact-form", { y: 50, opacity: 0.5, end: "clamp(top 65%)" });
        scrollTween($(".contact-art"), { rotation: -25, scale: 0.85, y: 32 }, { rotation: 25, scale: 1.12, y: -32 },
          { trigger: $(".contact-section"), start: "top bottom", end: "bottom top", scrub: 0.7 });
        enterItems(".footer-bottom > p, .footer-actions", { y: 24, end: "clamp(top 88%)" });
        enterItems(".study-hero-heading, .study-attribution, .study-artboard, .study-context-copy, .study-application-heading, .study-detail, .study-reflection-copy", { y: 38, opacity: .5 });
        refresh();
        return cleanup;
      });
    });
    root.addEventListener("load", onAssetLoad, true);
    doc.fonts?.ready.then(() => { if (!destroyed) refresh(); }).catch(() => {});
  } catch (error) {
    destroy();
    throw error;
  }
  return { refresh, destroy, get triggerCount() { return ownedTriggers.size; } };
}
