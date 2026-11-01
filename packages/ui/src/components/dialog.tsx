"use client";
import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import * as W from "./wensity/dialog";
import { Button } from "./button";
import { cn } from "@traiv/ui/lib/cn";
export {
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./wensity/dialog";
type DismissEvent = { preventDefault: () => void; defaultPrevented: boolean };
const Outside = React.createContext<React.RefObject<
  ((event: DismissEvent) => void) | undefined
> | null>(null);
export function Dialog({ onOpenChange, ...props }: React.ComponentProps<typeof W.Dialog>) {
  const outside = React.useRef<((event: DismissEvent) => void) | undefined>(undefined);
  return (
    <Outside.Provider value={outside}>
      <BaseDialog.Root
        {...props}
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
export function DialogContent({
  showCloseButton = true,
  onInteractOutside,
  onPointerDownOutside,
  className,
  ...props
}: W.DialogContentProps & {
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
    <W.DialogContent {...props} showClose={showCloseButton} className={cn("p-6", className)} />
  );
}
export function DialogFooter({
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<typeof W.DialogFooter> & { showCloseButton?: boolean }) {
  return (
    <W.DialogFooter {...props}>
      {children}
      {showCloseButton ? (
        <W.DialogClose asChild>
          <Button variant="outline">Close</Button>
        </W.DialogClose>
      ) : null}
    </W.DialogFooter>
  );
}
