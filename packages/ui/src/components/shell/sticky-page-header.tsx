import { cn } from "@traiv/ui/lib/cn";
import type { ComponentProps } from "react";

/** Pins a Page's title and toolbar together inside the shell's scrolling panel. */
export function StickyPageHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-traiv-page-header=""
      className={cn(
        "sticky top-0 z-20 -mx-4 -mt-5 flex shrink-0 flex-col gap-5 border-b border-line bg-panel px-4 pt-5 pb-4 sm:-mx-6 sm:px-6",
        className,
      )}
      {...props}
    />
  );
}
