"use client";
import { Button } from "@traiv/ui/components/button";
import { Skeleton } from "@traiv/ui/components/skeleton";
import { Bell, Check, ChevronRight, Settings, User } from "@traiv/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { HistoryCard } from "@/components/check-in/history-card";
import { useActiveStudio, useSession } from "@/lib/query";
import { useProfileHistory } from "@/lib/query/use-profile-history";
import { useSettings } from "@/lib/query/use-settings";
import { InstallAppRow } from "./_components/install-app-row";
import { ProfileActions } from "./_components/profile-actions";
import { ProfileFooter } from "./_components/profile-footer";
export default function ProfilePage() {
  const session = useSession();
  const { studioId, coaches, isPending } = useActiveStudio();
  const history = useProfileHistory(studioId);
  const personal = useSettings(studioId);
  const coach = coaches.find((c) => c.studio.id === studioId);
  const user = session.data?.user;
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 pb-6">
      <header className="flex flex-col items-center bg-signal px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-6 text-signal-fg">
        <div className="flex size-20 items-center justify-center rounded-full border-4 border-current/20 bg-white/15 ring-4 ring-white/10">
          {personal.data?.user.avatarUrl ? (
            <Image
              src={personal.data.user.avatarUrl}
              alt="Your profile"
              width={80}
              height={80}
              className="size-full rounded-full object-cover"
            />
          ) : (
            <User className="size-10" />
          )}
        </div>
        <h1 className="mt-5 text-xl font-semibold">{user?.name ?? "Your profile"}</h1>
        {coach && (
          <span className="mt-2 flex items-center gap-2 rounded-lg bg-black/10 px-3 py-1 text-xs font-medium">
            <Check className="size-3.5" />
            {coach.status === "active" ? "Active member" : "Member"}
          </span>
        )}
        <dl className="mt-6 grid w-full grid-cols-3 rounded-2xl bg-black/20 py-3 text-center">
          {[
            [
              "Joined",
              coach
                ? new Date(coach.joinedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                : "—",
            ],
            ["Check-ins", history.data ? String(history.data.checkIns.length) : "—"],
            ["Workouts", history.data ? String(history.data.workouts) : "—"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs opacity-70">{label}</dt>
              <dd className="mt-1 text-base font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </header>
      <section className="px-4 pt-6">
        <h2 className="mb-4 text-sm font-medium text-fg-muted">Latest Check-in</h2>
        {isPending || history.isPending ? (
          <Skeleton className="h-32 rounded-[20px]" />
        ) : history.isError ? (
          <div role="alert" className="rounded-[20px] bg-surface p-5">
            <p className="text-sm text-fg-muted">Couldn't load your check-ins.</p>
            <Button variant="outline" className="mt-3" onClick={() => void history.refetch()}>
              Try again
            </Button>
          </div>
        ) : history.data?.checkIns[0] ? (
          <HistoryCard row={history.data.checkIns[0]} compact />
        ) : (
          <div className="rounded-[20px] bg-surface p-5">
            <p className="text-sm font-medium">No check-ins yet</p>
            <p className="mt-1 text-sm text-fg-muted">
              Your latest completed check-in will appear here.
            </p>
          </div>
        )}
      </section>
      {studioId && <ProfileActions studioId={studioId} />}
      <section className="px-4 pt-7">
        <h2 className="mb-4 text-sm font-medium text-fg-muted">Settings</h2>
        <div className="divide-y divide-line overflow-hidden rounded-2xl bg-surface">
          {[
            { href: "/you/settings/personal", label: "Personal information", Icon: User },
            { href: "/you/settings/integrations", label: "Integrations", Icon: Settings },
            { href: "/you/settings/notifications", label: "Notifications", Icon: Bell },
          ].map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="client-tappable flex min-h-14 items-center gap-4 px-4 py-4 text-sm font-medium"
            >
              <Icon className="size-5 text-fg-subtle" />
              {label}
              <ChevronRight className="ml-auto size-4 text-fg-subtle" />
            </Link>
          ))}
          <InstallAppRow />
        </div>
      </section>
      <ProfileFooter />
    </div>
  );
}
