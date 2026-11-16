import { CopyButton } from "@/components/copy-button";
import { SITE } from "@/content/site";
import { RPE_EMBED_PATH, RPE_EMBED_REFERRAL } from "@/content/tools/embed";

export function RpeEmbedCode() {
  const code = [
    `<iframe src="${SITE.url}${RPE_EMBED_PATH}" title="RPE calculator" width="100%" height="850" loading="lazy" sandbox="allow-scripts"></iframe>`,
    `<p><a href="${SITE.url}${RPE_EMBED_REFERRAL.replaceAll("&", "&amp;")}">Powered by Traiv</a></p>`,
  ].join("\n");

  return (
    <details className="mt-6 rounded-surface border border-line bg-surface p-4">
      <summary className="cursor-pointer font-medium">Embed this calculator</summary>
      <p className="my-3 text-body-sm text-fg-muted">
        Paste this HTML into a page on your website.
      </p>
      <label className="block text-caption font-medium" htmlFor="rpe-embed-code">
        Embed code
      </label>
      <textarea
        id="rpe-embed-code"
        readOnly
        rows={5}
        value={code}
        className="my-2 block w-full rounded-control border border-line-strong bg-canvas p-3 text-caption"
      />
      <CopyButton text={code} label="Embed code" />
    </details>
  );
}
