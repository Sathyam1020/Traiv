"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@traiv/ui/components/sheet";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Textarea } from "@traiv/ui/components/textarea";
import { ArrowLeft, Search } from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import { useEffect, useId, useMemo, useState } from "react";
import type { TemplateSummary } from "@/lib/api";
import { isApiError } from "@/lib/api";
import { useDuplicateFromTemplate, useTemplates } from "@/lib/query";

/**
 * "Duplicate from Template" → "Customize Template", the real two-step flow exactly:
 * pick a studio template (draft or published — a coach may duplicate an unfinished one
 * to adapt for a client before publishing either), then confirm its name, description
 * and image before it becomes that client's own copy.
 */
export function DuplicateFromTemplatePanel({
  studioId,
  clientId,
  open,
  onOpenChange,
  onDuplicated,
}: {
  studioId: string;
  clientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDuplicated: (templateId: string) => void;
}) {
  const [step, setStep] = useState<"pick" | "customize">("pick");
  const [picked, setPicked] = useState<TemplateSummary | null>(null);
  const [q, setQ] = useState("");
  const templates = useTemplates(studioId);
  const duplicate = useDuplicateFromTemplate(studioId, clientId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep("pick");
      setPicked(null);
      setQ("");
      setError(null);
    }
  }, [open]);

  const rows = useMemo(() => {
    const all = templates.data ?? [];
    const term = q.trim().toLowerCase();
    return term ? all.filter((t) => t.name.toLowerCase().includes(term)) : all;
  }, [templates.data, q]);

  async function submit(name: string, description: string, imageUrl: string) {
    if (!picked) return;
    setError(null);
    try {
      const t = await duplicate.mutateAsync({
        templateId: picked.id,
        name: name.trim() || picked.name,
        description: description.trim() || null,
        imageUrl: imageUrl.trim() || null,
      });
      onOpenChange(false);
      onDuplicated(t.id);
    } catch (e) {
      setError(isApiError(e) ? e.message : "Couldn't duplicate that. Try again.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-4 overflow-y-auto sm:max-w-md">
        {step === "pick" ? (
          <>
            <SheetHeader>
              <SheetTitle>Duplicate from Template</SheetTitle>
              <SheetDescription>Select a template to duplicate for this client.</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-3 px-4">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search templates..."
                  className="h-9 pl-9"
                />
              </div>

              {templates.isPending ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }, (_, n) => n).map((n) => (
                    <Skeleton key={n} className="h-20 w-full rounded-control" />
                  ))}
                </div>
              ) : rows.length === 0 ? (
                <p className="py-8 text-center text-body-sm text-fg-muted">No templates yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {rows.map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-col gap-2 rounded-control border border-line p-3"
                    >
                      <div className="flex items-center gap-3">
                        {t.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={t.imageUrl}
                            alt=""
                            className="size-9 shrink-0 rounded-control object-cover"
                          />
                        ) : (
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-sunken text-caption font-semibold text-fg-muted">
                            {t.name.slice(0, 2)}
                          </span>
                        )}
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-body-sm font-medium">{t.name}</span>
                          <span className="text-caption text-fg-subtle">
                            {t.sessions} session{t.sessions === 1 ? "" : "s"}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-caption font-medium",
                            t.status === "active"
                              ? "bg-success-subtle text-success"
                              : "bg-warning-subtle text-warning",
                          )}
                        >
                          {t.status === "active" ? "Live" : "Draft"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setPicked(t);
                          setStep("customize");
                        }}
                      >
                        Select Template
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : picked ? (
          <Customize
            template={picked}
            onBack={() => setStep("pick")}
            onSubmit={submit}
            submitting={duplicate.isPending}
            error={error}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Customize({
  template,
  onBack,
  onSubmit,
  submitting,
  error,
}: {
  template: TemplateSummary;
  onBack: () => void;
  onSubmit: (name: string, description: string, imageUrl: string) => void;
  submitting: boolean;
  error: string | null;
}) {
  const nameId = useId();
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description ?? "");
  const [imageUrl, setImageUrl] = useState(template.imageUrl ?? "");

  return (
    <>
      <SheetHeader>
        <SheetTitle>Customize Template</SheetTitle>
        <SheetDescription>
          Customize the name, description, and image for the duplicated template.
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-4 px-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={nameId}>Template Name</Label>
          <Input id={nameId} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Image</Label>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="h-24 w-24 rounded-control border border-line object-cover"
            />
          ) : (
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
            />
          )}
        </div>
        {error ? <p className="text-caption text-danger">{error}</p> : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-line border-t px-4 py-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button onClick={() => onSubmit(name, description, imageUrl)} disabled={submitting}>
          {submitting ? "Duplicating…" : "Duplicate Template"}
        </Button>
      </div>
    </>
  );
}
