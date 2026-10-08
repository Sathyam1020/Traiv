import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * A post body, as React elements.
 *
 * `react-markdown` rather than a Markdown-to-HTML library on purpose: it never produces
 * an HTML string and never touches `dangerouslySetInnerHTML`, so a post cannot carry a
 * script tag whatever is typed into the editor. The alternative needed a sanitiser
 * beside it, and the usual sanitiser drags jsdom into the bundle.
 *
 * The element map is here rather than in a stylesheet because the site has no global
 * prose styles and should not grow a second type system to get them — every element
 * below uses the same tokens as the rest of the page.
 */
export function PostBody({ markdown }: { markdown: string }) {
  return (
    <div className="flex flex-col gap-5">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-7 font-display text-[1.5rem] font-semibold leading-snug tracking-[-0.02em]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 font-display text-[1.1875rem] font-semibold tracking-[-0.02em]">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="text-body leading-[1.75] text-fg-muted">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-fg underline decoration-line-strong underline-offset-2 hover:decoration-fg"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="flex list-disc flex-col gap-2 pl-5 text-body leading-relaxed text-fg-muted">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-body leading-relaxed text-fg-muted">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-line-strong pl-5 text-body italic leading-relaxed text-fg-muted">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-sunken px-1.5 py-0.5 font-mono text-[0.875em]">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            // Its own scroller, so a long line never makes the page scroll sideways.
            <pre className="overflow-x-auto rounded-surface border border-line bg-sunken p-4 text-body-sm">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-4 border-line" />,
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-surface border border-line">
              <table className="w-full border-collapse text-left text-body-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-line bg-sunken px-4 py-2.5 text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-line px-4 py-3 text-fg-muted">{children}</td>
          ),
          img: ({ src, alt }) => (
            // Plain img: an image inside a post points at a host nobody knows at
            // build time, so next/image has nothing to be configured with.
            <img
              src={typeof src === "string" ? src : undefined}
              alt={alt ?? ""}
              className="rounded-surface border border-line"
            />
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
