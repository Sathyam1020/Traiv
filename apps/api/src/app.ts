import express, { type Express } from "express";
import { auth } from "./features/auth/routes.js";
import { join, studioJoin } from "./features/client/routes.js";
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
  app.use("/studio", studioJoin);
  app.use("/join", join);

  // Registered last — it owns all error-to-HTTP mapping.
  app.use(errorHandler);

  return app;
}
