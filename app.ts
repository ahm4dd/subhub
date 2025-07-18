import express from "express";
import { serverConfig } from "./config.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to SubHub API");
});

app.listen(serverConfig.PORT, serverConfig.HOSTNAME, () => {
  console.log(
    `Server running on http://${serverConfig.HOSTNAME}:${serverConfig.PORT}`,
  );
});

export default app;
