import { Page } from "@traiv/ui/components/shell/page";
import { SidebarToggle } from "@traiv/ui/components/shell/page-header";
import { StickyPageHeader } from "@traiv/ui/components/shell/sticky-page-header";
import { InstallAppCard } from "./_components/install-app-card";
import { JoinCard } from "./_components/join-card";

export const metadata = { title: "Settings · Traiv" };

export default function SettingsPage() {
  // Narrower than the roster on purpose: settings is read top to bottom, and
  // typography.md keeps a reading measure at 65-75 characters.
  return (
    <Page className="max-w-3xl gap-6 pt-8">
      <StickyPageHeader className="-mt-8 pt-8">
        <div className="flex items-center gap-3">
          <SidebarToggle />
          <h1 className="text-display font-medium">Settings</h1>
        </div>
      </StickyPageHeader>
      <JoinCard />
      <InstallAppCard />
    </Page>
  );
}
