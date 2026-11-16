import { isValidElement, type ReactNode } from "react";
import { SITE } from "@/content/site";
import { CHECK_IN_FORM, INTAKE_QUESTIONS, MESSAGE_TEMPLATES } from "@/content/templates";
import { liveTool } from "./registry";
import type { LiveTool, ProsePart } from "./types";

const url = (path: string) => new URL(path, SITE.url).href;
const lines = (parts: readonly string[]) => parts.filter(Boolean).join("\n\n");

type Markup = { children?: ReactNode; href?: string };

function childrenOf(node: ReactNode, tag: string): ReactNode[] {
  if (Array.isArray(node)) return node.flatMap((child) => childrenOf(child, tag));
  if (!isValidElement<Markup>(node)) return [];
  return node.type === tag ? [node] : childrenOf(node.props.children, tag);
}

function markdown(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(markdown).join("");
  if (!isValidElement<Markup>(node)) return "";
  const { children, href } = node.props;
  const content = () => markdown(children);
  switch (node.type) {
    case "p":
      return `\n\n${content()}\n\n`;
    case "strong":
      return `**${content()}**`;
    case "em":
      return `*${content()}*`;
    case "code":
      return `\`${content()}\``;
    case "a":
      return href ? `[${content()}](${url(href)})` : content();
    case "ol":
    case "ul": {
      const items = childrenOf(children, "li").map(
        (item, i) =>
          `${node.type === "ol" ? `${i + 1}.` : "-"} ${markdown(item).trim().replaceAll("\n", "\n  ")}`,
      );
      return `\n\n${items.join("\n")}\n\n`;
    }
    case "table": {
      const rows = childrenOf(children, "tr").map((row) =>
        [...childrenOf(row, "th"), ...childrenOf(row, "td")].map((cell) =>
          markdown(cell)
            .trim()
            .replace(/\s*\n\s*/g, " ")
            .replaceAll("|", "\\|"),
        ),
      );
      const [header, ...body] = rows;
      if (!header?.length) return "";
      const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
      return `\n\n${[line(header), line(header.map(() => "---")), ...body.map(line)].join("\n")}\n\n`;
    }
    default:
      return content();
  }
}

const prose = (node: ReactNode) =>
  markdown(node)
    .trim()
    .replace(/\n{3,}/g, "\n\n");
const section = ({ heading, body }: ProsePart) => lines([`## ${heading}`, prose(body)]);

export function toolAnswers(tool: LiveTool, level: 2 | 3) {
  const heading = "#".repeat(level);
  return lines([
    `${heading} ${tool.copy.shortAnswer.question}`,
    prose(tool.copy.shortAnswer.answer),
    `${heading} Frequently asked questions`,
    ...tool.copy.faq.map(({ q, a }) => `${heading}# ${q}\n\n${a}`),
  ]);
}

export function toolMarkdown(slug: string) {
  const canonical = url(`/tools/${slug}`);
  const original = `[Canonical tool page](${canonical})`;
  if (slug === "templates") {
    const fields = (items: typeof CHECK_IN_FORM) =>
      items.map(({ q, why }) => `- **${q}** ${why}`).join("\n");
    return lines([
      "# Messages you can send tonight",
      original,
      "## Six client messages",
      ...MESSAGE_TEMPLATES.map(({ title, when, body }) => lines([`### ${title}`, when, body])),
      "## Weekly check-in",
      fields(CHECK_IN_FORM),
      "## Intake questions",
      fields(INTAKE_QUESTIONS),
    ]);
  }
  const tool = liveTool(slug);
  if (!tool) return null;
  const { copy } = tool;
  return lines([
    `# ${copy.h1}`,
    original,
    prose(copy.intro),
    copy.method ? `**Method:** ${copy.method}` : "",
    toolAnswers(tool, 2),
    ...copy.sections.map(section),
    section(copy.forCoaches),
    section(copy.pitch),
    copy.prompt
      ? lines([
          `## ${copy.prompt.heading}`,
          copy.prompt.whenToUse,
          copy.prompt.pasteIn,
          copy.prompt.text,
        ])
      : "",
    copy.disclaimer ? lines(["## Limitations", prose(copy.disclaimer)]) : "",
    copy.sources?.length
      ? lines([
          "## Sources",
          copy.sources
            .map(({ label, href }) => (href ? `- [${label}](${url(href)})` : `- ${label}`))
            .join("\n"),
        ])
      : "",
  ]);
}
