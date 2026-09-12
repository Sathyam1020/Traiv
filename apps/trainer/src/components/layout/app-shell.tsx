import { MobileBar } from "@/components/layout/mobile-bar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { Sidebar } from "@/components/layout/sidebar";

/** Floating sidebar from lg up, floating glass bar below it. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <Sidebar />
      <MobileHeader />
      {/* Left padding clears the fixed sidebar; bottom padding clears the mobile bar. */}
      <main className="px-4 pt-4 pb-28 sm:px-6 lg:pb-8 lg:pl-[17.5rem] lg:pr-6">{children}</main>
      <MobileBar />
    </div>
  );
}
