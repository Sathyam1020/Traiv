import { ImageResponse } from "next/og";
import { GROUP_LABEL, LIVE_TOOLS, liveTool } from "@/content/tools/registry";

/**
 * A per-tool share image, so a tool link sent over WhatsApp previews as that tool rather
 * than the site-wide card.
 *
 * ImageResponse can't read CSS variables, so the colours are the marketing tokens' literal
 * values from `app/marketing.css` (--canvas, --fg, --fg-muted, --accent, --line). Change
 * them there and here together.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Free tool from Traiv";

const TOKENS = {
  canvas: "#f3f4f1",
  fg: "#252b28",
  muted: "#59665f",
  accent: "#2459b8",
  line: "#d9dfd8",
} as const;

export function generateStaticParams() {
  return LIVE_TOOLS.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = liveTool(slug);
  const name = tool?.name ?? "Free tools for coaches";
  const group = tool ? GROUP_LABEL[tool.group] : "Traiv";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: TOKENS.canvas,
        padding: 80,
        borderBottom: `16px solid ${TOKENS.accent}`,
      }}
    >
      <div style={{ display: "flex", fontSize: 30, color: TOKENS.muted }}>Free tool · {group}</div>
      <div
        style={{
          display: "flex",
          fontSize: 92,
          fontWeight: 600,
          color: TOKENS.fg,
          letterSpacing: -3,
          lineHeight: 1.05,
        }}
      >
        {name}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 30,
          color: TOKENS.muted,
          borderTop: `2px solid ${TOKENS.line}`,
          paddingTop: 28,
        }}
      >
        <span style={{ color: TOKENS.accent, fontWeight: 600 }}>Traiv</span>
        <span>Free, no signup</span>
      </div>
    </div>,
    size,
  );
}
