"use client";

import { MutationCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { mutationFeedback } from "@traiv/ui/lib/action-feedback";
import { useState } from "react";
import { idbPersister, PERSIST_BUSTER, PERSIST_MAX_AGE, shouldPersistQuery } from "./persist";

function makeQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) =>
        mutationFeedback(mutation.meta, "success"),
      onError: (error, _variables, _context, mutation) =>
        mutationFeedback(mutation.meta, "error", error),
    }),
    defaultOptions: {
      queries: {
        // Above zero so a server-rendered page doesn't refetch the instant it hydrates.
        staleTime: 60_000,
        // Must be at least PERSIST_MAX_AGE, or in-memory garbage collection discards a
        // query before there's ever a reason to persist it — a documented gotcha, not
        // an arbitrary number. See .ai/engineering/dependencies.md.
        gcTime: PERSIST_MAX_AGE,
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
  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister: idbPersister,
        maxAge: PERSIST_MAX_AGE,
        buster: PERSIST_BUSTER,
        dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery },
      }}
      onSuccess={() => client.resumePausedMutations()}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
