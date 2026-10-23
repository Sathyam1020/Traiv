"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

type Sidebar = { collapsed: boolean; toggle: () => void };

const SidebarContext = createContext<Sidebar | null>(null);

const KEY = "traiv.sidebar-collapsed";

/**
 * Whether the rail is showing, shared between the rail and the button that hides it.
 *
 * In the provider rather than in each app's store because it is a property of the shell,
 * not of the app — and because the button lives in a page header while the thing it
 * controls is two components up.
 *
 * The stored value is read in an effect rather than during render. Reading it inline
 * would give the server one answer and the browser another, which is a hydration
 * mismatch; the cost is that a collapsed rail flashes open for a frame on a cold load,
 * which is the cheaper of the two.
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(KEY) === "1") setCollapsed(true);
    } catch {
      // Private windows and blocked site data both throw. A remembered rail is a
      // convenience, not a requirement.
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      try {
        window.localStorage.setItem(KEY, prev ? "0" : "1");
      } catch {
        // As above.
      }
      return !prev;
    });
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>{children}</SidebarContext.Provider>
  );
}

/** Null outside the shell, so a page header can render without one. */
export function useSidebar(): Sidebar | null {
  return useContext(SidebarContext);
}
