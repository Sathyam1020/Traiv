"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * A number that counts to itself when it arrives.
 *
 * Used only where the number *is* the argument — the price gap on the slider, the
 * figures in the hero. Everywhere else a number that animates is a number that is
 * briefly wrong, and a reader who looks away mid-count has been shown a lie.
 *
 * `useReducedMotion` short-circuits the whole thing to the final value rather than
 * animating faster, which is what the preference actually asks for.
 */
export function CountUp({
  to,
  duration = 1.1,
  format = (n: number) => Math.round(n).toLocaleString("en-IN"),
  className,
}: {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(to);

  useEffect(() => {
    if (reduced) {
      setShown(to);
      return;
    }
    if (!inView) return;

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduced]);

  // Rendered with the final value on the server, so the page is correct before any of
  // this runs and a crawler never sees a zero.
  return (
    <span ref={ref} className={className}>
      {format(shown)}
    </span>
  );
}
