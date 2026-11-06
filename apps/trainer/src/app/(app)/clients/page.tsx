"use client";

import { Badge } from "@traiv/ui/components/badge";
import { Button } from "@traiv/ui/components/button";
import { ClientAvatar } from "@traiv/ui/components/client-avatar";
import { Input } from "@traiv/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import {
  FilterChips,
  PageHeader,
  TableCard,
  TableFooter,
  Toolbar,
} from "@traiv/ui/components/shell/page-header";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@traiv/ui/components/table";
import { Activity, Apple, ChevronLeft, ChevronRight, Search } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveStudioId } from "@/lib/active-studio";
import type { RosterClient, RosterFilter, RosterStatus } from "@/lib/api";
import { useRoster, useTags } from "@/lib/query";
import { AddClientDialog } from "./_components/add-client-dialog";
import { ClientMenu } from "./_components/client-menu";
import { DurationCell, shortDate } from "./_components/duration-cell";
import { TagPicker } from "./_components/tag-picker";

const STATUSES: { value: RosterStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "archived", label: "Ended" },
];

const FILTERS: { value: RosterFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread messages" },
  { value: "new-checkin", label: "New check-ins" },
  { value: "missing-checkin", label: "Missing check-ins" },
  { value: "ending-soon", label: "Ending soon" },
];

const PER_PAGE = 25;

/**
 * The roster.
 *
 * The tab, the chip and the page live in the URL, so a filtered roster is a link a coach
 * can bookmark or send to themselves — and the back button does what it looks like it
 * does. Search and sort stay in component state: they are a gesture, not a place.
 *
 * Two columns are still sample content — the last message and which plans exist — and
 * both say so. Everything else is the database.
 */
export default function ClientsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const studioId = useActiveStudioId();

  const status = (params.get("status") ?? "active") as RosterStatus;
  const filter = (params.get("filter") ?? "all") as RosterFilter;
  const page = Math.max(1, Number(params.get("page") ?? 1));

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sort, setSort] = useState<"duration" | "name" | "recent">("duration");

  // A request per keystroke is a request per keystroke. 300ms is long enough to finish a
  // word and short enough that the list feels like it is keeping up.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  const roster = useRoster(studioId, {
    status,
    filter,
    search: debounced || undefined,
    sort,
    page,
    perPage: PER_PAGE,
  });

  const tags = useTags(studioId);
  const data = roster.data;

  // The rows on screen are the previous answer and a new one is on its way. Not the
  // first load — that is `isPending`, and that is the only case a skeleton belongs in.
  const refreshing = roster.isFetching && !roster.isPending;

  const href = (next: Partial<Record<"status" | "filter" | "page", string>>) => {
    const q = new URLSearchParams({ status, filter, page: String(page), ...next });
    // A new tab or filter always starts at page one — page 4 of a different list is
    // almost never where the coach wanted to be.
    if (next.status || next.filter) q.set("page", "1");
    return `/clients?${q}`;
  };

  const lastPage = Math.max(1, Math.ceil((data?.total ?? 0) / PER_PAGE));

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        tabs={STATUSES.map((s) => ({
          href: href({ status: s.value, filter: "all" }),
          label: s.label,
          count: data?.statuses[s.value] ?? 0,
          active: status === s.value,
        }))}
      />

      <FilterChips
        chips={FILTERS.map((f) => ({
          label: f.label,
          count: data?.filters[f.value] ?? 0,
          href: href({ filter: f.value }),
          active: filter === f.value,
        }))}
        pending={refreshing}
      />

      <Toolbar>
        <div className="relative w-full sm:max-w-80">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-fg-subtle" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients"
            className="pl-9"
            aria-label="Search clients"
          />
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="flex-1 sm:w-[10rem] sm:flex-none" aria-label="Sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="duration">Longest first</SelectItem>
              <SelectItem value="recent">Newest first</SelectItem>
              <SelectItem value="name">By name</SelectItem>
            </SelectContent>
          </Select>

          <AddClientDialog />
        </div>
      </Toolbar>

      <TableCard pending={refreshing}>
        <div
          className={cn(
            "flex-1 overflow-x-auto transition-opacity duration-200 motion-reduce:transition-none",
            refreshing && "opacity-55",
          )}
        >
          {/* Below `sm` the table becomes a list of cards. A seven-column table on a
              360px screen is a horizontal scroll nobody discovers. */}
          <div className="hidden sm:block">
            <Table data-surface={undefined} className="rounded-none">
              <TableHeader>
                <TableRow className="bg-sunken/60 hover:bg-sunken/60">
                  <TableHead className="pl-4 sm:pl-6">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Last message</TableHead>
                  <TableHead>Plans</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.isPending
                  ? Array.from({ length: 5 }, (_, i) => <LoadingRow key={i} />)
                  : data?.clients.map((client) => (
                      <Row
                        key={client.id}
                        client={client}
                        studioId={studioId}
                        tags={tags.data ?? []}
                      />
                    ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:hidden">
            {roster.isPending
              ? Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="border-line border-b p-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))
              : data?.clients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    studioId={studioId}
                    tags={tags.data ?? []}
                  />
                ))}
          </div>

          {!roster.isPending && data?.clients.length === 0 ? (
            <Empty search={debounced} status={status} filter={filter} />
          ) : null}
        </div>

        <TableFooter>
          <span className="tabular-nums">
            {data ? `${data.clients.length} of ${data.total}` : "—"}
          </span>

          <span className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => router.push(href({ page: String(page - 1) }))}
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="flex size-7 items-center justify-center rounded-full border border-line bg-surface text-body-sm tabular-nums">
              {page}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= lastPage}
              onClick={() => router.push(href({ page: String(page + 1) }))}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </span>

          <span className="hidden text-fg-subtle lg:inline">
            Open a client to view their plans and conversation
          </span>
        </TableFooter>
      </TableCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Row({
  client,
  studioId,
  tags,
}: {
  client: RosterClient;
  studioId: string | null;
  tags: RosterClient["tags"];
}) {
  const router = useRouter();

  return (
    <TableRow
      // The name is a real link, so it opens in a new tab, works from the keyboard and
      // shows its destination on hover. The row-level handler is the convenience on top
      // of it, and it stands aside for anything that already does something of its own —
      // without that, picking a tag would also navigate away from the row you picked it on.
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("a, button, input, [role='dialog']")) {
          router.push(`/clients/${client.id}`);
        }
      }}
      className="cursor-pointer"
    >
      <TableCell className="pl-4 sm:pl-6">
        <Link
          href={`/clients/${client.id}`}
          className="flex items-center gap-2.5 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
        >
          <ClientAvatar id={client.id} name={client.name} size={28} />
          <span className="font-medium">{client.name}</span>
        </Link>
      </TableCell>
      <TableCell>
        <StatusBadge status={client.status} />
      </TableCell>
      <TableCell>
        <TagPicker studioId={studioId} client={client} tags={tags} />
      </TableCell>
      <TableCell>
        <LastMessage client={client} />
      </TableCell>
      <TableCell>
        <Plans />
      </TableCell>
      <TableCell>
        <DurationCell studioId={studioId} client={client} />
      </TableCell>
      <TableCell>
        <ClientMenu studioId={studioId} client={client} />
      </TableCell>
    </TableRow>
  );
}

/** The same row, stacked, for a phone. */
function ClientCard({
  client,
  studioId,
  tags,
}: {
  client: RosterClient;
  studioId: string | null;
  tags: RosterClient["tags"];
}) {
  return (
    <article className="flex flex-col gap-3 border-line border-b p-4 last:border-0">
      <div className="flex items-start gap-3">
        {/* The whole name block is the tap target. A 28px link on a phone is not one. */}
        <Link href={`/clients/${client.id}`} className="flex min-w-0 flex-1 items-start gap-3">
          <ClientAvatar id={client.id} name={client.name} size={34} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate font-medium">{client.name}</span>
            <span className="text-caption text-fg-muted">
              {client.lastSessionAt
                ? `Last trained ${shortDate(new Date(client.lastSessionAt))}`
                : "Not trained yet"}
            </span>
          </span>
        </Link>
        <StatusBadge status={client.status} />
        <ClientMenu studioId={studioId} client={client} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <TagPicker studioId={studioId} client={client} tags={tags} />
        <DurationCell studioId={studioId} client={client} />
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: RosterStatus }) {
  const label = STATUSES.find((s) => s.value === status)?.label ?? status;
  return (
    <Badge
      variant={status === "active" ? "secondary" : "outline"}
      className={cn(status === "active" && "bg-success-subtle text-success")}
    >
      {label}
    </Badge>
  );
}

/**
 * Sample content, and the only thing on this screen that is.
 *
 * There is no messages table. Rather than an empty column that looks broken, the cell
 * shows the one real fact it has — when they last logged a session — and says what it is.
 */
function LastMessage({client}:{client:RosterClient}) {
 const m=client.lastMessage;
 return m ? <Link href={`/inbox?client=${client.id}`} onClick={e=>e.stopPropagation()} className="flex max-w-[15rem] flex-col gap-1 py-2"><span className="truncate text-body-sm">{m.kind==="workout"?"Completed a workout":m.kind==="check-in"?"Submitted a check-in":m.body||"Sent an attachment"}</span><span className="text-caption text-fg-subtle">{shortDate(new Date(m.createdAt))}</span></Link> : <span className="text-body-sm text-fg-subtle">No messages yet</span>;
}

/** Sample content — there is no plan generator yet, so both icons are dimmed. */
function Plans() {
  return (
    <span className="flex items-center gap-1.5" title="Plans are not built yet">
      <span className="flex size-7 items-center justify-center rounded-control text-fg-subtle/40">
        <Activity className="size-3.5" />
      </span>
      <span className="flex size-7 items-center justify-center rounded-control text-fg-subtle/40">
        <Apple className="size-3.5" />
      </span>
    </span>
  );
}

function LoadingRow() {
  return (
    <TableRow>
      {Array.from({ length: 7 }, (_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

/** Says which of the three reasons the list is empty, because the fix differs. */
function Empty({
  search,
  status,
  filter,
}: {
  search: string;
  status: RosterStatus;
  filter: RosterFilter;
}) {
  const message = search
    ? `Nobody matches “${search}”.`
    : filter !== "all"
      ? "Nobody in this view right now — which is usually good news."
      : status === "active"
        ? "No active clients yet. They appear here as soon as somebody joins with your code."
        : `Nobody is ${status === "paused" ? "paused" : "ended"}.`;

  return <p className="px-6 py-16 text-center text-body-sm text-fg-muted">{message}</p>;
}
