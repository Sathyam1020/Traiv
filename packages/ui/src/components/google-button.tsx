"use client";

import { Button } from "@traiv/ui/components/button";
import { GoogleMark } from "@traiv/ui/components/google-mark";
import { toast } from "@traiv/ui/components/sonner";

/**
 * Sign in with Google, shown whether or not it is configured.
 *
 * It used to render only when the API reported credentials, which meant nobody ever saw
 * it — the credentials have never existed. Hiding it also hides the fact that it is
 * coming, and people look for it. So it is always here, and says so plainly when it
 * cannot work rather than failing after the click.
 */
export function GoogleButton({
  enabled,
  href,
  label,
}: {
  enabled: boolean;
  href: string;
  label: string;
}) {
  if (enabled) {
    return (
      <Button asChild variant="outline" className="h-11 w-full gap-2.5 font-medium">
        <a href={href}>
          <GoogleMark />
          {label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full gap-2.5 font-medium"
      onClick={() =>
        toast("Google sign-in is coming soon", {
          description: "Use your phone number for now — it's the same account either way.",
        })
      }
    >
      <GoogleMark />
      {label}
    </Button>
  );
}
