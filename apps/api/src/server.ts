import { startCheckInReminders } from "./features/notifications/reminders.js";
import { warmDb } from "@traiv/db";
import { createApp } from "./app.js";
import { db } from "./db.js";
import { env } from "./env.js";

const app = createApp();

// Before the first request, not during it. See `warmDb`.
await warmDb(db);

app.listen(env.API_PORT, () => {
  startCheckInReminders();
  console.warn(`api listening on :${env.API_PORT} (${env.NODE_ENV})`);
  if (env.AUTH_DEV_BYPASS) {
    console.warn("AUTH_DEV_BYPASS is ON — authentication is disabled. Development only.");
  }
});
