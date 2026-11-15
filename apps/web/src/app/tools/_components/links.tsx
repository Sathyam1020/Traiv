"use client";

import { ArrowRight, ArrowUpRight } from "@traiv/ui/icons";
import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/content/site";
import { trackTool } from "./track";

export type Placement = "next" | "pitch" | "band" | "hub";

/**
 * Signup link carrying the tool and the placement (ADR 0036).
 *
 * `utm_content` holds both, because `components/analytics.tsx` replaces source, medium
 * and campaign with the visit's own campaign when there is one, and this is the field
 * that has to survive. `data-trial-location` is what that same component listens for to
 * record the `start_trial` click.
 */
export function toolTrialHref(slug: string, placement: Placement): string {
  const url = new URL(SITE.app.signup);
  url.searchParams.set("utm_source", "traiv-tools");
  url.searchParams.set("utm_medium", "tool");
  url.searchParams.set("utm_campaign", slug);
  url.searchParams.set("utm_content", `${slug}-${placement}`);
  return url.toString();
}

export function ToolTrialLink({
  slug,
  group,
  placement,
  children,
  className,
}: {
  slug: string;
  group: string;
  placement: Placement;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={toolTrialHref(slug, placement)}
      data-trial-location={`tools-${slug}-${placement}`}
      onClick={() =>
        trackTool({ event: "tool_cta_click", slug, group, placement, target: "trial" })
      }
      className={className}
    >
      {children}
    </a>
  );
}

/** Opens Cal.com. Renders nothing when `SITE.demoUrl` is empty. */
export function DemoLink({
  slug,
  group,
  placement,
  className,
}: {
  slug: string;
  group: string;
  placement: Placement;
  className?: string;
}) {
  if (!SITE.demoUrl) return null;
  const url = new URL(SITE.demoUrl);
  url.searchParams.set("utm_source", "traiv-tools");
  url.searchParams.set("utm_medium", "tool");
  url.searchParams.set("utm_campaign", slug);
  url.searchParams.set("utm_content", `${slug}-${placement}`);
  return (
    <a
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackTool({ event: "tool_cta_click", slug, group, placement, target: "demo" })}
      className={className}
    >
      Book a 15-minute demo
      <ArrowUpRight aria-hidden="true" className="size-4" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function FeatureLink({
  slug,
  group,
  href,
  children,
  className,
}: {
  slug: string;
  group: string;
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={() =>
        trackTool({ event: "tool_cta_click", slug, group, placement: "pitch", target: "feature" })
      }
      className={className}
    >
      {children}
    </Link>
  );
}

export function RelatedLink({
  from,
  to,
  children,
  className,
}: {
  from: string;
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={`/tools/${to}`}
      onClick={() => trackTool({ event: "tool_related_click", from, to })}
      className={className}
    >
      {children}
    </Link>
  );
}

export { ArrowRight };
