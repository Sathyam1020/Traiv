"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import { createUiStore, storedTheme, type UiStore } from "@/lib/stores/ui-store";

type Store = ReturnType<typeof createUiStore>;

const UiStoreContext = createContext<Store | undefined>(undefined);

export function UiStoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => createUiStore());

  // Server and first client render must agree, so the saved theme is applied after
  // mount rather than during render — otherwise React reports a hydration mismatch.
  useEffect(() => {
    store.getState().setTheme(storedTheme());
  }, [store]);

  return <UiStoreContext.Provider value={store}>{children}</UiStoreContext.Provider>;
}

export function useUiStore<T>(selector: (state: UiStore) => T): T {
  const store = useContext(UiStoreContext);
  if (!store) throw new Error("useUiStore must be used inside UiStoreProvider");
  return useStore(store, selector);
}
