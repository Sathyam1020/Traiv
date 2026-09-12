import { JoinCard } from "./_components/join-card";

export const metadata = { title: "Settings · Traiv" };

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-2">
      <h1 className="text-display font-semibold tracking-[-0.025em]">Settings</h1>
      <JoinCard />
    </div>
  );
}
