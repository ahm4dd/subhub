import process from "process";
process.loadEnvFile(`.env.${process.env.NODE_ENV || "development"}.local`);

type ServerConfig = {
  HOSTNAME: string;
  PORT: number;
  DB_URL: string;
  JWT_SECRET: string;
  JWT_SECRET_ADMIN: string;
  ARCJET_KEY: string;
  ARCJET_ENV: string;
};

export const serverConfig: ServerConfig = {
  HOSTNAME: process.env.HOSTNAME || "127.0.0.1",
  PORT: (process.env.PORT as unknown as number) || 3000,
  DB_URL: process.env.DB_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_SECRET_ADMIN: process.env.JWT_SECRET_ADMIN || "",
  ARCJET_KEY: process.env.ARCJET_KEY || "",
  ARCJET_ENV: process.env.ARCJET_ENV || "",
};
