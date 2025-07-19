import express from "express";
import cookieParser from "express";
import { serverConfig } from "./config.js";
import userRouter from "./routes/user.routes.ts";
import authRouter from "./routes/auth.routes.ts";
import subscriptionRouter from "./routes/subscription.routes.ts";
import { middlewareError } from "./middlewares/error.middleware.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to SubHub API");
});

app.use(middlewareError);

app.listen(serverConfig.PORT, serverConfig.HOSTNAME, () => {
  console.log(
    `Server running on http://${serverConfig.HOSTNAME}:${serverConfig.PORT}`,
  );
});

export default app;
