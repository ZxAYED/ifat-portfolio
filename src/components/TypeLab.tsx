"use client";

import { usePortfolioReducedMotion } from "@/components/MotionProvider";

import { memo, useState } from "react";
import { motion, useAnimationControls } from "motion/react";

const presets = {
  quiet: {
    name: "Quiet",
    description:
      "Regular weight, open spacing and a looser line height give the words room to breathe.",
  },
  direct: {
    name: "Direct",
    description:
      "Heavier sans-serif letters and tighter spacing make a clear, immediate statement.",
  },
  expressive: {
    name: "Expressive",
    description:
      "An italic serif changes the second word’s rhythm while the first stays direct.",
  },
} as const;

type Preset = keyof typeof presets;
const presetKeys = Object.keys(presets) as Preset[];
const easeOut = [0.22, 1, 0.36, 1] as const;
const spring = {
  type: "spring" as const,
  stiffness: 440,
  damping: 34,
  mass: 0.7,
};

// GSAP receives authored line wrappers. It never has to reparent React-owned
// heading nodes when a visitor changes a preset.
const LabHeading = memo(function LabHeading() {
  return (
    <>
      <p className="eyebrow">The Type Lab</p>
      <h2
        id="playground-heading"
        className="scene-text"
        aria-label="Same words. Different voice."
      >
        <span className="scene-line-mask" aria-hidden="true">
          <span className="scene-line-inner">Same words.</span>
        </span>
        <span className="scene-line-mask" aria-hidden="true">
          <span className="scene-line-inner">Different voice.</span>
        </span>
      </h2>
      <p>
        Keep the words and palette fixed.{" "}
        <span className="requires-script">
          Switch the type treatment to compare weight, spacing and serif
          contrast.
        </span>
      </p>
    </>
  );
});

export default function TypeLab() {
  const [preset, setPreset] = useState<Preset>("direct");
  const [showGrid, setShowGrid] = useState(false);
  const reduce = usePortfolioReducedMotion();
  const composition = useAnimationControls();

  function selectPreset(next: Preset) {
    if (preset === next) return;
    // State, accessible naming and selected buttons update immediately.
    // A cancelled visual transition cannot lose the user's selection.
    setPreset(next);
    void composition.start(
      reduce
        ? {
            opacity: [0.82, 1],
            y: 0,
            transition: { duration: 0.19, ease: easeOut },
          }
        : {
            opacity: [0.58, 1],
            y: [5, 0],
            transition: { duration: 0.3, ease: easeOut },
          },
    );
  }

  return (
    <section
      className="playground-section"
      id="playground"
      aria-labelledby="playground-heading"
    >
      <div className="section-shell playground-layout">
        <div className="playground-copy reveal">
          <LabHeading />
          <div className="play-controls" data-motion-owner="react">
            <fieldset>
              <legend>Choose a voice</legend>
              <div
                className="type-options"
                role="group"
                aria-label="Typography voice"
              >
                {presetKeys.map((key) => (
                  <motion.button
                    key={key}
                    className={`type-choice${preset === key ? " is-selected" : ""}`}
                    type="button"
                    data-type={key}
                    aria-pressed={preset === key}
                    onClick={() => selectPreset(key)}
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    whileFocus={reduce ? undefined : { y: -2 }}
                    transition={spring}
                  >
                    {presets[key].name}
                  </motion.button>
                ))}
              </div>
            </fieldset>
            <p className="type-description" id="type-description">
              {presets[preset].description}
            </p>
            <motion.button
              className="grid-toggle"
              type="button"
              aria-pressed={showGrid}
              onClick={() => setShowGrid((shown) => !shown)}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              whileFocus={reduce ? undefined : { y: -2 }}
              transition={spring}
            >
              <span className="grid-checkbox" aria-hidden="true" />
              Show the composition grid
            </motion.button>
            <p className="grid-help">
              Use the overlay to compare spacing and alignment.
            </p>
          </div>
        </div>
        <div
          className={`playground-board${showGrid ? " show-grid" : ""}`}
          role="img"
          data-palette="green"
          data-type={preset}
          aria-label={`Form. Feeling. An interactive type study in the ${presets[preset].name} style`}
        >
          <motion.div
            className="lab-grid"
            aria-hidden="true"
            initial={false}
            animate={{ opacity: showGrid ? 0.14 : 0 }}
            transition={{ duration: reduce ? 0.18 : 0.3, ease: easeOut }}
            style={{ transition: "none" }}
          />
          <div className="lab-meta">
            <span>A study in type.</span>
            <span aria-hidden="true">if.</span>
          </div>
          <motion.div
            className="lab-composition"
            initial={false}
            animate={composition}
          >
            <span>Form.</span>
            <span>Feeling.</span>
            <div className="lab-orbit" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </motion.div>
          <div className="lab-footer">
            <span>Good design is a conversation.</span>
            <span>#25A36F</span>
          </div>
        </div>
        <p className="sr-only" id="lab-status" aria-live="polite">
          {presets[preset].name} typography. The words, artwork and green
          palette stay the same. Composition grid{" "}
          {showGrid ? "visible." : "hidden."}
        </p>
      </div>
    </section>
  );
}
