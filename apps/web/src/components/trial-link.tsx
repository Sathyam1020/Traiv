import { ArrowUpRight } from "@traiv/ui/icons";
import { SITE } from "@/content/site";
export function TrialLink({
  location,
  compact = false,
  plan,
}: {
  location: string;
  compact?: boolean;
  plan?: string;
}) {
  return (
    <a
      className="trial-link"
      data-trial-location={location}
      data-plan={plan}
      href={`${SITE.app.signup}${plan ? `?plan=${encodeURIComponent(plan)}` : ""}`}
    >
      {compact ? "Start free trial" : "Start your 14-day free trial"}
      <ArrowUpRight aria-hidden="true" size={19} />
    </a>
  );
}
