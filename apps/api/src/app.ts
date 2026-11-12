import express, { type Express } from "express";
import { platformHealth } from "./features/admin/platform-health.js";
import { productAnalytics } from "./features/admin/product-analytics.js";
import { admin } from "./features/admin/routes.js";
import { recordOperationalEvent } from "./features/analytics/operational.js";
import { analytics } from "./features/analytics/routes.js";
import { auth } from "./features/auth/routes.js";
import { clientApp, join, studioJoin } from "./features/client/routes.js";
import { endorse } from "./features/endorse/routes.js";
import { marketingAdmin } from "./features/marketing/admin.js";
import { marketing } from "./features/marketing/routes.js";
import { studios } from "./features/studio/routes.js";
import { cors } from "./middleware/cors.js";
import { errorHandler } from "./middleware/error.js";
import { loadSession } from "./middleware/session.js";
import { health } from "./routes/health.js";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(cors);
  app.use(express.json({ limit: "1mb" }));
  // Stamped before anything else runs, so the error handler can compute how long a
  // request was in flight even when the error happens on the way in (bad JSON, a
  // middleware throwing) rather than inside a route handler.
  app.use((req, res, next) => {
    res.locals.startedAt = Date.now();
    // `finish`, not `close` — fires once the response is actually sent, success or
    // failure alike, and is what gives System Health's p50/p95 a real latency
    // distribution rather than just the failures `errorHandler` separately records.
    // `/health` is excluded: a liveness probe polled every few seconds would otherwise
    // swamp this with rows that answer nothing about the product.
    if (req.path !== "/health") {
      res.on("finish", () => {
        void recordOperationalEvent({
          name: "api_request_completed",
          route: req.path,
          statusCode: res.statusCode,
          durationMs: Date.now() - (Number(res.locals.startedAt) || Date.now()),
        });
      });
    }
    next();
  });
  app.use(loadSession);

  app.use("/health", health);
  app.use("/auth", auth);
  app.use("/studios", studios);
  // mergeParams so :studioId from the mount point reaches the router's handlers
  app.use("/studios/:studioId", studioJoin);
  app.use("/join", join);
  // Client app. The studio is always in the path — never the session. See ADR 0014.
  app.use("/c", clientApp);
  // Endorsers. Every route is scoped to the caller's own record, so there is no tenant
  // and nothing to pass — see the comment on requireStudio for why that matters.
  app.use("/e", endorse);
  // The public marketing site: the launch list, the analytics beacon and the blog.
  // No session, no tenant, nothing personal returned — see the file for why each one is
  // safe to leave open.
  app.use("/m", marketing);

  // Signed-in only — see features/analytics/service.ts for why there is no anonymous
  // product-event path (that is analytics_event's job, not this one's).
  app.use("/analytics", analytics);

  // Single administrator, named by ADMIN_EMAIL. No endpoint grants the role.
  app.use("/admin", admin);
  // Also admin-gated, in its own file because it is a different subject entirely.
  app.use("/admin", marketingAdmin);
  app.use("/admin", productAnalytics);
  app.use("/admin", platformHealth);

  // Registered last — it owns all error-to-HTTP mapping.
  app.use(errorHandler);

  return app;
}
