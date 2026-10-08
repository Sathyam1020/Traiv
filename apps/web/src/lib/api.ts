export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Three public endpoints, called with `fetch`.
 *
 * The product apps share an axios client with interceptors, a session cookie and
 * react-query on top. None of that applies here: these routes take no session, the site
 * is prerendered, and every kilobyte on a landing page is paid for by somebody on a 4G
 * connection who has not decided they care yet. Axios and react-query would be about
 * 40kB to replace twelve lines.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    // A network failure and a 500 reach the caller as the same shape, so a form only has
    // one error path to render rather than two that drift apart.
    throw new ApiError(0, "network", "Could not reach us. Check your connection and try again.");
  }

  if (res.status === 204) return undefined as T;

  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  } & T;

  if (!res.ok) {
    throw new ApiError(res.status, body.error ?? "unknown", body.message ?? "Something failed.");
  }
  return body;
}

export type WaitlistInput = {
  email?: string;
  phone?: string;
  name?: string;
  intent: "signup" | "signin" | "demo" | "affiliate" | "partnership";
  source?: string;
  path?: string;
  announcements: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export const joinWaitlist = (input: WaitlistInput) =>
  request<{ ok: true; already: boolean }>("/m/waitlist", {
    method: "POST",
    body: JSON.stringify(input),
  });

export type PostCard = {
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string | null;
  authorName: string;
  readMinutes: number;
  publishedAt: string;
};

export type FullPost = PostCard & {
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

/**
 * Read on the server, during the render of a statically generated page.
 *
 * `next: { revalidate }` is what makes publishing from the admin app reach the public
 * site without a deploy: the page stays static and Next re-renders it in the background
 * once the window passes. Sixty seconds, because a blog post is not a share price.
 */
export async function getPosts(): Promise<PostCard[]> {
  try {
    const res = await fetch(`${API_BASE}/m/blog`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const body = (await res.json()) as { posts: PostCard[] };
    return body.posts;
  } catch {
    // The marketing site must build and serve whether or not the API is up. An empty
    // blog index is a bad day; a build that fails because a container was restarting is
    // the whole site down.
    return [];
  }
}

export async function getPost(slug: string): Promise<FullPost | null> {
  try {
    const res = await fetch(`${API_BASE}/m/blog/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { post: FullPost };
    return body.post;
  } catch {
    return null;
  }
}
