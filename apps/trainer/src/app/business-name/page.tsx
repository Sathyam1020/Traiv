import { Suspense } from "react";
import { BusinessNameForm } from "@/components/auth/business-name-form";

export const metadata = { title: "Name your business · Traiv" };

/**
 * Just the card, centered — no `AuthAside`. A one-step detour for someone already
 * signed in, not a first impression to sell the product with.
 */
export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <Suspense>
        <BusinessNameForm />
      </Suspense>
    </div>
  );
}
