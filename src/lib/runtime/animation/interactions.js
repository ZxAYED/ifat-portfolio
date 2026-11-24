import { animate, hover, press, scopeMotion } from "motion";

const interactiveSelector = [
  ".button", ".nav-contact", ".menu-toggle", ".theme-toggle", ".text-link",
  ".type-choice", ".grid-toggle", ".filter", ".palette-choice",
  ".dialog-close", ".main-nav > a",
  ".project-viewer__nav-button", ".project-viewer__external", "[data-viewer-action]"
].join(", ");

const transformStyles = ["transform", "translate", "scale", "rotate"];
const detailStyles = ["height", "padding-top", "opacity", "overflow"];
const easeOut = [0.22, 1, 0.36, 1];
const controlSpring = { type: "spring", stiffness: 440, damping: 34, mass: 0.7 };
const imageSpring = { type: "spring", stiffness: 180, damping: 28, mass: 0.8 };

/**
 * Presentation only: the caller owns navigation, lab state, and the native
 * dialog's showModal()/close() calls. GSAP owns artwork articles and frames;
 * this module only transforms the image and affordance inside each work card.
 * The semantic full-card link's hitbox is never scaled or translated.
 */
export function createInteractions({
  root = document,
  reducedMotion = false,
  requestRefresh = () => {}
} = {}) {
  const doc = root.nodeType === 9 ? root : root.ownerDocument;
  const view = doc.defaultView;
  const reduce = Boolean(reducedMotion);
  const query = selector => root.querySelector(selector);
  const queryAll = selector => [...root.querySelectorAll(selector)];
  const cleanups = [];
  const running = new Map();
  const elementScopes = new Map();
  const savedStyles = new Map();
  const boundControls = new WeakSet();
  const detailsStates = [];
  let destroyed = false;

  // Restore only our properties, preserving later writes to unrelated styles.
  function remember(element, properties) {
    if (!element) return;
    if (!savedStyles.has(element)) savedStyles.set(element, new Map());
    const saved = savedStyles.get(element);
    for (const name of properties) {
      if (!saved.has(name)) {
        saved.set(name, [element.style.getPropertyValue(name), element.style.getPropertyPriority(name)]);
      }
    }
  }

  function restore(element, properties) {
    const saved = savedStyles.get(element);
    if (!saved) return;
    stop(element);
    const scope = elementScopes.get(element);
    if (scope) {
      elementScopes.delete(element);
      // cancel() releases Motion's retained values and queued style renders.
      // It restores a whole style attribute, so preserve unrelated current
      // styles before applying our property-level restoration below.
      const currentStyle = element.getAttribute("style");
      scope.cancel();
      if (currentStyle === null) element.removeAttribute("style");
      else element.setAttribute("style", currentStyle);
    }
    for (const name of properties ?? saved.keys()) {
      const original = saved.get(name);
      if (!original) continue;
      if (original[0]) element.style.setProperty(name, original[0], original[1]);
      else element.style.removeProperty(name);
    }
  }

  function listen(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    cleanups.push(() => element.removeEventListener(event, handler, options));
  }

  function stop(element) {
    const entry = running.get(element);
    if (!entry) return;
    running.delete(element);
    // stop() retains the current rendered value, allowing a smooth reversal.
    entry.controls.stop();
  }

  function run(element, keyframes, options, complete) {
    if (destroyed || !element) return;
    stop(element);
    if (!elementScopes.has(element)) elementScopes.set(element, scopeMotion(() => {}));
    const controls = elementScopes.get(element).run(() => animate(element, keyframes, options));
    const entry = { controls };
    running.set(element, entry);
    controls.then(() => {
      if (destroyed || running.get(element) !== entry) return;
      running.delete(element);
      complete?.();
    });
  }

  function refresh() {
    if (!destroyed) requestRefresh();
  }

  function isDisabled(element) {
    return element.matches(":disabled") || element.getAttribute("aria-disabled") === "true";
  }

  function bindControl(element, { image = null, affordance = null, artwork = false } = {}) {
    // Limit gestures to actual controls. In particular, toolkit tiles and
    // decorative artwork never acquire tab stops or pointer listeners.
    if (reduce || boundControls.has(element) || !element.matches("button, a[href], input, select, textarea")) return;
    boundControls.add(element);
    if (!artwork) remember(element, transformStyles);
    if (image) remember(image, transformStyles);
    if (affordance) remember(affordance, transformStyles);
    const state = { hovered: false, focused: false, pressed: false };

    const update = () => {
      if (destroyed) return;
      const active = !isDisabled(element) && (state.hovered || state.focused);
      const pressed = !isDisabled(element) && state.pressed;
      if (!artwork) {
        run(element, { y: active ? -2 : 0, scale: pressed ? 0.97 : 1 }, controlSpring);
      }
      if (image) {
        run(image, { scale: pressed ? 1.012 : active ? 1.035 : 1 }, imageSpring);
      }
      if (affordance) {
        run(affordance, { scale: pressed ? 0.92 : active ? 1.12 : 1, y: active ? -2 : 0 }, controlSpring);
      }
    };

    cleanups.push(hover(element, () => {
      state.hovered = true;
      update();
      return () => {
        state.hovered = false;
        update();
      };
    }));
    cleanups.push(press(element, () => {
      if (isDisabled(element)) return;
      state.pressed = true;
      update();
      return () => {
        state.pressed = false;
        update();
      };
    }));
    listen(element, "focus", () => {
      state.focused = element.matches(":focus-visible");
      update();
    });
    listen(element, "blur", () => {
      state.focused = false;
      state.pressed = false;
      update();
    });

    // Motion handles Enter. Native buttons also activate with Space; observe
    // it for feedback without preventing the browser's click behavior.
    if (element.tagName === "BUTTON") {
      listen(element, "keydown", event => {
        if (event.key !== " " || event.repeat || isDisabled(element)) return;
        state.pressed = true;
        update();
      });
      listen(element, "keyup", event => {
        if (event.key !== " ") return;
        state.pressed = false;
        update();
      });
    }
  }

  // The semantic link contains its artwork and caption/plus. Keep the legacy
  // sibling-frame fallback, but prefer descendants of the actual trigger.
  // Bind cards first so generic .button styling never transforms their hitbox.
  queryAll(".work-trigger, .artwork-button").forEach(element => {
    const card = element.closest(".work-card");
    const frame = element.querySelector(".artwork-frame") || card?.querySelector(".artwork-frame");
    bindControl(element, {
      artwork: true,
      image: frame?.querySelector("img") || element.querySelector("img"),
      affordance: element.querySelector(".caption-symbol") || card?.querySelector(".caption-symbol")
    });
  });
  queryAll(interactiveSelector).filter(element => !element.closest("[data-motion-owner=\"react\"]")).forEach(element => bindControl(element));

  const expertisePreview = query(".expertise-preview");
  const previewImage = expertisePreview?.querySelector("img");
  const previewLabel = expertisePreview?.querySelector(".expertise-preview-label");
  let previewRequest = 0;
  let requestedPreview = previewImage?.getAttribute("src") || "";
  remember(previewImage, [...transformStyles, "opacity"]);
  remember(previewLabel, ["opacity"]);

  function showServicePreview(details, immediate = false) {
    if (!previewImage || !details) return;
    const key = details.dataset.preview;
    const matchingCard = key
      ? queryAll(".work-trigger[data-study], .artwork-button[data-study]").find(button => button.dataset.study === key)
      : null;
    const cardImage = matchingCard?.querySelector(".artwork-frame img")
      || matchingCard?.closest(".work-card")?.querySelector(".artwork-frame img")
      || matchingCard?.querySelector("img");
    const source = details.dataset.previewSrc || cardImage?.getAttribute("src");
    if (!source) return;
    const label = details.dataset.previewLabel || details.querySelector("summary")?.textContent.trim() || "Design study";
    const alt = details.dataset.previewAlt || `${label} visual preview`;

    if (source === requestedPreview && previewImage.getAttribute("src") === source) {
      previewImage.alt = alt;
      if (previewLabel) previewLabel.textContent = label;
      return;
    }

    requestedPreview = source;
    const request = ++previewRequest;
    const commit = () => {
      if (destroyed || request !== previewRequest) return;
      previewImage.src = source;
      previewImage.alt = alt;
      if (previewLabel) previewLabel.textContent = label;
      if (immediate || reduce) {
        restore(previewImage);
        restore(previewLabel);
      } else {
        run(previewImage, { opacity: [0.55, 1], y: [7, 0], scale: [1.015, 1] }, {
          duration: 0.34, ease: easeOut
        }, () => restore(previewImage));
        if (previewLabel) {
          run(previewLabel, { opacity: [0.45, 1] }, { duration: 0.22, ease: easeOut }, () => restore(previewLabel));
        }
      }
      refresh();
    };

    // Keep the previous illustration visible while a new local artwork is
    // decoded. A rapid second selection invalidates the first completion.
    const nextImage = new view.Image();
    nextImage.src = source;
    if (nextImage.complete && nextImage.naturalWidth > 0) {
      commit();
    } else if (typeof nextImage.decode === "function") {
      nextImage.decode().then(commit).catch(() => {
        if (!destroyed && request === previewRequest) {
          requestedPreview = previewImage.getAttribute("src") || "";
        }
      });
    } else {
      nextImage.onload = commit;
      nextImage.onerror = () => {
        if (!destroyed && request === previewRequest) requestedPreview = previewImage.getAttribute("src") || "";
      };
      cleanups.push(() => { nextImage.onload = null; nextImage.onerror = null; });
    }
  }

  // Keep <details>/<summary>, the real open attribute, and the browser's
  // Enter/Space activation. Only its visual collapse delays removal of open.
  for (const details of queryAll("details.expertise-row")) {
    const summary = details.querySelector("summary");
    const content = details.querySelector(".expertise-content");
    if (!summary || !content) continue;
    remember(content, detailStyles);
    const state = { details, content, targetOpen: details.open, domOpen: details.open };
    detailsStates.push(state);

    const setOpen = open => {
      state.domOpen = open;
      details.open = open;
    };

    const settle = () => {
      stop(content);
      setOpen(state.targetOpen);
      restore(content, detailStyles);
      refresh();
    };

    const toggle = open => {
      state.targetOpen = open;
      if (open) showServicePreview(details);
      stop(content);
      const visible = details.open;
      const previous = view.getComputedStyle(content);
      const startHeight = visible ? content.getBoundingClientRect().height : 0;
      const startPadding = visible ? parseFloat(previous.paddingTop) || 0 : 0;
      const startOpacity = visible ? parseFloat(previous.opacity) || 0 : 0;

      // Measure the natural open layout synchronously; no frame is painted
      // between measuring and restoring the current in-flight dimensions.
      setOpen(true);
      restore(content, detailStyles);
      const natural = view.getComputedStyle(content);
      const endHeight = open ? content.getBoundingClientRect().height : 0;
      const endPadding = open ? parseFloat(natural.paddingTop) || 0 : 0;
      const endOpacity = open ? parseFloat(natural.opacity) || 1 : 0;
      content.style.overflow = "hidden";
      content.style.height = `${startHeight}px`;
      content.style.paddingTop = `${startPadding}px`;
      content.style.opacity = String(startOpacity);

      run(content, {
        height: [startHeight, endHeight],
        paddingTop: [startPadding, endPadding],
        opacity: [startOpacity, endOpacity]
      }, { duration: open ? 0.28 : 0.24, ease: easeOut }, settle);
    };

    if (!reduce) {
      listen(summary, "click", event => {
        if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
        const nestedControl = event.target.closest?.("a, button, input, select, textarea, [contenteditable='true']");
        if (nestedControl && summary.contains(nestedControl)) return;
        event.preventDefault();
        toggle(!state.targetOpen);
      });
    }

    // Programmatic changes and native exclusive-details groups still win.
    // Our own assignments produce real toggle events and need no extra work.
    listen(details, "toggle", () => {
      if (details.open === state.domOpen) return;
      state.targetOpen = details.open;
      state.domOpen = details.open;
      stop(content);
      restore(content, detailStyles);
      if (details.open) showServicePreview(details);
      refresh();
    });
  }

  showServicePreview(detailsStates.find(state => state.details.open)?.details || detailsStates[0]?.details, true);

  const nav = query(".main-nav");
  const compactNav = view.matchMedia("(max-width: 1200px)");
  let lastMenuOpen = false;
  remember(nav, [...transformStyles, "opacity"]);

  function menu(open) {
    if (destroyed || !nav) return;
    const wasOpen = lastMenuOpen;
    lastMenuOpen = Boolean(open);
    if (!open || !compactNav.matches || nav.hidden || view.getComputedStyle(nav).display === "none") {
      stop(nav);
      restore(nav);
      return;
    }
    if (wasOpen || reduce) return;
    run(nav, { opacity: [0, 1], y: [-6, 0] }, {
      duration: 0.24,
      ease: easeOut
    }, () => restore(nav));
  }

  const dialog = query(".study-dialog");
  let closing = null;

  function getDialogSurface() {
    const surface = dialog?.querySelector(".dialog-surface") || dialog;
    remember(surface, [...transformStyles, "opacity"]);
    return surface;
  }

  function finishClose(transaction) {
    if (!transaction || transaction.called) return;
    transaction.called = true;
    if (closing === transaction) closing = null;
    const surface = transaction.surface || getDialogSurface();
    stop(surface);
    try {
      transaction.commit();
    } finally {
      restore(surface);
    }
  }

  function dialogOpen() {
    // showModal() is exclusively the caller's responsibility. A repeated
    // open during an accepted close must not silently discard that close.
    if (destroyed || reduce || !dialog?.open || closing) return;
    const surface = getDialogSurface();
    run(surface, reduce ? { opacity: [0.94, 1] } : {
      opacity: [0, 1], y: [14, 0], scale: [0.985, 1]
    }, { duration: reduce ? 0.06 : 0.32, ease: easeOut }, () => restore(surface));
  }

  function dialogClose(commit) {
    if (typeof commit !== "function") return;
    if (closing) return; // Coalesce repeated Escape, backdrop, and button taps.
    const transaction = { commit, called: false, surface: getDialogSurface() };
    if (destroyed || reduce || !dialog?.open) {
      finishClose(transaction);
      return;
    }
    closing = transaction;
    // open is untouched here, retaining top-layer modality and focus trapping
    // until the actual close callback executes exactly once.
    run(transaction.surface, reduce ? { opacity: 0 } : {
      opacity: 0, y: 8, scale: 0.99
    }, { duration: reduce ? 0.05 : 0.18, ease: [0.4, 0, 1, 1] }, () => finishClose(transaction));
  }

  if (dialog) {
    listen(dialog, "close", () => {
      const surface = getDialogSurface();
      stop(surface);
      if (closing) finishClose(closing);
      restore(surface);
    });
    listen(dialog, "project-viewer:change", event => {
      if (destroyed || reduce || !dialog.open || closing || event.detail?.initial) return;
      const content = dialog.querySelector("[data-viewer-reveal]");
      if (!content) return;
      remember(content, [...transformStyles, "opacity"]);
      run(content, reduce ? { opacity: [0.96, 1] } : { opacity: [0.65, 1], y: [6, 0] }, {
        duration: reduce ? 0.05 : 0.25, ease: easeOut
      }, () => restore(content));
    });
  }

  // TypeLab.tsx owns composition and grid animation through Motion React.
  // Keep this module's ownership on the remaining native controls.

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    previewRequest += 1;
    for (const cleanup of cleanups.splice(0).reverse()) cleanup();
    for (const element of [...running.keys()]) stop(element);
    for (const state of detailsStates) state.details.open = state.targetOpen;
    // A preference change or teardown during exit still finishes the accepted
    // native close. Lab commits need no flushing because they are synchronous.
    if (closing) finishClose(closing);
    for (const element of savedStyles.keys()) restore(element);
    savedStyles.clear();
  }

  return { menu, dialogOpen, dialogClose, destroy };
}
