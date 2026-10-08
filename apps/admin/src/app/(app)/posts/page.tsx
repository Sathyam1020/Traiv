"use client";

import { Badge } from "@traiv/ui/components/badge";
import { Button } from "@traiv/ui/components/button";
import { Page } from "@traiv/ui/components/shell/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@traiv/ui/components/table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminState, Empty } from "@/components/common/admin-state";
import { usePosts, useSession } from "@/lib/query";

/**
 * The blog, written here rather than in the repo.
 *
 * Publishing is a database write. The public site renders each post statically and
 * revalidates on a timer, so a post goes live within a minute with no build and no
 * deploy — which is the whole reason posts are rows and not MDX files.
 */
export default function PostsPage() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const posts = usePosts(signedIn);

  return (
    <Page className="gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-semibold tracking-[-0.03em]">Blog</h1>
          <p className="text-body-sm text-fg-muted">
            Published posts appear on traiv.fit/blog within a minute. Drafts are invisible to
            everyone, including by direct link.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/posts/new">
            <Plus className="size-4" />
            Write a post
          </Link>
        </Button>
      </header>

      <AdminState
        pending={posts.isPending || session.isPending}
        error={posts.error}
        onRetry={() => void posts.refetch()}
      >
        {(posts.data ?? []).length === 0 ? (
          <Empty>Nothing written yet. The first post is a button away.</Empty>
        ) : (
          <div className="overflow-x-auto rounded-surface border border-line">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Length</TableHead>
                  <TableHead className="text-right">Last edited</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(posts.data ?? []).map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {post.title}
                      </Link>
                      <span className="block max-w-[32rem] truncate text-caption text-fg-subtle">
                        /blog/{post.slug}
                      </span>
                    </TableCell>
                    <TableCell>
                      {post.status === "published" ? (
                        <Badge variant="secondary">Live</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-fg-muted">{post.authorName}</TableCell>
                    <TableCell className="text-right tabular-nums text-fg-muted">
                      {post.readMinutes} min
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-fg-muted">
                      {new Date(post.updatedAt).toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AdminState>
    </Page>
  );
}
