"use client";

import { Button } from "@traiv/ui/components/button";
import { Input } from "@traiv/ui/components/input";
import { Label } from "@traiv/ui/components/label";
import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { toast } from "@traiv/ui/components/sonner";
import { Textarea } from "@traiv/ui/components/textarea";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { AdminState } from "@/components/common/admin-state";
import { isApiError, type PostInput } from "@/lib/api";
import { useDeletePost, usePost, useSavePost, useSession } from "@/lib/query";

const BLANK: PostInput = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  authorName: "Traiv",
  status: "draft",
  coverUrl: null,
  coverAlt: null,
  seoTitle: null,
  seoDescription: null,
};

/**
 * The editor. One route for writing and for editing — `/posts/new` is the same screen
 * with nothing loaded, because a separate "create" page is the same form twice and the
 * two drift apart the first time a field is added.
 *
 * Markdown in a plain textarea rather than a rich-text editor. A WYSIWYG that produces
 * HTML would put arbitrary markup into a column the public site renders, and the public
 * renderer deliberately refuses raw HTML — so the editor that matches it is the one that
 * can only produce Markdown.
 */
export default function PostEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";
  const id = isNew ? null : params.id;

  const session = useSession();
  const post = usePost(id);
  const save = useSavePost();
  const remove = useDeletePost();

  const [form, setForm] = useState<PostInput>(BLANK);
  const [touchedSlug, setTouchedSlug] = useState(false);

  const titleId = useId();
  const slugId = useId();
  const excerptId = useId();
  const bodyId = useId();
  const authorId = useId();
  const coverId = useId();
  const coverAltId = useId();
  const seoTitleId = useId();
  const seoDescId = useId();

  // Load the stored post into the form once. Not on every render of `post.data`, or a
  // background refetch would overwrite whatever is being typed.
  useEffect(() => {
    if (!post.data) return;
    setForm({
      slug: post.data.slug,
      title: post.data.title,
      excerpt: post.data.excerpt,
      body: post.data.body,
      authorName: post.data.authorName,
      status: post.data.status,
      coverUrl: post.data.coverUrl,
      coverAlt: post.data.coverAlt,
      seoTitle: post.data.seoTitle,
      seoDescription: post.data.seoDescription,
    });
    setTouchedSlug(true);
  }, [post.data]);

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // The slug follows the title until somebody edits it by hand. After that it is theirs
  // — silently rewriting a published URL because the headline was tweaked is how links
  // break.
  function setTitle(title: string) {
    setForm((f) => ({ ...f, title, ...(touchedSlug ? {} : { slug: slugify(title) }) }));
  }

  const complete = form.title.trim() && form.slug.trim() && form.excerpt.trim() && form.body.trim();

  async function submit(status: PostInput["status"]) {
    if (!complete) return;
    try {
      const saved = await save.mutateAsync({ id, input: { ...form, status } });
      toast(status === "published" ? "Published" : "Saved as a draft", {
        description:
          status === "published"
            ? "It will be on traiv.fit/blog within a minute."
            : "Nobody can see it, including by direct link.",
      });
      if (isNew) router.replace(`/posts/${saved.id}`);
    } catch (err) {
      toast(isApiError(err) ? err.message : "Could not save that.", {
        description: "Nothing was changed.",
      });
    }
  }

  async function destroy() {
    if (!id) return;
    try {
      await remove.mutateAsync(id);
      toast("Deleted");
      router.replace("/posts");
    } catch (err) {
      toast(isApiError(err) ? err.message : "Could not delete that.");
    }
  }

  const busy = save.isPending || remove.isPending;

  return (
    <Page className="gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-body-sm text-fg-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          All posts
        </Link>

        <div className="flex items-center gap-2">
          {id ? (
            <Button variant="ghost" size="sm" onClick={destroy} disabled={busy}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => submit("draft")}
            disabled={!complete || busy}
          >
            Save draft
          </Button>
          <Button size="sm" onClick={() => submit("published")} disabled={!complete || busy}>
            {form.status === "published" ? "Update live post" : "Publish"}
          </Button>
        </div>
      </div>

      <AdminState
        pending={session.isPending || (Boolean(id) && post.isPending)}
        error={post.error}
        onRetry={() => void post.refetch()}
        skeleton={<Skeleton className="h-[32rem] w-full rounded-surface" />}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="flex flex-col gap-5 rounded-surface border border-line bg-surface p-5">
            <Field id={titleId} label="Title">
              <Input
                id={titleId}
                value={form.title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Why clients quit in week three"
                className="h-11"
              />
            </Field>

            <Field
              id={slugId}
              label="Link"
              hint={`traiv.fit/blog/${form.slug || "…"} — changing this on a live post breaks links to it.`}
            >
              <Input
                id={slugId}
                value={form.slug}
                onChange={(e) => {
                  setTouchedSlug(true);
                  set("slug", slugify(e.target.value));
                }}
                className="h-11 font-mono text-body-sm"
              />
            </Field>

            <Field
              id={excerptId}
              label="Excerpt"
              hint="Shown on the blog index and used as the meta description."
            >
              <Textarea
                id={excerptId}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={3}
              />
            </Field>

            <Field
              id={bodyId}
              label="Body"
              hint="Markdown. Headings, lists, tables, links and code — raw HTML is ignored on purpose."
            >
              <Textarea
                id={bodyId}
                value={form.body}
                onChange={(e) => set("body", e.target.value)}
                rows={26}
                className="font-mono text-body-sm leading-relaxed"
                placeholder={"## A heading\n\nA paragraph.\n\n- A point\n- Another"}
              />
            </Field>

            <p className="text-caption tabular-nums text-fg-subtle">
              {wordCount(form.body)} words · about{" "}
              {Math.max(1, Math.round(wordCount(form.body) / 200))} minutes to read
            </p>
          </div>

          <aside className="flex flex-col gap-5 rounded-surface border border-line bg-surface p-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-subheading font-semibold">Details</h2>
              <p className="text-caption text-fg-subtle">
                {form.status === "published"
                  ? "Live. Saving updates the public page."
                  : "A draft. Nobody can reach it."}
              </p>
            </div>

            <Field id={authorId} label="Author">
              <Input
                id={authorId}
                value={form.authorName}
                onChange={(e) => set("authorName", e.target.value)}
                className="h-10"
              />
            </Field>

            <Field id={coverId} label="Cover image URL" hint="Optional. Any https address.">
              <Input
                id={coverId}
                value={form.coverUrl ?? ""}
                onChange={(e) => set("coverUrl", e.target.value || null)}
                placeholder="https://…"
                className="h-10"
              />
            </Field>

            {form.coverUrl ? (
              <Field id={coverAltId} label="Cover description" hint="What the image shows.">
                <Input
                  id={coverAltId}
                  value={form.coverAlt ?? ""}
                  onChange={(e) => set("coverAlt", e.target.value || null)}
                  className="h-10"
                />
              </Field>
            ) : null}

            <Field
              id={seoTitleId}
              label="Search title"
              hint="Optional. Falls back to the title above."
            >
              <Input
                id={seoTitleId}
                value={form.seoTitle ?? ""}
                onChange={(e) => set("seoTitle", e.target.value || null)}
                className="h-10"
              />
            </Field>

            <Field
              id={seoDescId}
              label="Search description"
              hint="Optional. Falls back to the excerpt."
            >
              <Textarea
                id={seoDescId}
                value={form.seoDescription ?? ""}
                onChange={(e) => set("seoDescription", e.target.value || null)}
                rows={3}
              />
            </Field>

            {!complete ? (
              <p className="text-caption text-fg-subtle">
                A title, a link, an excerpt and a body are all required before this can be saved.
              </p>
            ) : null}
          </aside>
        </div>
      </AdminState>
    </Page>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <span className="text-caption text-fg-subtle">{hint}</span> : null}
    </div>
  );
}

/** The same shape the database CHECK enforces, so the form cannot produce a rejected row. */
function slugify(v: string): string {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function wordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}
