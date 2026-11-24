"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";
let transitionTimer = 0;
function applyTheme(next: Theme) {
  const html = document.documentElement;
  if (getTheme() === next) return;
  window.clearTimeout(transitionTimer);
  html.dataset.themeTransitioning = "true";
  html.dataset.theme = next;
  window.dispatchEvent(new CustomEvent("themestatuschange"));
  transitionTimer = window.setTimeout(() => {
    delete html.dataset.themeTransitioning;
  }, 480);
}
function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== "portfolio-theme" && event.key !== null) return;
    applyTheme(event.newValue === "dark" ? "dark" : "light");
  };
  window.addEventListener("themestatuschange", notify);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("themestatuschange", notify);
    window.removeEventListener("storage", onStorage);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, (): Theme => "light");
  const dark = theme === "dark";
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#101010" : "#f8f7f4");
  }, [dark]);

  function toggle() {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch {}
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle}
      aria-label="Dark mode" aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <svg className="theme-icon theme-icon-moon" viewBox="0 0 24 24"
        width="18" height="18" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg className="theme-icon theme-icon-sun" viewBox="0 0 24 24"
        width="18" height="18" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </svg>
    </button>
  );
}
