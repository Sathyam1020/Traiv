import { MobileBar } from "@traiv/ui/components/shell/mobile-bar";
import { Sidebar } from "@traiv/ui/components/shell/sidebar";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * One destination in an app's navigation.
 *
 * Apps own their own array. The shell renders whatever it is handed, which makes adding a
 * tab a one-line change on the day the screen behind it exists — rather than shipping
 * empty tabs and waiting, which `.ai/product/competitor-client-apps.md` found is how every
 * competitor's client app ends up feeling hollow.
 */
export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * The frame for an app with real navigation: trainer and client.
 *
 * A fixed sidebar from `lg` up, a floating capsule bar below it, and content padded clear
 * of both. The two never appear together — `lg` is the single line, and it is in one place
 * here rather than guessed at per app.
 *
 * `brand` and `account` are slots because every app has its own session and logout hooks,
 * and the coach's needs a studio switcher the client's has no concept of. Everything that
 * is genuinely the same lives here; everything that differs is passed in.
 *
 * The layout rendering this has to be a client component. `NavItem.icon` is a component
 * reference, and functions cannot cross the server→client boundary — a server layout
 * passing `nav` in fails at prerender with "Functions cannot be passed directly to Client
 * Components", which reads like a bug in the shell and is not.
 */
export function AppShell({
  nav,
  sidebarBrand,
  sidebarAccount,
  header,
  children,
}: {
  nav: readonly NavItem[];
  /** Top of the sidebar — wordmark, theme toggle, whatever the app switches between. */
  sidebarBrand: ReactNode;
  /** Bottom of the sidebar — who is signed in, and the way out. */
  sidebarAccount: ReactNode;
  /** Shown below `lg` only; above it everything lives in the sidebar. */
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <Sidebar nav={nav} brand={sidebarBrand} account={sidebarAccount} />
      {header}
      {/* Left padding clears the fixed sidebar; bottom padding clears the floating bar. */}
      <main className="px-4 pt-4 pb-28 sm:px-6 lg:pr-6 lg:pb-8 lg:pl-[17.5rem]">{children}</main>
      <MobileBar nav={nav} />
    </div>
  );
}
