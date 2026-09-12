import { createDb } from "@traiv/db";
import { env } from "./env.js";

export const db = createDb(env.DATABASE_URL);
