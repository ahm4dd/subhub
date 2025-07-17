import process from "process";
process.loadEnvFile(`.env.${process.env.NODE_ENV || "development"}.local`);

type ServerConfig = {
  HOSTNAME: string;
  PORT;
};

export const serverConfig: ServerConfig = {
  HOSTNAME: process.env.HOSTNAME || "127.0.0.1",
  PORT: process.env.PORT || 3000,
};
