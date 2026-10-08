import type { ClassValue } from "cn";
import { createCn } from "cn/config";

/**
 * The class merger, taught this repo's type scale.
 *
 * ## Why this file exists
 *
 * `cn` resolves conflicts by sorting every class into a group, and it only knows
 * Tailwind's own scales. `text-sm` is obviously a font size; `text-body-sm` is not
 * obviously anything, so it is filed under **text colour** — and the merge then throws
 * away the real colour sitting next to it:
 *
 * ```
 * cn("bg-primary text-primary-foreground", "text-body-sm")
 * //   → "bg-primary text-body-sm"      the colour is gone
 * ```
 *
 * Which is how every primary button that took a `text-body-sm` className rendered as a
 * black rectangle with black text on it. Nothing errored, nothing warned: one class was
 * silently dropped and the button inherited `color` from the page.
 *
 * Naming the nine custom sizes here fixes it everywhere at once. `--text-*` in
 * `globals.css` is the source of truth; **add a size there and add it here**, or the
 * next component to use it loses its colour the same way.
 */
// Annotated rather than inferred: the inferred type names `CnFunction` from inside
// the package, which TypeScript will not emit a portable declaration for.
export const cn: (...inputs: ClassValue[]) => string = createCn({
  extend: {
    classGroups: {
      // `--text-*`
      "font-size": [
        {
          text: [
            "caption",
            "body-sm",
            "label",
            "body",
            "subheading",
            "heading",
            "display",
            "hero-sm",
            "hero",
          ],
        },
      ],
      // `--radius-*`. The same failure in a different property: `rounded-control` was
      // not recognised as a radius, so it could not replace the `rounded-sm` a shadcn
      // component had already set — both survived and the stylesheet decided, which is
      // why some menu items were pill-shaped on hover and others were not.
      rounded: [{ rounded: ["control", "surface", "panel"] }],
      // `--font-display`
      "font-family": [{ font: ["display"] }],
      // `--ease-*`
      ease: [{ ease: ["standard", "out-soft", "in-soft"] }],
    },
  },
});
