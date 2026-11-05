"use client";
import { Button } from "@traiv/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@traiv/ui/components/dialog";
import { ChevronRight, CircleAlert, FileText, LogOut } from "@traiv/ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogout } from "@/lib/query/use-auth";
import { APP_VERSION } from "@/lib/version";
export function ProfileFooter() {
  const router = useRouter();
  const logout = useLogout();
  const [confirm, setConfirm] = useState(false);
  const rowClass =
    "client-tappable flex min-h-14 w-full items-center gap-4 px-4 py-4 text-left text-sm font-medium";
  return (
    <>
      <section className="px-4 pt-7">
        <h2 className="mb-4 text-sm font-medium text-fg-muted">Traiv</h2>
        <div className="divide-y divide-line overflow-hidden rounded-2xl bg-surface">
          {[
            { href: "/you/legal/terms", label: "Terms and Conditions" },
            { href: "/you/legal/privacy", label: "Privacy Policy" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className={rowClass}>
              <FileText className="size-5 text-fg-subtle" />
              {label}
              <ChevronRight className="ml-auto size-4 text-fg-subtle" />
            </Link>
          ))}
        </div>
      </section>
      <section aria-label="Support and account" className="px-4 pt-7">
        <div className="divide-y divide-line overflow-hidden rounded-2xl bg-surface">
          <Link href="/you/report" className={rowClass}>
            <CircleAlert className="size-5 text-fg-subtle" />
            Report an issue
            <ChevronRight className="ml-auto size-4 text-fg-subtle" />
          </Link>
          <button
            type="button"
            className={`${rowClass} text-danger`}
            onClick={() => {
              logout.reset();
              setConfirm(true);
            }}
          >
            <LogOut className="size-5" />
            Logout
            <ChevronRight className="ml-auto size-4 text-fg-subtle" />
          </button>
        </div>
      </section>
      <p className="px-4 pt-8 pb-3 text-center text-xs text-fg-subtle">Version {APP_VERSION}</p>
      <Dialog
        open={confirm}
        onOpenChange={(open) => {
          if (!logout.isPending) setConfirm(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out of Traiv?</DialogTitle>
            <DialogDescription>
              You can sign in again to access your coaching and saved progress.
            </DialogDescription>
          </DialogHeader>
          {logout.isError && (
            <p role="alert" className="mt-4 text-sm text-danger">
              Couldn't log out. Please try again.
            </p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" disabled={logout.isPending} onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              disabled={logout.isPending}
              onClick={() => logout.mutate(undefined, { onSuccess: () => router.replace("/") })}
            >
              {logout.isPending ? "Logging out…" : "Log out"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
