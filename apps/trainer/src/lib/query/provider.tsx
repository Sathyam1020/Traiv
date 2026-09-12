"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Above zero so a server-rendered page doesn't refetch the instant it hydrates.
        staleTime: 60_000,
        retry: (failureCount, error) => {
          // Retrying a 401 or a 403 just delays the redirect.
          const status = (error as { status?: number }).status ?? 0;
          if (status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * The client is created per mount, not at module level — a module-level singleton on the
 * server would be shared across concurrent requests, leaking one user's cache into
 * another's response.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(makeQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
