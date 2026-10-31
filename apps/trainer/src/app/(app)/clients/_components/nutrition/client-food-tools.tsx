"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Textarea } from "@traiv/ui/components/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@traiv/ui/components/sheet";
import { Image, Settings } from "@traiv/ui/icons";
import { http } from "@/lib/api/client";
type Permissions = Record<
  "search" | "barcode" | "photoLog" | "calculator" | "personalPlans",
  boolean
>;
const permissionLabels: Record<string, string> = {
  search: "Food database search",
  barcode: "Barcode & label scanner",
  photoLog: "Photo Log",
  calculator: "Calorie calculator",
  personalPlans: "Personal meal plans",
};
type Payload = {
  permissions: Permissions;
  photos: {
    id: string;
    imageUrl: string | null;
    note: string | null;
    author: string;
    createdAt: string;
  }[];
  reports: { id: string; note: string; ingredientId: string; name: string; createdAt: string }[];
};
export function ClientFoodTools({ studio, clientId }: { studio: string; clientId: string }) {
  const [open, setOpen] = useState(false),
    [view, setView] = useState("photos"),
    [note, setNote] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const request = useRef(crypto.randomUUID()),
    qc = useQueryClient(),
    base = `/studios/${studio}/clients/${clientId}/food`;
  const query = useQuery({
    queryKey: ["client-food-tools", studio, clientId],
    queryFn: async () => (await http.get<Payload>(base)).data,
    enabled: open && Boolean(studio),
    refetchInterval: open ? 30000 : false,
  });
  async function save(fn: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await fn();
      await qc.invalidateQueries({ queryKey: ["client-food-tools", studio, clientId] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="flex justify-end gap-2 px-6 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setView("photos");
            setOpen(true);
          }}
        >
          <Image className="size-4" />
          Food diary & Photo Log
        </Button>
        <Button
          variant="ghost"
          aria-label="Nutrition permissions"
          onClick={() => {
            setView("permissions");
            setOpen(true);
          }}
        >
          <Settings className="size-4" />
        </Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Client nutrition</SheetTitle>
            <SheetDescription>Food diary, meal photos, and client tools</SheetDescription>
          </SheetHeader>
          <div className="flex gap-2">
            {["photos", "diary", "permissions", "reports"].map((v) => (
              <Button
                key={v}
                variant={v === view ? "default" : "outline"}
                onClick={() => setView(v)}
              >
                {v}
              </Button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {error || query.isError ? (
              <p role="alert" className="text-danger">
                {error || "Couldn't load nutrition tools."}
              </p>
            ) : null}
            {query.isPending ? <p>Loading…</p> : null}
            {query.data && view === "permissions"
              ? Object.entries(query.data.permissions).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-control border border-line p-4"
                  >
                    <span>{permissionLabels[key]}</span>
                    <input
                      type="checkbox"
                      checked={value}
                      disabled={busy}
                      onChange={(e) =>
                        save(() =>
                          http.put(base + "/permissions", {
                            ...query.data?.permissions,
                            [key]: e.target.checked,
                          }),
                        )
                      }
                    />
                  </label>
                ))
              : null}
            {query.data && view === "photos" ? (
              <>
                <Textarea
                  placeholder="Reply to this client's meal photos…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  disabled={busy || !note.trim()}
                  onClick={() =>
                    save(async () => {
                      await http.post(base + "/photos", { id: request.current, note });
                      request.current = crypto.randomUUID();
                      setNote("");
                    })
                  }
                >
                  Send reply
                </Button>
                {query.data.photos.map((m) => (
                  <article className="rounded-surface border border-line p-4" key={m.id}>
                    <p className="mb-2 text-caption text-fg-muted">
                      {m.author} · {new Date(m.createdAt).toLocaleString()}
                    </p>
                    {m.imageUrl ? (
                      <a href={m.imageUrl} target="_blank" rel="noreferrer">
                        <img
                          src={m.imageUrl}
                          alt="Client meal"
                          className="max-h-80 w-full rounded-control object-cover"
                        />
                      </a>
                    ) : null}
                    <p className="mt-2 whitespace-pre-wrap text-body-sm">{m.note}</p>
                  </article>
                ))}
                {!query.data.photos.length ? (
                  <p className="text-fg-muted">No meal photos yet.</p>
                ) : null}
              </>
            ) : null}
            {query.data && view === "reports"
              ? query.data.reports.map((r) => (
                  <article key={r.id} className="rounded-control border border-line p-4">
                    <p className="text-caption text-fg-muted">{r.name}</p>
                    <p className="mt-2 text-body-sm">{r.note}</p>
                  </article>
                ))
              : null}
            {view === "diary" ? <ClientDiary base={base} /> : null}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
function ClientDiary({ base }: { base: string }) {
  const today = new Date();
  const [date, setDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
  );
  const q = useQuery({
    queryKey: ["client-food-day", base, date],
    queryFn: async () =>
      (
        await http.get<{
          entries: {
            id: string;
            slot: string;
            kcal: number;
            snapshot: { name: string } | null;
            manualName: string | null;
          }[];
          total: { kcal: number };
        }>(`${base}/days/${date}`)
      ).data,
  });
  return (
    <div className="space-y-4">
      <Input
        type="date"
        value={date}
        onChange={(e) => {
          if (e.target.value) setDate(e.target.value);
        }}
      />
      {q.isPending ? (
        <p>Loading diary…</p>
      ) : q.isError ? (
        <p className="text-danger">Couldn't load this day.</p>
      ) : (
        <>
          <p className="font-semibold">{q.data.total.kcal} kcal logged</p>
          {q.data.entries.map((e) => (
            <div
              key={e.id}
              className="flex justify-between gap-3 rounded-control border border-line p-3"
            >
              <div>
                <p className="text-body-sm">{e.snapshot?.name ?? e.manualName ?? "Food"}</p>
                <p className="text-caption text-fg-muted capitalize">{e.slot}</p>
              </div>
              <span className="text-body-sm">{e.kcal} kcal</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
