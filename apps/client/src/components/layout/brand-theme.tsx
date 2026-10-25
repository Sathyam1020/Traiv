"use client";

import { useEffect } from "react";

/**
 * The coach's brand colour, applied to the client app.
 *
 * `design-system.md` › Theming is the whole specification: branding overrides the
 * **signal group only** — never the action, text, surface or border tokens — because a
 * coach picking a bad brand colour must not be able to make the app unreadable.
 *
 * Coachway's client does the same thing with `bg-custom-primary`, and solves the
 * readability problem the same way: they compute a text colour from the brand colour
 * (`getTextColor(themeColors.primary)`) rather than assuming white. So does this.
 */

/** Relative luminance, sRGB, per WCAG. Not a brightness average — those get greens wrong. */
function luminance(hex: string): number | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m?.[1]) return null;

  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };

  const int = Number.parseInt(m[1], 16);
  const [r, g, b] = [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * 0.45 rather than the midpoint.
 *
 * White text wins ties: most brand colours a coach picks are mid-saturation and read
 * better light-on-dark, and the failure is asymmetric — dark text on a mid blue is
 * unreadable where white on a mid blue is merely unfashionable.
 */
const LIGHT_TEXT_BELOW = 0.45;

export function BrandTheme({ color }: { color: string | null | undefined }) {
  useEffect(() => {
    const root = document.documentElement;
    const lum = color ? luminance(color) : null;

    // No colour, or one we could not parse: leave the violet default in place rather
    // than applying half a theme.
    if (!color || lum === null) {
      for (const p of ["--signal", "--signal-text", "--signal-subtle", "--signal-fg"]) {
        root.style.removeProperty(p);
      }
      return;
    }

    root.style.setProperty("--signal", color);
    // `signal-text` is the brand colour used *as* text, on a normal surface — so it
    // stays the brand colour. `signal-fg` is the opposite: text on top of a fill.
    root.style.setProperty("--signal-text", color);
    root.style.setProperty("--signal-subtle", `color-mix(in srgb, ${color} 12%, transparent)`);
    root.style.setProperty("--signal-fg", lum < LIGHT_TEXT_BELOW ? "#ffffff" : "#15161a");

    return () => {
      for (const p of ["--signal", "--signal-text", "--signal-subtle", "--signal-fg"]) {
        root.style.removeProperty(p);
      }
    };
  }, [color]);

  return null;
}
