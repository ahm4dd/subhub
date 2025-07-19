import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { serverConfig } from "../config.ts";

export const db = drizzle(serverConfig.DB_URL);
