"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { track, trackExit, trackPageview } from "@/lib/analytics";

/**
 * Mounted once in the layout. Sends a pageview per route, how far down each page people
 * got, and how long they stayed.
 *
 * Scroll depth is sent as the four quarters rather than a continuous number: a scroll
 * handler that posts every pixel is both useless and a battery drain, and "did they
 * reach the pricing section" is the only question anybody actually asks of it.
 *
 * The exit event fires on `pagehide`, not on `beforeunload` — Safari on iOS never fires
 * `beforeunload` when an app is backgrounded, which is most of how a phone leaves a
 * page, so a tracker built on it simply loses mobile.
 */
export function Analytics() {
  const pathname = usePathname();
  const openedAt = useRef(Date.now());
  const deepest = useRef(0);

  // Re-runs on every path change, which is exactly the point: one pageview per route.
  useEffect(() => {
    openedAt.current = Date.now();
    deepest.current = 0;
    trackPageview();
  }, [pathname]);

  useEffect(() => {
    const marks = [25, 50, 75, 100];
    const seen = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // A page shorter than the viewport has nothing to scroll; counting it as 100%
      // would make every short page look like the most engaging one on the site.
      if (scrollable <= 0) return;

      const pct = Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100);
      deepest.current = Math.max(deepest.current, Math.min(pct, 100));

      for (const m of marks) {
        if (deepest.current >= m && !seen.has(m)) {
          seen.add(m);
          track("scroll", { depth: m });
        }
      }
    };

    const onHide = () => {
      trackExit(window.location.pathname, Date.now() - openedAt.current, deepest.current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);

  return null;
}
