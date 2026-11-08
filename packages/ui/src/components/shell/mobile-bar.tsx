"use client";

import type { NavItem } from "@traiv/ui/components/shell/app-shell";
import { useNavOverride } from "@traiv/ui/components/shell/nav-override-context";
import { ActiveStateIcon } from "@traiv/ui/components/shell/solid-sidebar-icon";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/** Default shell spring; the client glass selection uses a quicker response. */
const SPRING = { type: "spring", mass: 1, stiffness: 90, damping: 14 } as const;
const GLASS_SPRING = { type: "spring", mass: 0.55, stiffness: 500, damping: 32 } as const;

/**
 * Navigation below `lg` — a floating glass capsule, close to the bottom edge.
 *
 * This is the one place in the product where a translucent blurred surface is allowed.
 * `ui-principles.md` bans glassmorphism as decoration; here it is functional: the bar
 * sits over scrolling content and the blur is what keeps the icons legible while
 * letting the page show through. Nothing else gets this treatment.
 *
 * Icons carry the tabs on their own. At two or three destinations the icons are already
 * unambiguous, and dropping the labels is what lets the bar shrink to something that
 * floats rather than spans — the shape Apple's own tab bar takes. The label survives as
 * `aria-label`, so the bar reads the same to a screen reader as it did with text.
 *
 * The gap to the bottom edge is intentionally tight — just the home-indicator inset plus
 * a few px, not a full visible margin. A bar that floats with daylight under it reads as
 * misplaced; sitting close to the edge is what makes "floating" read as a deliberate
 * dock rather than a mistake.
 *
 * The selected chip is ONE element shared across tabs via `layoutId`, so Motion moves it
 * between them instead of cross-fading two separate chips — that travel is the whole
 * point of the effect. Two details this depends on: `borderRadius` has to come from
 * `style` rather than a class, or Motion can't correct the capsule's distortion as it
 * stretches, and the spring lives on the element being animated *to*.
 */
export function MobileBar({ nav, glass = false }: { nav: readonly NavItem[]; glass?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const current = useNavOverride() ?? pathname;
  // Motion does not read prefers-reduced-motion on its own — the CSS reset in
  // globals.css only reaches CSS transitions, not this. spacing.md makes it mandatory.
  const reduce = useReducedMotion();

  const bar = (
    <nav
      // Tight to the bottom edge — just the home-indicator inset plus a few px, resolving
      // to a plain ~8px elsewhere. The old 1rem+ gap was the actual bug: it read as
      // floating in the wrong place, not as a deliberate dock.
      className={
        glass
          ? "fixed inset-x-0 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4 lg:hidden"
          : "fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4 lg:hidden"
      }
    >
      <div
        className={
          glass
            ? "relative isolate flex w-full max-w-md items-center gap-0.5 rounded-full border border-white/25 p-1.5 backdrop-blur-2xl backdrop-saturate-150 before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/15 before:via-white/0 before:to-white/5 dark:border-white/15"
            : "flex max-w-full items-center gap-1 rounded-full border border-line bg-raised/70 p-1 shadow-float backdrop-blur-2xl backdrop-saturate-150"
        }
        style={
          glass
            ? {
                backgroundColor: "color-mix(in srgb, var(--raised) 60%, transparent)",
                boxShadow:
                  "inset 0 1px 1px rgb(255 255 255 / 0.35), inset 0 -1px 1px rgb(255 255 255 / 0.06), 0 8px 32px rgb(0 0 0 / 0.14)",
                WebkitBackdropFilter: "blur(24px) saturate(170%)",
                backdropFilter: "blur(24px) saturate(170%)",
              }
            : undefined
        }
      >
        {nav.map(({ href, label, icon: Icon, badge }) => {
          const active = current.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={badge ? `${label}, ${badge} unread` : label}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus ${
                active ? "text-signal-text" : "text-fg-muted"
              } ${glass ? "h-14 flex-1 flex-col gap-1 px-1" : nav.length >= 5 ? "h-11 px-5 sm:px-8" : "h-11 px-8"}`}
            >
              {active && (
                <motion.span
                  layoutId="mobile-tab-chip"
                  // Must be style, not a class — Motion corrects the radius mid-travel.
                  style={{ borderRadius: 9999 }}
                  transition={reduce ? { duration: 0 } : glass ? GLASS_SPRING : SPRING}
                  className={
                    glass
                      ? "absolute inset-0 border border-white/10 bg-fg/10 shadow-sm"
                      : "absolute inset-0 bg-selected"
                  }
                />
              )}
              <ActiveStateIcon
                icon={Icon}
                active={active}
                className={glass ? "relative size-6 shrink-0" : "relative size-5 shrink-0"}
              />
              {badge ? (
                <span
                  className="absolute right-2 top-0.5 z-10 flex min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[10px] font-semibold leading-4 text-white"
                  aria-hidden="true"
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
              {glass ? (
                <span className="relative text-[11px] font-medium leading-none">{label}</span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
  // Keep glass navigation above the quick-action backdrop, outside the shell’s
  // fixed stacking context. Ordinary sheets/dialogs still cover it at z-100.
  return glass ? (mounted ? createPortal(bar, document.body) : null) : bar;
}
