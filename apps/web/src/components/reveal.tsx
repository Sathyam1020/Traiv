import type { ElementType, ReactNode } from "react";
/** Visible server content; motion is progressive CSS enhancement, never a JS gate. */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}) {
  return <Tag className={className}>{children}</Tag>;
}
