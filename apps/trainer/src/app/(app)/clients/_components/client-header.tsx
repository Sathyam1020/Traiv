"use client";

import { Avatar } from "@traiv/ui/components/avatar";
import { Badge } from "@traiv/ui/components/badge";
import { Button } from "@traiv/ui/components/button";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@traiv/ui/components/tooltip";
import { cn } from "@traiv/ui/lib/cn";
import {
  ArrowLeft,
  Cake,
  CircleCheckBig,
  type LucideIcon,
  MessageSquareText,
  NotebookPen,
  Ruler,
  VenusAndMars,
  Weight,
} from "lucide-react";
import Link from "next/link";
import type { ClientProfile, Tag } from "@/lib/api";
import { ClientMenu } from "./client-menu";
import { TagPicker } from "./tag-picker";

const STATUS_LABEL: Record<ClientProfile["status"], string> = {
  active: "Active",
  paused: "Paused",
  archived: "Ended",
};

/**
 * The five views of one client.
 *
 * Only Overview exists. The other four are here because they are the shape of the
 * screen and they name real tables — `workout_plan`, `diet_plan`, `body_metric`,
 * `user_intake` — rather than a wishlist, and they are visibly not ready rather than
 * clickable and empty. A tab that opens onto nothing is the thing that makes a product
 * feel hollow; a tab that says "not yet" does not.
 */
const TABS = [
  { label: "Overview", ready: true },
  { label: "Training", ready: false },
  { label: "Nutrition", ready: false },
  { label: "Progress", ready: false },
  { label: "Intake", ready: false },
] as const;

/**
 * The top of one client's screen: who they are, and the state of the relationship.
 *
 * Two kinds of fact live on this row and they come from different places. The
 * relationship — status, coach, tags, when it started — is on the `client` row. The
 * person — age, sex, height, weight — is on the `user`, because somebody answers the
 * intake once however many coaches they have. A client the coach typed in has no user
 * at all, so that half of the row is replaced by what is actually true about them:
 * they have not joined yet.
 */
export function ClientHeader({
  studioId,
  client,
  tags,
}: {
  studioId: string | null;
  client: ClientProfile;
  tags: Tag[];
}) {
  return (
    <header className="flex flex-col gap-3 border-line border-b px-4 pt-4 sm:px-6">
      <div className="flex items-start gap-3">
        <SidebarToggle />

        <Link
          href="/clients"
          aria-label="Back to the roster"
          className="-ml-0.5 flex size-8 shrink-0 items-center justify-center rounded-control text-fg-subtle transition-colors hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <span className="mt-0.5 shrink-0">
          <Avatar name={client.name} size={40} />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h1 className="truncate font-semibold text-heading tracking-[-0.02em]">
              {client.name}
            </h1>
            <StatusBadge status={client.status} />
            {client.coachName ? (
              <span className="text-body-sm text-fg-muted">with {client.coachName}</span>
            ) : null}
          </div>

          {/* The facts and the tags are one line, not two. They are the same kind of
              thing — a short answer about this person — and splitting them put a row
              break between "180 cm" and the label that explains why it matters. */}
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <Facts client={client} />
            <TagPicker studioId={studioId} client={client} tags={tags} />
          </div>
        </div>

        <Actions studioId={studioId} client={client} />
      </div>

      <Tabs />
    </header>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Age, sex, height, weight — or the honest reason there are none.
 *
 * Age is computed from a birth *year*, which is all the intake asks for: nobody needs a
 * client's birthday to work out a calorie target. So it is right to within a year, and
 * it is labelled "yrs" rather than given a precision it does not have.
 *
 * When the coaching started is deliberately not here. It is a fact about the
 * relationship rather than about the person, every other item on this line describes a
 * body, and it belongs with the duration control on the roster where it can be changed.
 */
function Facts({ client }: { client: ClientProfile }) {
  if (!client.hasAccount) {
    return (
      <p className="text-body-sm text-fg-muted">
        Hasn&apos;t joined yet — send them your code and their details fill in here.
      </p>
    );
  }

  const { intake } = client;
  const year = new Date().getFullYear();
  const facts: { icon: LucideIcon; value: string }[] = [];

  if (intake?.birthYear) facts.push({ icon: Cake, value: `${year - intake.birthYear} yrs` });
  if (intake?.sex && intake.sex !== "undisclosed") {
    facts.push({ icon: VenusAndMars, value: intake.sex === "male" ? "Male" : "Female" });
  }
  if (intake?.heightCm) facts.push({ icon: Ruler, value: `${Math.round(intake.heightCm)} cm` });
  if (client.weightKg) facts.push({ icon: Weight, value: `${client.weightKg} kg` });

  // An account with an unfinished intake is its own state: they are here, they just
  // have not answered yet. Saying nothing would read as a bug.
  if (facts.length === 0) {
    return <p className="text-body-sm text-fg-muted">Intake not filled in yet</p>;
  }

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-fg-muted">
      {facts.map(({ icon: Icon, value }) => (
        <span key={value} className="flex items-center gap-1.5 whitespace-nowrap">
          <Icon aria-hidden="true" className="size-3.5 shrink-0 text-fg-subtle" />
          {value}
        </span>
      ))}
    </p>
  );
}

/**
 * Chat, Tasks, Notes.
 *
 * None of the three has a table behind it yet, so all three are disabled and say why on
 * hover rather than opening something empty. They are here because they are the shape
 * of the screen and the coach should be able to see where that work is going.
 *
 * Normal radius, not a full pill: the only fully rounded controls in the product are
 * the roster's filter chips, which are a view switch rather than an action.
 */
const PILLS: { label: string; icon: LucideIcon; why: string }[] = [
  { label: "Chat", icon: MessageSquareText, why: "Messaging is not built yet" },
  { label: "Tasks", icon: CircleCheckBig, why: "Tasks are not built yet" },
  { label: "Notes", icon: NotebookPen, why: "Notes are not built yet" },
];

function Actions({ studioId, client }: { studioId: string | null; client: ClientProfile }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <TooltipProvider delayDuration={200}>
        {/* Hidden below `md`, where three of them and the name do not share a row. The
            menu stays, because pausing is the one thing here that actually works. */}
        <div className="hidden items-center gap-1.5 md:flex">
          {PILLS.map(({ label, icon: Icon, why }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <span>
                  <Button variant="outline" size="sm" disabled>
                    <Icon className="size-4" />
                    {label}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">{why}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
      <ClientMenu studioId={studioId} client={client} />
    </div>
  );
}

function StatusBadge({ status }: { status: ClientProfile["status"] }) {
  return (
    <Badge
      variant={status === "active" ? "secondary" : "outline"}
      className={cn(status === "active" && "bg-success-subtle text-success")}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}

function Tabs() {
  return (
    <TooltipProvider delayDuration={200}>
      <nav className="-mb-px flex gap-5 overflow-x-auto">
        {TABS.map((tab) =>
          tab.ready ? (
            <span
              key={tab.label}
              aria-current="page"
              className="shrink-0 whitespace-nowrap border-fg border-b-2 pb-3 font-medium text-body-sm text-fg"
            >
              {tab.label}
            </span>
          ) : (
            <Tooltip key={tab.label}>
              <TooltipTrigger asChild>
                <span
                  aria-disabled="true"
                  className="shrink-0 cursor-default whitespace-nowrap border-transparent border-b-2 pb-3 text-body-sm text-fg-subtle"
                >
                  {tab.label}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">Not built yet</TooltipContent>
            </Tooltip>
          ),
        )}
      </nav>
    </TooltipProvider>
  );
}

/** The same shape, before the request lands — so the row does not jump into place. */
export function ClientHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-3 border-line border-b px-4 pt-4 sm:px-6">
      <div className="flex items-start gap-3">
        <SidebarToggle />
        <Skeleton className="size-8 shrink-0 rounded-control" />
        <Skeleton className="mt-0.5 size-10 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="flex gap-5 pb-3">
        {TABS.map((t) => (
          <Skeleton key={t.label} className="h-4 w-16" />
        ))}
      </div>
    </header>
  );
}
