// This file is for testing only, we probably migrate to it in the near future
import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV } = process.env;
