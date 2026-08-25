"use client";

import { motion, useReducedMotion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Section 6.4: fade/slide-up scroll reveal, staggered for grids, respects
 * prefers-reduced-motion everywhere Framer Motion is used.
 *
 * `above` = content guaranteed to already be in the initial viewport (a
 * hero, a form above the fold). It animates unconditionally on mount via
 * `animate`, never `whileInView` — `whileInView`'s IntersectionObserver
 * has no synchronous "already on screen" check, so on an idle page (no
 * scroll event to force the observer's first callback) content wrapped
 * in `whileInView` can stay hidden indefinitely. That's a correctness bug
 * for above-the-fold content, not a below-the-fold one.
 *
 * Below-the-fold content (`above` unset) keeps `whileInView`, but adds a
 * synchronous `getBoundingClientRect()` check on mount so an element that
 * happens to already be in view (e.g. a short page, a tall viewport)
 * resolves immediately instead of waiting on the observer.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Component = "div",
  above = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
  above?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const inViewNow = useInView(ref, { once: true, margin: "-80px" });
  const [alreadyVisible, setAlreadyVisible] = useState(false);

  useEffect(() => {
    if (above || alreadyVisible || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setAlreadyVisible(true);
    }
  }, [above, alreadyVisible]);

  const variants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

  const MotionComponent = Component === "li" ? motion.li : motion.div;
  const transition = { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (above) {
    return (
      <MotionComponent
        ref={ref}
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={transition}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial="hidden"
      animate={inViewNow || alreadyVisible ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
    >
      {children}
    </MotionComponent>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        staggerChildren: shouldReduceMotion ? 0 : stagger,
      }}
    >
      {children}
    </motion.div>
  );
}
