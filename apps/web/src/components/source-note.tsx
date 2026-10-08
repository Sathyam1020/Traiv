/**
 * Where a competitor's number came from, and when somebody last looked.
 *
 * A comparison table without this is marketing. With it, it is an argument that survives
 * a competitor screenshotting the page — and the date is the part that matters, because
 * the one certainty about a rival's pricing is that it will change.
 */
export function SourceNote({ source, checked }: { source: string; checked: string }) {
  const external = source.startsWith("http");
  return (
    <p className="text-caption text-fg-subtle">
      Source:{" "}
      {external ? (
        <a
          href={source}
          rel="nofollow noopener noreferrer"
          target="_blank"
          className="underline decoration-line-strong underline-offset-2 hover:text-fg"
        >
          {new URL(source).hostname.replace(/^www\./, "")}
        </a>
      ) : (
        <span>{source}</span>
      )}
      , checked {checked}.
    </p>
  );
}
