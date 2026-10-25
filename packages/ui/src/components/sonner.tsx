"use client";

import { CircleCheck, Info, Loader, OctagonX, TriangleAlert } from "@traiv/ui/icons";
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
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <OctagonX className="size-4" />,
        loading: <Loader className="size-4 animate-spin" />,
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
