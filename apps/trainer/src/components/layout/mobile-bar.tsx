"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/layout/nav-items";

/** `ease.spring` from spacing.md — spring(mass 1, stiffness 90, damping 14). */
const SPRING = { type: "spring", mass: 1, stiffness: 90, damping: 14 } as const;

/**
 * Mobile navigation — a floating glass capsule, the iOS 26 tab bar.
 *
 * This is the one place in the product where a translucent blurred surface is allowed.
 * `ui-principles.md` bans glassmorphism as decoration; here it is functional: the bar
 * sits over scrolling content and the blur is what keeps the labels legible while
 * letting the page show through. Nothing else gets this treatment.
 *
 * Icons carry the tabs on their own. At two or three destinations the icons are already
 * unambiguous, and dropping the labels is what lets the bar shrink to something that
 * floats rather than spans — the shape Apple's own tab bar takes. The label survives as
 * `aria-label`, so the bar reads the same to a screen reader as it did with text.
 *
 * The selected chip is ONE element shared across tabs via `layoutId`, so Motion moves it
 * between them instead of cross-fading two separate chips — that travel is the whole
 * point of the effect. Two details this depends on: `borderRadius` has to come from
 * `style` rather than a class, or Motion can't correct the capsule's distortion as it
 * stretches, and the spring lives on the element being animated *to*.
 */
export function MobileBar() {
  const pathname = usePathname();
  // Motion does not read prefers-reduced-motion on its own — the CSS reset in
  // globals.css only reaches CSS transitions, not this. spacing.md makes it mandatory.
  const reduce = useReducedMotion();

  return (
    <nav
      // Lifts clear of the iPhone home indicator; resolves to a plain 16px elsewhere.
      className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4 lg:hidden"
    >
      <div className="flex items-center gap-1 rounded-full border border-line bg-surface/60 p-1 shadow-lg backdrop-blur-2xl backdrop-saturate-150">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-11 cursor-pointer px-8 items-center justify-center rounded-full transition-colors duration-100 ${
                active ? "text-brand-text" : "text-fg-muted"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="mobile-tab-chip"
                  // Must be style, not a class — Motion corrects the radius mid-travel.
                  style={{ borderRadius: 9999 }}
                  transition={reduce ? { duration: 0 } : SPRING}
                  className="absolute inset-0 bg-selected"
                />
              )}
              <Icon className="relative size-5 shrink-0" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
