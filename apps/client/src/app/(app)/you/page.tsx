"use client";

import { Button } from "@traiv/ui/components/button";
import { Page } from "@traiv/ui/components/shell/page";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useCoaches, useIntake, useSession } from "@/lib/query";

const GOAL: Record<string, string> = {
  lose_fat: "Lose fat",
  build_muscle: "Build muscle",
  get_stronger: "Get stronger",
  maintain: "Maintain weight",
  improve_fitness: "Improve fitness",
  general_health: "General health",
};

const DIET: Record<string, string> = {
  vegetarian: "Vegetarian",
  eggetarian: "Vegetarian, eggs fine",
  non_vegetarian: "Non-vegetarian",
  vegan: "Vegan",
  jain: "Jain",
};

const ACTIVITY: Record<string, string> = {
  sedentary: "Mostly sitting",
  light: "Lightly active",
  moderate: "On your feet a fair bit",
  very: "Active most of the day",
  extra: "Very physical work",
};

const EXPERIENCE: Record<string, string> = {
  new: "New to this",
  some: "Some experience",
  experienced: "Experienced",
};

const EQUIPMENT: Record<string, string> = {
  full_gym: "Full gym",
  home_basics: "Home setup",
  dumbbells: "Dumbbells",
  bands: "Bands",
  bodyweight: "Bodyweight",
};

const DAY: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const HEALTH: Record<string, string> = {
  knee: "Knees",
  lower_back: "Lower back",
  shoulder: "Shoulders",
  diabetes: "Diabetes",
  blood_pressure: "Blood pressure",
  thyroid: "Thyroid",
  pcos: "PCOS",
  pregnancy: "Pregnant or postpartum",
};

/**
 * What the client told us, given back to them.
 *
 * Until now these answers went one way: into a database, for a coach. Somebody who typed
 * their weight and what hurts has every right to see it, check it and change it — and
 * being able to find it is also what makes the health note trustworthy rather than
 * something that disappeared into an app.
 *
 * No calorie target here either. It arrives with the diet plan, for the reason in
 * ADR 0019: a number with no food around it invites acting on it alone.
 */
export default function YouPage() {
  const session = useSession();
  const signedIn = Boolean(session.data?.user);
  const coaches = useCoaches(signedIn);
  const studioId = coaches.data?.[0]?.studio.id ?? null;
  const intake = useIntake(studioId);

  if (session.isPending || coaches.isPending || intake.isPending) return <Loading />;

  const i = intake.data?.intake ?? null;
  const weight = intake.data?.weightKg ?? null;
  const user = session.data?.user;

  return (
    <Page className="gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-display font-semibold tracking-[-0.025em]">{user?.name || "You"}</h1>
        <p className="text-body-sm tabular-nums text-fg-muted">{user?.phone}</p>
      </header>

      {intake.isError || !i ? (
        <section className="flex flex-col items-start gap-3 rounded-surface border border-line bg-surface p-5">
          <p className="text-body-sm text-fg-muted">
            Couldn't load your answers. Check your connection and try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => void intake.refetch()}>
            Try again
          </Button>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <Card
            title="Goal"
            studioId={studioId}
            rows={[
              ["Working towards", label(i.goal, GOAL)],
              ["Goal weight", i.targetWeightKg ? `${i.targetWeightKg} kg` : null],
            ]}
          />
          <Card
            title="You"
            studioId={studioId}
            rows={[
              ["Age", i.birthYear ? `${new Date().getFullYear() - i.birthYear}` : null],
              ["Height", i.heightCm ? `${Math.round(i.heightCm)} cm` : null],
              ["Starting weight", weight ? `${weight} kg` : null],
            ]}
          />
          <Card
            title="Training"
            studioId={studioId}
            rows={[
              ["Your days", label(i.dailyActivity, ACTIVITY)],
              ["Experience", label(i.experience, EXPERIENCE)],
              [
                "Each week",
                i.daysPerWeek
                  ? `${i.daysPerWeek} days${i.sessionMinutes ? `, ${i.sessionMinutes} min` : ""}`
                  : null,
              ],
              ["Equipment", list(i.equipment, EQUIPMENT)],
            ]}
          />
          <Card
            title="Food"
            studioId={studioId}
            rows={[
              ["Diet", label(i.diet, DIET)],
              ["Meals a day", i.mealsPerDay ? String(i.mealsPerDay) : null],
              ["Allergies", i.allergies || null],
              ["Won't eat", i.dislikes || null],
            ]}
          />
          <Card
            title="Your coach should know"
            studioId={studioId}
            rows={[
              ["Flagged", list(i.healthFlags, HEALTH) ?? "Nothing flagged"],
              ["Note", i.healthNote || null],
            ]}
          />
          <Card
            title="When you train"
            studioId={studioId}
            rows={[
              ["Days", list(i.trainingDays, DAY)],
              ["Time of day", i.preferredTime ? cap(i.preferredTime) : null],
            ]}
          />
        </div>
      )}
    </Page>
  );
}

function label(value: string | null, labels: Record<string, string>): string | null {
  if (!value) return null;
  return labels[value] ?? value;
}

function list(values: string[] | null, labels: Record<string, string>): string | null {
  if (!values?.length) return null;
  return values.map((v) => labels[v] ?? v).join(", ");
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Card({
  title,
  rows,
  studioId,
}: {
  title: string;
  rows: [string, string | null][];
  studioId: string | null;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-surface border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-caption font-semibold uppercase tracking-[0.07em] text-fg-subtle">
          {title}
        </h2>
        {studioId ? (
          <Link
            href={`/intake/${studioId}`}
            aria-label={`Change ${title.toLowerCase()}`}
            className="cursor-pointer rounded-control p-1 text-fg-subtle transition-colors hover:bg-hover hover:text-fg"
          >
            <Pencil className="size-3.5" />
          </Link>
        ) : null}
      </div>

      <dl className="flex flex-col gap-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 text-body-sm text-fg-muted">{label}</dt>
            {/* A gap is shown rather than hidden: it is what the coach is missing too. */}
            <dd
              className={`min-w-0 text-right text-body-sm ${value ? "text-fg" : "text-fg-subtle"}`}
            >
              {value ?? "Not set"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Loading() {
  return (
    <Page className="gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, n) => n).map((n) => (
          <Skeleton key={n} className="h-40 w-full rounded-surface" />
        ))}
      </div>
    </Page>
  );
}
