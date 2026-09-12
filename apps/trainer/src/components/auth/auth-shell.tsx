import { AuthAside } from "@/components/auth/auth-aside";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas p-3 sm:p-4 lg:p-5">
      <div className="grid min-h-[calc(100dvh-1.5rem)] grid-cols-1 gap-5 sm:min-h-[calc(100dvh-2rem)] lg:min-h-[calc(100dvh-2.5rem)] lg:grid-cols-2">
        <AuthAside />
        <main className="flex items-center justify-center px-2 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
