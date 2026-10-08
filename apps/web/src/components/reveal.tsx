"use client";

import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

type Direction = "up" | "left" | "right" | "scale";

const DIRECTION: Record<Direction, string> = {
  up: "",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

/**
 * Fade a section in once, as it arrives.
 *
 * One observer per element, disconnected the moment it fires — a reveal that can
 * re-trigger makes a page flicker as somebody scrolls back up, which reads as a bug
 * rather than as polish.
 *
 * The hidden state lives in CSS behind `[data-js]` (see marketing.css), so this
 * component only ever *adds* a class. With no JavaScript the content is visible, which
 * is the part that matters for a page whose job is to be read.
 */
export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  direction?: Direction;
  /** Milliseconds. Used to stagger siblings; keep the whole run under about 300ms. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already past it on load — a deep link, or a reload halfway down the page. Show it
    // immediately rather than waiting for a scroll that may never come.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      // Fire a little before the element's edge, so it is finished by the time it is
      // properly on screen rather than animating under the reader's eye.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${DIRECTION[direction]} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
