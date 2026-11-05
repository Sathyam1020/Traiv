import { cn } from "@traiv/ui/lib/cn";
import type { ComponentProps } from "react";

/** A page-owned action row. Its sibling scroller must use client-action-scroll.
 * Food screens own their full viewport; AppShell must not reserve navigation space again.
 */
export function ClientActionBar({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("client-action-bar", className)} />;
}
