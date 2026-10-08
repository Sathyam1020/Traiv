import { Activity, Apple, CalendarDays, Dumbbell, Inbox, LayoutGrid, Users } from "lucide-react";

/**
 * The product, tilted, with the pieces that matter floating off it.
 *
 * It is a mock rather than a screenshot on purpose: the real screens are mid-build, and a
 * screenshot of a half-finished roster sells nothing. Every number on it is plausible and
 * none of it claims to be a real client — "Priya Nair" is as obviously a placeholder as
 * "Rodger Struck" is on the page this takes its shape from.
 *
 * Built from divs rather than an image so it stays sharp on every display, reads at 360px
 * by dropping the tilt, and costs no download. The perspective is one transform on the
 * frame; the cards in front sit outside it so they stay flat and legible.
 */
export function HeroDashboard() {
  return (
    <div
      aria-hidden="true"
      className="relative select-none"
      // Decorative. Everything in here is said in the copy beside it.
    >
      <div className="relative [perspective:1800px]">
        <div className="origin-left overflow-hidden rounded-panel border border-line bg-surface shadow-[0_24px_70px_-20px_rgb(0_0_0/0.28)] lg:[transform:rotateY(-14deg)_rotateX(5deg)_rotate(1deg)]">
          <div className="flex min-h-[26rem]">
            {/* The rail. Dark, the way every console of this kind is. */}
            <div className="hidden w-48 shrink-0 flex-col justify-between bg-contrast p-3 sm:flex">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <span className="flex size-6 items-center justify-center rounded-md bg-contrast-fg/15 text-[11px] font-bold text-contrast-fg">
                    R
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[12px] font-semibold text-contrast-fg">
                      Rahul Fitness
                    </span>
                    <span className="text-[10px] text-contrast-fg/50">Pro</span>
                  </span>
                </div>

                <Rail label="Coaching">
                  <RailItem icon={LayoutGrid} name="Today" active />
                  <RailItem icon={Users} name="Clients" />
                  <RailItem icon={Inbox} name="Inbox" />
                  <RailItem icon={CalendarDays} name="Check-ins" />
                </Rail>

                <Rail label="Build">
                  <RailItem icon={Dumbbell} name="Plans" />
                  <RailItem icon={Apple} name="Nutrition" />
                  <RailItem icon={Activity} name="Exercises" />
                </Rail>
              </div>

              <div className="flex items-center gap-2 border-t border-contrast-fg/10 px-2 pt-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-contrast-fg/15 text-[10px] font-semibold text-contrast-fg">
                  RD
                </span>
                <span className="text-[11px] text-contrast-fg/70">Rahul D.</span>
              </div>
            </div>

            {/* The content. */}
            <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-sunken text-[11px] font-semibold text-fg-muted">
                  PN
                </span>
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-semibold">Priya Nair</span>
                    <span className="rounded-full bg-success-subtle px-1.5 py-0.5 text-[10px] font-medium text-success">
                      Active
                    </span>
                  </div>
                  <span className="text-[11px] text-fg-subtle">Week 3 of 8 · Lose fat</span>
                </div>
              </div>

              <div className="flex gap-4 border-b border-line text-[11px]">
                {["Overview", "Plan", "Nutrition", "Check-ins", "Progress"].map((t, i) => (
                  <span
                    key={t}
                    className={
                      i === 0
                        ? "border-b-2 border-fg pb-2 font-medium text-fg"
                        : "pb-2 text-fg-subtle"
                    }
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <Stat label="Trained" value="4" of="/ 4" trend="On plan" up />
                <Stat label="Weight" value="63.4" of="kg" trend="−1.8 kg" up />
                <Stat label="Check-in" value="5" of="/ 5" trend="Sunday" />
              </div>

              <div className="rounded-surface border border-line p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-fg-muted">Weight</span>
                  <span className="text-[10px] text-fg-subtle">8 weeks</span>
                </div>
                <Chart />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-subtle">
                  Today
                </span>
                {[
                  { name: "Lower body — push", meta: "5 exercises · 45 min" },
                  { name: "Breakfast · Poha, 1 katori", meta: "250 kcal · 5 g protein" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-control border border-line px-3 py-2"
                  >
                    <span className="truncate text-[11px] font-medium">{row.name}</span>
                    <span className="shrink-0 text-[10px] text-fg-subtle">{row.meta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In front of the frame, flat, so they stay readable at the tilt. */}
      <div className="absolute -top-5 -left-4 hidden w-[12.5rem] rounded-surface border border-line bg-surface p-4 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.25)] xl:block">
        <div className="flex items-center gap-1.5">
          <Apple className="size-3.5 text-fg-subtle" />
          <span className="text-[11px] font-medium">Today's target</span>
        </div>
        <p className="mt-2 font-display text-[1.75rem] font-semibold tabular-nums leading-none tracking-[-0.03em]">
          1,740
          <span className="ml-1 text-[11px] font-medium text-fg-subtle">kcal</span>
        </p>
        <div className="mt-3 flex flex-col gap-1.5">
          {[
            { k: "Protein", v: "136 g", w: "78%" },
            { k: "Carbs", v: "190 g", w: "62%" },
            { k: "Fat", v: "48 g", w: "40%" },
          ].map((m) => (
            <div key={m.k} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-fg-muted">{m.k}</span>
                <span className="text-[10px] font-medium tabular-nums">{m.v}</span>
              </div>
              <span className="h-1 w-full overflow-hidden rounded-full bg-sunken">
                <span className="block h-full rounded-full bg-fg" style={{ width: m.w }} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-3 bottom-10 hidden w-[11.5rem] rounded-surface border border-line bg-surface p-4 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.25)] lg:block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-subtle">
          Needs you
        </span>
        <div className="mt-2.5 flex flex-col gap-2.5">
          {[
            { n: "Arjun M.", d: "9 days" },
            { n: "Kavya S.", d: "6 days" },
          ].map((c) => (
            <div key={c.n} className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sunken text-[9px] font-semibold text-fg-muted">
                {c.n.slice(0, 1)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-[11px] font-medium">{c.n}</span>
                <span className="text-[10px] text-danger">No session · {c.d}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Rail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="px-2 pb-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-contrast-fg/40">
        {label}
      </span>
      {children}
    </div>
  );
}

function RailItem({
  icon: Icon,
  name,
  active,
}: {
  icon: typeof Users;
  name: string;
  active?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
        active ? "bg-contrast-fg/12 font-medium text-contrast-fg" : "text-contrast-fg/55"
      }`}
    >
      <Icon className="size-3.5 shrink-0" />
      {name}
    </span>
  );
}

function Stat({
  label,
  value,
  of,
  trend,
  up,
}: {
  label: string;
  value: string;
  of: string;
  trend: string;
  up?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-surface border border-line p-3">
      <span className="text-[10px] text-fg-subtle">{label}</span>
      <span className="font-display text-[1.125rem] font-semibold tabular-nums leading-none tracking-[-0.02em]">
        {value}
        <span className="ml-0.5 text-[10px] font-medium text-fg-subtle">{of}</span>
      </span>
      <span className={`text-[10px] ${up ? "text-success" : "text-fg-subtle"}`}>{trend}</span>
    </div>
  );
}

/** Eight weeks of a downward trend, drawn once. No library for twelve points. */
function Chart() {
  const points = [68, 67.6, 67.1, 66.2, 65.9, 65.1, 64.2, 63.4];
  const w = 300;
  const h = 64;
  const min = 62.5;
  const max = 68.5;
  const x = (i: number) => (i / (points.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / (max - min)) * h;

  const line = points.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${w} ${h}`}
      className="mt-2 h-14 w-full"
      preserveAspectRatio="none"
    >
      <path d={area} className="fill-sunken" />
      <path d={line} fill="none" className="stroke-fg" strokeWidth={1.75} strokeLinecap="round" />
      <circle cx={x(points.length - 1)} cy={y(63.4)} r={3} className="fill-fg" />
    </svg>
  );
}
