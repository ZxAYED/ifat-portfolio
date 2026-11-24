"use client";

import { useEffect, useState } from "react";

export function AnimationToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const isReduced = document.documentElement.dataset.motionMode === "reduced";
    setEnabled(!isReduced);
  }, []);

  function toggle() {
    const nextState = !enabled;
    setEnabled(nextState);
    const mode = nextState ? "full" : "reduced";
    document.documentElement.dataset.motionMode = mode;
    try {
      localStorage.setItem("motion-preference", mode);
    } catch {}
    window.dispatchEvent(new CustomEvent("motionmodechange"));
  }

  return (
    <button
      type="button"
      className="text-link motion-toggle"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={`Toggle animations (currently ${enabled ? "on" : "off"})`}
    >
      Animations: {enabled ? "On" : "Off"}
    </button>
  );
}
