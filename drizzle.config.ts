import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { serverConfig } from "./src/config.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: serverConfig.DB_URL!,
  },
});
