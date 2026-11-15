"use client";

import { CopyButton } from "@/components/copy-button";
import type { ToolCopy } from "@/content/tools/types";
import { useTool } from "./tool-context";
import { trackTool } from "./track";

/** "Use this with ChatGPT": a prompt the coach fills in and runs themselves (ADR 0036). */
export function PromptBlock({ prompt }: { prompt: NonNullable<ToolCopy["prompt"]> }) {
  const { slug } = useTool();
  return (
    <div className="rounded-surface border border-line bg-surface p-6 sm:p-8">
      <p className="text-caption font-medium text-fg-subtle">Use this result with ChatGPT</p>
      <h3 className="mt-2 font-display text-subheading font-semibold">{prompt.heading}</h3>
      <dl className="mt-5 grid gap-4 text-body-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium">When it helps</dt>
          <dd className="mt-1 leading-relaxed text-fg-muted">{prompt.whenToUse}</dd>
        </div>
        <div>
          <dt className="font-medium">What you fill in</dt>
          <dd className="mt-1 leading-relaxed text-fg-muted">{prompt.pasteIn}</dd>
        </div>
      </dl>
      <div className="mt-5 flex items-start justify-between gap-3 rounded-control border border-line bg-sunken p-4">
        <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap font-mono text-caption leading-relaxed">
          {prompt.text}
        </pre>
        <span
          onClickCapture={() =>
            trackTool({ event: "tool_result_action", slug, action: "copy_prompt" })
          }
        >
          <CopyButton text={prompt.text} label="Prompt" />
        </span>
      </div>
    </div>
  );
}
