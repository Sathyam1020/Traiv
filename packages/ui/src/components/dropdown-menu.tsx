"use client";
import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import * as W from "./wensity/dropdown-menu";
import { cn } from "@traiv/ui/lib/cn";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "./wensity/dropdown-menu";
export const DropdownMenuPortal = Menu.Portal;
export function DropdownMenuContent(props: W.DropdownMenuContentProps) {
  return <W.DropdownMenuContent {...props} data-slot="dropdown-menu-content" />;
}
type ItemProps = Omit<W.DropdownMenuItemProps, "onSelect"> & {
  onSelect?: (event: Event) => void;
  variant?: "default" | "destructive";
  inset?: boolean;
  asChild?: boolean;
};
export function DropdownMenuItem({
  onSelect,
  onClick,
  variant,
  inset,
  asChild,
  children,
  className,
  ...props
}: ItemProps) {
  return (
    <W.DropdownMenuItem
      {...props}
      render={asChild && React.isValidElement(children) ? children : undefined}
      destructive={variant === "destructive"}
      className={cn(inset && "pl-8", className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const selection = new Event("select", { cancelable: true });
        onSelect?.(selection);
        if (selection.defaultPrevented) event.preventDefault();
      }}
    >
      {asChild ? undefined : children}
    </W.DropdownMenuItem>
  );
}
export function DropdownMenuLabel({
  inset,
  className,
  ...props
}: React.ComponentProps<typeof W.DropdownMenuLabel> & { inset?: boolean }) {
  return <W.DropdownMenuLabel {...props} className={cn(inset && "pl-8", className)} />;
}
export function DropdownMenuSubTrigger({
  inset,
  className,
  ...props
}: React.ComponentProps<typeof W.DropdownMenuSubTrigger> & { inset?: boolean }) {
  return <W.DropdownMenuSubTrigger {...props} className={cn(inset && "pl-8", className)} />;
}
export function DropdownMenuCheckboxItem({
  checked,
  ...props
}: Omit<React.ComponentProps<typeof W.DropdownMenuCheckboxItem>, "checked"> & {
  checked?: boolean | "indeterminate";
}) {
  return <W.DropdownMenuCheckboxItem {...props} checked={checked === true} />;
}
export const DropdownMenuRadioItem = W.DropdownMenuRadioItem;
