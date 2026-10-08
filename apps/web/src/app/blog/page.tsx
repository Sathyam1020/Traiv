import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section } from "@/components/layout";
import { getPosts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "What we are learning building coaching software in India — pricing, retention, nutrition, and what coaches here actually need.",
  alternates: { canonical: "/blog" },
};

/**
 * Written in the admin app, not in this repo.
 *
 * Statically rendered and revalidated on a timer, so publishing a post is a database
 * write that the public page catches up with on its own — no build, no deploy, and no
 * engineer in the loop to fix a typo.
 */
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        title="Building this in the open"
        lede="What we are learning making coaching software for India — pricing, retention, nutrition, and the things nobody warns you about."
      />

      <Section>
        <Container>
          {posts.length === 0 ? (
            // A real state, not a placeholder. It happens on the first day and again
            // any time the API is unreachable, and both deserve a sentence rather than
            // an empty page that reads as broken.
            <p className="max-w-[34rem] text-body leading-relaxed text-fg-muted">
              Nothing published yet. The first posts are being written — there is a launch list on
              every page if you would rather be told when they land.
            </p>
          ) : (
            <ul className="flex flex-col">
              {posts.map((post) => (
                <li key={post.slug} className="border-t border-line">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid gap-3 py-8 sm:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] sm:gap-10"
                  >
                    <div className="flex flex-col gap-2">
                      <h2 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                        {post.title}
                      </h2>
                      <p className="text-caption text-fg-subtle">
                        {formatDate(post.publishedAt)} · {post.readMinutes} minute read
                      </p>
                    </div>
                    <p className="text-body-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <CtaBand
        source="blog-close"
        secondary={{ href: "/tools/templates", label: "Get the templates" }}
      />
    </>
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
