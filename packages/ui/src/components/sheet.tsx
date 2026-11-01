"use client";
import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import * as W from "./wensity/sheet";
import { cn } from "@traiv/ui/lib/cn";
export {
  SheetTrigger,
  SheetClose,
  SheetOverlay,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./wensity/sheet";
export const SheetPortal = BaseDialog.Portal;
type DismissEvent = { preventDefault: () => void; defaultPrevented: boolean };
const Outside = React.createContext<React.RefObject<
  ((event: DismissEvent) => void) | undefined
> | null>(null);
export function Sheet({ onOpenChange, persistent, ...props }: W.SheetProps) {
  const outside = React.useRef<((event: DismissEvent) => void) | undefined>(undefined);
  return (
    <Outside.Provider value={outside}>
      <BaseDialog.Root
        {...props}
        disablePointerDismissal={persistent}
        onOpenChange={(open, details) => {
          if (!open && details.reason === "outside-press") {
            const e = {
              defaultPrevented: false,
              preventDefault() {
                this.defaultPrevented = true;
              },
            };
            outside.current?.(e);
            if (e.defaultPrevented) {
              details.cancel();
              return;
            }
          }
          onOpenChange?.(open);
        }}
      />
    </Outside.Provider>
  );
}
export function SheetContent({
  showCloseButton = true,
  onInteractOutside,
  onPointerDownOutside,
  className,
  side = "right",
  ...props
}: W.SheetContentProps & {
  showCloseButton?: boolean;
  onInteractOutside?: (event: DismissEvent) => void;
  onPointerDownOutside?: (event: DismissEvent) => void;
}) {
  const outside = React.useContext(Outside);
  React.useLayoutEffect(() => {
    if (outside)
      outside.current = (event) => {
        onInteractOutside?.(event);
        onPointerDownOutside?.(event);
      };
    return () => {
      if (outside) outside.current = undefined;
    };
  }, [outside, onInteractOutside, onPointerDownOutside]);
  return (
    <W.SheetContent
      {...props}
      side={side}
      showClose={showCloseButton}
      className={cn(
        "flex flex-col gap-4",
        side === "right" || side === "left" ? "w-3/4 sm:max-w-sm" : "",
        side === "right" && "rounded-l-3xl",
        className,
      )}
    />
  );
}
