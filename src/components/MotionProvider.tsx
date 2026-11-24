"use client";

import { MotionConfig } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(notify: () => void) {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
function getReduced() {
  return window.matchMedia(REDUCED_MOTION).matches;
}
export function usePortfolioReducedMotion() {
  return useSyncExternalStore(subscribe, getReduced, () => false);
}
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = usePortfolioReducedMotion();
  return <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>;
}
