import { cn } from "@traiv/ui/lib/cn";
import type * as React from "react";

/**
 * Focus is a border that darkens, not a halo.
 *
 * shadcn ships `ring-[3px] ring-ring/50`, which assumes `--ring` is a muted brand
 * colour. Here it is resolved to near-black (`colors.md`: "there is no brand colour"),
 * so the default produced a heavy grey glow around every field somebody clicked into.
 *
 * The indicator is still there and still meets the bar — the perimeter goes from a
 * light grey to near-black, which is a large contrast change across the whole control.
 * It is just quiet. The same change is in `textarea` and the `select` trigger so every
 * field in a form behaves identically, and it matches what `phone-field` already did.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md pointer-coarse:h-11 border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-line-focus",
        "aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
