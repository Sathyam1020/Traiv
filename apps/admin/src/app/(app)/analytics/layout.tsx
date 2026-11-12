"use client";

import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The analytics section's own sub-nav. Overview and Marketing are Phase 1; Acquisition,
 * Funnels, Product Usage and Engagement are Phase 2; Retention, Studios, System Health
 * and Data Quality are Phase 3; Referrals is Phase 4 (`admin-dashboard-spec.md` §2–6,
 * §8, §10–12). Revenue and Client Engagement are the two sections of that doc this
 * roadmap never schedules (Revenue is prerequisite-gated on billing; Client Engagement
 * is already covered by Overview + Engagement's own weekly-active-client numbers).
 */
const TABS = [
  { href: "/analytics/overview", label: "Overview" },
  { href: "/analytics/acquisition", label: "Acquisition" },
  { href: "/analytics/funnels", label: "Funnels" },
  { href: "/analytics/product-usage", label: "Product usage" },
  { href: "/analytics/engagement", label: "Engagement" },
  { href: "/analytics/retention", label: "Retention" },
  { href: "/analytics/studios", label: "Studios" },
  { href: "/analytics/system-health", label: "System health" },
  { href: "/analytics/data-quality", label: "Data quality" },
  { href: "/analytics/referrals", label: "Referrals" },
  { href: "/analytics/marketing", label: "Marketing" },
] as const;

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      <nav className="mx-auto flex w-full max-w-[1280px] gap-1 overflow-x-auto border-b border-line px-4 pt-5 sm:px-6">
        {TABS.map((tab) => {
          const active = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-body-sm font-medium transition-colors",
                active ? "border-fg text-fg" : "border-transparent text-fg-muted hover:text-fg",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
