"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/** Native disclosure works without JS; enhancement closes it after navigation. */
export function MobileMenu({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) setOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        setOpen(false);
        menu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  return (
    <details
      ref={menu}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="mobile-menu"
    >
      <summary aria-label="Open navigation">
        <span />
        <span />
      </summary>
      <nav
        aria-label="Mobile navigation"
        onClickCapture={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
        }}
      >
        {children}
      </nav>
    </details>
  );
}
