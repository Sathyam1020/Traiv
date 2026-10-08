import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { Container, PageHero, Section } from "@/components/layout";
import { PostBody } from "@/components/post-body";
import { getPost, getPosts } from "@/lib/api";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 60;

/**
 * Prerender what exists at build time; render anything newer on first request.
 *
 * `dynamicParams` stays on (the default) on purpose — without it a post published after
 * the last deploy would 404 until somebody redeployed, which would defeat the point of
 * writing posts outside the repo.
 */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      publishedTime: post.publishedAt,
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const others = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero title={post.title} lede={post.excerpt} width="prose">
        <p className="text-caption text-fg-subtle">
          {post.authorName} · {formatDate(post.publishedAt)} · {post.readMinutes} minute read
        </p>
      </PageHero>

      <Section>
        <Container width="prose">
          {post.coverUrl ? (
            // A plain img, not next/image: the cover is uploaded by the admin to a
            // host that is not known at build time, so there is no remote pattern to
            // configure next/image with.
            <img
              src={post.coverUrl}
              alt={post.coverAlt ?? ""}
              className="mb-10 w-full rounded-panel border border-line"
            />
          ) : null}

          <article>
            <PostBody markdown={post.body} />
          </article>
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section tone="sunken">
          <Container width="prose">
            <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.02em]">
              Read next
            </h2>
            <ul className="mt-6 flex flex-col">
              {others.map((o) => (
                <li key={o.slug} className="border-t border-line">
                  <Link href={`/blog/${o.slug}`} className="flex flex-col gap-1.5 py-5">
                    <span className="text-body font-semibold underline decoration-line-strong underline-offset-4">
                      {o.title}
                    </span>
                    <span className="text-body-sm leading-relaxed text-fg-muted">{o.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <CtaBand source="post-close" secondary={{ href: "/blog", label: "All posts" }} />
    </>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
