import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata = { title: "Sign in · Traiv" };

export default function Page() {
  return (
    <AuthShell>
      <Suspense>
        <AuthForm mode="signin" />
      </Suspense>
    </AuthShell>
  );
}
