"use client";

import { Badge } from "@traiv/ui/components/badge";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Page } from "@traiv/ui/components/shell/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@traiv/ui/components/table";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminState, Empty, Stat } from "@/components/common/admin-state";
import type { WaitlistEntry } from "@/lib/api";
import { useSession, useWaitlist } from "@/lib/query";

/**
 * Everyone who asked to be told when Traiv opens.
 *
 * The one admin screen that reads personal data, which is why it is the one screen with
 * no public counterpart anywhere in the API. The consent column is the important one:
 * "No" means we hold their details and may not write to them, and exporting the list
 * without reading that column is how a company ends up in breach of its own form.
 */
export default function WaitlistPage() {
  const [query, setQuery] = useState("");
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const waitlist = useWaitlist(signedIn);

  const entries = waitlist.data ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) =>
      [e.email, e.phone, e.name, e.source, e.intent]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [entries, query]);

  const consented = entries.filter((e) => e.announcements).length;

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-semibold tracking-[-0.03em]">Launch list</h1>
          <p className="text-body-sm text-fg-muted">
            People who left a way to reach them before signup opened.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={consented === 0}
          onClick={() => downloadCsv(entries.filter((e) => e.announcements))}
        >
          <Download className="size-4" />
          Export the {consented} who agreed
        </Button>
      </header>

      <AdminState
        pending={waitlist.isPending || session.isPending}
        error={waitlist.error}
        onRetry={() => void waitlist.refetch()}
      >
        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Total" value={entries.length} />
            <Stat label="Agreed to be told" value={consented} note="the only ones to write to" />
            <Stat label="With an email" value={entries.filter((e) => e.email).length} />
            <Stat label="With a phone" value={entries.filter((e) => e.phone).length} />
          </section>

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone or which button they pressed"
            className="h-10 max-w-[32rem]"
          />

          {filtered.length === 0 ? (
            <Empty>
              {entries.length === 0
                ? "Nobody has joined yet. Every button on the marketing site opens the form that writes here."
                : "Nothing matches that search."}
            </Empty>
          ) : (
            <div className="overflow-x-auto rounded-surface border border-line">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Who</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Pressed</TableHead>
                    <TableHead>Write to them?</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.name || "—"}</TableCell>
                      <TableCell className="text-fg-muted">{e.email || "—"}</TableCell>
                      <TableCell className="tabular-nums text-fg-muted">{e.phone || "—"}</TableCell>
                      <TableCell className="text-fg-muted">
                        {e.source || e.intent}
                        {e.path ? (
                          <span className="block text-caption text-fg-subtle">{e.path}</span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {e.announcements ? (
                          <Badge variant="secondary">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-fg-muted">
                        {new Date(e.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </AdminState>
    </Page>
  );
}

/**
 * CSV of the people who said yes, and only them.
 *
 * The export deliberately cannot include the rest. An export button that hands over
 * everybody is how a consent checkbox becomes decorative — the list that leaves this
 * screen is the list it is lawful to write to.
 */
function downloadCsv(entries: WaitlistEntry[]) {
  const head = ["name", "email", "phone", "intent", "source", "path", "joined"];
  const quote = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

  const csv = [
    head.join(","),
    ...entries.map((e) =>
      [e.name, e.email, e.phone, e.intent, e.source, e.path, e.createdAt].map(quote).join(","),
    ),
  ].join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `traiv-launch-list-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
