import { cn } from "@traiv/ui/lib/cn";
import type * as React from "react";

/**
 * The container every screen sits in.
 *
 * One measure, so a dashboard is the same width in all four apps. Without it each app
 * picked its own — 32rem, 36rem, 44rem — and three of them shipped as a phone column
 * stranded in the middle of a desktop.
 *
 * Narrower is still right for a single-task form: a sign-in card or one intake question
 * stretched to 1280px is worse, not better. Those pass their own `className`.
 *
 * It carries the padding too, because the shell's panel deliberately has none: a table
 * and a toolbar run to the panel's edge, and only the content inside them is inset.
 */
export function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-[1280px] flex-col px-4 py-5 sm:px-6", className)}
      {...props}
    />
  );
}
