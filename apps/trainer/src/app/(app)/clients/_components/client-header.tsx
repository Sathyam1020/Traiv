"use client";

import { Button } from "@traiv/ui/components/button";
import { ClientAvatar } from "@traiv/ui/components/client-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@traiv/ui/components/dropdown-menu";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { Skeleton } from "@traiv/ui/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@traiv/ui/components/tooltip";
import {
  Apple,
  ArrowLeft,
  BarChart,
  Cake,
  ChevronDown,
  CircleCheckBig,
  CreditCard,
  Dumbbell,
  FileText,
  type Icon,
  Info,
  LayoutGrid,
  MessageSquareText,
  NotebookPen,
  Ruler,
  Settings,
  Sparkles,
  VenusAndMars,
} from "@traiv/ui/icons";
import { cn } from "@traiv/ui/lib/cn";
import Link from "next/link";
import type { ClientProfile, RosterStatus, Tag } from "@/lib/api";
import { useUpdateClient } from "@/lib/query";
import { TagPicker } from "./tag-picker";

const STATUS_LABEL: Record<ClientProfile["status"], string> = {
  active: "Active",
  paused: "Paused",
  archived: "Ended",
};

/**
 * The views of one client.
 *
 * Only Overview exists. The rest are here because they are the shape of the screen and
 * each names something real — `workout_plan`, `diet_plan`, `body_metric`, `vault`,
 * payments, automations — rather than a wishlist. They read as not-yet rather than as
 * clickable and empty: a tab that opens onto nothing is what makes a product feel
 * hollow, a tab that says "not built" does not.
 */
const TABS = [
  { label: "Overview", icon: LayoutGrid, ready: true },
  { label: "Development", icon: BarChart, ready: false },
  { label: "Nutrition", icon: Apple, ready: false },
  // ADR 0024: a client's own workout programmes. Flipped on now that the tab has a
  // real screen behind it — see `ClientWorkouts`.
  { label: "Workouts", icon: Dumbbell, ready: true },
  { label: "Vault", icon: FileText, ready: false },
  { label: "Payment", icon: CreditCard, ready: false },
  { label: "Automations", icon: Sparkles, ready: false },
  { label: "Settings", icon: Settings, ready: false },
] as const;

type TabLabel = (typeof TABS)[number]["label"];

/** Chat, Tasks, Notes, Info — none of them built, all of them saying which. */
const ACTIONS: { label: string; icon: Icon; why: string }[] = [
  { label: "Chat", icon: MessageSquareText, why: "Messaging is not built yet." },
  { label: "Tasks", icon: CircleCheckBig, why: "Tasks are not built yet." },
  { label: "Notes", icon: NotebookPen, why: "Notes are not built yet." },
  { label: "Info", icon: Info, why: "The full client record is not built yet." },
];

/**
 * The top of one client's screen.
 *
 * Two kinds of fact live here and they come from different places. The relationship —
 * status, coach, tags — is on the `client` row. The person — age, sex, height — is on
 * the `user`, because somebody answers the intake once however many coaches they have.
 * A client the coach typed in has no user at all, so that half is replaced by what is
 * actually true: they have not joined yet.
 *
 * Weight is deliberately absent from this line. It is the headline figure on the
 * overview directly below, and saying it twice makes the second one look like a
 * different number.
 */
export function ClientHeader({
  studioId,
  client,
  tags,
  activeTab,
  onTabChange,
}: {
  studioId: string | null;
  client: ClientProfile;
  tags: Tag[];
  /** Which `ready` tab is open. Omit to render the header with no active tab logic. */
  activeTab?: TabLabel;
  onTabChange?: (tab: TabLabel) => void;
}) {
  return (
    // Sticky against the panel's scroll container, which the shell owns. It needs an
    // opaque `bg-panel` or the content scrolls through it; it does NOT need its own
    // radius, because that container is `overflow-hidden` and clips the corners for it.
    <header className="sticky top-0 z-20 flex shrink-0 flex-col bg-panel">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 sm:px-6">
        <SidebarToggle />

        <Link
          href="/clients"
          aria-label="Back to the roster"
          className="-ml-0.5 flex size-8 shrink-0 items-center justify-center rounded-control text-fg-subtle transition-colors hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <span className="shrink-0">
          <ClientAvatar id={client.id} name={client.name} size={56} />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="truncate font-semibold text-display tracking-[-0.02em]">
              {client.name}
            </h1>
            <StatusPill studioId={studioId} client={client} />
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <Facts client={client} />
            <TagPicker studioId={studioId} client={client} tags={tags} />
          </div>
        </div>

        <Actions />
      </div>

      <Tabs active={activeTab} onChange={onTabChange} />
    </header>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The status, and the way to change it.
 *
 * A pill that opens the transitions legal for the state it is in, rather than a badge
 * plus a separate overflow menu. The status IS the control — which is both what the
 * reference does and one fewer thing on the row.
 */
function StatusPill({ studioId, client }: { studioId: string | null; client: ClientProfile }) {
  const update = useUpdateClient(studioId);
  const paused = client.status === "paused";
  const ended = client.status === "archived";

  const set = (status: RosterStatus) => update.mutate({ clientId: client.id, status });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Status: ${STATUS_LABEL[client.status]}. Change it`}
          className={cn(
            "flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 font-medium text-body-sm transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus",
            client.status === "active"
              ? "border-success/30 bg-success-subtle text-success hover:bg-success-subtle/70"
              : "border-line bg-sunken text-fg-muted hover:bg-hover",
          )}
        >
          {STATUS_LABEL[client.status]}
          <ChevronDown className="size-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => set(paused || ended ? "active" : "paused")}>
          {paused ? "Resume coaching" : ended ? "Start again" : "Pause coaching"}
        </DropdownMenuItem>
        {ended ? null : (
          <DropdownMenuItem variant="destructive" onSelect={() => set("archived")}>
            End coaching
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Age, sex and height — or the honest reason there are none.
 *
 * Age comes from a birth *year*, which is all the intake asks for: nobody needs a
 * client's birthday to work out a calorie target. It is right to within a year.
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
  const facts: { icon: Icon; value: string }[] = [];

  if (intake?.birthYear) {
    facts.push({ icon: Cake, value: `${year - intake.birthYear} years old` });
  }
  if (intake?.sex && intake.sex !== "undisclosed") {
    facts.push({ icon: VenusAndMars, value: intake.sex === "male" ? "Male" : "Female" });
  }
  if (intake?.heightCm) facts.push({ icon: Ruler, value: `${Math.round(intake.heightCm)} cm` });

  if (facts.length === 0) {
    return <p className="text-body-sm text-fg-muted">Intake not filled in yet</p>;
  }

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-fg-muted">
      {facts.map(({ icon: Glyph, value }) => (
        <span key={value} className="flex items-center gap-1.5 whitespace-nowrap">
          <Glyph aria-hidden="true" className="size-4 shrink-0 text-fg-subtle" />
          {value}
        </span>
      ))}
    </p>
  );
}

function Actions() {
  return (
    <TooltipProvider delayDuration={200}>
      {/* Hidden below `md`, where four of them and the name cannot share a row. */}
      <div className="hidden shrink-0 items-center gap-2 md:flex">
        {ACTIONS.map(({ label, icon: Glyph, why }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <span>
                <Button variant="outline" size="sm" disabled className="rounded-full px-4">
                  <Glyph className="size-4" />
                  {label}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">{why}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

/**
 * The tab row, behind a full-width rule.
 *
 * The rule runs edge to edge rather than stopping at the content, so the header reads
 * as one band and the tabs as the thing that divides it from the page.
 */
function Tabs({ active, onChange }: { active?: TabLabel; onChange?: (tab: TabLabel) => void }) {
  return (
    <TooltipProvider delayDuration={200}>
      <nav className="flex gap-1 overflow-x-auto border-line border-b px-4 sm:px-6">
        {TABS.map(({ label, icon: Glyph, ready }) =>
          ready ? (
            <button
              key={label}
              type="button"
              aria-current={active === label ? "page" : undefined}
              onClick={() => onChange?.(label)}
              className={cn(
                "-mb-px flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 px-2 pt-1 pb-3 font-medium text-body-sm transition-colors",
                active === label
                  ? "border-fg text-fg"
                  : "border-transparent text-fg-subtle hover:text-fg",
              )}
            >
              <Glyph className="size-4" aria-hidden="true" />
              {label}
            </button>
          ) : (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <span
                  aria-disabled="true"
                  className="-mb-px flex shrink-0 cursor-default items-center gap-2 whitespace-nowrap border-transparent border-b-2 px-2 pt-1 pb-3 text-body-sm text-fg-subtle"
                >
                  <Glyph className="size-4" aria-hidden="true" />
                  {label}
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
    <header className="flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 sm:px-6">
        <SidebarToggle />
        <Skeleton className="size-8 shrink-0 rounded-control" />
        <Skeleton className="size-14 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-80 max-w-full" />
        </div>
      </div>
      <div className="flex gap-5 border-line border-b px-4 pb-3 sm:px-6">
        {TABS.map((t) => (
          <Skeleton key={t.label} className="h-5 w-20" />
        ))}
      </div>
    </header>
  );
}
