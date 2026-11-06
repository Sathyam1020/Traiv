"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@traiv/ui/components/button";
import { type ChatChannel, ChatConversation, type ChatTransport } from "@traiv/ui/components/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import { Search as IconSearch } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import { API_BASE, http } from "@/lib/api/client";
import { useSession } from "@/lib/query";

type Conversation = {
  missingCheckIn: boolean;
  newCheckIn: boolean;
  noContact: boolean;
  tags: { name: string; color: string }[];
  id: string;
  name: string;
  status: string;
  endsAt: string | null;
  unread: number;
  last: null | { body: string; kind: string; createdAt: string };
};
/** `useSearchParams` below requires a Suspense boundary for static prerendering. */
export default function InboxPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 flex-col" />}>
      <InboxPageContent />
    </Suspense>
  );
}

function InboxPageContent() {
  const userId = useSession().data?.user.id ?? "loading";
  const studioId = useActiveStudioId(),
    params = useSearchParams();
  const [selected, setSelected] = useState<string | null>(params.get("client")),
    [channel, setChannel] = useState<ChatChannel>(
      params.get("channel") === "photo" ? "photo" : "chat",
    ),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("active"),
    [filter, setFilter] = useState("all");
  const base = `/studios/${studioId}/inbox`;
  const list = useQuery({
    queryKey: ["inbox", studioId, channel],
    queryFn: async () => (await http.get<Conversation[]>(base, { params: { channel } })).data,
    enabled: Boolean(studioId),
    refetchInterval: 5000,
  });
  const counts = useQuery({
    queryKey: ["inbox-count", studioId],
    queryFn: async () =>
      (await http.get<Conversation[]>(base, { params: { channel: "photo" } })).data,
    enabled: Boolean(studioId),
    refetchInterval: 10000,
  });
  const transport = useMemo<ChatTransport>(
    () => ({
      draftKey: `${userId}:${base}:${selected}`,
      get: async (path) => (await http.get(`${base}/${selected}${path}`, { timeout: 15000 })).data,
      post: async (path, body) => (await http.post(`${base}/${selected}${path}`, body)).data,
      events: `${API_BASE}${base}/${selected}/events`,
      media: (id) => `${API_BASE}${base}/${selected}/media/${id}`,
    }),
    [base, selected, userId],
  );
  useEffect(() => {
    const next = params.get("client");
    if (next) setSelected(next);
  }, [params]);
  const active = list.data?.find((c) => c.id === selected),
    filtered =
      list.data?.filter(
        (c) =>
          c.status === status &&
          c.name.toLowerCase().includes(search.toLowerCase()) &&
          (filter === "all" ||
            (filter === "unread" && c.unread > 0) ||
            (filter === "missing" && c.missingCheckIn) ||
            (filter === "new" && c.newCheckIn) ||
            (filter === "none" && !c.last) ||
            (filter === "contact" && c.noContact) ||
            (filter === "ending" &&
              c.endsAt &&
              new Date(c.endsAt).getTime() < Date.now() + 30 * 86400000)),
      ) ?? [];
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden pb-24 lg:pb-0">
      <aside
        className={cn(
          "flex min-h-0 w-full shrink-0 flex-col border-r border-line bg-panel md:w-80 xl:w-[340px]",
          selected && "hidden md:flex",
        )}
      >
        <div className="relative z-10 shrink-0 border-b border-line bg-surface px-4 pt-4">
          <div className="mb-4 flex items-center gap-5">
            {(["chat", "photo"] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={cn(
                  "pb-2 text-body font-semibold",
                  channel === c ? "border-b-2 border-signal text-fg" : "text-fg-muted",
                )}
                onClick={() => setChannel(c)}
              >
                {c === "chat" ? "Inbox" : "Photo Log"}
                {c === "photo" && counts.data?.some((x) => x.unread) ? (
                  <span className="ml-2 rounded-full bg-selected px-2 text-caption text-signal-text">
                    {counts.data.reduce((s, x) => s + x.unread, 0)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <div className="relative mb-1 h-11 shrink-0">
            <IconSearch className="pointer-events-none absolute left-3 top-3 size-5 text-fg-subtle" />
            <input
              className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-sm outline-none focus:border-signal focus:ring-2 focus:ring-signal/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients by name"
              aria-label="Search clients"
            />
          </div>
          <div className="mt-2 flex h-11 shrink-0 items-stretch justify-between gap-2 overflow-x-auto">
            {["active", "waiting", "paused", "archived"].map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "whitespace-nowrap border-b-2 py-3 text-caption capitalize",
                  status === s ? "border-signal text-fg" : "border-transparent text-fg-muted",
                )}
              >
                {s === "waiting" ? "Pending" : s === "archived" ? "Ended" : s}{" "}
                {list.data?.filter((c) => c.status === s).length ?? 0}
              </button>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex h-11 shrink-0 items-center gap-2 border-b border-line bg-panel px-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger
              className="h-8 w-auto min-w-0 flex-1 border-0 bg-transparent shadow-none"
              aria-label="Filter conversations"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                ["all", "All conversations"],
                ["unread", "Unread messages"],
                ["missing", "Missing check-ins"],
                ["new", "New check-ins"],
                ["none", "No messages"],
                ["contact", "No contact in 14 days"],
                ["ending", "Ending soon"],
              ].map(([v, label]) => (
                <SelectItem key={v} value={v ?? "all"}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {list.isPending ? (
            <p className="p-5 text-fg-muted">Loading inbox…</p>
          ) : list.isError ? (
            <div role="alert" className="p-5 text-danger">
              Couldn't load conversations.
              <Button variant="ghost" onClick={() => void list.refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            filtered
              .sort(
                (a, b) =>
                  (b.last ? Date.parse(b.last.createdAt) : 0) -
                  (a.last ? Date.parse(a.last.createdAt) : 0),
              )
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelected(c.id);
                    window.history.replaceState(
                      null,
                      "",
                      `/inbox?client=${c.id}&channel=${channel}`,
                    );
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-line px-4 py-4 text-left transition-colors hover:bg-surface",
                    selected === c.id && "bg-selected",
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-panel font-semibold text-signal-text">
                    {c.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between gap-2">
                      <strong className="truncate text-label">{c.name}</strong>
                      <small className="text-fg-subtle">
                        {c.last
                          ? new Date(c.last.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </small>
                    </span>
                    <span className="mt-1 block truncate text-caption text-fg-muted">
                      {c.last?.kind === "workout"
                        ? "Completed a workout"
                        : c.last?.kind === "check-in"
                          ? "Submitted a check-in"
                          : c.last?.body || (c.last ? "Sent an attachment" : "No messages yet")}
                    </span>
                  </span>
                  {c.unread ? (
                    <span className="h-fit rounded-full bg-signal px-2 py-0.5 text-caption text-white">
                      {c.unread}
                    </span>
                  ) : null}
                </button>
              ))
          )}
          {!list.isPending && !filtered.length ? (
            <p className="p-6 text-center text-body-sm text-fg-muted">
              No conversations match these filters.
            </p>
          ) : null}
        </div>
      </aside>
      <section
        aria-label="Selected conversation"
        className={cn("min-h-0 min-w-0 flex-1", !selected && "hidden md:flex")}
      >
        {selected ? (
          <ChatConversation
            key={`${selected}:${channel}`}
            transport={transport}
            channel={channel}
            name={active?.name ?? "Client"}
            coach
            clientHref={`/clients/${selected}`}
            onBack={() => setSelected(null)}
          />
        ) : (
          <div className="m-auto text-center text-fg-muted">
            <h1 className="mb-2 text-subheading font-semibold text-fg">Your inbox</h1>
            <p>Choose a client to start a conversation.</p>
          </div>
        )}
      </section>
    </div>
  );
}
