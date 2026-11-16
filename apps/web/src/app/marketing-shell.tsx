"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { RPE_EMBED_PATH } from "@/content/tools/embed";

export function MarketingShell({
  children,
  before,
  after,
}: {
  children: ReactNode;
  before: ReactNode;
  after: ReactNode;
}) {
  const embedded = usePathname() === RPE_EMBED_PATH;
  return (
    <>
      {!embedded && before}
      <main id="main-content" tabIndex={-1} className={embedded ? undefined : "pt-20 sm:pt-24"}>
        {children}
      </main>
      {!embedded && after}
    </>
  );
}
