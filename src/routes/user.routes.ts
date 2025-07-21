import { Router } from "express";
import { createUserHandler, getAllUsersHandler, getUserDetails } from "../controllers/user.controller.ts";

const userRouter = Router();

userRouter.get("/", getAllUsersHandler);

userRouter.get("/:id", getUserDetails);
userRouter.post("/", createUserHandler);
userRouter.put("/:id", (req, res) => {
  res.send({ title: "UPDATE user" });
});
userRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETE user" });
});

export default userRouter;
