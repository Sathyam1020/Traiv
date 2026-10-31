"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Textarea } from "@traiv/ui/components/textarea";
import { foodApi, uploadFoodImage, type PhotoMessage } from "@/lib/api/food";
import { Panel, Field, ErrorText, card } from "./common";
import { useAction } from "./actions";
export function Photos({ studio, onClose }: { studio: string; onClose: () => void }) {
  const api = foodApi(studio),
    qc = useQueryClient(),
    action = useAction(),
    id = useRef(crypto.randomUUID()),
    uploaded = useRef<string | null>(null);
  const query = useQuery({
    queryKey: ["food-photos", studio],
    queryFn: () => api.get<PhotoMessage[]>("/photos"),
    refetchInterval: 30000,
  });
  const [file, setFile] = useState<File | null>(null),
    [note, setNote] = useState(""),
    [preview, setPreview] = useState<string | null>(null);
  return (
    <Panel
      title="Photo Log"
      description="Share meal photos and a note with your coach."
      onClose={onClose}
    >
      <div className="space-y-4">
        <Field label="Meal photo">
          <Input
            disabled={action.busy}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              id.current = crypto.randomUUID();
              uploaded.current = null;
            }}
          />
        </Field>
        <Field label="Add a note (optional)">
          <Textarea disabled={action.busy} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <ErrorText error={action.error ?? query.error} />
        <Button
          className="w-full"
          disabled={action.busy || !file}
          onClick={() =>
            action.run(async () => {
              if (!file) return;
              const imageUrl =
                uploaded.current ?? (await uploadFoodImage(studio, file, "photo-log"));
              uploaded.current = imageUrl;
              await api.post("/photos", { id: id.current, imageUrl, note: note || null });
              setFile(null);
              uploaded.current = null;
              setNote("");
              id.current = crypto.randomUUID();
              await qc.invalidateQueries({ queryKey: ["food-photos", studio] });
            })
          }
        >
          {action.busy ? "Sending…" : "Send photo"}
        </Button>
        <div className="space-y-4">
          {query.data?.map((m) => (
            <article key={m.id} className={card}>
              <p className="mb-3 text-caption text-fg-muted">
                {m.author === "coach" ? "Your coach" : "You"} ·{" "}
                {new Date(m.createdAt).toLocaleString()}
              </p>
              {m.imageUrl ? (
                <button
                  type="button"
                  className="block w-full"
                  onClick={() => setPreview(m.imageUrl)}
                >
                  <img
                    src={m.imageUrl}
                    alt="Shared meal"
                    className="max-h-72 w-full rounded-control object-cover"
                  />
                </button>
              ) : null}
              {m.note ? <p className="mt-3 whitespace-pre-wrap text-body-sm">{m.note}</p> : null}
            </article>
          ))}
        </div>
        {query.data?.length === 0 ? (
          <p className="text-body-sm text-fg-muted">
            Your meal photos and your coach’s replies will appear here.
          </p>
        ) : null}
      </div>
      {preview ? (
        <Panel title="Meal photo" onClose={() => setPreview(null)}>
          <img src={preview} alt="Shared meal" className="w-full rounded-control" />
        </Panel>
      ) : null}
    </Panel>
  );
}
