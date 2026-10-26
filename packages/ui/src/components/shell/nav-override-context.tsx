"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

type NavOverride = { href: string | null; setHref: (href: string | null) => void };

const NavOverrideContext = createContext<NavOverride | null>(null);

/**
 * Lets a screen whose route does not say which rail section it belongs to borrow
 * another one's highlight — the workout builder lives at `/templates/:id` even for a
 * client's own programme, which belongs under Clients, not Templates.
 */
export function NavOverrideProvider({ children }: { children: ReactNode }) {
  const [href, setHref] = useState<string | null>(null);
  return (
    <NavOverrideContext.Provider value={{ href, setHref }}>{children}</NavOverrideContext.Provider>
  );
}

/** Read by the rail: the href to treat as active instead of matching the URL, if any. */
export function useNavOverride(): string | null {
  return useContext(NavOverrideContext)?.href ?? null;
}

/**
 * Declares which rail item should light up while this component is mounted. Pass
 * `null` (the default case) to leave ordinary pathname matching alone — only call this
 * with a real href when the route itself cannot say which section the screen belongs to.
 */
export function useActiveNav(href: string | null) {
  const ctx = useContext(NavOverrideContext);
  useEffect(() => {
    if (!ctx || !href) return;
    ctx.setHref(href);
    return () => ctx.setHref(null);
  }, [ctx, href]);
}
