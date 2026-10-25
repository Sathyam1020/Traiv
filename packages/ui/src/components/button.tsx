import { cn } from "@traiv/ui/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

/**
 * Every size grows on a touch screen.
 *
 * `ui-principles.md` §4 asks for 44×44 tap targets and shadcn's defaults are 36 — on a
 * phone that is the difference between hitting the button and hitting the one under it,
 * and it is invisible on the desktop where the components get built.
 *
 * Keyed to `pointer-coarse` rather than to a width, because width is the wrong question:
 * a phone held sideways is 844px and still a thumb, a touchscreen laptop is 1400px and
 * still a thumb, and a 700px browser window on a desktop is a mouse. `xs` keeps its 24px
 * on purpose — it is for dense affordances inside a row that is itself the tap target.
 *
 * NOTE: `shadcn add` overwrites this file. If the sizes here are bare again, that is
 * why — put them back.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control text-label font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Featurebase's conversion button: white at 92% with charcoal text in the dark
        // theme, inverting to charcoal on light. Never a colour — see colors.md.
        default: "bg-primary text-primary-foreground hover:bg-brand-hover",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        // The outlined dark demo button: no fill, a hairline, the label in full white.
        outline: "border border-line-strong bg-transparent text-fg hover:bg-hover",
        secondary: "border border-line bg-raised text-fg hover:bg-raised/80",
        ghost: "text-fg-muted hover:bg-hover hover:text-fg",
        link: "text-brand-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 pointer-coarse:h-11",
        xs: "h-6 gap-1 px-2 text-caption has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 pointer-coarse:h-10",
        lg: "h-10 px-6 has-[>svg]:px-4 pointer-coarse:h-12",
        icon: "size-9 pointer-coarse:size-11",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 pointer-coarse:size-10",
        "icon-lg": "size-10 pointer-coarse:size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
