import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

app.listen(env.API_PORT, () => {
  console.warn(`api listening on :${env.API_PORT} (${env.NODE_ENV})`);
  if (env.AUTH_DEV_BYPASS) {
    console.warn("AUTH_DEV_BYPASS is ON — authentication is disabled. Development only.");
  }
});
