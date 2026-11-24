import { studies } from "./content.js";

/**
 * Native-dialog behavior and content only. The motion controller owns the
 * .dialog-surface entrance/exit; this module owns modality, scroll, and focus.
 */
export function setupProjectViewer({ root = document, getMotion = () => null } = {}) {
  const dialog = root.querySelector(".study-dialog");
  if (!dialog) return { destroy() {} };

  const hasStudy = key => Object.prototype.hasOwnProperty.call(studies, key);
  const triggers = [...root.querySelectorAll("a.artwork-button[data-study]")]
    .filter(trigger => hasStudy(trigger.dataset.study));
  // The real links remain the complete experience if native modality is absent.
  if (typeof dialog.showModal !== "function") {
    triggers.forEach(trigger => {
      trigger.removeAttribute("aria-haspopup");
      trigger.removeAttribute("aria-controls");
    });
    return { destroy() {} };
  }

  const controller = new AbortController();
  const listen = (target, event, callback, options = {}) => {
    target.addEventListener(event, callback, { ...options, signal: controller.signal });
  };
  const galleryKeys = [...new Set(triggers.map(trigger => trigger.dataset.study))];
  const keys = galleryKeys.length ? galleryKeys : Object.keys(studies);
  let disposed = false;
  let currentIndex = 0;
  let originalTrigger = null;
  let closing = false;
  let closeTimer = 0;
  let closeGeneration = 0;
  let pageLock = null;
  let backdropStart = false;

  dialog.id ||= "study-viewer";
  dialog.setAttribute("aria-labelledby", "study-title");
  dialog.setAttribute("aria-describedby", "study-description study-disclosure");
  dialog.setAttribute("data-lenis-prevent", "");
  dialog.dataset.viewerState = "closed";
  // This shell is static, controlled markup. Project data is always inserted
  // with textContent or attribute assignments below, never as HTML.
  dialog.innerHTML = `
    <div class="dialog-surface">
      <header class="project-viewer__header">
        <div class="project-viewer__identity">
          <span class="project-viewer__mark" aria-hidden="true">if.</span>
          <span class="project-viewer__label">Layout studies</span>
        </div>
        <button class="dialog-close project-viewer__close" type="button" aria-label="Close project study" autofocus>
          Close <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="project-viewer__scroll" data-lenis-prevent tabindex="0" role="region" aria-label="Study artwork and details">
        <div class="project-viewer__layout" data-viewer-reveal>
          <figure class="project-viewer__figure">
            <div class="project-viewer__media">
              <img id="study-image" width="1200" height="900" alt="" decoding="async">
            </div>
            <figcaption class="project-viewer__caption"><span id="study-caption"></span><span aria-hidden="true">Layout study</span></figcaption>
          </figure>
          <div class="project-viewer__copy">
            <p class="project-viewer__category" id="study-category"></p>
            <h2 id="study-title"></h2>
            <p class="project-viewer__summary" id="study-description"></p>
            <section class="project-viewer__approach" aria-labelledby="study-approach-title">
              <h3 id="study-approach-title">In this composition</h3>
              <p id="study-approach"></p>
            </section>
            <ul class="project-viewer__details" id="study-details" aria-label="Design focus"></ul>
            <p class="project-viewer__disclosure" id="study-disclosure">Created by ChatGPT for this website concept. These illustrative studies are not Ifat-authored projects or client commissions.</p>
            <div class="project-viewer__actions">
              <a class="button button-dark project-viewer__full-study" id="study-full-link" href="/work/visual-language-study/">Read the complete study</a>
              <a class="project-viewer__external" href="https://www.behance.net/designedwithifat" target="_blank" rel="noopener noreferrer">View Ifat’s Behance portfolio<span class="sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
        </div>
      </div>
      <footer class="project-viewer__footer" aria-label="Browse studies">
        <button class="project-viewer__nav-button" type="button" data-viewer-previous>Previous study</button>
        <span class="project-viewer__count" id="study-count" aria-hidden="true"></span>
        <button class="project-viewer__nav-button project-viewer__nav-button--next" type="button" data-viewer-next>Next study</button>
        <span class="sr-only" id="study-announcement" aria-live="polite" aria-atomic="true"></span>
      </footer>
    </div>`;

  const $ = selector => dialog.querySelector(selector);
  const content = $(".project-viewer__scroll");
  const closeButton = $(".dialog-close");
  const previousButton = $("[data-viewer-previous]");
  const nextButton = $("[data-viewer-next]");
  const image = $("#study-image");
  const status = $("#study-announcement");

  const triggerAttributes = triggers.map(trigger => ({
    trigger,
    hasPopup: trigger.getAttribute("aria-haspopup"),
    controls: trigger.getAttribute("aria-controls")
  }));
  triggers.forEach(trigger => {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", dialog.id);
  });

  function setMotionBlocked(blocked) {
    // Native page locking remains sufficient if optional animation fails.
    try { getMotion()?.setModalOpen?.(blocked); } catch {}
  }

  function lockPage() {
    if (pageLock) return;
    const body = document.body;
    const html = document.documentElement;
    const stableGutter = (getComputedStyle(html).scrollbarGutter || "").includes("stable");
    const scrollbar = stableGutter ? 0 : Math.max(0, window.innerWidth - html.clientWidth);
    pageLock = {
      x: window.scrollX,
      y: window.scrollY,
      bodyOverflow: body.style.overflow,
      bodyPadding: body.style.paddingRight,
      htmlOverflow: html.style.overflow,
      hadClass: body.classList.contains("modal-open")
    };
    const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.classList.add("modal-open");
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    if (scrollbar) body.style.paddingRight = `${padding + scrollbar}px`;
    setMotionBlocked(true);
  }

  function unlockPage({ restoreScroll = true } = {}) {
    if (!pageLock) return;
    const saved = pageLock;
    pageLock = null;
    const body = document.body;
    const html = document.documentElement;
    body.style.overflow = saved.bodyOverflow;
    body.style.paddingRight = saved.bodyPadding;
    html.style.overflow = saved.htmlOverflow;
    if (!saved.hadClass) body.classList.remove("modal-open");
    // Native focus restoration must not move the gallery behind the viewer.
    if (restoreScroll && (Math.abs(window.scrollY - saved.y) > 0.5 || Math.abs(window.scrollX - saved.x) > 0.5)) {
      const behavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(saved.x, saved.y);
      html.style.scrollBehavior = behavior;
    }
    setMotionBlocked(false);
  }

  function renderStudy(index, { initial = false } = {}) {
    currentIndex = (index + keys.length) % keys.length;
    const key = keys[currentIndex];
    const study = studies[key];
    const previous = studies[keys[(currentIndex - 1 + keys.length) % keys.length]];
    const next = studies[keys[(currentIndex + 1) % keys.length]];
    dialog.dataset.activeStudy = key;
    $("#study-category").textContent = study.category;
    $("#study-title").textContent = study.title;
    $("#study-description").textContent = study.description;
    $("#study-approach").textContent = study.approach;
    $("#study-caption").textContent = study.caption;
    $("#study-full-link").href = study.href;
    image.src = study.image;
    image.alt = study.alt;
    $("#study-details").replaceChildren(...study.details.map(detail => {
      const item = document.createElement("li");
      item.textContent = detail;
      return item;
    }));
    $("#study-count").textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(keys.length).padStart(2, "0")}`;
    previousButton.setAttribute("aria-label", `Previous study: ${previous.title}`);
    nextButton.setAttribute("aria-label", `Next study: ${next.title}`);
    status.textContent = initial ? "" : `Study ${currentIndex + 1} of ${keys.length}: ${study.title}`;
    content.scrollTop = 0;
    dialog.dispatchEvent(new CustomEvent("project-viewer:change", {
      detail: { key, index: currentIndex, total: keys.length, initial }
    }));
  }

  function releaseViewer({ restoreFocus = true } = {}) {
    clearTimeout(closeTimer);
    closeTimer = 0;
    closing = false;
    backdropStart = false;
    dialog.dataset.viewerState = "closed";
    const wasLocked = Boolean(pageLock);
    unlockPage();
    if (wasLocked && restoreFocus && !disposed && originalTrigger?.isConnected) {
      originalTrigger.focus({ preventScroll: true });
    }
  }

  function openViewer(trigger) {
    const index = keys.indexOf(trigger.dataset.study);
    if (disposed || index < 0 || dialog.open || closing) return false;
    originalTrigger = trigger;
    try {
      renderStudy(index, { initial: true });
      lockPage();
      dialog.showModal();
      if (!dialog.open) {
        releaseViewer({ restoreFocus: false });
        return false;
      }
    } catch (error) {
      releaseViewer({ restoreFocus: false });
      console.warn("The project viewer could not open; following the study link.", error);
      return false;
    }
    dialog.dataset.viewerState = "open";
    dialog.scrollTop = 0;
    content.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
    try { getMotion()?.dialogOpen?.(); } catch {}
    return true;
  }

  function closeViewer() {
    if (disposed || !dialog.open || closing) return;
    closing = true;
    dialog.dataset.viewerState = "closing";
    const ticket = ++closeGeneration;
    const commit = () => {
      if (disposed || ticket !== closeGeneration || !closing) return;
      if (dialog.open) dialog.close();
      releaseViewer();
    };
    const motion = getMotion();
    if (typeof motion?.dialogClose === "function") {
      // A failed/interrupted optional enhancement must never trap the visitor.
      closeTimer = window.setTimeout(commit, 650);
      try { motion.dialogClose(commit); } catch { commit(); }
    } else commit();
  }

  function isOutside(event) {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  listen(root, "click", event => {
    const trigger = event.target.closest?.("a.artwork-button[data-study]");
    if (!trigger || !hasStudy(trigger.dataset.study)) return;
    // Primary pointer/keyboard activation opens the quick view. Every modified
    // or explicitly targeted/download activation retains the anchor's URL.
    const target = trigger.getAttribute("target");
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || trigger.hasAttribute("download") || (target && target.toLowerCase() !== "_self")) return;
    // Do not cancel navigation until native modality is actually established.
    if (openViewer(trigger)) event.preventDefault();
  });
  listen(closeButton, "click", closeViewer);
  listen(previousButton, "click", () => {
    if (!closing) renderStudy(currentIndex - 1);
  });
  listen(nextButton, "click", () => {
    if (!closing) renderStudy(currentIndex + 1);
  });
  listen(dialog, "cancel", event => {
    event.preventDefault();
    closeViewer();
  });
  listen(dialog, "pointerdown", event => {
    backdropStart = event.target === dialog && isOutside(event);
  });
  listen(dialog, "pointercancel", () => { backdropStart = false; });
  listen(dialog, "click", event => {
    const outside = backdropStart && event.target === dialog && isOutside(event);
    backdropStart = false;
    if (outside) closeViewer();
  });
  listen(dialog, "close", () => {
    if (!dialog.open) releaseViewer();
  });

  return {
    destroy() {
      if (disposed) return;
      disposed = true;
      closeGeneration++;
      clearTimeout(closeTimer);
      controller.abort();
      if (dialog.open) dialog.close();
      closing = false;
      dialog.dataset.viewerState = "closed";
      unlockPage({ restoreScroll: false });
      originalTrigger = null;
      triggerAttributes.forEach(({ trigger, hasPopup, controls }) => {
        if (hasPopup === null) trigger.removeAttribute("aria-haspopup");
        else trigger.setAttribute("aria-haspopup", hasPopup);
        if (controls === null) trigger.removeAttribute("aria-controls");
        else trigger.setAttribute("aria-controls", controls);
      });
    }
  };
}
