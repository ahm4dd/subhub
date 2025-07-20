import { Router } from "express";
import { getUserDetails } from "../controllers/user.controller.ts";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send({ title: "GET all users" });
});

userRouter.get("/:id", getUserDetails);
userRouter.post("/", (req, res) => {
  res.send({ title: "CREATE new user" });
});
userRouter.put("/:id", (req, res) => {
  res.send({ title: "UPDATE user" });
});
userRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETE user" });
});

export default userRouter;
