"use client";

import { QueryProvider } from "@/lib/query";
import { UiStoreProvider } from "@/lib/stores";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <UiStoreProvider>{children}</UiStoreProvider>
    </QueryProvider>
  );
}
