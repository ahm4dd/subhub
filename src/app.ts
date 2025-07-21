import express from "express";
import cookieParser from "express";
import { serverConfig } from "./config.js";
import userRouter from "./routes/user.routes.ts";
import authRouter from "./routes/auth.routes.ts";
import subscriptionRouter from "./routes/subscription.routes.ts";
import { middlewareError } from "./middlewares/error.middleware.ts";
import { arcjetMiddleware } from "./middlewares/arcjet.middeware.ts";
import tokenRouter from "./routes/token.routes.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/tokens", tokenRouter);

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
