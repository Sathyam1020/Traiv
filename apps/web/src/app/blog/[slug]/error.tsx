"use client";

export default function ArticleError({ reset }: { reset: () => void }) {
  return (
    <section className="traiv-content-wrap py-16">
      <h1 className="text-display">This article is temporarily unavailable</h1>
      <p className="my-6 text-fg-muted">Please try again in a moment.</p>
      <button type="button" className="min-h-11 underline" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
