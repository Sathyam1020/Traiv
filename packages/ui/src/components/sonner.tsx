"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * shadcn's sonner component, with one change.
 *
 * The generated version reads the theme from `next-themes`. This project does not use it
 * — the theme lives in a per-app zustand store that toggles `.dark` on the root element
 * — so the theme arrives as a prop instead. Two theme systems disagreeing is worse than
 * passing one value down.
 *
 * Colours come from our own tokens, so a toast matches the surface it appears over in
 * both themes without a second palette.
 */
function Toaster({ theme = "light", ...props }: ToasterProps) {
  return (
    <Sonner
      theme={theme}
      position="bottom-center"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-surface)",
          "--normal-text": "var(--color-fg)",
          "--normal-border": "var(--color-line)",
          "--border-radius": "var(--radius-surface)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { toast } from "sonner";
export { Toaster };
