"use client";

import { usePortfolioReducedMotion } from "@/components/MotionProvider";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Optional inner-content feedback for React-owned controls. A parent using
 * this component must have data-motion-owner="react" so the original native
 * interaction adapter does not also animate the same control.
 */
export default function MotionButtonContent({
  children,
}: {
  children: ReactNode;
}) {
  const reduce = usePortfolioReducedMotion();
  return (
    <motion.span
      data-motion-owner="react"
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 440, damping: 34, mass: 0.7 }}
    >
      {children}
    </motion.span>
  );
}
