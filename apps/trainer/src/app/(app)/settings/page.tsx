import { Page } from "@traiv/ui/components/shell/page";
import { JoinCard } from "./_components/join-card";

export const metadata = { title: "Settings · Traiv" };

export default function SettingsPage() {
  // Narrower than the roster on purpose: settings is read top to bottom, and
  // typography.md keeps a reading measure at 65-75 characters.
  return (
    <Page className="max-w-3xl gap-6 py-2">
      <h1 className="text-display font-semibold tracking-[-0.025em]">Settings</h1>
      <JoinCard />
    </Page>
  );
}
