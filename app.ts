import express from "express";
import { serverConfig } from "./config.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to SubHub API");
});

app.listen(serverConfig.PORT, serverConfig.HOSTNAME, () => {
  console.log(
    `Server running on http://${serverConfig.HOSTNAME}:${serverConfig.PORT}`,
  );
});

export default app;
