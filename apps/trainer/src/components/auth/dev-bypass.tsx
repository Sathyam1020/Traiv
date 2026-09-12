"use client";

import { ChevronDown, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDevLogin, useDevUsers } from "@/lib/query";

/**
 * Development sign-in, no code required.
 *
 * Renders only if the API answers `/auth/dev/users` — which it refuses to do in
 * production, and the API will not even boot with NODE_ENV=production and
 * AUTH_DEV_BYPASS=true together.
 */
export function DevBypass() {
  const router = useRouter();
  const { data } = useDevUsers();
  const devLogin = useDevLogin();
  const [open, setOpen] = useState(false);

  const users = data?.users ?? [];
  if (!users.length) return null;

  return (
    <div className="overflow-hidden rounded-surface border border-dashed border-line-strong bg-sunken">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left"
      >
        <TriangleAlert className="size-3.5 shrink-0 text-warning" />
        <span className="flex-1 text-caption font-medium text-fg-muted">Development sign-in</span>
        <ChevronDown
          className={`size-3.5 text-fg-subtle transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <ul className="border-t border-line">
          {users.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                disabled={devLogin.isPending}
                onClick={async () => {
                  await devLogin.mutateAsync(u.id);
                  router.push("/dashboard");
                }}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2 text-left transition-colors hover:bg-hover disabled:opacity-60"
              >
                <span className="min-w-0 flex-1 truncate text-body-sm">{u.name || "No name"}</span>
                <span className="shrink-0 text-caption tabular-nums text-fg-subtle">
                  {devLogin.isPending && devLogin.variables === u.id ? "…" : u.phone}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
