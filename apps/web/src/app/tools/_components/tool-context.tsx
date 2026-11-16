"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { ToolGroup, ToolKind } from "@/content/tools/types";

/** Which tool a widget is running inside, so widgets never hard-code their own slug. */
type ToolIdentity = { slug: string; group: ToolGroup; kind: ToolKind; embedded?: boolean };

const Ctx = createContext<ToolIdentity | null>(null);

export function ToolProvider({ value, children }: { value: ToolIdentity; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTool(): ToolIdentity {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTool must be used inside a ToolProvider");
  return v;
}
