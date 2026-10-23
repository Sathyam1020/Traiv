"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ClientProfile, Roster, RosterParams, RosterStatus, Tag } from "@/lib/api";
import { rosterApi } from "@/lib/api";
import { queryKeys } from "./keys";

/**
 * The roster, and the writes that change it.
 *
 * `keepPreviousData` on the list: changing a tab, a chip or a page would otherwise blank
 * the table and collapse the card while the next page loads, so the whole screen jumps.
 * Holding the old rows until the new ones arrive is what makes filtering feel instant.
 *
 * The list is five queries against a database on another continent — about a second and
 * a half. So two things matter more here than they would against a local database: the
 * answer is kept fresh for a while rather than re-fetched every time a component mounts,
 * and a write patches the rows it already knows the answer for instead of throwing the
 * whole list away. Invalidating everything after a tag toggle is what made the screen
 * feel slow: the chip was correct instantly and then the table sat still for a second.
 */
const ROSTER_FRESH = 30_000;
const TAGS_FRESH = 300_000;

export function useRoster(studioId: string | null, params: RosterParams) {
  return useQuery({
    queryKey: queryKeys.roster.list(studioId ?? "", params as unknown as Record<string, unknown>),
    queryFn: () => rosterApi.list(studioId as string, params),
    enabled: Boolean(studioId),
    placeholderData: keepPreviousData,
    staleTime: ROSTER_FRESH,
  });
}

/** One client, for their own screen. */
export function useClient(studioId: string | null, clientId: string) {
  return useQuery({
    queryKey: queryKeys.client.one(studioId ?? "", clientId),
    queryFn: () => rosterApi.get(studioId as string, clientId),
    enabled: Boolean(studioId && clientId),
    staleTime: ROSTER_FRESH,
  });
}

export function useTags(studioId: string | null) {
  return useQuery({
    queryKey: queryKeys.roster.tags(studioId ?? ""),
    queryFn: () => rosterApi.tags(studioId as string),
    enabled: Boolean(studioId),
    staleTime: TAGS_FRESH,
  });
}

/* -------------------------------------------------------------------------- */

/**
 * Every cached page of this studio's roster.
 *
 * The tags key is `["roster", "tags", studioId]` and a list key is
 * `["roster", studioId, params]`, so prefixing on the studio id matches the lists and
 * only the lists — a studio id is a uuid and can never be the string "tags".
 */
function rosterLists(studioId: string | null) {
  return { queryKey: ["roster", studioId ?? ""] as const };
}

/** Rewrites one client across every cached page, leaving the rest of each page alone. */
function patchClient(
  entries: [readonly unknown[], Roster | undefined][],
  clientId: string,
  patch: (client: Roster["clients"][number]) => Roster["clients"][number],
) {
  return entries.map(([key, roster]) => {
    if (!roster) return [key, roster] as const;
    return [
      key,
      {
        ...roster,
        clients: roster.clients.map((c) => (c.id === clientId ? patch(c) : c)),
      },
    ] as const;
  });
}

export function useUpdateClient(studioId: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: { clientId: string; status?: RosterStatus; endsAt?: string | null }) =>
      rosterApi.update(studioId as string, args.clientId, {
        ...(args.status ? { status: args.status } : {}),
        ...("endsAt" in args ? { endsAt: args.endsAt } : {}),
      }),

    // The badge and the end date flip immediately; the refetch below is what moves the
    // row between tabs and corrects the counts, and it happens underneath.
    onMutate: ({ clientId, status, endsAt }) => {
      const before = qc.getQueriesData<Roster>(rosterLists(studioId));
      for (const [key, roster] of patchClient([...before], clientId, (c) => ({
        ...c,
        ...(status ? { status } : {}),
        ...(endsAt !== undefined ? { endsAt } : {}),
      }))) {
        qc.setQueryData(key, roster);
      }
      return { before };
    },

    onError: (_err, _args, ctx) => {
      for (const [key, roster] of ctx?.before ?? []) qc.setQueryData(key, roster);
    },

    // A status change moves a client between tabs, so the counts in the header are
    // stale too, not only the row — and so is the client's own screen if it is open.
    onSettled: () => {
      void qc.invalidateQueries(rosterLists(studioId));
      void qc.invalidateQueries({ queryKey: queryKeys.client.all(studioId ?? "") });
    },
  });
}

export function useSetClientTags(studioId: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (args: { clientId: string; tagIds: string[] }) =>
      rosterApi.setTags(studioId as string, args.clientId, args.tagIds),

    onMutate: ({ clientId, tagIds }) => {
      const before = qc.getQueriesData<Roster>(rosterLists(studioId));
      const known = qc.getQueryData<Tag[]>(queryKeys.roster.tags(studioId ?? "")) ?? [];
      // Ordered by the tag list rather than by click order, so a chip does not jump
      // position the moment the server confirms it.
      const next = known.filter((t) => tagIds.includes(t.id));

      for (const [key, roster] of patchClient([...before], clientId, (c) => ({
        ...c,
        tags: next,
      }))) {
        qc.setQueryData(key, roster);
      }
      return { before };
    },

    onError: (_err, _args, ctx) => {
      for (const [key, roster] of ctx?.before ?? []) qc.setQueryData(key, roster);
    },

    // Tags are not in any count, so the server's answer replaces the guess and no list
    // has to be re-read. The client's own screen is a different shape, so it is written
    // rather than patched through `patchClient`.
    onSuccess: (tags, { clientId }) => {
      const current = qc.getQueriesData<Roster>(rosterLists(studioId));
      for (const [key, roster] of patchClient([...current], clientId, (c) => ({ ...c, tags }))) {
        qc.setQueryData(key, roster);
      }
      qc.setQueryData<ClientProfile>(queryKeys.client.one(studioId ?? "", clientId), (p) =>
        p ? { ...p, tags } : p,
      );
    },
  });
}

export function useCreateTag(studioId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { name: string; description?: string | null; color: string }) =>
      rosterApi.createTag(studioId as string, args),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.roster.tags(studioId ?? "") });
    },
  });
}

/**
 * Deleting a tag removes it from every client who had it, so the rows have to lose it
 * too — and they lose it here rather than after a refetch, or the chip sits on the row
 * for a second after the coach confirmed it was gone.
 */
export function useDeleteTag(studioId: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => rosterApi.deleteTag(studioId as string, tagId),

    onMutate: (tagId) => {
      const tagsKey = queryKeys.roster.tags(studioId ?? "");
      const beforeTags = qc.getQueryData<Tag[]>(tagsKey);
      const before = qc.getQueriesData<Roster>(rosterLists(studioId));

      qc.setQueryData<Tag[]>(tagsKey, (tags) => tags?.filter((t) => t.id !== tagId));
      for (const [key, roster] of before) {
        if (!roster) continue;
        qc.setQueryData<Roster>(key, {
          ...roster,
          clients: roster.clients.map((c) => ({
            ...c,
            tags: c.tags.filter((t) => t.id !== tagId),
          })),
        });
      }
      qc.setQueriesData<ClientProfile>({ queryKey: queryKeys.client.all(studioId ?? "") }, (p) =>
        p ? { ...p, tags: p.tags.filter((t) => t.id !== tagId) } : p,
      );

      return { before, beforeTags, tagsKey };
    },

    onError: (_err, _tagId, ctx) => {
      if (ctx) qc.setQueryData(ctx.tagsKey, ctx.beforeTags);
      for (const [key, roster] of ctx?.before ?? []) qc.setQueryData(key, roster);
    },
  });
}
