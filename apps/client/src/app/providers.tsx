"use client";

import { Toaster } from "@traiv/ui/components/sonner";
import { QueryProvider } from "@/lib/query";
import { UiStoreProvider, useUiStore } from "@/lib/stores";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <UiStoreProvider>
        {children}
        <ThemedToaster />
      </UiStoreProvider>
    </QueryProvider>
  );
}

/**
 * Inside the store provider, because the toast surface has to follow the same theme as
 * everything it appears over — and this project's theme is a class on the root element,
 * not something a library can read for itself.
 */
function ThemedToaster() {
  const theme = useUiStore((s) => s.theme);
  return <Toaster theme={theme} />;
}
