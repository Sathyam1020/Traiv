import { Logo } from "@traiv/ui/components/logo";

/**
 * The app has no front door of its own. A client arrives through their coach's link and
 * nothing else — there is no public signup, because an account with no coach can do
 * nothing at all. Saying so plainly beats a signup form that leads nowhere.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <Logo size={44} />
      <div className="flex max-w-[30ch] flex-col gap-2">
        <h1 className="text-heading font-semibold tracking-[-0.02em]">Ask your coach for a link</h1>
        <p className="text-body-sm text-fg-muted">
          Traiv opens from the link or QR code your coach shares with you. That link is what
          connects your account to them.
        </p>
      </div>
    </main>
  );
}
