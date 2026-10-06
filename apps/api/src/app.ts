import express, { type Express } from "express";
import { auth } from "./features/auth/routes.js";
import { clientApp, join, studioJoin } from "./features/client/routes.js";
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
  app.use(loadSession);

  app.use("/health", health);
  app.use("/auth", auth);
  app.use("/studios", studios);
  // mergeParams so :studioId from the mount point reaches the router's handlers
  app.use("/studios/:studioId", studioJoin);
  app.use("/join", join);
  // Client app. The studio is always in the path — never the session. See ADR 0014.
  app.use("/c", clientApp);

  // Registered last — it owns all error-to-HTTP mapping.
  app.use(errorHandler);

  return app;
}
