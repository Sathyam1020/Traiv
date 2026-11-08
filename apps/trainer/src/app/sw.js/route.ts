import { workerSource } from "@/lib/pwa/worker-source";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(workerSource(process.env.NODE_ENV !== "production"), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "Service-Worker-Allowed": "/",
    },
  });
}
