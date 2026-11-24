"use client";

import { useEffect, useRef } from "react";
import { startPage } from "@/lib/runtime/page.js";
import { createFallbackMotion } from "@/lib/runtime/animation/fallback.js";

/** Initialize after React hydration, independently of a GSAP React context.
 * The runtime owns its effects and always cleans up on route changes. */
export default function ExperienceRuntime() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>(".home-page, .study-page");
    if (!root) return;
    const controller = new AbortController();
    let page: { destroy(): void } | null = null;
    function mount(initialLoad: boolean) {
      if (page || !root) return;
      try {
        page = startPage({ root, initialLoad });
      } catch (error) {
        console.warn("Portfolio runtime failed to initialize; native motion is active.", error);
        const html = document.documentElement;
        html.dataset.motionState = "fallback";
        html.dataset.scrollEngine = "native";
        page = createFallbackMotion({ root, initialLoad, reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches });
      }
    }
    function unmount() {
      page?.destroy();
      page = null;
    }
    mount(true);
    window.addEventListener("pagehide", unmount, { signal: controller.signal });
    window.addEventListener("pageshow", () => mount(false), { signal: controller.signal });
    return () => { controller.abort(); unmount(); };
  }, []);

  return <span hidden aria-hidden="true" data-experience-runtime="" ref={marker} />;
}
