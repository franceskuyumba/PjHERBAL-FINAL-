"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface AnimatedRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  once?: boolean;
}

/**
 * Lightweight scroll-reveal wrapper. Respects prefers-reduced-motion.
 */
export function AnimatedReveal({
  children,
  delay = 0,
  className,
  y = 24,
  once = true,
}: AnimatedRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.65, 0.31, 1] }}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
